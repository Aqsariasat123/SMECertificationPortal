import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const legalPages = [
  {
    slug: 'terms',
    title: 'Terms of Service',
    content: `**Effective Date:** [Insert Date]
**Version:** 1.0

## 1. Introduction
These Terms of Service ("Terms") govern access to and use of Naywa (the "Platform"), an SME readiness, certification, and registry service. By accessing or using the Platform, you agree to be bound by these Terms. If you do not agree, you must not use the Platform.

## 2. Nature of the Platform
**Naywa provides:**
- SME readiness assessment
- Certification based on submitted documentation
- Inclusion in a read-only SME registry

**Naywa does not:**
- Facilitate fundraising or investment
- Act as a marketplace or broker
- Provide financial, legal, or investment advice
- Guarantee funding, partnerships, or commercial outcomes

Certification reflects a review at a point in time based on provided information only.

## 3. Eligibility & Accounts
You represent that:
- Information submitted is accurate and complete
- You are authorized to act on behalf of the SME
- You will keep credentials secure

Naywa may suspend or terminate access if information is misleading, incomplete, or violates these Terms.

## 4. Certification Process
- Certification decisions are based on documentation submitted and internal review
- Naywa reserves the right to approve, reject, revoke, or suspend certification
- Certification may have an expiry date and require renewal
- Any material change to SME information may invalidate certification and require re-review

## 5. Registry
- The registry is read-only for users and partners
- Inclusion does not imply endorsement, investment worthiness, or performance ranking
- Naywa controls visibility and may remove or suspend listings at its discretion

## 6. Certificates
- Certificates are issued digitally and may be downloaded as PDFs
- Certificates include identifiers, issue date, and expiry date
- Certificates are non-transferable and for verification purposes only
- Misuse or misrepresentation of a certificate may result in revocation

## 7. Data & Privacy
Use of the Platform is subject to the Privacy Policy. Naywa processes data solely for certification, registry, compliance, and operational purposes.

## 8. Limitation of Liability
To the fullest extent permitted by law:
- Naywa is not liable for business outcomes, losses, or missed opportunities
- Naywa does not warrant uninterrupted or error-free operation
- Use of the Platform is at your own risk

## 9. Modifications
Naywa may update these Terms periodically. Continued use constitutes acceptance of revised Terms.

## 10. Governing Law
These Terms are governed by the laws of the United Arab Emirates, unless otherwise stated.

## 11. Contact
For certification or platform inquiries only: support@naywa.ae`,
  },
  {
    slug: 'privacy',
    title: 'Privacy Policy',
    content: `**Platform:** Naywa
**Version:** 1.0
**Effective Date:** [Insert Date]

## 1. Introduction
This Privacy Policy explains how Naywa ("we", "us", "our") collects, uses, stores, and protects personal and business information when you access or use the Naywa platform (the "Platform").

By using the Platform, you acknowledge and agree to the practices described in this Privacy Policy.

## 2. Scope of This Policy
This Policy applies to:
- SME users submitting information for certification
- Authorized representatives of SMEs
- Partners or users accessing the SME registry
- Administrators operating the Platform

This Policy does not apply to third-party websites or services that may be linked from the Platform.

## 3. Information We Collect

### 3.1 Information You Provide
We may collect the following categories of information:

**SME & Business Information**
- Company name, trade license number, registration details
- Industry sector, location, and operational information
- Supporting documents submitted for certification

**User & Representative Information**
- Name, email address, and contact details
- Role or authorization to act on behalf of an SME
- Identity verification information (where required for compliance)

### 3.2 System & Usage Information
We may automatically collect limited technical information such as:
- Login timestamps
- IP addresses
- Device or browser metadata
- Actions performed on the Platform (for audit purposes)

This information is collected solely for security, compliance, and operational integrity.

## 4. Purpose of Data Collection
We collect and process information only for the following purposes:
- Operating the SME certification and review process
- Verifying identity and authorization
- Maintaining the SME registry
- Ensuring platform security and auditability
- Complying with legal, regulatory, or internal governance requirements

Naywa does not use personal data for:
- Advertising
- Profiling
- Marketing campaigns
- Behavioral or popularity analysis

## 5. Registry Visibility
Certain non-personal SME information may appear in the public or partner-accessible registry once certification is granted.

Inclusion in the registry:
- Does not imply endorsement
- Does not rank or compare SMEs
- Is subject to visibility controls and removal at Naywa's discretion

## 6. Data Sharing
Naywa does not sell, rent, or trade personal data.

Information may be shared only:
- With internal administrators for certification and compliance
- When required by applicable law or regulatory authority
- With trusted service providers strictly for platform operation (under confidentiality obligations)

## 7. Data Storage & Security
We apply reasonable administrative, technical, and organizational safeguards to protect data, including:
- Access controls
- Role-based permissions
- Audit logging of sensitive actions

Despite these measures, no system can be guaranteed to be fully secure.

## 8. Data Retention
Information is retained only for as long as necessary to:
- Operate the certification and registry process
- Meet legal or regulatory requirements
- Maintain audit and compliance records

Retention periods may vary depending on data type and obligations.

## 9. Your Responsibilities
Users are responsible for:
- Providing accurate and up-to-date information
- Maintaining the confidentiality of login credentials
- Not submitting data they are not authorized to share

Misuse or misrepresentation may result in access suspension.

## 10. Your Rights
Subject to applicable law, you may request:
- Access to your information
- Correction of inaccurate information

Requests may be limited where data must be retained for compliance or audit purposes.

## 11. Changes to This Policy
We may update this Privacy Policy from time to time. Updated versions will be posted on the Platform with a revised effective date.

Continued use of the Platform constitutes acceptance of the updated Policy.

## 12. Contact
For privacy or data-related inquiries only: support@naywa.ae`,
  },
  {
    slug: 'legal-notice',
    title: 'Legal Notice',
    content: `**Platform:** Naywa
**Version:** 1.0
**Effective Date:** [Insert Date]

## 1. Platform Status
Naywa is a digital platform providing SME readiness assessment, certification, and registry services.

**Naywa is not:**
- A government authority
- A financial institution
- An investment platform
- A marketplace or broker

Any reference to "certification" relates solely to Naywa's internal review process and does not represent a government license, approval, or endorsement.

## 2. No Financial or Investment Services
Naywa does not:
- Facilitate fundraising or capital raising
- Collect or transfer funds
- Match investors and businesses
- Provide financial, legal, or investment advice

Users must make independent decisions and conduct their own due diligence.

## 3. No Guarantee of Outcomes
Certification or inclusion in the registry:
- Does not guarantee funding, partnerships, or commercial success
- Does not imply performance ranking or endorsement
- Reflects a point-in-time review based on submitted information

Naywa makes no warranties regarding outcomes.

## 4. Accuracy of Information
While reasonable efforts are made to review submitted information, Naywa relies on the accuracy and completeness of data provided by users.

Naywa is not responsible for:
- False or misleading submissions
- Third-party reliance on registry information
- Decisions made based on registry listings

## 5. Limitation of Liability
To the fullest extent permitted by law, Naywa shall not be liable for:
- Business losses
- Indirect or consequential damages
- Decisions or actions taken by users or third parties

Use of the platform is at the user's own risk.

## 6. Intellectual Property
All platform content, trademarks, logos, and materials are the property of Naywa unless otherwise stated.

Unauthorized use is prohibited.

## 7. Governing Law
This Legal Notice is governed by the laws of the United Arab Emirates, unless otherwise required by applicable regulations.

## 8. Contact
For legal or compliance inquiries only: support@naywa.ae`,
  },
  {
    slug: 'contact',
    title: 'Contact',
    content: `## Contact Naywa

For certification, registry, or platform-related inquiries, please contact us using the details below.

**Email:** support@naywa.ae

## Scope of Support
- Certification process questions
- Registry access issues
- Account or technical support

## Please Note
Naywa does not provide:
- Investment advice
- Funding assistance
- Partnership matchmaking`,
  },
];

async function seedLegalPages() {
  console.log('Seeding legal pages...');

  for (const page of legalPages) {
    await prisma.legalPage.upsert({
      where: { slug: page.slug },
      update: {
        title: page.title,
        content: page.content,
        lastUpdated: new Date(),
      },
      create: {
        slug: page.slug,
        title: page.title,
        content: page.content,
        isPublished: true,
        lastUpdated: new Date(),
      },
    });
    console.log(`  Seeded: ${page.slug} (${page.title})`);
  }

  console.log('Legal pages seeded successfully!');
}

seedLegalPages()
  .catch((error) => {
    console.error('Error seeding legal pages:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
