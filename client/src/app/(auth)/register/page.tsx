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

    if (role === 'sme') {
      if (!formData.companyName) {
        setError('Please enter your company name');
        return;
      }
      if (!formData.tradeLicenseNumber) {
        setError('Please enter your trade license number');
        return;
      }
      if (!formData.industrySector) {
        setError('Please select your industry sector');
        return;
      }
    }

    setIsLoading(true);

    try {
      const result = await api.register({
        fullName: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        password: formData.password,
        role: role!,
        companyName: role === 'sme' ? formData.companyName : undefined,
        tradeLicenseNumber: role === 'sme' ? formData.tradeLicenseNumber : undefined,
        industrySector: role === 'sme' ? formData.industrySector : undefined,
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
            <h1 className="text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Get Started</h1>
            <p className="mt-2" style={{ color: 'var(--foreground-muted)' }}>What would you like to do?</p>
          </div>

          <div className="space-y-3">
            {/* User Option */}
            <button
              onClick={() => handleRoleSelect('user')}
              className="w-full p-5 rounded-lg transition-all duration-200 text-left group"
              style={{
                background: 'white',
                border: '1px solid var(--graphite-200)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal-600)';
                e.currentTarget.style.background = 'var(--teal-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--graphite-200)';
                e.currentTarget.style.background = 'white';
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--teal-500)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Browse SME Registry</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Access the certified SME directory and request introductions</p>
                </div>
                <svg className="w-5 h-5 mt-1" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </button>

            {/* SME Option */}
            <button
              onClick={() => handleRoleSelect('sme')}
              className="w-full p-5 rounded-lg transition-all duration-200 text-left group"
              style={{
                background: 'white',
                border: '1px solid var(--graphite-200)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = 'var(--teal-600)';
                e.currentTarget.style.background = 'var(--teal-50)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'var(--graphite-200)';
                e.currentTarget.style.background = 'white';
              }}
            >
              <div className="flex items-start gap-4">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--teal-600)' }}
                >
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Register Your SME</h3>
                    <span className="badge badge-teal text-xs">Recommended</span>
                  </div>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Get certified and connect with partners & investors</p>
                </div>
                <svg className="w-5 h-5 mt-1" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
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
            {role === 'sme' && (
              <>
                <div>
                  <label className="input-label block">Company Name</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.companyName}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      className="input-field w-full"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Enter your company name"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label block">Trade License Number</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      value={formData.tradeLicenseNumber}
                      onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                      className="input-field w-full"
                      style={{ paddingLeft: '2.5rem' }}
                      placeholder="Enter trade license number"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div>
                  <label className="input-label block">Industry Sector</label>
                  <div className="relative">
                    <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <select
                      value={formData.industrySector}
                      onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                      className="input-field w-full appearance-none cursor-pointer"
                      style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
                      disabled={isLoading}
                    >
                      <option value="">Select industry sector</option>
                      <option value="technology">Technology</option>
                      <option value="healthcare">Healthcare</option>
                      <option value="finance">Finance</option>
                      <option value="retail">Retail</option>
                      <option value="manufacturing">Manufacturing</option>
                      <option value="real_estate">Real Estate</option>
                      <option value="hospitality">Hospitality</option>
                      <option value="education">Education</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: 'var(--graphite-400)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </>
            )}

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
