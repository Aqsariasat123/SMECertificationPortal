'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

type UserRole = 'user' | 'sme';

export default function RegisterPage() {
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [smeSubStep, setSmeSubStep] = useState(1);
  const [role, setRole] = useState<UserRole | null>(null);
  const [selectedOption, setSelectedOption] = useState<UserRole | null>('sme');

  // Handle URL parameter for direct registry signup
  useEffect(() => {
    const roleParam = searchParams.get('role');
    if (roleParam === 'user') {
      setRole('user');
      setSelectedOption('user');
      setStep(2);
    }
  }, [searchParams]);
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
    setError('');
    setRole(selectedRole);
    setStep(2);
    setSmeSubStep(1);
  };

  const handleContinue = () => {
    if (selectedOption) {
      handleRoleSelect(selectedOption);
    }
  };

  const handleCompanyInfoContinue = () => {
    setError('');
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
    setSmeSubStep(2);
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
      setError('An error occurred during setup');
    } finally {
      setIsLoading(false);
    }
  };

  // Calculate current step for progress indicator
  const getCurrentStep = () => {
    if (step === 1) return 1;
    if (step === 2 && role === 'sme' && smeSubStep === 1) return 2;
    return 3;
  };

  const currentStep = getCurrentStep();

  // Progress Steps Component - Now at TOP of card
  const ProgressSteps = () => (
    <div className="flex items-center justify-center mb-10">
      {/* Step 1 */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all"
          style={{
            background: currentStep >= 1 ? '#2D6A6A' : '#F5FAFA',
            color: currentStep >= 1 ? 'white' : '#5A7070',
            border: currentStep >= 1 ? 'none' : '1.5px solid #D0E4E4'
          }}
        >
          1
        </div>
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ color: currentStep >= 1 ? '#2D6A6A' : '#5A7070', fontWeight: currentStep === 1 ? 600 : 500 }}
        >
          Type
        </span>
      </div>

      {/* Connector */}
      <div className="w-12 h-[1px] mx-1 mb-[18px]" style={{ background: '#D0E4E4' }} />

      {/* Step 2 */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all"
          style={{
            background: currentStep >= 2 ? '#2D6A6A' : '#F5FAFA',
            color: currentStep >= 2 ? 'white' : '#5A7070',
            border: currentStep >= 2 ? 'none' : '1.5px solid #D0E4E4'
          }}
        >
          2
        </div>
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ color: currentStep >= 2 ? '#2D6A6A' : '#5A7070', fontWeight: currentStep === 2 ? 600 : 500 }}
        >
          Account
        </span>
      </div>

      {/* Connector */}
      <div className="w-12 h-[1px] mx-1 mb-[18px]" style={{ background: '#D0E4E4' }} />

      {/* Step 3 */}
      <div className="flex flex-col items-center gap-1.5">
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-semibold transition-all"
          style={{
            background: currentStep >= 3 ? '#2D6A6A' : '#F5FAFA',
            color: currentStep >= 3 ? 'white' : '#5A7070',
            border: currentStep >= 3 ? 'none' : '1.5px solid #D0E4E4'
          }}
        >
          3
        </div>
        <span
          className="text-[11px] font-medium tracking-wide"
          style={{ color: currentStep >= 3 ? '#2D6A6A' : '#5A7070', fontWeight: currentStep === 3 ? 600 : 500 }}
        >
          Details
        </span>
      </div>
    </div>
  );

  if (success) {
    return (
      <div
        className="rounded-[20px] p-6 sm:p-10 lg:p-12"
        style={{
          background: 'white',
          border: '1px solid #D0E4E4',
          boxShadow: '0 4px 32px rgba(45,106,106,0.07)',
          animation: 'fadeUp 0.5s 0.1s both'
        }}
      >
        <div className="text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: '#E8F4F4' }}
          >
            <svg className="w-8 h-8" style={{ color: '#2D6A6A' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1
            className="text-xl sm:text-2xl font-normal mb-2 tracking-[0.01em] leading-[1.3]"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#111C1C' }}
          >
            Verification Email Sent
          </h1>
          <p className="text-sm mb-8 max-w-sm mx-auto leading-relaxed" style={{ color: '#5A7070' }}>
            A verification link has been sent to <span className="font-medium" style={{ color: '#111C1C' }}>{formData.email}</span>. Check your inbox to verify your credentials.
          </p>
          <Link
            href="/login"
            className="inline-flex items-center justify-center gap-1.5 w-full h-[46px] rounded-[10px] font-semibold text-sm text-white transition-all"
            style={{ background: '#2D6A6A' }}
          >
            Go to Login
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className="rounded-[20px] p-12"
      style={{
        background: 'white',
        border: '1px solid #D0E4E4',
        boxShadow: '0 4px 32px rgba(45,106,106,0.07)',
        animation: 'fadeUp 0.5s 0.1s both'
      }}
    >
      {/* Progress Steps - Always at top */}
      <ProgressSteps />

      {step === 1 ? (
        <>
          {/* Header */}
          <h2
            className="text-2xl font-normal text-center mb-2 tracking-[0.01em] leading-[1.3]"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#111C1C' }}
          >
            Get Started
          </h2>
          <p className="text-sm text-center mb-9 leading-relaxed" style={{ color: '#5A7070' }}>
            Select how you would like to use the Naywa platform.
          </p>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3.5 mb-7">
            {/* Certify a Business */}
            <div
              onClick={() => setSelectedOption('sme')}
              className="rounded-[14px] p-5 pt-7 pb-6 cursor-pointer transition-all text-center relative"
              style={{
                background: selectedOption === 'sme' ? '#E8F4F4' : 'white',
                border: selectedOption === 'sme' ? '1.5px solid #2D6A6A' : '1.5px solid #D0E4E4',
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: selectedOption === 'sme' ? 'rgba(45,106,106,0.15)' : '#E8F4F4' }}
              >
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                  <polyline points="9 12 11 14 15 10"/>
                </svg>
              </div>
              <p className="text-sm font-semibold mb-1.5 leading-tight" style={{ color: '#111C1C' }}>Certify a Business</p>
              <p className="text-xs leading-[1.55]" style={{ color: '#5A7070' }}>Get certified and receive a verifiable record of your capital-readiness status.</p>
            </div>

            {/* Browse Certified Businesses */}
            <div
              onClick={() => setSelectedOption('user')}
              className="rounded-[14px] p-5 pt-7 pb-6 cursor-pointer transition-all text-center"
              style={{
                background: selectedOption === 'user' ? '#E8F4F4' : 'white',
                border: selectedOption === 'user' ? '1.5px solid #2D6A6A' : '1.5px solid #D0E4E4',
                opacity: selectedOption === 'user' ? 1 : 0.75
              }}
            >
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-4"
                style={{ background: selectedOption === 'user' ? 'rgba(45,106,106,0.15)' : '#E8F4F4' }}
              >
                <svg className="w-[22px] h-[22px]" viewBox="0 0 24 24" fill="none" stroke="#2D6A6A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
                </svg>
              </div>
              <p className="text-sm font-semibold mb-1.5 leading-tight" style={{ color: '#111C1C' }}>Browse Certified Businesses</p>
              <p className="text-xs leading-[1.55] mb-2" style={{ color: '#5A7070' }}>View certified entities recorded in Naywa&apos;s certification register.</p>
              {/* Read Only Tag - centered below text */}
              <span
                className="inline-block text-[8px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded"
                style={{ background: '#F5FAFA', color: '#5A7070', border: '1px solid #D0E4E4' }}
              >
                Read only
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-2 mb-6">
            <button
              onClick={handleContinue}
              className="h-[46px] rounded-[10px] font-semibold text-xs md:text-sm text-white transition-all flex items-center justify-center gap-1 overflow-hidden px-2"
              style={{ background: '#2D6A6A' }}
            >
              <span className="truncate">Start Certification</span>
              <svg className="w-3 h-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
            <button
              onClick={() => { setSelectedOption('user'); handleRoleSelect('user'); }}
              className="h-[46px] rounded-[10px] font-medium text-xs md:text-sm transition-all flex items-center justify-center px-2"
              style={{ background: 'white', border: '1.5px solid #D0E4E4', color: '#2D6A6A' }}
            >
              View Registry
            </button>
          </div>

          {/* Sign in */}
          <p className="text-center text-[13px]" style={{ color: '#5A7070' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#2D6A6A' }}>Sign in</Link>
          </p>
        </>
      ) : role === 'sme' && smeSubStep === 1 ? (
        /* SME Step 2a - Company Information */
        <>
          <button
            onClick={() => { setError(''); setStep(1); }}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#5A7070' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to account type
          </button>

          <h2
            className="text-2xl font-normal mb-2 tracking-[0.01em] leading-[1.3]"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#111C1C' }}
          >
            Company Information
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#5A7070' }}>
            Enter your business details to get started with certification.
          </p>

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

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Company Name</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="Enter your company name"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Trade License Number</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={formData.tradeLicenseNumber}
                  onChange={(e) => setFormData({ ...formData, tradeLicenseNumber: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="Enter trade license number"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Industry Sector</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <select
                  value={formData.industrySector}
                  onChange={(e) => setFormData({ ...formData, industrySector: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-10 transition-all outline-none appearance-none cursor-pointer"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
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
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={handleCompanyInfoContinue}
              className="w-full h-[46px] rounded-[10px] font-semibold text-sm text-white transition-all flex items-center justify-center gap-2"
              style={{ background: '#2D6A6A' }}
            >
              Save & Continue
              <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </button>
          </div>

          <p className="text-center text-[13px] mt-8" style={{ color: '#5A7070' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#2D6A6A' }}>Sign in</Link>
          </p>
        </>
      ) : (
        /* SME Step 2b (Personal) or User Step 2 */
        <>
          <button
            onClick={() => { setError(''); role === 'sme' ? setSmeSubStep(1) : setStep(1); }}
            className="flex items-center gap-2 text-sm mb-6 transition-colors"
            style={{ color: '#5A7070' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            {role === 'sme' ? 'Back to company info' : 'Back to account type'}
          </button>

          <h2
            className="text-2xl font-normal mb-2 tracking-[0.01em] leading-[1.3]"
            style={{ fontFamily: "'Libre Baskerville', serif", color: '#111C1C' }}
          >
            {role === 'sme' ? 'Personal Details' : 'Create Your Account'}
          </h2>
          <p className="text-sm mb-8 leading-relaxed" style={{ color: '#5A7070' }}>
            {role === 'sme'
              ? 'Set up your login credentials to complete setup.'
              : 'Enter your details to access the SME registry.'}
          </p>

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

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>First Name</label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm px-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="John"
                  disabled={isLoading}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Last Name</label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm px-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="Doe"
                  disabled={isLoading}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Email address</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="you@example.com"
                  disabled={isLoading}
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
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-10 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="Min. 8 characters"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 transition-colors"
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

            <div>
              <label className="block text-sm font-medium mb-2" style={{ color: '#111C1C' }}>Confirm Password</label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: '#5A7070' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full h-[46px] rounded-[10px] text-sm pl-10 pr-4 transition-all outline-none"
                  style={{ border: '1.5px solid #D0E4E4', background: 'white' }}
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
              </div>
            </div>

            <label className="flex items-start gap-3 cursor-pointer pt-2">
              <input
                type="checkbox"
                checked={formData.agreeTerms}
                onChange={(e) => setFormData({ ...formData, agreeTerms: e.target.checked })}
                className="w-4 h-4 rounded mt-0.5"
                style={{ accentColor: '#2D6A6A' }}
              />
              <span className="text-sm leading-relaxed" style={{ color: '#5A7070' }}>
                I agree to the{' '}
                <Link href="/terms" target="_blank" className="font-medium" style={{ color: '#2D6A6A' }}>Terms of Service</Link>
                {' '}and acknowledge the{' '}
                <Link href="/privacy" target="_blank" className="font-medium" style={{ color: '#2D6A6A' }}>Privacy Policy</Link>.
              </span>
            </label>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full h-[46px] rounded-[10px] font-semibold text-sm text-white transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              style={{ background: '#2D6A6A' }}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Completing setup...
                </>
              ) : (
                <>
                  Complete Setup
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M12 5l7 7-7 7"/>
                  </svg>
                </>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] mt-8" style={{ color: '#5A7070' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium" style={{ color: '#2D6A6A' }}>Sign in</Link>
          </p>
        </>
      )}

      <style jsx>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
