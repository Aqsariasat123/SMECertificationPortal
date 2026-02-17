'use client';

import Link from 'next/link';

export default function LegalNoticePage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#F5FAFA' }}>
      {/* Header */}
      <section className="pt-12 pb-12 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <div className="h-px w-16" style={{ background: '#D0E4E4' }} />
            <span className="text-xs font-semibold tracking-[0.2em] uppercase" style={{ color: '#5A7070' }}>Legal Document</span>
          </div>
          <h1
            className="text-[clamp(32px,5vw,48px)] font-bold leading-[1.1] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
          >
            Legal Notice
          </h1>
          <p className="text-sm" style={{ color: '#5A7070' }}>
            Last updated: February 2026
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="pb-20 px-6 md:px-12">
        <div className="max-w-[900px] mx-auto">
          <div className="bg-white rounded-xl p-8 md:p-12 space-y-10" style={{ border: '1px solid #D0E4E4' }}>

            {/* Company Information */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                1. Company Information
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  <strong style={{ color: '#111C1C' }}>NAIWA</strong><br />
                  SME Certification Platform<br />
                  Dubai, United Arab Emirates
                </p>
                <p>
                  Email: <a href="mailto:contact@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>contact@naiwa.ae</a>
                </p>
              </div>
            </div>

            {/* Website Usage */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                2. Website Usage
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Access to and use of this website is subject to our Terms of Use. By accessing this website, you acknowledge that you have read, understood, and agree to be bound by these terms.
                </p>
                <p>
                  We reserve the right to modify, suspend, or discontinue any aspect of the website at any time without prior notice.
                </p>
              </div>
            </div>

            {/* Intellectual Property */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                3. Intellectual Property
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of NAIWA or its content suppliers and is protected by UAE and international copyright laws.
                </p>
                <p>
                  The NAIWA name, logo, and certification marks are trademarks of NAIWA. Unauthorized use of these trademarks is strictly prohibited.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                4. Disclaimer
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  The information provided on this website is for general informational purposes only. While we strive to keep the information up to date and accurate, we make no representations or warranties of any kind about the completeness, accuracy, reliability, suitability, or availability of the information.
                </p>
                <p>
                  Any reliance you place on such information is strictly at your own risk.
                </p>
              </div>
            </div>

            {/* External Links */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                5. External Links
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  This website may contain links to external websites that are not operated by NAIWA. We have no control over the content and practices of these sites and cannot accept responsibility or liability for their respective privacy policies or content.
                </p>
              </div>
            </div>

            {/* Governing Law */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                6. Governing Law
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  This legal notice and any disputes arising from the use of this website shall be governed by and construed in accordance with the laws of the United Arab Emirates. The courts of Dubai shall have exclusive jurisdiction over any disputes.
                </p>
              </div>
            </div>

            {/* Related Documents */}
            <div className="pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Related Documents
              </h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <Link href="/terms" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Terms of Use</span>
                </Link>
                <Link href="/privacy" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Privacy Policy</span>
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Contact
              </h2>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                For legal inquiries, please contact us at{' '}
                <a href="mailto:legal@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>
                  legal@naiwa.ae
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
