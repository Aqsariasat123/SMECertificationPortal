'use client';

import { useState } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

type UserRole = 'user' | 'sme';

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    companyName: '',
    tradeLicenseNumber: '',
    industrySector: '',
    agreeTerms: false,
  });
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleRoleSelect = (selectedRole: UserRole) => {
    setRole(selectedRole);
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please agree to the terms and conditions');
      return;
    }


    setIsLoading(true);

    try {
      const result = await api.register({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: role!,
      });

      if (result.success) {
        setSuccess(true);
      } else {
        setError(result.message);
      }
    } catch {
      setError('An error occurred during registration');
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="glass-card rounded-xl p-8 sm:p-10">
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'var(--success-50)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--success-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-semibold mb-3" style={{ color: 'var(--graphite-900)' }}>Registration Successful!</h1>
          <p className="mb-8 max-w-sm mx-auto" style={{ color: 'var(--foreground-muted)' }}>
            We&apos;ve sent a verification email to <span className="font-medium" style={{ color: 'var(--graphite-700)' }}>{formData.email}</span>. Please check your inbox to verify your account.
          </p>
          <Link
            href="/login"
            className="btn-primary inline-flex items-center justify-center gap-2 w-full h-11 rounded-lg"
          >
            Go to Login
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="glass-card rounded-xl p-8 sm:p-10">
      {/* Mobile Logo */}
      <div className="lg:hidden text-center mb-8">
        <Link href="/" className="inline-flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--teal-600)' }}
          >
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <span className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>SME Certification</span>
        </Link>
      </div>

      {/* Progress Steps with Labels */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-3">
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
              style={{
                background: step >= 1 ? 'var(--teal-600)' : 'var(--graphite-200)',
                color: step >= 1 ? 'white' : 'var(--graphite-500)'
              }}
            >
              1
            </div>
            <span className="text-xs mt-1.5 font-medium" style={{ color: step >= 1 ? 'var(--teal-600)' : 'var(--graphite-400)' }}>
              Account Type
            </span>
          </div>
          <div
            className="w-12 h-1 rounded-full mb-5"
            style={{ background: step >= 2 ? 'var(--teal-600)' : 'var(--graphite-200)' }}
          />
          <div className="flex flex-col items-center">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium"
              style={{
                background: step >= 2 ? 'var(--teal-600)' : 'var(--graphite-200)',
                color: step >= 2 ? 'white' : 'var(--graphite-500)'
              }}
            >
              2
            </div>
            <span className="text-xs mt-1.5 font-medium" style={{ color: step >= 2 ? 'var(--teal-600)' : 'var(--graphite-400)' }}>
              Your Details
            </span>
          </div>
        </div>
      </div>

      {step === 1 ? (
        <>
          <div className="text-center mb-8">
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Choose Your Account Type</h1>
            <p className="mt-2" style={{ color: 'var(--foreground-muted)' }}>Select the type of account you want to create to get started.</p>
          </div>

          <div className="grid grid-cols-2 gap-5 mb-6">
            {/* SME Option */}
            <div
              onClick={() => handleRoleSelect('sme')}
              className="p-6 py-8 rounded-xl text-center transition-all duration-200 hover:shadow-lg group cursor-pointer flex flex-col"
              style={{
                background: 'white',
                border: '1px solid var(--graphite-200)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal-300)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(58, 115, 109, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--graphite-200)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* SME Icon - Shop/Store */}
              <div className="flex justify-center mb-5">
                <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Store building */}
                  <rect x="12" y="28" width="40" height="28" rx="2" fill="#e8f5f3" stroke="#3a736d" strokeWidth="2"/>
                  {/* Awning */}
                  <path d="M8 28L12 16H52L56 28" stroke="#3a736d" strokeWidth="2" fill="#3a736d"/>
                  <path d="M8 28C8 28 12 34 18 28C24 22 26 28 32 28C38 28 40 22 46 28C52 34 56 28 56 28" stroke="#3a736d" strokeWidth="2" fill="#5eb6af"/>
                  {/* Door */}
                  <rect x="26" y="40" width="12" height="16" rx="1" fill="#3a736d"/>
                  <circle cx="35" cy="48" r="1.5" fill="white"/>
                  {/* Windows */}
                  <rect x="16" y="34" width="8" height="8" rx="1" fill="#5eb6af" stroke="#3a736d" strokeWidth="1"/>
                  <rect x="40" y="34" width="8" height="8" rx="1" fill="#5eb6af" stroke="#3a736d" strokeWidth="1"/>
                  {/* Flag */}
                  <line x1="32" y1="8" x2="32" y2="16" stroke="#3a736d" strokeWidth="2"/>
                  <path d="M32 8L42 12L32 16" fill="#5eb6af" stroke="#3a736d" strokeWidth="1"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>Business Registration</h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Get certified and connect with partners & investors.</p>
            </div>

            {/* Investor Option */}
            <div
              onClick={() => handleRoleSelect('user')}
              className="p-6 py-8 rounded-xl text-center transition-all duration-200 hover:shadow-lg group cursor-pointer flex flex-col"
              style={{
                background: 'white',
                border: '1px solid var(--graphite-200)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal-300)';
                e.currentTarget.style.boxShadow = '0 10px 25px -5px rgba(58, 115, 109, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--graphite-200)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Investor Icon */}
              <div className="flex justify-center mb-5">
                <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                  {/* Person */}
                  <circle cx="24" cy="16" r="8" fill="#3a736d"/>
                  <path d="M10 44C10 34 16 28 24 28C32 28 38 34 38 44" fill="#3a736d"/>
                  {/* Growth chart */}
                  <rect x="36" y="24" width="22" height="32" rx="2" fill="#e8f5f3" stroke="#3a736d" strokeWidth="2"/>
                  {/* Chart bars */}
                  <rect x="40" y="44" width="4" height="8" fill="#5eb6af"/>
                  <rect x="46" y="38" width="4" height="14" fill="#5eb6af"/>
                  <rect x="52" y="32" width="4" height="20" fill="#3a736d"/>
                  {/* Arrow up */}
                  <path d="M42 36L47 28L52 32" stroke="#3a736d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
                  <path d="M47 28L47 32L51 30" fill="#3a736d"/>
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>Investor Access</h3>
              <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>Browse SMEs and request introductions.</p>
            </div>
          </div>

          {/* Action Buttons - Same Line */}
          <div className="flex gap-3">
            <button
              onClick={() => handleRoleSelect('sme')}
              className="flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200"
              style={{ background: 'var(--teal-600)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--teal-700)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--teal-600)'}
            >
              Register as SME
            </button>
            <button
              onClick={() => handleRoleSelect('user')}
              className="flex-1 py-3 px-4 rounded-lg font-medium text-white transition-all duration-200"
              style={{ background: 'var(--teal-600)' }}
              onMouseEnter={(e) => e.currentTarget.style.background = 'var(--teal-700)'}
              onMouseLeave={(e) => e.currentTarget.style.background = 'var(--teal-600)'}
            >
              Register as Investor
            </button>
          </div>
        </>
      ) : (
        <>
          <div className="mb-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-sm mb-4 transition-colors"
              style={{ color: 'var(--foreground-muted)' }}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to account type
            </button>
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
              {role === 'sme' ? 'Create Your Account' : 'Create Your Account'}
            </h1>
            <p className="mt-2" style={{ color: 'var(--foreground-muted)' }}>
              {role === 'sme'
                ? 'Set up your login credentials. Company details will be added during certification.'
                : 'Enter your details to access the SME registry'}
            </p>
          </div>

          {error && (
            <div
              className="mb-6 p-4 rounded-lg flex items-center gap-3"
              style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}
            >
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--danger-100)' }}
              >
                <svg className="w-4 h-4" style={{ color: 'var(--danger-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-sm font-medium" style={{ color: 'var(--danger-600)' }}>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="input-label block">First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="input-field w-full"
                  placeholder="John"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="input-label block">Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="input-field w-full"
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="input-label block">Email address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-field w-full"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="you@example.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="input-label block">Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="input-field w-full"
                  style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                  placeholder="Min. 8 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--graphite-400)' }}
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

            <div>
              <label className="input-label block">Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="input-field w-full"
                  style={{ paddingLeft: '2.5rem' }}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 rounded mt-0.5"
                style={{ borderColor: 'var(--graphite-300)', accentColor: 'var(--teal-600)' }}
              />
              <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                I agree to the{' '}
                <a href="#" style={{ color: 'var(--teal-600)' }} className="font-medium">Terms of Service</a>
                {' '}and{' '}
                <a href="#" style={{ color: 'var(--teal-600)' }} className="font-medium">Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full h-11 font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${
                role === 'sme' ? 'btn-teal' : 'btn-primary'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Creating account...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  {role === 'sme' ? 'Create Account & Continue' : 'Create Account'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </span>
              )}
            </button>
          </form>
        </>
      )}

      <div className="mt-8 text-center">
        <p style={{ color: 'var(--graphite-600)' }}>
          Already have an account?{' '}
          <Link href="/login" className="font-medium transition-colors" style={{ color: 'var(--teal-600)' }}>
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
