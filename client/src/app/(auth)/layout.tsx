import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:grid lg:grid-cols-2" style={{ background: '#F5FAFA' }}>
      {/* MOBILE HEADER - Branding (visible only on mobile) */}
      <div
        className="lg:hidden relative overflow-hidden px-6 py-8"
        style={{ background: '#111C1C' }}
      >
        {/* Background glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-100px',
            right: '-100px',
            width: '300px',
            height: '300px',
            background: 'radial-gradient(ellipse, rgba(45,106,106,0.20) 0%, transparent 65%)',
          }}
        />

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline relative z-10 mb-6">
          <div
            className="w-[36px] h-[36px] rounded-[8px] flex items-center justify-center flex-shrink-0"
            style={{ background: '#2D6A6A' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-base font-semibold text-white leading-none">Naywa</span>
            <span className="text-[10px] leading-none tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>SME Certification Platform</span>
          </div>
        </Link>

        {/* Headline */}
        <h1
          className="text-[24px] font-bold leading-[1.15] tracking-[-0.02em] text-white relative z-10"
          style={{ fontFamily: 'var(--font-playfair), serif' }}
        >
          Structure your business for <span style={{ color: '#3D8B8B' }}>institutional review.</span>
        </h1>
        <p
          className="text-[12px] leading-[1.6] mt-3 relative z-10"
          style={{ color: 'rgba(255,255,255,0.5)' }}
        >
          Naywa assesses your business against criteria aligned with institutional review standards used by UAE banks and financial institutions.
        </p>

        {/* Feature Pills */}
        <div className="flex flex-wrap gap-2 mt-4 relative z-10">
          <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(45,106,106,0.25)', color: '#5DB5A8' }}>Five-Pillar Assessment</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(45,106,106,0.25)', color: '#5DB5A8' }}>Verifiable Certification</span>
          <span className="text-[10px] px-2.5 py-1 rounded-full" style={{ background: 'rgba(45,106,106,0.25)', color: '#5DB5A8' }}>Independent Review</span>
        </div>
      </div>

      {/* LEFT PANEL - Dark Branding (hidden on mobile, visible on desktop) */}
      <div
        className="hidden lg:flex relative flex-col justify-between p-10 lg:p-[40px_52px] overflow-hidden"
        style={{ background: '#111C1C' }}
      >
        {/* Subtle background texture - top right glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-200px',
            right: '-200px',
            width: '700px',
            height: '700px',
            background: 'radial-gradient(ellipse, rgba(45,106,106,0.20) 0%, transparent 65%)',
          }}
        />
        {/* Subtle background texture - bottom left glow */}
        <div
          className="absolute pointer-events-none"
          style={{
            bottom: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(ellipse, rgba(45,106,106,0.12) 0%, transparent 65%)',
          }}
        />

        {/* Left accent line */}
        <div
          className="absolute top-0 left-0 w-[3px] h-full"
          style={{
            background: 'linear-gradient(to bottom, transparent, #2D6A6A, transparent)',
            opacity: 0.4,
          }}
        />

        {/* Arabic watermark */}
        <div
          className="absolute pointer-events-none select-none whitespace-nowrap"
          style={{
            bottom: '-20px',
            right: '-20px',
            fontFamily: 'var(--font-playfair), serif',
            fontSize: '260px',
            fontWeight: 900,
            color: '#2D6A6A',
            opacity: 0.055,
            lineHeight: 1,
          }}
          aria-hidden="true"
        >
          نيوا
        </div>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 no-underline relative z-10">
          <div
            className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center flex-shrink-0"
            style={{ background: '#2D6A6A' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <span className="text-lg font-semibold text-white leading-none">Naywa</span>
            <span className="text-[11px] leading-none tracking-wide" style={{ color: 'rgba(255,255,255,0.35)' }}>SME Certification Platform</span>
          </div>
        </Link>

        {/* Left Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-10">
          <h1
            className="text-[clamp(32px,3.5vw,48px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6 text-white"
            style={{ fontFamily: 'var(--font-playfair), serif' }}
          >
            Structure your<br/>business for<br/><span style={{ color: '#3D8B8B' }}>institutional review.</span>
          </h1>
          <p
            className="text-sm leading-[1.75] max-w-[360px] mb-10"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            Naywa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers.
          </p>

          {/* Feature List */}
          <ul className="flex flex-col gap-3.5">
            <li className="flex items-start gap-3">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(45,106,106,0.25)' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.6)' }}>
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
              <div className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong className="block mb-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Verifiable Certification</strong>
                Recorded in Naywa&apos;s certification register and shareable with any institution.
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
              <div className="text-[13px] leading-[1.5]" style={{ color: 'rgba(255,255,255,0.6)' }}>
                <strong className="block mb-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>Independent Review</strong>
                Fixed criteria. Structured review. No external influence.
              </div>
            </li>
          </ul>
        </div>

        {/* Footer Disclaimer */}
        <div
          className="relative z-10 text-[11px] leading-[1.6] pt-5"
          style={{
            color: 'rgba(255,255,255,0.2)',
            borderTop: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval or a guarantee of financing. Certification reflects status at the time of issuance only.
        </div>
      </div>

      {/* RIGHT PANEL - Form Area */}
      <div
        className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12 relative overflow-y-auto"
        style={{ background: '#F5FAFA' }}
      >
        <div className="w-full max-w-[460px] pb-12">
          {children}
        </div>

        {/* Footer Links */}
        <div className="absolute bottom-4 left-0 right-0 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 px-4 md:px-6">
          <Link href="/terms" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Terms</Link>
          <span style={{ color: '#D0E4E4' }}>·</span>
          <Link href="/privacy" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Privacy</Link>
          <span style={{ color: '#D0E4E4' }}>·</span>
          <Link href="/certification-standards" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Standards</Link>
          <span style={{ color: '#D0E4E4' }}>·</span>
          <Link href="/certification-fees" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Fees</Link>
          <span style={{ color: '#D0E4E4' }}>·</span>
          <Link href="/legal-notice" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Legal</Link>
          <span style={{ color: '#D0E4E4' }}>·</span>
          <Link href="/contact" className="text-[10px] md:text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Contact</Link>
        </div>
      </div>
    </div>
  );
}
