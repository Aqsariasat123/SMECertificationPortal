'use client';

import Link from 'next/link';
import PublicFooter from '@/components/PublicFooter';

export default function CertificationScopePage() {
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
            <span className="font-semibold text-lg leading-none" style={{ color: '#111C1C' }}>Naiwa</span>
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

      {/* Breadcrumb & Header */}
      <section className="pt-24 pb-8 px-6 md:px-12" style={{ background: '#F5FAFA', borderBottom: '1px solid #D0E4E4' }}>
        <div className="max-w-[900px] mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8" aria-label="Breadcrumb">
            <Link href="/" className="no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>
              Naiwa Platform
            </Link>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#5A7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <Link href="/framework" className="no-underline transition-colors hover:text-[#2D6A6A]" style={{ color: '#5A7070' }}>
              Framework
            </Link>
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#5A7070" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
            <span style={{ color: '#2D6A6A', fontWeight: 500 }}>Certification Scope</span>
          </nav>

          {/* Document Header */}
          <div className="flex items-start justify-between gap-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: '#2D6A6A' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                    <line x1="16" y1="13" x2="8" y2="13"/>
                    <line x1="16" y1="17" x2="8" y2="17"/>
                  </svg>
                </div>
                <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#2D6A6A' }}>Official Document</span>
              </div>
              <h1
                className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] tracking-[-0.02em] mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Certification Scope
              </h1>
              <p className="text-base leading-[1.7]" style={{ color: '#5A7070' }}>
                This document defines the scope, applicability, and boundaries of the Naiwa SME Certification Program.
              </p>
            </div>
            <div className="hidden md:block text-right flex-shrink-0">
              <p className="text-xs mb-1" style={{ color: '#5A7070' }}>Document Version</p>
              <p className="text-sm font-semibold" style={{ color: '#111C1C' }}>v1.0</p>
              <p className="text-xs mt-3 mb-1" style={{ color: '#5A7070' }}>Effective Date</p>
              <p className="text-sm font-semibold" style={{ color: '#111C1C' }}>February 2026</p>
            </div>
          </div>
        </div>
      </section>

      {/* Document Content */}
      <section className="py-12 md:py-16 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[900px] mx-auto">
          {/* Table of Contents */}
          <div className="mb-12 p-6 rounded-xl" style={{ background: '#F5FAFA', border: '1px solid #D0E4E4' }}>
            <h2 className="text-sm font-semibold mb-4" style={{ color: '#111C1C' }}>Contents</h2>
            <ol className="list-none m-0 p-0 space-y-2">
              {[
                'Purpose and Objective',
                'Eligible Entities',
                'Geographic Scope',
                'Assessment Dimensions',
                'Exclusions and Limitations',
                'Certification Validity',
                'Amendment and Updates'
              ].map((item, index) => (
                <li key={index}>
                  <a
                    href={`#section-${index + 1}`}
                    className="flex items-center gap-3 text-sm no-underline transition-colors hover:text-[#2D6A6A]"
                    style={{ color: '#5A7070' }}
                  >
                    <span className="font-mono text-xs" style={{ color: '#2D6A6A' }}>{String(index + 1).padStart(2, '0')}</span>
                    {item}
                  </a>
                </li>
              ))}
            </ol>
          </div>

          {/* Section 1 */}
          <div id="section-1" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>01</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Purpose and Objective
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>1.1</strong> The Naiwa SME Certification Program provides an independent, documentation-based assessment of small and medium enterprises operating within the United Arab Emirates.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>1.2</strong> The certification evaluates operational readiness across five standardized pillars: Legal & Ownership Readiness, Financial Discipline, Business Model & Unit Economics, Governance Controls & Risk, and Data Integrity & Auditability.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>1.3</strong> The objective is to establish a consistent, verifiable standard that enables enterprises to demonstrate their operational maturity to financial institutions, government entities, and commercial partners.
              </p>
            </div>
          </div>

          {/* Section 2 */}
          <div id="section-2" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>02</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Eligible Entities
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>2.1</strong> Certification is available to enterprises that meet the following criteria:
              </p>
              <ul className="space-y-3 ml-8">
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#2D6A6A' }} />
                  Registered as a legal entity within the United Arab Emirates
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#2D6A6A' }} />
                  Hold a valid trade license issued by a recognized UAE authority
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#2D6A6A' }} />
                  Operational for a minimum of twelve (12) months
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#2D6A6A' }} />
                  Classified as a Small or Medium Enterprise under UAE Ministry of Economy definitions
                </li>
              </ul>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>2.2</strong> Free zone and mainland entities are both eligible, subject to providing documentation appropriate to their licensing jurisdiction.
              </p>
            </div>
          </div>

          {/* Section 3 */}
          <div id="section-3" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>03</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Geographic Scope
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>3.1</strong> The certification program currently operates within the United Arab Emirates, covering all seven emirates: Abu Dhabi, Dubai, Sharjah, Ajman, Umm Al Quwain, Ras Al Khaimah, and Fujairah.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>3.2</strong> Enterprises operating across multiple emirates may apply for certification based on their primary place of registration.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>3.3</strong> Expansion to additional Gulf Cooperation Council (GCC) jurisdictions is under consideration and will be announced separately.
              </p>
            </div>
          </div>

          {/* Section 4 */}
          <div id="section-4" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>04</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Assessment Dimensions
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>4.1</strong> Assessment is conducted across five standardized pillars, each carrying equal weight in the final certification determination:
              </p>
              <div className="space-y-4 mt-6">
                {[
                  { pillar: 'Pillar 1', title: 'Legal & Ownership Readiness', desc: 'Verification of corporate structure, licensing, and ownership documentation aligned with UAE commercial regulations.' },
                  { pillar: 'Pillar 2', title: 'Financial Discipline', desc: 'Assessment of financial record-keeping, audit trails, and compliance with accepted accounting standards.' },
                  { pillar: 'Pillar 3', title: 'Business Model & Unit Economics', desc: 'Evaluation of operational sustainability, revenue models, and economic viability indicators.' },
                  { pillar: 'Pillar 4', title: 'Governance, Controls & Risk', desc: 'Review of internal controls, risk management frameworks, and corporate governance practices.' },
                  { pillar: 'Pillar 5', title: 'Data Integrity & Auditability', desc: 'Verification of data management practices, system controls, and audit readiness.' }
                ].map((item, index) => (
                  <div key={index} className="p-5 rounded-lg" style={{ background: '#F5FAFA', border: '1px solid #E8F4F4' }}>
                    <div className="flex items-start gap-4">
                      <span className="text-sm font-semibold whitespace-nowrap" style={{ color: '#2D6A6A' }}>{item.pillar}</span>
                      <div>
                        <h4 className="font-semibold mb-1" style={{ color: '#111C1C' }}>{item.title}</h4>
                        <p className="text-sm" style={{ color: '#5A7070' }}>{item.desc}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-[15px] leading-[1.8] mt-6" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>4.2</strong> Detailed assessment criteria for each pillar are published in the <Link href="/framework" className="no-underline font-medium" style={{ color: '#2D6A6A' }}>Framework Documentation</Link>.
              </p>
            </div>
          </div>

          {/* Section 5 */}
          <div id="section-5" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>05</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Exclusions and Limitations
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>5.1</strong> The following are explicitly outside the scope of Naiwa certification:
              </p>
              <ul className="space-y-3 ml-8">
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#DC2626' }} />
                  Government or regulatory approval of any kind
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#DC2626' }} />
                  Guarantee of financing, investment, or commercial success
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#DC2626' }} />
                  Endorsement by any government body or financial institution
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#DC2626' }} />
                  Validation of product quality, service delivery, or customer satisfaction
                </li>
                <li className="flex items-start gap-3 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                  <span className="w-1.5 h-1.5 rounded-full mt-2.5 flex-shrink-0" style={{ background: '#DC2626' }} />
                  Industry-specific regulatory compliance (healthcare, finance, etc.)
                </li>
              </ul>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>5.2</strong> Certification reflects operational status at the time of assessment only and does not constitute ongoing monitoring or surveillance.
              </p>
            </div>
          </div>

          {/* Section 6 */}
          <div id="section-6" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>06</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Certification Validity
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>6.1</strong> Upon successful completion of assessment, certification is valid for twelve (12) months from the date of issuance.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>6.2</strong> Certified enterprises may apply for renewal within ninety (90) days prior to expiration.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>6.3</strong> Certification may be revoked prior to expiration if material misrepresentation is discovered or if the enterprise undergoes significant structural changes that affect pillar compliance.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>6.4</strong> All active certifications are verifiable through the <Link href="/registry/verify" className="no-underline font-medium" style={{ color: '#2D6A6A' }}>Public Verification Registry</Link>.
              </p>
            </div>
          </div>

          {/* Section 7 */}
          <div id="section-7" className="mb-12 scroll-mt-24">
            <div className="flex items-center gap-4 mb-6">
              <span className="font-mono text-sm font-semibold px-3 py-1 rounded" style={{ background: '#E8F4F4', color: '#2D6A6A' }}>07</span>
              <h2 className="text-xl font-bold" style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}>
                Amendment and Updates
              </h2>
            </div>
            <div className="md:ml-16 space-y-4">
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>7.1</strong> This Certification Scope document may be amended from time to time to reflect changes in regulatory requirements, market conditions, or operational enhancements.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>7.2</strong> Material amendments will be communicated to certified enterprises and applicants with reasonable advance notice.
              </p>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <strong style={{ color: '#111C1C' }}>7.3</strong> The current version of this document supersedes all previous versions.
              </p>
            </div>
          </div>

          {/* Document Footer */}
          <div className="mt-16 pt-8" style={{ borderTop: '1px solid #D0E4E4' }}>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <p className="text-xs" style={{ color: '#5A7070' }}>
                For questions regarding certification scope, contact <Link href="/contact" className="no-underline font-medium" style={{ color: '#2D6A6A' }}>our team</Link>.
              </p>
              <div className="flex items-center gap-6">
                <Link
                  href="/framework"
                  className="flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]"
                  style={{ color: '#5A7070' }}
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M19 12H5M12 19l-7-7 7-7"/>
                  </svg>
                  Back to Framework
                </Link>
                <Link
                  href="/certification-fees"
                  className="flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:text-[#2D6A6A]"
                  style={{ color: '#5A7070' }}
                >
                  Certification Fees
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PublicFooter />
    </div>
  );
}
