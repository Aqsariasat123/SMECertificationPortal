import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import { verifyCertificate } from '../controllers/verify.controller';

const router = Router();

// Rate limiting specific to verification endpoint (stricter than general)
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 requests per 15 minutes per IP
  message: {
    success: false,
    error: 'Too many verification requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Public endpoint - no authentication required
// Rate limited to prevent abuse
router.get('/:certificateId', verifyLimiter, verifyCertificate);

export default router;
