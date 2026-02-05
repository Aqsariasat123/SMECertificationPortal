/**
 * Migration Script: Create Certificate records for existing certified SMEs
 *
 * This script creates Certificate records for all SMEProfiles that are
 * certified but don't have a Certificate record yet.
 *
 * Run with: npx ts-node scripts/migrate-existing-certificates.ts
 */

import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import {
  generateCertificateId,
  generateVerificationHash,
  calculateExpiryDate,
  buildVerificationUrl,
} from '../src/utils/certificate';

const prisma = new PrismaClient();

async function migrateExistingCertificates() {
  console.log('Starting certificate migration...\n');

  // Find admin user to use as issuer
  const adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
    select: { id: true, fullName: true },
  });

  if (!adminUser) {
    console.error('ERROR: No admin user found in database. Please create an admin user first.');
    process.exit(1);
  }

  console.log(`Using admin user "${adminUser.fullName}" as certificate issuer.\n`);

  // Find all certified SMEs without certificates
  const certifiedProfiles = await prisma.sMEProfile.findMany({
    where: {
      certificationStatus: 'certified',
      certificates: {
        none: {},
      },
    },
    select: {
      id: true,
      companyName: true,
      tradeLicenseNumber: true,
      industrySector: true,
      submittedDate: true,
      updatedAt: true,
    },
  });

  console.log(`Found ${certifiedProfiles.length} certified SMEs without certificates.\n`);

  if (certifiedProfiles.length === 0) {
    console.log('No migration needed. All certified SMEs already have certificates.');
    await prisma.$disconnect();
    return;
  }

  const frontendUrl = process.env.FRONTEND_URL || 'https://sme.byredstone.com';
  let successCount = 0;
  let errorCount = 0;

  for (const profile of certifiedProfiles) {
    try {
      // Use submitted date as issued date, or updatedAt as fallback
      const issuedAt = profile.submittedDate ? new Date(profile.submittedDate) : new Date(profile.updatedAt);
      const expiresAt = calculateExpiryDate(issuedAt);
      const certificateId = generateCertificateId();
      const version = 'v1.0';

      const verificationHash = generateVerificationHash({
        certificateId,
        companyName: profile.companyName || '',
        tradeLicenseNumber: profile.tradeLicenseNumber || '',
        industrySector: profile.industrySector || 'other',
        issuedAt,
        expiresAt,
        version,
      });

      await prisma.certificate.create({
        data: {
          certificateId,
          certificateVersion: version,
          smeProfileId: profile.id,
          companyName: profile.companyName || '',
          tradeLicenseNumber: profile.tradeLicenseNumber || '',
          industrySector: profile.industrySector || 'other',
          issuedAt,
          expiresAt,
          status: 'active',
          verificationUrl: buildVerificationUrl(certificateId, frontendUrl),
          verificationHash,
          issuedById: adminUser.id,
        },
      });

      console.log(`✓ Created certificate ${certificateId} for "${profile.companyName}"`);
      successCount++;
    } catch (error) {
      console.error(`✗ Failed to create certificate for "${profile.companyName}":`, error);
      errorCount++;
    }
  }

  console.log('\n========================================');
  console.log(`Migration complete!`);
  console.log(`  Successful: ${successCount}`);
  console.log(`  Failed: ${errorCount}`);
  console.log('========================================\n');

  await prisma.$disconnect();
}

// Run migration
migrateExistingCertificates().catch((error) => {
  console.error('Migration failed:', error);
  prisma.$disconnect();
  process.exit(1);
});
