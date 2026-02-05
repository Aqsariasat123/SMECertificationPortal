export type UserRole = 'user' | 'sme' | 'admin';

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  phoneNumber: string | null;
  profilePicture?: string | null;
  organization?: string | null;
  createdAt: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  errors?: Record<string, string[]>;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'user' | 'sme';
  companyName?: string;
  tradeLicenseNumber?: string;
  industrySector?: string;
}

// SME Profile Types
export type CertificationStatus =
  | 'draft'
  | 'submitted'
  | 'under_review'
  | 'certified'
  | 'rejected'
  | 'revision_requested';

export type IndustrySector =
  | 'technology'
  | 'healthcare'
  | 'finance'
  | 'retail'
  | 'manufacturing'
  | 'real_estate'
  | 'hospitality'
  | 'education'
  | 'other';

export type LegalStructure =
  | 'llc'
  | 'partnership'
  | 'sole_proprietorship'
  | 'corporation'
  | 'free_zone'
  | 'branch'
  | 'other';

export type BusinessModel =
  | 'b2b'
  | 'b2c'
  | 'b2b2c'
  | 'marketplace'
  | 'saas'
  | 'other';

export type FundingStage =
  | 'bootstrapped'
  | 'pre_seed'
  | 'seed'
  | 'series_a'
  | 'series_b'
  | 'series_c_plus'
  | 'profitable'
  | 'other';

export type OfficeType =
  | 'own_premises'
  | 'rented'
  | 'shared_coworking'
  | 'virtual'
  | 'home_based';

export interface Shareholder {
  name: string;
  nationality: string;
  percentage: number;
}

export interface BoardMember {
  name: string;
  position: string;
  nationality: string;
}

export interface Certification {
  name: string;
  issuedBy: string;
  validUntil: string;
}

export interface RegulatoryLicense {
  name: string;
  licenseNumber: string;
  validUntil: string;
}

export interface SocialMedia {
  twitter?: string;
  facebook?: string;
  instagram?: string;
  linkedin?: string;
}

export interface SMEProfileData {
  id: string;
  userId: string;

  // Basic Info
  companyName: string | null;
  tradeLicenseNumber: string | null;
  companyDescription: string | null;
  industrySector: IndustrySector | null;
  foundingDate: string | null;
  employeeCount: number | null;
  annualRevenue: number | null;
  website: string | null;
  address: string | null;

  // Legal & Registration
  registrationNumber: string | null;
  vatNumber: string | null;
  licenseExpiryDate: string | null;
  legalStructure: LegalStructure | null;
  registrationCountry: string | null;
  registrationCity: string | null;

  // Ownership & Management
  ownerName: string | null;
  ownerNationality: string | null;
  ownerIdNumber: string | null;
  shareholderStructure: Shareholder[] | null;
  boardMembers: BoardMember[] | null;

  // Financial Info
  bankName: string | null;
  bankAccountNumber: string | null;
  auditorName: string | null;
  lastAuditDate: string | null;
  profitMargin: number | null;
  fundingStage: FundingStage | null;

  // Business Operations
  businessModel: BusinessModel | null;
  operatingCountries: string[] | null;
  majorClients: string[] | null;
  officeType: OfficeType | null;

  // Compliance & Certifications
  existingCertifications: Certification[] | null;
  regulatoryLicenses: RegulatoryLicense[] | null;
  complianceOfficerName: string | null;
  complianceOfficerEmail: string | null;
  hasAmlPolicy: boolean;
  hasDataProtectionPolicy: boolean;

  // Contact & Social
  linkedinUrl: string | null;
  socialMedia: SocialMedia | null;
  headOfficeAddress: string | null;
  headOfficeLatitude: number | null;
  headOfficeLongitude: number | null;
  secondaryContactName: string | null;
  secondaryContactPhone: string | null;
  secondaryContactEmail: string | null;

  // System fields
  documents: SMEDocuments | null;
  certificationStatus: CertificationStatus;
  submittedDate: string | null;
  revisionNotes: string | null;
  listingVisible: boolean;
  completionPercentage: number;
  user: {
    fullName: string;
    email: string;
    phoneNumber: string | null;
  };
}

export interface SMEDocuments {
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  revenueRange?: string;
  revenueGrowth?: string;
  fundingStage?: string;
  companyLogo?: string;
  uploadedFiles?: Array<{
    name: string;
    path: string;
    uploadedAt: string;
  }>;
}

export interface SMEProfileUpdateData {
  // Basic Info
  companyName?: string;
  tradeLicenseNumber?: string;
  companyDescription?: string;
  industrySector?: string;
  foundingDate?: string;
  employeeCount?: number;
  annualRevenue?: number;
  website?: string;
  address?: string;

  // Legacy contact fields (stored in documents JSON)
  contactName?: string;
  contactPosition?: string;
  contactEmail?: string;
  contactPhone?: string;
  revenueRange?: string;
  revenueGrowth?: string;

  // Legal & Registration (Required)
  registrationNumber?: string;
  vatNumber?: string;
  licenseExpiryDate?: string;
  legalStructure?: string;
  registrationCountry?: string;
  registrationCity?: string;

  // Ownership & Management (Required)
  ownerName?: string;
  ownerNationality?: string;
  ownerIdNumber?: string;
  shareholderStructure?: Shareholder[];
  boardMembers?: BoardMember[];

  // Financial Info (Optional)
  bankName?: string;
  bankAccountNumber?: string;
  auditorName?: string;
  lastAuditDate?: string;
  profitMargin?: number;
  fundingStage?: string;

  // Business Operations (Optional)
  businessModel?: string;
  operatingCountries?: string[];
  majorClients?: string[];
  officeType?: string;

  // Compliance & Certifications (Optional)
  existingCertifications?: Certification[];
  regulatoryLicenses?: RegulatoryLicense[];
  complianceOfficerName?: string;
  complianceOfficerEmail?: string;
  hasAmlPolicy?: boolean;
  hasDataProtectionPolicy?: boolean;

  // Contact & Social (Optional)
  linkedinUrl?: string;
  socialMedia?: SocialMedia;
  headOfficeAddress?: string;
  headOfficeLatitude?: number;
  headOfficeLongitude?: number;
  secondaryContactName?: string;
  secondaryContactPhone?: string;
  secondaryContactEmail?: string;
}

// Admin Types
export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
  lastLogin: string | null;
}

export interface AdminApplication {
  id: string;
  userId: string;
  companyName: string | null;
  tradeLicenseNumber: string | null;
  companyDescription: string | null;
  industrySector: IndustrySector | null;
  foundingDate: string | null;
  employeeCount: number | null;
  annualRevenue: number | null;
  website: string | null;
  address: string | null;

  // Legal & Registration
  registrationNumber: string | null;
  vatNumber: string | null;
  licenseExpiryDate: string | null;
  legalStructure: LegalStructure | null;
  registrationCountry: string | null;
  registrationCity: string | null;

  // Ownership & Management
  ownerName: string | null;
  ownerNationality: string | null;
  ownerIdNumber: string | null;
  shareholderStructure: Shareholder[] | null;
  boardMembers: BoardMember[] | null;

  // Financial Info
  bankName: string | null;
  bankAccountNumber: string | null;
  auditorName: string | null;
  lastAuditDate: string | null;
  profitMargin: number | null;
  fundingStage: FundingStage | null;

  // Business Operations
  businessModel: BusinessModel | null;
  operatingCountries: string[] | null;
  majorClients: string[] | null;
  officeType: OfficeType | null;

  // Compliance
  existingCertifications: Certification[] | null;
  regulatoryLicenses: RegulatoryLicense[] | null;
  complianceOfficerName: string | null;
  complianceOfficerEmail: string | null;
  hasAmlPolicy: boolean;
  hasDataProtectionPolicy: boolean;

  // Contact & Social
  linkedinUrl: string | null;
  socialMedia: SocialMedia | null;
  headOfficeAddress: string | null;
  secondaryContactName: string | null;
  secondaryContactPhone: string | null;
  secondaryContactEmail: string | null;

  // Documents
  documents: SMEDocuments | null;

  // System fields
  certificationStatus: CertificationStatus;
  submittedDate: string | null;
  revisionNotes: string | null;
  listingVisible: boolean;
  completionPercentage: number;
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  };
  reviewedBy?: {
    fullName: string;
  };
}

export interface AdminDashboardStats {
  totalUsers: number;
  totalSMEs: number;
  pendingApplications: number;
  certifiedSMEs: number;
}

export interface AuditLogEntry {
  id: string;
  userId: string;
  actionType: string;
  actionDescription: string;
  targetType: string | null;
  targetId: string | null;
  ipAddress: string;
  timestamp: string;
  user: {
    fullName: string;
    email: string;
    role: UserRole;
  };
}

export interface PaginationData {
  page: number;
  limit: number;
  total: number;
  pages: number;
}

export type ReviewAction = 'approve' | 'reject' | 'request_revision' | 'start_review';

// Registry Types (Public SME listing)
export interface RegistrySME {
  id: string;
  companyName: string | null;
  companyDescription: string | null;
  industrySector: IndustrySector | null;
  employeeCount: number | null;
  website: string | null;
  updatedAt: string;
  companyLogo: string | null;
}

export interface RegistrySMEDetail extends RegistrySME {
  address: string | null;
  foundingDate: string | null;
  contactInfo: {
    contactName: string | null;
    contactPosition: string | null;
    contactEmail: string | null;
    contactPhone: string | null;
  } | null;
  // Additional public fields for crowdfunding-style display
  legalStructure: LegalStructure | null;
  registrationCountry: string | null;
  registrationCity: string | null;
  businessModel: BusinessModel | null;
  operatingCountries: string[] | null;
  majorClients: string[] | null;
  officeType: OfficeType | null;
  fundingStage: FundingStage | null;
  existingCertifications: Certification[] | null;
  regulatoryLicenses: RegulatoryLicense[] | null;
  linkedinUrl: string | null;
  socialMedia: SocialMedia | null;
  headOfficeAddress: string | null;
  submittedDate: string | null;
  revenueRange: string | null;
  revenueGrowth: string | null;
}

export type IntroductionRequestStatus = 'pending' | 'viewed' | 'responded';

// Investor KYC Types
export type InvestorType = 'individual' | 'company';
export type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'revision_requested';

export interface KycApplication {
  id: string;
  userId: string;
  investorType: InvestorType | null;
  kycStatus: KycStatus;
  kycSubmittedDate: string | null;
  kycReviewedDate: string | null;
  kycNotes: string | null;

  // Individual KYC fields
  nationality: string | null;
  dateOfBirth: string | null;
  emiratesId: string | null;
  passportNumber: string | null;
  passportExpiry: string | null;
  residentialAddress: string | null;
  city: string | null;
  country: string | null;
  postalCode: string | null;
  employmentStatus: string | null;
  employerName: string | null;
  jobTitle: string | null;
  annualIncome: string | null;
  sourceOfFunds: string | null;
  investmentExperience: string | null;
  riskTolerance: string | null;

  // Company KYC fields
  companyNameKyc: string | null;
  companyTradeLicense: string | null;
  companyRegistrationNumber: string | null;
  companyIncorporationDate: string | null;
  companyJurisdiction: string | null;
  companyAddress: string | null;
  companyCity: string | null;
  companyCountry: string | null;
  authorizedRepName: string | null;
  authorizedRepTitle: string | null;
  authorizedRepEmail: string | null;
  authorizedRepPhone: string | null;
  beneficialOwners: Array<{
    name: string;
    nationality: string;
    ownershipPercentage: number;
    idNumber: string;
  }> | null;
  companyBankName: string | null;
  companyBankAccountNumber: string | null;
  companySourceOfFunds: string | null;
  companyAnnualRevenue: string | null;

  // Documents
  kycDocuments: Record<string, string> | null;

  // User info
  user: {
    id: string;
    fullName: string;
    email: string;
    phoneNumber: string | null;
  };
}

// Analytics Types (server-computed)
export interface AnalyticsData {
  timeRange: number;
  totalActions: number;
  loginSegmentation: {
    sme: number;
    user: number;
    admin: number;
    total: number;
  };
  usageQuality: {
    uniqueLogins: number;
    repeatLogins: number;
    inactiveCertified: number;
  };
  certificationLifecycle: {
    avgDaysToSubmit: number;
    funnel: Record<string, number>;
  };
  activityByDay: { date: string; count: number }[];
  actionsByType: Record<string, number>;
  certificationStats: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    approvalRate: number;
  };
  registryConsumption: {
    totalViews: number;
    totalSearches: number;
    textSearches: number;
    sectorSearches: number;
    zeroResultSearches: number;
    viewsBySector: Record<string, number>;
  };
  riskCompliance: {
    missingDocs: number;
    nearExpiry: number;
    expiredLicenses: number;
    adminOverrides: number;
    rejectionsPeriod: number;
  };
}

// Legal Page Types
export interface LegalPageData {
  slug: string;
  title: string;
  content: string;
  lastUpdated: string;
  isPublished?: boolean;
}

export interface IntroductionRequest {
  id: string;
  smeId: string;
  smeName: string | null;
  smeSector: IndustrySector | null;
  message: string;
  status: IntroductionRequestStatus;
  requestedDate: string;
}

export interface AdminIntroductionRequest {
  id: string;
  requester: {
    id: string;
    fullName: string;
    email: string;
  };
  sme: {
    id: string;
    companyName: string | null;
    industrySector: IndustrySector | null;
  };
  message: string;
  status: IntroductionRequestStatus;
  requestedDate: string;
}
