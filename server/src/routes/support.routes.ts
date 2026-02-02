import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { authenticate } from '../middleware/auth';
import {
  createTicket,
  getUserTickets,
  getTicketMessages,
  sendMessage,
  getAllTickets,
  updateTicketStatus,
  getSupportStats,
  uploadAttachment,
} from '../controllers/support.controller';

const router = Router();

// Configure multer for support file uploads
const supportStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    const ticketId = req.params.ticketId as string;
    const uploadDir = path.join(__dirname, '../../uploads/support', ticketId);

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

const supportUpload = multer({
  storage: supportStorage,
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
      'text/plain',
      'text/csv',
      // Images
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed`));
    }
  },
});

// All support routes require authentication
router.use(authenticate);

// ============================================
// USER ROUTES (SME / Investor)
// ============================================

// Create a new support ticket
router.post('/tickets', createTicket);

// Get user's support tickets
router.get('/tickets', getUserTickets);

// Get messages for a specific ticket
router.get('/tickets/:ticketId', getTicketMessages);

// Send a message in a ticket
router.post('/tickets/:ticketId/messages', sendMessage);

// Upload file attachment in a ticket
router.post('/tickets/:ticketId/upload', supportUpload.single('file'), uploadAttachment);

// ============================================
// ADMIN ROUTES
// ============================================

// Get all support tickets (admin only)
router.get('/admin/tickets', getAllTickets);

// Get support statistics (admin only)
router.get('/admin/stats', getSupportStats);

// Update ticket status (admin only)
router.put('/admin/tickets/:ticketId/status', updateTicketStatus);

export default router;
