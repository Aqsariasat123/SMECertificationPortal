'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function FrameworkPage() {
  const [expandedPillar, setExpandedPillar] = useState<number | null>(null);

  const pillars = [
    {
      number: '01',
      title: 'Legal & Ownership Readiness',
      summary: 'Verification of corporate structure, licensing, and ownership documentation aligned with UAE commercial regulations.',
      description: 'This pillar assesses the legal foundation of the enterprise, ensuring proper registration, licensing, and ownership structure are in place and compliant with UAE regulations.',
      criteria: [
        'Valid UAE trade license with appropriate activity codes',
        'Current commercial registration certificate',
        'Clear ownership structure documentation',
        'Memorandum of Association (MOA) or partnership agreement',
        'Evidence of regulatory filings and renewals',
        'Identification documents for all beneficial owners'
      ],
      evidenceExamples: [
        'Trade License (current year)',
        'Certificate of Incorporation',
        'Shareholder register or partnership agreement',
        'Emirates ID copies of owners/directors',
        'Power of Attorney documents (if applicable)'
      ]
    },
    {
      number: '02',
      title: 'Financial Discipline',
      summary: 'Assessment of financial record-keeping, audit trails, and compliance with accepted accounting standards.',
      description: 'This pillar evaluates the enterprise\'s financial management practices, including record-keeping quality, accounting compliance, and the presence of appropriate financial controls.',
      criteria: [
        'Maintained financial records for minimum 12 months',
        'Adherence to recognized accounting standards',
        'Evidence of regular financial reconciliation',
        'Bank account documentation and statements',
        'Tax compliance evidence (VAT registration if applicable)',
        'Clear separation of business and personal finances'
      ],
      evidenceExamples: [
        'Audited or reviewed financial statements',
        'Bank statements (12 months)',
        'VAT registration certificate and returns',
        'Accounting software records or ledgers',
        'Tax payment receipts'
      ]
    },
    {
      number: '03',
      title: 'Business Model & Unit Economics',
      summary: 'Evaluation of operational sustainability, revenue models, and economic viability indicators.',
      description: 'This pillar examines the fundamental business operations, assessing whether the enterprise demonstrates a viable and sustainable business model with clear revenue generation.',
      criteria: [
        'Documented business model and value proposition',
        'Evidence of revenue generation activities',
        'Clear pricing structure and cost management',
        'Operational capacity to deliver services/products',
        'Customer or client relationships demonstrated',
        'Market presence and business activity indicators'
      ],
      evidenceExamples: [
        'Business plan or model documentation',
        'Revenue reports or sales records',
        'Customer contracts or agreements',
        'Pricing schedules or rate cards',
        'Operational process documentation'
      ]
    },
    {
      number: '04',
      title: 'Governance, Controls & Risk',
      summary: 'Review of internal controls, risk management frameworks, and corporate governance practices.',
      description: 'This pillar assesses the governance framework of the enterprise, including decision-making structures, internal controls, and risk management practices appropriate to the business scale.',
      criteria: [
        'Defined organizational structure and roles',
        'Basic internal control procedures',
        'Risk awareness and management practices',
        'Decision-making authority documentation',
        'Compliance awareness and procedures',
        'Business continuity considerations'
      ],
      evidenceExamples: [
        'Organizational chart',
        'Board or management meeting minutes',
        'Internal policies and procedures manual',
        'Risk register or assessment documentation',
        'Insurance certificates (if applicable)'
      ]
    },
    {
      number: '05',
      title: 'Data Integrity & Auditability',
      summary: 'Verification of data management practices, system controls, and audit readiness.',
      description: 'This pillar evaluates how the enterprise manages information, maintains records, and ensures data integrity across its operations.',
      criteria: [
        'Systematic record-keeping practices',
        'Data backup and retention procedures',
        'Document organization and accessibility',
        'Information security awareness',
        'Audit trail maintenance for key processes',
        'Ability to produce records upon request'
      ],
      evidenceExamples: [
        'Document management procedures',
        'Data backup evidence or policy',
        'Record retention schedule',
        'IT system documentation (if applicable)',
        'Historical records demonstrating organization'
      ]
    }
  ];

  const togglePillar = (index: number) => {
    setExpandedPillar(expandedPillar === index ? null : index);
  };

  return (
    <div style={{ fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif', color: '#1A2A2A', background: '#FFFFFF' }}>
      {/* Hero Section with Background Image */}
      <section className="relative min-h-[70vh] md:min-h-[80vh] flex items-center overflow-hidden">
        {/* Background Image - Evening Architectural Steps */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/hero/framework-hero.jpg)',
            backgroundPosition: 'center center',
          }}
        />
        {/* Dark Gradient Overlay - 75% on left for text readability */}
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.70) 40%, rgba(0,0,0,0.50) 100%)' }}
        />

        {/* Content - Left Aligned */}
        <div className="relative z-10 max-w-[1040px] mx-auto px-6 md:px-12 w-full">
          <div className="max-w-[640px]">
            <div className="flex items-center gap-4 mb-6">
              <div className="h-px w-12" style={{ background: 'rgba(255,255,255,0.3)' }} />
              <span className="text-[11px] font-semibold tracking-[0.2em] uppercase" style={{ color: 'rgba(255,255,255,0.7)' }}>Assessment Framework</span>
            </div>
            <h1
              className="text-[clamp(32px,5vw,56px)] font-bold leading-[1.1] tracking-[-0.02em] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF', textShadow: '0 2px 4px rgba(0,0,0,0.3)' }}
            >
              The Five Pillars of Certification
            </h1>
            <p
              className="text-[clamp(16px,1.8vw,20px)] leading-[1.75]"
              style={{ color: 'rgba(255,255,255,0.8)', textShadow: '0 1px 2px rgba(0,0,0,0.3)' }}
            >
              Each pillar represents a critical dimension of enterprise readiness. Assessment is conducted through document review, evidence verification, and structured evaluation against published criteria.
            </p>
          </div>
        </div>
      </section>

      {/* Pillars Section */}
      <section className="py-16 px-6 md:px-12" style={{ background: '#F5FAFA' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="space-y-4">
            {pillars.map((pillar, index) => {
              const isExpanded = expandedPillar === index;

              return (
                <div
                  key={pillar.number}
                  className="rounded-xl overflow-hidden"
                  style={{ background: '#FFFFFF', border: '1px solid #D0E4E4' }}
                >
                  {/* Pillar Header - Always Visible */}
                  <button
                    onClick={() => togglePillar(index)}
                    className="w-full p-8 md:p-10 text-left transition-colors hover:bg-[#FAFCFC]"
                  >
                    <div className="flex items-start gap-6">
                      <div className="flex items-center gap-4">
                        <span
                          className="text-3xl font-bold"
                          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#D0E4E4' }}
                        >
                          {pillar.number}
                        </span>
                        <div className="w-12 h-12 rounded-lg flex items-center justify-center" style={{ background: '#E8F4F4' }}>
                          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                            <polyline points="22 4 12 14.01 9 11.01"/>
                          </svg>
                        </div>
                      </div>
                      <div className="flex-1">
                        <h3
                          className="text-xl md:text-2xl font-semibold mb-3"
                          style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
                        >
                          {pillar.title}
                        </h3>
                        <p className="text-[15px] leading-[1.7]" style={{ color: '#5A7070' }}>{pillar.summary}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <svg
                          className={`w-6 h-6 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="#5A7070"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="px-8 md:px-10 pb-10 pt-4" style={{ borderTop: '1px solid #E8F4F4', background: '#FAFCFC' }}>
                      <div className="md:ml-[88px]">
                        <p className="text-[15px] leading-[1.8] mb-10" style={{ color: '#5A7070' }}>
                          {pillar.description}
                        </p>

                        <div className="grid md:grid-cols-2 gap-10">
                          {/* Assessment Criteria */}
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111C1C' }}>
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12"/>
                              </svg>
                              Assessment Criteria
                            </h4>
                            <ul className="space-y-3">
                              {pillar.criteria.map((criterion, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5A7070' }}>
                                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#5A7070' }} />
                                  <span>{criterion}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          {/* Example Documents */}
                          <div>
                            <h4 className="font-semibold mb-4 flex items-center gap-2" style={{ color: '#111C1C' }}>
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                                <polyline points="14 2 14 8 20 8"/>
                              </svg>
                              Example Documents
                            </h4>
                            <ul className="space-y-3">
                              {pillar.evidenceExamples.map((example, i) => (
                                <li key={i} className="flex items-start gap-3 text-sm" style={{ color: '#5A7070' }}>
                                  <span className="w-1.5 h-1.5 rounded-full mt-2 flex-shrink-0" style={{ background: '#2D6A6A' }} />
                                  <span>{example}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        {/* State Outcomes */}
                        <div className="mt-10 pt-8" style={{ borderTop: '1px solid #D0E4E4' }}>
                          <h4 className="font-semibold mb-4" style={{ color: '#111C1C' }}>Possible Pillar States</h4>
                          <div className="flex flex-wrap gap-3">
                            <span className="px-4 py-2 text-sm font-medium rounded" style={{ background: '#ECFDF5', color: '#059669', border: '1px solid #A7F3D0' }}>
                              PASS — Requirements fully met
                            </span>
                            <span className="px-4 py-2 text-sm font-medium rounded" style={{ background: '#FFFBEB', color: '#D97706', border: '1px solid #FDE68A' }}>
                              CONDITIONAL — Additional evidence needed
                            </span>
                            <span className="px-4 py-2 text-sm font-medium rounded" style={{ background: '#FEF2F2', color: '#DC2626', border: '1px solid #FECACA' }}>
                              FAIL — Requirements not met
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Summary Grid */}
      <section className="py-20 px-6 md:px-12" style={{ background: '#111C1C' }}>
        <div className="max-w-[1040px] mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <div className="h-px w-12" style={{ background: '#2D6A6A' }} />
            <span className="text-[11px] font-semibold tracking-[0.16em] uppercase" style={{ color: '#3D8B8B' }}>Framework Summary</span>
          </div>

          <div className="max-w-[720px] mb-14">
            <h2
              className="text-[clamp(28px,3.5vw,38px)] font-bold leading-[1.15] mb-6"
              style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#FFFFFF' }}
            >
              Holistic Enterprise Assessment
            </h2>
            <p className="text-lg leading-[1.65]" style={{ color: 'rgba(255,255,255,0.5)' }}>
              The five pillars work together to provide a comprehensive view of enterprise readiness. Success requires demonstrating competence across all dimensions.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {pillars.map((pillar, index) => (
              <div
                key={index}
                className="p-6 text-center rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}
              >
                <div className="w-10 h-10 rounded-lg flex items-center justify-center mx-auto mb-4" style={{ background: 'rgba(61,139,139,0.2)' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#3D8B8B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                    <polyline points="22 4 12 14.01 9 11.01"/>
                  </svg>
                </div>
                <span className="font-mono text-sm block mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>P{index + 1}</span>
                <h3 className="text-sm font-medium leading-tight" style={{ color: '#FFFFFF' }}>
                  {pillar.title.split(' ').slice(0, 2).join(' ')}
                </h3>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/certification-scope"
              className="inline-flex items-center gap-2 text-sm font-medium no-underline transition-colors hover:gap-3"
              style={{ color: '#3D8B8B' }}
            >
              View Full Certification Scope
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </Link>
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
            Ready to Begin Assessment?
          </h2>
          <p className="text-lg leading-[1.65] mb-10" style={{ color: 'rgba(255,255,255,0.7)' }}>
            Start your certification journey by registering for an account. Our guided application process will help you submit evidence for each pillar.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="px-8 py-3.5 text-[15px] font-medium rounded-lg no-underline transition-all hover:bg-white/10"
              style={{ color: '#FFFFFF', border: '1.5px solid rgba(255,255,255,0.3)' }}
            >
              Contact Us
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
