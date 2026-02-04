'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SMEProfileData } from '@/types';

type StepStatus = 'complete' | 'incomplete' | 'locked';

export default function SMECertificationPage() {
  const [profile, setProfile] = useState<SMEProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await api.getSMEProfile();
      if (result.success && result.data) {
        setProfile(result.data);
      } else {
        setError(result.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  // Required document types
  const requiredDocumentTypes = [
    { type: 'trade_license', label: 'Trade License' },
    { type: 'certificate_of_incorporation', label: 'Certificate of Incorporation' },
    { type: 'financial_statements', label: 'Financial Statements' },
  ];

  // Calculate completion status
  const docs = profile?.documents || {};
  const uploadedFiles = (docs.uploadedFiles || []) as Array<{ type?: string; name: string; path?: string; uploadedAt?: string }>;
  const documentsCount = uploadedFiles.length;
  const requiredDocuments = requiredDocumentTypes.length;

  // Check if already submitted/certified
  const isAlreadySubmitted = profile && ['submitted', 'under_review', 'certified'].includes(profile.certificationStatus);

  // Calculate profile completion locally (same as Dashboard - 7 sections)
  const calculateProfileCompletion = () => {
    if (!profile) return 0;
    let completed = 0;
    const total = 7;
    // Basic Info
    if (profile.companyName && profile.tradeLicenseNumber && profile.industrySector) completed++;
    // Legal & Registration
    if (profile.registrationNumber && profile.legalStructure) completed++;
    // Ownership
    if (profile.ownerName && profile.ownerNationality) completed++;
    // Financial Info
    if (profile.fundingStage || profile.bankName) completed++;
    // Business Operations
    if (profile.businessModel) completed++;
    // Compliance
    if (profile.hasAmlPolicy || profile.hasDataProtectionPolicy) completed++;
    // Documents (at least 3)
    if (uploadedFiles.length >= 3) completed++;
    return Math.round((completed / total) * 100);
  };
  const profileCompletion = calculateProfileCompletion();

  // Check which required documents are uploaded
  const isDocumentUploaded = (docType: string) => {
    return uploadedFiles.some(file => file.type === docType);
  };

  // Determine step statuses
  const isProfileComplete = profileCompletion >= 80;
  const uploadedRequiredCount = requiredDocumentTypes.filter(doc => isDocumentUploaded(doc.type)).length;
  const isDocumentsComplete = uploadedRequiredCount >= requiredDocuments;
  const canSubmit = isProfileComplete && isDocumentsComplete &&
    (profile?.certificationStatus === 'draft' || profile?.certificationStatus === 'revision_requested');

  const getStepStatus = (stepIndex: number): StepStatus => {
    switch (stepIndex) {
      case 0:
        return isProfileComplete ? 'complete' : 'incomplete';
      case 1:
        if (!isProfileComplete) return 'locked';
        return isDocumentsComplete ? 'complete' : 'incomplete';
      case 2:
        // If already submitted/under_review/certified, step 3 is complete
        if (isAlreadySubmitted) return 'complete';
        if (!isProfileComplete || !isDocumentsComplete) return 'locked';
        return canSubmit ? 'incomplete' : 'locked';
      default:
        return 'locked';
    }
  };

  const steps = [
    { id: 1, label: 'Profile Complete', description: 'Fill in all company information' },
    { id: 2, label: 'Documents Uploaded', description: 'Upload required documents' },
    { id: 3, label: 'Review & Submit', description: 'Final review and submission' },
  ].map((step, index) => ({
    ...step,
    status: getStepStatus(index),
  }));

  const handleSubmit = async () => {
    if (!canSubmit) return;

    try {
      setSubmitting(true);
      setError('');
      const result = await api.submitCertification();
      if (result.success) {
        setSuccessMessage('Application submitted successfully! Our team will review it shortly.');
        fetchProfile();
      } else {
        setError(result.message || 'Failed to submit application');
      }
    } catch (err) {
      setError('Failed to submit application');
    } finally {
      setSubmitting(false);
    }
  };

  // Profile sections completion - updated to match new fields
  const profileSections = profile ? [
    { name: 'Basic Information', done: !!(profile.companyName && profile.tradeLicenseNumber && profile.industrySector) },
    { name: 'Legal & Registration', done: !!(profile.registrationNumber && profile.legalStructure) },
    { name: 'Ownership', done: !!(profile.ownerName && profile.ownerNationality) },
    { name: 'Financial Information', done: !!(profile.fundingStage || profile.bankName) },
    { name: 'Business Operations', done: !!(profile.businessModel) },
    { name: 'Compliance', done: !!(profile.hasAmlPolicy || profile.hasDataProtectionPolicy) },
  ] : [];

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="h-16 rounded-xl animate-pulse" style={{ background: 'var(--graphite-200)' }} />
        <div className="solid-card rounded-2xl p-8 animate-pulse">
          <div className="h-8 rounded w-48 mb-8" style={{ background: 'var(--graphite-200)' }} />
          <div className="flex justify-between">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="w-10 h-10 rounded-full" style={{ background: 'var(--graphite-200)' }} />
                <div className="w-24 h-4 rounded mt-3" style={{ background: 'var(--graphite-200)' }} />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'var(--graphite-800)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Certification Application</h1>
            <p style={{ color: 'var(--graphite-400)' }}>Complete all requirements to submit your certification</p>
          </div>
          <Link
            href="/sme"
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
            style={{ background: 'var(--teal-600)', color: 'white' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Dashboard
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--success-50)', border: '1px solid var(--success-100)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--success-800)' }}>{successMessage}</p>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--danger-100)', color: 'var(--danger-600)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <p className="text-sm font-medium" style={{ color: 'var(--danger-800)' }}>{error}</p>
        </div>
      )}

      {/* Already Submitted Banner */}
      {profile && ['submitted', 'under_review', 'certified'].includes(profile.certificationStatus) && (
        <div
          className="rounded-xl p-4 flex items-center gap-3"
          style={{
            background: profile.certificationStatus === 'certified' ? 'var(--success-50)' : 'var(--teal-50)',
            border: `1px solid ${profile.certificationStatus === 'certified' ? 'var(--success-100)' : 'var(--teal-100)'}`
          }}
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
            style={{
              background: profile.certificationStatus === 'certified' ? 'var(--success-100)' : 'var(--teal-100)',
              color: profile.certificationStatus === 'certified' ? 'var(--success-600)' : 'var(--teal-600)'
            }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-semibold" style={{ color: profile.certificationStatus === 'certified' ? 'var(--success-800)' : 'var(--teal-800)' }}>
              {profile.certificationStatus === 'certified'
                ? 'Certification Status: Approved'
                : profile.certificationStatus === 'under_review'
                  ? 'Application Status: Under Review'
                  : 'Application Status: Submitted'}
            </p>
            <p className="text-xs mt-0.5" style={{ color: profile.certificationStatus === 'certified' ? 'var(--success-600)' : 'var(--teal-600)' }}>
              {profile.certificationStatus === 'certified'
                ? 'Your company now appears in the public SME registry'
                : 'Our team will review your application within 5-7 business days'}
            </p>
          </div>
        </div>
      )}

      {/* Progress Steps */}
      <div className="solid-card rounded-2xl p-6 md:p-8">
        <h2 className="text-lg font-bold mb-8" style={{ color: 'var(--graphite-900)' }}>Application Progress</h2>

        <div className="flex items-start justify-between">
          {steps.map((step, index) => {
            const isComplete = step.status === 'complete';
            const isLocked = step.status === 'locked';
            const prevComplete = index > 0 && steps[index - 1].status === 'complete';

            return (
              <div key={step.id} className="flex flex-col items-center flex-1 relative">
                {/* Connector line */}
                {index > 0 && (
                  <div
                    className="absolute top-5 right-1/2 h-0.5 w-full -translate-y-1/2"
                    style={{
                      background: prevComplete ? 'var(--teal-600)' : 'var(--graphite-200)',
                    }}
                  />
                )}

                {/* Step circle */}
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all relative z-10"
                  style={{
                    background: isComplete ? 'var(--teal-600)' : isLocked ? 'var(--graphite-100)' : 'white',
                    color: isComplete ? 'white' : isLocked ? 'var(--graphite-400)' : 'var(--teal-600)',
                    border: !isComplete && !isLocked ? '2px solid var(--teal-600)' : 'none',
                    boxShadow: isComplete ? '0 4px 12px rgba(74,143,135,0.3)' : 'none'
                  }}
                >
                  {isComplete ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    step.id
                  )}
                </div>
                <span className="mt-3 font-semibold text-sm text-center" style={{ color: isLocked ? 'var(--graphite-400)' : 'var(--graphite-900)' }}>
                  {step.label}
                </span>
                <span className="text-xs mt-1 text-center max-w-[120px]" style={{ color: 'var(--graphite-400)' }}>
                  {step.description}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Requirements Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Card */}
        <div className="solid-card rounded-2xl p-6">
          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: isProfileComplete ? 'var(--success-100)' : 'var(--warning-100)', color: isProfileComplete ? 'var(--success-600)' : 'var(--warning-600)' }}
            >
              {isProfileComplete ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ color: 'var(--graphite-900)' }}>Complete Your Profile</h3>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: isProfileComplete ? 'var(--success-50)' : 'var(--warning-50)',
                    color: isProfileComplete ? 'var(--success-700)' : 'var(--warning-700)'
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: isProfileComplete ? 'var(--success-500)' : 'var(--warning-500)' }} />
                  {isProfileComplete ? 'Complete' : 'In Progress'}
                </span>
              </div>
              <p className="text-sm mt-1.5" style={{ color: 'var(--graphite-500)' }}>Fill in all required company information to proceed</p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: 'var(--graphite-600)' }}>Profile Completion</span>
                  <span className="font-bold" style={{ color: isProfileComplete ? 'var(--success-600)' : 'var(--warning-600)' }}>{profileCompletion}%</span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${profileCompletion}%`, background: isProfileComplete ? 'var(--success-500)' : 'var(--warning-500)' }}
                  />
                </div>
              </div>

              <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: 'var(--graphite-500)' }}>Sections to Complete</h4>
                <div className="space-y-2">
                  {profileSections.map((section, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm">
                      {section.done ? (
                        <svg className="w-4 h-4" style={{ color: 'var(--success-500)' }} fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <div className="w-4 h-4 rounded-full" style={{ border: '2px solid var(--graphite-200)' }} />
                      )}
                      <span style={{ color: section.done ? 'var(--graphite-500)' : 'var(--graphite-700)', textDecoration: section.done ? 'line-through' : 'none' }}>{section.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/sme/profile"
                className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 font-semibold rounded-xl transition-all text-sm"
                style={{
                  background: isProfileComplete ? 'var(--graphite-100)' : 'var(--teal-600)',
                  color: isProfileComplete ? 'var(--graphite-600)' : 'white'
                }}
              >
                {isProfileComplete ? 'View Profile' : 'Continue Profile'}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </div>
        </div>

        {/* Documents Card */}
        <div className={`solid-card rounded-2xl p-6 ${!isProfileComplete ? 'opacity-60' : ''}`}>
          <div className="flex items-start gap-5">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{
                background: !isProfileComplete ? 'var(--graphite-100)' : isDocumentsComplete ? 'var(--success-100)' : 'var(--teal-100)',
                color: !isProfileComplete ? 'var(--graphite-400)' : isDocumentsComplete ? 'var(--success-600)' : 'var(--teal-600)'
              }}
            >
              {isDocumentsComplete ? (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg" style={{ color: 'var(--graphite-900)' }}>Upload Documents</h3>
                <span
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
                  style={{
                    background: !isProfileComplete ? 'var(--graphite-100)' : isDocumentsComplete ? 'var(--success-50)' : 'var(--teal-50)',
                    color: !isProfileComplete ? 'var(--graphite-500)' : isDocumentsComplete ? 'var(--success-700)' : 'var(--teal-700)'
                  }}
                >
                  {!isProfileComplete ? (
                    <>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Locked
                    </>
                  ) : (
                    <>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: isDocumentsComplete ? 'var(--success-500)' : 'var(--teal-600)' }} />
                      {isDocumentsComplete ? 'Complete' : 'In Progress'}
                    </>
                  )}
                </span>
              </div>
              <p className="text-sm mt-1.5" style={{ color: 'var(--graphite-500)' }}>Upload required business documents for verification</p>

              <div className="mt-5">
                <div className="flex items-center justify-between text-sm mb-2">
                  <span className="font-medium" style={{ color: !isProfileComplete ? 'var(--graphite-400)' : 'var(--graphite-600)' }}>Documents</span>
                  <span className="font-bold" style={{ color: !isProfileComplete ? 'var(--graphite-400)' : isDocumentsComplete ? 'var(--success-600)' : 'var(--teal-600)' }}>
                    {uploadedRequiredCount} / {requiredDocuments} required
                  </span>
                </div>
                <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${(uploadedRequiredCount / requiredDocuments) * 100}%`, background: isDocumentsComplete ? 'var(--success-500)' : 'var(--teal-600)' }}
                  />
                </div>
              </div>

              <div className="mt-5 pt-5" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                <h4 className="text-xs font-semibold uppercase tracking-wider mb-3" style={{ color: !isProfileComplete ? 'var(--graphite-400)' : 'var(--graphite-500)' }}>Required Documents</h4>
                <div className="space-y-2">
                  {requiredDocumentTypes.map((doc) => {
                    const isUploaded = isDocumentUploaded(doc.type);
                    return (
                      <div key={doc.type} className="flex items-center gap-2 text-sm" style={{ color: !isProfileComplete ? 'var(--graphite-400)' : 'var(--graphite-700)' }}>
                        {isUploaded ? (
                          <svg className="w-4 h-4" style={{ color: 'var(--success-500)' }} fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                        ) : (
                          <div className="w-4 h-4 rounded-full" style={{ border: `2px solid ${!isProfileComplete ? 'var(--graphite-200)' : 'var(--graphite-300)'}` }} />
                        )}
                        <span style={{ textDecoration: isUploaded ? 'line-through' : 'none', color: isUploaded ? 'var(--graphite-500)' : 'inherit' }}>{doc.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

              {isProfileComplete ? (
                <Link
                  href="/sme/profile?tab=documents"
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 font-semibold rounded-xl transition-all text-sm"
                  style={{
                    background: isDocumentsComplete ? 'var(--graphite-100)' : 'var(--teal-600)',
                    color: isDocumentsComplete ? 'var(--graphite-600)' : 'white'
                  }}
                >
                  {isDocumentsComplete ? 'View Documents' : 'Upload Documents'}
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              ) : (
                <button
                  disabled
                  className="inline-flex items-center gap-2 mt-5 px-5 py-2.5 font-semibold rounded-xl cursor-not-allowed text-sm"
                  style={{ background: 'var(--graphite-100)', color: 'var(--graphite-400)' }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Complete profile first
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Submit Section - Hide when already submitted/certified */}
      {!isAlreadySubmitted && (
        <div className="rounded-2xl p-6 md:p-8" style={{ background: 'var(--graphite-800)' }}>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div className="flex items-start gap-5">
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: canSubmit ? 'rgba(74,143,135,0.2)' : 'rgba(255,255,255,0.1)', color: canSubmit ? 'var(--teal-400)' : 'var(--graphite-400)' }}
              >
                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <h3 className="font-bold text-lg text-white">Ready to Submit?</h3>
                <p className="text-sm mt-1.5 max-w-md" style={{ color: 'var(--graphite-300)' }}>
                  {canSubmit
                    ? 'All requirements met! Submit your application for certification review.'
                    : 'Complete all requirements above to submit your certification application. Our team will review your application within 5-7 business days.'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSubmit}
              disabled={!canSubmit || submitting}
              className="px-6 py-3.5 font-semibold rounded-xl whitespace-nowrap transition-all"
              style={{
                background: canSubmit ? 'var(--teal-600)' : 'rgba(255,255,255,0.1)',
                color: canSubmit ? 'white' : 'var(--graphite-400)',
                cursor: canSubmit ? 'pointer' : 'not-allowed'
              }}
            >
              {submitting ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Submitting...
                </span>
              ) : (
                'Submit Application'
              )}
            </button>
          </div>
        </div>
      )}

      {/* Help Card */}
      <div className="solid-card rounded-2xl p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h3 className="font-bold" style={{ color: 'var(--graphite-900)' }}>Need Help with Your Application?</h3>
            <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>
              Our certification team is available to assist you throughout the process. Contact us for any questions or guidance.
            </p>
          </div>
          <Link href="/sme/support" className="px-5 py-2.5 rounded-xl whitespace-nowrap font-semibold transition-colors" style={{ background: 'var(--teal-600)', color: 'white' }}>
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
