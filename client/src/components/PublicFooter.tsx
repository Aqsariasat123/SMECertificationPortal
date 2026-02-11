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
        <div className="mb-8">
          <Link href="/" className="no-underline">
            <span className="font-semibold text-base" style={{ color: 'white' }}>Naywa</span>
          </Link>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-8">
          <Link href="/certification-standards" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Certification Standards</Link>
          <Link href="/certification-fees" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Fees and Services</Link>
          <Link href="/terms" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Terms of Service</Link>
          <Link href="/privacy" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Privacy Policy</Link>
        </div>

        <div className="flex flex-wrap gap-x-8 gap-y-2 mb-10">
          <Link href="/legal-notice" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Legal Notice</Link>
          <Link href="/contact" className="text-sm no-underline transition-colors hover:text-white/75" style={{ color: 'rgba(255,255,255,0.5)' }}>Contact</Link>
          <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>United Arab Emirates</span>
        </div>

        <p className="text-xs max-w-3xl mb-6" style={{ color: 'rgba(255,255,255,0.35)', lineHeight: 1.7 }}>
          Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.
        </p>
        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>
          &copy; {new Date().getFullYear()} Naywa. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
