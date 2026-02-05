import crypto from 'crypto';

/**
 * Certificate Utility Functions
 * Handles certificate ID generation, hash computation, version management, and status calculation
 */

interface CertificateHashPayload {
  certificateId: string;
  companyName: string;
  tradeLicenseNumber: string;
  industrySector: string;
  issuedAt: Date;
  expiresAt: Date;
  version: string;
}

/**
 * Generate a unique certificate ID in format SME-CERT-XXXXXXXX
 * Uses crypto.randomBytes for cryptographically secure random generation
 */
export function generateCertificateId(): string {
  const randomHex = crypto.randomBytes(4).toString('hex').toUpperCase();
  return `SME-CERT-${randomHex}`;
}

/**
 * Generate SHA-256 verification hash from certificate payload
 * Sorts keys alphabetically for consistent hashing
 */
export function generateVerificationHash(payload: CertificateHashPayload): string {
  // Create sorted payload with ISO date strings for consistency
  const sortedPayload = {
    certificateId: payload.certificateId,
    companyName: payload.companyName,
    expiresAt: payload.expiresAt.toISOString(),
    industrySector: payload.industrySector,
    issuedAt: payload.issuedAt.toISOString(),
    tradeLicenseNumber: payload.tradeLicenseNumber,
    version: payload.version,
  };

  const payloadString = JSON.stringify(sortedPayload);
  return crypto.createHash('sha256').update(payloadString).digest('hex');
}

/**
 * Truncate verification hash for display (first 16 chars + ... + last 16 chars)
 */
export function truncateHash(hash: string): string {
  if (hash.length <= 32) return hash;
  return `${hash.slice(0, 16)}...${hash.slice(-16)}`;
}

/**
 * Compute dynamic certificate status based on stored status and expiry date
 * Priority: revoked > expired > active
 */
export function computeCertificateStatus(
  storedStatus: 'active' | 'expired' | 'revoked',
  expiresAt: Date
): 'active' | 'expired' | 'revoked' {
  // Revoked takes priority - even if expired, show revoked
  if (storedStatus === 'revoked') {
    return 'revoked';
  }

  // Check if expired based on current date
  if (new Date() > expiresAt) {
    return 'expired';
  }

  return 'active';
}

/**
 * Increment certificate version
 * v1.0 -> v1.1 -> v1.2 ... -> v1.9 -> v2.0
 */
export function incrementVersion(currentVersion: string): string {
  const match = currentVersion.match(/^v(\d+)\.(\d+)$/);
  if (!match) {
    return 'v1.0'; // Default if invalid format
  }

  let major = parseInt(match[1], 10);
  let minor = parseInt(match[2], 10);

  minor++;
  if (minor > 9) {
    major++;
    minor = 0;
  }

  return `v${major}.${minor}`;
}

/**
 * Calculate expiry date (+12 months from issuance)
 */
export function calculateExpiryDate(issuedAt: Date = new Date()): Date {
  const expiresAt = new Date(issuedAt);
  expiresAt.setFullYear(expiresAt.getFullYear() + 1);
  return expiresAt;
}

/**
 * Format date as displayed on certificate (e.g., "February 6, 2026")
 */
export function formatCertificateDate(date: Date): string {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Build verification URL for a certificate
 */
export function buildVerificationUrl(certificateId: string, frontendUrl: string): string {
  return `${frontendUrl}/certificate/${certificateId}`;
}
