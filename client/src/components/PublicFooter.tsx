import Link from 'next/link';

interface PublicFooterProps {
  compact?: boolean;
}

export default function PublicFooter({ compact = false }: PublicFooterProps) {
  if (compact) {
    return (
      <footer className="py-4 px-6 text-center" style={{ borderTop: '1px solid #D0E4E4', background: '#F5FAFA' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs" style={{ color: '#5A7070' }}>
          <Link href="/terms" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Terms</Link>
          <Link href="/privacy" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Privacy</Link>
          <Link href="/certification-standards" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Certification Standards</Link>
          <Link href="/certification-fees" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Fees</Link>
          <Link href="/legal-notice" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Legal Notice</Link>
          <Link href="/contact" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Contact</Link>
          <span>&copy; {new Date().getFullYear()} Naywa</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="px-6 md:px-12 pt-[52px] pb-9" style={{ background: '#111C1C' }}>
      <div className="max-w-5xl mx-auto">
        {/* Top Section */}
        <div
          className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-6 md:gap-12 items-start pb-9 mb-7"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}
        >
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div
              className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center flex-shrink-0"
              style={{ background: '#2D6A6A' }}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <span className="font-semibold text-base" style={{ color: 'white' }}>Naywa</span>
          </Link>

          {/* Links */}
          <ul className="flex flex-wrap gap-x-7 gap-y-2 list-none m-0 p-0 pt-1">
            <li>
              <Link href="/certification-standards" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Certification Standards
              </Link>
            </li>
            <li>
              <Link href="/certification-fees" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Fees and Services
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal-notice" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Legal Notice
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>
                Contact
              </Link>
            </li>
          </ul>

          {/* Geo */}
          <p className="text-xs tracking-[0.06em] text-right pt-1" style={{ color: 'rgba(255,255,255,0.22)' }}>
            United Arab Emirates
          </p>
        </div>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] gap-6 items-end">
          <p className="text-[11px] leading-[1.7] max-w-[680px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only. Verification confirms the status recorded in Naywa&apos;s certification register at the time of query.
          </p>
          <p className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.22)' }}>
            &copy; {new Date().getFullYear()} Naywa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
