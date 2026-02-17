'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function PublicHeader() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [uaeTime, setUaeTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const time = now.toLocaleString('en-GB', {
        timeZone: 'Asia/Dubai',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
      });
      setUaeTime(time + ' UAE');
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/about', label: 'About' },
    { href: '/methodology', label: 'Methodology' },
    { href: '/framework', label: 'Framework' },
    { href: '/registry/verify', label: 'Verify' },
    { href: '/contact', label: 'Contact' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Authority Bar */}
      <div
        className="fixed top-0 left-0 right-0 z-[60] h-[30px] flex items-center"
        style={{ background: '#F8F8F5', borderBottom: '1px solid #E8E8E0' }}
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          <span className="text-[11px] font-medium tracking-wide" style={{ color: '#6B7280' }}>
            NAIWA — SME Certification Platform
          </span>
          <div className="flex items-center gap-4">
            <span
              className="font-mono text-[11px] hidden sm:block"
              style={{ color: '#9CA3AF' }}
            >
              {uaeTime}
            </span>
            <div className="flex items-center gap-2 text-[11px]">
              <span style={{ color: '#6B7280' }}>EN</span>
              <span style={{ color: '#D1D5DB' }}>|</span>
              <span style={{ color: '#9CA3AF' }}>عربي</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav
        className="fixed top-[30px] left-0 right-0 z-50 h-16 flex items-center"
        style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #E5E7EB' }}
      >
        <div className="max-w-[1200px] w-full mx-auto px-6 md:px-12 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 no-underline">
            <div className="w-9 h-9 flex items-center justify-center" style={{ background: '#111827' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                <polyline points="9 12 11 14 15 10"/>
              </svg>
            </div>
            <span
              className="font-bold text-xl tracking-tight"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111827' }}
            >
              NAIWA
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium no-underline transition-colors"
                style={{ color: isActive(link.href) ? '#111827' : '#6B7280' }}
              >
                {link.label}
              </Link>
            ))}

            {/* Divider */}
            <div className="w-px h-5" style={{ background: '#E5E7EB' }} />

            {/* Auth Buttons */}
            <Link
              href="/login"
              className="text-sm font-medium no-underline transition-colors hover:text-[#111827]"
              style={{ color: '#6B7280' }}
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2 text-sm font-semibold rounded-sm no-underline transition-all hover:opacity-90"
              style={{ color: 'white', background: '#0D9488' }}
            >
              Apply Now
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div
            className="absolute top-full left-0 right-0 md:hidden py-4 px-6"
            style={{ background: 'white', borderBottom: '1px solid #E5E7EB' }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="py-3 text-sm font-medium no-underline transition-colors"
                  style={{ color: isActive(link.href) ? '#111827' : '#6B7280' }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px my-2" style={{ background: '#E5E7EB' }} />
              <Link
                href="/login"
                className="py-3 text-sm font-medium no-underline text-center rounded"
                style={{ color: '#6B7280', border: '1px solid #E5E7EB' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                href="/register"
                className="py-3 text-sm font-semibold no-underline text-center rounded"
                style={{ color: 'white', background: '#0D9488' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                Apply Now
              </Link>
            </div>
          </div>
        )}
      </nav>
    </>
  );
}
