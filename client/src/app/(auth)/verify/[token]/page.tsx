'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function VerifyEmailPage() {
  const params = useParams();
  const token = params.token as string;

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setStatus('error');
        setMessage('Invalid verification link');
        return;
      }

      try {
        const result = await api.verifyEmail(token);

        if (result.success) {
          setStatus('success');
          setMessage(result.message);
        } else {
          setStatus('error');
          setMessage(result.message);
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred during verification');
      }
    };

    verifyEmail();
  }, [token]);

  if (status === 'loading') {
    return (
      <div className="solid-card p-8 sm:p-10">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--teal-600)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
          </Link>
        </div>

        <div className="text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 relative"
            style={{ backgroundColor: 'var(--teal-50)' }}
          >
            <svg className="animate-spin h-10 w-10" style={{ color: 'var(--teal-600)' }} viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--graphite-900)' }}>Verifying your email</h1>
          <p className="max-w-sm mx-auto" style={{ color: 'var(--foreground-muted)' }}>Please wait while we verify your email address...</p>

          {/* Animated dots */}
          <div className="flex items-center justify-center gap-1.5 mt-6">
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--teal-600)', animationDelay: '0ms' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--teal-600)', animationDelay: '150ms' }} />
            <div className="w-2 h-2 rounded-full animate-bounce" style={{ backgroundColor: 'var(--teal-600)', animationDelay: '300ms' }} />
          </div>
        </div>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="solid-card p-8 sm:p-10">
        {/* Mobile Logo */}
        <div className="lg:hidden text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: 'var(--teal-600)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <span className="text-xl font-bold" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
          </Link>
        </div>

        <div className="text-center">
          <div
            className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ backgroundColor: 'var(--success-50)' }}
          >
            <svg className="w-10 h-10" style={{ color: 'var(--success-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--graphite-900)' }}>Credentials Verified</h1>
          <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--foreground-muted)' }}>{message || 'Your credentials have been verified. You may now access the portal.'}</p>

          {/* Success badge */}
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8"
            style={{
              backgroundColor: 'var(--success-50)',
              border: '1px solid var(--success-100)',
              color: 'var(--success-700)'
            }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            Account activated
          </div>

          <Link
            href="/login"
            className="btn-primary flex items-center justify-center gap-2 w-full h-12"
          >
            Continue to login
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="solid-card p-8 sm:p-10">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: 'var(--teal-600)' }}
          >
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-xl font-bold" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
        </Link>
      </div>

      <div className="text-center">
        <div
          className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
          style={{ backgroundColor: 'var(--danger-50)' }}
        >
          <svg className="w-10 h-10" style={{ color: 'var(--danger-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-3" style={{ color: 'var(--graphite-900)' }}>Verification Failed</h1>
        <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--foreground-muted)' }}>{message || 'The verification link is invalid or has expired.'}</p>

        {/* Error info card */}
        <div
          className="rounded-xl p-4 mb-8 text-left"
          style={{
            backgroundColor: 'var(--danger-50)',
            border: '1px solid var(--danger-100)'
          }}
        >
          <h3 className="text-sm font-semibold mb-2" style={{ color: 'var(--danger-800)' }}>This could happen if:</h3>
          <ul className="text-sm space-y-1" style={{ color: 'var(--danger-700)' }}>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              The link has expired (valid for 24 hours)
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              The link was already used
            </li>
            <li className="flex items-start gap-2">
              <svg className="w-4 h-4 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
              The link was copied incorrectly
            </li>
          </ul>
        </div>

        <div className="space-y-4">
          <Link
            href="/login"
            className="btn-primary flex items-center justify-center gap-2 w-full h-12"
          >
            Go to login
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>

          <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Need a new verification link?{' '}
            <Link
              href="/login"
              className="font-semibold transition-colors hover:opacity-80"
              style={{ color: 'var(--teal-600)' }}
            >
              Sign in to request one
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
