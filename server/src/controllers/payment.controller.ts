import { Response } from 'express';
import { PrismaClient, PaymentStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { logAuditAction, AuditAction, getClientIP } from '../utils/auditLogger';
import {
  generatePaymentId,
  generateInvoiceNumber,
  createPaymentIntent,
  getPaymentIntent,
  cancelPaymentIntent,
  isStripeConfigured,
  DEFAULT_CERTIFICATION_FEE,
  DEFAULT_CURRENCY,
  formatAmount,
} from '../utils/payment';

const prisma = new PrismaClient();

// ============================================
// ADMIN ENDPOINTS
// ============================================

/**
 * Admin: Request payment from an approved SME
 * POST /api/payments/request/:smeProfileId
 */
export const requestPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;
    const { amount, description } = req.body;
    const adminId = req.user!.userId;

    // Verify admin role
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    // Find SME profile
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId },
      include: { user: true },
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Check if SME is approved/certified
    if (smeProfile.certificationStatus !== 'certified') {
      res.status(400).json({
        success: false,
        message: 'Payment can only be requested for approved/certified SMEs',
      });
      return;
    }

    // Check if there's already a pending payment
    const existingPayment = await prisma.payment.findFirst({
      where: {
        smeProfileId: smeProfileId,
        status: { in: ['pending', 'processing'] },
      },
    });

    if (existingPayment) {
      res.status(400).json({
        success: false,
        message: 'There is already a pending payment for this SME',
      });
      return;
    }

    const paymentAmount = amount || DEFAULT_CERTIFICATION_FEE;
    const paymentDescription = description || 'SME Certification Fee';

    // Create Stripe Payment Intent (if Stripe is configured)
    let stripeData: { paymentIntentId: string; clientSecret: string } | null = null;
    if (isStripeConfigured()) {
      stripeData = await createPaymentIntent(paymentAmount, DEFAULT_CURRENCY, {
        smeProfileId: smeProfileId,
        companyName: smeProfile.companyName || '',
      });
    }

    // Create payment record
    const payment = await prisma.payment.create({
      data: {
        paymentId: generatePaymentId(),
        smeProfileId: smeProfileId,
        amount: paymentAmount,
        currency: DEFAULT_CURRENCY,
        description: paymentDescription,
        status: 'pending',
        stripePaymentIntentId: stripeData?.paymentIntentId,
        stripeClientSecret: stripeData?.clientSecret,
        requestedById: adminId,
        requestedAt: new Date(),
        invoiceNumber: generateInvoiceNumber(),
      },
    });

    // Log audit
    await logAuditAction({
      userId: adminId,
      actionType: AuditAction.PAYMENT_REQUESTED,
      actionDescription: `Requested payment of ${formatAmount(paymentAmount)} from ${smeProfile.companyName}`,
      targetType: 'Payment',
      targetId: payment.id,
      ipAddress: getClientIP(req),
      newValue: {
        paymentId: payment.paymentId,
        amount: paymentAmount,
        smeCompany: smeProfile.companyName,
      },
    });

    res.json({
      success: true,
      message: 'Payment request sent successfully',
      data: {
        paymentId: payment.paymentId,
        amount: paymentAmount,
        currency: DEFAULT_CURRENCY,
        status: payment.status,
        invoiceNumber: payment.invoiceNumber,
      },
    });
  } catch (error) {
    console.error('Error requesting payment:', error);
    res.status(500).json({ success: false, message: 'Failed to request payment' });
  }
};

/**
 * Admin: Get all payments with filtering
 * GET /api/payments/admin/all
 */
export const getAllPayments = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    const { status, page = '1', limit = '20' } = req.query;
    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const where: Record<string, unknown> = {};
    if (status && status !== 'all') {
      where.status = status;
    }

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        include: {
          smeProfile: {
            select: {
              companyName: true,
              user: { select: { email: true, fullName: true } },
            },
          },
          requestedBy: { select: { fullName: true } },
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.payment.count({ where }),
    ]);

    res.json({
      success: true,
      data: payments,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(total / limitNum),
      },
    });
  } catch (error) {
    console.error('Error fetching payments:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payments' });
  }
};

/**
 * Admin: Get payment by ID
 * GET /api/payments/admin/:paymentId
 */
export const getPaymentById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    const paymentId = req.params.paymentId as string;

    const payment = await prisma.payment.findFirst({
      where: { OR: [{ id: paymentId }, { paymentId: paymentId }] },
      include: {
        smeProfile: {
          select: {
            companyName: true,
            tradeLicenseNumber: true,
            user: { select: { email: true, fullName: true } },
          },
        },
        requestedBy: { select: { fullName: true, email: true } },
      },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
};

/**
 * Admin: Cancel a pending payment
 * POST /api/payments/admin/:paymentId/cancel
 */
export const cancelPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    const { paymentId } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { OR: [{ id: paymentId as string }, { paymentId: paymentId as string }] },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Payment not found' });
      return;
    }

    if (payment.status !== 'pending') {
      res.status(400).json({
        success: false,
        message: 'Only pending payments can be cancelled',
      });
      return;
    }

    // Cancel Stripe Payment Intent if exists
    if (payment.stripePaymentIntentId) {
      await cancelPaymentIntent(payment.stripePaymentIntentId);
    }

    await prisma.payment.update({
      where: { id: payment.id },
      data: { status: 'failed', failureReason: 'Cancelled by admin' },
    });

    res.json({ success: true, message: 'Payment cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling payment:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel payment' });
  }
};

// ============================================
// SME ENDPOINTS
// ============================================

/**
 * SME: Get my payment status
 * GET /api/payments/my-payment
 */
export const getMyPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Find SME profile
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Get latest payment
    const payment = await prisma.payment.findFirst({
      where: { smeProfileId: smeProfile.id },
      orderBy: { createdAt: 'desc' },
    });

    if (!payment) {
      res.json({
        success: true,
        data: null,
        message: 'No payment requested',
      });
      return;
    }

    // Don't expose Stripe secrets to frontend for security
    const safePaymentData = {
      id: payment.id,
      paymentId: payment.paymentId,
      amount: payment.amount,
      currency: payment.currency,
      description: payment.description,
      status: payment.status,
      invoiceNumber: payment.invoiceNumber,
      requestedAt: payment.requestedAt,
      paidAt: payment.paidAt,
      receiptUrl: payment.receiptUrl,
      // Only include client secret if payment is pending (for Stripe checkout)
      clientSecret: payment.status === 'pending' ? payment.stripeClientSecret : null,
    };

    res.json({ success: true, data: safePaymentData });
  } catch (error) {
    console.error('Error fetching payment:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
};

/**
 * SME: Confirm payment completion (manual confirmation or webhook callback)
 * POST /api/payments/confirm
 */
export const confirmPayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;
    const { paymentIntentId } = req.body;

    // Find SME profile
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Find payment
    const payment = await prisma.payment.findFirst({
      where: {
        smeProfileId: smeProfile.id,
        status: 'pending',
        ...(paymentIntentId ? { stripePaymentIntentId: paymentIntentId } : {}),
      },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'Pending payment not found' });
      return;
    }

    // Verify with Stripe if payment intent exists
    if (payment.stripePaymentIntentId) {
      const paymentIntent = await getPaymentIntent(payment.stripePaymentIntentId);
      if (!paymentIntent || paymentIntent.status !== 'succeeded') {
        res.status(400).json({
          success: false,
          message: 'Payment has not been completed yet',
        });
        return;
      }
    }

    // Update payment status
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paidAt: new Date(),
        stripeChargeId: payment.stripePaymentIntentId, // In production, extract from payment intent
      },
    });

    // Log audit
    await logAuditAction({
      userId,
      actionType: AuditAction.PAYMENT_COMPLETED,
      actionDescription: `Completed payment ${payment.paymentId} for ${formatAmount(Number(payment.amount))}`,
      targetType: 'Payment',
      targetId: payment.id,
      ipAddress: getClientIP(req),
      newValue: { paymentId: payment.paymentId, status: 'completed' },
    });

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      data: {
        paymentId: updatedPayment.paymentId,
        status: updatedPayment.status,
        paidAt: updatedPayment.paidAt,
        invoiceNumber: updatedPayment.invoiceNumber,
      },
    });
  } catch (error) {
    console.error('Error confirming payment:', error);
    res.status(500).json({ success: false, message: 'Failed to confirm payment' });
  }
};

/**
 * SME: Simulate payment (for testing without Stripe)
 * POST /api/payments/simulate
 */
export const simulatePayment = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user!.userId;

    // Find SME profile
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Find pending payment
    const payment = await prisma.payment.findFirst({
      where: {
        smeProfileId: smeProfile.id,
        status: 'pending',
      },
    });

    if (!payment) {
      res.status(404).json({ success: false, message: 'No pending payment found' });
      return;
    }

    // Update payment status to completed (simulation)
    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: {
        status: 'completed',
        paidAt: new Date(),
        receiptUrl: `/api/payments/receipt/${payment.paymentId}`,
      },
    });

    // Log audit
    await logAuditAction({
      userId,
      actionType: AuditAction.PAYMENT_COMPLETED,
      actionDescription: `Completed payment ${payment.paymentId} for ${formatAmount(Number(payment.amount))} (simulated)`,
      targetType: 'Payment',
      targetId: payment.id,
      ipAddress: getClientIP(req),
      newValue: { paymentId: payment.paymentId, status: 'completed', simulated: true },
    });

    res.json({
      success: true,
      message: 'Payment completed successfully',
      data: {
        paymentId: updatedPayment.paymentId,
        status: updatedPayment.status,
        paidAt: updatedPayment.paidAt,
        invoiceNumber: updatedPayment.invoiceNumber,
        receiptUrl: updatedPayment.receiptUrl,
      },
    });
  } catch (error) {
    console.error('Error simulating payment:', error);
    res.status(500).json({ success: false, message: 'Failed to process payment' });
  }
};

// ============================================
// PUBLIC ENDPOINTS
// ============================================

/**
 * Get payment configuration (fee amount, currency)
 * GET /api/payments/config
 */
export const getPaymentConfig = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: {
      certificationFee: DEFAULT_CERTIFICATION_FEE,
      currency: DEFAULT_CURRENCY,
      formattedFee: formatAmount(DEFAULT_CERTIFICATION_FEE),
      stripeConfigured: isStripeConfigured(),
    },
  });
};

/**
 * Get payment for admin application detail view
 * GET /api/payments/by-sme/:smeProfileId
 */
export const getPaymentBySmeProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
  try {
    if (req.user!.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Admin access required' });
      return;
    }

    const { smeProfileId } = req.params;

    const payment = await prisma.payment.findFirst({
      where: { smeProfileId: smeProfileId as string },
      orderBy: { createdAt: 'desc' },
    });

    res.json({ success: true, data: payment });
  } catch (error) {
    console.error('Error fetching payment by SME:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch payment' });
  }
};
