'use client';

import Link from 'next/link';

export default function CertificationStandardsPage() {
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
            Certification Disclaimer
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

            {/* Important Notice */}
            <div className="flex gap-4 p-6 rounded-lg" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
              <svg className="w-6 h-6 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div className="text-sm" style={{ color: '#92400E' }}>
                <p className="font-semibold mb-1">Important Notice</p>
                <p>Please read this disclaimer carefully before relying on any NAIWA certification status or information.</p>
              </div>
            </div>

            {/* Nature of Certification */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                1. Nature of Certification
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA certification is a documentation-based assessment that evaluates enterprises against standardized criteria at a specific point in time. Certification indicates that an enterprise has successfully demonstrated compliance with our assessment framework requirements based on submitted evidence.
                </p>
                <p>
                  Certification does not constitute:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>A guarantee of future performance or conduct</li>
                  <li>An endorsement or recommendation for investment</li>
                  <li>Government or regulatory approval</li>
                  <li>Verification of facts beyond submitted documentation</li>
                </ul>
              </div>
            </div>

            {/* Assessment Limitations */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                2. Assessment Limitations
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Our assessment is based solely on documentation and evidence submitted by the applicant. NAIWA does not:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Independently verify the authenticity of source documents</li>
                  <li>Conduct on-site inspections or audits</li>
                  <li>Perform ongoing monitoring of certified enterprises</li>
                  <li>Guarantee the accuracy of information provided by applicants</li>
                </ul>
              </div>
            </div>

            {/* No Warranty */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                3. No Warranty
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA certification is provided &quot;as is&quot; without any warranties, express or implied. We make no representations or warranties regarding the merchantability, fitness for a particular purpose, or non-infringement of any certification status or information.
                </p>
              </div>
            </div>

            {/* Third-Party Reliance */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                4. Third-Party Reliance
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Third parties who rely on NAIWA certification status for any purpose do so at their own risk. We strongly recommend that any decisions regarding business relationships, investments, or partnerships be based on independent due diligence and not solely on certification status.
                </p>
                <p>
                  NAIWA accepts no liability for decisions made by third parties based on certification information.
                </p>
              </div>
            </div>

            {/* Certification Period */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                5. Certification Period
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Certification is valid for the period specified in the certification record. The enterprise&apos;s circumstances may change during this period, and certification status reflects only the assessment at the time of evaluation.
                </p>
                <p>
                  Always verify current certification status through our official verification portal before relying on certification information.
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
                <Link href="/certification-scope" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Limitation of Liability</span>
                </Link>
                <Link href="/terms" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Terms of Use</span>
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
                For questions regarding this disclaimer, please contact us at{' '}
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
