import { Response } from 'express';
import { PrismaClient, RequestStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import fs from 'fs';
import path from 'path';

const prisma = new PrismaClient();

// Helper to check conversation access
async function checkConversationAccess(requestId: string, userId: string) {
  const introRequest = await prisma.introductionRequest.findUnique({
    where: { id: requestId },
    include: {
      requester: {
        select: { id: true, fullName: true, email: true },
      },
      smeProfile: {
        select: {
          id: true,
          companyName: true,
          userId: true,
          user: {
            select: { id: true, fullName: true, email: true },
          },
        },
      },
    },
  });

  if (!introRequest) return null;

  const isRequester = introRequest.requesterId === userId;
  const isSMEOwner = introRequest.smeProfile.userId === userId;

  if (!isRequester && !isSMEOwner) return null;

  return { introRequest, isRequester, isSMEOwner };
}

// GET /api/chat/:requestId/messages - Get all messages for a conversation
export const getMessages = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { introRequest, isRequester } = access;

    // Get all messages (include deleted ones to show "This message was deleted")
    const messages = await prisma.chatMessage.findMany({
      where: {
        introductionRequestId: requestId,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, email: true },
        },
        attachments: true,
      },
      orderBy: { createdAt: 'asc' },
    });

    // Filter out messages deleted for this user
    const filteredMessages = messages.filter((msg) => {
      const deletedFor = (msg.deletedForUsers as string[]) || [];
      return !deletedFor.includes(userId);
    });

    // Mark messages as read
    await prisma.chatMessage.updateMany({
      where: {
        introductionRequestId: requestId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    const otherParty = isRequester
      ? {
          id: introRequest.smeProfile.user.id,
          name: introRequest.smeProfile.companyName || introRequest.smeProfile.user.fullName,
          email: introRequest.smeProfile.user.email,
          type: 'sme' as const,
        }
      : {
          id: introRequest.requester.id,
          name: introRequest.requester.fullName,
          email: introRequest.requester.email,
          type: 'user' as const,
        };

    return res.json({
      success: true,
      data: {
        conversationId: requestId,
        initialMessage: introRequest.message,
        initialResponse: introRequest.smeResponse,
        otherParty,
        currentUserId: userId,
        messages: filteredMessages.map((msg) => ({
          id: msg.id,
          content: msg.isDeletedForEveryone ? null : msg.content,
          senderId: msg.senderId,
          senderName: msg.sender.fullName,
          isOwnMessage: msg.senderId === userId,
          createdAt: msg.createdAt.toISOString(),
          isRead: msg.isRead,
          isEdited: msg.isEdited,
          editedAt: msg.editedAt?.toISOString() || null,
          isDeletedForEveryone: msg.isDeletedForEveryone,
          attachments: msg.isDeletedForEveryone ? [] : msg.attachments.map((att) => ({
            id: att.id,
            fileName: att.fileName,
            originalName: att.originalName,
            filePath: att.filePath,
            fileSize: att.fileSize,
            mimeType: att.mimeType,
          })),
        })),
      },
    });
  } catch (error) {
    console.error('Get messages error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// POST /api/chat/:requestId/messages - Send a new message
export const sendMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { introRequest, isSMEOwner } = access;

    const message = await prisma.chatMessage.create({
      data: {
        introductionRequestId: requestId,
        senderId: userId,
        content: content || '',
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        attachments: true,
      },
    });

    // Update status if SME is responding to pending request
    if (isSMEOwner && introRequest.status === RequestStatus.pending) {
      await prisma.introductionRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.responded, respondedAt: new Date() },
      });
    }

    return res.json({
      success: true,
      message: 'Message sent',
      data: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender.fullName,
        isOwnMessage: true,
        createdAt: message.createdAt.toISOString(),
        isRead: false,
        isEdited: false,
        editedAt: null,
        attachments: [],
      },
    });
  } catch (error) {
    console.error('Send message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// PUT /api/chat/:requestId/messages/:messageId - Edit a message
export const editMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId, messageId } = req.params;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!content || content.trim() === '') {
      return res.status(400).json({ success: false, message: 'Content is required' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Find the message and verify ownership
    const message = await prisma.chatMessage.findFirst({
      where: { id: messageId, introductionRequestId: requestId },
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (message.senderId !== userId) {
      return res.status(403).json({ success: false, message: 'You can only edit your own messages' });
    }

    if (message.isDeletedForEveryone) {
      return res.status(400).json({ success: false, message: 'Cannot edit deleted message' });
    }

    // Update the message
    const updatedMessage = await prisma.chatMessage.update({
      where: { id: messageId },
      data: {
        content: content.trim(),
        isEdited: true,
        editedAt: new Date(),
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        attachments: true,
      },
    });

    return res.json({
      success: true,
      message: 'Message edited',
      data: {
        id: updatedMessage.id,
        content: updatedMessage.content,
        senderId: updatedMessage.senderId,
        senderName: updatedMessage.sender.fullName,
        isOwnMessage: true,
        createdAt: updatedMessage.createdAt.toISOString(),
        isRead: updatedMessage.isRead,
        isEdited: updatedMessage.isEdited,
        editedAt: updatedMessage.editedAt?.toISOString() || null,
        attachments: updatedMessage.attachments.map((att) => ({
          id: att.id,
          fileName: att.fileName,
          originalName: att.originalName,
          filePath: att.filePath,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        })),
      },
    });
  } catch (error) {
    console.error('Edit message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to edit message' });
  }
};

// DELETE /api/chat/:requestId/messages/:messageId - Delete a message
export const deleteMessage = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId, messageId } = req.params;
    const { deleteForEveryone } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const message = await prisma.chatMessage.findFirst({
      where: { id: messageId, introductionRequestId: requestId },
    });

    if (!message) {
      return res.status(404).json({ success: false, message: 'Message not found' });
    }

    if (deleteForEveryone) {
      // Only the sender can delete for everyone
      if (message.senderId !== userId) {
        return res.status(403).json({ success: false, message: 'You can only delete your own messages for everyone' });
      }

      await prisma.chatMessage.update({
        where: { id: messageId },
        data: { isDeletedForEveryone: true },
      });

      return res.json({
        success: true,
        message: 'Message deleted for everyone',
        data: { messageId, deletedForEveryone: true },
      });
    } else {
      // Delete for me only
      const deletedFor = (message.deletedForUsers as string[]) || [];
      if (!deletedFor.includes(userId)) {
        deletedFor.push(userId);
      }

      await prisma.chatMessage.update({
        where: { id: messageId },
        data: { deletedForUsers: deletedFor },
      });

      return res.json({
        success: true,
        message: 'Message deleted for you',
        data: { messageId, deletedForEveryone: false },
      });
    }
  } catch (error) {
    console.error('Delete message error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete message' });
  }
};

// DELETE /api/chat/:requestId - Delete entire conversation
export const deleteConversation = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const requestId = req.params.requestId as string;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Delete all attachments files first
    const messagesWithAttachments = await prisma.chatMessage.findMany({
      where: { introductionRequestId: requestId },
      include: { attachments: true },
    });

    for (const message of messagesWithAttachments) {
      for (const attachment of message.attachments) {
        const filePath = path.join(__dirname, '../..', attachment.filePath);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    // Delete all attachments from DB
    await prisma.chatAttachment.deleteMany({
      where: { message: { introductionRequestId: requestId } },
    });

    // Delete all messages
    await prisma.chatMessage.deleteMany({
      where: { introductionRequestId: requestId },
    });

    // Delete the introduction request itself
    await prisma.introductionRequest.delete({
      where: { id: requestId },
    });

    return res.json({
      success: true,
      message: 'Conversation deleted successfully',
      data: { success: true },
    });
  } catch (error) {
    console.error('Delete conversation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to delete conversation' });
  }
};

// POST /api/chat/:requestId/upload - Upload file attachment
export const uploadAttachment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId } = req.params;
    const { content } = req.body;

    if (!userId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { introRequest, isSMEOwner } = access;

    const message = await prisma.chatMessage.create({
      data: {
        introductionRequestId: requestId,
        senderId: userId,
        content: content || '',
        attachments: {
          create: {
            fileName: req.file.filename,
            originalName: req.file.originalname,
            filePath: `/uploads/chat/${requestId}/${req.file.filename}`,
            fileSize: req.file.size,
            mimeType: req.file.mimetype,
          },
        },
      },
      include: {
        sender: { select: { id: true, fullName: true } },
        attachments: true,
      },
    });

    if (isSMEOwner && introRequest.status === RequestStatus.pending) {
      await prisma.introductionRequest.update({
        where: { id: requestId },
        data: { status: RequestStatus.responded, respondedAt: new Date() },
      });
    }

    return res.json({
      success: true,
      message: 'File uploaded',
      data: {
        id: message.id,
        content: message.content,
        senderId: message.senderId,
        senderName: message.sender.fullName,
        isOwnMessage: true,
        createdAt: message.createdAt.toISOString(),
        isRead: false,
        isEdited: false,
        editedAt: null,
        attachments: message.attachments.map((att) => ({
          id: att.id,
          fileName: att.fileName,
          originalName: att.originalName,
          filePath: att.filePath,
          fileSize: att.fileSize,
          mimeType: att.mimeType,
        })),
      },
    });
  } catch (error) {
    console.error('Upload attachment error:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
};

// GET /api/chat/:requestId/download/:attachmentId - Download attachment
export const downloadAttachment = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { requestId, attachmentId } = req.params;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const access = await checkConversationAccess(requestId, userId);
    if (!access) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const attachment = await prisma.chatAttachment.findUnique({
      where: { id: attachmentId },
      include: { message: { select: { introductionRequestId: true } } },
    });

    if (!attachment || attachment.message.introductionRequestId !== requestId) {
      return res.status(404).json({ success: false, message: 'File not found' });
    }

    const filePath = path.join(__dirname, '../../uploads/chat', requestId, attachment.fileName);

    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ success: false, message: 'File not found on server' });
    }

    res.download(filePath, attachment.originalName);
  } catch (error) {
    console.error('Download attachment error:', error);
    return res.status(500).json({ success: false, message: 'Failed to download file' });
  }
};

// GET /api/chat/conversations - Get all conversations for current user
export const getConversations = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    let conversations;

    if (userRole === 'sme') {
      const smeProfile = await prisma.sMEProfile.findUnique({ where: { userId } });

      if (!smeProfile) {
        return res.status(404).json({ success: false, message: 'SME profile not found' });
      }

      conversations = await prisma.introductionRequest.findMany({
        where: { smeProfileId: smeProfile.id },
        include: {
          requester: { select: { id: true, fullName: true, email: true } },
          messages: {
            where: { isDeletedForEveryone: false },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { fullName: true } } },
          },
          _count: {
            select: {
              messages: {
                where: { senderId: { not: userId }, isRead: false, isDeletedForEveryone: false },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return res.json({
        success: true,
        data: conversations.map((conv) => ({
          id: conv.id,
          otherParty: { id: conv.requester.id, name: conv.requester.fullName, email: conv.requester.email },
          lastMessage: conv.messages[0]
            ? { content: conv.messages[0].content, senderName: conv.messages[0].sender.fullName, createdAt: conv.messages[0].createdAt.toISOString() }
            : { content: conv.message, senderName: conv.requester.fullName, createdAt: conv.requestedDate.toISOString() },
          unreadCount: conv._count.messages,
          status: conv.status,
          createdAt: conv.requestedDate.toISOString(),
        })),
      });
    } else {
      conversations = await prisma.introductionRequest.findMany({
        where: { requesterId: userId },
        include: {
          smeProfile: {
            select: { id: true, companyName: true, user: { select: { id: true, fullName: true, email: true } } },
          },
          messages: {
            where: { isDeletedForEveryone: false },
            orderBy: { createdAt: 'desc' },
            take: 1,
            include: { sender: { select: { fullName: true } } },
          },
          _count: {
            select: {
              messages: {
                where: { senderId: { not: userId }, isRead: false, isDeletedForEveryone: false },
              },
            },
          },
        },
        orderBy: { updatedAt: 'desc' },
      });

      return res.json({
        success: true,
        data: conversations.map((conv) => ({
          id: conv.id,
          otherParty: { id: conv.smeProfile.user.id, name: conv.smeProfile.companyName || conv.smeProfile.user.fullName, email: conv.smeProfile.user.email },
          lastMessage: conv.messages[0]
            ? { content: conv.messages[0].content, senderName: conv.messages[0].sender.fullName, createdAt: conv.messages[0].createdAt.toISOString() }
            : { content: conv.message, senderName: 'You', createdAt: conv.requestedDate.toISOString() },
          unreadCount: conv._count.messages,
          status: conv.status,
          createdAt: conv.requestedDate.toISOString(),
        })),
      });
    }
  } catch (error) {
    console.error('Get conversations error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch conversations' });
  }
};
