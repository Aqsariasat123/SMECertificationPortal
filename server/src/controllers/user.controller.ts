import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// GET /api/user/profile - Get user's own profile
export const getUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        profilePicture: true,
        role: true,
        isVerified: true,
        createdAt: true,
        lastLogin: true,
        userProfile: {
          select: {
            company: true,
            jobTitle: true,
          },
        },
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      success: true,
      data: {
        ...user,
        organization: user.userProfile?.company || null,
        jobTitle: user.userProfile?.jobTitle || null,
        userProfile: undefined,
      },
    });
  } catch (error) {
    console.error('Get user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch user profile',
    });
  }
};

// PUT /api/user/profile - Update user's own profile
export const updateUserProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { firstName, lastName, phoneNumber, organization } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Combine first and last name
    const fullName = [firstName, lastName].filter(Boolean).join(' ');

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        fullName: fullName || undefined,
        phoneNumber: phoneNumber || null,
      },
      select: {
        id: true,
        email: true,
        fullName: true,
        phoneNumber: true,
        role: true,
        isVerified: true,
        createdAt: true,
      },
    });

    // Update or create user profile
    if (organization !== undefined) {
      await prisma.userProfile.upsert({
        where: { userId },
        create: {
          userId,
          company: organization || null,
        },
        update: {
          company: organization || null,
        },
      });
    }

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PROFILE_UPDATED',
        actionDescription: 'Updated user profile',
        targetType: 'User',
        targetId: userId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: updatedUser,
    });
  } catch (error) {
    console.error('Update user profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update user profile',
    });
  }
};

// GET /api/user/requests - Get user's introduction requests
export const getUserRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const requests = await prisma.introductionRequest.findMany({
      where: { requesterId: userId },
      orderBy: { requestedDate: 'desc' },
      include: {
        smeProfile: {
          select: {
            id: true,
            companyName: true,
            industrySector: true,
          },
        },
      },
    });

    return res.json({
      success: true,
      data: {
        requests: requests.map(req => ({
          id: req.id,
          smeId: req.smeProfile.id,
          smeName: req.smeProfile.companyName,
          smeSector: req.smeProfile.industrySector,
          message: req.message,
          status: req.status,
          requestedDate: req.requestedDate,
        })),
      },
    });
  } catch (error) {
    console.error('Get user requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction requests',
    });
  }
};

// POST /api/user/profile-picture - Upload profile picture
export const uploadProfilePicture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No file uploaded',
      });
    }

    // Include userId in the path since files are saved to /uploads/{userId}/filename
    const profilePictureUrl = `/uploads/${userId}/${req.file.filename}`;

    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: profilePictureUrl },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PROFILE_PICTURE_UPDATED',
        actionDescription: 'Updated profile picture',
        targetType: 'User',
        targetId: userId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Profile picture uploaded successfully',
      data: { profilePicture: profilePictureUrl },
    });
  } catch (error) {
    console.error('Upload profile picture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload profile picture',
    });
  }
};

// DELETE /api/user/profile-picture - Remove profile picture
export const removeProfilePicture = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    await prisma.user.update({
      where: { id: userId },
      data: { profilePicture: null },
    });

    return res.json({
      success: true,
      message: 'Profile picture removed successfully',
    });
  } catch (error) {
    console.error('Remove profile picture error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove profile picture',
    });
  }
};

// POST /api/user/change-password - Change user's password
export const changePassword = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    if (newPassword.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 8 characters',
      });
    }

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        password: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect',
      });
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    // Create audit log
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PASSWORD_CHANGED',
        actionDescription: 'Changed account password',
        targetType: 'User',
        targetId: userId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Password changed successfully',
    });
  } catch (error) {
    console.error('Change password error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to change password',
    });
  }
};
