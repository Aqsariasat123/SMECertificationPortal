import Link from 'next/link';

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
              SME Readiness Portal
            </span>
          </Link>
          <nav className="flex items-center gap-3">
            <Link
              href="/login"
              className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="btn-primary px-4 py-2 text-sm font-medium rounded-lg"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-20" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto text-center">
            {/* Badge - Gold/Sand for trust indicator */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6"
              style={{ background: 'var(--sand-50)', border: '1px solid var(--sand-200)' }}
            >
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--sand-500)' }} />
              <span className="text-xs font-medium" style={{ color: 'var(--sand-600)' }}>
                Trusted by 500+ SMEs across UAE
              </span>
            </div>

            <h1
              className="text-4xl sm:text-5xl font-semibold tracking-tight mb-5"
              style={{ color: 'var(--graphite-900)', lineHeight: 1.15 }}
            >
              SME Readiness &
              <span className="block" style={{ color: 'var(--teal-600)' }}>
                Certification Platform
              </span>
            </h1>

            <p
              className="text-lg mb-8 leading-relaxed"
              style={{ color: 'var(--foreground-muted)' }}
            >
              Get your business certified and listed in the official UAE SME registry.
              Build credibility, attract partners, and access new opportunities.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href="/register"
                className="btn-primary px-6 py-3 text-sm font-medium rounded-lg flex items-center justify-center gap-2"
              >
                Start Certification
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
              <Link
                href="/login"
                className="btn-primary px-6 py-3 text-sm font-medium rounded-lg"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={{ background: 'white', borderTop: '1px solid var(--graphite-100)', borderBottom: '1px solid var(--graphite-100)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="grid grid-cols-3 gap-8">
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>500+</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Certified SMEs</p>
            </div>
            <div className="text-center" style={{ borderLeft: '1px solid var(--graphite-200)', borderRight: '1px solid var(--graphite-200)' }}>
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>98%</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Success Rate</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>24h</p>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Avg. Review Time</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16" style={{ background: 'var(--background)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-2xl font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>
              Why Choose Our Platform?
            </h2>
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              A streamlined certification process built for UAE businesses
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Feature 1 - Gold/Sand for certification trust */}
            <div className="glass-card rounded-lg p-6 card-hover">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--sand-100)', color: 'var(--sand-600)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>
                Verified & Trusted
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Rigorous verification ensures only legitimate businesses receive certification.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="glass-card rounded-lg p-6 card-hover">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--success-50)', color: 'var(--success-600)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>
                Grow Your Business
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Access opportunities and connect with partners through our certified registry.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="glass-card rounded-lg p-6 card-hover">
              <div
                className="w-10 h-10 rounded-lg flex items-center justify-center mb-4"
                style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-base font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>
                Fast & Transparent
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--foreground-muted)' }}>
                Clear criteria, quick turnaround, and real-time status updates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20" style={{ background: '#2a2f36' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-12 text-center">
            <h2 className="text-3xl font-bold mb-3" style={{ color: '#ffffff' }}>
              How It Works
            </h2>
            <p className="text-lg" style={{ color: 'rgba(255,255,255,0.7)' }}>
              Get certified in three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Step 1 */}
            <div
              className="rounded-xl p-8"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 text-lg font-bold"
                style={{ background: 'var(--teal-600)', color: '#ffffff' }}
              >
                1
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#ffffff' }}>Create Account</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Register your company and complete your business profile.
              </p>
            </div>

            {/* Step 2 */}
            <div
              className="rounded-xl p-8"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 text-lg font-bold"
                style={{ background: 'var(--teal-600)', color: '#ffffff' }}
              >
                2
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#ffffff' }}>Submit Documents</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Upload your trade license, financial statements, and required documents.
              </p>
            </div>

            {/* Step 3 */}
            <div
              className="rounded-xl p-8"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)',
                backdropFilter: 'blur(6px)',
                WebkitBackdropFilter: 'blur(6px)'
              }}
            >
              <div
                className="w-12 h-12 rounded-lg flex items-center justify-center mb-5 text-lg font-bold"
                style={{ background: 'var(--teal-600)', color: '#ffffff' }}
              >
                3
              </div>
              <h3 className="text-xl font-semibold mb-3" style={{ color: '#ffffff' }}>Get Certified</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>
                Our team reviews and issues your certification within 24-48 hours.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section - Comprehensive */}
      <section className="py-20 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, var(--teal-600) 0%, #1a5c5c 50%, #0d3d3d 100%)' }}>
        {/* Decorative Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute -bottom-32 -left-32 w-80 h-80 rounded-full opacity-10" style={{ background: 'white' }} />
          <div className="absolute top-1/2 left-1/4 w-64 h-64 rounded-full opacity-5" style={{ background: 'white' }} />
        </div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-6" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-sm font-medium text-white">No Hidden Fees • Fast Processing</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-white leading-tight">
                Ready to Elevate Your Business Credibility?
              </h2>
              <p className="text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.85)' }}>
                Join the growing network of certified SMEs in the UAE. Get verified, get listed, and unlock new business opportunities with trusted partners and investors.
              </p>

              {/* Benefits List */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">Official Registry Listing</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">Investor Connections</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">Digital Certificate</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm text-white">Dedicated Support</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-105"
                  style={{ background: 'white', color: 'var(--teal-700)' }}
                >
                  Start Your Application
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 text-sm font-semibold rounded-xl transition-all hover:scale-105"
                  style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                  Sign In
                </Link>
              </div>
            </div>

            {/* Right Content - Stats Card */}
            <div className="hidden lg:block">
              <div className="rounded-2xl p-8" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                {/* Trust Indicators */}
                <div className="flex items-center gap-3 mb-8 pb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.15)' }}>
                  <div className="flex -space-x-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--sand-400)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>T</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: 'var(--success-500)', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>A</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#6366f1', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>M</div>
                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold" style={{ background: '#ec4899', color: 'white', border: '2px solid rgba(255,255,255,0.3)' }}>S</div>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-white">500+ SMEs Certified</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Join our growing community</p>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white">24h</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Average Review</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white">98%</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Success Rate</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white">50+</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Active Investors</p>
                  </div>
                  <div className="text-center p-4 rounded-xl" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className="w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <p className="text-2xl font-bold text-white">24/7</p>
                    <p className="text-xs" style={{ color: 'rgba(255,255,255,0.7)' }}>Support Available</p>
                  </div>
                </div>

                {/* Testimonial */}
                <div className="mt-6 pt-6" style={{ borderTop: '1px solid rgba(255,255,255,0.15)' }}>
                  <p className="text-sm italic mb-3" style={{ color: 'rgba(255,255,255,0.9)' }}>
                    "The certification process was seamless. Within 48 hours, we were listed and started receiving partnership inquiries."
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold" style={{ background: 'var(--sand-400)', color: 'white' }}>AK</div>
                    <div>
                      <p className="text-sm font-semibold text-white">Ahmed Khan</p>
                      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.6)' }}>CEO, TechVentures UAE</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8" style={{ background: 'var(--sidebar-bg)' }}>
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: 'var(--teal-600)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <span className="text-sm font-medium text-white">SME Readiness Portal</span>
            </div>
            <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--graphite-500)' }}>
              <span>United Arab Emirates</span>
              <span>&copy; 2026 All rights reserved</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
