import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// GET /api/registry - Get certified SMEs for the public registry
export const getCertifiedSMEs = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = (req.query.search as string) || '';
    const sector = (req.query.sector as string) || '';
    const skip = (page - 1) * limit;

    const where: any = {
      certificationStatus: 'certified',
      listingVisible: true,
    };

    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { companyDescription: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (sector) {
      where.industrySector = sector;
    }

    const [smesRaw, total] = await Promise.all([
      prisma.sMEProfile.findMany({
        where,
        skip,
        take: limit,
        orderBy: { updatedAt: 'desc' },
        select: {
          id: true,
          companyName: true,
          companyDescription: true,
          industrySector: true,
          employeeCount: true,
          website: true,
          updatedAt: true,
          documents: true,
        },
      }),
      prisma.sMEProfile.count({ where }),
    ]);

    // Extract companyLogo from documents for each SME
    const smes = smesRaw.map(sme => {
      let companyLogo = null;
      if (sme.documents && typeof sme.documents === 'object') {
        const docs = sme.documents as Record<string, unknown>;
        companyLogo = docs.companyLogo || null;
      }
      return {
        id: sme.id,
        companyName: sme.companyName,
        companyDescription: sme.companyDescription,
        industrySector: sme.industrySector,
        employeeCount: sme.employeeCount,
        website: sme.website,
        updatedAt: sme.updatedAt,
        companyLogo,
      };
    });

    // Get unique sectors for filtering
    const sectors = await prisma.sMEProfile.findMany({
      where: {
        certificationStatus: 'certified',
        listingVisible: true,
        industrySector: { not: null },
      },
      select: {
        industrySector: true,
      },
      distinct: ['industrySector'],
    });

    const uniqueSectors = sectors
      .map(s => s.industrySector)
      .filter(Boolean) as string[];

    return res.json({
      success: true,
      data: {
        smes,
        sectors: uniqueSectors,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error('Get certified SMEs error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch certified SMEs',
    });
  }
};

// GET /api/registry/:profileId - Get single SME profile detail
export const getSMEDetail = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const profileId = req.params.profileId as string;

    const sme = await prisma.sMEProfile.findFirst({
      where: {
        id: profileId,
        certificationStatus: 'certified',
        listingVisible: true,
      },
      select: {
        id: true,
        companyName: true,
        companyDescription: true,
        industrySector: true,
        employeeCount: true,
        website: true,
        address: true,
        foundingDate: true,
        updatedAt: true,
        documents: true,
      },
    });

    if (!sme) {
      return res.status(404).json({
        success: false,
        message: 'SME not found or not visible in registry',
      });
    }

    // Extract public contact info and company logo from documents JSON if available
    let contactInfo = null;
    let companyLogo = null;
    if (sme.documents && typeof sme.documents === 'object') {
      const docs = sme.documents as Record<string, unknown>;
      contactInfo = {
        contactName: docs.contactName || null,
        contactPosition: docs.contactPosition || null,
        contactEmail: docs.contactEmail || null,
        contactPhone: docs.contactPhone || null,
      };
      companyLogo = docs.companyLogo || null;
    }

    return res.json({
      success: true,
      data: {
        ...sme,
        contactInfo,
        companyLogo,
        documents: undefined, // Don't expose raw documents
      },
    });
  } catch (error) {
    console.error('Get SME detail error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch SME details',
    });
  }
};

// POST /api/registry/:profileId/request-introduction - Request introduction to an SME
export const requestIntroduction = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId as string;
    const profileId = req.params.profileId as string;
    const { message } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Verify the SME exists and is visible
    const sme = await prisma.sMEProfile.findFirst({
      where: {
        id: profileId,
        certificationStatus: 'certified',
        listingVisible: true,
      },
      select: {
        id: true,
        companyName: true,
        userId: true,
      },
    });

    if (!sme) {
      return res.status(404).json({
        success: false,
        message: 'SME not found or not available for introductions',
      });
    }

    // Check if user already requested introduction to this SME
    const existingRequest = await prisma.introductionRequest.findFirst({
      where: {
        requesterId: userId,
        smeProfileId: profileId,
        status: 'pending',
      },
    });

    if (existingRequest) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active introduction request to this SME',
      });
    }

    // Create introduction request
    const introRequest = await prisma.introductionRequest.create({
      data: {
        requesterId: userId,
        smeProfileId: profileId,
        message: message || '',
        status: 'pending',
      },
      include: {
        smeProfile: {
          select: {
            companyName: true,
          },
        },
      },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'INTRODUCTION_REQUESTED',
        actionDescription: `Requested introduction to ${sme.companyName}`,
        targetType: 'IntroductionRequest',
        targetId: introRequest.id,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Introduction request sent successfully',
      data: {
        id: introRequest.id,
        smeCompanyName: introRequest.smeProfile.companyName,
        status: introRequest.status,
        createdAt: introRequest.requestedDate,
      },
    });
  } catch (error) {
    console.error('Request introduction error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send introduction request',
    });
  }
};
