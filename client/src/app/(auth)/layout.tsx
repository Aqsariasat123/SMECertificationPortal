import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col lg:flex-row overflow-hidden" style={{ background: '#FFFFFF' }}>
      {/* Left Panel - Light Branding */}
      <div
        className="w-full lg:w-1/2 flex flex-col justify-between p-8 lg:p-12 relative overflow-hidden"
        style={{ background: '#FFFFFF', minHeight: 'auto' }}
      >
        {/* Arabic watermark background */}
        <div
          className="absolute bottom-0 right-0 pointer-events-none select-none"
          style={{
            fontSize: 'clamp(280px, 35vw, 450px)',
            fontFamily: 'var(--font-playfair), serif',
            color: 'rgba(45,106,106,0.04)',
            lineHeight: 0.8,
            transform: 'translate(10%, 20%)',
          }}
        >
          نيوا
        </div>

        {/* Logo */}
        <Link href="/" className="flex flex-col relative z-10">
          <span className="text-lg font-semibold" style={{ color: '#111C1C', fontFamily: 'var(--font-dm-sans), sans-serif' }}>Naywa</span>
          <span className="text-xs" style={{ color: '#5A7070' }}>SME Certification Platform</span>
        </Link>

        {/* Main Content */}
        <div className="relative z-10 flex-1 flex flex-col justify-center py-8 lg:py-10">
          <h1
            className="text-[clamp(36px,4.5vw,56px)] font-bold leading-[1.08] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#111C1C' }}
          >
            Structure your<br/>business for<br/><span style={{ color: '#2D6A6A' }}>institutional review.</span>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-[420px] mb-10"
            style={{ color: '#5A7070' }}
          >
            Naywa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers.
          </p>

          {/* Feature List */}
          <ul className="space-y-5">
            <li className="flex items-start gap-3.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#E8F4F4' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
                <strong className="block mb-0.5 font-semibold" style={{ color: '#111C1C' }}>Five-Pillar Assessment Framework</strong>
                Evidence-based evaluation across legal, financial, governance, and operational dimensions.
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#E8F4F4' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
                <strong className="block mb-0.5 font-semibold" style={{ color: '#111C1C' }}>Verifiable Certification</strong>
                Recorded in Naywa&apos;s certification register and shareable with any institution.
              </div>
            </li>
            <li className="flex items-start gap-3.5">
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: '#E8F4F4' }}
              >
                <svg className="w-2.5 h-2.5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </div>
              <div className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
                <strong className="block mb-0.5 font-semibold" style={{ color: '#111C1C' }}>Independent Review</strong>
                Fixed criteria. No subjectivity. No relationship considerations.
              </div>
            </li>
          </ul>
        </div>

        {/* Footer Disclaimer */}
        <p
          className="relative z-10 text-xs leading-relaxed max-w-[420px]"
          style={{ color: 'rgba(90,112,112,0.6)' }}
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
          <Link href="/terms" className="text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Terms</Link>
          <Link href="/privacy" className="text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Privacy</Link>
          <Link href="/certification-fees" className="text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Fees</Link>
          <Link href="/legal-notice" className="text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Legal Notice</Link>
          <Link href="/contact" className="text-[11px] transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Contact</Link>
        </div>
      </div>
    </div>
  );
}
