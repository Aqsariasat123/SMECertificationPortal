import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { computeCertificateStatus, truncateHash } from '../utils/certificate';
import { logAuditAction, AuditAction, getClientIP } from '../utils/auditLogger';

const prisma = new PrismaClient();

/**
 * Hash input for failed lookups (privacy protection)
 */
function hashInput(input: string): string {
  return crypto.createHash('sha256').update(input).digest('hex').substring(0, 16);
}

/**
 * GET /api/verify/:certificateId
 * Public endpoint - no authentication required
 * Returns certificate verification data for public verification page
 */
export const verifyCertificate = async (req: Request, res: Response) => {
  const certId = req.params.certificateId as string;
  const ipAddress = getClientIP(req);
  const userAgent = req.headers['user-agent'] || 'unknown';
  const lookupMethod = req.query.source === 'qr' ? 'QR' : 'CERT_ID';

  try {
    // Validate format
    if (!certId || !certId.startsWith('SME-CERT-')) {
      // Log failed attempt with hashed input
      await logVerificationAttempt({
        result: 'NOT_FOUND',
        lookupMethod,
        certificateId: null,
        hashedInput: hashInput(certId || ''),
        ipAddress,
        userAgent,
      });

      return res.status(400).json({
        success: false,
        message: 'Invalid certificate ID format',
      });
    }

    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certId },
      select: {
        id: true,
        certificateId: true,
        certificateVersion: true,
        companyName: true,
        tradeLicenseNumber: true,
        industrySector: true,
        issuedAt: true,
        expiresAt: true,
        status: true,
        revokedAt: true,
        revocationReason: true,
        verificationHash: true,
      },
    });

    if (!certificate) {
      // Log NOT_FOUND with hashed input
      await logVerificationAttempt({
        result: 'NOT_FOUND',
        lookupMethod,
        certificateId: null,
        hashedInput: hashInput(certId),
        ipAddress,
        userAgent,
      });

      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
        data: {
          status: 'not_found',
          certificateId: certId,
        },
      });
    }

    // Compute dynamic status (checks expiry)
    const computedStatus = computeCertificateStatus(
      certificate.status as 'active' | 'expired' | 'revoked',
      certificate.expiresAt
    );

    // Determine result for audit
    let auditResult: 'SUCCESS' | 'EXPIRED' | 'SUSPENDED' = 'SUCCESS';
    if (computedStatus === 'expired') auditResult = 'EXPIRED';
    if (computedStatus === 'revoked') auditResult = 'SUSPENDED';

    // Log verification attempt
    await logVerificationAttempt({
      result: auditResult,
      lookupMethod,
      certificateId: certificate.certificateId,
      hashedInput: null,
      ipAddress,
      userAgent,
      targetId: certificate.id,
    });

    // Return public-safe data only (no personal information)
    return res.json({
      success: true,
      data: {
        certificateId: certificate.certificateId,
        version: certificate.certificateVersion,
        companyName: certificate.companyName,
        tradeLicenseNumber: certificate.tradeLicenseNumber,
        industrySector: formatIndustrySector(certificate.industrySector),
        issuedAt: certificate.issuedAt,
        expiresAt: certificate.expiresAt,
        status: computedStatus,
        revokedAt: computedStatus === 'revoked' ? certificate.revokedAt : null,
        revocationReason: computedStatus === 'revoked' ? certificate.revocationReason : null,
        verificationHash: truncateHash(certificate.verificationHash),
      },
    });
  } catch (error) {
    console.error('Verify certificate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to verify certificate',
    });
  }
};

/**
 * Log verification attempt for audit trail
 */
async function logVerificationAttempt(params: {
  result: 'SUCCESS' | 'NOT_FOUND' | 'EXPIRED' | 'SUSPENDED';
  lookupMethod: 'CERT_ID' | 'QR';
  certificateId: string | null;
  hashedInput: string | null;
  ipAddress: string;
  userAgent: string;
  targetId?: string;
}): Promise<void> {
  try {
    // Get system user for anonymous logging
    const systemUser = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { id: true },
    });

    if (!systemUser) return;

    await logAuditAction({
      userId: systemUser.id,
      actionType: AuditAction.CERTIFICATE_VERIFICATION_ATTEMPT,
      actionDescription: `Certificate verification: ${params.result}`,
      targetType: 'Certificate',
      targetId: params.targetId,
      ipAddress: params.ipAddress,
      newValue: {
        result: params.result,
        lookupMethod: params.lookupMethod,
        certificateId: params.certificateId,
        hashedInput: params.hashedInput,
        userAgent: params.userAgent,
        timestamp: new Date().toISOString(),
      },
    });
  } catch {
    // Silent fail for audit logging
  }
}

/**
 * Format industry sector for display
 */
function formatIndustrySector(sector: string): string {
  return sector
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
