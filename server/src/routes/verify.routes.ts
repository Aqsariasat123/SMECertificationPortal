import { Router } from 'express';
import { verifyCertificate } from '../controllers/verify.controller';

const router = Router();

// Public endpoint - no authentication required
router.get('/:certificateId', verifyCertificate);

export default router;
