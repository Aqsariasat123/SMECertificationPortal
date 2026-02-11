import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* Header - matches landing page nav */}
      <nav
        className="sticky top-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2D6A6A' }}>
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              <polyline points="9 12 11 14 15 10"/>
            </svg>
          </div>
          <span className="font-semibold text-base" style={{ color: '#111C1C' }}>Naywa</span>
        </Link>

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/certification-standards" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Certification Standards</Link></li>
          <li><Link href="/#process" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Process</Link></li>
          <li><Link href="/registry/verify" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Verify a Certificate</Link></li>
        </ul>

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
            className="px-5 py-2 text-sm font-semibold rounded-lg transition-all no-underline hover:bg-[#3D8B8B]"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
          >
            Start Certification
          </Link>
        </div>
      </nav>

      {/* Content */}
      <main className="flex-1" style={{ background: '#FFFFFF' }}>
        {children}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
