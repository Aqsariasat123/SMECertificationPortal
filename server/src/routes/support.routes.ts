import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  createTicket,
  getUserTickets,
  getTicketMessages,
  sendMessage,
  getAllTickets,
  updateTicketStatus,
  getSupportStats,
} from '../controllers/support.controller';

const router = Router();

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
