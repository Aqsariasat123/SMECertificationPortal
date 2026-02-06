import { Response } from 'express';
import { PrismaClient, CertificationStatus, IndustrySector, RequestStatus, LegalStructure, BusinessModel, FundingStage, OfficeType } from '@prisma/client';
import { AuthenticatedRequest } from '../types';
import { DocumentType, DOCUMENT_TYPE_LABELS, REQUIRED_DOCUMENTS } from '../middleware/upload';
import { emailService } from '../services/email.service';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import QRCode from 'qrcode';
import {
  computeCertificateStatus,
  truncateHash,
  formatCertificateDate,
} from '../utils/certificate';
import { logAuditAction, AuditAction, getClientIP } from '../utils/auditLogger';
import { validateUploadedFile, deleteInvalidFile } from '../utils/fileValidator';

const prisma = new PrismaClient();

// Document interface
interface UploadedDocument {
  id: string;
  type: DocumentType;
  name: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
  version?: number;
}

// GET /api/sme/profile - Get SME profile
export const getSMEProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const smeProfile = await prisma.sMEProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    if (!smeProfile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(smeProfile);

    return res.json({
      success: true,
      data: {
        ...smeProfile,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error('Get SME profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch SME profile',
    });
  }
};

// PUT /api/sme/profile - Update SME profile (Save as Draft or Save & Continue)
export const updateSMEProfile = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const {
      // Basic Info
      companyName,
      tradeLicenseNumber,
      companyDescription,
      industrySector,
      foundingDate,
      employeeCount,
      annualRevenue,
      website,
      address,
      // Legacy contact fields (stored in documents JSON)
      contactName,
      contactPosition,
      contactEmail,
      contactPhone,
      revenueRange,
      revenueGrowth,
      // Legal & Registration
      registrationNumber,
      vatNumber,
      licenseExpiryDate,
      legalStructure,
      registrationCountry,
      registrationCity,
      // Ownership & Management
      ownerName,
      ownerNationality,
      ownerIdNumber,
      shareholderStructure,
      boardMembers,
      // Financial Info
      bankName,
      bankAccountNumber,
      auditorName,
      lastAuditDate,
      profitMargin,
      fundingStage,
      // Business Operations
      businessModel,
      operatingCountries,
      majorClients,
      officeType,
      // Compliance & Certifications
      existingCertifications,
      regulatoryLicenses,
      complianceOfficerName,
      complianceOfficerEmail,
      hasAmlPolicy,
      hasDataProtectionPolicy,
      // Contact & Social
      linkedinUrl,
      socialMedia,
      headOfficeAddress,
      headOfficeLatitude,
      headOfficeLongitude,
      secondaryContactName,
      secondaryContactPhone,
      secondaryContactEmail,
    } = req.body;

    // Check if profile exists
    const existingProfile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!existingProfile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Only allow updates if status is draft or revision_requested
    if (
      existingProfile.certificationStatus !== CertificationStatus.draft &&
      existingProfile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot update profile while under review or after certification',
      });
    }

    // Prepare update data
    const updateData: Record<string, unknown> = {};

    // Basic Info
    if (companyName !== undefined) updateData.companyName = companyName;
    if (tradeLicenseNumber !== undefined) updateData.tradeLicenseNumber = tradeLicenseNumber;
    if (companyDescription !== undefined) updateData.companyDescription = companyDescription;
    if (website !== undefined) updateData.website = website;
    if (address !== undefined) updateData.address = address;

    // Handle industry sector enum
    if (industrySector !== undefined) {
      const sectorMap: Record<string, IndustrySector> = {
        technology: IndustrySector.technology,
        healthcare: IndustrySector.healthcare,
        finance: IndustrySector.finance,
        retail: IndustrySector.retail,
        manufacturing: IndustrySector.manufacturing,
        real_estate: IndustrySector.real_estate,
        hospitality: IndustrySector.hospitality,
        education: IndustrySector.education,
        other: IndustrySector.other,
      };
      if (sectorMap[industrySector]) {
        updateData.industrySector = sectorMap[industrySector];
      }
    }

    // Handle founding date
    if (foundingDate !== undefined && foundingDate) {
      updateData.foundingDate = new Date(foundingDate);
    }

    // Handle numbers
    if (employeeCount !== undefined) {
      updateData.employeeCount = parseInt(employeeCount, 10) || null;
    }
    if (annualRevenue !== undefined) {
      updateData.annualRevenue = parseFloat(annualRevenue) || null;
    }

    // Legal & Registration
    if (registrationNumber !== undefined) updateData.registrationNumber = registrationNumber;
    if (vatNumber !== undefined) updateData.vatNumber = vatNumber;
    if (licenseExpiryDate !== undefined && licenseExpiryDate) {
      updateData.licenseExpiryDate = new Date(licenseExpiryDate);
    }
    if (legalStructure !== undefined) {
      const legalMap: Record<string, LegalStructure> = {
        llc: LegalStructure.llc,
        partnership: LegalStructure.partnership,
        sole_proprietorship: LegalStructure.sole_proprietorship,
        corporation: LegalStructure.corporation,
        free_zone: LegalStructure.free_zone,
        branch: LegalStructure.branch,
        other: LegalStructure.other,
      };
      if (legalMap[legalStructure]) {
        updateData.legalStructure = legalMap[legalStructure];
      }
    }
    if (registrationCountry !== undefined) updateData.registrationCountry = registrationCountry;
    if (registrationCity !== undefined) updateData.registrationCity = registrationCity;

    // Ownership & Management
    if (ownerName !== undefined) updateData.ownerName = ownerName;
    if (ownerNationality !== undefined) updateData.ownerNationality = ownerNationality;
    if (ownerIdNumber !== undefined) updateData.ownerIdNumber = ownerIdNumber;
    if (shareholderStructure !== undefined) updateData.shareholderStructure = shareholderStructure;
    if (boardMembers !== undefined) updateData.boardMembers = boardMembers;

    // Financial Info
    if (bankName !== undefined) updateData.bankName = bankName;
    if (bankAccountNumber !== undefined) updateData.bankAccountNumber = bankAccountNumber;
    if (auditorName !== undefined) updateData.auditorName = auditorName;
    if (lastAuditDate !== undefined && lastAuditDate) {
      updateData.lastAuditDate = new Date(lastAuditDate);
    }
    if (profitMargin !== undefined) {
      updateData.profitMargin = parseFloat(profitMargin) || null;
    }
    if (fundingStage !== undefined) {
      const fundingMap: Record<string, FundingStage> = {
        bootstrapped: FundingStage.bootstrapped,
        pre_seed: FundingStage.pre_seed,
        seed: FundingStage.seed,
        series_a: FundingStage.series_a,
        series_b: FundingStage.series_b,
        series_c_plus: FundingStage.series_c_plus,
        profitable: FundingStage.profitable,
        other: FundingStage.other,
      };
      if (fundingMap[fundingStage]) {
        updateData.fundingStage = fundingMap[fundingStage];
      }
    }

    // Business Operations
    if (businessModel !== undefined) {
      const businessMap: Record<string, BusinessModel> = {
        b2b: BusinessModel.b2b,
        b2c: BusinessModel.b2c,
        b2b2c: BusinessModel.b2b2c,
        marketplace: BusinessModel.marketplace,
        saas: BusinessModel.saas,
        other: BusinessModel.other,
      };
      if (businessMap[businessModel]) {
        updateData.businessModel = businessMap[businessModel];
      }
    }
    if (operatingCountries !== undefined) updateData.operatingCountries = operatingCountries;
    if (majorClients !== undefined) updateData.majorClients = majorClients;
    if (officeType !== undefined) {
      const officeMap: Record<string, OfficeType> = {
        own_premises: OfficeType.own_premises,
        rented: OfficeType.rented,
        shared_coworking: OfficeType.shared_coworking,
        virtual: OfficeType.virtual,
        home_based: OfficeType.home_based,
      };
      if (officeMap[officeType]) {
        updateData.officeType = officeMap[officeType];
      }
    }

    // Compliance & Certifications
    if (existingCertifications !== undefined) updateData.existingCertifications = existingCertifications;
    if (regulatoryLicenses !== undefined) updateData.regulatoryLicenses = regulatoryLicenses;
    if (complianceOfficerName !== undefined) updateData.complianceOfficerName = complianceOfficerName;
    if (complianceOfficerEmail !== undefined) updateData.complianceOfficerEmail = complianceOfficerEmail;
    if (hasAmlPolicy !== undefined) updateData.hasAmlPolicy = hasAmlPolicy;
    if (hasDataProtectionPolicy !== undefined) updateData.hasDataProtectionPolicy = hasDataProtectionPolicy;

    // Contact & Social
    if (linkedinUrl !== undefined) updateData.linkedinUrl = linkedinUrl;
    if (socialMedia !== undefined) updateData.socialMedia = socialMedia;
    if (headOfficeAddress !== undefined) updateData.headOfficeAddress = headOfficeAddress;
    if (headOfficeLatitude !== undefined) updateData.headOfficeLatitude = parseFloat(headOfficeLatitude) || null;
    if (headOfficeLongitude !== undefined) updateData.headOfficeLongitude = parseFloat(headOfficeLongitude) || null;
    if (secondaryContactName !== undefined) updateData.secondaryContactName = secondaryContactName;
    if (secondaryContactPhone !== undefined) updateData.secondaryContactPhone = secondaryContactPhone;
    if (secondaryContactEmail !== undefined) updateData.secondaryContactEmail = secondaryContactEmail;

    // Store legacy contact info in documents JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let additionalInfo: Record<string, any> = {};
    if (existingProfile.documents) {
      if (typeof existingProfile.documents === 'string') {
        try {
          additionalInfo = JSON.parse(existingProfile.documents);
        } catch {
          additionalInfo = {};
        }
      } else {
        additionalInfo = existingProfile.documents as Record<string, unknown>;
      }
    }

    if (contactName !== undefined) additionalInfo.contactName = contactName;
    if (contactPosition !== undefined) additionalInfo.contactPosition = contactPosition;
    if (contactEmail !== undefined) additionalInfo.contactEmail = contactEmail;
    if (contactPhone !== undefined) additionalInfo.contactPhone = contactPhone;
    if (revenueRange !== undefined) additionalInfo.revenueRange = revenueRange;
    if (revenueGrowth !== undefined) additionalInfo.revenueGrowth = revenueGrowth;

    updateData.documents = additionalInfo;

    // Update profile
    const updatedProfile = await prisma.sMEProfile.update({
      where: { userId },
      data: updateData,
      include: {
        user: {
          select: {
            fullName: true,
            email: true,
            phoneNumber: true,
          },
        },
      },
    });

    // Calculate completion percentage
    const completionPercentage = calculateCompletionPercentage(updatedProfile);

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PROFILE_UPDATED',
        actionDescription: 'SME profile updated',
        targetType: 'SMEProfile',
        targetId: updatedProfile.id,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        ...updatedProfile,
        completionPercentage,
      },
    });
  } catch (error) {
    console.error('Update SME profile error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to update SME profile',
    });
  }
};

// POST /api/sme/submit-certification - Submit profile for certification review
export const submitCertification = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Check if can submit
    if (
      profile.certificationStatus !== CertificationStatus.draft &&
      profile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      return res.status(400).json({
        success: false,
        message: 'Profile cannot be submitted in current status',
      });
    }

    // Validate required fields
    const requiredFields = [
      { field: 'companyName', label: 'Company Name' },
      { field: 'tradeLicenseNumber', label: 'Trade License Number' },
      { field: 'companyDescription', label: 'Company Description' },
      { field: 'industrySector', label: 'Industry Sector' },
      { field: 'address', label: 'Business Address' },
    ];

    const missingFields: string[] = [];
    for (const { field, label } of requiredFields) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (!(profile as any)[field]) {
        missingFields.push(label);
      }
    }

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Please complete required fields: ${missingFields.join(', ')}`,
        missingFields,
      });
    }

    // Update status to submitted
    const updatedProfile = await prisma.sMEProfile.update({
      where: { userId },
      data: {
        certificationStatus: CertificationStatus.submitted,
        submittedDate: new Date(),
        revisionNotes: null, // Clear any previous revision notes
      },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'CERTIFICATION_SUBMITTED',
        actionDescription: `Certification application submitted for ${profile.companyName}`,
        targetType: 'SMEProfile',
        targetId: profile.id,
        ipAddress: req.ip || 'unknown',
      },
    });

    // Send application submitted email
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await emailService.sendApplicationSubmittedEmail(
        user.email,
        user.fullName,
        profile.companyName || 'Your Company'
      );
    }

    return res.json({
      success: true,
      message: 'Certification application submitted successfully',
      data: updatedProfile,
    });
  } catch (error) {
    console.error('Submit certification error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to submit certification application',
    });
  }
};

// GET /api/sme/certification-status - Get certification status
export const getCertificationStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
      select: {
        certificationStatus: true,
        submittedDate: true,
        revisionNotes: true,
        listingVisible: true,
        reviewedBy: {
          select: {
            fullName: true,
          },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    return res.json({
      success: true,
      data: profile,
    });
  } catch (error) {
    console.error('Get certification status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch certification status',
    });
  }
};

// POST /api/sme/upload-document - Upload a document
export const uploadDocument = async (req: AuthenticatedRequest, res: Response) => {
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

    const { documentType } = req.body;

    if (!documentType) {
      // Delete the uploaded file if document type is missing
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Document type is required',
      });
    }

    // Validate file content (magic bytes check)
    const validation = validateUploadedFile(
      req.file.path,
      req.file.mimetype,
      req.file.originalname
    );

    if (!validation.valid) {
      deleteInvalidFile(req.file.path);
      console.warn('File validation failed:', validation.error, validation.details);
      return res.status(400).json({
        success: false,
        message: validation.error || 'Invalid file content',
      });
    }

    // Get existing profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Check if can upload (only draft or revision_requested)
    if (
      profile.certificationStatus !== CertificationStatus.draft &&
      profile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Cannot upload documents while under review or after certification',
      });
    }

    // Get existing documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let documents: any = profile.documents || {};
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch {
        documents = {};
      }
    }

    // Initialize uploadedFiles array if not exists
    if (!documents.uploadedFiles) {
      documents.uploadedFiles = [];
    }

    // Check if document of this type already exists
    const existingIndex = documents.uploadedFiles.findIndex(
      (doc: UploadedDocument) => doc.type === documentType
    );

    // Track if this is a replacement
    const isReplacement = existingIndex !== -1;
    let previousDocument = null;
    let currentVersion = 1;

    // If exists, delete old file and track version
    if (isReplacement) {
      const oldDoc = documents.uploadedFiles[existingIndex];
      previousDocument = { ...oldDoc };
      currentVersion = (oldDoc.version || 1) + 1;
      const oldFilePath = path.join(__dirname, '../../uploads', userId, oldDoc.name);
      if (fs.existsSync(oldFilePath)) {
        fs.unlinkSync(oldFilePath);
      }
      documents.uploadedFiles.splice(existingIndex, 1);
    }

    // Create new document entry with version tracking
    const newDocument: UploadedDocument = {
      id: `doc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: documentType as DocumentType,
      name: req.file.filename,
      originalName: req.file.originalname,
      path: `/uploads/${userId}/${req.file.filename}`,
      size: req.file.size,
      mimeType: req.file.mimetype,
      uploadedAt: new Date().toISOString(),
      version: currentVersion,
    };

    documents.uploadedFiles.push(newDocument);

    // Update profile
    await prisma.sMEProfile.update({
      where: { userId },
      data: { documents },
    });

    // Log the action (differentiate between upload and replace)
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: isReplacement ? 'DOCUMENT_REPLACED' : 'DOCUMENT_UPLOADED',
        actionDescription: isReplacement
          ? `Document replaced: ${DOCUMENT_TYPE_LABELS[documentType as DocumentType] || documentType} (v${currentVersion})`
          : `Document uploaded: ${DOCUMENT_TYPE_LABELS[documentType as DocumentType] || documentType}`,
        targetType: 'SMEProfile',
        targetId: profile.id,
        ipAddress: req.ip || 'unknown',
        previousValue: isReplacement ? JSON.stringify({
          documentType,
          originalName: previousDocument?.originalName,
          version: previousDocument?.version || 1,
          uploadedAt: previousDocument?.uploadedAt,
        }) : null,
        newValue: JSON.stringify({
          documentType,
          originalName: newDocument.originalName,
          version: currentVersion,
          uploadedAt: newDocument.uploadedAt,
        }),
      },
    });

    return res.json({
      success: true,
      message: 'Document uploaded successfully',
      data: {
        document: newDocument,
        documents: documents.uploadedFiles,
      },
    });
  } catch (error) {
    console.error('Upload document error:', error);
    // Clean up file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to upload document',
    });
  }
};

// DELETE /api/sme/document/:documentId - Delete a document
export const deleteDocument = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { documentId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get existing profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Check if can delete (only draft or revision_requested)
    if (
      profile.certificationStatus !== CertificationStatus.draft &&
      profile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete documents while under review or after certification',
      });
    }

    // Get existing documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let documents: any = profile.documents || {};
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch {
        documents = {};
      }
    }

    if (!documents.uploadedFiles || !Array.isArray(documents.uploadedFiles)) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    // Find document
    const docIndex = documents.uploadedFiles.findIndex(
      (doc: UploadedDocument) => doc.id === documentId
    );

    if (docIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Document not found',
      });
    }

    const docToDelete = documents.uploadedFiles[docIndex];

    // Delete file from filesystem
    const filePath = path.join(__dirname, '../../uploads', userId, docToDelete.name);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    // Remove from array
    documents.uploadedFiles.splice(docIndex, 1);

    // Update profile
    await prisma.sMEProfile.update({
      where: { userId },
      data: { documents },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'DOCUMENT_DELETED',
        actionDescription: `Document deleted: ${DOCUMENT_TYPE_LABELS[docToDelete.type as DocumentType] || docToDelete.type}`,
        targetType: 'SMEProfile',
        targetId: profile.id,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Document deleted successfully',
      data: {
        documents: documents.uploadedFiles,
      },
    });
  } catch (error) {
    console.error('Delete document error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete document',
    });
  }
};

// GET /api/sme/documents - Get all uploaded documents
export const getDocuments = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
      select: { documents: true },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Get existing documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let documents: any = profile.documents || {};
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch {
        documents = {};
      }
    }

    const uploadedFiles = documents.uploadedFiles || [];

    // Check which required documents are missing
    const uploadedTypes = uploadedFiles.map((doc: UploadedDocument) => doc.type);
    const missingRequired = REQUIRED_DOCUMENTS.filter(
      (type) => !uploadedTypes.includes(type)
    );

    return res.json({
      success: true,
      data: {
        documents: uploadedFiles,
        requiredDocuments: REQUIRED_DOCUMENTS,
        missingRequired,
        documentTypeLabels: DOCUMENT_TYPE_LABELS,
      },
    });
  } catch (error) {
    console.error('Get documents error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch documents',
    });
  }
};

// POST /api/sme/upload-logo - Upload company logo
export const uploadCompanyLogo = async (req: AuthenticatedRequest, res: Response) => {
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

    // Validate file type (only images)
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.',
      });
    }

    // Get existing profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      fs.unlinkSync(req.file.path);
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Check if can upload (only draft or revision_requested)
    if (
      profile.certificationStatus !== CertificationStatus.draft &&
      profile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({
        success: false,
        message: 'Cannot upload logo while under review or after certification',
      });
    }

    // Get existing documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let documents: any = profile.documents || {};
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch {
        documents = {};
      }
    }

    // Delete old logo if exists
    if (documents.companyLogo) {
      const oldLogoPath = path.join(__dirname, '../..', documents.companyLogo);
      if (fs.existsSync(oldLogoPath)) {
        fs.unlinkSync(oldLogoPath);
      }
    }

    // Set new logo path
    const logoPath = `/uploads/${userId}/${req.file.filename}`;
    documents.companyLogo = logoPath;

    // Update profile
    await prisma.sMEProfile.update({
      where: { userId },
      data: { documents },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'LOGO_UPLOADED',
        actionDescription: `Company logo uploaded for ${profile.companyName || 'SME'}`,
        targetType: 'SMEProfile',
        targetId: profile.id,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Company logo uploaded successfully',
      data: {
        companyLogo: logoPath,
      },
    });
  } catch (error) {
    console.error('Upload logo error:', error);
    // Clean up file if error occurred
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    return res.status(500).json({
      success: false,
      message: 'Failed to upload company logo',
    });
  }
};

// DELETE /api/sme/logo - Delete company logo
export const deleteCompanyLogo = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get existing profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Check if can delete (only draft or revision_requested)
    if (
      profile.certificationStatus !== CertificationStatus.draft &&
      profile.certificationStatus !== CertificationStatus.revision_requested
    ) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete logo while under review or after certification',
      });
    }

    // Get existing documents
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let documents: any = profile.documents || {};
    if (typeof documents === 'string') {
      try {
        documents = JSON.parse(documents);
      } catch {
        documents = {};
      }
    }

    // Delete logo file if exists
    if (documents.companyLogo) {
      const logoPath = path.join(__dirname, '../..', documents.companyLogo);
      if (fs.existsSync(logoPath)) {
        fs.unlinkSync(logoPath);
      }
      delete documents.companyLogo;
    }

    // Update profile
    await prisma.sMEProfile.update({
      where: { userId },
      data: { documents },
    });

    return res.json({
      success: true,
      message: 'Company logo deleted successfully',
    });
  } catch (error) {
    console.error('Delete logo error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to delete company logo',
    });
  }
};

// GET /api/sme/introduction-requests - Get introduction requests received by SME
export const getIntroductionRequests = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Get introduction requests for this SME
    const requests = await prisma.introductionRequest.findMany({
      where: { smeProfileId: profile.id },
      orderBy: { requestedDate: 'desc' },
    });

    // Get requester info for each request
    const requestsWithRequester = await Promise.all(
      requests.map(async (request) => {
        const requester = await prisma.user.findUnique({
          where: { id: request.requesterId },
          select: { id: true, fullName: true, email: true },
        });
        return {
          id: request.id,
          requester: requester ? {
            id: requester.id,
            fullName: requester.fullName,
            email: requester.email,
          } : null,
          message: request.message || '',
          status: request.status,
          smeResponse: request.smeResponse || null,
          respondedAt: request.respondedAt?.toISOString() || null,
          requestedDate: request.requestedDate.toISOString(),
        };
      })
    );

    return res.json({
      success: true,
      data: {
        requests: requestsWithRequester,
        count: requests.length,
      },
    });
  } catch (error) {
    console.error('Get introduction requests error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch introduction requests',
    });
  }
};

// POST /api/sme/introduction-requests/:requestId/respond - Respond to introduction request
export const respondToIntroductionRequest = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const requestId = req.params.requestId as string;
    const { response } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!response || response.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Response message is required',
      });
    }

    // Get SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Find the request and verify it belongs to this SME
    const request = await prisma.introductionRequest.findFirst({
      where: {
        id: requestId,
        smeProfileId: profile.id,
      },
    });

    if (!request) {
      return res.status(404).json({
        success: false,
        message: 'Introduction request not found',
      });
    }

    // Update the request with response
    const updatedRequest = await prisma.introductionRequest.update({
      where: { id: requestId },
      data: {
        smeResponse: response.trim(),
        status: RequestStatus.responded,
        respondedAt: new Date(),
      },
    });

    // Get requester info
    const requester = await prisma.user.findUnique({
      where: { id: request.requesterId },
      select: { id: true, fullName: true, email: true },
    });

    // Log the action
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'INTRODUCTION_RESPONDED',
        actionDescription: `${profile.companyName} responded to introduction request from ${requester?.fullName || 'Unknown'}`,
        targetType: 'IntroductionRequest',
        targetId: requestId,
        ipAddress: req.ip || 'unknown',
      },
    });

    return res.json({
      success: true,
      message: 'Response sent successfully',
      data: {
        id: updatedRequest.id,
        requester: requester ? {
          id: requester.id,
          fullName: requester.fullName,
          email: requester.email,
        } : null,
        message: updatedRequest.message,
        status: updatedRequest.status,
        smeResponse: updatedRequest.smeResponse,
        respondedAt: updatedRequest.respondedAt?.toISOString(),
        requestedDate: updatedRequest.requestedDate.toISOString(),
      },
    });
  } catch (error) {
    console.error('Respond to introduction request error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to respond to introduction request',
    });
  }
};

// POST /api/sme/request-profile-update - Request profile update (for certified SMEs)
export const requestProfileUpdate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    const { reason } = req.body;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    if (!reason || reason.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Please provide a reason for the update request',
      });
    }

    // Get SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: { fullName: true, email: true },
        },
      },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Only certified or submitted SMEs can request updates
    if (profile.certificationStatus !== CertificationStatus.certified &&
        profile.certificationStatus !== CertificationStatus.under_review &&
        profile.certificationStatus !== CertificationStatus.submitted) {
      return res.status(400).json({
        success: false,
        message: 'Profile update requests are only available for certified or submitted profiles',
      });
    }

    // Create audit log entry for admin notification
    await prisma.auditLog.create({
      data: {
        userId,
        actionType: 'PROFILE_UPDATE_REQUEST',
        actionDescription: `${profile.companyName} requested profile update: ${reason.trim()}`,
        targetType: 'SMEProfile',
        targetId: profile.id,
        ipAddress: req.ip || 'unknown',
        newValue: JSON.stringify({
          reason: reason.trim(),
          companyName: profile.companyName,
          userEmail: profile.user.email,
          currentStatus: profile.certificationStatus,
        }),
      },
    });

    return res.json({
      success: true,
      message: 'Update request sent successfully. Admin will review and enable editing for you.',
    });
  } catch (error) {
    console.error('Request profile update error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to send update request',
    });
  }
};

// GET /api/sme/update-request-status - Get the latest update request status
export const getUpdateRequestStatus = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Unauthorized',
      });
    }

    // Get SME profile
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
    });

    if (!profile) {
      return res.status(404).json({
        success: false,
        message: 'SME profile not found',
      });
    }

    // Get the most recent PROFILE_UPDATE_REQUEST for this profile
    const latestRequest = await prisma.auditLog.findFirst({
      where: {
        targetId: profile.id,
        actionType: 'PROFILE_UPDATE_REQUEST',
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!latestRequest) {
      return res.json({
        success: true,
        data: {
          hasRequest: false,
          status: null,
          reason: null,
          requestedAt: null,
        },
      });
    }

    // Check if there's an approval or rejection after this request
    const response = await prisma.auditLog.findFirst({
      where: {
        targetId: profile.id,
        actionType: {
          in: ['PROFILE_UPDATE_APPROVED', 'PROFILE_UPDATE_REJECTED'],
        },
        timestamp: {
          gt: latestRequest.timestamp,
        },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    if (!response) {
      // Request is still pending
      return res.json({
        success: true,
        data: {
          hasRequest: true,
          status: 'pending',
          reason: null,
          requestedAt: latestRequest.timestamp,
        },
      });
    }

    // Parse the rejection reason if rejected
    let rejectionReason = null;
    if (response.actionType === 'PROFILE_UPDATE_REJECTED' && response.newValue) {
      try {
        const parsed = JSON.parse(response.newValue as string);
        rejectionReason = parsed.reason || null;
      } catch {
        rejectionReason = null;
      }
    }

    return res.json({
      success: true,
      data: {
        hasRequest: true,
        status: response.actionType === 'PROFILE_UPDATE_APPROVED' ? 'approved' : 'rejected',
        reason: rejectionReason,
        requestedAt: latestRequest.timestamp,
        respondedAt: response.timestamp,
      },
    });
  } catch (error) {
    console.error('Get update request status error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to get update request status',
    });
  }
};

// Helper function to calculate profile completion percentage
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function calculateCompletionPercentage(profile: any): number {
  const fields = [
    { name: 'companyName', weight: 15 },
    { name: 'tradeLicenseNumber', weight: 15 },
    { name: 'companyDescription', weight: 10 },
    { name: 'industrySector', weight: 10 },
    { name: 'website', weight: 5 },
    { name: 'address', weight: 10 },
    { name: 'foundingDate', weight: 5 },
    { name: 'employeeCount', weight: 5 },
    { name: 'annualRevenue', weight: 10 },
  ];

  // Check additional fields in documents JSON
  const docs = profile.documents || {};
  const additionalFields = [
    { name: 'contactName', weight: 5 },
    { name: 'contactEmail', weight: 5 },
    { name: 'revenueRange', weight: 5 },
  ];

  let totalWeight = 0;
  let completedWeight = 0;

  for (const field of fields) {
    totalWeight += field.weight;
    if (profile[field.name]) {
      completedWeight += field.weight;
    }
  }

  for (const field of additionalFields) {
    totalWeight += field.weight;
    if (docs[field.name]) {
      completedWeight += field.weight;
    }
  }

  return Math.round((completedWeight / totalWeight) * 100);
}

// GET /api/sme/certificate - Download certification PDF (Registry-Grade)
export const downloadCertificate = async (req: AuthenticatedRequest, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Fetch profile with certificate
    const profile = await prisma.sMEProfile.findUnique({
      where: { userId },
      include: {
        user: { select: { fullName: true, email: true } },
        certificates: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
    });

    if (!profile) {
      return res.status(404).json({ success: false, message: 'Profile not found' });
    }

    if (profile.certificationStatus !== 'certified') {
      return res.status(400).json({ success: false, message: 'Company is not certified' });
    }

    const certificate = profile.certificates[0];
    if (!certificate) {
      return res.status(404).json({ success: false, message: 'Certificate not found. Please contact support.' });
    }

    // Compute dynamic status
    const certStatus = computeCertificateStatus(
      certificate.status as 'active' | 'expired' | 'revoked',
      certificate.expiresAt
    );

    if (certStatus === 'revoked') {
      return res.status(400).json({ success: false, message: 'Certificate has been revoked' });
    }

    // Generate QR code as buffer
    const qrBuffer = await QRCode.toBuffer(certificate.verificationUrl, {
      width: 100,
      margin: 1,
      color: { dark: '#23282d', light: '#ffffff' },
    });

    // Format helpers
    const formatSector = (sector: string) => sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    // Generate PDF - A4 Landscape
    const doc = new PDFDocument({
      size: 'A4',
      layout: 'landscape',
      margins: { top: 40, bottom: 40, left: 50, right: 50 },
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=SME-Certificate-${certificate.certificateId}.pdf`);
    doc.pipe(res);

    const pageW = doc.page.width; // 842
    const pageH = doc.page.height; // 595
    const marginX = 50;
    const contentW = pageW - (marginX * 2);
    let curY = 40;

    // ============ BLOCK 1: Authority Header ============
    doc.fontSize(20).fillColor('#23282d').font('Helvetica-Bold').text('NAYWA', marginX, curY);
    doc.fontSize(10).fillColor('#666').font('Helvetica').text('SME Certification Registry', marginX, curY + 24);
    // Hairline rule
    curY += 45;
    doc.moveTo(marginX, curY).lineTo(pageW - marginX, curY).lineWidth(0.5).strokeColor('#ccc').stroke();

    // ============ BLOCK 2: Certification Statement ============
    curY += 25;
    doc.fontSize(18).fillColor('#23282d').font('Helvetica-Bold').text('Certificate of SME Certification', marginX, curY);
    curY += 30;
    doc.fontSize(10).fillColor('#444').font('Helvetica').text(
      'This certificate attests that the entity named below has successfully completed the Naywa SME certification process and has been verified as a registered Small and Medium Enterprise.',
      marginX, curY, { width: contentW, lineGap: 3 }
    );

    // ============ BLOCK 3: Certified Entity (2-column grid) ============
    curY += 55;

    // Company Name (dominant)
    doc.fontSize(8).fillColor('#888').font('Helvetica').text('COMPANY NAME', marginX, curY);
    doc.fontSize(22).fillColor('#23282d').font('Helvetica-Bold').text(certificate.companyName, marginX, curY + 12);
    curY += 50;

    // Trade License | Industry Sector (2 columns)
    const col1X = marginX;
    const col2X = marginX + contentW / 2 + 20;

    doc.fontSize(8).fillColor('#888').font('Helvetica').text('TRADE LICENSE NUMBER', col1X, curY);
    doc.fontSize(12).fillColor('#23282d').font('Helvetica-Bold').text(certificate.tradeLicenseNumber, col1X, curY + 12);

    doc.fontSize(8).fillColor('#888').font('Helvetica').text('INDUSTRY SECTOR', col2X, curY);
    doc.fontSize(12).fillColor('#23282d').font('Helvetica-Bold').text(formatSector(certificate.industrySector), col2X, curY + 12);

    // ============ BLOCK 4: Validity & Control Box ============
    curY += 55;
    const boxH = 75;
    const boxY = curY;

    // Gray bordered box
    doc.rect(marginX, boxY, contentW, boxH).lineWidth(1).strokeColor('#ddd').stroke();

    // Box content - 5 columns
    const colW = contentW / 5;
    const boxPadding = 12;
    const boxTextY = boxY + boxPadding;

    const drawBoxItem = (colIndex: number, label: string, value: string) => {
      const x = marginX + (colIndex * colW) + boxPadding;
      doc.fontSize(7).fillColor('#888').font('Helvetica').text(label, x, boxTextY, { width: colW - boxPadding * 2 });
      doc.fontSize(10).fillColor('#23282d').font('Helvetica-Bold').text(value, x, boxTextY + 12, { width: colW - boxPadding * 2 });
    };

    drawBoxItem(0, 'CERTIFICATE ID', certificate.certificateId);
    drawBoxItem(1, 'VERSION', certificate.certificateVersion);
    drawBoxItem(2, 'ISSUED DATE', formatCertificateDate(certificate.issuedAt));
    drawBoxItem(3, 'EXPIRES', formatCertificateDate(certificate.expiresAt));

    // Status with color
    const statusX = marginX + (4 * colW) + boxPadding;
    doc.fontSize(7).fillColor('#888').font('Helvetica').text('CERTIFICATION STATUS', statusX, boxTextY);
    const statusColor = certStatus === 'active' ? '#22c55e' : certStatus === 'expired' ? '#f59e0b' : '#ef4444';
    const statusLabel = certStatus === 'active' ? 'Active' : certStatus === 'expired' ? 'Expired' : 'Revoked';
    doc.fontSize(10).fillColor(statusColor).font('Helvetica-Bold').text(statusLabel, statusX, boxTextY + 12);

    // ============ BLOCK 5: Verification Section ============
    curY = boxY + boxH + 15;

    // Right side: QR code (moved up)
    const qrSize = 60;
    const qrX = pageW - marginX - qrSize;
    const qrY = curY - 10;
    doc.image(qrBuffer, qrX, qrY, { width: qrSize, height: qrSize });
    doc.fontSize(6).fillColor('#888').font('Helvetica').text('Scan to Verify', qrX, qrY + qrSize + 2, { width: qrSize, align: 'center', lineBreak: false });

    // Left side: Hash + URL
    const leftWidth = qrX - marginX - 30;
    doc.fontSize(7).fillColor('#888').font('Helvetica').text('VERIFICATION HASH', marginX, curY, { lineBreak: false });
    doc.fontSize(8).fillColor('#555').font('Courier').text(truncateHash(certificate.verificationHash), marginX, curY + 10, { width: leftWidth, lineBreak: false });
    doc.fontSize(6).fillColor('#999').font('Helvetica-Oblique').text(
      'This hash uniquely identifies the certificate and supports integrity verification.',
      marginX, curY + 22, { width: leftWidth, lineBreak: false }
    );

    doc.fontSize(7).fillColor('#888').font('Helvetica').text('VERIFICATION URL', marginX, curY + 36, { lineBreak: false });
    doc.fontSize(8).fillColor('#4a8f87').font('Helvetica').text(certificate.verificationUrl, marginX, curY + 46, { width: leftWidth, lineBreak: false });

    // ============ Footer Statement with Seal on right ============
    const footerY = curY + 62;
    doc.moveTo(marginX, footerY).lineTo(pageW - marginX, footerY).lineWidth(0.5).strokeColor('#eee').stroke();

    // Footer text on left
    doc.fontSize(5.5).fillColor('#999').font('Helvetica-Oblique').text(
      'Digitally issued via Naywa Registry. This document is electronically generated and does not require a physical signature. Certification reflects assessment based on documentation at time of review.',
      marginX, footerY + 6, { width: contentW - 90, lineBreak: false }
    );

    // Digital Verification Seal - aligned with footer (right side)
    const sealW = 70;
    const sealH = 22;
    const sealX = pageW - marginX - sealW;
    const sealY = footerY + 3;
    doc.rect(sealX, sealY, sealW, sealH).lineWidth(1).strokeColor('#4a8f87').stroke();
    doc.rect(sealX + 1, sealY + 1, sealW - 2, sealH - 2).lineWidth(0.5).strokeColor('#4a8f87').stroke();
    doc.fontSize(5).fillColor('#4a8f87').font('Helvetica-Bold').text('NAYWA CERTIFIED', sealX, sealY + 5, { width: sealW, align: 'center', lineBreak: false });
    doc.fontSize(4.5).fillColor('#666').font('Helvetica').text('Digital Verification Seal', sealX, sealY + 13, { width: sealW, align: 'center', lineBreak: false });

    doc.end();

    // Log certificate download
    await logAuditAction({
      userId,
      actionType: AuditAction.CERTIFICATE_DOWNLOADED,
      actionDescription: `Downloaded certificate ${certificate.certificateId}`,
      targetType: 'Certificate',
      targetId: certificate.id,
      ipAddress: getClientIP(req),
    });

    return;
  } catch (error) {
    console.error('Certificate generation error:', error);
    return res.status(500).json({ success: false, message: 'Failed to generate certificate' });
  }
};
