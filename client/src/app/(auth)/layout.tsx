import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Clean Professional Branding */}
      <div
        className="hidden lg:flex lg:w-5/12 text-white flex-col justify-between p-10 relative overflow-hidden"
      >
        {/* Background Image - Neutral Business/Document imagery */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(/auth-bg.jpg)' }}
        />
        {/* Dark overlay for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(135deg, rgba(35, 40, 45, 0.92) 0%, rgba(35, 40, 45, 0.85) 100%)' }}
        />
        {/* Subtle accent line on right edge */}
        <div
          className="absolute top-0 right-0 w-[1px] h-full"
          style={{ background: 'var(--teal-600)', opacity: 0.4 }}
        />

        {/* Content */}
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center"
              style={{ background: 'var(--teal-600)' }}
            >
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="font-medium text-white">SME Readiness Portal</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-2xl font-semibold leading-tight text-white">
            Official SME Certification
            <span className="block mt-1" style={{ color: 'var(--teal-400)' }}>for UAE Businesses</span>
          </h1>
          <p className="text-sm max-w-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Get verified and listed in the official registry. Build credibility for your business.
          </p>

          <div className="space-y-3 pt-4">
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" style={{ color: 'var(--teal-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Verified certification process</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" style={{ color: 'var(--teal-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Public registry listing</span>
            </div>
            <div className="flex items-center gap-3">
              <svg className="w-4 h-4" style={{ color: 'var(--teal-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.85)' }}>Secure document handling</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
          500+ businesses certified across UAE
        </p>
      </div>

      {/* Right Panel - Form */}
      <div
        className="w-full lg:w-7/12 flex items-start lg:items-center justify-center p-6 py-10 lg:min-h-screen overflow-y-auto"
        style={{ background: 'var(--background)' }}
      >
        <div className="w-full max-w-xl">
          {children}
        </div>
      </div>
    </div>
  );
}
