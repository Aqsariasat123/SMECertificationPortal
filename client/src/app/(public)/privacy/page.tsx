'use client';

import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#F5FAFA' }}>
      {/* Header */}
      <section className="pt-12 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: '#D0E4E4' }} />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#5A7070' }}>Legal Document</span>
          </div>
          <h1
            className="text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
          >
            Privacy Policy
          </h1>
          <p className="text-sm" style={{ color: '#5A7070' }}>
            Last updated: February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 space-y-10" style={{ border: '1px solid #D0E4E4' }}>

            {/* Introduction */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                1. Introduction
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA (&quot;we,&quot; &quot;us,&quot; or &quot;our&quot;) is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our SME Certification Platform.
                </p>
                <p>
                  By using our services, you consent to the collection and use of information in accordance with this policy.
                </p>
              </div>
            </div>

            {/* Information We Collect */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                2. Information We Collect
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <h3 className="font-semibold mt-4" style={{ color: '#111C1C' }}>Personal Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Name and contact information (email, phone number, address)</li>
                  <li>Business information (company name, trade license details)</li>
                  <li>Identity documents (Emirates ID, passport copies)</li>
                  <li>Financial documents submitted for certification</li>
                  <li>Account credentials and authentication data</li>
                </ul>

                <h3 className="font-semibold mt-6" style={{ color: '#111C1C' }}>Automatically Collected Information</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Device information and browser type</li>
                  <li>IP address and location data</li>
                  <li>Usage patterns and interaction with our platform</li>
                  <li>Cookies and similar tracking technologies</li>
                </ul>
              </div>
            </div>

            {/* How We Use Your Information */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                3. How We Use Your Information
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>We use the information we collect to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Process certification applications and assessments</li>
                  <li>Verify submitted documentation and evidence</li>
                  <li>Maintain the public certification registry</li>
                  <li>Communicate with you about your application status</li>
                  <li>Improve our services and user experience</li>
                  <li>Comply with legal and regulatory requirements</li>
                  <li>Prevent fraud and ensure platform security</li>
                </ul>
              </div>
            </div>

            {/* Data Sharing */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                4. Data Sharing and Disclosure
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong style={{ color: '#111C1C' }}>Public Registry:</strong> Certification status and basic enterprise information is published in our verification registry</li>
                  <li><strong style={{ color: '#111C1C' }}>Service Providers:</strong> Third-party vendors who assist in operating our platform</li>
                  <li><strong style={{ color: '#111C1C' }}>Legal Requirements:</strong> When required by law or to protect our rights</li>
                  <li><strong style={{ color: '#111C1C' }}>Business Transfers:</strong> In connection with any merger, acquisition, or sale of assets</li>
                </ul>
                <p className="mt-4">
                  We do not sell your personal information to third parties for marketing purposes.
                </p>
              </div>
            </div>

            {/* Data Security */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                5. Data Security
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  We implement appropriate technical and organizational security measures to protect your information, including:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Encryption of data in transit and at rest</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Regular security assessments and audits</li>
                  <li>Employee training on data protection</li>
                </ul>
                <p className="mt-4">
                  While we strive to protect your information, no method of transmission over the Internet is 100% secure.
                </p>
              </div>
            </div>

            {/* Data Retention */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                6. Data Retention
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  We retain your information for as long as necessary to fulfill the purposes outlined in this policy, unless a longer retention period is required by law. Certification records are maintained indefinitely for verification purposes.
                </p>
              </div>
            </div>

            {/* Your Rights */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                7. Your Rights
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>Subject to applicable law, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Request correction of inaccurate information</li>
                  <li>Request deletion of your information (subject to legal requirements)</li>
                  <li>Object to certain processing activities</li>
                  <li>Withdraw consent where processing is based on consent</li>
                </ul>
                <p className="mt-4">
                  To exercise these rights, please contact us at <a href="mailto:privacy@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>privacy@naiwa.ae</a>.
                </p>
              </div>
            </div>

            {/* Cookies */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                8. Cookies and Tracking
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  We use cookies and similar technologies to enhance your experience, analyze usage patterns, and improve our services. You can control cookie preferences through your browser settings.
                </p>
              </div>
            </div>

            {/* Changes to Policy */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                9. Changes to This Policy
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on this page with an updated &quot;Last Updated&quot; date.
                </p>
              </div>
            </div>

            {/* Related Documents */}
            <div className="pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Related Documents
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/terms" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Terms of Use</span>
                </Link>
                <Link href="/certification-scope" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Limitation of Liability</span>
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Contact Us
              </h2>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                For questions about this Privacy Policy or your personal data, please contact us at{' '}
                <a href="mailto:privacy@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>
                  privacy@naiwa.ae
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
