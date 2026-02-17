'use client';

import Link from 'next/link';

export default function LimitationOfLiabilityPage() {
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
            Limitation of Liability & Certification Scope
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

            {/* Scope Cards */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="p-6 rounded-lg" style={{ background: '#F5FAFA', border: '1px solid #E8F4F4' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#E8F4F4' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 3v18M3 12h18"/>
                    <path d="M3 6h18M3 18h18"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#111C1C' }}>Certification Scope</h3>
                <p className="text-sm" style={{ color: '#5A7070' }}>
                  Defines what NAIWA certification covers and represents within the UAE SME ecosystem.
                </p>
              </div>
              <div className="p-6 rounded-lg" style={{ background: '#F5FAFA', border: '1px solid #E8F4F4' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-4" style={{ background: '#E8F4F4' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <h3 className="font-semibold mb-2" style={{ color: '#111C1C' }}>Liability Limitations</h3>
                <p className="text-sm" style={{ color: '#5A7070' }}>
                  Outlines the boundaries of NAIWA&apos;s responsibility and liability in certification matters.
                </p>
              </div>
            </div>

            {/* Certification Scope Definition */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                1. Certification Scope Definition
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA certification is a documentation-based assessment that evaluates an enterprise&apos;s operational readiness across five standardized pillars. The certification represents a point-in-time evaluation based on submitted evidence.
                </p>

                <div className="p-6 rounded-lg my-6" style={{ background: '#E8F4F4', border: '1px solid #D0E4E4' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#2D6A6A' }}>Within Scope of Certification</h4>
                  <ul className="text-sm space-y-2" style={{ color: '#3D8B8B' }}>
                    <li>• Verification of submitted documentation against assessment criteria</li>
                    <li>• Evaluation across five standardized pillars</li>
                    <li>• Point-in-time compliance status determination</li>
                    <li>• Issuance of verifiable certification records</li>
                    <li>• Inclusion in the public verification registry</li>
                  </ul>
                </div>

                <div className="p-6 rounded-lg my-6" style={{ background: '#F5F5F5', border: '1px solid #E5E5E5' }}>
                  <h4 className="font-semibold mb-3" style={{ color: '#111C1C' }}>Outside Scope of Certification</h4>
                  <ul className="text-sm space-y-2" style={{ color: '#5A7070' }}>
                    <li>• Ongoing monitoring or continuous compliance assessment</li>
                    <li>• Financial, legal, or investment advice</li>
                    <li>• Guarantee of business performance or outcomes</li>
                    <li>• Government or regulatory endorsement</li>
                    <li>• Facilitation of funding, investment, or partnerships</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Assessment Methodology Limitations */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                2. Assessment Methodology Limitations
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  The NAIWA assessment methodology is subject to the following inherent limitations:
                </p>
                <ul className="list-disc pl-6 space-y-3">
                  <li>
                    <strong style={{ color: '#111C1C' }}>Documentation Reliance:</strong> Assessment is based solely on submitted documentation. NAIWA does not independently verify the authenticity or accuracy of source documents.
                  </li>
                  <li>
                    <strong style={{ color: '#111C1C' }}>Point-in-Time Assessment:</strong> Certification reflects status at the time of evaluation and does not account for subsequent changes to the enterprise&apos;s circumstances.
                  </li>
                  <li>
                    <strong style={{ color: '#111C1C' }}>Framework Boundaries:</strong> Assessment is limited to the five-pillar framework and does not evaluate aspects outside these defined criteria.
                  </li>
                  <li>
                    <strong style={{ color: '#111C1C' }}>No Predictive Capability:</strong> Certification does not predict future performance, compliance, or business outcomes.
                  </li>
                </ul>
              </div>
            </div>

            {/* Limitation of Liability */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                3. Limitation of Liability
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>

                <div className="flex gap-4 p-6 rounded-lg my-4" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
                  <svg className="w-6 h-6 flex-shrink-0 mt-0.5" viewBox="0 0 24 24" fill="none" stroke="#D97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <div className="text-sm" style={{ color: '#92400E' }}>
                    <p className="font-semibold mb-1">Important Legal Notice</p>
                    <p>NAIWA certification is provided &quot;as is&quot; without warranties of any kind. Users rely on certification information at their own risk.</p>
                  </div>
                </div>

                <h3 className="font-semibold mt-6 mb-3" style={{ color: '#111C1C' }}>Exclusion of Damages</h3>
                <p>NAIWA shall not be liable for any direct, indirect, incidental, special, consequential, or punitive damages arising from:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>Use or reliance on certification status or information</li>
                  <li>Decisions made based on certification outcomes</li>
                  <li>Business losses, lost profits, or lost opportunities</li>
                  <li>Third-party claims arising from certification status</li>
                  <li>Errors, omissions, or inaccuracies in assessment</li>
                </ul>

                <h3 className="font-semibold mt-6 mb-3" style={{ color: '#111C1C' }}>Cap on Liability</h3>
                <p>In jurisdictions that do not allow complete exclusion of liability, NAIWA&apos;s total liability shall not exceed:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li>The certification fee paid by the enterprise, or</li>
                  <li>AED 10,000, whichever is lower</li>
                </ul>

                <h3 className="font-semibold mt-6 mb-3" style={{ color: '#111C1C' }}>Third-Party Claims</h3>
                <p>NAIWA bears no liability for claims, actions, or demands brought by third parties who rely on certification status for their own decisions, including but not limited to financial institutions, investors, or commercial partners.</p>
              </div>
            </div>

            {/* Exclusions */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                4. Exclusions
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>The limitations of liability set forth herein do not apply to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Liability arising from gross negligence or willful misconduct by NAIWA</li>
                  <li>Liability that cannot be excluded under applicable law</li>
                  <li>Fraud or fraudulent misrepresentation by NAIWA</li>
                </ul>
              </div>
            </div>

            {/* Indemnification */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                5. Indemnification
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>Certified enterprises agree to indemnify, defend, and hold harmless NAIWA from any claims, losses, or damages arising from:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Misrepresentation of certification status</li>
                  <li>Use of certification beyond its stated scope</li>
                  <li>Submission of fraudulent or misleading documentation</li>
                  <li>Violation of these terms or applicable law</li>
                </ul>
              </div>
            </div>

            {/* Force Majeure */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                6. Force Majeure
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA shall not be liable for any failure or delay in performing its obligations where such failure or delay results from circumstances beyond its reasonable control, including but not limited to natural disasters, government actions, system failures, or other force majeure events.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                7. Governing Law
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  This document and any disputes arising from or relating to NAIWA certification shall be governed by and construed in accordance with the laws of the United Arab Emirates. The courts of Dubai shall have exclusive jurisdiction over any disputes.
                </p>
              </div>
            </div>

            {/* Severability */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                8. Severability
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  If any provision of this document is found to be unenforceable or invalid, that provision shall be limited or eliminated to the minimum extent necessary, and the remaining provisions shall continue in full force and effect.
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
                <Link href="/certification-standards" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Certification Disclaimer</span>
                </Link>
                <Link href="/privacy" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Privacy Policy</span>
                </Link>
                <Link href="/methodology" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Methodology</span>
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
                For questions regarding this document or NAIWA&apos;s liability policies, please contact us at{' '}
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
