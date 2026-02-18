'use client';

import { useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
          <div className="flex flex-col gap-1.5">
            <span className="font-semibold text-lg leading-none" style={{ color: '#111C1C' }}>NAIWA</span>
            <span className="text-[11px] leading-none tracking-wide" style={{ color: '#5A7070' }}>SME Certification Platform</span>
          </div>
        </Link>

        {/* Center Links - hidden on mobile */}
        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/about" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>About</Link></li>
          <li><Link href="/methodology" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Methodology</Link></li>
          <li><Link href="/framework" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Framework</Link></li>
          <li><Link href="/registry/verify" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Verify</Link></li>
          <li><Link href="/contact" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Contact</Link></li>
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-2 md:gap-3">
          {/* Desktop buttons */}
          <Link
            href="/login"
            className="hidden sm:flex px-3 md:px-5 py-2 text-xs md:text-sm font-medium rounded-lg transition-all no-underline hover:bg-[#E8F4F4]"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="hidden sm:flex px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg no-underline transition-all hover:opacity-90 whitespace-nowrap"
            style={{ color: 'white', background: '#2D6A6A' }}
          >
            Start Certification
          </Link>
          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg transition-colors"
            style={{ background: mobileMenuOpen ? '#E8F4F4' : 'transparent' }}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div
          className="fixed top-16 left-0 right-0 z-40 md:hidden"
          style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
        >
          <div className="px-6 py-4">
            <ul className="list-none m-0 p-0 space-y-1">
              {[
                { href: '/about', label: 'About' },
                { href: '/methodology', label: 'Methodology' },
                { href: '/framework', label: 'Framework' },
                { href: '/registry/verify', label: 'Verify' },
                { href: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]"
                    style={{ color: '#5A7070', borderBottom: '1px solid #E8F4F4' }}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="flex gap-3 mt-4 pt-2">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-sm font-medium rounded-lg text-center no-underline transition-all"
                style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A' }}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="flex-1 py-2.5 text-sm font-semibold rounded-lg text-center no-underline transition-all"
                style={{ color: 'white', background: '#2D6A6A' }}
              >
                Start Certification
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Content - with padding for fixed nav */}
      <main className="flex-1 pt-16" style={{ background: '#F5FAFA' }}>
        {children}
      </main>

      {/* Footer */}
      <PublicFooter />
    </div>
  );
}
