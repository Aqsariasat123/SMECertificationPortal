import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getLegalPage, updateLegalPage } from '../controllers/legal.controller';

const router = Router();

// Public — no auth required
router.get('/:slug', getLegalPage);

// Admin only — update legal page content
router.put('/:slug', authenticate, authorize('admin'), updateLegalPage);

export default router;
