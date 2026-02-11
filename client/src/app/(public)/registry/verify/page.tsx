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
      <section className="py-16 px-4" style={{ background: '#FFFFFF' }}>
        <div className="max-w-2xl mx-auto text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: '#E8F4F4' }}
          >
            <svg className="w-8 h-8" style={{ color: '#2D6A6A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>

          <h1
            className="text-2xl sm:text-3xl font-semibold mb-4"
            style={{ color: '#111C1C' }}
          >
            Verify a Naywa Certification
          </h1>

          <p
            className="text-base mb-2"
            style={{ color: '#5A7070' }}
          >
            Use this page to verify the validity and current status of a Naywa-issued certification.
          </p>

          <p
            className="text-sm mb-8"
            style={{ color: '#5A7070' }}
          >
            Verification confirms whether a certificate is active, expired, or suspended based on Naywa&apos;s official registry records.
          </p>

          {/* Input Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="mb-3 text-left">
              <label
                htmlFor="certificateId"
                className="block text-sm font-medium mb-1.5"
                style={{ color: '#1A2A2A' }}
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
                  background: '#FFFFFF',
                  border: error ? '2px solid #DC2626' : '1px solid #D0E4E4',
                  color: '#111C1C',
                }}
                autoComplete="off"
                spellCheck={false}
              />
              {error && (
                <p className="mt-2 text-sm" style={{ color: '#DC2626' }}>
                  {error}
                </p>
              )}
            </div>

            <p className="text-xs mb-4 text-left" style={{ color: '#5A7070' }}>
              Verification is performed against Naywa&apos;s official certification registry.
            </p>

            <button
              type="submit"
              className="w-full px-6 py-3 text-sm font-semibold rounded-lg transition-all"
              style={{ background: '#2D6A6A', color: 'white' }}
            >
              Verify Certificate
            </button>
          </form>
        </div>
      </section>

      {/* Footer Disclaimer */}
      <section className="py-8 px-4 mt-auto" style={{ background: '#F5FAFA', borderTop: '1px solid #D0E4E4' }}>
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-xs" style={{ color: '#5A7070' }}>
            Naywa certification reflects an independent, documentation-based assessment conducted at a specific point in time. Verification confirms registry status only and does not constitute regulatory approval, legal advice, or endorsement.
          </p>
        </div>
      </section>
    </div>
  );
}
