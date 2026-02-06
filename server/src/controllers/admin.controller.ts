import { Response } from 'express';
import { PrismaClient, CertificationStatus } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { emailService } from '../services/email.service';
import { logAuditAction, AuditAction, getClientIP } from '../utils/auditLogger';
import fs from 'fs';
import path from 'path';
import {
  generateCertificateId,
  generateVerificationHash,
  calculateExpiryDate,
  buildVerificationUrl,
  computeCertificateStatus,
  incrementVersion,
} from '../utils/certificate';

const prisma = new PrismaClient();

// GET /api/admin/dashboard - Get dashboard stats
export const getDashboardStats = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const [
      totalUsers,
      totalSMEs,
      pendingApplications,
      certifiedSMEs,
      recentActivity,
    ] = await Promise.all([
      prisma.user.count({ where: { role: 'user' } }),
      prisma.user.count({ where: { role: 'sme' } }),
      prisma.sMEProfile.count({
        where: {
          certificationStatus: { in: ['submitted', 'under_review'] },
        },
      }),
      prisma.sMEProfile.count({
        where: { certificationStatus: 'certified' },
      }),
      prisma.auditLog.findMany({
        take: 10,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: { fullName: true, email: true },
          },
        },
      }),
    ]);

    return res.json({
      success: true,
      data: {
        stats: {
          totalUsers,
          totalSMEs,
          pendingApplications,
          certifiedSMEs,
        },
        recentActivity,
      },
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard stats',
    });
  }
};

// GET /api/admin/users - Get all users with pagination
export const getUsers = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const role = req.query.role as string || '';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (role && ['user', 'sme', 'admin'].includes(role)) {
      where.role = role;
    }

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          email: true,
          fullName: true,
          role: true,
          isVerified: true,
          createdAt: true,
          lastLogin: true,
        },
      }),
      prisma.user.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get users error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
    });
  }
};

// GET /api/admin/applications - Get all SME applications
export const getApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string || '';
    const status = req.query.status as string || '';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { user: { fullName: { contains: search, mode: 'insensitive' } } },
        { user: { email: { contains: search, mode: 'insensitive' } } },
      ];
    }

    if (status && ['draft', 'submitted', 'under_review', 'certified', 'rejected', 'revision_requested'].includes(status)) {
      where.certificationStatus = status;
    }

    const [applications, total] = await Promise.all([
      prisma.sMEProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
            },
          },
          reviewedBy: {
            select: {
              fullName: true,
            },
          },
        },
      }),
      prisma.sMEProfile.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        applications,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch applications',
    });
  }
};

// GET /api/admin/applications/:id - Get single application detail
export const getApplicationDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            createdAt: true,
          },
        },
        reviewedBy: {
          select: {
            fullName: true,
            email: true,
          },
        },
        certificates: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Get audit history for this application
    const auditHistory = await prisma.auditLog.findMany({
      where: {
        targetType: 'SMEProfile',
        targetId: id,
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: {
        user: {
          select: { fullName: true },
        },
      },
    });

    // Get latest certificate with computed status
    const latestCertificate = application.certificates[0];
    let certificateData = null;
    if (latestCertificate) {
      certificateData = {
        id: latestCertificate.id,
        certificateId: latestCertificate.certificateId,
        version: latestCertificate.certificateVersion,
        issuedAt: latestCertificate.issuedAt,
        expiresAt: latestCertificate.expiresAt,
        status: computeCertificateStatus(
          latestCertificate.status as 'active' | 'expired' | 'revoked',
          latestCertificate.expiresAt
        ),
        storedStatus: latestCertificate.status,
        revokedAt: latestCertificate.revokedAt,
        revocationReason: latestCertificate.revocationReason,
        verificationUrl: latestCertificate.verificationUrl,
        lastReissuedAt: latestCertificate.lastReissuedAt,
      };
    }

    return res.json({
      success: true,
      data: {
        application: {
          ...application,
          certificates: undefined, // Remove raw certificates array
        },
        certificate: certificateData,
        auditHistory,
      },
    });
  } catch (error) {
    console.error('Get application detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch application details',
    });
  }
};

// POST /api/admin/applications/:id/review - Review application (approve/reject/request revision)
export const reviewApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const id = req.params.id as string;
    const { action, notes } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!action || !['approve', 'reject', 'request_revision', 'start_review'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid action. Must be: approve, reject, request_revision, or start_review',
      });
    }

    // Get application
    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Validate state transitions
    const validTransitions: Record<string, string[]> = {
      submitted: ['start_review'],
      under_review: ['approve', 'reject', 'request_revision'],
    };

    const currentStatus = application.certificationStatus;
    if (!validTransitions[currentStatus]?.includes(action)) {
      return res.status(400).json({
        success: false,
        message: `Cannot perform '${action}' on application with status '${currentStatus}'`,
      });
    }

    // Determine new status
    let newStatus: CertificationStatus;
    let actionDescription: string;

    switch (action) {
      case 'start_review':
        newStatus = CertificationStatus.under_review;
        actionDescription = `Started review for ${application.companyName}`;
        break;
      case 'approve':
        newStatus = CertificationStatus.certified;
        actionDescription = `Approved certification for ${application.companyName}`;
        break;
      case 'reject':
        if (!notes) {
          return res.status(400).json({
            success: false,
            message: 'Rejection notes are required',
          });
        }
        newStatus = CertificationStatus.rejected;
        actionDescription = `Rejected certification for ${application.companyName}`;
        break;
      case 'request_revision':
        if (!notes) {
          return res.status(400).json({
            success: false,
            message: 'Revision notes are required',
          });
        }
        newStatus = CertificationStatus.revision_requested;
        actionDescription = `Requested revision for ${application.companyName}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action',
        });
    }

    // Update application (with certificate creation on approval)
    let updatedApplication;
    let certificate = null;

    if (action === 'approve') {
      // Use transaction to atomically update profile and create certificate
      const frontendUrl = process.env.FRONTEND_URL || 'https://sme.byredstone.com';
      const certId = generateCertificateId();
      const issuedAt = new Date();
      const expiresAt = calculateExpiryDate(issuedAt);
      const version = 'v1.0';

      const verificationHash = generateVerificationHash({
        certificateId: certId,
        companyName: application.companyName || '',
        tradeLicenseNumber: application.tradeLicenseNumber || '',
        industrySector: application.industrySector || 'other',
        issuedAt,
        expiresAt,
        version,
      });

      const result = await prisma.$transaction(async (tx) => {
        const profile = await tx.sMEProfile.update({
          where: { id },
          data: {
            certificationStatus: newStatus,
            reviewedById: adminId,
            revisionNotes: null,
            listingVisible: true,
          },
          include: {
            user: {
              select: {
                fullName: true,
                email: true,
              },
            },
          },
        });

        const cert = await tx.certificate.create({
          data: {
            certificateId: certId,
            certificateVersion: version,
            smeProfileId: id,
            companyName: application.companyName || '',
            tradeLicenseNumber: application.tradeLicenseNumber || '',
            industrySector: application.industrySector || 'other',
            issuedAt,
            expiresAt,
            status: 'active',
            verificationUrl: buildVerificationUrl(certId, frontendUrl),
            verificationHash,
            issuedById: adminId,
          },
        });

        // Create audit logs
        await tx.auditLog.create({
          data: {
            userId: adminId,
            actionType: 'CERTIFICATION_APPROVE',
            actionDescription,
            targetType: 'SMEProfile',
            targetId: id,
            ipAddress: req.ip || 'unknown',
            newValue: JSON.stringify({ status: newStatus }),
          },
        });

        await tx.auditLog.create({
          data: {
            userId: adminId,
            actionType: AuditAction.CERTIFICATE_ISSUED,
            actionDescription: `Issued certificate ${certId} for ${application.companyName}`,
            targetType: 'Certificate',
            targetId: cert.id,
            ipAddress: req.ip || 'unknown',
            newValue: JSON.stringify({
              certificateId: certId,
              version,
              expiresAt: expiresAt.toISOString(),
            }),
          },
        });

        return { profile, cert };
      });

      updatedApplication = result.profile;
      certificate = result.cert;
    } else {
      // Non-approval actions
      updatedApplication = await prisma.sMEProfile.update({
        where: { id },
        data: {
          certificationStatus: newStatus,
          reviewedById: adminId,
          revisionNotes: action === 'request_revision' || action === 'reject' ? notes : null,
          listingVisible: false,
        },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
            },
          },
        },
      });

      // Create audit log for non-approval actions
      await prisma.auditLog.create({
        data: {
          userId: adminId,
          actionType: `CERTIFICATION_${action.toUpperCase()}`,
          actionDescription,
          targetType: 'SMEProfile',
          targetId: id,
          ipAddress: req.ip || 'unknown',
          newValue: JSON.stringify({ status: newStatus, notes }),
        },
      });
    }

    // Send email notifications based on action
    const userEmail = updatedApplication.user?.email;
    const userName = updatedApplication.user?.fullName || 'User';
    const companyName = updatedApplication.companyName || 'Your Company';

    if (userEmail) {
      switch (action) {
        case 'start_review':
          await emailService.sendVerificationInProgressEmail(userEmail, userName, companyName);
          break;
        case 'approve':
          await emailService.sendCertificationIssuedEmail(userEmail, userName, companyName);
          break;
        case 'reject':
          await emailService.sendApplicationRejectedEmail(userEmail, userName, companyName, notes);
          break;
        case 'request_revision':
          await emailService.sendRevisionRequiredEmail(userEmail, userName, companyName, notes);
          break;
      }
    }

    return res.json({
      success: true,
      message: `Application ${action.replace('_', ' ')} successfully`,
      data: {
        ...updatedApplication,
        certificate: certificate ? {
          certificateId: certificate.certificateId,
          version: certificate.certificateVersion,
          issuedAt: certificate.issuedAt,
          expiresAt: certificate.expiresAt,
          verificationUrl: certificate.verificationUrl,
        } : null,
      },
    });
  } catch (error) {
    console.error('Review application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to review application',
    });
  }
};

// GET /api/admin/audit-logs - Get audit logs with pagination
export const getAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const actionType = req.query.actionType as string || '';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (actionType) {
      where.actionType = actionType;
    }

    const [logs, total] = await Promise.all([
      prisma.auditLog.findMany({
        where,
        skip,
        take: limit,
        orderBy: { timestamp: 'desc' },
        include: {
          user: {
            select: {
              fullName: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.auditLog.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        logs,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get audit logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch audit logs',
    });
  }
};

// PUT /api/admin/registry/:profileId/visibility - Toggle SME listing visibility
export const updateVisibility = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const profileId = req.params.profileId as string;
    const { visible } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (typeof visible !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Visibility must be a boolean value',
      });
    }

    // Get the SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { id: profileId },
      select: {
        id: true,
        companyName: true,
        certificationStatus: true,
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Only certified SMEs can have visibility toggled
    if (profile.certificationStatus !== 'certified') {
      return res.status(400).json({
        success: false,
        message: 'Only certified SMEs can have their listing visibility changed',
      });
    }

    // Update visibility
    const updatedProfile = await prisma.sMEProfile.update({
      where: { id: profileId },
      data: { listingVisible: visible },
      select: {
        id: true,
        companyName: true,
        listingVisible: true,
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        actionType: visible ? 'LISTING_ENABLED' : 'LISTING_DISABLED',
        actionDescription: `${visible ? 'Enabled' : 'Disabled'} listing visibility for ${profile.companyName}`,
        targetType: 'SMEProfile',
        targetId: profileId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: `Listing visibility ${visible ? 'enabled' : 'disabled'} successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Update visibility error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update listing visibility',
    });
  }
};

// GET /api/admin/introduction-requests - Get all introduction requests
export const getIntroductionRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const status = (req.query.status as string) || '';
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status && ['pending', 'viewed', 'responded'].includes(status)) {
      where.status = status;
    }

    const [requests, total] = await Promise.all([
      prisma.introductionRequest.findMany({
        where,
        skip,
        take: limit,
        orderBy: { requestedDate: 'desc' },
        include: {
          requester: {
            select: {
              id: true,
              fullName: true,
              email: true,
            },
          },
          smeProfile: {
            select: {
              id: true,
              companyName: true,
              industrySector: true,
            },
          },
        },
      }),
      prisma.introductionRequest.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        requests: requests.map(req => ({
          id: req.id,
          requester: req.requester,
          sme: {
            id: req.smeProfile.id,
            companyName: req.smeProfile.companyName,
            industrySector: req.smeProfile.industrySector,
          },
          message: req.message,
          status: req.status,
          requestedDate: req.requestedDate,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get introduction requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction requests',
    });
  }
};

// GET /api/admin/audit-logs/export - Export audit logs as CSV
export const exportAuditLogs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const actionType = (req.query.actionType as string) || '';
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;

    const where: any = {};

    if (actionType) {
      where.actionType = actionType;
    }

    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = new Date(startDate);
      }
      if (endDate) {
        where.timestamp.lte = new Date(endDate);
      }
    }

    const logs = await prisma.auditLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
      take: 10000, // Limit export to 10000 records
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            role: true,
          },
        },
      },
    });

    // Generate CSV content
    const headers = ['Timestamp', 'User', 'Email', 'Role', 'Action Type', 'Description', 'Target Type', 'Target ID', 'IP Address'];
    const rows = logs.map(log => [
      new Date(log.timestamp).toISOString(),
      log.user.fullName,
      log.user.email,
      log.user.role,
      log.actionType,
      log.actionDescription,
      log.targetType || '',
      log.targetId || '',
      log.ipAddress || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Log the export action in audit trail
    const adminId = req.user?.userId;
    if (adminId) {
      await logAuditAction({
        userId: adminId,
        actionType: AuditAction.AUDIT_LOGS_EXPORTED,
        actionDescription: `Admin exported audit logs (${logs.length} records)`,
        ipAddress: getClientIP(req),
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=audit-logs-${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  } catch (error) {
    console.error('Export audit logs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export audit logs',
    });
  }
};

// GET /api/admin/applications/export - Export applications as CSV
export const exportApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const applications = await prisma.sMEProfile.findMany({
      where: {
        certificationStatus: { not: 'draft' as CertificationStatus },
      },
      orderBy: { submittedDate: 'desc' },
      include: {
        user: { select: { fullName: true, email: true } },
        reviewedBy: { select: { fullName: true } },
      },
    });

    const headers = ['Company Name', 'Trade License', 'Industry Sector', 'Status', 'Submitted Date', 'Owner', 'Email', 'Reviewed By', 'Legal Structure', 'Employee Count'];
    const rows = applications.map(app => [
      app.companyName || '',
      app.tradeLicenseNumber || '',
      (app.industrySector || '').replace(/_/g, ' '),
      app.certificationStatus,
      app.submittedDate ? new Date(app.submittedDate).toISOString().split('T')[0] : '',
      app.user.fullName,
      app.user.email,
      app.reviewedBy?.fullName || '',
      (app.legalStructure || '').replace(/_/g, ' '),
      app.employeeCount?.toString() || '',
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
    ].join('\n');

    // Log the export action in audit trail
    const adminId = req.user?.userId;
    if (adminId) {
      await logAuditAction({
        userId: adminId,
        actionType: AuditAction.APPLICATIONS_EXPORTED,
        actionDescription: `Admin exported applications data (${applications.length} records)`,
        ipAddress: getClientIP(req),
      });
    }

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=applications-${new Date().toISOString().split('T')[0]}.csv`);
    return res.send(csvContent);
  } catch (error) {
    console.error('Export applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to export applications',
    });
  }
};

// GET /api/admin/analytics - Server-side computed analytics
export const getAnalytics = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const timeRange = parseInt(req.query.timeRange as string) || 30;
    const roleFilter = req.query.role as string | undefined; // 'sme', 'user', 'admin', or undefined (all)
    const timezone = (req.query.timezone as string) || 'UTC';
    const now = new Date();
    const startDate = new Date(now.getTime() - timeRange * 24 * 60 * 60 * 1000);

    // Validate role filter
    const validRoles = ['sme', 'user', 'admin'];
    const activeRoleFilter = roleFilter && validRoles.includes(roleFilter) ? roleFilter : null;

    // 1. Login Segmentation — JOIN audit_logs + users, GROUP BY role
    const loginsByRole = activeRoleFilter
      ? await prisma.$queryRaw<{ role: string; count: bigint }[]>`
          SELECT u."role"::text, COUNT(*) as count
          FROM "audit_logs" a
          JOIN "users" u ON a."userId" = u."id"
          WHERE a."actionType" = 'USER_LOGIN'
            AND a."timestamp" >= ${startDate}
            AND u."role"::text = ${activeRoleFilter}
          GROUP BY u."role"
        `
      : await prisma.$queryRaw<{ role: string; count: bigint }[]>`
          SELECT u."role"::text, COUNT(*) as count
          FROM "audit_logs" a
          JOIN "users" u ON a."userId" = u."id"
          WHERE a."actionType" = 'USER_LOGIN'
            AND a."timestamp" >= ${startDate}
          GROUP BY u."role"
        `;

    const loginSegmentation = {
      sme: 0,
      user: 0,
      admin: 0,
      total: 0,
    };
    loginsByRole.forEach(row => {
      const count = Number(row.count);
      if (row.role === 'sme') loginSegmentation.sme = count;
      else if (row.role === 'user') loginSegmentation.user = count;
      else if (row.role === 'admin') loginSegmentation.admin = count;
      loginSegmentation.total += count;
    });

    // 2. Usage Quality — Unique logins, repeat logins, inactive certified
    const uniqueLoginsResult = activeRoleFilter
      ? await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(DISTINCT a."userId") as count
          FROM "audit_logs" a
          JOIN "users" u ON a."userId" = u."id"
          WHERE a."actionType" = 'USER_LOGIN'
            AND a."timestamp" >= ${startDate}
            AND u."role"::text = ${activeRoleFilter}
        `
      : await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(DISTINCT "userId") as count
          FROM "audit_logs"
          WHERE "actionType" = 'USER_LOGIN'
            AND "timestamp" >= ${startDate}
        `;
    const uniqueLogins = Number(uniqueLoginsResult[0]?.count || 0);

    const repeatLoginsResult = activeRoleFilter
      ? await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) as count FROM (
            SELECT a."userId"
            FROM "audit_logs" a
            JOIN "users" u ON a."userId" = u."id"
            WHERE a."actionType" = 'USER_LOGIN'
              AND a."timestamp" >= ${startDate}
              AND u."role"::text = ${activeRoleFilter}
            GROUP BY a."userId"
            HAVING COUNT(*) > 1
          ) sub
        `
      : await prisma.$queryRaw<{ count: bigint }[]>`
          SELECT COUNT(*) as count FROM (
            SELECT "userId"
            FROM "audit_logs"
            WHERE "actionType" = 'USER_LOGIN'
              AND "timestamp" >= ${startDate}
            GROUP BY "userId"
            HAVING COUNT(*) > 1
          ) sub
        `;
    const repeatLogins = Number(repeatLoginsResult[0]?.count || 0);

    // Inactive certified SMEs: certified but no login in 30 days
    const inactiveCertifiedResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "sme_profiles" sp
      JOIN "users" u ON sp."userId" = u."id"
      WHERE sp."certificationStatus" = 'certified'
        AND (u."lastLogin" IS NULL OR u."lastLogin" < NOW() - INTERVAL '30 days')
    `;
    const inactiveCertified = Number(inactiveCertifiedResult[0]?.count || 0);

    // 3. Certification Lifecycle
    // Avg days from profile creation to submission
    const avgDaysToSubmitResult = await prisma.$queryRaw<{ avg_days: number | null }[]>`
      SELECT AVG(EXTRACT(EPOCH FROM ("submittedDate" - "createdAt")) / 86400) as avg_days
      FROM "sme_profiles"
      WHERE "submittedDate" IS NOT NULL
    `;
    const avgDaysToSubmit = Math.round(avgDaysToSubmitResult[0]?.avg_days || 0);

    // Drop-off by stage
    const dropOffByStage = await prisma.$queryRaw<{ status: string; count: bigint }[]>`
      SELECT "certificationStatus" as status, COUNT(*) as count
      FROM "sme_profiles"
      GROUP BY "certificationStatus"
    `;
    const certificationFunnel: Record<string, number> = {};
    dropOffByStage.forEach(row => {
      certificationFunnel[row.status] = Number(row.count);
    });

    // 4. Activity by day (timezone-aware)
    const activityByDayResult = timezone !== 'UTC'
      ? await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE("timestamp" AT TIME ZONE 'UTC' AT TIME ZONE ${timezone}) as date, COUNT(*) as count
          FROM "audit_logs"
          WHERE "timestamp" >= ${startDate}
          GROUP BY 1
          ORDER BY 1 ASC
        `
      : await prisma.$queryRaw<{ date: Date; count: bigint }[]>`
          SELECT DATE("timestamp") as date, COUNT(*) as count
          FROM "audit_logs"
          WHERE "timestamp" >= ${startDate}
          GROUP BY 1
          ORDER BY 1 ASC
        `;

    // Fill in missing days with 0
    const activityByDay: { date: string; count: number }[] = [];
    for (let i = 0; i < timeRange; i++) {
      const d = new Date(now.getTime() - (timeRange - 1 - i) * 24 * 60 * 60 * 1000);
      const dateStr = d.toISOString().split('T')[0];
      const found = activityByDayResult.find(r => new Date(r.date).toISOString().split('T')[0] === dateStr);
      activityByDay.push({ date: dateStr, count: found ? Number(found.count) : 0 });
    }

    // 5. Actions by type (top 15)
    const actionsByTypeResult = await prisma.$queryRaw<{ action: string; count: bigint }[]>`
      SELECT "actionType" as action, COUNT(*) as count
      FROM "audit_logs"
      WHERE "timestamp" >= ${startDate}
      GROUP BY "actionType"
      ORDER BY count DESC
      LIMIT 15
    `;
    const actionsByType: Record<string, number> = {};
    actionsByTypeResult.forEach(row => {
      actionsByType[row.action] = Number(row.count);
    });

    // 6. Certification stats
    const totalApplications = await prisma.sMEProfile.count();
    const certifiedCount = certificationFunnel['certified'] || 0;
    const rejectedCount = certificationFunnel['rejected'] || 0;
    const pendingCount = (certificationFunnel['submitted'] || 0) +
      (certificationFunnel['under_review'] || 0) +
      (certificationFunnel['revision_requested'] || 0);
    const decided = certifiedCount + rejectedCount;
    const approvalRate = decided > 0 ? Math.round((certifiedCount / decided) * 100) : 0;

    // 7. Total actions in period
    const totalActionsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count
      FROM "audit_logs"
      WHERE "timestamp" >= ${startDate}
    `;
    const totalActions = Number(totalActionsResult[0]?.count || 0);

    // ============ PHASE 3: Registry Consumption ============

    // 8a. Registry views by sector
    const viewsBySectorResult = await prisma.$queryRaw<{ sector: string; count: bigint }[]>`
      SELECT sp."industrySector" as sector, COUNT(*) as count
      FROM "audit_logs" a
      JOIN "sme_profiles" sp ON a."targetId" = sp."id"
      WHERE a."actionType" = 'REGISTRY_VIEW'
        AND a."timestamp" >= ${startDate}
        AND sp."industrySector" IS NOT NULL
      GROUP BY sp."industrySector"
      ORDER BY count DESC
    `;
    const viewsBySector: Record<string, number> = {};
    viewsBySectorResult.forEach(row => {
      viewsBySector[row.sector] = Number(row.count);
    });

    // 8b. Total registry views
    const totalViewsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'REGISTRY_VIEW' AND "timestamp" >= ${startDate}
    `;
    const totalRegistryViews = Number(totalViewsResult[0]?.count || 0);

    // 8c. Total registry searches
    const totalSearchesResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'REGISTRY_SEARCH' AND "timestamp" >= ${startDate}
    `;
    const totalSearches = Number(totalSearchesResult[0]?.count || 0);

    // 8d. Text searches vs sector-only searches
    const textSearchesResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'REGISTRY_SEARCH'
        AND "timestamp" >= ${startDate}
        AND "newValue" IS NOT NULL
        AND "newValue"::text LIKE '%"search":"%'
        AND "newValue"::text NOT LIKE '%"search":null%'
        AND "newValue"::text NOT LIKE '%"search":""%'
    `;
    const textSearchCount = Number(textSearchesResult[0]?.count || 0);

    // 8e. Zero-result searches
    const zeroResultsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'REGISTRY_ZERO_RESULTS' AND "timestamp" >= ${startDate}
    `;
    const zeroResultSearches = Number(zeroResultsResult[0]?.count || 0);

    // ============ PHASE 3: Risk & Compliance ============

    // 9a. Missing mandatory docs — certified SMEs with null/empty documents
    const missingDocsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "sme_profiles"
      WHERE "certificationStatus" = 'certified'
        AND ("documents" IS NULL OR "documents"::text = 'null' OR "documents"::text = '{}')
    `;
    const missingDocs = Number(missingDocsResult[0]?.count || 0);

    // 9b. Near-expiry licenses (within 30 days)
    const nearExpiryResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "sme_profiles"
      WHERE "certificationStatus" = 'certified'
        AND "licenseExpiryDate" IS NOT NULL
        AND "licenseExpiryDate" > NOW()
        AND "licenseExpiryDate" <= NOW() + INTERVAL '30 days'
    `;
    const nearExpiry = Number(nearExpiryResult[0]?.count || 0);

    // 9c. Expired licenses
    const expiredResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "sme_profiles"
      WHERE "certificationStatus" = 'certified'
        AND "licenseExpiryDate" IS NOT NULL
        AND "licenseExpiryDate" < NOW()
    `;
    const expiredLicenses = Number(expiredResult[0]?.count || 0);

    // 9d. Admin overrides (LISTING_ENABLED / LISTING_DISABLED)
    const adminOverridesResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" IN ('LISTING_ENABLED', 'LISTING_DISABLED')
        AND "timestamp" >= ${startDate}
    `;
    const adminOverrides = Number(adminOverridesResult[0]?.count || 0);

    // 9e. Rejections count in period
    const rejectionsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATION_REJECT'
        AND "timestamp" >= ${startDate}
    `;
    const rejectionsPeriod = Number(rejectionsResult[0]?.count || 0);

    // ============ PHASE: Certificate Verification Tracking ============

    // 10a. Total verification attempts (all time)
    const totalVerificationsAllTimeResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATE_VERIFICATION_ATTEMPT'
    `;
    const totalVerificationsAllTime = Number(totalVerificationsAllTimeResult[0]?.count || 0);

    // 10b. Verification attempts (in period)
    const verificationsInPeriodResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATE_VERIFICATION_ATTEMPT'
        AND "timestamp" >= ${startDate}
    `;
    const verificationsInPeriod = Number(verificationsInPeriodResult[0]?.count || 0);

    // 10c. Successful verifications
    const successfulVerificationsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATE_VERIFICATION_ATTEMPT'
        AND "timestamp" >= ${startDate}
        AND "newValue"::text LIKE '%"result":"SUCCESS"%'
    `;
    const successfulVerifications = Number(successfulVerificationsResult[0]?.count || 0);

    // 10d. Not found / invalid attempts
    const notFoundVerificationsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATE_VERIFICATION_ATTEMPT'
        AND "timestamp" >= ${startDate}
        AND "newValue"::text LIKE '%"result":"NOT_FOUND"%'
    `;
    const notFoundVerifications = Number(notFoundVerificationsResult[0]?.count || 0);

    // 10e. Channel split (QR vs manual entry)
    const qrVerificationsResult = await prisma.$queryRaw<{ count: bigint }[]>`
      SELECT COUNT(*) as count FROM "audit_logs"
      WHERE "actionType" = 'CERTIFICATE_VERIFICATION_ATTEMPT'
        AND "timestamp" >= ${startDate}
        AND "newValue"::text LIKE '%"lookupMethod":"QR"%'
    `;
    const qrVerifications = Number(qrVerificationsResult[0]?.count || 0);
    const manualVerifications = verificationsInPeriod - qrVerifications;

    return res.json({
      success: true,
      data: {
        timeRange,
        totalActions,
        loginSegmentation,
        usageQuality: {
          uniqueLogins,
          repeatLogins,
          inactiveCertified,
        },
        certificationLifecycle: {
          avgDaysToSubmit,
          funnel: certificationFunnel,
        },
        activityByDay,
        actionsByType,
        certificationStats: {
          total: totalApplications,
          approved: certifiedCount,
          rejected: rejectedCount,
          pending: pendingCount,
          approvalRate,
        },
        registryConsumption: {
          totalViews: totalRegistryViews,
          totalSearches,
          textSearches: textSearchCount,
          sectorSearches: totalSearches - textSearchCount,
          zeroResultSearches,
          viewsBySector,
        },
        riskCompliance: {
          missingDocs,
          nearExpiry,
          expiredLicenses,
          adminOverrides,
          rejectionsPeriod,
        },
        certificateVerification: {
          totalAllTime: totalVerificationsAllTime,
          totalInPeriod: verificationsInPeriod,
          successful: successfulVerifications,
          notFound: notFoundVerifications,
          byChannel: {
            qr: qrVerifications,
            manual: manualVerifications,
          },
        },
      },
    });
  } catch (error) {
    console.error('Get analytics error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics',
    });
  }
};

// GET /api/admin/pending-update-requests - Get pending profile update requests
export const getPendingUpdateRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    // Get all PROFILE_UPDATE_REQUEST audit logs
    const updateRequests = await prisma.auditLog.findMany({
      where: {
        actionType: 'PROFILE_UPDATE_REQUEST',
      },
      orderBy: { timestamp: 'desc' },
      take: 20,
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    // Filter to only include requests that haven't been approved yet
    const pendingRequests = [];
    for (const request of updateRequests) {
      if (request.targetId) {
        // Check if there's a PROFILE_UPDATE_APPROVED or PROFILE_UPDATE_REJECTED entry AFTER this request
        const handledAfter = await prisma.auditLog.findFirst({
          where: {
            actionType: {
              in: ['PROFILE_UPDATE_APPROVED', 'PROFILE_UPDATE_REJECTED'],
            },
            targetId: request.targetId,
            timestamp: {
              gt: request.timestamp,
            },
          },
        });

        // Skip if already handled (approved or rejected)
        if (handledAfter) {
          continue;
        }

        const profile = await prisma.sMEProfile.findUnique({
          where: { id: request.targetId },
          select: {
            id: true,
            companyName: true,
            certificationStatus: true,
          },
        });

        // Only include if profile exists and is certified (still needs approval)
        if (profile && profile.certificationStatus === 'certified') {
          // Parse the reason from newValue JSON
          let reason = '';
          if (request.newValue) {
            try {
              const parsed = JSON.parse(request.newValue);
              reason = parsed.reason || '';
            } catch {
              reason = '';
            }
          }

          pendingRequests.push({
            id: request.id,
            profileId: profile.id,
            companyName: profile.companyName,
            requestedBy: request.user.fullName,
            requestedByEmail: request.user.email,
            reason,
            requestedAt: request.timestamp,
          });
        }
      }
    }

    return res.json({
      success: true,
      data: {
        requests: pendingRequests,
        count: pendingRequests.length,
      },
    });
  } catch (error) {
    console.error('Get pending update requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch pending update requests',
    });
  }
};

// POST /api/admin/reject-update-request/:profileId - Reject profile update request
export const rejectUpdateRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const profileId = req.params.profileId as string;
    const { reason } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get the SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Create audit log for rejection (this marks the request as handled)
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        actionType: 'PROFILE_UPDATE_REJECTED',
        actionDescription: `Rejected profile update request for ${profile.companyName}${reason ? ': ' + reason : ''}`,
        targetType: 'SMEProfile',
        targetId: profileId,
        ipAddress: req.ip || 'unknown',
        newValue: JSON.stringify({ reason: reason || 'No reason provided' }),
      },
    });

    return res.json({
      success: true,
      message: `Profile update request rejected for ${profile.companyName}.`,
      data: {
        id: profile.id,
        companyName: profile.companyName,
      },
    });
  } catch (error) {
    console.error('Reject update request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reject update request',
    });
  }
};

// POST /api/admin/approve-update-request/:profileId - Approve profile update request (allow SME to edit)
export const approveUpdateRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const profileId = req.params.profileId as string;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get the SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { id: profileId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Only certified or submitted profiles can have update requests approved
    if (profile.certificationStatus !== 'certified' &&
        profile.certificationStatus !== 'submitted' &&
        profile.certificationStatus !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: 'This profile does not have an active update request',
      });
    }

    // Update status to revision_requested so SME can edit
    const updatedProfile = await prisma.sMEProfile.update({
      where: { id: profileId },
      data: {
        certificationStatus: CertificationStatus.revision_requested,
        revisionNotes: 'Profile update approved by admin. You can now edit your profile.',
        reviewedById: adminId,
      },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId: adminId,
        actionType: 'PROFILE_UPDATE_APPROVED',
        actionDescription: `Approved profile update request for ${profile.companyName}. SME can now edit their profile.`,
        targetType: 'SMEProfile',
        targetId: profileId,
        ipAddress: req.ip || 'unknown',
        previousValue: JSON.stringify({ status: profile.certificationStatus }),
        newValue: JSON.stringify({ status: 'revision_requested' }),
      },
    });

    return res.json({
      success: true,
      message: `Profile update approved for ${profile.companyName}. SME can now edit their profile.`,
      data: {
        id: updatedProfile.id,
        companyName: updatedProfile.companyName,
        certificationStatus: updatedProfile.certificationStatus,
      },
    });
  } catch (error) {
    console.error('Approve update request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to approve update request',
    });
  }
};

// GET /api/admin/kyc-applications - Get all investor KYC applications
export const getKycApplications = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = req.query.status as string || '';
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {
      investorType: { not: null },
    };

    if (status && status !== 'all') {
      where.kycStatus = status;
    } else {
      // Exclude not_submitted by default unless specifically requested
      where.kycStatus = { not: 'not_submitted' };
    }

    const [applications, total] = await Promise.all([
      prisma.userProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { kycSubmittedAt: 'desc' } as any,
        include: {
          user: {
            select: {
              id: true,
              fullName: true,
              email: true,
              phoneNumber: true,
              isVerified: true,
              createdAt: true,
            },
          },
        },
      }),
      prisma.userProfile.count({ where }),
    ]);

    return res.json({
      success: true,
      data: {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        applications: applications.map((app: any) => ({
          id: app.id,
          userId: app.userId,
          user: app.user,
          investorType: app.investorType,
          kycStatus: app.kycStatus,
          kycSubmittedAt: app.kycSubmittedAt,
          kycReviewedAt: app.kycReviewedAt,
          // Individual fields
          nationality: app.nationality,
          emiratesId: app.emiratesId,
          passportNumber: app.passportNumber,
          // Company fields
          companyName: app.companyName,
          tradeLicenseNumber: app.tradeLicenseNumber,
          registrationNumber: app.registrationNumber,
          // Documents
          kycDocuments: app.kycDocuments,
        })),
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get KYC applications error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC applications',
    });
  }
};

// GET /api/admin/kyc-applications/:id - Get KYC application detail
export const getKycApplicationDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const profile = await prisma.userProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            fullName: true,
            email: true,
            phoneNumber: true,
            profilePicture: true,
            isVerified: true,
            createdAt: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found',
      });
    }

    return res.json({
      success: true,
      data: {
        application: profile,
      },
    });
  } catch (error) {
    console.error('Get KYC application detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch KYC application detail',
    });
  }
};

// POST /api/admin/kyc-applications/:id/review - Review KYC application
export const reviewKycApplication = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const { action, notes } = req.body;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { id },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'KYC application not found',
      });
    }

    const userName = profile.user?.fullName || 'Unknown';
    let newStatus: string;
    let actionDescription: string;

    switch (action) {
      case 'approve':
        newStatus = 'approved';
        actionDescription = `Approved KYC for investor ${userName}`;
        break;
      case 'reject':
        if (!notes) {
          return res.status(400).json({
            success: false,
            message: 'Rejection reason is required',
          });
        }
        newStatus = 'rejected';
        actionDescription = `Rejected KYC for investor ${userName}`;
        break;
      case 'request_revision':
        if (!notes) {
          return res.status(400).json({
            success: false,
            message: 'Revision notes are required',
          });
        }
        newStatus = 'revision_requested';
        actionDescription = `Requested KYC revision for investor ${userName}`;
        break;
      default:
        return res.status(400).json({
          success: false,
          message: 'Invalid action. Must be approve, reject, or request_revision',
        });
    }

    const notesStr = typeof notes === 'string' ? notes : null;

    const updatedProfile = await prisma.userProfile.update({
      where: { id },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: {
        kycStatus: newStatus,
        kycReviewedAt: new Date(),
        kycReviewedBy: adminId,
        kycRejectionReason: action === 'reject' ? notesStr : null,
        kycRevisionNotes: action === 'request_revision' ? notesStr : null,
      } as any,
    });

    // If approved, also verify the user account
    if (action === 'approve') {
      await prisma.user.update({
        where: { id: profile.userId },
        data: { isVerified: true },
      });
    }

    await prisma.auditLog.create({
      data: {
        userId: adminId,
        actionType: `KYC_${action.toUpperCase()}`,
        actionDescription,
        targetType: 'UserProfile',
        targetId: id,
        ipAddress: req.ip || 'unknown',
        newValue: JSON.stringify({ status: newStatus, notes: notesStr }),
      },
    });

    return res.json({
      success: true,
      message: `KYC ${action.replace('_', ' ')} successfully`,
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Review KYC application error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to review KYC application',
    });
  }
};

// POST /api/admin/certificates/:certificateId/revoke - Revoke a certificate
export const revokeCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const certId = req.params.certificateId as string;
    const { reason } = req.body;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Find the certificate
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certId },
      include: {
        smeProfile: {
          select: { companyName: true },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    if (certificate.status === 'revoked') {
      return res.status(400).json({
        success: false,
        message: 'Certificate is already revoked',
      });
    }

    // Revoke the certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { certificateId: certId },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
        revocationReason: reason || null,
      },
    });

    // Create audit log
    await logAuditAction({
      userId: adminId,
      actionType: AuditAction.CERTIFICATE_REVOKED,
      actionDescription: `Revoked certificate ${certId} for ${certificate.smeProfile.companyName}`,
      targetType: 'Certificate',
      targetId: certificate.id,
      ipAddress: getClientIP(req),
      newValue: {
        certificateId: certId,
        reason: reason || 'No reason provided',
        revokedAt: new Date().toISOString(),
      },
    });

    return res.json({
      success: true,
      message: 'Certificate revoked successfully',
      data: {
        certificateId: updatedCertificate.certificateId,
        status: 'revoked',
        revokedAt: updatedCertificate.revokedAt,
        revocationReason: updatedCertificate.revocationReason,
      },
    });
  } catch (error) {
    console.error('Revoke certificate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to revoke certificate',
    });
  }
};

// POST /api/admin/certificates/:certificateId/reissue - Reissue a certificate
export const reissueCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const adminId = req.user?.userId;
    const certId = req.params.certificateId as string;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Find the certificate
    const certificate = await prisma.certificate.findUnique({
      where: { certificateId: certId },
      include: {
        smeProfile: {
          select: { companyName: true, certificationStatus: true },
        },
      },
    });

    if (!certificate) {
      return res.status(404).json({
        success: false,
        message: 'Certificate not found',
      });
    }

    // Only allow reissue for non-revoked certificates of certified SMEs
    if (certificate.smeProfile.certificationStatus !== 'certified') {
      return res.status(400).json({
        success: false,
        message: 'Cannot reissue certificate for non-certified SME',
      });
    }

    // Increment version and recalculate hash
    const newVersion = incrementVersion(certificate.certificateVersion);
    const issuedAt = new Date();
    const expiresAt = calculateExpiryDate(issuedAt);
    const frontendUrl = process.env.FRONTEND_URL || 'https://sme.byredstone.com';

    const newHash = generateVerificationHash({
      certificateId: certificate.certificateId,
      companyName: certificate.companyName,
      tradeLicenseNumber: certificate.tradeLicenseNumber,
      industrySector: certificate.industrySector,
      issuedAt,
      expiresAt,
      version: newVersion,
    });

    // Update the certificate
    const updatedCertificate = await prisma.certificate.update({
      where: { certificateId: certId },
      data: {
        certificateVersion: newVersion,
        issuedAt,
        expiresAt,
        status: 'active',
        revokedAt: null,
        revocationReason: null,
        verificationHash: newHash,
        verificationUrl: buildVerificationUrl(certId, frontendUrl),
        lastReissuedAt: new Date(),
      },
    });

    // Create audit log
    await logAuditAction({
      userId: adminId,
      actionType: AuditAction.CERTIFICATE_REISSUED,
      actionDescription: `Reissued certificate ${certId} (${newVersion}) for ${certificate.smeProfile.companyName}`,
      targetType: 'Certificate',
      targetId: certificate.id,
      ipAddress: getClientIP(req),
      newValue: {
        certificateId: certId,
        version: newVersion,
        expiresAt: expiresAt.toISOString(),
      },
    });

    return res.json({
      success: true,
      message: 'Certificate reissued successfully',
      data: {
        certificateId: updatedCertificate.certificateId,
        version: updatedCertificate.certificateVersion,
        issuedAt: updatedCertificate.issuedAt,
        expiresAt: updatedCertificate.expiresAt,
        status: 'active',
        verificationUrl: updatedCertificate.verificationUrl,
      },
    });
  } catch (error) {
    console.error('Reissue certificate error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to reissue certificate',
    });
  }
};

// Internal Review Dimension Status Types
type DimensionStatus = 'not_reviewed' | 'ready' | 'requires_clarification' | 'under_review' | 'deferred' | 'not_certified';

interface InternalDimensions {
  legal_ownership: DimensionStatus;
  financial_discipline: DimensionStatus;
  business_model: DimensionStatus;
  governance_controls: DimensionStatus;
  risk_continuity: DimensionStatus;
}

const DEFAULT_DIMENSIONS: InternalDimensions = {
  legal_ownership: 'not_reviewed',
  financial_discipline: 'not_reviewed',
  business_model: 'not_reviewed',
  governance_controls: 'not_reviewed',
  risk_continuity: 'not_reviewed',
};

// PUT /api/admin/applications/:id/internal-review - Update internal review dimensions
export const updateInternalReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const adminId = req.user!.userId;
    const { dimensions, internalNotes } = req.body as {
      dimensions?: Partial<InternalDimensions>;
      internalNotes?: string;
    };

    // Get current application
    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        internalDimensions: true,
        internalNotes: true,
        internalReviewStartedAt: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Prepare previous value for audit
    const previousValue = {
      internalDimensions: application.internalDimensions as Record<string, unknown>,
      internalNotes: application.internalNotes,
    };

    // Merge new dimensions with existing
    const existingDimensions = application.internalDimensions
      ? (application.internalDimensions as Record<string, string>)
      : { ...DEFAULT_DIMENSIONS };

    const updatedDimensions = dimensions
      ? { ...existingDimensions, ...dimensions }
      : existingDimensions;

    // Update application
    const updatedApplication = await prisma.sMEProfile.update({
      where: { id },
      data: {
        internalDimensions: updatedDimensions as object,
        internalNotes: internalNotes !== undefined ? internalNotes : application.internalNotes,
        internalReviewStartedAt: application.internalReviewStartedAt || new Date(),
        lastInternalReviewAt: new Date(),
      },
      select: {
        id: true,
        internalDimensions: true,
        internalNotes: true,
        internalReviewStartedAt: true,
        lastInternalReviewAt: true,
      },
    });

    // Create audit log
    await logAuditAction({
      userId: adminId,
      actionType: AuditAction.INTERNAL_REVIEW_UPDATED,
      actionDescription: `Updated internal review for ${application.companyName || 'Unknown Company'}`,
      targetType: 'SMEProfile',
      targetId: id,
      ipAddress: getClientIP(req),
      previousValue,
      newValue: {
        internalDimensions: updatedDimensions,
        internalNotes: internalNotes !== undefined ? internalNotes : application.internalNotes,
      },
    });

    return res.json({
      success: true,
      message: 'Internal review updated successfully',
      data: updatedApplication,
    });
  } catch (error) {
    console.error('Update internal review error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update internal review',
    });
  }
};

// GET /api/admin/applications/:id/internal-review - Get internal review data
export const getInternalReview = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;

    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        internalDimensions: true,
        internalNotes: true,
        internalReviewStartedAt: true,
        lastInternalReviewAt: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Return with default dimensions if not set
    const dimensions = application.internalDimensions
      ? (application.internalDimensions as Record<string, string>)
      : { ...DEFAULT_DIMENSIONS };

    return res.json({
      success: true,
      data: {
        id: application.id,
        companyName: application.companyName,
        dimensions,
        internalNotes: application.internalNotes,
        internalReviewStartedAt: application.internalReviewStartedAt,
        lastInternalReviewAt: application.lastInternalReviewAt,
      },
    });
  } catch (error) {
    console.error('Get internal review error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get internal review',
    });
  }
};

// GET /api/admin/applications/:id/documents - Get documents list for application
export const getApplicationDocuments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const adminId = req.user?.userId;

    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        documents: true,
        userId: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Parse documents
    let documents: Array<{
      id: string;
      type: string;
      name: string;
      originalName: string;
      size: number;
      mimeType: string;
      uploadedAt: string;
      version?: number;
    }> = [];

    if (application.documents) {
      const docsData = typeof application.documents === 'string'
        ? JSON.parse(application.documents)
        : application.documents;
      documents = docsData.uploadedFiles || [];
    }

    return res.json({
      success: true,
      data: {
        applicationId: application.id,
        companyName: application.companyName,
        documents,
        totalCount: documents.length,
      },
    });
  } catch (error) {
    console.error('Get application documents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get documents',
    });
  }
};

// GET /api/admin/applications/:id/documents/:documentId/view - View/download document with audit logging
export const viewDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const id = req.params.id as string;
    const documentId = req.params.documentId as string;
    const adminId = req.user?.userId;

    if (!adminId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const application = await prisma.sMEProfile.findUnique({
      where: { id },
      select: {
        id: true,
        companyName: true,
        documents: true,
        userId: true,
      },
    });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found',
      });
    }

    // Parse documents and find the requested one
    let documents: Array<{
      id: string;
      type: string;
      name: string;
      originalName: string;
      path: string;
      size: number;
      mimeType: string;
    }> = [];

    if (application.documents) {
      const docsData = typeof application.documents === 'string'
        ? JSON.parse(application.documents)
        : application.documents;
      documents = docsData.uploadedFiles || [];
    }

    const document = documents.find(d => d.id === documentId);

    if (!document) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Check if file exists
    const filePath = path.join(__dirname, '../../uploads', application.userId, document.name);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({
        success: false,
        message: 'Document file not found on server',
      });
    }

    // Log the document view
    await logAuditAction({
      userId: adminId,
      actionType: AuditAction.ADMIN_DOCUMENT_VIEWED,
      actionDescription: `Admin viewed document: ${document.originalName} (${document.type})`,
      targetType: 'SMEProfile',
      targetId: application.id,
      ipAddress: getClientIP(req),
      newValue: {
        documentId: document.id,
        documentType: document.type,
        documentName: document.originalName,
        companyName: application.companyName,
      },
    });

    // Send the file
    res.setHeader('Content-Type', document.mimeType);
    res.setHeader('Content-Disposition', `inline; filename="${document.originalName}"`);
    return res.sendFile(filePath);
  } catch (error) {
    console.error('View document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to view document',
    });
  }
};
