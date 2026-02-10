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
  googleAuth,
  verify2FALogin,
  enable2FA,
  confirm2FASetup,
  disable2FA,
  get2FAStatus,
  resend2FAOTP,
  initUAEPassAuth,
  uaePassCallback,
} from '../controllers/auth.controller';

const router = Router();

// Public routes
router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/verify/:token', verifyEmail);
router.post('/resend-verification', resendVerification);

// OAuth routes
router.post('/google', googleAuth);

// UAE Pass routes
router.get('/uaepass/init', initUAEPassAuth);
router.post('/uaepass/callback', uaePassCallback);

// 2FA routes (public - for login verification)
router.post('/2fa/verify', verify2FALogin);
router.post('/2fa/resend', resend2FAOTP);

// 2FA routes (protected - for managing 2FA settings)
router.get('/2fa/status', authenticate, get2FAStatus);
router.post('/2fa/enable', authenticate, enable2FA);
router.post('/2fa/confirm-setup', authenticate, confirm2FASetup);
router.post('/2fa/disable', authenticate, disable2FA);

// Protected routes
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
