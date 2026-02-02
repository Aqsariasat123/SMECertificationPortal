import { Response } from 'express';
import { PrismaClient, SupportTicketStatus, SupportTicketPriority, SupportTicket, SupportMessage, User } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import fs from 'fs';

const prisma = new PrismaClient();

// Type for ticket with relations
type TicketWithRelations = SupportTicket & {
  user: Pick<User, 'id' | 'fullName' | 'email' | 'role'>;
  messages: (SupportMessage & {
    sender: Pick<User, 'id' | 'fullName' | 'role'>;
  })[];
  _count: { messages: number };
};

// ============================================
// USER ENDPOINTS (SME / Investor)
// ============================================

// POST /api/support/tickets - Create a new support ticket
export const createTicket = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const { subject, message } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!subject || !message) {
      return res.status(400).json({ success: false, message: 'Subject and message are required' });
    }

    // Create ticket with initial message
    const ticket = await prisma.supportTicket.create({
      data: {
        userId,
        subject,
        messages: {
          create: {
            senderId: userId,
            content: message,
          },
        },
      },
      include: {
        messages: {
          include: {
            sender: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Support ticket created successfully',
      data: ticket,
    });
  } catch (error) {
    console.error('Error creating support ticket:', error);
    return res.status(500).json({ success: false, message: 'Failed to create support ticket' });
  }
};

// GET /api/support/tickets - Get user's support tickets
export const getUserTickets = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const tickets = await prisma.supportTicket.findMany({
      where: { userId },
      include: {
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
        _count: {
          select: {
            messages: {
              where: {
                isRead: false,
                senderId: { not: userId },
              },
            },
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Format for frontend
    const formattedTickets = tickets.map((ticket) => ({
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      lastMessage: ticket.messages[0] || null,
      unreadCount: ticket._count.messages,
    }));

    return res.json({ success: true, data: formattedTickets });
  } catch (error) {
    console.error('Error fetching user tickets:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

// GET /api/support/tickets/:ticketId - Get ticket messages
export const getTicketMessages = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const ticketId = req.params.ticketId as string;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
      include: {
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        messages: {
          include: {
            sender: {
              select: { id: true, fullName: true, role: true },
            },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check access - user can only see their own tickets, admin can see all
    if (userRole !== 'admin' && ticket.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Mark messages as read
    await prisma.supportMessage.updateMany({
      where: {
        ticketId,
        senderId: { not: userId },
        isRead: false,
      },
      data: { isRead: true },
    });

    return res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error fetching ticket messages:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch messages' });
  }
};

// POST /api/support/tickets/:ticketId/messages - Send a message in a ticket
export const sendMessage = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const ticketId = req.params.ticketId as string;
    const { content } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!content) {
      return res.status(400).json({ success: false, message: 'Message content is required' });
    }

    // Verify ticket exists and user has access
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check access - user can only message their own tickets, admin can message all
    if (userRole !== 'admin' && ticket.userId !== userId) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Create message and update ticket
    const message = await prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: userId,
        content,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, role: true },
        },
      },
    });

    // Update ticket's updatedAt and status if admin replies
    const updateData: { updatedAt: Date; status?: SupportTicketStatus } = {
      updatedAt: new Date(),
    };

    if (userRole === 'admin' && ticket.status === 'open') {
      updateData.status = 'in_progress';
    }

    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return res.status(201).json({ success: true, data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    return res.status(500).json({ success: false, message: 'Failed to send message' });
  }
};

// ============================================
// ADMIN ENDPOINTS
// ============================================

// GET /api/support/admin/tickets - Get all support tickets (admin only)
export const getAllTickets = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const { status, priority } = req.query;

    const where: { status?: SupportTicketStatus; priority?: SupportTicketPriority } = {};
    if (status) where.status = status as SupportTicketStatus;
    if (priority) where.priority = priority as SupportTicketPriority;

    const tickets = await prisma.supportTicket.findMany({
      where,
      include: {
        user: {
          select: { id: true, fullName: true, email: true, role: true },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
          include: {
            sender: {
              select: { id: true, fullName: true, role: true },
            },
          },
        },
        _count: {
          select: { messages: true },
        },
      },
      orderBy: [
        { status: 'asc' }, // Open tickets first
        { updatedAt: 'desc' },
      ],
    }) as TicketWithRelations[];

    // Count unread for admin (messages not from admin)
    const ticketsWithUnread = await Promise.all(
      tickets.map(async (ticket: TicketWithRelations) => {
        const unreadCount = await prisma.supportMessage.count({
          where: {
            ticketId: ticket.id,
            isRead: false,
            sender: { role: { not: 'admin' } },
          },
        });

        return {
          id: ticket.id,
          subject: ticket.subject,
          status: ticket.status,
          priority: ticket.priority,
          createdAt: ticket.createdAt,
          updatedAt: ticket.updatedAt,
          user: ticket.user,
          lastMessage: ticket.messages[0] || null,
          messageCount: ticket._count.messages,
          unreadCount,
        };
      })
    );

    return res.json({ success: true, data: ticketsWithUnread });
  } catch (error) {
    console.error('Error fetching all tickets:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch tickets' });
  }
};

// PUT /api/support/admin/tickets/:ticketId/status - Update ticket status (admin only)
export const updateTicketStatus = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userRole = req.user?.role;
    const ticketId = req.params.ticketId as string;
    const { status } = req.body;

    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const validStatuses: SupportTicketStatus[] = ['open', 'in_progress', 'resolved', 'closed'];
    if (!validStatuses.includes(status as SupportTicketStatus)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }

    const updateData: { status: SupportTicketStatus; closedAt?: Date | null } = { status: status as SupportTicketStatus };
    if (status === 'closed' || status === 'resolved') {
      updateData.closedAt = new Date();
    } else {
      updateData.closedAt = null;
    }

    const ticket = await prisma.supportTicket.update({
      where: { id: ticketId },
      data: updateData,
    });

    return res.json({ success: true, data: ticket });
  } catch (error) {
    console.error('Error updating ticket status:', error);
    return res.status(500).json({ success: false, message: 'Failed to update ticket status' });
  }
};

// GET /api/support/admin/stats - Get support stats (admin only)
export const getSupportStats = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userRole = req.user?.role;

    if (userRole !== 'admin') {
      return res.status(403).json({ success: false, message: 'Admin access required' });
    }

    const [openCount, inProgressCount, resolvedCount, totalCount] = await Promise.all([
      prisma.supportTicket.count({ where: { status: 'open' } }),
      prisma.supportTicket.count({ where: { status: 'in_progress' } }),
      prisma.supportTicket.count({ where: { status: 'resolved' } }),
      prisma.supportTicket.count(),
    ]);

    // Count total unread messages for admin
    const unreadCount = await prisma.supportMessage.count({
      where: {
        isRead: false,
        sender: { role: { not: 'admin' } },
      },
    });

    return res.json({
      success: true,
      data: {
        open: openCount,
        inProgress: inProgressCount,
        resolved: resolvedCount,
        total: totalCount,
        unread: unreadCount,
      },
    });
  } catch (error) {
    console.error('Error fetching support stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch stats' });
  }
};

// POST /api/support/tickets/:ticketId/upload - Upload attachment in support ticket
export const uploadAttachment = async (req: AuthenticatedRequest, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.userId;
    const userRole = req.user?.role;
    const ticketId = req.params.ticketId as string;

    if (!userId) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    // Verify ticket exists and user has access
    const ticket = await prisma.supportTicket.findUnique({
      where: { id: ticketId },
    });

    if (!ticket) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({ success: false, message: 'Ticket not found' });
    }

    // Check access - user can only upload to their own tickets, admin can upload to all
    if (userRole !== 'admin' && ticket.userId !== userId) {
      fs.unlinkSync(req.file.path);
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Create attachment content in JSON format
    const attachmentContent = JSON.stringify({
      type: 'attachment',
      fileName: req.file.filename,
      originalName: req.file.originalname,
      mimeType: req.file.mimetype,
      size: req.file.size,
      path: `/api/support/tickets/${ticketId}/download/${req.file.filename}`,
    });

    // Create message with attachment
    const message = await prisma.supportMessage.create({
      data: {
        ticketId,
        senderId: userId,
        content: `[ATTACHMENT]${attachmentContent}`,
      },
      include: {
        sender: {
          select: { id: true, fullName: true, role: true },
        },
      },
    });

    // Update ticket's updatedAt
    await prisma.supportTicket.update({
      where: { id: ticketId },
      data: { updatedAt: new Date() },
    });

    return res.status(201).json({
      success: true,
      message: 'File uploaded successfully',
      data: {
        id: message.id,
        content: message.content,
        createdAt: message.createdAt,
        sender: message.sender,
        attachment: {
          fileName: req.file.filename,
          originalName: req.file.originalname,
          mimeType: req.file.mimetype,
          size: req.file.size,
          path: `/api/support/tickets/${ticketId}/download/${req.file.filename}`,
        },
      },
    });
  } catch (error) {
    console.error('Error uploading attachment:', error);
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({ success: false, message: 'Failed to upload file' });
  }
};
