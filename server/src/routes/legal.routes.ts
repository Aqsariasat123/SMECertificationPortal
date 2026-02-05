import { Router } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { getAllLegalPages, getLegalPage, updateLegalPage } from '../controllers/legal.controller';

const router = Router();

// Admin — list all legal pages
router.get('/', authenticate, authorize('admin'), getAllLegalPages);

// Public — no auth required
router.get('/:slug', getLegalPage);

// Admin only — update legal page content
router.put('/:slug', authenticate, authorize('admin'), updateLegalPage);

export default router;
