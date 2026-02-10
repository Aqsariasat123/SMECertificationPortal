/**
 * Certification Scoring Controller
 * Handles API endpoints for the 5-pillar certification scoring engine
 */

import { Request, Response } from 'express';
import { PrismaClient, CriterionRating } from '@prisma/client';
import {
  initializePillarAssessments,
  updateSubCriterionScore,
  getPillarAssessments,
  getCertificationDecision,
  calculateCertificationDecision,
  getPillarDefinitions,
  REGULATORY_DISCLAIMER
} from '../services/certificationScoring.service';
import { logAuditAction, AuditAction } from '../utils/auditLogger';

const prisma = new PrismaClient();

/**
 * Get pillar definitions (for frontend to render UI)
 * GET /api/certification-scoring/definitions
 */
export const getDefinitions = async (_req: Request, res: Response): Promise<void> => {
  try {
    const definitions = getPillarDefinitions();
    res.json({
      success: true,
      data: {
        pillars: definitions,
        disclaimer: REGULATORY_DISCLAIMER,
        scoringGuide: {
          green: { value: 3, label: 'GREEN', description: 'No material risk' },
          amber: { value: 2, label: 'AMBER', description: 'Remediable risk' },
          red: { value: 1, label: 'RED', description: 'Structural or non-remediable risk' }
        },
        thresholds: {
          pass: { min: 2.50, label: 'PASS' },
          conditional: { min: 2.00, max: 2.49, label: 'CONDITIONAL' },
          fail: { max: 1.99, label: 'FAIL' }
        }
      }
    });
  } catch (error) {
    console.error('Error getting definitions:', error);
    res.status(500).json({ success: false, message: 'Failed to get pillar definitions' });
  }
};

/**
 * Initialize pillar assessments for an SME application
 * POST /api/certification-scoring/:smeProfileId/initialize
 */
export const initializeAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;
    const userId = req.user?.userId;

    // Verify SME profile exists
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId }
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Initialize assessments
    await initializePillarAssessments(smeProfileId);

    // Log audit
    if (userId) {
      await logAuditAction({
        userId,
        actionType: AuditAction.CERTIFICATION_ASSESSMENT_INITIALIZED,
        actionDescription: `Initialized certification assessments for ${smeProfile.companyName || 'SME'}`,
        targetType: 'SMEProfile',
        targetId: smeProfileId,
        ipAddress: req.ip || undefined
      });
    }

    res.json({
      success: true,
      message: 'Pillar assessments initialized successfully'
    });
  } catch (error) {
    console.error('Error initializing assessments:', error);
    res.status(500).json({ success: false, message: 'Failed to initialize assessments' });
  }
};

/**
 * Get all pillar assessments for an SME
 * GET /api/certification-scoring/:smeProfileId/assessments
 */
export const getAssessments = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;

    // Verify SME profile exists
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId }
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    const assessments = await getPillarAssessments(smeProfileId);

    // If no assessments exist, initialize them
    if (assessments.length === 0) {
      await initializePillarAssessments(smeProfileId);
      const newAssessments = await getPillarAssessments(smeProfileId);
      res.json({ success: true, data: newAssessments });
      return;
    }

    res.json({ success: true, data: assessments });
  } catch (error) {
    console.error('Error getting assessments:', error);
    res.status(500).json({ success: false, message: 'Failed to get assessments' });
  }
};

/**
 * Update a sub-criterion score
 * PUT /api/certification-scoring/:smeProfileId/pillar/:pillarNumber/criterion/:criterionCode
 */
export const updateCriterionScore = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;
    const pillarNumber = req.params.pillarNumber as string;
    const criterionCode = req.params.criterionCode as string;
    const { rating, notes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    // Validate rating
    const validRatings: CriterionRating[] = ['not_rated', 'green', 'amber', 'red'];
    if (!validRatings.includes(rating)) {
      res.status(400).json({ success: false, message: 'Invalid rating. Must be: not_rated, green, amber, or red' });
      return;
    }

    // Verify SME profile exists
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId }
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Update the score
    const result = await updateSubCriterionScore(
      smeProfileId,
      parseInt(pillarNumber, 10),
      criterionCode,
      rating,
      notes || null,
      userId
    );

    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }

    // Log audit
    await logAuditAction({
      userId,
      actionType: AuditAction.CRITERION_SCORE_UPDATED,
      actionDescription: `Updated criterion ${criterionCode} to ${rating} for ${smeProfile.companyName || 'SME'}`,
      targetType: 'PillarAssessment',
      targetId: result.pillarAssessment.id,
      ipAddress: req.ip || undefined,
      newValue: { rating, notes, pillarNumber, criterionCode }
    });

    res.json({
      success: true,
      data: result.pillarAssessment,
      message: result.message
    });
  } catch (error) {
    console.error('Error updating criterion score:', error);
    res.status(500).json({ success: false, message: 'Failed to update criterion score' });
  }
};

/**
 * Update assessor notes for a pillar
 * PUT /api/certification-scoring/:smeProfileId/pillar/:pillarNumber/notes
 */
export const updatePillarNotes = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;
    const pillarNumber = req.params.pillarNumber as string;
    const { assessorNotes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const updated = await prisma.pillarAssessment.update({
      where: {
        smeProfileId_pillarNumber: {
          smeProfileId,
          pillarNumber: parseInt(pillarNumber, 10)
        }
      },
      data: {
        assessorNotes,
        assessedById: userId,
        assessedAt: new Date()
      }
    });

    res.json({ success: true, data: updated });
  } catch (error) {
    console.error('Error updating pillar notes:', error);
    res.status(500).json({ success: false, message: 'Failed to update pillar notes' });
  }
};

/**
 * Get certification decision for an SME
 * GET /api/certification-scoring/:smeProfileId/decision
 */
export const getDecision = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;

    const decision = await getCertificationDecision(smeProfileId);

    if (!decision) {
      res.json({
        success: true,
        data: null,
        message: 'No decision record exists yet'
      });
      return;
    }

    res.json({ success: true, data: decision });
  } catch (error) {
    console.error('Error getting decision:', error);
    res.status(500).json({ success: false, message: 'Failed to get decision' });
  }
};

/**
 * Calculate and finalize certification decision
 * POST /api/certification-scoring/:smeProfileId/decision/calculate
 */
export const calculateDecision = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;
    const { decisionNotes } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    // Verify SME profile exists
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId }
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Calculate decision
    const result = await calculateCertificationDecision(smeProfileId, userId, decisionNotes || null);

    if (!result.success) {
      res.status(400).json({ success: false, message: result.message });
      return;
    }

    // Log audit
    await logAuditAction({
      userId,
      actionType: AuditAction.CERTIFICATION_DECISION_CALCULATED,
      actionDescription: `Calculated certification decision: ${result.decision.outcome} for ${smeProfile.companyName || 'SME'}`,
      targetType: 'CertificationDecision',
      targetId: result.decision.id,
      ipAddress: req.ip || undefined,
      newValue: {
        outcome: result.decision.outcome,
        decisionPath: result.decision.decisionPath,
        overallWeightedScore: String(result.decision.overallWeightedScore)
      }
    });

    res.json({
      success: true,
      data: result.decision,
      message: result.message
    });
  } catch (error) {
    console.error('Error calculating decision:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate decision' });
  }
};

/**
 * Get scoring summary for an SME (overview of all pillars)
 * GET /api/certification-scoring/:smeProfileId/summary
 */
export const getScoringSummary = async (req: Request, res: Response): Promise<void> => {
  try {
    const smeProfileId = req.params.smeProfileId as string;

    // Get SME profile
    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { id: smeProfileId },
      select: {
        id: true,
        companyName: true,
        certificationStatus: true
      }
    });

    if (!smeProfile) {
      res.status(404).json({ success: false, message: 'SME profile not found' });
      return;
    }

    // Get assessments
    const assessments = await getPillarAssessments(smeProfileId);

    // Get decision
    const decision = await getCertificationDecision(smeProfileId);

    // Calculate progress
    let totalCriteria = 0;
    let ratedCriteria = 0;
    let completedPillars = 0;

    for (const assessment of assessments) {
      const scores = (assessment.subCriteriaScores as Array<{ rating: string }>) || [];
      totalCriteria += scores.length;
      ratedCriteria += scores.filter((s) => s.rating !== 'not_rated').length;
      if (assessment.status === 'pass' || assessment.status === 'conditional' || assessment.status === 'fail') {
        completedPillars++;
      }
    }

    res.json({
      success: true,
      data: {
        smeProfile,
        progress: {
          totalPillars: 5,
          completedPillars,
          totalCriteria,
          ratedCriteria,
          percentComplete: totalCriteria > 0 ? Math.round((ratedCriteria / totalCriteria) * 100) : 0
        },
        pillars: assessments.map(a => ({
          pillarNumber: a.pillarNumber,
          pillarName: a.pillarName,
          status: a.status,
          weightedScore: a.weightedScore,
          autoFailTriggered: a.autoFailTriggered,
          autoFailReason: a.autoFailReason
        })),
        decision: decision ? {
          outcome: decision.outcome,
          overallWeightedScore: decision.overallWeightedScore,
          decisionPath: decision.decisionPath,
          decidedAt: decision.decidedAt
        } : null
      }
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({ success: false, message: 'Failed to get summary' });
  }
};

export default {
  getDefinitions,
  initializeAssessments,
  getAssessments,
  updateCriterionScore,
  updatePillarNotes,
  getDecision,
  calculateDecision,
  getScoringSummary
};
