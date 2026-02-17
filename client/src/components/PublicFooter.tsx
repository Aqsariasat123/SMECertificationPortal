'use client';

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
    <footer style={{ background: '#0A1414' }}>
      {/* Main Footer */}
      <div className="py-14 md:py-20 px-6 md:px-12">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-1">
              <Link href="/" className="flex items-center gap-2.5 no-underline mb-4">
                <div className="w-[38px] h-[38px] rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#1A2E2E', border: '1px solid #2D4A4A' }}>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                    <polyline points="9 12 11 14 15 10"/>
                  </svg>
                </div>
                <span className="font-semibold text-lg" style={{ color: '#FFFFFF' }}>NAIWA</span>
              </Link>
              <p className="text-[13px] leading-[1.6] mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Independent SME Certification<br />Infrastructure
              </p>
              <Link
                href="/about"
                className="text-[13px] font-medium no-underline transition-colors hover:opacity-80"
                style={{ color: '#3D8B8B' }}
              >
                Certifying small idea bearers&trade;
              </Link>
            </div>

            {/* Navigation Column */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Navigation
              </h4>
              <ul className="list-none m-0 p-0 space-y-3">
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
                      className="text-[13px] no-underline transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Legal
              </h4>
              <ul className="list-none m-0 p-0 space-y-3">
                {[
                  { href: '/terms', label: 'Terms of Use' },
                  { href: '/privacy', label: 'Privacy Policy' },
                  { href: '/certification-standards', label: 'Certification Disclaimer' },
                  { href: '/certification-scope', label: 'Limitation of Liability & Certification Scope' },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-[13px] no-underline transition-colors hover:text-white"
                      style={{ color: 'rgba(255,255,255,0.5)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact Column */}
            <div>
              <h4 className="text-[11px] font-semibold tracking-[0.15em] uppercase mb-5" style={{ color: 'rgba(255,255,255,0.25)' }}>
                Contact
              </h4>
              <ul className="list-none m-0 p-0 space-y-3">
                <li className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Dubai, United Arab Emirates
                </li>
                <li>
                  <a
                    href="mailto:contact@naiwa.ae"
                    className="text-[13px] no-underline transition-colors hover:text-white"
                    style={{ color: 'rgba(255,255,255,0.5)' }}
                  >
                    contact@naiwa.ae
                  </a>
                </li>
                <li className="text-[13px]" style={{ color: 'rgba(255,255,255,0.5)' }}>
                  Sunday - Thursday, 9:00 - 17:00 GST
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 md:px-12 py-5" style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: '#070F0F' }}>
        <div className="max-w-[1200px] mx-auto">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            {/* Disclaimer */}
            <p className="text-[11px] leading-[1.7] max-w-[600px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
              NAIWA operates as an independent SME certification platform within the UAE entrepreneurial ecosystem, and maintains organizational membership within Dubai SME initiatives.
            </p>

            {/* Copyright & Links */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6">
              <p className="text-[11px]" style={{ color: 'rgba(255,255,255,0.2)' }}>
                &copy; {new Date().getFullYear()} NAIWA. All rights reserved.
              </p>
              <div className="flex items-center gap-4">
                <Link href="/terms" className="text-[11px] no-underline transition-colors hover:text-white/40" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Terms
                </Link>
                <Link href="/privacy" className="text-[11px] no-underline transition-colors hover:text-white/40" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Privacy
                </Link>
                <Link href="/certification-standards" className="text-[11px] no-underline transition-colors hover:text-white/40" style={{ color: 'rgba(255,255,255,0.2)' }}>
                  Disclaimer
                </Link>
              </div>
              {/* Language Switcher */}
              <div className="flex items-center gap-2 text-[11px]">
                <span style={{ color: 'rgba(255,255,255,0.4)' }}>English</span>
                <span style={{ color: 'rgba(255,255,255,0.15)' }}>|</span>
                <span style={{ color: 'rgba(255,255,255,0.25)' }}>عربي</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
