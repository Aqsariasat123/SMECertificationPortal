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
    <footer className="px-6 md:px-12 pt-10 pb-8" style={{ background: '#111C1C' }}>
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between flex-wrap gap-5 pb-7 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <Link href="/" className="flex items-center gap-2.5 no-underline">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#2D6A6A' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <span className="font-semibold text-base" style={{ color: 'white' }}>Naywa</span>
          </Link>

          <ul className="flex gap-6 flex-wrap list-none m-0 p-0">
            <li><Link href="/certification-standards" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Certification Standards</Link></li>
            <li><Link href="/certification-fees" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Fees and Services</Link></li>
            <li><Link href="/terms" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Terms of Service</Link></li>
            <li><Link href="/privacy" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Privacy Policy</Link></li>
            <li><Link href="/legal-notice" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Legal Notice</Link></li>
            <li><Link href="/contact" className="text-xs no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.4)' }}>Contact</Link></li>
            <li><span className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>United Arab Emirates</span></li>
          </ul>
        </div>

        <div className="flex items-start justify-between flex-wrap gap-4">
          <p className="text-xs max-w-2xl" style={{ color: 'rgba(255,255,255,0.25)', lineHeight: 1.65 }}>
            Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.
          </p>
          <p className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>
            &copy; {new Date().getFullYear()} Naywa. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
