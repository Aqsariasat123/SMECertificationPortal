export default function CertificationFeesPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-2xl font-bold mb-2" style={{ color: 'var(--graphite-900)' }}>
        Certification Fees and Services
      </h1>
      <p className="text-xs mb-8" style={{ color: 'var(--graphite-400)' }}>
        Reference Information
      </p>

      <div className="space-y-8" style={{ color: 'var(--graphite-700)' }}>
        {/* Overview */}
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--graphite-900)' }}>
            Overview
          </h2>
          <p className="text-sm leading-relaxed mb-3">
            Naywa provides an independent, documentation-based certification service for small and medium enterprises.
            This page provides general information about certification fees for transparency purposes.
          </p>
        </section>

        {/* Fee Determination */}
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--graphite-900)' }}>
            Fee Determination
          </h2>
          <p className="text-sm leading-relaxed mb-3">
            Certification fees are determined administratively on a case-by-case basis. The applicable fee may vary
            depending on factors such as the scope of certification, entity profile, and nature of the assessment required.
          </p>
          <p className="text-sm leading-relaxed">
            There is no standard published rate. Fees are communicated directly to the applicant following certification approval.
          </p>
        </section>

        {/* Payment Process */}
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--graphite-900)' }}>
            Payment Process
          </h2>
          <p className="text-sm leading-relaxed mb-3">
            Payment is requested only after the certification application has been reviewed and approved.
            No payment is required at the time of application submission.
          </p>
          <p className="text-sm leading-relaxed">
            Upon approval, the applicant will receive a payment request with the applicable fee amount and invoice details.
          </p>
        </section>

        {/* VAT Information */}
        <section>
          <h2 className="text-lg font-semibold mb-3" style={{ color: 'var(--graphite-900)' }}>
            VAT Information
          </h2>
          <p className="text-sm leading-relaxed mb-3">
            Naywa is currently not registered for VAT under UAE VAT Law. As such, VAT is not applicable to certification fees at this time.
          </p>
          <p className="text-sm leading-relaxed">
            VAT status is indicated on all invoices issued. Should VAT registration status change in the future,
            the applicable VAT rate (currently 5% under UAE VAT Law) will be applied and clearly reflected on invoices with a full breakdown.
          </p>
        </section>

        {/* Disclaimer */}
        <section className="pt-6" style={{ borderTop: '1px solid var(--graphite-200)' }}>
          <p className="text-xs" style={{ color: 'var(--graphite-400)' }}>
            This page is provided for informational purposes only and does not constitute a fee schedule,
            price list, or contractual offer. All fees are subject to administrative determination and may
            be updated without prior notice.
          </p>
        </section>
      </div>
    </div>
  );
}
