import Link from 'next/link';

interface PublicFooterProps {
  compact?: boolean;
}

export default function PublicFooter({ compact = false }: PublicFooterProps) {
  if (compact) {
    return (
      <footer className="py-4 px-6 text-center" style={{ borderTop: '1px solid var(--graphite-200)' }}>
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-xs" style={{ color: 'var(--graphite-500)' }}>
          <Link href="/terms" className="hover:underline" style={{ color: 'var(--graphite-500)' }}>Terms</Link>
          <Link href="/privacy" className="hover:underline" style={{ color: 'var(--graphite-500)' }}>Privacy</Link>
          <Link href="/certification-standards" className="hover:underline" style={{ color: 'var(--graphite-500)' }}>Certification Standards</Link>
          <Link href="/legal-notice" className="hover:underline" style={{ color: 'var(--graphite-500)' }}>Legal Notice</Link>
          <Link href="/contact" className="hover:underline" style={{ color: 'var(--graphite-500)' }}>Contact</Link>
          <span>&copy; {new Date().getFullYear()} Naywa</span>
        </div>
      </footer>
    );
  }

  return (
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
            <span className="text-sm font-medium text-white">Naywa</span>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-5 gap-y-1 text-xs">
            <Link href="/certification-standards" className="hover:underline" style={{ color: 'var(--graphite-400)' }}>Certification Standards</Link>
            <Link href="/terms" className="hover:underline" style={{ color: 'var(--graphite-400)' }}>Terms of Service</Link>
            <Link href="/privacy" className="hover:underline" style={{ color: 'var(--graphite-400)' }}>Privacy Policy</Link>
            <Link href="/legal-notice" className="hover:underline" style={{ color: 'var(--graphite-400)' }}>Legal Notice</Link>
            <Link href="/contact" className="hover:underline" style={{ color: 'var(--graphite-400)' }}>Contact</Link>
          </div>

          <div className="flex items-center gap-6 text-xs" style={{ color: 'var(--graphite-500)' }}>
            <span>United Arab Emirates</span>
            <span>&copy; {new Date().getFullYear()} Naywa. All rights reserved</span>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-6 pt-4 text-center" style={{ borderTop: '1px solid var(--graphite-700)' }}>
          <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
            Naywa certification is an independent assessment and does not constitute regulatory approval, legal advice, or a guarantee of performance.
          </p>
        </div>
      </div>
    </footer>
  );
}
