import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import {
  getCertifiedSMEs,
  getSMEDetail,
  requestIntroduction,
} from '../controllers/registry.controller';

const router = Router();

// All registry routes require authentication
router.use(authenticate);

// GET /api/registry - Get certified companies (any authenticated user)
router.get('/', getCertifiedSMEs);

// GET /api/registry/:profileId - Get company profile detail
router.get('/:profileId', getSMEDetail);

// POST /api/registry/:profileId/request-introduction - Request introduction (users only)
router.post('/:profileId/request-introduction', authorize('user'), requestIntroduction);

export default router;
