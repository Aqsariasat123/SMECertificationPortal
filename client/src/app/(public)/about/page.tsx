'use client';

import Link from 'next/link';

export default function AboutPage() {
  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center justify-center overflow-hidden">
        {/* Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/hero/about-hero.jpg)',
            backgroundPosition: 'center 40%',
          }}
        />
        {/* Dark Overlay - 25% */}
        <div
          className="absolute inset-0"
          style={{ background: 'rgba(11, 26, 26, 0.75)' }}
        />
        {/* Top Gradient - 0-20% extra darkness */}
        <div
          className="absolute inset-x-0 top-0 h-[30%]"
          style={{ background: 'linear-gradient(to bottom, rgba(11, 26, 26, 0.5) 0%, transparent 100%)' }}
        />

        {/* Content - Centered */}
        <div className="relative z-10 max-w-[900px] mx-auto px-6 md:px-12 text-center">
          <div
            className="inline-flex items-center gap-3 mb-6"
            style={{ animation: 'fadeUp 0.6s ease-out forwards' }}
          >
            <div className="h-px w-8 md:w-12" style={{ background: 'rgba(255,255,255,0.3)' }} />
            <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>About Naiwa</span>
            <div className="h-px w-8 md:w-12" style={{ background: 'rgba(255,255,255,0.3)' }} />
          </div>
          <h1
            className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF', animation: 'fadeUp 0.6s 0.1s ease-out both', textShadow: '0 2px 4px rgba(0,0,0,0.2)' }}
          >
            Independent SME Certification for the UAE Market
          </h1>
          <p
            className="text-[clamp(16px,1.8vw,20px)] leading-[1.75] max-w-[640px] mx-auto"
            style={{ color: 'rgba(255,255,255,0.8)', animation: 'fadeUp 0.6s 0.2s ease-out both', textShadow: '0 1px 2px rgba(0,0,0,0.2)' }}
          >
            Naiwa provides structured, documentation-based assessment services for small and medium enterprises operating within the United Arab Emirates.
          </p>
        </div>
      </section>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Origin Story - The Name */}
      <section className="py-20 px-6 md:px-12 relative overflow-hidden" style={{ background: '#111C1C' }}>
        <div
          className="absolute select-none pointer-events-none"
          style={{ top: '50%', right: '-40px', transform: 'translateY(-50%)', fontFamily: 'var(--font-playfair), Playfair Display, serif', fontSize: 'clamp(200px, 30vw, 360px)', fontWeight: 900, color: '#2D6A6A', opacity: 0.06, lineHeight: 1 }}
          aria-hidden="true"
        >
          نيوا
        </div>
        <div className="max-w-[1040px] mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M2 12c2-3 6-6 10-6s8 3 10 6c-2 3-6 6-10 6s-8-3-10-6z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#3D8B8B' }}>The Name</span>
              </div>
              <h2
                className="text-[clamp(32px,4vw,48px)] font-bold leading-[1.1] mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
              >
                Naiwa — <span style={{ color: '#3D8B8B' }}>نيوا</span>
              </h2>
              <p className="text-xl mb-8" style={{ color: 'rgba(255,255,255,0.5)' }}>A mountain beneath the sea</p>
              <div className="space-y-5" style={{ color: 'rgba(255,255,255,0.42)' }}>
                <p className="text-[15px] leading-[1.9]">
                  Naiwa is a term rooted in Emirati maritime heritage. It describes a mountain beneath the sea — a formation invisible from the surface, known only to those who sail toward it and dive deep enough to find it.
                </p>
                <p className="text-[15px] leading-[1.9]">
                  For generations, UAE seamen navigated by these hidden landmarks. Unseen, yet foundational to every voyage.
                </p>
              </div>
            </div>
            <div className="p-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-1 h-8" style={{ background: '#3D8B8B' }} />
                <span className="text-[10px] font-semibold tracking-[0.16em] uppercase" style={{ color: 'rgba(255,255,255,0.35)' }}>The Parallel</span>
              </div>
              <p className="text-[15px] leading-[1.9]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                A business's true foundation — its legal structure, financial discipline, governance, and operational integrity — is rarely visible from the outside. Institutions cannot fund what they cannot see.
              </p>
              <p className="text-[15px] leading-[1.9] mt-4 pt-6" style={{ color: '#3D8B8B', borderTop: '1px solid rgba(255,255,255,0.06)', fontStyle: 'italic' }}>
                Naiwa exists to surface it. To bring what is beneath into a form that banks, investors, and capital providers can assess and trust.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#5A7070' }}>Our Mission</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2
                className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Establishing Trust Through Rigorous Assessment
              </h2>
              <div className="space-y-5" style={{ color: '#5A7070' }}>
                <p className="text-[15px] leading-[1.8]">
                  Naiwa was established to address the need for independent, objective certification of small and medium enterprises in the UAE market. Our framework provides a standardized approach to evaluating business readiness across critical operational dimensions.
                </p>
                <p className="text-[15px] leading-[1.8]">
                  We operate independently from commercial entities, ensuring our assessments remain free from external influence or bias. This independence is fundamental to the credibility of our certification process.
                </p>
                <p className="text-[15px] leading-[1.8]">
                  Our certification is designed to serve as a baseline indicator of operational integrity, financial discipline, and governance adherence for enterprises seeking to demonstrate their readiness for institutional engagement.
                </p>
              </div>
            </div>
            <div className="p-10 rounded-xl" style={{ background: '#F5FAFA', border: '1px solid #D0E4E4' }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-6" style={{ background: '#E8F4F4' }}>
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="8.5" cy="7" r="4"/>
                  <line x1="20" y1="8" x2="20" y2="14"/>
                  <line x1="23" y1="11" x2="17" y2="11"/>
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4" style={{ color: '#111C1C' }}>Regulatory Alignment</h3>
              <p className="text-[15px] leading-[1.75]" style={{ color: '#5A7070' }}>
                Our assessment framework is designed to align with UAE commercial regulations and international best practices for enterprise governance. We maintain awareness of regulatory developments to ensure continued relevance.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Principles */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#5A7070' }}>Core Principles</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="max-w-[720px] mb-12">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Foundation of Our Assessment Approach
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'Independence', desc: 'Assessment conducted without commercial affiliations or external pressures. Our evaluations reflect objective analysis of submitted evidence.' },
              { title: 'Transparency', desc: 'Clear criteria and deterministic outcomes. Enterprises understand exactly what is required and how decisions are reached.' },
              { title: 'Consistency', desc: 'Standardized evaluation criteria applied uniformly across all applicants, ensuring fair and comparable outcomes.' },
              { title: 'Expertise', desc: 'Assessments conducted by qualified professionals with domain expertise in governance, finance, and regulatory compliance.' },
              { title: 'Precision', desc: 'State-driven certification logic ensures accurate, reproducible outcomes based on evidence rather than subjective judgment.' },
              { title: 'Integrity', desc: 'Immutable audit trails and cryptographic verification ensure the authenticity and permanence of certification records.' },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-xl" style={{ background: '#FFFFFF', border: '1px solid #D0E4E4' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-5" style={{ background: '#E8F4F4' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <h3 className="text-[15px] font-semibold mb-3" style={{ color: '#111C1C' }}>{item.title}</h3>
                <p className="text-sm leading-[1.7]" style={{ color: '#5A7070' }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Scope Section */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12" style={{ background: '#2D6A6A' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#3D8B8B' }}>Scope of Certification</span>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
              >
                What Naiwa Certification Represents
              </h2>
              <div className="space-y-5" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <p className="text-[15px] leading-[1.8]">
                  Naiwa certification indicates that an enterprise has successfully demonstrated adherence to the requirements of our five-pillar assessment framework at the time of evaluation.
                </p>
                <p className="text-[15px] leading-[1.8]">
                  Certification is issued for a defined validity period and represents a point-in-time assessment. Enterprises are expected to maintain compliance with framework requirements throughout the certification period.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              <div className="p-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>Certification Confirms</h3>
                <ul className="space-y-3">
                  {['Compliance with documented assessment criteria', 'Evidence verification across five pillars', 'Absence of automatic disqualification triggers'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12"/>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="p-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h3 className="font-semibold mb-4" style={{ color: '#FFFFFF' }}>Certification Does Not Represent</h3>
                <ul className="space-y-3">
                  {['Investment recommendation or financial advice', 'Government endorsement or regulatory approval', 'Guarantee of future performance or conduct'].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                      <svg className="w-4 h-4 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="18" y1="6" x2="6" y2="18"/>
                        <line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-14 px-6 md:px-12 text-center" style={{ background: '#2D6A6A' }}>
        <div className="max-w-[560px] mx-auto">
          <h2
            className="text-[clamp(22px,3vw,28px)] font-bold leading-[1.15] mb-3"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
          >
            Begin Your Certification Journey
          </h2>
          <p className="text-sm leading-[1.65] mb-6" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Review our methodology and framework to understand the certification requirements, then start your application when ready.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/methodology"
              className="px-6 py-2.5 text-sm font-medium rounded-lg no-underline transition-all hover:bg-white/10"
              style={{ color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              View Methodology
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-semibold rounded-lg no-underline transition-all hover:translate-y-[-2px]"
              style={{ color: '#2D6A6A', background: '#FFFFFF' }}
            >
              Apply for Certification
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
