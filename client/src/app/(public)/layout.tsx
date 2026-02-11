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
        <Link href="/" className="flex flex-col no-underline">
          <span className="font-semibold text-lg" style={{ color: '#111C1C' }}>Naywa</span>
          <span className="text-xs font-normal" style={{ color: '#5A7070' }}>SME Certification Platform</span>
        </Link>

        <div className="flex items-center gap-5">
          <Link
            href="/login"
            className="px-5 py-2 text-sm font-medium rounded-lg transition-all no-underline hover:bg-[#E8F4F4]"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="text-sm font-medium no-underline transition-colors hover:opacity-70"
            style={{ color: '#5A7070' }}
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
