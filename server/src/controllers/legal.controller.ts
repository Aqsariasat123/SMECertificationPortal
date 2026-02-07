import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { logAuditAction, AuditAction, getClientIP } from '../utils/auditLogger';
import { emailService } from '../services/email.service';

const prisma = new PrismaClient();

// GET /api/legal — Admin, list all legal pages
export const getAllLegalPages = async (_req: Request, res: Response): Promise<void> => {
  try {
    const pages = await prisma.legalPage.findMany({
      orderBy: { slug: 'asc' },
      select: { slug: true, title: true, content: true, lastUpdated: true, isPublished: true },
    });

    res.json({
      success: true,
      message: 'Legal pages retrieved successfully',
      data: pages,
    });
  } catch (error) {
    console.error('Error fetching legal pages:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch legal pages' });
  }
};

// GET /api/legal/:slug — Public, no auth required
export const getLegalPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const slug = req.params.slug as string;

    const page = await prisma.legalPage.findUnique({
      where: { slug },
    });

    if (!page || !page.isPublished) {
      res.status(404).json({
        success: false,
        message: 'Page not found',
      });
      return;
    }

    res.json({
      success: true,
      message: 'Legal page retrieved successfully',
      data: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        lastUpdated: page.lastUpdated,
      },
    });
  } catch (error) {
    console.error('Error fetching legal page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch legal page',
    });
  }
};

// PUT /api/legal/:slug — Admin only
export const updateLegalPage = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const slug = req.params.slug as string;
    const { title, content, isPublished } = req.body;

    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const existing = await prisma.legalPage.findUnique({ where: { slug } });

    const page = await prisma.legalPage.upsert({
      where: { slug },
      update: {
        ...(title !== undefined && { title }),
        ...(content !== undefined && { content }),
        ...(isPublished !== undefined && { isPublished }),
        lastUpdated: new Date(),
        updatedBy: authReq.user.userId,
      },
      create: {
        slug,
        title: title || slug,
        content: content || '',
        isPublished: isPublished ?? true,
        lastUpdated: new Date(),
        updatedBy: authReq.user.userId,
      },
    });

    await logAuditAction({
      userId: authReq.user.userId,
      actionType: AuditAction.LEGAL_PAGE_UPDATED,
      actionDescription: `Updated legal page: ${slug}`,
      targetType: 'LegalPage',
      targetId: page.id,
      ipAddress: getClientIP(req),
      previousValue: existing ? { title: existing.title, content: existing.content.substring(0, 200) } : null,
      newValue: { title: page.title, content: page.content.substring(0, 200) },
    });

    res.json({
      success: true,
      message: 'Legal page updated successfully',
      data: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        lastUpdated: page.lastUpdated,
        isPublished: page.isPublished,
      },
    });
  } catch (error) {
    console.error('Error updating legal page:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update legal page',
    });
  }
};

// POST /api/legal/:slug/notify — Admin only, send email notification to all users
export const notifyLegalUpdate = async (req: Request, res: Response): Promise<void> => {
  try {
    const authReq = req as AuthenticatedRequest;
    const slug = req.params.slug as string;

    if (!authReq.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    // Check if page exists
    const page = await prisma.legalPage.findUnique({ where: { slug } });

    if (!page) {
      res.status(404).json({ success: false, message: 'Legal page not found' });
      return;
    }

    // Get count of users to notify
    const userCount = await prisma.user.count({
      where: {
        isActive: true,
        emailVerified: true,
      },
    });

    if (userCount === 0) {
      res.json({
        success: true,
        message: 'No users to notify',
        data: { sent: 0, failed: 0 },
      });
      return;
    }

    // Send bulk notification
    const result = await emailService.sendBulkLegalUpdateNotification(
      page.title,
      page.slug,
      authReq.user.userId
    );

    res.json({
      success: true,
      message: `Notification sent to ${result.sent} users`,
      data: result,
    });
  } catch (error) {
    console.error('Error sending legal update notification:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send notification',
    });
  }
};
