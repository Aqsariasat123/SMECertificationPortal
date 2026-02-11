import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen" style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* Custom Styles */}
      <style>{`
        .font-playfair { font-family: var(--font-playfair), 'Playfair Display', serif; }
        .font-dm { font-family: var(--font-dm-sans), 'DM Sans', sans-serif; }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeUp { animation: fadeUp 0.7s forwards; }
        .delay-100 { animation-delay: 0.1s; }
        .delay-200 { animation-delay: 0.2s; }
        .delay-300 { animation-delay: 0.3s; }
        .delay-350 { animation-delay: 0.35s; }
        .delay-450 { animation-delay: 0.45s; }
        .delay-550 { animation-delay: 0.55s; }

        .reveal { opacity: 0; transform: translateY(24px); transition: opacity 0.65s ease, transform 0.65s ease; }
        .reveal.visible { opacity: 1; transform: none; }

        .hero-gradient::before {
          content: '';
          position: absolute;
          top: -200px;
          left: 50%;
          transform: translateX(-50%);
          width: 900px;
          height: 900px;
          background: radial-gradient(ellipse, rgba(45,106,106,0.07) 0%, transparent 70%);
          pointer-events: none;
        }

        .pillar-card:hover { background: #E8F4F4; }
        .principle-card:hover { box-shadow: 0 8px 32px rgba(45,106,106,0.10); transform: translateY(-2px); }

        .btn-hero:hover { background: #3D8B8B; transform: translateY(-2px); box-shadow: 0 8px 24px rgba(45,106,106,0.25); }
        .btn-cta:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(0,0,0,0.15); }
        .btn-ghost:hover { background: #E8F4F4; }
        .btn-primary-nav:hover { background: #3D8B8B; transform: translateY(-1px); }

        .nav-link:hover { color: #2D6A6A; }
        .footer-link:hover { color: rgba(255,255,255,0.75); }

        @media (max-width: 768px) {
          .nav-links { display: none !important; }
          .process-steps { grid-template-columns: 1fr !important; gap: 40px !important; }
          .process-line { display: none !important; }
          .brand-inner { grid-template-columns: 1fr !important; gap: 40px !important; }
          .brand-visual-col { order: -1; }
        }
      `}</style>

      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#2D6A6A' }}>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
          </div>
          <span className="font-semibold text-base" style={{ color: '#111C1C' }}>Naywa</span>
        </Link>

        <ul className="nav-links hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="#pillars" className="nav-link text-sm font-medium no-underline transition-colors" style={{ color: '#5A7070' }}>Certification Standards</Link></li>
          <li><Link href="#process" className="nav-link text-sm font-medium no-underline transition-colors" style={{ color: '#5A7070' }}>Process</Link></li>
          <li><Link href="/registry/verify" className="nav-link text-sm font-medium no-underline transition-colors" style={{ color: '#5A7070' }}>Verify a Certificate</Link></li>
        </ul>

        <div className="flex items-center gap-3">
          <Link
            href="/login"
            className="btn-ghost px-5 py-2 text-sm font-medium rounded-lg transition-all no-underline"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="btn-primary-nav px-5 py-2 text-sm font-semibold rounded-lg transition-all no-underline"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
          >
            Start Certification
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-gradient min-h-screen flex flex-col justify-center items-center text-center px-6 pt-32 pb-20 relative overflow-hidden" style={{ background: '#FFFFFF' }}>
        <p className="text-xs font-semibold uppercase tracking-widest mb-6 opacity-0 animate-fadeUp delay-100" style={{ color: '#2D6A6A', letterSpacing: '0.18em' }}>
          Naywa — SME Certification Platform
        </p>

        <h1 className="font-playfair font-black mb-7 opacity-0 animate-fadeUp delay-200" style={{ fontSize: 'clamp(48px, 7vw, 84px)', lineHeight: 1.05, color: '#111C1C', letterSpacing: '-0.02em' }}>
          Certified.<br/><span style={{ color: '#2D6A6A' }}>Structured.</span><br/>Capital-Ready.
        </h1>

        <p className="text-base md:text-lg font-normal max-w-xl mb-3 opacity-0 animate-fadeUp delay-300" style={{ color: '#5A7070', lineHeight: 1.65 }}>
          A bank decline does not always reflect business viability. In many cases, it reflects documentation gaps between your records and institutional review standards.<br/>
          <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>Naywa bridges that gap with structured, evidence-based certification.</strong>
        </p>

        <p className="text-base md:text-lg font-normal max-w-xl mb-3 opacity-0 animate-fadeUp delay-300" style={{ color: '#5A7070', lineHeight: 1.65 }}>
          Naywa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers — and issues a verifiable certification that speaks their language.
        </p>

        <p className="text-sm mb-10 opacity-0 animate-fadeUp delay-350" style={{ color: '#5A7070' }}>
          For UAE businesses preparing for bank, investor, or institutional review.
        </p>

        <div className="flex gap-3 justify-center flex-wrap opacity-0 animate-fadeUp delay-450">
          <Link
            href="/register"
            className="btn-hero px-8 py-3.5 text-sm font-semibold rounded-xl inline-flex items-center gap-2 no-underline transition-all"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
          >
            Start Certification
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* STRIP */}
      <div className="py-4 overflow-hidden" style={{ borderTop: '1px solid #D0E4E4', borderBottom: '1px solid #D0E4E4', background: '#F5FAFA' }}>
        <div className="flex gap-0 justify-center flex-wrap">
          {['Five-Pillar Framework', 'Independent Assessment', 'Point-in-Time Verification', 'UAE Market-Aligned Standards'].map((item, i, arr) => (
            <span
              key={item}
              className="text-xs font-medium uppercase px-7 py-1"
              style={{ color: '#5A7070', letterSpacing: '0.1em', borderRight: i < arr.length - 1 ? '1px solid #D0E4E4' : 'none' }}
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* PILLARS */}
      <section id="pillars" className="py-24 px-6" style={{ background: '#F5FAFA' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#2D6A6A', letterSpacing: '0.16em' }}>Assessment Framework</p>
          <h2 className="font-playfair font-bold mb-5" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: '#111C1C', letterSpacing: '-0.01em' }}>What Naywa Certifies</h2>
          <p className="text-base mb-14 max-w-2xl" style={{ color: '#5A7070', lineHeight: 1.75 }}>
            Naywa&apos;s assessment framework evaluates your business across five structured pillars — core dimensions typically examined by financial institutions when reviewing an SME for financing or partnership.
          </p>

          <div className="grid gap-px rounded-2xl overflow-hidden" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', background: '#D0E4E4', border: '1px solid #D0E4E4' }}>
            {[
              { num: '01', name: 'Legal & Ownership Readiness' },
              { num: '02', name: 'Financial Discipline' },
              { num: '03', name: 'Business Model & Unit Economics' },
              { num: '04', name: 'Governance & Controls' },
              { num: '05', name: 'Data Integrity, Auditability & Information Reliability' },
            ].map((pillar) => (
              <div key={pillar.num} className="pillar-card p-9 transition-colors" style={{ background: 'white' }}>
                <p className="font-playfair text-xs font-bold mb-4" style={{ color: '#2D6A6A', letterSpacing: '0.05em' }}>Pillar {pillar.num}</p>
                <p className="text-sm font-semibold" style={{ color: '#111C1C', lineHeight: 1.4 }}>{pillar.name}</p>
              </div>
            ))}
          </div>

          <p className="mt-7 text-sm max-w-2xl" style={{ color: '#5A7070', lineHeight: 1.65 }}>
            Each pillar is assessed against documented evidence. Certification is issued, deferred, or declined based on <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>what your records demonstrate</strong> — not projections or intent.
          </p>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="py-24 px-6" style={{ background: 'white', borderTop: '1px solid #D0E4E4', borderBottom: '1px solid #D0E4E4' }}>
        <div className="max-w-5xl mx-auto">
          <div className="brand-inner grid gap-20 items-center" style={{ gridTemplateColumns: '1fr 380px' }}>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#2D6A6A', letterSpacing: '0.16em' }}>The Name</p>
              <h2 className="font-playfair font-bold mb-5" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: '#111C1C' }}>
                Naywa — <span lang="ar">نيوا</span>
              </h2>
              <p className="text-base mb-5" style={{ color: '#5A7070', lineHeight: 1.8 }}>
                Naywa is a term rooted in Emirati maritime heritage. It describes a mountain beneath the sea — a formation invisible from the surface, known only to those who sail toward it and dive deep enough to find it.
              </p>
              <p className="text-base mb-5" style={{ color: '#5A7070', lineHeight: 1.8 }}>
                For generations, UAE seamen navigated by these hidden formations — unseen landmarks that shaped every voyage.
              </p>
              <p className="text-base" style={{ color: '#5A7070', lineHeight: 1.8 }}>
                The parallel is intentional. A business&apos;s true foundation — its legal structure, financial discipline, governance, and operational integrity — is rarely visible from the outside. Naywa exists to surface it. To bring what is beneath into a form that institutions can see, assess, and trust.
              </p>
            </div>

            <div className="brand-visual-col flex justify-center">
              <div className="flex flex-col items-center gap-4 p-12 rounded-2xl w-full max-w-xs" style={{ border: '1px solid #D0E4E4', background: '#F5FAFA' }}>
                <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-32">
                  <path d="M20 90 Q50 80 80 90 Q110 100 140 90 Q170 80 180 90" stroke="#2D6A6A" strokeWidth="1.5" strokeLinecap="round" opacity="0.4"/>
                  <path d="M10 100 Q50 88 90 100 Q130 112 170 100 Q185 95 190 100" stroke="#2D6A6A" strokeWidth="1.5" strokeLinecap="round" opacity="0.25"/>
                  <path d="M100 170 L60 105 L100 85 L140 105 Z" fill="none" stroke="#2D6A6A" strokeWidth="1.5" strokeLinejoin="round" opacity="0.6"/>
                  <path d="M100 85 L100 40" stroke="#2D6A6A" strokeWidth="1" strokeLinecap="round" opacity="0.3" strokeDasharray="3 4"/>
                  <circle cx="100" cy="38" r="3" fill="#2D6A6A" opacity="0.5"/>
                  <path d="M70 130 Q100 125 130 130" stroke="#2D6A6A" strokeWidth="1" strokeLinecap="round" opacity="0.2"/>
                  <path d="M78 148 Q100 143 122 148" stroke="#2D6A6A" strokeWidth="1" strokeLinecap="round" opacity="0.15"/>
                </svg>
                <p className="font-playfair text-4xl font-bold" style={{ color: '#2D6A6A', letterSpacing: '0.05em' }}>نيوا</p>
                <p className="text-xs font-medium uppercase text-center" style={{ color: '#5A7070', letterSpacing: '0.1em' }}>A mountain beneath the sea</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section id="principles" className="py-24 px-6" style={{ background: 'white' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#2D6A6A', letterSpacing: '0.16em' }}>Certification Principles</p>
          <h2 className="font-playfair font-bold mb-14" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: '#111C1C' }}>How the Assessment Works</h2>

          <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))' }}>
            {[
              {
                icon: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
                title: 'Independent Review',
                body: 'Naywa\'s assessment is conducted against fixed internal criteria. Reviewers evaluate submitted documentation only — no external lobbying, relationship considerations, or subjective judgement influences the outcome.'
              },
              {
                icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                title: 'Point-in-Time Verification',
                body: 'Certification reflects the documented state of your business at the time of submission. It is recorded in Naywa\'s certification register and remains verifiable by any institution you choose to share it with.'
              },
              {
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
                title: 'Evidence-Based Assessment',
                body: 'Every pillar score is derived from submitted documentation. If a document is absent, the relevant criterion is scored accordingly. The framework does not infer or assume.'
              }
            ].map((principle) => (
              <div key={principle.title} className="principle-card p-9 rounded-2xl transition-all" style={{ border: '1px solid #D0E4E4', background: 'white' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-5" style={{ background: '#E8F4F4' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                    {principle.icon}
                  </svg>
                </div>
                <p className="text-sm font-semibold mb-3" style={{ color: '#111C1C' }}>{principle.title}</p>
                <p className="text-sm" style={{ color: '#5A7070', lineHeight: 1.7 }}>{principle.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-6" style={{ background: '#111C1C' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#3D8B8B', letterSpacing: '0.16em' }}>Certification Process</p>
          <h2 className="font-playfair font-bold mb-5" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: 'white' }}>Three Steps to Certification</h2>
          <p className="text-base mb-14 max-w-2xl" style={{ color: 'rgba(255,255,255,0.5)', lineHeight: 1.75 }}>
            The certification process follows a structured review of submitted documentation.
          </p>

          <div className="process-steps grid grid-cols-3 gap-0 relative">
            <div className="process-line absolute top-7 left-1/6 right-1/6 h-px" style={{ background: 'linear-gradient(90deg, #2D6A6A 0%, #3D8B8B 50%, #2D6A6A 100%)' }}></div>

            {[
              { num: '1', title: 'Application Submission', body: 'Businesses submit required documentation in accordance with Naywa\'s certification standards.' },
              { num: '2', title: 'Review', body: 'Submitted materials are reviewed against internal assessment criteria at a defined point in time.' },
              { num: '3', title: 'Certification Decision', body: 'Certification status is issued, deferred, or declined and recorded in Naywa\'s certification register.' }
            ].map((step) => (
              <div key={step.num} className="text-center px-6">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-7 font-playfair text-xl font-bold relative z-10" style={{ background: '#2D6A6A', color: 'white' }}>
                  {step.num}
                </div>
                <p className="text-sm font-semibold mb-3" style={{ color: 'white' }}>{step.title}</p>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: 1.7 }}>{step.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCOPE */}
      <section className="py-24 px-6" style={{ background: '#F5FAFA' }}>
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-wider mb-4" style={{ color: '#2D6A6A', letterSpacing: '0.16em' }}>Scope & Limitations</p>
          <h2 className="font-playfair font-bold mb-12" style={{ fontSize: 'clamp(28px, 4vw, 42px)', lineHeight: 1.15, color: '#111C1C' }}>What Certification Means</h2>

          <div className="p-12 rounded-2xl max-w-3xl" style={{ border: '1px solid #D0E4E4', background: 'white' }}>
            <p className="text-sm mb-5" style={{ color: '#5A7070', lineHeight: 1.8 }}>
              Naywa certification is an independent, documentation-based assessment conducted by a private entity. It is important to understand what it does and does not represent.
            </p>
            <p className="text-sm mb-5" style={{ color: '#5A7070', lineHeight: 1.8 }}>
              Certification confirms that your submitted documentation meets Naywa&apos;s structured assessment criteria at the time of review. <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>It does not constitute regulatory approval, a government endorsement, or a guarantee of financing.</strong> It does not predict future business performance or ongoing compliance.
            </p>
            <p className="text-sm" style={{ color: '#5A7070', lineHeight: 1.8 }}>
              Institutions that receive your certificate are responsible for their own due diligence and lending or partnership decisions. <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>Naywa operates as assessment infrastructure — not as an intermediary, broker, or advisor.</strong>
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: '#2D6A6A' }}>
        <div className="absolute top-[-300px] left-1/2 -translate-x-1/2 w-[800px] h-[800px] rounded-full" style={{ background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 65%)' }}></div>

        <h2 className="font-playfair font-bold mb-4 relative" style={{ fontSize: 'clamp(32px, 5vw, 52px)', lineHeight: 1.1, color: 'white' }}>
          Ready to Get Certified?
        </h2>
        <p className="text-base max-w-lg mx-auto mb-10 relative" style={{ color: 'rgba(255,255,255,0.7)', lineHeight: 1.65 }}>
          Submit your documentation for an independent review. Certified entities receive a verifiable record of their capital-readiness status.
        </p>
        <Link
          href="/register"
          className="btn-cta px-9 py-3.5 text-sm font-semibold rounded-xl inline-flex items-center gap-2 no-underline transition-all relative"
          style={{ color: '#2D6A6A', background: 'white', border: 'none' }}
        >
          Start Certification
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="px-6 md:px-12 pt-10 pb-8" style={{ background: '#111C1C' }}>
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center justify-between flex-wrap gap-5 pb-7 mb-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#2D6A6A' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <span className="font-semibold text-base" style={{ color: 'white' }}>Naywa</span>
            </Link>

            <ul className="flex gap-6 flex-wrap list-none m-0 p-0">
              {['Certification Standards', 'Fees and Services', 'Terms of Service', 'Privacy Policy', 'Legal Notice', 'Contact', 'United Arab Emirates'].map((link) => (
                <li key={link}>
                  <Link href="#" className="footer-link text-xs no-underline transition-colors" style={{ color: 'rgba(255,255,255,0.4)' }}>{link}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex items-start justify-between flex-wrap gap-4">
            <p className="text-xs max-w-2xl" style={{ color: 'rgba(255,255,255,0.25)', lineHeight: 1.65 }}>
              Naywa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.
            </p>
            <p className="text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.25)' }}>
              © 2026 Naywa. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
