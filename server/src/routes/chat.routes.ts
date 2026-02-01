import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';
import {
  getMessages,
  sendMessage,
  editMessage,
  deleteMessage,
  deleteConversation,
  uploadAttachment,
  downloadAttachment,
  getConversations,
} from '../controllers/chat.controller';

const router = Router();

// Configure multer for chat file uploads
const chatStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const requestId = req.params.requestId as string;
    const uploadDir = path.join(__dirname, '../../uploads/chat', requestId);

    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const ext = path.extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

const chatUpload = multer({
  storage: chatStorage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB max file size
  },
  fileFilter: (req, file, cb) => {
    // Allow common file types
    const allowedTypes = [
      // Documents
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-powerpoint',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      'text/plain',
      'text/csv',
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      // Videos
      'video/mp4',
      'video/webm',
      'video/quicktime',
      // Archives
      'application/zip',
      'application/x-rar-compressed',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

// All chat routes require authentication
router.use(authenticate);

// Get all conversations for current user
router.get('/conversations', getConversations);

// Get messages for a conversation
router.get('/:requestId/messages', getMessages);

// Send a text message
router.post('/:requestId/messages', sendMessage);

// Edit a message
router.put('/:requestId/messages/:messageId', editMessage);

// Delete a message
router.delete('/:requestId/messages/:messageId', deleteMessage);

// Delete entire conversation
router.delete('/:requestId', deleteConversation);

// Upload file attachment
router.post('/:requestId/upload', chatUpload.single('file'), uploadAttachment);

// Download attachment
router.get('/:requestId/download/:attachmentId', downloadAttachment);

export default router;
