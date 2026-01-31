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
  DOCUMENT_DELETED = 'DOCUMENT_DELETED',

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
