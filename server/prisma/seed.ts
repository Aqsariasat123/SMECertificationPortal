import { PrismaClient, UserRole, CertificationStatus, IndustrySector, RequestStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  await prisma.$executeRaw`DELETE FROM audit_logs`;
  await prisma.$executeRaw`DELETE FROM introduction_requests`;
  await prisma.$executeRaw`DELETE FROM sme_profiles`;
  await prisma.$executeRaw`DELETE FROM user_profiles`;
  await prisma.$executeRaw`DELETE FROM users`;

  console.log('🗑️  Cleared existing data');

  const hashedPassword = await bcrypt.hash('Password123!', 10);

  // Create Admin User
  const admin = await prisma.user.create({
    data: {
      email: 'admin@smecert.ae',
      password: hashedPassword,
      role: UserRole.admin,
      fullName: 'System Administrator',
      phoneNumber: '+971501234567',
      isVerified: true,
    },
  });
  console.log('👤 Created admin user:', admin.email);

  // Create Regular Users (Registry Visitors)
  const user1 = await prisma.user.create({
    data: {
      email: 'user@example.com',
      password: hashedPassword,
      role: UserRole.user,
      fullName: 'Ahmed Al Mansouri',
      phoneNumber: '+971502345678',
      isVerified: true,
      userProfile: {
        create: {
          company: 'Dubai Investment Partners',
          jobTitle: 'Business Development Manager',
        },
      },
    },
  });
  console.log('👤 Created user:', user1.email);

  const user2 = await prisma.user.create({
    data: {
      email: 'user2@example.com',
      password: hashedPassword,
      role: UserRole.user,
      fullName: 'Sarah Khan',
      phoneNumber: '+971503456789',
      isVerified: true,
      userProfile: {
        create: {
          company: 'Abu Dhabi Ventures',
          jobTitle: 'Investment Analyst',
        },
      },
    },
  });
  console.log('👤 Created user:', user2.email);

  // Create SME Users with Profiles (Various Statuses)

  // SME 1 - Certified and Visible
  const sme1 = await prisma.user.create({
    data: {
      email: 'sme@techstartup.ae',
      password: hashedPassword,
      role: UserRole.sme,
      fullName: 'Mohammad Al Hashimi',
      phoneNumber: '+971504567890',
      isVerified: true,
      smeProfile: {
        create: {
          companyName: 'TechStart UAE',
          tradeLicenseNumber: 'TL-2024-001234',
          companyDescription: 'Leading technology solutions provider specializing in AI and machine learning applications for businesses in the GCC region.',
          industrySector: IndustrySector.technology,
          foundingDate: new Date('2020-03-15'),
          employeeCount: 25,
          annualRevenue: 2500000,
          website: 'https://techstart.ae',
          address: 'Dubai Internet City, Building 5, Office 301',
          documents: JSON.stringify([
            { name: 'Trade License', path: '/uploads/tl-techstart.pdf', uploadedAt: '2024-01-15' },
            { name: 'Financial Statement', path: '/uploads/fs-techstart.pdf', uploadedAt: '2024-01-15' },
          ]),
          certificationStatus: CertificationStatus.certified,
          submittedDate: new Date('2024-01-20'),
          reviewedById: admin.id,
          listingVisible: true,
        },
      },
    },
  });
  console.log('🏢 Created certified SME:', sme1.email);

  // SME 2 - Certified and Visible
  const sme2 = await prisma.user.create({
    data: {
      email: 'sme@healthplus.ae',
      password: hashedPassword,
      role: UserRole.sme,
      fullName: 'Dr. Fatima Al Zaabi',
      phoneNumber: '+971505678901',
      isVerified: true,
      smeProfile: {
        create: {
          companyName: 'HealthPlus Medical Center',
          tradeLicenseNumber: 'TL-2024-005678',
          companyDescription: 'Premium healthcare provider offering comprehensive medical services with state-of-the-art facilities.',
          industrySector: IndustrySector.healthcare,
          foundingDate: new Date('2018-07-10'),
          employeeCount: 45,
          annualRevenue: 5000000,
          website: 'https://healthplus.ae',
          address: 'Healthcare City, Abu Dhabi',
          documents: JSON.stringify([
            { name: 'Trade License', path: '/uploads/tl-healthplus.pdf', uploadedAt: '2024-02-01' },
            { name: 'Healthcare License', path: '/uploads/hl-healthplus.pdf', uploadedAt: '2024-02-01' },
          ]),
          certificationStatus: CertificationStatus.certified,
          submittedDate: new Date('2024-02-05'),
          reviewedById: admin.id,
          listingVisible: true,
        },
      },
    },
  });
  console.log('🏢 Created certified SME:', sme2.email);

  // SME 3 - Under Review
  const sme3 = await prisma.user.create({
    data: {
      email: 'sme@retailhub.ae',
      password: hashedPassword,
      role: UserRole.sme,
      fullName: 'Khalid Al Nasser',
      phoneNumber: '+971506789012',
      isVerified: true,
      smeProfile: {
        create: {
          companyName: 'RetailHub Trading',
          tradeLicenseNumber: 'TL-2024-009012',
          companyDescription: 'Multi-channel retail business specializing in consumer electronics and home appliances.',
          industrySector: IndustrySector.retail,
          foundingDate: new Date('2019-11-20'),
          employeeCount: 30,
          annualRevenue: 3200000,
          website: 'https://retailhub.ae',
          address: 'Sharjah Industrial Area',
          documents: JSON.stringify([
            { name: 'Trade License', path: '/uploads/tl-retailhub.pdf', uploadedAt: '2024-03-01' },
          ]),
          certificationStatus: CertificationStatus.under_review,
          submittedDate: new Date('2024-03-05'),
          listingVisible: false,
        },
      },
    },
  });
  console.log('🏢 Created SME under review:', sme3.email);

  // SME 4 - Draft (Profile incomplete)
  const sme4 = await prisma.user.create({
    data: {
      email: 'sme@newbusiness.ae',
      password: hashedPassword,
      role: UserRole.sme,
      fullName: 'Layla Hassan',
      phoneNumber: '+971507890123',
      isVerified: true,
      smeProfile: {
        create: {
          companyName: 'NewBiz Solutions',
          industrySector: IndustrySector.finance,
          certificationStatus: CertificationStatus.draft,
          listingVisible: false,
        },
      },
    },
  });
  console.log('🏢 Created SME draft:', sme4.email);

  // SME 5 - Revision Requested
  const sme5 = await prisma.user.create({
    data: {
      email: 'sme@constructco.ae',
      password: hashedPassword,
      role: UserRole.sme,
      fullName: 'Omar Al Qassim',
      phoneNumber: '+971508901234',
      isVerified: true,
      smeProfile: {
        create: {
          companyName: 'ConstructCo Building Materials',
          tradeLicenseNumber: 'TL-2024-003456',
          companyDescription: 'Building materials supplier for construction projects across UAE.',
          industrySector: IndustrySector.manufacturing,
          foundingDate: new Date('2017-05-12'),
          employeeCount: 60,
          annualRevenue: 8000000,
          website: 'https://constructco.ae',
          address: 'Jebel Ali Free Zone',
          certificationStatus: CertificationStatus.revision_requested,
          submittedDate: new Date('2024-02-15'),
          reviewedById: admin.id,
          revisionNotes: 'Please provide updated financial statements for the last fiscal year and valid trade license copy.',
          listingVisible: false,
        },
      },
    },
  });
  console.log('🏢 Created SME with revision request:', sme5.email);

  // Get SME profiles for introduction requests
  const smeProfile1 = await prisma.sMEProfile.findFirst({ where: { userId: sme1.id } });
  const smeProfile2 = await prisma.sMEProfile.findFirst({ where: { userId: sme2.id } });

  // Create Introduction Requests
  if (smeProfile1 && smeProfile2) {
    await prisma.introductionRequest.create({
      data: {
        requesterId: user1.id,
        smeProfileId: smeProfile1.id,
        message: 'We are interested in exploring potential technology partnerships for our digital transformation initiatives. Would love to schedule a meeting to discuss collaboration opportunities.',
        contactPreferences: 'Email preferred, available Mon-Thu',
        status: RequestStatus.pending,
      },
    });
    console.log('📨 Created introduction request from user1 to TechStart');

    await prisma.introductionRequest.create({
      data: {
        requesterId: user2.id,
        smeProfileId: smeProfile2.id,
        message: 'Our investment fund is evaluating healthcare sector opportunities. Would appreciate an introduction to discuss your growth plans.',
        contactPreferences: 'Phone call or video meeting',
        status: RequestStatus.viewed,
      },
    });
    console.log('📨 Created introduction request from user2 to HealthPlus');
  }

  // Create Audit Logs
  await prisma.auditLog.createMany({
    data: [
      {
        userId: admin.id,
        actionType: 'USER_LOGIN',
        actionDescription: 'Admin logged in successfully',
        ipAddress: '192.168.1.1',
      },
      {
        userId: admin.id,
        actionType: 'CERTIFICATION_APPROVED',
        actionDescription: 'Approved certification for TechStart UAE',
        targetType: 'SMEProfile',
        targetId: smeProfile1?.id,
        ipAddress: '192.168.1.1',
      },
      {
        userId: sme1.id,
        actionType: 'PROFILE_UPDATED',
        actionDescription: 'Updated company profile information',
        targetType: 'SMEProfile',
        targetId: smeProfile1?.id,
        ipAddress: '192.168.1.10',
      },
    ],
  });
  console.log('📋 Created audit logs');

  console.log('\n✅ Seed completed successfully!\n');
  console.log('📧 Test Accounts:');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('Admin:     admin@smecert.ae       / Password123!');
  console.log('User 1:    user@example.com       / Password123!');
  console.log('User 2:    user2@example.com      / Password123!');
  console.log('SME (Cert):sme@techstartup.ae     / Password123!');
  console.log('SME (Cert):sme@healthplus.ae      / Password123!');
  console.log('SME (Rev): sme@retailhub.ae       / Password123!');
  console.log('SME (Draft):sme@newbusiness.ae    / Password123!');
  console.log('SME (Revn):sme@constructco.ae     / Password123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
