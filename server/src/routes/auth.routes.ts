import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import {
  register,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  getMe,
  logout,
  resendVerification,
} from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
