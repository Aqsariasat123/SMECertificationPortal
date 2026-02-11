import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-50"
        style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--graphite-200)' }}
      >
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex justify-between items-center">
          {/* Left - Logo + Registry Navigation (Authority Block) */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--teal-600)' }}
              >
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div className="hidden sm:block">
                <span className="text-base font-semibold block" style={{ color: 'var(--graphite-900)' }}>
                  Naywa
                </span>
                <span className="text-xs" style={{ color: 'var(--graphite-500)' }}>
                  SME Certification Platform
                </span>
              </div>
            </Link>

            {/* Registry Navigation (Desktop) */}
            <nav className="hidden md:flex items-center gap-1">
              <Link
                href="/certification-standards"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50"
                style={{ color: 'var(--graphite-600)' }}
              >
                Certification Standards
              </Link>
              <Link
                href="/registry/verify"
                className="px-3 py-1.5 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50"
                style={{ color: 'var(--graphite-600)' }}
              >
                Verify a Certificate
              </Link>
            </nav>
          </div>

          {/* Right - User Actions */}
          <div className="flex items-center gap-2">
            <Link
              href="/login"
              className="px-4 py-2 text-xs font-medium rounded-lg transition-colors"
              style={{ border: '1px solid var(--graphite-300)', color: 'var(--graphite-700)', background: 'white' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-4 py-2 text-xs font-medium rounded-lg"
              style={{ border: '1px solid var(--teal-600)', background: 'var(--teal-600)', color: 'white' }}
            >
              Start Certification
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Bar - Using CSS media query */}
        <style>{`
          @media (min-width: 768px) {
            .mobile-nav-bar { display: none !important; }
          }
        `}</style>
        <div className="mobile-nav-bar flex justify-center gap-6 py-3 px-4 border-t" style={{ borderColor: 'var(--graphite-200)', background: 'var(--background)' }}>
          <Link
            href="/certification-standards"
            className="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg"
            style={{ color: 'var(--graphite-600)' }}
          >
            Certification Standards
          </Link>
          <Link
            href="/registry/verify"
            className="px-3 py-1.5 text-xs font-medium transition-colors rounded-lg"
            style={{ color: 'var(--graphite-600)' }}
          >
            Verify a Certificate
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-36 md:pt-28 pb-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Layer 1 - Brand Label */}
            <p
              className="text-sm font-medium uppercase tracking-widest mb-4"
              style={{ color: 'var(--graphite-400)' }}
            >
              Naywa
            </p>

            {/* Layer 2 - Main Headline */}
            <h1
              className="text-4xl sm:text-5xl font-bold tracking-tight mb-6"
              style={{ color: 'var(--graphite-900)', lineHeight: 1.1, letterSpacing: '-0.02em' }}
            >
              Certified. Structured. Capital-ready.
            </h1>

            {/* Layer 3 - Subheadline */}
            <div className="mb-4">
              <p
                className="text-xl sm:text-2xl font-medium"
                style={{ color: 'var(--graphite-700)', lineHeight: 1.4 }}
              >
                Banks don&apos;t fund potential. They fund proof.
              </p>
              <p
                className="text-xl sm:text-2xl font-medium"
                style={{ color: 'var(--teal-600)', lineHeight: 1.4 }}
              >
                Naywa closes the gap.
              </p>
            </div>

            {/* Layer 4 - Qualifier Line */}
            <p
              className="text-sm mb-8"
              style={{ color: 'var(--graphite-500)' }}
            >
              For businesses preparing for bank, investor, or institutional review.
            </p>

            {/* Layer 5 - CTA Button */}
            <Link
              href="/register"
              className="btn-primary px-8 py-3.5 text-sm font-medium rounded-lg inline-flex items-center justify-center gap-2"
            >
              Start Certification
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Framework Descriptor Line */}
      <section style={{ background: 'white', borderTop: '1px solid var(--graphite-100)', borderBottom: '1px solid var(--graphite-100)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p
            className="text-center text-sm"
            style={{ color: '#888888' }}
          >
            Five-Pillar Framework · Independent Assessment · Point-in-Time Verification
          </p>
        </div>
      </section>

      {/* Governance Grid - Certification Principles & Scope */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* Left Column - Certification Principles */}
            <div>
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--graphite-500)' }}>
                Certification Principles
              </h2>
              <div className="space-y-4">
                {/* Card 1 - Independent Review */}
                <div
                  className="p-5 rounded-lg"
                  style={{ background: 'white', border: '1px solid var(--graphite-200)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--teal-50)' }}
                    >
                      <svg className="w-4 h-4" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--graphite-800)' }}>
                        Independent Review
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                        A documentation-based review of submitted business information conducted independently by Naywa.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Card 2 - Point-in-Time Verification */}
                <div
                  className="p-5 rounded-lg"
                  style={{ background: 'white', border: '1px solid var(--graphite-200)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded flex items-center justify-center flex-shrink-0 mt-0.5"
                      style={{ background: 'var(--teal-50)' }}
                    >
                      <svg className="w-4 h-4" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold mb-1" style={{ color: 'var(--graphite-800)' }}>
                        Point-in-Time Verification
                      </h3>
                      <p className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                        Certification reflects status at the time of issuance and is recorded and verifiable via Naywa&apos;s official registry.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Scope & Limitations */}
            <div>
              <h2 className="text-sm font-semibold mb-4 uppercase tracking-wide" style={{ color: 'var(--graphite-500)' }}>
                Scope & Limitations
              </h2>
              <div
                className="p-5 rounded-lg h-full"
                style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)' }}
              >
                <ul className="space-y-4">
                  <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--graphite-600)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                    <span>Certification does not constitute regulatory approval, licensing, or endorsement</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--graphite-600)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                    <span>Certification does not guarantee future performance, outcomes, or compliance</span>
                  </li>
                  <li className="flex items-start gap-3 text-sm" style={{ color: 'var(--graphite-600)' }}>
                    <span className="w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                    <span>Verification confirms registry status only, based on available records</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Certification Process - 3 Steps */}
      <section className="py-20" style={{ background: 'var(--sidebar-bg)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-white mb-3">
              Certification Process
            </h2>
            <p className="text-base" style={{ color: '#a0aec0' }}>
              The certification process follows a structured review of submitted documentation.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div className="p-6 rounded-xl" style={{ background: 'transparent', border: '1px solid var(--graphite-600)' }}>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg mb-4"
                style={{ background: 'var(--teal-600)' }}
              >
                1
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Application Submission
              </h3>
              <p className="text-sm" style={{ color: '#a0aec0' }}>
                Businesses submit required documentation in accordance with Naywa&apos;s certification standards.
              </p>
            </div>

            {/* Step 2 */}
            <div className="p-6 rounded-xl" style={{ background: 'transparent', border: '1px solid var(--graphite-600)' }}>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg mb-4"
                style={{ background: 'var(--teal-600)' }}
              >
                2
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Independent Review
              </h3>
              <p className="text-sm" style={{ color: '#a0aec0' }}>
                Submitted materials are reviewed against internal assessment criteria at a defined point in time.
              </p>
            </div>

            {/* Step 3 */}
            <div className="p-6 rounded-xl" style={{ background: 'transparent', border: '1px solid var(--graphite-600)' }}>
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-semibold text-lg mb-4"
                style={{ background: 'var(--teal-600)' }}
              >
                3
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                Certification Decision
              </h3>
              <p className="text-sm" style={{ color: '#a0aec0' }}>
                Certification status is issued, deferred, or declined and recorded in Naywa&apos;s official registry.
              </p>
            </div>
          </div>

          {/* CTA Block */}
          <div className="text-center mt-16">
            <h3 className="text-2xl font-semibold text-white mb-3">
              Ready to Get Certified?
            </h3>
            <p className="text-base mb-6" style={{ color: '#a0aec0' }}>
              Submit your documentation for an independent review. Certified entities receive a verifiable record of their capital-readiness status.
            </p>
            <Link
              href="/register"
              className="btn-primary px-8 py-3.5 text-sm font-medium rounded-lg inline-flex items-center justify-center gap-2"
            >
              Start Certification
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
