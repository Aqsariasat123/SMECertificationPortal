'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

// Hero slider - images with unique content per slide
const heroSlides = [
  {
    image: '/hero/hero-4.png',  // Golden hour - UAE skyline
    headline: 'Certified. Structured. Capital-Ready.',
    subtext: "A bank decline doesn't always reflect business viability. It reflects documentation gaps. Naiwa bridges that gap through structured institutional assessment.",
  },
  {
    image: '/hero/hero-2.jpg',  // Black & white symmetry
    headline: 'Where Documentation Meets Institutional Standards.',
    subtext: 'We assess your business against the same structural criteria used by UAE banks, financial institutions, and capital providers.',
  },
  {
    image: '/hero/hero-3.jpg',  // Institution water/fountains
    headline: 'Structured for Institutional Review.',
    subtext: 'An independent SME certification platform designed to evaluate readiness, structure governance, and prepare businesses for institutional evaluation.',
  },
  {
    image: '/hero/hero-1.jpg',  // Staircase symmetry (Hero)
    headline: 'Built for the UAE Market. Backed by Independence.',
    subtext: 'Aligned with UAE regulatory frameworks. Free from commercial affiliations or external bias.',
  },
];

export default function LandingPage() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Auto-advance slider every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Navigation handlers
  const goToSlide = (index: number) => setCurrentSlide(index);
  const goToPrev = () => setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  const goToNext = () => setCurrentSlide((prev) => (prev + 1) % heroSlides.length);

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
            className="hidden sm:flex px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all no-underline hover:bg-[#3D8B8B] whitespace-nowrap"
            style={{ color: 'white', background: '#2D6A6A', border: 'none' }}
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

      {/* HERO WITH IMAGE SLIDER */}
      <section
        className="min-h-screen flex flex-col justify-center relative overflow-hidden"
        style={{ padding: '120px 24px 80px' }}
      >
        {/* Background Image Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className="absolute inset-0 transition-opacity duration-[1500ms] ease-in-out"
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
            {/* Dark Overlay - consistent 25% */}
            <div
              className="absolute inset-0"
              style={{
                background: 'linear-gradient(to right, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.25) 50%, rgba(0,0,0,0.20) 100%)',
              }}
            />
          </div>
        ))}

        {/* Content - Left aligned, changes per slide */}
        <div className="relative z-10 max-w-[1200px] mx-auto w-full px-6 md:px-12">
          <div className="max-w-[680px]">
            <p
              key={`label-${currentSlide}`}
              className="text-[12px] font-semibold tracking-[0.2em] uppercase mb-5"
              style={{ color: 'rgba(255,255,255,0.7)', animation: 'fadeUp 0.6s ease-out forwards', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              Naiwa — SME Certification Platform
            </p>
            <h1
              key={`headline-${currentSlide}`}
              className="text-[clamp(36px,5.5vw,64px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF', animation: 'fadeUp 0.6s 0.1s ease-out both', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              {heroSlides[currentSlide].headline}
            </h1>
            <p
              key={`subtext-${currentSlide}`}
              className="text-[clamp(16px,1.8vw,20px)] leading-[1.7] mb-8"
              style={{ color: 'rgba(255,255,255,0.85)', animation: 'fadeUp 0.6s 0.2s ease-out both', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              {heroSlides[currentSlide].subtext}
            </p>
            <div
              key={`cta-${currentSlide}`}
              style={{ animation: 'fadeUp 0.6s 0.3s ease-out both' }}
            >
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
        </div>

        {/* Navigation Arrows - Desktop: middle, Mobile: bottom sides */}
        <button
          onClick={goToPrev}
          className="absolute z-20 flex items-center justify-center transition-all hover:scale-110 left-3 md:left-8 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
          aria-label="Previous slide"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6"/>
          </svg>
        </button>
        <button
          onClick={goToNext}
          className="absolute z-20 flex items-center justify-center transition-all hover:scale-110 right-3 md:right-8 bottom-4 md:bottom-auto md:top-1/2 md:-translate-y-1/2 w-8 h-8 md:w-12 md:h-12 rounded-full"
          style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}
          aria-label="Next slide"
        >
          <svg className="w-4 h-4 md:w-5 md:h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6"/>
          </svg>
        </button>

        {/* Thumbnail Navigation */}
        <div className="absolute bottom-4 md:bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 md:gap-2">
          {heroSlides.map((slide, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className="transition-all duration-300 overflow-hidden"
              style={{
                width: currentSlide === index ? '48px' : '32px',
                height: currentSlide === index ? '32px' : '24px',
                borderRadius: '6px',
                border: currentSlide === index ? '2px solid white' : '1px solid rgba(255,255,255,0.3)',
                opacity: currentSlide === index ? 1 : 0.5,
                transform: currentSlide === index ? 'scale(1.1)' : 'scale(1)',
              }}
              aria-label={`Go to slide ${index + 1}`}
            >
              <div
                className="w-full h-full bg-cover bg-center"
                style={{ backgroundImage: `url(${slide.image})` }}
              />
            </button>
          ))}
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

      {/* STATISTICS STRIP */}
      <section className="py-16 px-6" style={{ background: '#FFFFFF', borderTop: '1px solid #D0E4E4', borderBottom: '1px solid #D0E4E4' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="reveal grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4">
            {[
              { value: '5', label: 'Assessment Pillars', desc: 'Structured evaluation dimensions' },
              { value: '100%', label: 'Independent', desc: 'No commercial affiliations' },
              { value: '12', label: 'Month Validity', desc: 'Certification cycle period' },
              { value: 'UAE', label: 'Market Aligned', desc: 'Local regulatory standards' },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <p className="text-[clamp(32px,4vw,48px)] font-bold leading-none mb-2" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#2D6A6A' }}>{stat.value}</p>
                <p className="text-[14px] font-semibold mb-1" style={{ color: '#111C1C' }}>{stat.label}</p>
                <p className="text-[12px]" style={{ color: '#5A7070' }}>{stat.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST INDICATORS */}
      <section className="py-20 px-6" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <p className="reveal text-[11px] font-semibold tracking-[0.16em] uppercase mb-4 text-center" style={{ color: '#3D8B8B' }}>Why Trust Naiwa</p>
          <h2 className="reveal text-[clamp(24px,3vw,32px)] font-bold leading-[1.2] tracking-[-0.01em] mb-12 text-center" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}>Built on Principles of Integrity</h2>

          <div className="reveal grid md:grid-cols-3 gap-6">
            {[
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  </svg>
                ),
                title: 'Independent Assessment',
                desc: 'No external funding, partnerships, or commercial relationships that could influence certification outcomes.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>
                  </svg>
                ),
                title: 'Point-in-Time Verification',
                desc: 'Certification reflects documented state at time of assessment. No forward-looking claims or guarantees.',
              },
              {
                icon: (
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                ),
                title: 'Evidence-Based Only',
                desc: 'Every assessment decision derived from submitted documentation. No assumptions or projections.',
              },
            ].map((item, i) => (
              <div key={i} className="p-8 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-5" style={{ background: 'rgba(61,139,139,0.15)' }}>
                  {item.icon}
                </div>
                <p className="text-[16px] font-semibold mb-3" style={{ color: '#FFFFFF' }}>{item.title}</p>
                <p className="text-[14px] leading-[1.7]" style={{ color: 'rgba(255,255,255,0.5)' }}>{item.desc}</p>
              </div>
            ))}
          </div>

          <div className="reveal mt-12 pt-10 flex flex-wrap justify-center gap-8 md:gap-12" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            {[
              'UAE Regulatory Aligned',
              'Immutable Audit Trail',
              'Public Verification Registry',
              'Deterministic Outcomes',
            ].map((badge, i) => (
              <div key={i} className="flex items-center gap-2">
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
                <span className="text-[13px] font-medium" style={{ color: 'rgba(255,255,255,0.7)' }}>{badge}</span>
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
