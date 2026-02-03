'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginPage() {
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    const result = await login({ email, password });

    if (!result.success) {
      setError(result.message);
    }
  };

  return (
    <div className="solid-card rounded-lg p-6 sm:p-8">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-6">
        <Link href="/" className="inline-flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--teal-600)' }}
          >
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="font-medium" style={{ color: 'var(--graphite-900)' }}>SME Readiness Portal</span>
        </Link>
      </div>

      <div className="mb-6">
        <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Sign in</h1>
        <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>Enter your credentials to continue</p>
      </div>

      {error && (
        <div
          className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm"
          style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}
        >
          <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="input-label block">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field w-full"
            placeholder="you@example.com"
            autoComplete="email"
            disabled={isLoading}
          />
        </div>

        <div>
          <label htmlFor="password" className="input-label block">Password</label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full pr-10"
              placeholder="Enter password"
              autoComplete="current-password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--graphite-400)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {showPassword ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                ) : (
                  <>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </>
                )}
              </svg>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center cursor-pointer">
            <input
              type="checkbox"
              className="w-3.5 h-3.5 rounded"
              style={{ accentColor: 'var(--teal-600)' }}
            />
            <span className="ml-2" style={{ color: 'var(--graphite-600)' }}>Remember me</span>
          </label>
          <Link href="/forgot-password" style={{ color: 'var(--teal-600)' }}>
            Forgot password?
          </Link>
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="btn-primary w-full h-10 rounded-lg text-sm disabled:opacity-50"
        >
          {isLoading ? 'Signing in...' : 'Sign in'}
        </button>
      </form>

      <div className="mt-6 pt-5 text-center text-sm" style={{ borderTop: '1px solid var(--graphite-100)' }}>
        <span style={{ color: 'var(--foreground-muted)' }}>Don&apos;t have an account? </span>
        <Link href="/register" style={{ color: 'var(--teal-600)' }}>Secure Your Access</Link>
      </div>
    </div>
  );
}
