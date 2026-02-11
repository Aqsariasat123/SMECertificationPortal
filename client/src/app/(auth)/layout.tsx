import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: '#F5FAFA' }}>
      {/* Left Panel - Dark Branding */}
      <div
        className="w-full lg:w-1/2 text-white flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden"
        style={{ background: '#111C1C', minHeight: 'auto' }}
      >
        {/* Subtle background gradients */}
        <div
          className="absolute -top-48 -right-48 w-[600px] h-[600px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(45,106,106,0.18) 0%, transparent 65%)' }}
        />
        <div
          className="absolute -bottom-24 -left-24 w-[400px] h-[400px] pointer-events-none"
          style={{ background: 'radial-gradient(ellipse, rgba(45,106,106,0.10) 0%, transparent 65%)' }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 relative z-10">
          <div
            className="w-9 h-9 rounded-lg flex items-center justify-center"
            style={{ background: '#2D6A6A' }}
          >
            <svg className="w-[18px] h-[18px]" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className="text-lg font-semibold text-white" style={{ fontFamily: 'var(--font-dm-sans), sans-serif' }}>Naywa</span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8 lg:py-10">
          <p
            className="text-xs font-semibold tracking-[0.16em] uppercase mb-5"
            style={{ color: '#3D8B8B' }}
          >
            SME Certification Platform
          </p>
          <h1
            className="text-[clamp(28px,3.5vw,44px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'var(--font-playfair), serif', color: 'white' }}
          >
            Structure your<br/>business for<br/><span style={{ color: '#3D8B8B' }}>institutional review.</span>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-[360px] mb-8"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Naywa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers.
          </p>

          {/* Feature List */}
          <ul className="space-y-3.5">
            <li className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(45,106,106,0.25)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong className="block mb-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Five-Pillar Assessment Framework</strong>
                Evidence-based evaluation across legal, financial, governance, and operational dimensions.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(45,106,106,0.25)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong className="block mb-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Verifiable Certification</strong>
                Recorded in Naywa's certification register and shareable with any institution.
              </div>
            </li>
            <li className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(45,106,106,0.25)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-[13px] leading-relaxed" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong className="block mb-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Independent Review</strong>
                Fixed criteria. No subjectivity. No relationship considerations.
              </div>
            </li>
          </ul>
        </div>

        {/* Footer Disclaimer */}
        <p
          className="relative z-10 text-[11px] leading-relaxed pt-5"
          style={{ color: 'rgba(255,255,255,0.2)', borderTop: '1px solid rgba(255,255,255,0.06)' }}
        >
          Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval or a guarantee of financing. Certification reflects status at the time of issuance only.
        </p>
      </div>

      {/* Right Panel - Form Area */}
      <div
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-8 lg:p-12 relative overflow-y-auto"
        style={{ background: '#F5FAFA' }}
      >
        <div className="w-full max-w-[460px]">
          {children}
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-5 flex flex-wrap gap-5 justify-center">
          <Link href="/terms" className="text-[11px] transition-colors" style={{ color: '#5A7070' }}>Terms</Link>
          <Link href="/privacy" className="text-[11px] transition-colors" style={{ color: '#5A7070' }}>Privacy</Link>
          <Link href="/certification-fees" className="text-[11px] transition-colors" style={{ color: '#5A7070' }}>Fees</Link>
          <Link href="/legal-notice" className="text-[11px] transition-colors" style={{ color: '#5A7070' }}>Legal Notice</Link>
          <Link href="/contact" className="text-[11px] transition-colors" style={{ color: '#5A7070' }}>Contact</Link>
        </div>
      </div>
    </div>
  );
}
