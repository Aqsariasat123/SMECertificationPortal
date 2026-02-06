'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

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
            className="text-2xl sm:text-3xl font-semibold mb-4"
            style={{ color: 'var(--graphite-900)' }}
          >
            Verify a Naywa Certification
          </h1>

          <p
            className="text-base mb-2"
            style={{ color: 'var(--graphite-600)' }}
          >
            Use this page to verify the validity and current status of a Naywa-issued certification.
          </p>

          <p
            className="text-sm mb-8"
            style={{ color: 'var(--graphite-500)' }}
          >
            Verification confirms whether a certificate is active, expired, or suspended based on Naywa&apos;s official registry records.
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-3 text-left">
              <label
                htmlFor="certificateId"
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--graphite-700)' }}
              >
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
                placeholder="Enter Certificate ID (e.g., SME-CERT-A1B2C3D4)"
                className="w-full px-4 py-3 rounded-lg font-mono text-sm"
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

            <p className="text-xs mb-4 text-left" style={{ color: 'var(--graphite-500)' }}>
              Verification is performed against Naywa&apos;s official certification registry.
            </p>

            <button
              type="submit"
              className="w-full btn-primary px-6 py-3 text-sm font-medium rounded-lg"
            >
              Verify Certificate
            </button>
          </form>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-8 px-4 mt-auto" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
            Naywa certification reflects an independent, documentation-based assessment conducted at a specific point in time. Verification confirms registry status only and does not constitute regulatory approval, legal advice, or endorsement.
          </p>
        </div>
      </section>
    </div>
  );
}
