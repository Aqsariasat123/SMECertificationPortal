'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function VerifyCertificateLandingPage() {
  const router = useRouter();
  const [certificateId, setCertificateId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = certificateId.trim().toUpperCase();

    // Basic validation
    if (!trimmedId) {
      setError('Please enter a certificate ID');
      return;
    }

    // Check format (SME-CERT-XXXXXXXX)
    if (!trimmedId.startsWith('SME-CERT-')) {
      setError('Invalid format. Certificate ID should start with SME-CERT-');
      return;
    }

    if (trimmedId.length !== 17) {
      setError('Invalid certificate ID length');
      return;
    }

    // Navigate to verification result page
    router.push(`/registry/verify/${trimmedId}`);
  };

  return (
    <div className="min-h-[calc(100vh-120px)] flex flex-col">
      {/* Hero Section */}
      <section className="py-16 px-4" style={{ background: 'var(--background)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--teal-100)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-semibold mb-3"
            style={{ color: 'var(--graphite-900)' }}
          >
            Verify a Naywa Certification
          </h1>

          <p
            className="text-base mb-8"
            style={{ color: 'var(--graphite-600)' }}
          >
            Enter a certificate ID to verify its authenticity and current status.
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-4">
              <label htmlFor="certificateId" className="sr-only">
                Certificate ID
              </label>
              <input
                type="text"
                id="certificateId"
                value={certificateId}
                onChange={(e) => {
                  setCertificateId(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="SME-CERT-XXXXXXXX"
                className="w-full px-4 py-3 rounded-lg text-center font-mono text-base"
                style={{
                  background: 'var(--white)',
                  border: error ? '2px solid var(--red-500)' : '1px solid var(--graphite-300)',
                  color: 'var(--graphite-900)',
                }}
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: 'var(--red-600)' }}>
                  {error}
                </p>
              )}
            </div>

            <button
              type="submit"
              className="w-full btn-primary px-6 py-3 text-sm font-medium rounded-lg inline-flex items-center justify-center gap-2"
            >
              Verify Certificate
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </form>

          {/* Help Text */}
          <p className="mt-6 text-sm" style={{ color: 'var(--graphite-500)' }}>
            The certificate ID can be found on the certificate document or QR code.
          </p>
        </div>
      </section>

      {/* Information Section */}
      <section className="py-12 px-4" style={{ background: 'var(--white)', borderTop: '1px solid var(--graphite-100)' }}>
        <div className="max-w-2xl mx-auto">
          <h2
            className="text-lg font-semibold mb-6 text-center"
            style={{ color: 'var(--graphite-900)' }}
          >
            Verification Status Guide
          </h2>

          <div className="grid sm:grid-cols-2 gap-4">
            {/* Active */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--green-50)', border: '1px solid var(--green-200)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--green-200)' }}
                >
                  <svg className="w-4 h-4" style={{ color: 'var(--green-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <span className="font-medium" style={{ color: 'var(--green-800)' }}>Active</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--green-700)' }}>
                Certificate is valid and in good standing.
              </p>
            </div>

            {/* Expired */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--amber-50)', border: '1px solid var(--amber-200)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--amber-200)' }}
                >
                  <svg className="w-4 h-4" style={{ color: 'var(--amber-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium" style={{ color: 'var(--amber-800)' }}>Expired</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--amber-700)' }}>
                Certificate validity period has ended.
              </p>
            </div>

            {/* Suspended */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--red-50)', border: '1px solid var(--red-200)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--red-200)' }}
                >
                  <svg className="w-4 h-4" style={{ color: 'var(--red-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                  </svg>
                </div>
                <span className="font-medium" style={{ color: 'var(--red-800)' }}>Revoked</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--red-700)' }}>
                Certificate has been revoked by the authority.
              </p>
            </div>

            {/* Not Found */}
            <div
              className="p-4 rounded-lg"
              style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)' }}
            >
              <div className="flex items-center gap-3 mb-2">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: 'var(--graphite-200)' }}
                >
                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-700)' }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <span className="font-medium" style={{ color: 'var(--graphite-800)' }}>Not Found</span>
              </div>
              <p className="text-sm" style={{ color: 'var(--graphite-700)' }}>
                No certificate exists with this ID.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-8 px-4 mt-auto" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
            This verification service is provided by Naywa Registry System. Verification results reflect the status of the certificate at the time of query. For questions regarding certification status, please contact{' '}
            <Link href="/contact" className="underline" style={{ color: 'var(--graphite-600)' }}>
              support
            </Link>.
          </p>
        </div>
      </section>
    </div>
  );
}
