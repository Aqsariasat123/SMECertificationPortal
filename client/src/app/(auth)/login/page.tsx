'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

// Declare global for Google Sign-In
declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential: string }) => void;
            auto_select?: boolean;
          }) => void;
          renderButton: (
            element: HTMLElement,
            config: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
            }
          ) => void;
          prompt: () => void;
        };
      };
    };
  }
}

export default function LoginPage() {
  const { login, loginWithGoogle, verify2FA, resend2FAOTP, cancel2FA, initUAEPassAuth, twoFactorPending, twoFactorData, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [uaePassLoading, setUaePassLoading] = useState(false);

  // 2FA OTP state
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
  const [otpResending, setOtpResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const otpInputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  const uaePassEnabled = process.env.NEXT_PUBLIC_UAEPASS_ENABLED === 'true';

  // Check if session expired
  useEffect(() => {
    if (searchParams.get('session') === 'expired') {
      setSessionExpired(true);
    }
  }, [searchParams]);

  // Google Sign-In callback
  const handleGoogleCallback = useCallback(async (response: { credential: string }) => {
    setError('');
    setGoogleLoading(true);

    try {
      const result = await loginWithGoogle(response.credential);
      if (!result.success) {
        setError(result.message);
      }
    } catch {
      setError('An error occurred during Google sign-in');
    } finally {
      setGoogleLoading(false);
    }
  }, [loginWithGoogle]);

  // Initialize Google Sign-In when script loads
  const handleGoogleScriptLoad = useCallback(() => {
    if (window.google && googleClientId) {
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCallback,
      });

      const buttonDiv = document.getElementById('google-signin-button');
      if (buttonDiv) {
        window.google.accounts.id.renderButton(buttonDiv, {
          theme: 'outline',
          size: 'large',
          text: 'signin_with',
          shape: 'rectangular',
          width: 320,
        });
      }
    }
  }, [googleClientId, handleGoogleCallback]);

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
    // If requiresTwoFactor is true, the UI will switch to OTP input
  };

  // 2FA OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const digits = value.replace(/\D/g, '').slice(0, 6).split('');
      const newOtp = [...otpDigits];
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      setOtpDigits(newOtp);
      const nextIndex = Math.min(index + digits.length, 5);
      otpInputRefs.current[nextIndex]?.focus();
    } else {
      const newOtp = [...otpDigits];
      newOtp[index] = value.replace(/\D/g, '');
      setOtpDigits(newOtp);
      if (value && index < 5) {
        otpInputRefs.current[index + 1]?.focus();
      }
    }
    setError('');
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
      otpInputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async () => {
    const otp = otpDigits.join('');
    if (otp.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    const result = await verify2FA(otp);
    if (!result.success) {
      setError(result.message);
      setOtpDigits(['', '', '', '', '', '']);
      otpInputRefs.current[0]?.focus();
    }
  };

  const handleResendOtp = async () => {
    if (resendCooldown > 0) return;
    setOtpResending(true);
    const result = await resend2FAOTP();
    setOtpResending(false);
    if (result.success) {
      setResendCooldown(60);
      setOtpDigits(['', '', '', '', '', '']);
    } else {
      setError(result.message);
    }
  };

  const handleCancelOtp = () => {
    cancel2FA();
    setOtpDigits(['', '', '', '', '', '']);
    setError('');
  };

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  // Auto-submit when all 6 digits are entered
  useEffect(() => {
    if (otpDigits.every(d => d !== '') && twoFactorPending) {
      handleVerifyOtp();
    }
  }, [otpDigits, twoFactorPending]);

  // UAE Pass login handler
  const handleUAEPassLogin = async () => {
    setError('');
    setUaePassLoading(true);

    try {
      const result = await initUAEPassAuth();
      if (result.success && result.authUrl && result.state) {
        // Store state in sessionStorage for verification on callback
        sessionStorage.setItem('uaepass_state', result.state);
        // Redirect to UAE Pass
        window.location.href = result.authUrl;
      } else {
        setError(result.message || 'UAE Pass is not available');
        setUaePassLoading(false);
      }
    } catch {
      setError('Failed to connect to UAE Pass');
      setUaePassLoading(false);
    }
  };

  // Show 2FA OTP verification screen
  if (twoFactorPending) {
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
            <span className="font-medium" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
          </Link>
        </div>

        <div className="text-center mb-6">
          <div
            className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center"
            style={{ background: 'var(--teal-50)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Two-Factor Authentication</h1>
          <p className="mt-2 text-sm" style={{ color: 'var(--foreground-muted)' }}>
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>
            {twoFactorData?.email}
          </p>
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

        {/* OTP Input */}
        <div className="flex justify-center gap-2 mb-6">
          {otpDigits.map((digit, index) => (
            <input
              key={index}
              ref={(el) => { otpInputRefs.current[index] = el; }}
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleOtpKeyDown(index, e)}
              className="w-12 h-14 text-center text-xl font-semibold rounded-lg border-2 focus:outline-none focus:ring-2 transition-all"
              style={{
                borderColor: digit ? 'var(--teal-600)' : 'var(--graphite-200)',
                color: 'var(--graphite-900)',
              }}
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={isLoading || otpDigits.some(d => !d)}
          className="btn-primary w-full h-10 rounded-lg text-sm disabled:opacity-50 mb-4"
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="text-center space-y-3">
          <button
            onClick={handleResendOtp}
            disabled={otpResending || resendCooldown > 0}
            className="text-sm font-medium disabled:opacity-50"
            style={{ color: 'var(--teal-600)' }}
          >
            {otpResending ? 'Sending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </button>

          <div>
            <button
              onClick={handleCancelOtp}
              className="text-sm"
              style={{ color: 'var(--graphite-500)' }}
            >
              Cancel and go back
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 text-center text-xs" style={{ borderTop: '1px solid var(--graphite-100)', color: 'var(--graphite-400)' }}>
          The code will expire in 5 minutes
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Google Sign-In Script */}
      {googleClientId && (
        <Script
          src="https://accounts.google.com/gsi/client"
          onLoad={handleGoogleScriptLoad}
          strategy="lazyOnload"
        />
      )}

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
            <span className="font-medium" style={{ color: 'var(--graphite-900)' }}>Naywa</span>
          </Link>
        </div>

        <div className="mb-6">
          <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Sign in</h1>
          <p className="mt-1 text-sm" style={{ color: 'var(--foreground-muted)' }}>Enter your credentials to continue</p>
        </div>

        {/* Session Expired Notice */}
        {sessionExpired && (
          <div
            className="mb-5 p-3 rounded-lg flex items-center gap-2 text-sm"
            style={{ background: 'var(--warning-50)', color: 'var(--warning-700)' }}
          >
            <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Your session has expired due to inactivity. Please sign in again.
          </div>
        )}

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

        {/* OAuth Sign-In Buttons */}
        {(googleClientId || uaePassEnabled) && (
          <>
            <div className="space-y-3 mb-4">
              {/* Google Sign-In Button */}
              {googleClientId && (
                <div>
                  <div
                    id="google-signin-button"
                    className="flex justify-center"
                    style={{ minHeight: '44px' }}
                  >
                    {/* Google button will be rendered here */}
                    {googleLoading && (
                      <div className="flex items-center justify-center gap-2 w-full h-10 rounded-lg border" style={{ borderColor: 'var(--graphite-200)' }}>
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Signing in...</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* UAE Pass Button */}
              {uaePassEnabled && (
                <button
                  type="button"
                  onClick={handleUAEPassLogin}
                  disabled={isLoading || googleLoading || uaePassLoading}
                  className="w-full flex items-center justify-center gap-3 h-11 rounded-lg border transition-colors disabled:opacity-50 hover:bg-gray-50"
                  style={{ borderColor: 'var(--graphite-200)', backgroundColor: 'white' }}
                >
                  {uaePassLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="4" fill="#00843D"/>
                        <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white"/>
                        <path d="M12 8L8 12L12 16L16 12L12 8Z" fill="#00843D"/>
                      </svg>
                      <span className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>Sign in with UAE Pass</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-center" style={{ color: 'var(--graphite-400)' }}>
                For investors only
              </p>
            </div>

            <div className="relative my-5">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid var(--graphite-200)' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white" style={{ color: 'var(--graphite-400)' }}>or continue with email</span>
              </div>
            </div>
          </>
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
              disabled={isLoading || googleLoading}
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
                disabled={isLoading || googleLoading}
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
            disabled={isLoading || googleLoading}
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
    </>
  );
}
