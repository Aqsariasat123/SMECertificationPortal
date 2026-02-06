import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  // Admin endpoints
  requestPayment,
  getAllPayments,
  getPaymentById,
  cancelPayment,
  getPaymentBySmeProfile,
  // SME endpoints
  getMyPayment,
  confirmPayment,
  simulatePayment,
  // Public endpoints
  getPaymentConfig,
} from '../controllers/payment.controller';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Get payment configuration (fee amount, currency)
router.get('/config', getPaymentConfig);

// ============================================
// AUTHENTICATED ROUTES (All users)
// ============================================

// SME: Get my payment status
router.get('/my-payment', authenticate, getMyPayment);

// SME: Confirm payment completion
router.post('/confirm', authenticate, confirmPayment);

// SME: Simulate payment (for testing)
router.post('/simulate', authenticate, simulatePayment);

// ============================================
// ADMIN ROUTES
// ============================================

// Admin: Request payment from SME
router.post('/request/:smeProfileId', authenticate, requestPayment);

// Admin: Get all payments
router.get('/admin/all', authenticate, getAllPayments);

// Admin: Get payment by ID
router.get('/admin/:paymentId', authenticate, getPaymentById);

// Admin: Cancel pending payment
router.post('/admin/:paymentId/cancel', authenticate, cancelPayment);

// Admin: Get payment by SME profile ID
router.get('/by-sme/:smeProfileId', authenticate, getPaymentBySmeProfile);

export default router;
