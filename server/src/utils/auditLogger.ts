import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export enum AuditAction {
  // User Actions
  USER_REGISTERED = 'USER_REGISTERED',
  USER_LOGIN = 'USER_LOGIN',
  USER_LOGOUT = 'USER_LOGOUT',
  EMAIL_VERIFIED = 'EMAIL_VERIFIED',
  PASSWORD_RESET_REQUESTED = 'PASSWORD_RESET_REQUESTED',
  PASSWORD_RESET_COMPLETED = 'PASSWORD_RESET_COMPLETED',
  PASSWORD_CHANGED = 'PASSWORD_CHANGED',

  // Profile Actions
  PROFILE_UPDATED = 'PROFILE_UPDATED',
  DOCUMENT_UPLOADED = 'DOCUMENT_UPLOADED',
  DOCUMENT_REPLACED = 'DOCUMENT_REPLACED',
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',
  ADMIN_DOCUMENT_VIEWED = 'ADMIN_DOCUMENT_VIEWED',

  // Certification Actions
  CERTIFICATION_SUBMITTED = 'CERTIFICATION_SUBMITTED',
  CERTIFICATION_APPROVED = 'CERTIFICATION_APPROVED',
  CERTIFICATION_REJECTED = 'CERTIFICATION_REJECTED',
  CERTIFICATION_REVISION_REQUESTED = 'CERTIFICATION_REVISION_REQUESTED',

  // Registry Actions
  LISTING_PUBLISHED = 'LISTING_PUBLISHED',
  LISTING_UNPUBLISHED = 'LISTING_UNPUBLISHED',

  // Introduction Actions
  INTRODUCTION_REQUESTED = 'INTRODUCTION_REQUESTED',
  INTRODUCTION_VIEWED = 'INTRODUCTION_VIEWED',
  INTRODUCTION_RESPONDED = 'INTRODUCTION_RESPONDED',

  // Admin Actions
  USER_ROLE_CHANGED = 'USER_ROLE_CHANGED',
  USER_DEACTIVATED = 'USER_DEACTIVATED',
  USER_ACTIVATED = 'USER_ACTIVATED',

  // Account Suspension (Governance)
  ACCOUNT_SUSPENDED = 'ACCOUNT_SUSPENDED',
  ACCOUNT_UNSUSPENDED = 'ACCOUNT_UNSUSPENDED',
  LOGIN_BLOCKED_SUSPENDED = 'LOGIN_BLOCKED_SUSPENDED',

  // Duplicate Detection (Governance)
  DUPLICATE_TRADE_LICENSE_ATTEMPT = 'DUPLICATE_TRADE_LICENSE_ATTEMPT',

  // Export Actions
  AUDIT_LOGS_EXPORTED = 'AUDIT_LOGS_EXPORTED',
  APPLICATIONS_EXPORTED = 'APPLICATIONS_EXPORTED',

  // Legal Page Actions
  LEGAL_PAGE_UPDATED = 'LEGAL_PAGE_UPDATED',
  LEGAL_UPDATE_NOTIFIED = 'LEGAL_UPDATE_NOTIFIED',

  // Registry Tracking Actions
  REGISTRY_SEARCH = 'REGISTRY_SEARCH',
  REGISTRY_VIEW = 'REGISTRY_VIEW',
  REGISTRY_ZERO_RESULTS = 'REGISTRY_ZERO_RESULTS',

  // Certificate Actions
  CERTIFICATE_ISSUED = 'CERTIFICATE_ISSUED',
  CERTIFICATE_DOWNLOADED = 'CERTIFICATE_DOWNLOADED',
  CERTIFICATE_REISSUED = 'CERTIFICATE_REISSUED',
  CERTIFICATE_REVOKED = 'CERTIFICATE_REVOKED',
  REGISTRY_VERIFICATION_VIEWED = 'REGISTRY_VERIFICATION_VIEWED',

  // Internal Review Actions
  INTERNAL_REVIEW_UPDATED = 'INTERNAL_REVIEW_UPDATED',

  // Certification Scoring Engine Actions
  CERTIFICATION_ASSESSMENT_INITIALIZED = 'CERTIFICATION_ASSESSMENT_INITIALIZED',
  CRITERION_SCORE_UPDATED = 'CRITERION_SCORE_UPDATED',
  CERTIFICATION_DECISION_CALCULATED = 'CERTIFICATION_DECISION_CALCULATED',

  // Payment Actions
  PAYMENT_REQUESTED = 'PAYMENT_REQUESTED',
  PAYMENT_COMPLETED = 'PAYMENT_COMPLETED',
  PAYMENT_FAILED = 'PAYMENT_FAILED',
  PAYMENT_REFUNDED = 'PAYMENT_REFUNDED',

  // Certificate Verification Tracking
  CERTIFICATE_VERIFICATION_ATTEMPT = 'CERTIFICATE_VERIFICATION_ATTEMPT',

  // Email Tracking
  EMAIL_SENT = 'EMAIL_SENT',
  EMAIL_FAILED = 'EMAIL_FAILED',

  // Two-Factor Authentication
  TWO_FACTOR_OTP_SENT = 'TWO_FACTOR_OTP_SENT',
  TWO_FACTOR_ENABLED = 'TWO_FACTOR_ENABLED',
  TWO_FACTOR_DISABLED = 'TWO_FACTOR_DISABLED',
  TWO_FACTOR_FAILED = 'TWO_FACTOR_FAILED',
}

interface AuditLogParams {
  userId: string;
  actionType: AuditAction;
  actionDescription: string;
  targetType?: string;
  targetId?: string;
  ipAddress?: string;
  previousValue?: Record<string, unknown> | null;
  newValue?: Record<string, unknown> | null;
}

export async function logAuditAction(params: AuditLogParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        userId: params.userId,
        actionType: params.actionType,
        actionDescription: params.actionDescription,
        targetType: params.targetType,
        targetId: params.targetId,
        ipAddress: params.ipAddress,
        previousValue: params.previousValue ? JSON.stringify(params.previousValue) : null,
        newValue: params.newValue ? JSON.stringify(params.newValue) : null,
        timestamp: new Date(),
      },
    });
  } catch (error) {
    console.error('Failed to create audit log:', error);
  }
}

export function getClientIP(req: { ip?: string; headers: Record<string, string | string[] | undefined> }): string {
  const forwarded = req.headers['x-forwarded-for'];
  if (forwarded) {
    const ip = Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0];
    return ip.trim();
  }
  return req.ip || 'unknown';
}
