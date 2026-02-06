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
          <nav className="flex items-center gap-3">
            <Link
              href="/certification-standards"
              className="px-3 py-2 text-sm font-medium transition-colors hidden sm:block"
              style={{ color: 'var(--graphite-600)' }}
            >
              Certification Standards
            </Link>
            <Link
              href="/registry/verify"
              className="px-3 py-2 text-sm font-medium transition-colors hidden sm:block"
              style={{ color: 'var(--graphite-600)' }}
            >
              Verify a Certificate
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
              style={{ border: '1px solid var(--teal-300)', color: 'var(--teal-700)' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
            >
              Start Certification
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Registry Status Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium mb-6"
              style={{ background: 'var(--teal-50)', color: 'var(--teal-700)', border: '1px solid var(--teal-200)' }}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ background: 'var(--teal-500)' }}
              />
              Registry Status: 500+ Certified Entities
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

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
