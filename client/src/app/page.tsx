'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

// Hero slider images with their overlay opacities
const heroSlides = [
  { image: '/hero/hero-1.jpg', overlay: 0.15 },  // Staircase symmetry - 15%
  { image: '/hero/hero-2.jpg', overlay: 0.15 },  // Black & white symmetry - 15%
  { image: '/hero/hero-3.jpg', overlay: 0.12 },  // Institution water/fountains - 10-12%
  { image: '/hero/hero-4.png', overlay: 0.18 },  // UAE skyline golden hour - 18%
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-advance slider every 7 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

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
      {/* NAV */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-12 h-16"
        style={{ background: 'rgba(255,255,255,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #D0E4E4' }}
      >
        <Link href="/" className="flex items-center gap-2.5 no-underline">
          <div className="w-[42px] h-[42px] rounded-[10px] flex items-center justify-center" style={{ background: '#2D6A6A' }}>
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

        <ul className="hidden md:flex items-center gap-8 list-none m-0 p-0">
          <li><Link href="/about" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>About</Link></li>
          <li><Link href="/methodology" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Methodology</Link></li>
          <li><Link href="/framework" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Framework</Link></li>
          <li><Link href="/registry/verify" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Verify</Link></li>
          <li><Link href="/contact" className="text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>Contact</Link></li>
        </ul>

        <div className="flex items-center gap-2 md:gap-3">
          <Link
            href="/login"
            className="px-3 md:px-5 py-2 text-xs md:text-sm font-medium rounded-lg transition-all no-underline hover:bg-[#E8F4F4]"
            style={{ color: '#2D6A6A', border: '1.5px solid #2D6A6A', background: 'none' }}
          >
            Sign In
          </Link>
          <Link
            href="/register"
            className="px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all no-underline hover:bg-[#3D8B8B] whitespace-nowrap"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
          >
            Start Certification
          </Link>
        </div>
      </nav>

      {/* HERO WITH IMAGE SLIDER */}
      <section
        className="min-h-screen flex flex-col justify-center items-center text-center relative overflow-hidden"
        style={{ padding: '120px 24px 80px' }}
      >
        {/* Background Image Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-[2000ms] ease-in-out"
            style={{
              opacity: currentSlide === index ? 1 : 0,
              zIndex: 0,
            }}
          >
            {/* Background Image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-no-repeat"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            />
            {/* Dark Overlay */}
            <div
              className="absolute inset-0"
              style={{
                background: `rgba(0, 0, 0, ${slide.overlay})`,
              }}
            />
          </div>
        ))}

        {/* Content - Static, stays on top */}
        <div className="relative z-10">
          <p
            className="text-[13px] font-semibold tracking-[0.18em] uppercase mb-6"
            style={{ color: '#FFFFFF', opacity: 0, animation: 'fadeUp 0.7s 0.1s forwards', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            Naiwa — SME Certification Platform
          </p>
          <h1
            className="text-[clamp(48px,7vw,84px)] font-black leading-[1.05] tracking-[-0.02em] mb-7"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF', opacity: 0, animation: 'fadeUp 0.7s 0.2s forwards', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
          >
            Certified.<br/><em className="not-italic" style={{ color: '#7FBFBF' }}>Structured.</em><br/>Capital-Ready.
          </h1>
          <p
            className="text-[clamp(16px,2vw,20px)] leading-[1.65] max-w-[580px] mx-auto mb-3"
            style={{ color: 'rgba(255,255,255,0.9)', opacity: 0, animation: 'fadeUp 0.7s 0.3s forwards', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            A bank decline does not always reflect business viability. In many cases, it reflects documentation gaps between your records and institutional review standards.<br/>
            <strong style={{ color: '#FFFFFF', fontWeight: 600 }}>Naiwa bridges that gap with structured, evidence-based certification.</strong>
          </p>
          <p
            className="text-[clamp(16px,2vw,20px)] leading-[1.65] max-w-[580px] mx-auto"
            style={{ color: 'rgba(255,255,255,0.9)', opacity: 0, animation: 'fadeUp 0.7s 0.35s forwards', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            Naiwa assesses your business against criteria aligned with institutional review standards used by UAE banks, financial institutions, and capital providers — and issues a verifiable certification that speaks their language.
          </p>
          <p
            className="text-[13px] mt-7"
            style={{ color: 'rgba(255,255,255,0.75)', opacity: 0, animation: 'fadeUp 0.7s 0.4s forwards', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
          >
            For UAE businesses preparing for bank, investor, or institutional review.
          </p>
          <div className="flex gap-3.5 justify-center flex-wrap mt-9" style={{ opacity: 0, animation: 'fadeUp 0.7s 0.45s forwards' }}>
            <Link
              href="/register"
              className="inline-flex items-center gap-2 px-8 py-3.5 text-[15px] font-semibold rounded-[10px] no-underline transition-all hover:translate-y-[-2px]"
              style={{ color: '#2D6A6A', background: '#FFFFFF', boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
            >
              Start Certification
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
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

      {/* ABOUT NAIWA - Summary */}
      <section className="py-24 px-6" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#2D6A6A' }}>About Naiwa</p>
              <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>Independent SME Certification for the UAE Market</h2>
              <p className="reveal text-base leading-[1.75] mb-5" style={{ color: '#5A7070' }}>
                Naiwa provides structured, documentation-based assessment services for small and medium enterprises operating within the United Arab Emirates. We operate independently from commercial entities, ensuring our assessments remain free from external influence or bias.
              </p>
              <p className="reveal text-base leading-[1.75] mb-6" style={{ color: '#5A7070' }}>
                Our certification is designed to serve as a baseline indicator of operational integrity, financial discipline, and governance adherence for enterprises seeking to demonstrate their readiness for institutional engagement.
              </p>
              <Link
                href="/about"
                className="reveal inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:gap-3"
                style={{ color: '#2D6A6A' }}
              >
                Learn More
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
              </Link>
            </div>
            <div className="reveal grid grid-cols-2 gap-4">
              {[
                { title: 'Independence', desc: 'Assessment without commercial affiliations or external pressures' },
                { title: 'Transparency', desc: 'Clear criteria and deterministic outcomes' },
                { title: 'Consistency', desc: 'Standardized evaluation applied uniformly' },
                { title: 'Integrity', desc: 'Immutable audit trails and verification' },
              ].map((item, i) => (
                <div key={i} className="p-6 rounded-xl" style={{ background: '#F5FAFA', border: '1px solid #D0E4E4' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: '#E8F4F4' }}>
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                      <polyline points="22 4 12 14.01 9 11.01"/>
                    </svg>
                  </div>
                  <p className="text-[13px] font-semibold mb-1" style={{ color: '#111C1C' }}>{item.title}</p>
                  <p className="text-xs leading-[1.5]" style={{ color: '#5A7070' }}>{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* METHODOLOGY - Summary */}
      <section id="methodology" className="py-24 px-6" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4" style={{ color: '#3D8B8B' }}>Assessment Methodology</p>
          <h2 className="reveal text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] tracking-[-0.01em] mb-5" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>How the Certification Works</h2>
          <p className="reveal text-base leading-[1.75] max-w-[640px] mb-12" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Naiwa employs a deterministic, state-driven approach to certification. Each application follows a structured lifecycle from submission to decision.
          </p>

          {/* Process Steps */}
          <div className="grid md:grid-cols-3 gap-0 relative mb-14">
            <div className="hidden md:block absolute h-[1px] top-7" style={{ left: 'calc(16.66% + 20px)', right: 'calc(16.66% + 20px)', background: 'linear-gradient(90deg, #2D6A6A 0%, #3D8B8B 50%, #2D6A6A 100%)' }} />
            {[
              { num: '1', title: 'Application Submission', body: "Submit required documentation in accordance with Naiwa's certification standards." },
              { num: '2', title: 'Document Review', body: 'Materials are reviewed against internal assessment criteria across five pillars.' },
              { num: '3', title: 'Certification Decision', body: "Status is issued, deferred, or declined and recorded in the certification register." },
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

          {/* Key Principles */}
          <div className="reveal grid md:grid-cols-3 gap-5 pt-10" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              { title: 'Independent Review', desc: 'Assessment against fixed internal criteria with no external influence.' },
              { title: 'Point-in-Time Verification', desc: 'Certification reflects documented state at time of submission.' },
              { title: 'Evidence-Based Assessment', desc: 'Every score derived from submitted documentation.' },
            ].map((p, i) => (
              <div key={i} className="p-6 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-[14px] font-semibold mb-2" style={{ color: '#FFFFFF' }}>{p.title}</p>
                <p className="text-[13px] leading-[1.6]" style={{ color: 'rgba(255,255,255,0.45)' }}>{p.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal text-center mt-10">
            <Link
              href="/methodology"
              className="inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:gap-3"
              style={{ color: '#3D8B8B' }}
            >
              View Methodology
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
          </div>
        </div>
      </section>

      {/* FRAMEWORK */}
      <section id="framework" className="py-24 px-6" style={{ background: '#F5FAFA' }}>
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
            Explore Framework
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
          </Link>
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

      <PublicFooter />

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
