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
  };

  // 2FA OTP handlers
  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
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
        sessionStorage.setItem('uaepass_state', result.state);
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
      <div
        className="rounded-[20px] p-10 lg:p-12"
        style={{
          background: 'white',
          border: '1px solid #D0E4E4',
          boxShadow: '0 4px 32px rgba(45,106,106,0.07)',
          animation: 'fadeUp 0.5s 0.1s both'
        }}
      >
        <div className="text-center mb-8">
          <div
            className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center"
            style={{ background: '#E8F4F4' }}
          >
            <svg className="w-8 h-8" style={{ color: '#2D6A6A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h1
            className="text-[26px] font-bold mb-2 tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#111C1C' }}
          >
            Two-Factor Authentication
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
            Enter the 6-digit code sent to
          </p>
          <p className="text-sm font-medium" style={{ color: '#111C1C' }}>
            {twoFactorData?.email}
          </p>
        </div>

        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FEE2E2' }}
            >
              <svg className="w-4 h-4" style={{ color: '#DC2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</p>
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
              className="w-12 h-14 text-center text-xl font-semibold rounded-xl outline-none transition-all"
              style={{
                border: digit ? '2px solid #2D6A6A' : '1.5px solid #D0E4E4',
                color: '#111C1C',
                background: 'white'
              }}
              disabled={isLoading}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <button
          onClick={handleVerifyOtp}
          disabled={isLoading || otpDigits.some(d => !d)}
          className="w-full h-[46px] rounded-[10px] font-semibold text-sm text-white transition-all disabled:opacity-50 mb-5"
          style={{ background: '#2D6A6A' }}
        >
          {isLoading ? 'Verifying...' : 'Verify Code'}
        </button>

        <div className="text-center space-y-3">
          <button
            onClick={handleResendOtp}
            disabled={otpResending || resendCooldown > 0}
            className="text-sm font-medium disabled:opacity-50"
            style={{ color: '#2D6A6A' }}
          >
            {otpResending ? 'Sending...' : resendCooldown > 0 ? `Resend code in ${resendCooldown}s` : 'Resend code'}
          </button>

          <div>
            <button
              onClick={handleCancelOtp}
              className="text-sm"
              style={{ color: '#5A7070' }}
            >
              Cancel and go back
            </button>
          </div>
        </div>

        <div className="mt-6 pt-5 text-center text-xs" style={{ borderTop: '1px solid #D0E4E4', color: '#5A7070' }}>
          The code will expire in 5 minutes
        </div>

        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
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

      <div
        className="rounded-[20px] p-10 lg:p-12"
        style={{
          background: 'white',
          border: '1px solid #D0E4E4',
          boxShadow: '0 4px 32px rgba(45,106,106,0.07)',
          animation: 'fadeUp 0.5s 0.1s both'
        }}
      >
        <div className="mb-8">
          <h1
            className="text-[26px] font-bold mb-2 tracking-[-0.01em]"
            style={{ fontFamily: 'var(--font-playfair), serif', color: '#111C1C' }}
          >
            Welcome Back
          </h1>
          <p className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
            Enter your credentials to continue
          </p>
        </div>

        {/* Session Expired Notice */}
        {sessionExpired && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FEF3C7' }}
            >
              <svg className="w-4 h-4" style={{ color: '#D97706' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: '#D97706' }}>
              Your session has expired due to inactivity. Please sign in again.
            </p>
          </div>
        )}

        {error && (
          <div
            className="mb-6 p-4 rounded-xl flex items-center gap-3"
            style={{ background: '#FEF2F2', border: '1px solid #FECACA' }}
          >
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: '#FEE2E2' }}
            >
              <svg className="w-4 h-4" style={{ color: '#DC2626' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-sm font-medium" style={{ color: '#DC2626' }}>{error}</p>
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
                    {googleLoading && (
                      <div
                        className="flex items-center justify-center gap-2 w-full h-[46px] rounded-[10px]"
                        style={{ border: '1.5px solid #D0E4E4' }}
                      >
                        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        <span className="text-sm" style={{ color: '#5A7070' }}>Signing in...</span>
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
                  className="w-full flex items-center justify-center gap-3 h-[46px] rounded-[10px] transition-colors disabled:opacity-50"
                  style={{ border: '1.5px solid #D0E4E4', backgroundColor: 'white' }}
                >
                  {uaePassLoading ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      <span className="text-sm" style={{ color: '#5A7070' }}>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                        <rect width="24" height="24" rx="4" fill="#00843D"/>
                        <path d="M12 6L6 12L12 18L18 12L12 6Z" fill="white"/>
                        <path d="M12 8L8 12L12 16L16 12L12 8Z" fill="#00843D"/>
                      </svg>
                      <span className="text-sm font-medium" style={{ color: '#111C1C' }}>Sign in with UAE Pass</span>
                    </>
                  )}
                </button>
              )}

              <p className="text-xs text-center" style={{ color: '#5A7070' }}>
                For investors only
              </p>
            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full" style={{ borderTop: '1px solid #D0E4E4' }} />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white" style={{ color: '#5A7070' }}>or continue with email</span>
              </div>
            </div>
          </>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Email</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-4 transition-all outline-none"
                style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={isLoading || googleLoading}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Password</label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-10 transition-all outline-none"
                style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                placeholder="Enter password"
                autoComplete="current-password"
                disabled={isLoading || googleLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
                style={{ color: '#5A7070' }}
              >
                {showPassword ? (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm pt-1">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 rounded"
                style={{ accentColor: '#2D6A6A' }}
              />
              <span className="ml-2" style={{ color: '#5A7070' }}>Remember me</span>
            </label>
            <Link href="/forgot-password" className="font-medium" style={{ color: '#2D6A6A' }}>
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading || googleLoading}
            className="w-full h-[46px] rounded-[10px] font-semibold text-sm text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ background: '#2D6A6A' }}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Signing in...
              </>
            ) : (
              <>
                Sign in
                <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M5 12h14M12 5l7 7-7 7"/>
                </svg>
              </>
            )}
          </button>
        </form>

        <p className="text-center text-[13px] mt-8" style={{ color: '#5A7070' }}>
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium" style={{ color: '#2D6A6A' }}>Get Started</Link>
        </p>

        <style jsx>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(16px); }
            to   { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </div>
    </>
  );
}
