import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Branding */}
      <div
        className="hidden lg:flex lg:w-5/12 text-white flex-col justify-between p-10 relative overflow-hidden"
        style={{
          background: 'var(--sidebar-bg)',
        }}
      >
        {/* Subtle texture overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.5) 1px, transparent 0)`,
            backgroundSize: '24px 24px',
          }}
        />
        {/* Subtle gradient accent */}
        <div
          className="absolute top-0 right-0 w-96 h-96 opacity-10"
          style={{
            background: 'radial-gradient(circle at top right, var(--teal-500), transparent 70%)',
          }}
        />
        <div
          className="absolute bottom-0 left-0 w-64 h-64 opacity-5"
          style={{
            background: 'radial-gradient(circle at bottom left, var(--teal-400), transparent 70%)',
          }}
        />
        {/* Content - above texture */}
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
            <span className="font-medium">SME Readiness Portal</span>
          </Link>
        </div>

        <div className="relative z-10 space-y-6">
          <h1 className="text-3xl font-bold leading-tight text-white">
            Trusted certification
            <span className="block" style={{ color: 'var(--teal-400)' }}>for UAE businesses</span>
          </h1>
          <p className="text-base max-w-sm text-white opacity-70">
            Get certified and connect with partners, investors, and opportunities across the region.
          </p>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-600)' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base text-white">Verified certification process</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-600)' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base text-white">Public registry listing</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-600)' }}>
                <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-base text-white">Enterprise-grade security</span>
            </div>
          </div>
        </div>

        <p className="relative z-10 text-sm text-white opacity-50">
          500+ businesses certified across UAE
        </p>
      </div>

      {/* Right Panel - Form */}
      <div
        className="w-full lg:w-7/12 flex items-center justify-center p-6 min-h-screen"
        style={{ background: 'var(--background)' }}
      >
        <div className="w-full max-w-md">
          {children}
        </div>
      </div>
    </div>
  );
}
