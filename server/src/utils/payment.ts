import crypto from 'crypto';
import Stripe from 'stripe';

// Initialize Stripe with secret key
const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
let stripe: Stripe | null = null;

if (stripeSecretKey) {
  stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2026-01-28.clover',
  });
}

// Default certification fee (in AED)
export const DEFAULT_CERTIFICATION_FEE = 500.00;
export const DEFAULT_CURRENCY = 'AED';

/**
 * Generate a unique payment ID
 * Format: PAY-XXXXXXXX (8 random hex characters)
 */
export function generatePaymentId(): string {
  const randomBytes = crypto.randomBytes(4);
  const hexString = randomBytes.toString('hex').toUpperCase();
  return `PAY-${hexString}`;
}

/**
 * Generate a unique invoice number
 * Format: NAYWA-INV-XXXXXXXX (8 random hex characters)
 */
export function generateInvoiceNumber(): string {
  const randomBytes = crypto.randomBytes(4);
  const hexString = randomBytes.toString('hex').toUpperCase();
  return `NAYWA-INV-${hexString}`;
}

/**
 * Create a Stripe Payment Intent
 * This creates a payment intent that can be used for frontend payment processing
 */
export async function createPaymentIntent(
  amount: number,
  currency: string = DEFAULT_CURRENCY,
  metadata: Record<string, string> = {}
): Promise<{
  paymentIntentId: string;
  clientSecret: string;
} | null> {
  if (!stripe) {
    console.warn('Stripe is not configured. Payment processing unavailable.');
    return null;
  }

  try {
    // Convert amount to smallest currency unit (fils for AED)
    const amountInSmallestUnit = Math.round(amount * 100);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amountInSmallestUnit,
      currency: currency.toLowerCase(),
      metadata: {
        ...metadata,
        platform: 'Naywa SME Certification',
      },
      description: 'SME Certification Fee',
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return {
      paymentIntentId: paymentIntent.id,
      clientSecret: paymentIntent.client_secret || '',
    };
  } catch (error) {
    console.error('Error creating Stripe Payment Intent:', error);
    return null;
  }
}

/**
 * Retrieve a Stripe Payment Intent
 */
export async function getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent | null> {
  if (!stripe) {
    return null;
  }

  try {
    return await stripe.paymentIntents.retrieve(paymentIntentId);
  } catch (error) {
    console.error('Error retrieving Stripe Payment Intent:', error);
    return null;
  }
}

/**
 * Cancel a Stripe Payment Intent
 */
export async function cancelPaymentIntent(paymentIntentId: string): Promise<boolean> {
  if (!stripe) {
    return false;
  }

  try {
    await stripe.paymentIntents.cancel(paymentIntentId);
    return true;
  } catch (error) {
    console.error('Error canceling Stripe Payment Intent:', error);
    return false;
  }
}

/**
 * Create a refund for a payment
 */
export async function createRefund(
  paymentIntentId: string,
  amount?: number // Optional partial refund amount
): Promise<{ refundId: string } | null> {
  if (!stripe) {
    return null;
  }

  try {
    const refundParams: Stripe.RefundCreateParams = {
      payment_intent: paymentIntentId,
    };

    if (amount) {
      refundParams.amount = Math.round(amount * 100);
    }

    const refund = await stripe.refunds.create(refundParams);
    return { refundId: refund.id };
  } catch (error) {
    console.error('Error creating refund:', error);
    return null;
  }
}

/**
 * Verify Stripe webhook signature
 */
export function verifyWebhookSignature(
  payload: string | Buffer,
  signature: string
): Stripe.Event | null {
  if (!stripe) {
    return null;
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.warn('Stripe webhook secret not configured');
    return null;
  }

  try {
    return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
  } catch (error) {
    console.error('Webhook signature verification failed:', error);
    return null;
  }
}

/**
 * Format amount for display
 */
export function formatAmount(amount: number, currency: string = DEFAULT_CURRENCY): string {
  return new Intl.NumberFormat('en-AE', {
    style: 'currency',
    currency: currency,
  }).format(amount);
}

/**
 * Check if Stripe is configured
 */
export function isStripeConfigured(): boolean {
  return stripe !== null;
}
