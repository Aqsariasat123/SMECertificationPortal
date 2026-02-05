import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { computeCertificateStatus, truncateHash } from '../utils/certificate';
import { logAuditAction, AuditAction } from '../utils/auditLogger';

const prisma = new PrismaClient();

/**
 * GET /api/verify/:certificateId
 * Public endpoint - no authentication required
 * Returns certificate verification data for public verification page
 */
export const verifyCertificate = async (req: Request, res: Response) => {
  try {
    const certId = req.params.certificateId as string;

    if (!certId || !certId.startsWith('SME-CERT-')) {
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

    // Log verification view (anonymous - no user ID needed)
    // Use a system user ID for anonymous tracking
    try {
      const systemUser = await prisma.user.findFirst({
        where: { role: 'admin' },
        select: { id: true },
      });

      if (systemUser) {
        await logAuditAction({
          userId: systemUser.id,
          actionType: AuditAction.REGISTRY_VERIFICATION_VIEWED,
          actionDescription: `Certificate ${certId} verification viewed`,
          targetType: 'Certificate',
          targetId: certificate.id,
          ipAddress: req.ip || 'unknown',
        });
      }
    } catch {
      // Silent fail for audit logging
    }

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
 * Format industry sector for display
 */
function formatIndustrySector(sector: string): string {
  return sector
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
