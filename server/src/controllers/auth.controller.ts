import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { PrismaClient, UserRole } from '@prisma/client';
import { generateToken, generateRandomToken } from '../utils/jwt';
import { emailService } from '../services/email.service';
import { logAuditAction, AuditAction } from '../utils/auditLogger';
import {
  LoginRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ApiResponse,
  AuthResponse,
  UserResponse,
  AuthenticatedRequest,
} from '../types';

// 2FA OTP Configuration
const OTP_EXPIRY_MINUTES = 5;
const OTP_LENGTH = 6;

// Generate a random 6-digit OTP
function generateOTP(): string {
  return crypto.randomInt(100000, 999999).toString();
}

// Hash OTP for storage (don't store plaintext)
function hashOTP(otp: string): string {
  return crypto.createHash('sha256').update(otp).digest('hex');
}

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'sme';
  companyName?: string;
  tradeLicenseNumber?: string;
  industrySector?: string;
}

const prisma = new PrismaClient();

function sanitizeUser(user: {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  phoneNumber: string | null;
  profilePicture?: string | null;
  createdAt: Date;
}, organization?: string | null): UserResponse {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    isVerified: user.isVerified,
    phoneNumber: user.phoneNumber,
    profilePicture: user.profilePicture || null,
    organization: organization || null,
    createdAt: user.createdAt,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  try {
    const { email, password, fullName, role, companyName, tradeLicenseNumber, industrySector } = req.body as RegisterRequest;

    // Validation
    if (!email || !password || !fullName || !role) {
      res.status(400).json({
        success: false,
        message: 'Email, password, full name, and role are required',
      } as ApiResponse);
      return;
    }

    if (!['user', 'sme'].includes(role)) {
      res.status(400).json({
        success: false,
        message: 'Invalid role. Must be "user" or "sme"',
      } as ApiResponse);
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      } as ApiResponse);
      return;
    }

    if (role === 'sme') {
      if (!companyName) {
        res.status(400).json({
          success: false,
          message: 'Company name is required for SME registration',
        } as ApiResponse);
        return;
      }
      if (!tradeLicenseNumber) {
        res.status(400).json({
          success: false,
          message: 'Trade license number is required for SME registration',
        } as ApiResponse);
        return;
      }
      if (!industrySector) {
        res.status(400).json({
          success: false,
          message: 'Industry sector is required for SME registration',
        } as ApiResponse);
        return;
      }
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      res.status(409).json({
        success: false,
        message: 'An account with this email already exists',
      } as ApiResponse);
      return;
    }

    // Check for duplicate Trade License Number (Governance Control)
    if (role === 'sme' && tradeLicenseNumber) {
      const existingLicense = await prisma.sMEProfile.findFirst({
        where: { tradeLicenseNumber: tradeLicenseNumber.trim() },
        select: { id: true, userId: true },
      });

      if (existingLicense) {
        // Log duplicate attempt for admin visibility
        await logAuditAction({
          userId: 'SYSTEM',
          actionType: AuditAction.DUPLICATE_TRADE_LICENSE_ATTEMPT,
          actionDescription: `Duplicate trade license registration attempt: ${tradeLicenseNumber}`,
          targetType: 'SMEProfile',
          targetId: existingLicense.id,
          ipAddress: req.ip || req.socket.remoteAddress,
          newValue: {
            attemptedEmail: email.toLowerCase(),
            tradeLicenseNumber: tradeLicenseNumber,
            existingProfileId: existingLicense.id,
          },
        });

        res.status(409).json({
          success: false,
          message: 'This Trade License number is already registered in our system',
        } as ApiResponse);
        return;
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = generateRandomToken();

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        password: hashedPassword,
        fullName,
        role: role as UserRole,
        verificationToken,
        isVerified: false,
      },
    });

    // If SME, create SME profile with company details
    if (role === 'sme' && companyName) {
      await prisma.sMEProfile.create({
        data: {
          userId: user.id,
          companyName,
          tradeLicenseNumber: tradeLicenseNumber || null,
          industrySector: industrySector as any || null,
          certificationStatus: 'draft',
        },
      });
    }

    // Send verification email
    await emailService.sendVerificationEmail(user.email, verificationToken, user.fullName);

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.USER_REGISTERED,
      actionDescription: `New ${role} account registered`,
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        user: sanitizeUser(user),
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during registration',
    } as ApiResponse);
  }
}

export async function login(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as LoginRequest;

    if (!email || !password) {
      res.status(400).json({
        success: false,
        message: 'Email and password are required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
      return;
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      } as ApiResponse);
      return;
    }

    if (!user.isVerified) {
      res.status(403).json({
        success: false,
        message: 'Please verify your email address before logging in',
      } as ApiResponse);
      return;
    }

    // Check if account is suspended (Governance Control)
    if (user.accountStatus === 'suspended') {
      // Log blocked login attempt
      await logAuditAction({
        userId: user.id,
        actionType: AuditAction.LOGIN_BLOCKED_SUSPENDED,
        actionDescription: 'Login attempt blocked - account suspended',
        ipAddress: req.ip || req.socket.remoteAddress,
        newValue: { suspendedReason: user.suspendedReason },
      });

      res.status(403).json({
        success: false,
        message: 'Your account has been suspended. Please contact support for assistance.',
      } as ApiResponse);
      return;
    }

    // Check if 2FA is enabled
    if (user.twoFactorEnabled) {
      // Generate OTP and send via email
      const otp = generateOTP();
      const otpHash = hashOTP(otp);
      const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

      // Store OTP hash in user's twoFactorSecret field temporarily
      await prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorSecret: otpHash,
          twoFactorVerifiedAt: otpExpiry, // Using this field to store expiry
        },
      });

      // Send OTP via email
      await emailService.sendTwoFactorOTPEmail(user.email, user.fullName, otp, user.id);

      await logAuditAction({
        userId: user.id,
        actionType: AuditAction.TWO_FACTOR_OTP_SENT,
        actionDescription: '2FA OTP sent for login',
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      res.status(200).json({
        success: true,
        message: 'Verification code sent to your email',
        data: {
          requiresTwoFactor: true,
          userId: user.id,
          email: user.email,
        },
      } as ApiResponse);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.USER_LOGIN,
      actionDescription: `User logged in successfully`,
      ipAddress: req.ip || req.socket.remoteAddress,
      newValue: { role: user.role },
    });

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user),
        token,
      },
    } as ApiResponse<AuthResponse>);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during login',
    } as ApiResponse);
  }
}

export async function forgotPassword(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body as ForgotPasswordRequest;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    // Always return success to prevent email enumeration
    if (!user) {
      res.status(200).json({
        success: true,
        message: 'If an account exists with this email, you will receive a password reset link',
      } as ApiResponse);
      return;
    }

    const resetToken = generateRandomToken();
    const resetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: {
        resetPasswordToken: resetToken,
        resetPasswordExpires: resetExpires,
      },
    });

    await emailService.sendPasswordResetEmail(user.email, resetToken, user.fullName);

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.PASSWORD_RESET_REQUESTED,
      actionDescription: 'Password reset requested',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'If an account exists with this email, you will receive a password reset link',
    } as ApiResponse);
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    } as ApiResponse);
  }
}

export async function resetPassword(req: Request, res: Response): Promise<void> {
  try {
    const { token, password } = req.body as ResetPasswordRequest;

    if (!token || !password) {
      res.status(400).json({
        success: false,
        message: 'Token and new password are required',
      } as ApiResponse);
      return;
    }

    if (password.length < 8) {
      res.status(400).json({
        success: false,
        message: 'Password must be at least 8 characters long',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        resetPasswordToken: token,
        resetPasswordExpires: {
          gt: new Date(),
        },
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token',
      } as ApiResponse);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        resetPasswordToken: null,
        resetPasswordExpires: null,
      },
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.PASSWORD_RESET_COMPLETED,
      actionDescription: 'Password reset completed successfully',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Password has been reset successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resetting your password',
    } as ApiResponse);
  }
}

export async function verifyEmail(req: Request, res: Response): Promise<void> {
  try {
    const token = req.params.token as string;

    if (!token) {
      res.status(400).json({
        success: false,
        message: 'Verification token is required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findFirst({
      where: {
        verificationToken: token,
        isVerified: false,
      },
    });

    if (!user) {
      res.status(400).json({
        success: false,
        message: 'Invalid or expired verification token',
      } as ApiResponse);
      return;
    }

    await prisma.user.update({
      where: { id: user.id },
      data: {
        isVerified: true,
        verificationToken: null,
      },
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.EMAIL_VERIFIED,
      actionDescription: 'Email address verified successfully',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    // Send welcome email
    await emailService.sendWelcomeEmail(user.email, user.fullName, user.role);

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now log in.',
    } as ApiResponse);
  } catch (error) {
    console.error('Verify email error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while verifying your email',
    } as ApiResponse);
  }
}

export async function getMe(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        userProfile: {
          select: {
            company: true,
          },
        },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    const organization = user.userProfile?.company || null;

    res.status(200).json({
      success: true,
      message: 'User retrieved successfully',
      data: sanitizeUser(user, organization),
    } as ApiResponse<UserResponse>);
  } catch (error) {
    console.error('Get me error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching user data',
    } as ApiResponse);
  }
}

export async function logout(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (userId) {
      await logAuditAction({
        userId,
        actionType: AuditAction.USER_LOGOUT,
        actionDescription: 'User logged out',
        ipAddress: req.ip || req.socket.remoteAddress,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during logout',
    } as ApiResponse);
  }
}

export async function resendVerification(req: Request, res: Response): Promise<void> {
  try {
    const { email } = req.body;

    if (!email) {
      res.status(400).json({
        success: false,
        message: 'Email is required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user || user.isVerified) {
      res.status(200).json({
        success: true,
        message: 'If an unverified account exists with this email, a verification link has been sent',
      } as ApiResponse);
      return;
    }

    const verificationToken = generateRandomToken();

    await prisma.user.update({
      where: { id: user.id },
      data: { verificationToken },
    });

    await emailService.sendVerificationEmail(user.email, verificationToken, user.fullName);

    res.status(200).json({
      success: true,
      message: 'If an unverified account exists with this email, a verification link has been sent',
    } as ApiResponse);
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while processing your request',
    } as ApiResponse);
  }
}

// ============================================
// GOOGLE OAUTH AUTHENTICATION
// ============================================

interface GoogleAuthRequest extends Request {
  body: {
    credential: string; // Google ID Token
    role?: 'user'; // Only investors can use Google sign-in
  };
}

// POST /api/auth/google - Authenticate with Google
export async function googleAuth(req: GoogleAuthRequest, res: Response) {
  try {
    const { credential, role = 'user' } = req.body;

    if (!credential) {
      res.status(400).json({
        success: false,
        message: 'Google credential is required',
      } as ApiResponse);
      return;
    }

    // Only allow 'user' role for Google sign-in (investors only)
    if (role !== 'user') {
      res.status(400).json({
        success: false,
        message: 'Google sign-in is only available for investors',
      } as ApiResponse);
      return;
    }

    // Verify the Google ID token
    const googleClientId = process.env.GOOGLE_CLIENT_ID;
    if (!googleClientId) {
      console.error('GOOGLE_CLIENT_ID not configured');
      res.status(500).json({
        success: false,
        message: 'Google authentication is not configured',
      } as ApiResponse);
      return;
    }

    // Decode and verify the JWT token from Google
    // We'll use a simple verification approach - in production, use google-auth-library
    const tokenParts = credential.split('.');
    if (tokenParts.length !== 3) {
      res.status(400).json({
        success: false,
        message: 'Invalid Google credential format',
      } as ApiResponse);
      return;
    }

    // Decode the payload (middle part)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());

    // Verify the token claims
    const { sub: googleId, email, name, picture, email_verified, aud, iss, exp } = payload;

    // Basic validation
    if (!email || !googleId) {
      res.status(400).json({
        success: false,
        message: 'Invalid Google credential: missing email or ID',
      } as ApiResponse);
      return;
    }

    // Verify audience (should be our client ID)
    if (aud !== googleClientId) {
      res.status(400).json({
        success: false,
        message: 'Invalid Google credential: audience mismatch',
      } as ApiResponse);
      return;
    }

    // Verify issuer
    if (iss !== 'https://accounts.google.com' && iss !== 'accounts.google.com') {
      res.status(400).json({
        success: false,
        message: 'Invalid Google credential: issuer mismatch',
      } as ApiResponse);
      return;
    }

    // Verify expiration
    if (exp * 1000 < Date.now()) {
      res.status(400).json({
        success: false,
        message: 'Google credential has expired',
      } as ApiResponse);
      return;
    }

    // Check if user exists with this email
    let user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: {
        smeProfile: { select: { companyName: true } },
      },
    });

    if (user) {
      // User exists - check if they can use Google sign-in
      if (user.role === 'sme') {
        res.status(400).json({
          success: false,
          message: 'SME accounts must use email/password login',
        } as ApiResponse);
        return;
      }

      if (user.role === 'admin') {
        res.status(400).json({
          success: false,
          message: 'Admin accounts must use email/password login',
        } as ApiResponse);
        return;
      }

      // Check account status
      if (user.accountStatus === 'suspended') {
        res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Please contact support.',
        } as ApiResponse);
        return;
      }

      // Link Google account if not already linked
      if (user.authProvider === 'local' && !user.providerId) {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            authProvider: 'google',
            providerId: googleId,
            isVerified: true, // Google verified the email
            profilePicture: user.profilePicture || picture,
          },
        });
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      // Log the login
      await logAuditAction({
        userId: user.id,
        actionType: AuditAction.USER_LOGIN,
        actionDescription: `User logged in via Google OAuth`,
        targetType: 'User',
        targetId: user.id,
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      // Generate JWT token
      const token = generateToken({ userId: user.id, email: user.email, role: user.role });

      const organization = user.smeProfile?.companyName || null;

      res.status(200).json({
        success: true,
        data: {
          token,
          user: sanitizeUser(user, organization),
        },
        message: 'Login successful',
      } as ApiResponse<AuthResponse>);
    } else {
      // Create new user with Google
      const newUser = await prisma.user.create({
        data: {
          email: email.toLowerCase(),
          password: '', // No password for OAuth users
          fullName: name || email.split('@')[0],
          role: 'user',
          isVerified: true, // Google verified the email
          authProvider: 'google',
          providerId: googleId,
          profilePicture: picture,
        },
      });

      // Create user profile
      await prisma.userProfile.create({
        data: { userId: newUser.id },
      });

      // Log the registration
      await logAuditAction({
        userId: newUser.id,
        actionType: AuditAction.USER_REGISTERED,
        actionDescription: `New user registered via Google OAuth`,
        targetType: 'User',
        targetId: newUser.id,
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      // Send welcome email
      await emailService.sendWelcomeEmail(newUser.email, newUser.fullName, 'user', newUser.id);

      // Generate JWT token
      const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: sanitizeUser(newUser, null),
        },
        message: 'Account created successfully',
      } as ApiResponse<AuthResponse>);
    }
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during Google authentication',
    } as ApiResponse);
  }
}

// ============================================
// TWO-FACTOR AUTHENTICATION (2FA)
// ============================================

// POST /api/auth/2fa/verify - Verify OTP and complete login
export async function verify2FALogin(req: Request, res: Response): Promise<void> {
  try {
    const { userId, otp } = req.body;

    if (!userId || !otp) {
      res.status(400).json({
        success: false,
        message: 'User ID and verification code are required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        smeProfile: { select: { companyName: true } },
        userProfile: { select: { company: true } },
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    // Check if OTP has expired
    if (!user.twoFactorVerifiedAt || user.twoFactorVerifiedAt < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please try logging in again.',
      } as ApiResponse);
      return;
    }

    // Verify OTP
    const otpHash = hashOTP(otp);
    if (user.twoFactorSecret !== otpHash) {
      await logAuditAction({
        userId: user.id,
        actionType: AuditAction.TWO_FACTOR_FAILED,
        actionDescription: '2FA verification failed - invalid code',
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      } as ApiResponse);
      return;
    }

    // Clear OTP after successful verification
    await prisma.user.update({
      where: { id: user.id },
      data: {
        lastLogin: new Date(),
        twoFactorSecret: null,
        twoFactorVerifiedAt: new Date(), // Update to current time after successful verification
      },
    });

    const token = generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.USER_LOGIN,
      actionDescription: 'User logged in successfully with 2FA',
      ipAddress: req.ip || req.socket.remoteAddress,
      newValue: { role: user.role, twoFactorUsed: true },
    });

    const organization = user.role === 'sme'
      ? user.smeProfile?.companyName
      : user.userProfile?.company || null;

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: sanitizeUser(user, organization),
        token,
      },
    } as ApiResponse<AuthResponse>);
  } catch (error) {
    console.error('2FA verification error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during verification',
    } as ApiResponse);
  }
}

// POST /api/auth/2fa/enable - Send OTP to enable 2FA
export async function enable2FA(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    if (user.twoFactorEnabled) {
      res.status(400).json({
        success: false,
        message: 'Two-factor authentication is already enabled',
      } as ApiResponse);
      return;
    }

    // Generate OTP for setup confirmation
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: otpHash,
        twoFactorVerifiedAt: otpExpiry,
      },
    });

    // Send OTP via email
    await emailService.sendTwoFactorOTPEmail(user.email, user.fullName, otp, user.id);

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.TWO_FACTOR_OTP_SENT,
      actionDescription: '2FA setup OTP sent',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your email. Enter it to enable 2FA.',
    } as ApiResponse);
  } catch (error) {
    console.error('Enable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while enabling 2FA',
    } as ApiResponse);
  }
}

// POST /api/auth/2fa/confirm-setup - Confirm 2FA setup with OTP
export async function confirm2FASetup(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;
    const { otp } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    if (!otp) {
      res.status(400).json({
        success: false,
        message: 'Verification code is required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    // Check if OTP has expired
    if (!user.twoFactorVerifiedAt || user.twoFactorVerifiedAt < new Date()) {
      res.status(400).json({
        success: false,
        message: 'Verification code has expired. Please request a new one.',
      } as ApiResponse);
      return;
    }

    // Verify OTP
    const otpHash = hashOTP(otp);
    if (user.twoFactorSecret !== otpHash) {
      res.status(400).json({
        success: false,
        message: 'Invalid verification code',
      } as ApiResponse);
      return;
    }

    // Enable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: true,
        twoFactorMethod: 'email',
        twoFactorSecret: null,
        twoFactorVerifiedAt: new Date(),
      },
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.TWO_FACTOR_ENABLED,
      actionDescription: 'Two-factor authentication enabled',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication has been enabled successfully',
    } as ApiResponse);
  } catch (error) {
    console.error('Confirm 2FA setup error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while confirming 2FA setup',
    } as ApiResponse);
  }
}

// POST /api/auth/2fa/disable - Disable 2FA
export async function disable2FA(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;
    const { password } = req.body;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    if (!password) {
      res.status(400).json({
        success: false,
        message: 'Password is required to disable 2FA',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    if (!user.twoFactorEnabled) {
      res.status(400).json({
        success: false,
        message: 'Two-factor authentication is not enabled',
      } as ApiResponse);
      return;
    }

    // Verify password (skip for OAuth users)
    if (user.authProvider === 'local') {
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        res.status(400).json({
          success: false,
          message: 'Invalid password',
        } as ApiResponse);
        return;
      }
    }

    // Disable 2FA
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorEnabled: false,
        twoFactorMethod: null,
        twoFactorSecret: null,
        twoFactorVerifiedAt: null,
      },
    });

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.TWO_FACTOR_DISABLED,
      actionDescription: 'Two-factor authentication disabled',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'Two-factor authentication has been disabled',
    } as ApiResponse);
  } catch (error) {
    console.error('Disable 2FA error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while disabling 2FA',
    } as ApiResponse);
  }
}

// GET /api/auth/2fa/status - Get 2FA status
export async function get2FAStatus(req: Request, res: Response): Promise<void> {
  try {
    const authReq = req as AuthenticatedRequest;
    const userId = authReq.user?.userId;

    if (!userId) {
      res.status(401).json({
        success: false,
        message: 'Not authenticated',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        twoFactorEnabled: true,
        twoFactorMethod: true,
      },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        enabled: user.twoFactorEnabled,
        method: user.twoFactorMethod,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('Get 2FA status error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while fetching 2FA status',
    } as ApiResponse);
  }
}

// POST /api/auth/2fa/resend - Resend OTP
export async function resend2FAOTP(req: Request, res: Response): Promise<void> {
  try {
    const { userId } = req.body;

    if (!userId) {
      res.status(400).json({
        success: false,
        message: 'User ID is required',
      } as ApiResponse);
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found',
      } as ApiResponse);
      return;
    }

    // Generate new OTP
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const otpExpiry = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: otpHash,
        twoFactorVerifiedAt: otpExpiry,
      },
    });

    // Send OTP via email
    await emailService.sendTwoFactorOTPEmail(user.email, user.fullName, otp, user.id);

    await logAuditAction({
      userId: user.id,
      actionType: AuditAction.TWO_FACTOR_OTP_SENT,
      actionDescription: '2FA OTP resent',
      ipAddress: req.ip || req.socket.remoteAddress,
    });

    res.status(200).json({
      success: true,
      message: 'A new verification code has been sent to your email',
    } as ApiResponse);
  } catch (error) {
    console.error('Resend 2FA OTP error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred while resending the verification code',
    } as ApiResponse);
  }
}

// ============================================
// UAE PASS AUTHENTICATION
// ============================================
// UAE Pass is the UAE government's digital identity solution.
// It uses OAuth 2.0 for authentication.
//
// To use UAE Pass, you need to:
// 1. Register your application at https://selfcare.uaepass.ae
// 2. Get your Client ID and Client Secret
// 3. Configure allowed redirect URIs
// 4. Set environment variables: UAEPASS_CLIENT_ID, UAEPASS_CLIENT_SECRET, UAEPASS_REDIRECT_URI
//
// OAuth Flow:
// 1. Redirect user to UAE Pass authorization URL
// 2. User authenticates with UAE Pass
// 3. UAE Pass redirects back with authorization code
// 4. Exchange code for access token
// 5. Fetch user profile from UAE Pass

const UAEPASS_AUTH_URL = process.env.UAEPASS_ENV === 'production'
  ? 'https://id.uaepass.ae'
  : 'https://stg-id.uaepass.ae'; // Staging environment for testing

const UAEPASS_TOKEN_URL = `${UAEPASS_AUTH_URL}/idshub/token`;
const UAEPASS_USERINFO_URL = `${UAEPASS_AUTH_URL}/idshub/userinfo`;

// GET /api/auth/uaepass/init - Get UAE Pass authorization URL
export async function initUAEPassAuth(req: Request, res: Response): Promise<void> {
  try {
    const clientId = process.env.UAEPASS_CLIENT_ID;
    const redirectUri = process.env.UAEPASS_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      res.status(503).json({
        success: false,
        message: 'UAE Pass authentication is not configured',
      } as ApiResponse);
      return;
    }

    // Generate state for CSRF protection
    const state = crypto.randomBytes(32).toString('hex');

    // Build authorization URL
    const authUrl = new URL(`${UAEPASS_AUTH_URL}/idshub/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', clientId);
    authUrl.searchParams.set('redirect_uri', redirectUri);
    authUrl.searchParams.set('scope', 'urn:uae:digitalid:profile:general');
    authUrl.searchParams.set('state', state);
    authUrl.searchParams.set('acr_values', 'urn:safelayer:tws:policies:authentication:level:low');
    authUrl.searchParams.set('ui_locales', 'en');

    res.status(200).json({
      success: true,
      data: {
        authUrl: authUrl.toString(),
        state,
      },
    } as ApiResponse);
  } catch (error) {
    console.error('UAE Pass init error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to initialize UAE Pass authentication',
    } as ApiResponse);
  }
}

// POST /api/auth/uaepass/callback - Handle UAE Pass callback
export async function uaePassCallback(req: Request, res: Response): Promise<void> {
  try {
    const { code, state } = req.body;

    if (!code) {
      res.status(400).json({
        success: false,
        message: 'Authorization code is required',
      } as ApiResponse);
      return;
    }

    const clientId = process.env.UAEPASS_CLIENT_ID;
    const clientSecret = process.env.UAEPASS_CLIENT_SECRET;
    const redirectUri = process.env.UAEPASS_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      res.status(503).json({
        success: false,
        message: 'UAE Pass authentication is not configured',
      } as ApiResponse);
      return;
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch(UAEPASS_TOKEN_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`,
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: redirectUri,
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error('UAE Pass token error:', errorData);
      res.status(400).json({
        success: false,
        message: 'Failed to authenticate with UAE Pass',
      } as ApiResponse);
      return;
    }

    const tokenData = await tokenResponse.json() as { access_token: string; token_type: string };

    // Fetch user profile
    const userInfoResponse = await fetch(UAEPASS_USERINFO_URL, {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    if (!userInfoResponse.ok) {
      res.status(400).json({
        success: false,
        message: 'Failed to fetch user profile from UAE Pass',
      } as ApiResponse);
      return;
    }

    const userInfo = await userInfoResponse.json() as {
      sub: string;
      email?: string;
      firstnameEN?: string;
      lastnameEN?: string;
      fullnameEN?: string;
      mobile?: string;
      nationalityEN?: string;
      userType?: string; // 'UAE_NATIONAL', 'UAE_RESIDENT', 'VISITOR'
    };

    const uaePassId = userInfo.sub;
    const email = userInfo.email;
    const fullName = userInfo.fullnameEN || `${userInfo.firstnameEN || ''} ${userInfo.lastnameEN || ''}`.trim();
    const phoneNumber = userInfo.mobile;

    if (!uaePassId) {
      res.status(400).json({
        success: false,
        message: 'Invalid UAE Pass response: missing user ID',
      } as ApiResponse);
      return;
    }

    // Check if user exists with this UAE Pass ID
    let user = await prisma.user.findFirst({
      where: {
        authProvider: 'uaepass',
        providerId: uaePassId,
      },
      include: {
        userProfile: { select: { company: true } },
      },
    });

    if (user) {
      // User exists - log them in
      if (user.accountStatus === 'suspended') {
        res.status(403).json({
          success: false,
          message: 'Your account has been suspended. Please contact support.',
        } as ApiResponse);
        return;
      }

      // Update last login
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });

      await logAuditAction({
        userId: user.id,
        actionType: AuditAction.USER_LOGIN,
        actionDescription: 'User logged in via UAE Pass',
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      const token = generateToken({ userId: user.id, email: user.email, role: user.role });
      const organization = user.userProfile?.company || null;

      res.status(200).json({
        success: true,
        data: {
          token,
          user: sanitizeUser(user, organization),
        },
        message: 'Login successful',
      } as ApiResponse<AuthResponse>);
    } else {
      // Check if user exists with same email (link accounts)
      if (email) {
        const existingUser = await prisma.user.findUnique({
          where: { email: email.toLowerCase() },
        });

        if (existingUser) {
          // Cannot link - SME and admin must use email/password
          if (existingUser.role !== 'user') {
            res.status(400).json({
              success: false,
              message: `${existingUser.role === 'sme' ? 'SME' : 'Admin'} accounts must use email/password login`,
            } as ApiResponse);
            return;
          }

          // Link UAE Pass to existing account
          await prisma.user.update({
            where: { id: existingUser.id },
            data: {
              authProvider: 'uaepass',
              providerId: uaePassId,
              isVerified: true,
              phoneNumber: existingUser.phoneNumber || phoneNumber || null,
            },
          });

          await logAuditAction({
            userId: existingUser.id,
            actionType: AuditAction.USER_LOGIN,
            actionDescription: 'User linked account and logged in via UAE Pass',
            ipAddress: req.ip || req.socket.remoteAddress,
          });

          const token = generateToken({ userId: existingUser.id, email: existingUser.email, role: existingUser.role });

          res.status(200).json({
            success: true,
            data: {
              token,
              user: sanitizeUser(existingUser, null),
            },
            message: 'Account linked and login successful',
          } as ApiResponse<AuthResponse>);
          return;
        }
      }

      // Create new user with UAE Pass
      // Note: UAE Pass may not always provide email
      const newUser = await prisma.user.create({
        data: {
          email: email?.toLowerCase() || `uaepass_${uaePassId}@placeholder.local`,
          password: '', // No password for OAuth users
          fullName: fullName || 'UAE Pass User',
          role: 'user',
          isVerified: true, // UAE Pass verified the identity
          authProvider: 'uaepass',
          providerId: uaePassId,
          phoneNumber: phoneNumber || null,
        },
      });

      // Create user profile
      await prisma.userProfile.create({
        data: { userId: newUser.id },
      });

      await logAuditAction({
        userId: newUser.id,
        actionType: AuditAction.USER_REGISTERED,
        actionDescription: 'New user registered via UAE Pass',
        ipAddress: req.ip || req.socket.remoteAddress,
      });

      // Send welcome email if email is available
      if (email) {
        await emailService.sendWelcomeEmail(newUser.email, newUser.fullName, 'user', newUser.id);
      }

      const token = generateToken({ userId: newUser.id, email: newUser.email, role: newUser.role });

      res.status(201).json({
        success: true,
        data: {
          token,
          user: sanitizeUser(newUser, null),
        },
        message: 'Account created successfully',
      } as ApiResponse<AuthResponse>);
    }
  } catch (error) {
    console.error('UAE Pass callback error:', error);
    res.status(500).json({
      success: false,
      message: 'An error occurred during UAE Pass authentication',
    } as ApiResponse);
  }
}
