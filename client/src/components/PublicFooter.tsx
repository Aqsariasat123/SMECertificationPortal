import Link from 'next/link';

interface PublicFooterProps {
  compact?: boolean;
}

export default function PublicFooter({ compact = false }: PublicFooterProps) {
  if (compact) {
    return (
      <footer className="py-4 px-4 md:px-6 text-center" style={{ borderTop: '1px solid #D0E4E4', background: '#F5FAFA' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-[10px] md:text-xs" style={{ color: '#5A7070' }}>
          <Link href="/terms" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Terms</Link>
          <Link href="/privacy" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Privacy</Link>
          <Link href="/certification-standards" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Standards</Link>
          <Link href="/certification-fees" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Fees</Link>
          <Link href="/legal-notice" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Legal</Link>
          <Link href="/contact" className="hover:text-[#2D6A6A] transition-colors" style={{ color: '#5A7070' }}>Contact</Link>
          <span>&copy; {new Date().getFullYear()} Naiwa</span>
        </div>
      </footer>
    );
  }

  return (
    <footer className="py-10 md:py-14 px-4 md:px-12" style={{ background: '#111C1C' }}>
      <div className="max-w-[1040px] mx-auto">
        <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] gap-4 md:gap-6 items-start pb-6 md:pb-9 mb-5 md:mb-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center flex-shrink-0" style={{ background: '#2D6A6A' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <span className="font-semibold text-base" style={{ color: '#FFFFFF' }}>Naiwa</span>
          </Link>
          <ul className="flex flex-wrap list-none m-0 p-0 pt-1" style={{ gap: '6px 16px' }}>
            <li><Link href="/certification-standards" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Standards</Link></li>
            <li><Link href="/certification-fees" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Fees</Link></li>
            <li><Link href="/terms" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Terms</Link></li>
            <li><Link href="/privacy" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Privacy</Link></li>
            <li><Link href="/legal-notice" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Legal</Link></li>
            <li><Link href="/contact" className="text-[11px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Contact</Link></li>
            <li><span className="text-[11px] md:text-[13px]" style={{ color: 'rgba(255,255,255,0.45)' }}>UAE</span></li>
          </ul>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between gap-3 md:gap-6 md:items-end">
          <p className="text-[10px] md:text-[11px] leading-[1.7] max-w-[680px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
            Naiwa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.
          </p>
          <p className="text-[10px] md:text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.22)' }}>&copy; {new Date().getFullYear()} Naiwa. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
