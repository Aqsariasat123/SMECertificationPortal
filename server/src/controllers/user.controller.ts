import { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { AuthenticatedRequest } from '../types';

const prisma = new PrismaClient();

// GET /api/user/profile - Get user's own profile with KYC info
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
        userProfile: true,
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const profile = user.userProfile;

    return res.json({
      success: true,
      data: {
        ...user,
        organization: profile?.company || profile?.companyName || null,
        jobTitle: profile?.jobTitle || null,
        investorType: profile?.investorType || null,
        kycStatus: profile?.kycStatus || 'not_submitted',
        kycSubmittedAt: profile?.kycSubmittedAt || null,
        kycReviewedAt: profile?.kycReviewedAt || null,
        kycRejectionReason: profile?.kycRejectionReason || null,
        kycRevisionNotes: profile?.kycRevisionNotes || null,
        kycDocuments: profile?.kycDocuments || [],
        // Individual KYC fields
        nationality: profile?.nationality || null,
        dateOfBirth: profile?.dateOfBirth || null,
        gender: profile?.gender || null,
        residencyStatus: profile?.residencyStatus || null,
        emiratesId: profile?.emiratesId || null,
        emiratesIdExpiry: profile?.emiratesIdExpiry || null,
        passportNumber: profile?.passportNumber || null,
        passportExpiry: profile?.passportExpiry || null,
        passportCountry: profile?.passportCountry || null,
        residentialAddress: profile?.residentialAddress || null,
        city: profile?.city || null,
        country: profile?.country || null,
        poBox: profile?.poBox || null,
        employmentStatus: profile?.employmentStatus || null,
        employerName: profile?.employerName || null,
        occupation: profile?.occupation || null,
        annualIncome: profile?.annualIncome || null,
        sourceOfFunds: profile?.sourceOfFunds || null,
        // Company KYC fields
        companyName: profile?.companyName || null,
        companyType: profile?.companyType || null,
        tradeLicenseNumber: profile?.tradeLicenseNumber || null,
        tradeLicenseExpiry: profile?.tradeLicenseExpiry || null,
        registrationNumber: profile?.registrationNumber || null,
        registrationDate: profile?.registrationDate || null,
        registrationAuthority: profile?.registrationAuthority || null,
        companyAddress: profile?.companyAddress || null,
        companyCity: profile?.companyCity || null,
        companyCountry: profile?.companyCountry || null,
        companyPoBox: profile?.companyPoBox || null,
        authRepName: profile?.authRepName || null,
        authRepPosition: profile?.authRepPosition || null,
        authRepEmiratesId: profile?.authRepEmiratesId || null,
        authRepEmail: profile?.authRepEmail || null,
        authRepPhone: profile?.authRepPhone || null,
        beneficialOwners: profile?.beneficialOwners || [],
        companyAnnualRevenue: profile?.companyAnnualRevenue || null,
        companyEmployeeCount: profile?.companyEmployeeCount || null,
        // Investment preferences
        investmentInterests: profile?.investmentInterests || [],
        investmentBudget: profile?.investmentBudget || null,
        riskTolerance: profile?.riskTolerance || null,
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

// PUT /api/user/investor-type - Set investor type (individual or company)
export const setInvestorType = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { investorType } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!['individual', 'company'].includes(investorType)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid investor type. Must be "individual" or "company"',
      });
    }

    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        investorType,
      },
      update: {
        investorType,
        // Reset KYC status when changing investor type
        kycStatus: 'not_submitted',
        kycSubmittedAt: null,
        kycReviewedAt: null,
        kycRejectionReason: null,
        kycRevisionNotes: null,
      },
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'INVESTOR_TYPE_SET',
        actionDescription: `Set investor type to ${investorType}`,
        targetType: 'UserProfile',
        targetId: userId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Investor type updated successfully',
      data: { investorType },
    });
  } catch (error) {
    console.error('Set investor type error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to set investor type',
    });
  }
};

// PUT /api/user/kyc - Submit KYC information
export const submitKyc = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const kycData = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get current profile to check investor type
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
    });

    if (!profile?.investorType) {
      return res.status(400).json({
        success: false,
        message: 'Please select investor type first',
      });
    }

    // Prepare update data based on investor type
    const updateData: Record<string, unknown> = {
      kycStatus: 'pending',
      kycSubmittedAt: new Date(),
      kycRejectionReason: null,
      kycRevisionNotes: null,
    };

    if (profile.investorType === 'individual') {
      // Individual investor KYC fields
      updateData.nationality = kycData.nationality || null;
      updateData.dateOfBirth = kycData.dateOfBirth ? new Date(kycData.dateOfBirth) : null;
      updateData.gender = kycData.gender || null;
      updateData.residencyStatus = kycData.residencyStatus || null;
      updateData.emiratesId = kycData.emiratesId || null;
      updateData.emiratesIdExpiry = kycData.emiratesIdExpiry ? new Date(kycData.emiratesIdExpiry) : null;
      updateData.passportNumber = kycData.passportNumber || null;
      updateData.passportExpiry = kycData.passportExpiry ? new Date(kycData.passportExpiry) : null;
      updateData.passportCountry = kycData.passportCountry || null;
      updateData.residentialAddress = kycData.residentialAddress || null;
      updateData.city = kycData.city || null;
      updateData.country = kycData.country || null;
      updateData.poBox = kycData.poBox || null;
      updateData.employmentStatus = kycData.employmentStatus || null;
      updateData.employerName = kycData.employerName || null;
      updateData.occupation = kycData.occupation || null;
      updateData.annualIncome = kycData.annualIncome || null;
      updateData.sourceOfFunds = kycData.sourceOfFunds || null;
    } else {
      // Company investor KYC fields
      updateData.companyName = kycData.companyName || null;
      updateData.companyType = kycData.companyType || null;
      updateData.tradeLicenseNumber = kycData.tradeLicenseNumber || null;
      updateData.tradeLicenseExpiry = kycData.tradeLicenseExpiry ? new Date(kycData.tradeLicenseExpiry) : null;
      updateData.registrationNumber = kycData.registrationNumber || null;
      updateData.registrationDate = kycData.registrationDate ? new Date(kycData.registrationDate) : null;
      updateData.registrationAuthority = kycData.registrationAuthority || null;
      updateData.companyAddress = kycData.companyAddress || null;
      updateData.companyCity = kycData.companyCity || null;
      updateData.companyCountry = kycData.companyCountry || null;
      updateData.companyPoBox = kycData.companyPoBox || null;
      updateData.authRepName = kycData.authRepName || null;
      updateData.authRepPosition = kycData.authRepPosition || null;
      updateData.authRepEmiratesId = kycData.authRepEmiratesId || null;
      updateData.authRepEmail = kycData.authRepEmail || null;
      updateData.authRepPhone = kycData.authRepPhone || null;
      updateData.beneficialOwners = kycData.beneficialOwners || [];
      updateData.companyAnnualRevenue = kycData.companyAnnualRevenue || null;
      updateData.companyEmployeeCount = kycData.companyEmployeeCount ? parseInt(kycData.companyEmployeeCount) : null;
    }

    // Optional investment preferences
    if (kycData.investmentInterests) updateData.investmentInterests = kycData.investmentInterests;
    if (kycData.investmentBudget) updateData.investmentBudget = kycData.investmentBudget;
    if (kycData.riskTolerance) updateData.riskTolerance = kycData.riskTolerance;

    await prisma.userProfile.update({
      where: { userId },
      data: updateData,
    });

    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'KYC_SUBMITTED',
        actionDescription: `Submitted ${profile.investorType} investor KYC`,
        targetType: 'UserProfile',
        targetId: userId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'KYC submitted successfully. Our team will review your application.',
    });
  } catch (error) {
    console.error('Submit KYC error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit KYC',
    });
  }
};

// POST /api/user/kyc/documents - Upload KYC documents
export const uploadKycDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { documentType } = req.body;

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

    const documentPath = `/uploads/${userId}/${req.file.filename}`;
    const newDocument = {
      type: documentType || 'other',
      name: req.file.originalname,
      path: documentPath,
      uploadedAt: new Date().toISOString(),
    };

    // Get current documents
    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { kycDocuments: true },
    });

    const currentDocs = (profile?.kycDocuments as Array<Record<string, string>>) || [];

    // Replace if same type exists, otherwise add
    const existingIndex = currentDocs.findIndex((d) => d.type === documentType);
    if (existingIndex >= 0) {
      currentDocs[existingIndex] = newDocument;
    } else {
      currentDocs.push(newDocument);
    }

    await prisma.userProfile.upsert({
      where: { userId },
      create: {
        userId,
        kycDocuments: currentDocs,
      },
      update: {
        kycDocuments: currentDocs,
      },
    });

    return res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: { document: newDocument, allDocuments: currentDocs },
    });
  } catch (error) {
    console.error('Upload KYC document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document',
    });
  }
};

// DELETE /api/user/kyc/documents/:type - Remove KYC document
export const removeKycDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { type } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const profile = await prisma.userProfile.findUnique({
      where: { userId },
      select: { kycDocuments: true },
    });

    const currentDocs = (profile?.kycDocuments as Array<Record<string, string>>) || [];
    const updatedDocs = currentDocs.filter((d) => d.type !== type);

    await prisma.userProfile.update({
      where: { userId },
      data: { kycDocuments: updatedDocs },
    });

    return res.json({
      success: true,
      message: 'Document removed successfully',
      data: { documents: updatedDocs },
    });
  } catch (error) {
    console.error('Remove KYC document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to remove document',
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
