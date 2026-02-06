import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { Request } from 'express';

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (req: Request, file, cb) => {
    // Create user-specific directory
    const userId = (req as any).user?.userId || 'unknown';
    const userDir = path.join(uploadsDir, userId);

    if (!fs.existsSync(userDir)) {
      fs.mkdirSync(userDir, { recursive: true });
    }

    cb(null, userDir);
  },
  filename: (req: Request, file, cb) => {
    // Generate unique filename: timestamp-originalname
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const baseName = path.basename(file.originalname, ext)
      .replace(/[^a-zA-Z0-9]/g, '_')
      .substring(0, 50);
    cb(null, `${uniqueSuffix}-${baseName}${ext}`);
  },
});

// File filter - only allow certain file types
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedExtensions = ['.pdf', '.jpg', '.jpeg', '.png', '.doc', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type. Allowed types: ${allowedExtensions.join(', ')}`));
  }
};

// Configure multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
    files: 1, // Single file upload
  },
});

// Multiple files upload (up to 5)
export const uploadMultiple = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max per file
    files: 5, // Max 5 files at once
  },
});

// Document types for SME certification
export const DOCUMENT_TYPES = {
  TRADE_LICENSE: 'trade_license',
  CERTIFICATE_OF_INCORPORATION: 'certificate_of_incorporation',
  COMPANY_REGISTRATION: 'company_registration',
  VAT_CERTIFICATE: 'vat_certificate',
  MOA_SHAREHOLDING: 'moa_shareholding',
  SIGNATORY_ID: 'signatory_id',
  UBO_DECLARATION: 'ubo_declaration',
  FINANCIAL_STATEMENTS: 'financial_statements',
  BANK_STATEMENT: 'bank_statement',
  WPS_CERTIFICATE: 'wps_certificate',
  COMPANY_PROFILE: 'company_profile',
  LICENSES_PERMITS: 'licenses_permits',
  CONTRACTS_REFERENCES: 'contracts_references',
  OTHER: 'other',
} as const;

export type DocumentType = typeof DOCUMENT_TYPES[keyof typeof DOCUMENT_TYPES];

export const DOCUMENT_TYPE_LABELS: Record<DocumentType, string> = {
  trade_license: 'Trade License',
  certificate_of_incorporation: 'Certificate of Incorporation',
  company_registration: 'Company Registration Details',
  vat_certificate: 'VAT Registration Certificate',
  moa_shareholding: 'MOA / Shareholding Structure',
  signatory_id: 'Authorized Signatory ID',
  ubo_declaration: 'UBO Declaration',
  financial_statements: 'Financial Statements',
  bank_statement: 'Bank Statement',
  wps_certificate: 'WPS Certificate',
  company_profile: 'Company Profile',
  licenses_permits: 'Licenses / Permits',
  contracts_references: 'Contracts / References',
  other: 'Other Document',
};

export const REQUIRED_DOCUMENTS: DocumentType[] = [
  DOCUMENT_TYPES.TRADE_LICENSE,
  DOCUMENT_TYPES.COMPANY_REGISTRATION,
  DOCUMENT_TYPES.SIGNATORY_ID,
  DOCUMENT_TYPES.FINANCIAL_STATEMENTS,
  DOCUMENT_TYPES.COMPANY_PROFILE,
];
