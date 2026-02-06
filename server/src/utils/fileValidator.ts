import fs from 'fs';
import path from 'path';

// Magic bytes (file signatures) for allowed file types
const MAGIC_BYTES: Record<string, { bytes: number[]; offset?: number }[]> = {
  // PDF: %PDF
  'application/pdf': [{ bytes: [0x25, 0x50, 0x44, 0x46] }],

  // JPEG: FFD8FF
  'image/jpeg': [{ bytes: [0xFF, 0xD8, 0xFF] }],
  'image/jpg': [{ bytes: [0xFF, 0xD8, 0xFF] }],

  // PNG: 89504E47
  'image/png': [{ bytes: [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A] }],

  // DOC: D0CF11E0 (OLE Compound Document)
  'application/msword': [{ bytes: [0xD0, 0xCF, 0x11, 0xE0, 0xA1, 0xB1, 0x1A, 0xE1] }],

  // DOCX: 504B0304 (ZIP-based, starts with PK)
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': [
    { bytes: [0x50, 0x4B, 0x03, 0x04] }
  ],
};

// Extension to MIME type mapping
const EXTENSION_MIME_MAP: Record<string, string[]> = {
  '.pdf': ['application/pdf'],
  '.jpg': ['image/jpeg', 'image/jpg'],
  '.jpeg': ['image/jpeg', 'image/jpg'],
  '.png': ['image/png'],
  '.doc': ['application/msword'],
  '.docx': ['application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
};

export interface ValidationResult {
  valid: boolean;
  error?: string;
  details?: {
    declaredMime: string;
    detectedMime: string;
    extension: string;
    magicBytesMatch: boolean;
    mimeExtensionMatch: boolean;
  };
}

/**
 * Read the first N bytes of a file to check magic bytes
 */
function readFileHeader(filePath: string, numBytes: number = 8): Buffer {
  const fd = fs.openSync(filePath, 'r');
  const buffer = Buffer.alloc(numBytes);
  fs.readSync(fd, buffer, 0, numBytes, 0);
  fs.closeSync(fd);
  return buffer;
}

/**
 * Check if buffer starts with the given magic bytes
 */
function matchesMagicBytes(buffer: Buffer, signature: { bytes: number[]; offset?: number }): boolean {
  const offset = signature.offset || 0;
  for (let i = 0; i < signature.bytes.length; i++) {
    if (buffer[offset + i] !== signature.bytes[i]) {
      return false;
    }
  }
  return true;
}

/**
 * Detect MIME type from magic bytes
 */
function detectMimeFromMagicBytes(filePath: string): string | null {
  try {
    const header = readFileHeader(filePath, 16);

    for (const [mime, signatures] of Object.entries(MAGIC_BYTES)) {
      for (const signature of signatures) {
        if (matchesMagicBytes(header, signature)) {
          return mime;
        }
      }
    }

    return null;
  } catch {
    return null;
  }
}

/**
 * Validate uploaded file for security
 * - Checks magic bytes match declared MIME type
 * - Checks extension matches MIME type
 * - Rejects files with mismatched types
 */
export function validateUploadedFile(
  filePath: string,
  declaredMime: string,
  originalName: string
): ValidationResult {
  const extension = path.extname(originalName).toLowerCase();

  // Check if extension is allowed
  if (!EXTENSION_MIME_MAP[extension]) {
    return {
      valid: false,
      error: `File extension ${extension} is not allowed`,
    };
  }

  // Check if declared MIME matches expected for extension
  const expectedMimes = EXTENSION_MIME_MAP[extension];
  const mimeExtensionMatch = expectedMimes.includes(declaredMime);

  // Detect actual file type from magic bytes
  const detectedMime = detectMimeFromMagicBytes(filePath);

  // Check if magic bytes match
  let magicBytesMatch = false;
  if (detectedMime) {
    // For JPEG, both image/jpeg and image/jpg are valid
    if (declaredMime === 'image/jpg' && detectedMime === 'image/jpeg') {
      magicBytesMatch = true;
    } else if (declaredMime === 'image/jpeg' && detectedMime === 'image/jpg') {
      magicBytesMatch = true;
    } else {
      magicBytesMatch = detectedMime === declaredMime;
    }
  }

  const details = {
    declaredMime,
    detectedMime: detectedMime || 'unknown',
    extension,
    magicBytesMatch,
    mimeExtensionMatch,
  };

  // Validation rules
  if (!mimeExtensionMatch) {
    return {
      valid: false,
      error: `File extension ${extension} does not match declared type ${declaredMime}`,
      details,
    };
  }

  if (detectedMime && !magicBytesMatch) {
    return {
      valid: false,
      error: `File content does not match declared type. Expected ${declaredMime}, detected ${detectedMime}`,
      details,
    };
  }

  // If we couldn't detect the type but extension and MIME match, allow it
  // (some valid files might have unusual headers)
  if (!detectedMime && mimeExtensionMatch) {
    console.warn(`Could not detect magic bytes for file: ${originalName}, allowing based on extension/MIME match`);
  }

  return {
    valid: true,
    details,
  };
}

/**
 * Delete file if validation fails
 */
export function deleteInvalidFile(filePath: string): void {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  } catch (error) {
    console.error('Failed to delete invalid file:', error);
  }
}
