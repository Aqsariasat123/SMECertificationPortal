'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function UAEPassCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { loginWithUAEPass } = useAuth();
  const [status, setStatus] = useState<'processing' | 'success' | 'error'>('processing');
  const [message, setMessage] = useState('Processing your UAE Pass authentication...');

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get('code');
      const state = searchParams.get('state');
      const error = searchParams.get('error');

      // Check for errors from UAE Pass
      if (error) {
        setStatus('error');
        setMessage(searchParams.get('error_description') || 'UAE Pass authentication was cancelled or failed');
        return;
      }

      if (!code || !state) {
        setStatus('error');
        setMessage('Invalid callback: missing authorization code or state');
        return;
      }

      // Verify state to prevent CSRF
      const storedState = sessionStorage.getItem('uaepass_state');
      if (storedState !== state) {
        setStatus('error');
        setMessage('Security validation failed. Please try again.');
        sessionStorage.removeItem('uaepass_state');
        return;
      }

      // Clear stored state
      sessionStorage.removeItem('uaepass_state');

      // Exchange code for token
      try {
        const result = await loginWithUAEPass(code, state);
        if (result.success) {
          setStatus('success');
          setMessage('Authentication successful! Redirecting...');
          // The loginWithUAEPass function will handle the redirect
        } else {
          setStatus('error');
          setMessage(result.message || 'Authentication failed. Please try again.');
        }
      } catch {
        setStatus('error');
        setMessage('An error occurred during authentication. Please try again.');
      }
    };

    handleCallback();
  }, [searchParams, loginWithUAEPass, router]);

  return (
    <div className="solid-card rounded-lg p-6 sm:p-8">
      {/* Logo */}
      <div className="text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--teal-600)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-medium" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
        </Link>
      </div>

      <div className="text-center">
        {/* Status Icon */}
        <div
          className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
          style={{
            background: status === 'processing'
              ? 'var(--teal-50)'
              : status === 'success'
                ? 'var(--success-50)'
                : 'var(--danger-50)'
          }}
        >
          {status === 'processing' ? (
            <svg
              className="w-8 h-8 animate-spin"
              style={{ color: 'var(--teal-600)' }}
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          ) : status === 'success' ? (
            <svg
              className="w-8 h-8"
              style={{ color: 'var(--success-600)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          ) : (
            <svg
              className="w-8 h-8"
              style={{ color: 'var(--danger-600)' }}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        {/* Title */}
        <h1
          className="text-xl font-semibold mb-2"
          style={{ color: 'var(--graphite-900)' }}
        >
          {status === 'processing'
            ? 'UAE Pass Authentication'
            : status === 'success'
              ? 'Success!'
              : 'Authentication Failed'}
        </h1>

        {/* Message */}
        <p
          className="text-sm mb-6"
          style={{ color: 'var(--foreground-muted)' }}
        >
          {message}
        </p>

        {/* Error Actions */}
        {status === 'error' && (
          <div className="space-y-3">
            <Link
              href="/login"
              className="btn-primary block w-full h-10 rounded-lg text-sm flex items-center justify-center"
            >
              Try Again
            </Link>
            <Link
              href="/"
              className="block text-sm"
              style={{ color: 'var(--graphite-500)' }}
            >
              Return to Home
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
