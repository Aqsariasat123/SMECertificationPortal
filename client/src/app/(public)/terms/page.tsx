'use client';

import Link from 'next/link';

export default function TermsPage() {
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
            Terms of Use
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
                  Welcome to NAIWA. These Terms of Use govern your access to and use of the NAIWA platform, including our website, certification services, and verification systems.
                </p>
                <p>
                  By accessing or using our services, you agree to be bound by these Terms. If you do not agree with any part of these Terms, you may not access or use our services.
                </p>
              </div>
            </div>

            {/* Definitions */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                2. Definitions
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <ul className="list-disc pl-6 space-y-3">
                  <li><strong style={{ color: '#111C1C' }}>&quot;NAIWA&quot;</strong> refers to the SME Certification Platform and its operators.</li>
                  <li><strong style={{ color: '#111C1C' }}>&quot;Services&quot;</strong> refers to all certification, verification, and related services provided through the platform.</li>
                  <li><strong style={{ color: '#111C1C' }}>&quot;User&quot;</strong> refers to any individual or entity accessing or using our services.</li>
                  <li><strong style={{ color: '#111C1C' }}>&quot;Enterprise&quot;</strong> refers to businesses applying for or holding NAIWA certification.</li>
                </ul>
              </div>
            </div>

            {/* Use of Services */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                3. Use of Services
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>You agree to use our services only for lawful purposes and in accordance with these Terms. You must not:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Provide false or misleading information in certification applications</li>
                  <li>Attempt to manipulate or circumvent the certification process</li>
                  <li>Use the services to harm or defraud others</li>
                  <li>Interfere with or disrupt the platform&apos;s operation</li>
                  <li>Misrepresent your certification status to third parties</li>
                </ul>
              </div>
            </div>

            {/* Account Responsibilities */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                4. Account Responsibilities
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must immediately notify NAIWA of any unauthorized use of your account.
                </p>
                <p>
                  You agree to provide accurate, current, and complete information during registration and to update such information to keep it accurate, current, and complete.
                </p>
              </div>
            </div>

            {/* Certification Process */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                5. Certification Process
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA certification is granted based on the assessment of submitted documentation against our published criteria. Certification decisions are final, subject to our appeals process.
                </p>
                <p>
                  Certification status may be revoked if it is determined that false or misleading information was provided, or if the enterprise no longer meets certification requirements.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                6. Intellectual Property
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  All content, trademarks, and intellectual property on the NAIWA platform are owned by or licensed to NAIWA. You may not use our trademarks or branding without prior written consent.
                </p>
                <p>
                  Certified enterprises are granted a limited license to display the NAIWA certification mark in accordance with our brand guidelines and only for the duration of valid certification.
                </p>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                7. Limitation of Liability
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  To the maximum extent permitted by law, NAIWA shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our services.
                </p>
                <p>
                  For detailed information on liability limitations, please refer to our <Link href="/certification-scope" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>Limitation of Liability</Link> document.
                </p>
              </div>
            </div>

            {/* Changes to Terms */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                8. Changes to Terms
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  We may update these Terms from time to time. We will notify users of material changes by posting the updated Terms on our website with a new &quot;Last Updated&quot; date.
                </p>
                <p>
                  Your continued use of our services after changes are posted constitutes your acceptance of the updated Terms.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                9. Governing Law
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  These Terms shall be governed by and construed in accordance with the laws of the United Arab Emirates. Any disputes arising from these Terms shall be subject to the exclusive jurisdiction of the courts of Dubai.
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
                <Link href="/privacy" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Privacy Policy</span>
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
                Questions?
              </h2>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                For questions regarding these Terms of Use, please contact us at{' '}
                <a href="mailto:legal@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>
                  legal@naiwa.ae
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
