/**
 * Certification Scoring Routes
 * API endpoints for the 5-pillar certification scoring engine
 */

import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getDefinitions,
  initializeAssessments,
  getAssessments,
  updateCriterionScore,
  updatePillarNotes,
  getDecision,
  calculateDecision,
  getScoringSummary
} from '../controllers/certificationScoring.controller';

const router = Router();

// Public route - get pillar definitions (for reference)
router.get('/definitions', getDefinitions);

// Protected routes - require admin role
router.use(authenticate);
router.use(authorize('admin'));

// Initialize pillar assessments for an SME
router.post('/:smeProfileId/initialize', initializeAssessments);

// Get all pillar assessments for an SME
router.get('/:smeProfileId/assessments', getAssessments);

// Update a sub-criterion score
router.put('/:smeProfileId/pillar/:pillarNumber/criterion/:criterionCode', updateCriterionScore);

// Update assessor notes for a pillar
router.put('/:smeProfileId/pillar/:pillarNumber/notes', updatePillarNotes);

// Get certification decision
router.get('/:smeProfileId/decision', getDecision);

// Calculate and finalize certification decision
router.post('/:smeProfileId/decision/calculate', calculateDecision);

// Get scoring summary (overview)
router.get('/:smeProfileId/summary', getScoringSummary);

export default router;
