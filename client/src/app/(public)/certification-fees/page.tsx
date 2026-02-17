'use client';

import Link from 'next/link';

export default function CertificationFeesPage() {
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
            Certification Fees and Services
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

            {/* Overview */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Overview
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA provides an independent, documentation-based certification service for small and medium enterprises. This page provides general information about certification fees for transparency purposes.
                </p>
              </div>
            </div>

            {/* Fee Determination */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Fee Determination
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Certification fees are determined administratively on a case-by-case basis. The applicable fee may vary depending on factors such as:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Scope of certification requested</li>
                  <li>Entity profile and business complexity</li>
                  <li>Nature of the assessment required</li>
                  <li>Volume of documentation to be reviewed</li>
                </ul>
                <p className="mt-4">
                  There is no standard published rate. Fees are communicated directly to the applicant following certification approval.
                </p>
              </div>
            </div>

            {/* Payment Process */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Payment Process
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  Payment is requested only after the certification application has been reviewed and a certification decision has been reached. No payment is required at the time of application submission.
                </p>
                <p>
                  Upon approval, the applicant will receive a payment request with the applicable fee amount and invoice details.
                </p>
              </div>
            </div>

            {/* VAT Information */}
            <div>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                VAT Information
              </h2>
              <div className="space-y-4 text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                <p>
                  NAIWA is currently not registered for VAT under UAE VAT Law. As such, VAT is not applicable to certification fees at this time.
                </p>
                <p>
                  VAT status is indicated on all invoices issued. Should VAT registration status change in the future, the applicable VAT at the applicable rate under UAE VAT Law will be applied and clearly reflected on invoices with a full breakdown.
                </p>
              </div>
            </div>

            {/* Disclaimer */}
            <div className="p-6 rounded-lg" style={{ background: '#F5F5F5', border: '1px solid #E5E5E5' }}>
              <p className="text-sm italic" style={{ color: '#5A7070' }}>
                This page is provided for informational purposes only and does not constitute a fee schedule, price list, or contractual offer. All fees are subject to administrative determination and may be updated without prior notice.
              </p>
              <p className="text-sm italic mt-3" style={{ color: '#5A7070' }}>
                Certification outcomes are based solely on information submitted by the applicant and do not constitute verification of underlying facts beyond the scope of the assessment.
              </p>
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
                <Link href="/certification-scope" className="flex items-center gap-3 p-4 rounded-lg transition-colors hover:bg-[#F5FAFA]" style={{ background: '#FAFAFA', border: '1px solid #E5E7EB' }}>
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                    <polyline points="14 2 14 8 20 8"/>
                  </svg>
                  <span className="text-sm" style={{ color: '#5A7070' }}>Limitation of Liability</span>
                </Link>
              </div>
            </div>

            {/* Contact */}
            <div className="pt-6" style={{ borderTop: '1px solid #E5E7EB' }}>
              <h2
                className="text-2xl font-bold mb-4"
                style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
              >
                Questions?
              </h2>
              <p className="text-[15px] leading-[1.8]" style={{ color: '#5A7070' }}>
                For questions regarding certification fees, please contact us at{' '}
                <a href="mailto:contact@naiwa.ae" className="font-medium no-underline hover:underline" style={{ color: '#2D6A6A' }}>
                  contact@naiwa.ae
                </a>
              </p>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
