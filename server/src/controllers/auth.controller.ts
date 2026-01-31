import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
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

interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'sme';
  companyName?: string;
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
    const { email, password, fullName, role, companyName } = req.body as RegisterRequest;

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

    if (role === 'sme' && !companyName) {
      res.status(400).json({
        success: false,
        message: 'Company name is required for SME registration',
      } as ApiResponse);
      return;
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

    // If SME, create SME profile
    if (role === 'sme' && companyName) {
      await prisma.sMEProfile.create({
        data: {
          userId: user.id,
          companyName,
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
