'use client';

import Link from 'next/link';

export default function MethodologyPage() {
  const processSteps = [
    { number: '01', title: 'Application Submission', description: 'Businesses submit required documentation in accordance with Naiwa\'s certification standards. The application workspace guides you through document requirements for each pillar.', duration: 'Day 1' },
    { number: '02', title: 'Document Review', description: 'Submitted materials are reviewed against internal assessment criteria. Each document is evaluated for completeness, authenticity, and alignment with pillar requirements.', duration: '5-10 Days' },
    { number: '03', title: 'Pillar Assessment', description: 'Each of the five pillars is assessed independently using deterministic scoring logic. Pillar states are computed based on sub-criterion ratings.', duration: '3-5 Days' },
    { number: '04', title: 'Certification Decision', description: 'Final certification status is derived from the combination of pillar states. The outcome is recorded in Naiwa\'s certification register.', duration: 'Day 15-20' },
  ];

  const autoFailTriggers = [
    { title: 'Fraudulent Documentation', desc: 'Submission of forged, falsified, or materially misleading documents results in immediate disqualification.' },
    { title: 'Active Legal Proceedings', desc: 'Enterprises with pending criminal charges or regulatory enforcement actions against principals are ineligible.' },
    { title: 'Material Misrepresentation', desc: 'Deliberate omission or misstatement of facts material to the assessment triggers automatic failure.' },
    { title: 'Regulatory Blacklisting', desc: 'Inclusion on government or regulatory blacklists disqualifies the enterprise from certification.' },
  ];

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* Hero Section */}
      <section className="pt-12 pb-16 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="max-w-[720px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12" style={{ background: '#D0E4E4' }} />
              <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#2D6A6A' }}>Assessment Methodology</span>
            </div>
            <h1
              className="text-[clamp(36px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Deterministic Certification Logic
            </h1>
            <p className="text-lg leading-[1.75]" style={{ color: '#5A7070' }}>
              Naiwa employs a state-machine approach to certification. Each pillar is assessed independently, with the final outcome derived from the combination of pillar states rather than aggregate scoring.
            </p>
          </div>
        </div>
      </section>

      {/* State Logic Section */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12" style={{ background: '#2D6A6A' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#3D8B8B' }}>Decision States</span>
          </div>

          <div className="max-w-[720px] mb-14">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
            >
              Three Possible Outcomes
            </h2>
            <p className="text-lg leading-[1.65]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Certification decisions are computed deterministically based on pillar states. The logic is transparent and reproducible.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            <div className="p-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-sm mb-6"
                style={{ background: 'rgba(16,185,129,0.15)', color: '#10B981' }}
              >
                PASS
              </div>
              <h3 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Certified</h3>
              <p className="text-sm leading-[1.7] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                All five pillars achieve PASS status. Enterprise receives full certification for the validity period.
              </p>
              <div className="text-xs font-mono px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                IF all_pillars == PASS → CERTIFIED
              </div>
            </div>
            <div className="p-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-sm mb-6"
                style={{ background: 'rgba(245,158,11,0.15)', color: '#F59E0B' }}
              >
                COND
              </div>
              <h3 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Conditional</h3>
              <p className="text-sm leading-[1.7] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                One or more pillars at CONDITIONAL status. Enterprise must address identified areas within the remediation period.
              </p>
              <div className="text-xs font-mono px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                IF any_pillar == CONDITIONAL → CONDITIONAL
              </div>
            </div>
            <div className="p-10 rounded-xl" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div
                className="w-14 h-14 rounded-lg flex items-center justify-center font-bold text-sm mb-6"
                style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444' }}
              >
                FAIL
              </div>
              <h3 className="font-semibold mb-3" style={{ color: '#FFFFFF' }}>Not Certified</h3>
              <p className="text-sm leading-[1.7] mb-6" style={{ color: 'rgba(255,255,255,0.5)' }}>
                Any pillar at FAIL status or auto-fail trigger activated. Certification is not granted. Reapplication may be possible after remediation.
              </p>
              <div className="text-xs font-mono px-3 py-2 rounded" style={{ background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                IF any_pillar == FAIL → NOT_CERTIFIED
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Auto-Fail Triggers */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#5A7070' }}>Automatic Disqualification</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">
            <div>
              <h2
                className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Auto-Fail Conditions
              </h2>
              <div className="space-y-5" style={{ color: '#5A7070' }}>
                <p className="text-[15px] leading-[1.8]">
                  Certain conditions result in automatic certification failure, regardless of pillar performance. These triggers represent fundamental compliance failures that cannot be remediated within the certification process.
                </p>
                <p className="text-[15px] leading-[1.8]">
                  Auto-fail conditions are evaluated before pillar assessment begins. If any trigger is activated, the application is declined without further review.
                </p>
              </div>
            </div>
            <div className="space-y-4">
              {autoFailTriggers.map((item, i) => (
                <div key={i} className="p-6 rounded-xl" style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}>
                  <div className="flex items-start gap-4">
                    <svg className="w-5 h-5 mt-0.5 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="#DC2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/>
                      <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                    <div>
                      <h3 className="font-semibold mb-2" style={{ color: '#111C1C' }}>{item.title}</h3>
                      <p className="text-sm leading-[1.65]" style={{ color: '#5A7070' }}>{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Process Steps */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#5A7070' }}>Assessment Process</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="max-w-[720px] mb-14">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Four-Phase Assessment Lifecycle
            </h2>
            <p className="text-lg leading-[1.65]" style={{ color: '#5A7070' }}>
              The certification process follows a structured sequence from application to decision.
            </p>
          </div>

          <div className="space-y-4">
            {processSteps.map((step, index) => (
              <div
                key={index}
                className="p-8 md:p-10 rounded-xl"
                style={{ background: '#FFFFFF', border: '1px solid #D0E4E4' }}
              >
                <div className="flex items-start gap-6">
                  <span
                    className="text-3xl font-bold"
                    style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#D0E4E4' }}
                  >
                    {step.number}
                  </span>
                  <div className="flex-1">
                    <div className="flex items-center gap-4 mb-3 flex-wrap">
                      <h3
                        className="text-xl font-semibold"
                        style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
                      >
                        {step.title}
                      </h3>
                      <span className="text-xs px-3 py-1 rounded-full flex items-center gap-1.5" style={{ background: '#E8F4F4', color: '#5A7070' }}>
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <circle cx="12" cy="12" r="10"/>
                          <polyline points="12 6 12 12 16 14"/>
                        </svg>
                        {step.duration}
                      </span>
                    </div>
                    <p className="text-[15px] leading-[1.75]" style={{ color: '#5A7070' }}>{step.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Evidence Standards */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#FFFFFF' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-6 mb-12">
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#5A7070' }}>Evidence Requirements</span>
            <div className="h-px flex-1" style={{ background: '#D0E4E4' }} />
          </div>

          <div className="max-w-[720px] mb-14">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-4"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
            >
              Documentation Standards
            </h2>
            <p className="text-lg leading-[1.65]" style={{ color: '#5A7070' }}>
              All submitted evidence must meet minimum standards for format, authenticity, and relevance.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="p-8 rounded-xl" style={{ border: '1px solid #D0E4E4' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6" style={{ background: '#E8F4F4' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="16" y1="13" x2="8" y2="13"/>
                  <line x1="16" y1="17" x2="8" y2="17"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-3" style={{ color: '#111C1C' }}>Accepted Formats</h3>
              <p className="text-sm mb-4 leading-[1.7]" style={{ color: '#5A7070' }}>
                Documents must be submitted in approved formats with appropriate resolution and legibility.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  PDF, PNG, JPG (max 10MB per file)
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Minimum 150 DPI for scanned documents
                </li>
              </ul>
            </div>
            <div className="p-8 rounded-xl" style={{ border: '1px solid #D0E4E4' }}>
              <div className="w-10 h-10 rounded-lg flex items-center justify-center mb-6" style={{ background: '#E8F4F4' }}>
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <h3 className="font-semibold mb-3" style={{ color: '#111C1C' }}>Chain of Custody</h3>
              <p className="text-sm mb-4 leading-[1.7]" style={{ color: '#5A7070' }}>
                All submissions are logged with timestamps and stored securely throughout the review process.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center gap-2 text-sm" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Immutable upload timestamps
                </li>
                <li className="flex items-center gap-2 text-sm" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                  Encrypted storage with access logging
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 md:px-12 text-center" style={{ background: '#2D6A6A' }}>
        <div className="max-w-[640px] mx-auto">
          <h2
            className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
          >
            Understand the Framework
          </h2>
          <p className="text-lg leading-[1.65] mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Review the five-pillar assessment framework to understand what evidence is required for each dimension.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/framework"
              className="px-8 py-3.5 text-[15px] font-medium rounded-lg no-underline transition-all hover:bg-white/10"
              style={{ color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              View Framework
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center justify-center gap-2 px-8 py-3.5 text-[15px] font-semibold rounded-lg no-underline transition-all hover:translate-y-[-2px]"
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
