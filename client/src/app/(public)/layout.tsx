import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#F5FAFA' }}>
      {/* NAV - matches verify page design */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
      >
        {/* Logo with shield icon */}
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div
            className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center"
            style={{ background: '#2D6A6A' }}
          >
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <div className="flex flex-col gap-0.5">
            <span className="font-semibold text-lg leading-none" style={{ color: '#111C1C' }}>Naywa</span>
            <span className="text-[11px] leading-none tracking-wide" style={{ color: '#5A7070' }}>SME Certification Platform</span>
          </div>
        </Link>

        {/* Center Links - hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li>
            <Link
              href="/certification-standards"
              className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]"
              style={{ color: '#5A7070' }}
            >
              Certification Standards
            </Link>
          </li>
          <li>
            <Link
              href="/process"
              className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]"
              style={{ color: '#5A7070' }}
            >
              Process
            </Link>
          </li>
          <li>
            <Link
              href="/registry/verify"
              className="text-sm font-semibold no-underline"
              style={{ color: '#2D6A6A' }}
            >
              Verify a Certificate
            </Link>
          </li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-[#E8F4F4]"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-5 py-2.5 text-sm font-semibold rounded-lg no-underline transition-all hover:opacity-90"
            style={{ color: 'white', background: '#2D6A6A' }}
          >
            Start Certification
          </Link>
        </div>
      </nav>

      {/* Content - with padding for fixed nav */}
      <main className="flex-1 pt-16" style={{ background: '#F5FAFA' }}>
        {children}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
