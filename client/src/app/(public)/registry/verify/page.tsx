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

    // Navigate to verification result page
    router.push(`/registry/verify/${trimmedId}`);
  };

  return (
    <div className="flex-1 flex flex-col">
      {/* Page Content */}
      <main className="flex-1 py-16 px-6 flex flex-col items-center" style={{ paddingTop: '56px' }}>
        {/* Header */}
        <div
          className="text-center max-w-[520px] mb-12"
          style={{ animation: 'fadeUp 0.6s 0.1s both' }}
        >
          <p
            className="text-[11px] font-semibold tracking-[0.2em] uppercase mb-4"
            style={{ color: '#2D6A6A' }}
          >
            Certificate Verification
          </p>
          <h1
            className="text-[clamp(28px,4vw,42px)] font-bold leading-[1.1] mb-3.5 tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-playfair), Playfair Display, serif', color: '#111C1C' }}
          >
            Verify a Naywa Certificate
          </h1>
          <p className="text-sm leading-[1.7]" style={{ color: '#5A7070' }}>
            Enter a Certificate ID to retrieve its current status from Naywa&apos;s certification register.
          </p>
        </div>

        {/* Search Section */}
        <div
          className="w-full max-w-[540px] mb-12"
          style={{ animation: 'fadeUp 0.6s 0.2s both' }}
        >
          <p className="text-xs text-center mb-3 leading-[1.5]" style={{ color: '#5A7070' }}>
            Verification confirms the current status recorded in Naywa&apos;s certification register.
          </p>

          <form onSubmit={handleSubmit}>
            <div
              className="flex overflow-hidden rounded-xl transition-all"
              style={{
                background: 'white',
                border: error ? '1.5px solid #DC2626' : '1.5px solid #D0E4E4',
                boxShadow: '0 2px 12px rgba(45,106,106,0.07)',
              }}
            >
              <input
                type="text"
                value={certificateId}
                onChange={(e) => {
                  setCertificateId(e.target.value.toUpperCase());
                  setError('');
                }}
                placeholder="Enter Certificate ID"
                className="flex-1 border-none outline-none py-3 md:py-4 px-4 md:px-5 text-[13px] md:text-[15px] tracking-[0.02em]"
                style={{
                  fontFamily: 'var(--font-dm-sans), DM Sans, sans-serif',
                  color: '#1A2A2A',
                  background: 'transparent',
                }}
                autoComplete="off"
                spellCheck={false}
              />
              <button
                type="submit"
                className="px-4 md:px-7 text-xs md:text-sm font-semibold whitespace-nowrap transition-colors"
                style={{ background: '#2D6A6A', color: 'white', border: 'none' }}
              >
                Verify
              </button>
            </div>
          </form>

          {error && (
            <p className="mt-2 text-sm text-center" style={{ color: '#DC2626' }}>
              {error}
            </p>
          )}

          <p className="text-[11px] text-center mt-2.5 tracking-[0.02em]" style={{ color: '#5A7070' }}>
            Verification is available to any party. No account required.
          </p>
        </div>
      </main>

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
