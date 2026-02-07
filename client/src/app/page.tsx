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
          {/* Left - Logo */}
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--teal-600)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>
              Naywa
            </span>
          </Link>

          {/* Center - Public Trust Navigation */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/certification-standards"
              className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--graphite-600)' }}
            >
              Certification Standards
            </Link>
            <Link
              href="/registry/verify"
              className="px-4 py-2 text-sm font-medium transition-colors rounded-lg hover:bg-gray-50"
              style={{ color: 'var(--graphite-600)' }}
            >
              Verify a Certificate
            </Link>
          </nav>

          {/* Right - User Actions */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ border: '1px solid var(--graphite-300)', color: 'var(--graphite-700)', background: 'transparent' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
            >
              Start Certification
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Registry Status Badge */}
            <div className="mb-6">
              <div
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium"
                style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', border: '1px solid var(--teal-200)' }}
              >
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ background: 'var(--teal-500)' }}
                />
                Registry Status: 500+ Certified Entities
              </div>
              <p className="text-xs mt-1.5" style={{ color: 'var(--graphite-400)' }}>
                As reflected in current registry records
              </p>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-4"
              style={{ color: 'var(--graphite-900)', lineHeight: 1.15 }}
            >
              Naywa
              <span className="block text-2xl sm:text-3xl mt-2 font-medium" style={{ color: 'var(--teal-600)' }}>
                SME Readiness & Certification Platform
              </span>
            </h1>

            <p
              className="text-base mb-8"
              style={{ color: 'var(--foreground-muted)' }}
            >
              An independent, documentation-based certification framework for SMEs.
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

      {/* Metrics Section */}
      <section style={{ background: 'white', borderTop: '1px solid var(--graphite-100)', borderBottom: '1px solid var(--graphite-100)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>500+</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Certified SMEs</p>
            </div>
            <div className="text-center sm:border-x" style={{ borderColor: 'var(--graphite-200)' }}>
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>98%</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Application Completion</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>~24h</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Typical Review</p>
            </div>
          </div>
        </div>
      </section>

      {/* What Naywa Certification Represents */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-xl font-semibold mb-8" style={{ color: 'var(--graphite-900)' }}>
            What Naywa Certification Represents
          </h2>
          <div className="space-y-3">
            <p className="text-base" style={{ color: 'var(--graphite-600)' }}>
              Independent review of submitted business documentation
            </p>
            <p className="text-base" style={{ color: 'var(--graphite-600)' }}>
              Certification reflects assessment at a defined point in time
            </p>
            <p className="text-base" style={{ color: 'var(--graphite-600)' }}>
              Certification status is verifiable via Naywa&apos;s official registry
            </p>
          </div>
        </div>
      </section>

      {/* Scope & Limitations */}
      <section className="pb-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="p-6 rounded-xl"
            style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)' }}
          >
            <h3 className="text-sm font-semibold mb-4" style={{ color: 'var(--graphite-700)' }}>
              Scope & Limitations of Certification
            </h3>
            <ul className="space-y-2">
              <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                Certification reflects documentation review at a defined point in time
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                Certification does not constitute regulatory approval or endorsement
              </li>
              <li className="flex items-start gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                <span className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ background: 'var(--graphite-400)' }} />
                Certification status is verifiable via Naywa&apos;s official registry
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Certification Process - 3 Steps */}
      <section className="py-20" style={{ background: '#23282d' }}>
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
            <div className="p-6 rounded-xl" style={{ background: '#2d3238' }}>
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
            <div className="p-6 rounded-xl" style={{ background: '#2d3238' }}>
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
            <div className="p-6 rounded-xl" style={{ background: '#2d3238' }}>
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
              Verified entities are recorded in the official SME registry to establish institutional credibility.
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
