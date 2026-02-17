'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import PublicHeader from '@/components/PublicHeader';

export default function LandingPage() {
  useEffect(() => {
    const reveals = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          setTimeout(() => entry.target.classList.add('visible'), i * 60);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      <PublicHeader />

      {/* HERO */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
        style={{ padding: '120px 24px 80px', background: '#FFFFFF' }}
      >
        <div
          className="absolute pointer-events-none"
          style={{
            top: '-200px', left: '50%', transform: 'translateX(-50%)',
            width: '900px', height: '900px',
            background: 'radial-gradient(ellipse, rgba(45,106,106,0.07) 0%, transparent 70%)'
          }}
        />
        <p
          className="text-[13px] font-semibold tracking-[0.18em] uppercase mb-6"
          style={{ color: '#2D6A6A', opacity: 0, animation: 'fadeUp 0.7s 0.1s forwards' }}
        >
          Naiwa — SME Certification Platform
        </p>
        <h1
          className="text-[clamp(48px,7vw,84px)] font-black leading-[1.05] tracking-[-0.02em] mb-7"
          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C', opacity: 0, animation: 'fadeUp 0.7s 0.2s forwards' }}
        >
          Certified.<br/><em className="not-italic" style={{ color: '#2D6A6A' }}>Structured.</em><br/>Capital-Ready.
        </h1>
        <p
          className="text-[clamp(16px,2vw,20px)] leading-[1.65] max-w-[580px] mb-3"
          style={{ color: '#5A7070', opacity: 0, animation: 'fadeUp 0.7s 0.3s forwards' }}
        >
          A bank decline does not always reflect business viability. In many cases, it reflects documentation gaps between your records and institutional review standards.<br/>
          <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>Naiwa bridges that gap with structured, evidence-based certification.</strong>
        </p>
        <p
          className="text-[clamp(16px,2vw,20px)] leading-[1.65] max-w-[580px]"
          style={{ color: '#5A7070', opacity: 0, animation: 'fadeUp 0.7s 0.35s forwards' }}
        >
          Naiwa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers — and issues a verifiable certification that speaks their language.
        </p>
        <p
          className="text-[13px] mt-7"
          style={{ color: '#5A7070', opacity: 0, animation: 'fadeUp 0.7s 0.4s forwards' }}
        >
          For UAE businesses preparing for bank, investor, or institutional review.
        </p>
        <div className="flex gap-3.5 justify-center flex-wrap mt-9" style={{ opacity: 0, animation: 'fadeUp 0.7s 0.45s forwards' }}>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold rounded-[10px] no-underline transition-all hover:translate-y-[-2px]"
            style={{ color: 'white', background: '#2D6A6A', boxShadow: '0 8px 24px rgba(45,106,106,0.25)' }}
          >
            Start Certification
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* STRIP */}
      <div className="py-[18px] overflow-hidden" style={{ borderTop: '1px solid #D0E4E4', borderBottom: '1px solid #D0E4E4', background: '#F5FAFA' }}>
        <div className="flex gap-0 justify-center flex-wrap">
          <span className="text-xs font-medium tracking-[0.1em] uppercase py-1 px-7" style={{ color: '#5A7070', borderRight: '1px solid #D0E4E4' }}>Five-Pillar Framework</span>
          <span className="text-xs font-medium tracking-[0.1em] uppercase py-1 px-7" style={{ color: '#5A7070', borderRight: '1px solid #D0E4E4' }}>Independent Assessment</span>
          <span className="text-xs font-medium tracking-[0.1em] uppercase py-1 px-7" style={{ color: '#5A7070', borderRight: '1px solid #D0E4E4' }}>Point-in-Time Verification</span>
          <span className="text-xs font-medium tracking-[0.1em] uppercase py-1 px-7" style={{ color: '#5A7070' }}>UAE Market-Aligned Standards</span>
        </div>
      </div>

      {/* PILLARS */}
      <section id="pillars" className="py-24 px-6" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#2D6A6A' }}>Assessment Framework</p>
          <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>What Naiwa Certifies</h2>
          <p className="reveal text-base leading-[1.75] max-w-[640px]" style={{ color: '#5A7070' }}>
            Naiwa&apos;s assessment framework evaluates your business across five structured pillars — core dimensions typically examined by financial institutions when reviewing an SME for financing or partnership.
          </p>
          <div className="reveal grid grid-cols-2 md:grid-cols-5 gap-[1px] mt-14 rounded-2xl overflow-hidden" style={{ background: '#D0E4E4', border: '1px solid #D0E4E4' }}>
            {[
              { num: '01', name: 'Legal & Ownership Readiness' },
              { num: '02', name: 'Financial Discipline' },
              { num: '03', name: 'Business Model & Unit Economics' },
              { num: '04', name: 'Governance & Controls' },
              { num: '05', name: 'Data Integrity, Auditability & Information Reliability' },
            ].map((p) => (
              <div key={p.num} className="p-9 transition-colors hover:bg-[#E8F4F4]" style={{ background: '#FFFFFF' }}>
                <p className="text-[13px] font-bold tracking-[0.05em] mb-4" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#2D6A6A' }}>Pillar {p.num}</p>
                <p className="text-[15px] font-semibold leading-[1.4]" style={{ color: '#111C1C' }}>{p.name}</p>
              </div>
            ))}
          </div>
          <p className="reveal text-sm leading-[1.65] max-w-[680px] mt-7" style={{ color: '#5A7070' }}>
            Each pillar is assessed against documented evidence. Certification is issued, deferred, or declined based on <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>what your records demonstrate</strong> — not projections or intent.
          </p>
          <Link
            href="/framework"
            className="reveal inline-flex items-center gap-2 mt-6 text-sm font-medium no-underline transition-colors hover:gap-3"
            style={{ color: '#2D6A6A' }}
          >
            View Full Framework
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
        </div>
      </section>

      {/* BRAND STORY */}
      <section className="relative overflow-hidden">
        <div className="relative py-24 px-6 overflow-hidden" style={{ background: '#111C1C' }}>
          <div className="absolute top-0 left-0 w-[3px] h-full" style={{ background: 'linear-gradient(to bottom, transparent, #2D6A6A, transparent)', opacity: 0.4 }} />
          <div className="absolute pointer-events-none" style={{ top: '-100px', left: '20%', width: '900px', height: '800px', background: 'radial-gradient(ellipse, rgba(45,106,106,0.14) 0%, transparent 60%)' }} />
          <div
            className="absolute select-none pointer-events-none whitespace-nowrap"
            style={{ top: '50%', right: '-40px', transform: 'translateY(-50%)', fontFamily: 'var(--font-playfair), Playfair Display, serif', fontSize: 'clamp(260px, 35vw, 440px)', fontWeight: 900, color: '#2D6A6A', opacity: 0.06, lineHeight: 1 }}
            aria-hidden="true"
          >
            نايوا
          </div>
          <div className="max-w-[1040px] mx-auto relative z-10">
            <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 flex items-center gap-3.5" style={{ color: '#3D8B8B' }}>
              The Name
              <span className="flex-1 max-w-[48px] h-[1px]" style={{ background: '#2D6A6A', opacity: 0.4 }} />
            </p>
            <h2 className="reveal text-[clamp(40px,6vw,72px)] font-black leading-[1.05] tracking-[-0.025em] mb-4 max-w-[600px]" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>
              Naiwa — <span className="italic" style={{ color: '#3D8B8B' }}>نايوا</span>
            </h2>
            <p className="reveal text-[13px] tracking-[0.2em] uppercase mb-16" style={{ color: 'rgba(255,255,255,0.18)' }}>A mountain beneath the sea</p>
            <div className="reveal grid md:grid-cols-2 gap-12 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3.5" style={{ color: '#3D8B8B', opacity: 0.65 }}>Origin</p>
                <p className="text-[15px] leading-[1.9]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  Naiwa is a term rooted in Emirati maritime heritage. It describes a mountain beneath the sea — a formation invisible from the surface, known only to those who sail toward it and dive deep enough to find it. For generations, UAE seamen navigated by these hidden landmarks. Unseen, yet foundational to every voyage.
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase mb-3.5" style={{ color: '#3D8B8B', opacity: 0.65 }}>The Parallel</p>
                <p className="text-[15px] leading-[1.9]" style={{ color: 'rgba(255,255,255,0.42)' }}>
                  A business&apos;s true foundation — its legal structure, financial discipline, governance, and operational integrity — is rarely visible from the outside. Institutions cannot fund what they cannot see. <strong style={{ color: 'rgba(255,255,255,0.72)', fontWeight: 500 }}>Naiwa exists to surface it.</strong> To bring what is beneath into a form that banks, investors, and capital providers can assess and trust.
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="relative py-16 px-6 overflow-hidden" style={{ background: '#2D6A6A' }}>
          <div className="absolute inset-0 pointer-events-none" style={{ background: 'repeating-linear-gradient(45deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px)' }} />
          <div className="absolute pointer-events-none" style={{ top: '50%', right: '-100px', transform: 'translateY(-50%)', width: '500px', height: '500px', background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 65%)' }} />
          <div className="max-w-[960px] mx-auto grid md:grid-cols-[1fr_auto] gap-12 items-center relative z-10">
            <p className="text-[clamp(22px,3vw,32px)] font-bold leading-[1.35] tracking-[-0.01em]" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>
              The foundation was always there.<br/>
              <span className="font-normal italic" style={{ color: 'rgba(255,255,255,0.45)' }}>Naiwa makes it visible.</span>
            </p>
            <p className="hidden md:block text-[64px] font-black leading-none select-none whitespace-nowrap" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: 'rgba(255,255,255,0.12)' }} aria-hidden="true">نايوا</p>
          </div>
        </div>
      </section>

      {/* PRINCIPLES */}
      <section id="principles" className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#2D6A6A' }}>Certification Principles</p>
          <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>How the Assessment Works</h2>
          <div className="grid md:grid-cols-3 gap-6 mt-14">
            {[
              {
                icon: <><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></>,
                title: 'Independent Review',
                body: "Naiwa's assessment is conducted against fixed internal criteria. Reviewers evaluate submitted documentation only — no external influence on the outcome."
              },
              {
                icon: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
                title: 'Point-in-Time Verification',
                body: "Certification reflects the documented state of your business at the time of submission. It is recorded in Naiwa's certification register and remains verifiable by any institution you choose to share it with."
              },
              {
                icon: <><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></>,
                title: 'Evidence-Based Assessment',
                body: 'Every pillar score is derived from submitted documentation. If a document is absent, the relevant criterion is scored accordingly. The framework does not infer or assume.'
              },
            ].map((p, i) => (
              <div key={i} className="reveal p-9 rounded-[14px] transition-all hover:shadow-lg hover:translate-y-[-2px]" style={{ border: '1px solid #D0E4E4', background: '#FFFFFF' }}>
                <div className="w-10 h-10 rounded-[10px] flex items-center justify-center mb-5" style={{ background: '#E8F4F4' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">{p.icon}</svg>
                </div>
                <p className="text-[15px] font-semibold mb-3" style={{ color: '#111C1C' }}>{p.title}</p>
                <p className="text-sm leading-[1.7]" style={{ color: '#5A7070' }}>{p.body}</p>
              </div>
            ))}
          </div>
          <div className="reveal text-center mt-10">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:gap-3"
              style={{ color: '#2D6A6A' }}
            >
              View Full Methodology
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section id="process" className="py-24 px-6" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#3D8B8B' }}>Certification Process</p>
          <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>Three Steps to Certification</h2>
          <p className="reveal text-base leading-[1.75]" style={{ color: 'rgba(255,255,255,0.5)' }}>The certification process follows a structured review of submitted documentation.</p>
          <div className="grid md:grid-cols-3 gap-0 mt-14 relative">
            <div className="hidden md:block absolute h-[1px] top-7" style={{ left: 'calc(16.66% + 20px)', right: 'calc(16.66% + 20px)', background: 'linear-gradient(90deg, #2D6A6A 0%, #3D8B8B 50%, #2D6A6A 100%)' }} />
            {[
              { num: '1', title: 'Application Submission', body: "Businesses submit required documentation in accordance with Naiwa's certification standards." },
              { num: '2', title: 'Review', body: 'Submitted materials are reviewed against internal assessment criteria at a defined point in time.' },
              { num: '3', title: 'Certification Decision', body: "Certification status is issued, deferred, or declined and recorded in Naiwa's certification register." },
            ].map((s) => (
              <div key={s.num} className="reveal text-center px-6">
                <div
                  className="w-14 h-14 rounded-full mx-auto mb-7 flex items-center justify-center text-xl font-bold relative z-10"
                  style={{ background: '#2D6A6A', fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
                >
                  {s.num}
                </div>
                <p className="text-[15px] font-semibold mb-3" style={{ color: '#FFFFFF' }}>{s.title}</p>
                <p className="text-[13px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.45)' }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SCOPE */}
      <section className="py-24 px-6" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#2D6A6A' }}>Scope & Limitations</p>
          <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>What Certification Means</h2>
          <div className="reveal max-w-[760px] p-12 mt-12 rounded-2xl" style={{ border: '1px solid #D0E4E4', background: '#FFFFFF' }}>
            <p className="text-[15px] leading-[1.8] mb-5" style={{ color: '#5A7070' }}>Naiwa certification is an independent, documentation-based assessment conducted by a private entity. It is important to understand what it does and does not represent.</p>
            <p className="text-[15px] leading-[1.8] mb-5" style={{ color: '#5A7070' }}>Certification confirms that your submitted documentation meets Naiwa&apos;s structured assessment criteria at the time of review. <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>It does not constitute regulatory approval, a government endorsement, or a guarantee of financing.</strong> It does not predict future business performance or ongoing compliance.</p>
            <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>Institutions that receive your certificate are responsible for their own due diligence and lending or partnership decisions. <strong style={{ color: '#1A2A2A', fontWeight: 600 }}>Naiwa operates as assessment infrastructure — not as an intermediary, broker, or advisor.</strong></p>
            <Link
              href="/certification-scope"
              className="inline-flex items-center gap-2 mt-6 text-sm font-medium no-underline transition-colors hover:gap-3"
              style={{ color: '#2D6A6A' }}
            >
              View Full Certification Scope
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6 text-center relative overflow-hidden" style={{ background: '#2D6A6A' }}>
        <div className="absolute pointer-events-none" style={{ top: '-300px', left: '50%', transform: 'translateX(-50%)', width: '800px', height: '800px', background: 'radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 65%)' }} />
        <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.1] mb-4" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>Ready to Get Certified?</h2>
        <p className="reveal text-base leading-[1.65] max-w-[520px] mx-auto mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>Submit your documentation for an independent review. Certification results in a verifiable record of capital-readiness status.</p>
        <Link
          href="/register"
          className="reveal inline-flex items-center gap-2 px-9 py-3.5 text-[15px] font-semibold rounded-[10px] no-underline transition-all hover:translate-y-[-2px] hover:shadow-lg"
          style={{ color: '#2D6A6A', background: '#FFFFFF' }}
        >
          Start Certification
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="py-10 md:py-14 px-6 md:px-12" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex flex-col md:grid md:grid-cols-[140px_1fr] gap-6 items-start pb-7 md:pb-9 mb-6 md:mb-7" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <div className="w-[30px] h-[30px] rounded-[7px] flex items-center justify-center flex-shrink-0" style={{ background: '#2D6A6A' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <span className="font-semibold text-base" style={{ color: '#FFFFFF' }}>Naiwa</span>
            </Link>
            <div className="flex flex-col md:flex-row md:gap-12">
            <ul className="flex flex-wrap list-none m-0 p-0 pt-1" style={{ gap: '6px 16px' }}>
              <li><Link href="/about" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>About</Link></li>
              <li><Link href="/methodology" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Methodology</Link></li>
              <li><Link href="/framework" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Framework</Link></li>
              <li><Link href="/registry/verify" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Verify</Link></li>
              <li><Link href="/contact" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Contact</Link></li>
            </ul>
            <ul className="flex flex-wrap list-none m-0 p-0 pt-1" style={{ gap: '6px 16px' }}>
              <li><Link href="/certification-scope" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Scope</Link></li>
              <li><Link href="/certification-fees" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Fees</Link></li>
              <li><Link href="/terms" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Terms</Link></li>
              <li><Link href="/privacy" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Privacy</Link></li>
              <li><Link href="/legal-notice" className="text-[12px] md:text-[13px] no-underline transition-colors hover:text-white/80" style={{ color: 'rgba(255,255,255,0.45)' }}>Legal</Link></li>
            </ul>
          </div>
          </div>
          <div className="flex flex-col md:flex-row md:justify-between gap-4 md:items-end">
            <p className="text-[10px] md:text-[11px] leading-[1.7] max-w-[680px]" style={{ color: 'rgba(255,255,255,0.22)' }}>
              Naiwa certification is an independent, documentation-based assessment. It does not constitute regulatory approval, a guarantee of financing, or an endorsement by any government body or financial institution. Certification reflects status at the time of issuance only.
            </p>
            <p className="text-[10px] md:text-xs whitespace-nowrap" style={{ color: 'rgba(255,255,255,0.22)' }}>© 2026 Naiwa. All rights reserved.</p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .reveal {
          opacity: 0;
          transform: translateY(24px);
          transition: opacity 0.65s ease, transform 0.65s ease;
        }
        .reveal.visible {
          opacity: 1;
          transform: none;
        }
      `}</style>
    </div>
  );
}
