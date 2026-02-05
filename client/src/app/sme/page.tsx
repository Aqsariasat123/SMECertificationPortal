'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { CertificationStatus, SMEProfileData } from '@/types';

export default function SMEDashboardPage() {
  const [profile, setProfile] = useState<SMEProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  // Phase 1: Introduction requests hidden (Read-Only mode)
  // const [introRequestsCount, setIntroRequestsCount] = useState(0);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [supportForm, setSupportForm] = useState({ subject: '', message: '' });
  const [sendingSupport, setSendingSupport] = useState(false);
  const [downloadingCert, setDownloadingCert] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    const handleOpenSupport = () => setShowSupportModal(true);
    window.addEventListener('openSupportModal', handleOpenSupport);
    return () => window.removeEventListener('openSupportModal', handleOpenSupport);
  }, []);

  const handleSupportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportForm.subject.trim() || !supportForm.message.trim()) return;

    setSendingSupport(true);
    try {
      const result = await api.createSupportTicket(supportForm.subject, supportForm.message);
      if (result.success) {
        setSuccessMessage('Support request sent successfully! Our team will contact you soon. Check your Messages for replies.');
        setSupportForm({ subject: '', message: '' });
        setShowSupportModal(false);
      } else {
        setError(result.message || 'Failed to send support request');
      }
    } catch (err) {
      setError('Failed to send support request. Please try again.');
    } finally {
      setSendingSupport(false);
    }
  };

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const profileResult = await api.getSMEProfile();

      if (profileResult.success && profileResult.data) {
        setProfile(profileResult.data);

        // Phase 1: Introduction requests hidden (Read-Only mode)
        // try {
        //   const introResult = await api.getSMEIntroductionRequests();
        //   if (introResult.success && introResult.data) {
        //     setIntroRequestsCount(introResult.data.count);
        //   }
        // } catch {
        //   console.log('Could not load introduction requests');
        // }
      } else {
        setError(profileResult.message || 'Failed to load profile');
      }
    } catch (err) {
      setError('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleResubmit = async () => {
    try {
      setSubmitLoading(true);
      setError('');
      const result = await api.submitCertification();
      if (result.success) {
        setSuccessMessage('Application resubmitted successfully!');
        fetchProfile();
      } else {
        setError(result.message || 'Failed to resubmit application');
      }
    } catch (err) {
      setError('Failed to resubmit application');
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDownloadCertificate = async () => {
    try {
      setDownloadingCert(true);
      await api.downloadCertificate();
    } catch (err) {
      setError('Failed to download certificate. Please try again.');
    } finally {
      setDownloadingCert(false);
    }
  };

  const certificationStatus: CertificationStatus = profile?.certificationStatus || 'draft';
  const revisionNotes = profile?.revisionNotes;

  const getStatusConfig = (status: CertificationStatus) => {
    const config: Record<CertificationStatus, { bg: string; border: string; textColor: string; label: string; description: string; icon: React.ReactNode }> = {
      draft: {
        bg: 'var(--graphite-50)',
        border: 'var(--graphite-200)',
        textColor: 'var(--graphite-700)',
        label: 'Draft',
        description: 'Complete your company profile to submit for certification',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      },
      submitted: {
        bg: 'var(--teal-50)',
        border: 'var(--teal-200)',
        textColor: 'var(--teal-700)',
        label: 'Submitted',
        description: 'Your application has been submitted and is awaiting review',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      },
      under_review: {
        bg: 'var(--warning-50)',
        border: 'var(--warning-100)',
        textColor: 'var(--warning-600)',
        label: 'Under Review',
        description: 'Our certification team is carefully reviewing your application',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      },
      certified: {
        bg: 'var(--success-50)',
        border: 'var(--success-100)',
        textColor: 'var(--success-600)',
        label: 'Certified',
        description: 'Your company has been verified and is now listed in the official registry',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
      },
      rejected: {
        bg: 'var(--danger-50)',
        border: 'var(--danger-100)',
        textColor: 'var(--danger-600)',
        label: 'Rejected',
        description: 'Your application was not approved. Please review the feedback below',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      },
      revision_requested: {
        bg: 'var(--warning-50)',
        border: 'var(--warning-100)',
        textColor: 'var(--warning-600)',
        label: 'Revision Requested',
        description: 'Please update your application based on the feedback provided below',
        icon: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
      },
    };
    return config[status];
  };

  const statusConfig = getStatusConfig(certificationStatus);

  const getCompletionItems = () => {
    if (!profile) return [];

    const docs = profile.documents || {};
    const uploadedFiles = docs.uploadedFiles || [];

    return [
      {
        label: 'Basic Information',
        completed: !!(profile.companyName && profile.tradeLicenseNumber && profile.industrySector),
        description: 'Company name, license, industry'
      },
      {
        label: 'Legal & Registration',
        completed: !!(profile.registrationNumber && profile.legalStructure),
        description: 'Registration number, legal structure'
      },
      {
        label: 'Ownership',
        completed: !!(profile.ownerName && profile.ownerNationality),
        description: 'Owner details, nationality'
      },
      {
        label: 'Financial Information',
        completed: !!(profile.fundingStage || profile.bankName),
        description: 'Funding stage, bank details'
      },
      {
        label: 'Business Operations',
        completed: !!(profile.businessModel),
        description: 'Business model, office type'
      },
      {
        label: 'Compliance',
        completed: !!(profile.hasAmlPolicy || profile.hasDataProtectionPolicy),
        description: 'AML policy, data protection'
      },
      {
        label: 'Documents Upload',
        completed: uploadedFiles.length >= 3,
        description: 'Trade license, certificates'
      },
    ];
  };

  const completionItems = getCompletionItems();

  // Calculate profile completion dynamically from checklist items
  const completedCount = completionItems.filter(item => item.completed).length;
  const profileCompletion = completionItems.length > 0 ? Math.round((completedCount / completionItems.length) * 100) : 0;

  const getStatIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      chat: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>,
      eye: <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>,
    };
    return icons[icon];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--teal-600)' }}></div>
      </div>
    );
  }

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';
  const companyName = profile?.companyName || 'there';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, var(--graphite-800) 0%, var(--graphite-900) 100%)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--graphite-400)' }}>{greeting}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome back, {companyName}!
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>
              {certificationStatus === 'certified'
                ? 'Your company is certified and visible in the registry'
                : 'Manage your certification and company profile'}
            </p>
          </div>
          <Link
            href="/sme/profile"
            className="btn-teal inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            {certificationStatus === 'certified' ? 'View Profile' : 'Complete Profile'}
          </Link>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="rounded-lg p-4 flex items-center gap-3" style={{ background: 'var(--teal-50)', border: '1px solid var(--teal-200)' }}>
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: 'var(--teal-700)' }}>{successMessage}</span>
          <button onClick={() => setSuccessMessage('')} className="ml-auto" style={{ color: 'var(--teal-600)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="rounded-lg p-4 flex items-center gap-3" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
          <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--danger-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span style={{ color: 'var(--danger-600)' }}>{error}</span>
          <button onClick={() => setError('')} className="ml-auto" style={{ color: 'var(--danger-500)' }}>
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Status Banner */}
      <div className="rounded-xl p-5 relative overflow-hidden" style={{ background: statusConfig.bg, border: `1px solid ${statusConfig.border}` }}>
        {certificationStatus === 'certified' && (
          <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(74, 147, 98, 0.1)' }} />
        )}
        <div className="flex flex-col gap-4 relative">
          <div className="flex items-start gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm"
              style={{ background: 'white', color: statusConfig.textColor }}
            >
              {statusConfig.icon}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 flex-wrap">
                <h2 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Certification Status</h2>
                <span
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold w-fit"
                  style={{ background: 'white', color: statusConfig.textColor, boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >
                  <span className="w-2 h-2 rounded-full" style={{ background: statusConfig.textColor }} />
                  {statusConfig.label}
                </span>
              </div>
              <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>{statusConfig.description}</p>
              {profile?.submittedDate && certificationStatus !== 'draft' && (
                <p className="text-xs mt-2" style={{ color: 'var(--graphite-500)' }}>
                  Submitted on {formatDate(profile.submittedDate)}
                </p>
              )}
            </div>
          </div>

          {/* CTA Buttons based on status */}
          {certificationStatus === 'draft' && (
            <Link
              href="/sme/profile"
              className="btn-teal inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium w-full sm:w-auto sm:self-start"
            >
              Complete Application
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}

          {certificationStatus === 'certified' && (
            <button
              onClick={handleDownloadCertificate}
              disabled={downloadingCert}
              className="btn-teal inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium w-full sm:w-auto sm:self-start disabled:opacity-50"
            >
              {downloadingCert ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download Certificate
                </>
              )}
            </button>
          )}

          {certificationStatus === 'revision_requested' && (
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/sme/profile"
                className="btn-secondary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium"
              >
                Edit Application
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </Link>
              <button
                onClick={handleResubmit}
                disabled={submitLoading}
                className="btn-primary inline-flex items-center justify-center gap-2 px-5 py-3 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {submitLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    Resubmit Application
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          )}

        </div>
      </div>

      {/* Revision Notes Alert */}
      {(certificationStatus === 'revision_requested' || certificationStatus === 'rejected') && revisionNotes && (
        <div
          className="rounded-lg p-5"
          style={{
            background: certificationStatus === 'rejected' ? 'var(--danger-50)' : 'var(--warning-50)',
            border: `1px solid ${certificationStatus === 'rejected' ? 'var(--danger-100)' : 'var(--warning-100)'}`
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
              style={{
                background: certificationStatus === 'rejected' ? 'var(--danger-100)' : 'var(--warning-100)',
                color: certificationStatus === 'rejected' ? 'var(--danger-600)' : 'var(--warning-600)'
              }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold" style={{ color: certificationStatus === 'rejected' ? 'var(--danger-600)' : 'var(--warning-600)' }}>
                {certificationStatus === 'rejected' ? 'Rejection Reason' : 'Revision Required'}
              </h3>
              <p className="mt-2 text-sm" style={{ color: certificationStatus === 'rejected' ? 'var(--danger-600)' : 'var(--warning-600)' }}>
                {revisionNotes}
              </p>
              {certificationStatus === 'revision_requested' && (
                <p className="mt-3 text-sm" style={{ color: 'var(--warning-500)' }}>
                  Please address the above feedback and resubmit your application.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Completion */}
        <div className="lg:col-span-2 bg-white rounded-xl p-6 border border-slate-200 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Profile Completion</h2>
              <p className="text-sm mt-0.5 text-slate-500">Complete all sections to submit for certification</p>
            </div>
            <div className="flex items-center gap-3 bg-slate-50 px-4 py-2 rounded-xl">
              <div className="text-right">
                <p className="text-2xl font-bold text-slate-900">{profileCompletion}%</p>
                <p className="text-xs text-slate-500">Complete</p>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: `conic-gradient(var(--teal-600) ${profileCompletion * 3.6}deg, var(--graphite-100) 0deg)` }}>
                <div className="w-9 h-9 rounded-full bg-slate-50 flex items-center justify-center">
                  <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mb-6">
            <div className="h-2 rounded-full overflow-hidden bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-teal-600 to-cyan-500"
                style={{ width: `${profileCompletion}%` }}
              />
            </div>
          </div>

          {/* Checklist */}
          <div className="space-y-2.5">
            {completionItems.map((item, index) => (
              <div
                key={index}
                className="flex items-start sm:items-center gap-3 p-3 rounded-lg transition-all duration-200"
                style={{
                  background: item.completed ? 'var(--success-50)' : 'var(--graphite-50)',
                  border: `1px solid ${item.completed ? 'var(--success-100)' : 'var(--graphite-100)'}`
                }}
              >
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{
                    background: item.completed ? 'var(--success-500)' : 'var(--graphite-200)',
                    color: item.completed ? 'white' : 'var(--graphite-600)'
                  }}
                >
                  {item.completed ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <span className="text-xs font-semibold">{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-sm" style={{ color: item.completed ? 'var(--success-600)' : 'var(--graphite-900)' }}>
                    {item.label}
                  </p>
                  <p className="text-xs" style={{ color: item.completed ? 'var(--success-500)' : 'var(--foreground-muted)' }}>
                    {item.description}
                  </p>
                </div>
                {!item.completed && (certificationStatus === 'draft' || certificationStatus === 'revision_requested') && (
                  <Link
                    href="/sme/profile"
                    className="px-3 py-1.5 text-xs font-medium rounded-lg transition-colors flex-shrink-0"
                    style={{ color: 'var(--teal-600)' }}
                  >
                    Complete
                  </Link>
                )}
              </div>
            ))}
          </div>

          {(certificationStatus === 'draft' || certificationStatus === 'revision_requested') && (
            <Link
              href="/sme/profile"
              className="btn-secondary inline-flex items-center justify-center gap-2 mt-5 px-4 py-2.5 rounded-lg text-sm font-medium w-full sm:w-auto"
            >
              {certificationStatus === 'revision_requested' ? 'Update Profile' : 'Continue Profile Setup'}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Company Info Card */}
          {profile?.companyName && (
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-teal-400 to-cyan-500" />
              <div className="flex items-center gap-3 mb-4">
                <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-600/20">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900">Your Company</h3>
                  {certificationStatus === 'certified' && (
                    <span className="inline-flex items-center gap-1 text-xs text-emerald-600">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      Certified
                    </span>
                  )}
                </div>
              </div>
              <p className="font-bold text-lg text-slate-800">{profile.companyName}</p>
              {profile.industrySector && (
                <p className="text-sm mt-1 capitalize text-slate-500">
                  {profile.industrySector.replace('_', ' ')}
                </p>
              )}
              {profile.tradeLicenseNumber && (
                <div className="mt-4 pt-4 border-t border-slate-100">
                  <p className="text-xs text-slate-400">Trade License</p>
                  <p className="text-sm font-semibold text-slate-700 mt-0.5">{profile.tradeLicenseNumber}</p>
                </div>
              )}
            </div>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 gap-4">
            {/* Phase 1: Introduction Requests Card hidden (Read-Only mode) */}
            {/* <Link
              href="/sme/messages"
              className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden hover:shadow-md transition-all group"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-violet-400 to-purple-500" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">{introRequestsCount}</p>
                  <p className="text-sm text-slate-500 mt-1">Introduction Requests</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-50 to-purple-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
              </div>
              <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  {introRequestsCount === 0 ? 'No requests yet' : `${introRequestsCount} request${introRequestsCount > 1 ? 's' : ''} received`}
                </p>
                <svg className="w-4 h-4 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link> */}

            {/* Registry Status Card */}
            <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-green-500" />
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {certificationStatus === 'certified' ? (profile?.listingVisible ? 'Visible' : 'Hidden') : 'N/A'}
                  </p>
                  <p className="text-sm text-slate-500 mt-1">Registry Status</p>
                </div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-400">
                  {certificationStatus === 'certified' ? 'In public registry' : 'Visible after certification'}
                </p>
              </div>
            </div>
          </div>

          {/* Help Card */}
          <div className="rounded-lg p-5 text-white relative overflow-hidden" style={{ background: 'var(--graphite-800)' }}>
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full -translate-y-1/2 translate-x-1/2" style={{ background: 'rgba(255,255,255,0.05)' }} />
            <div className="relative">
              <div className="w-12 h-12 rounded-lg flex items-center justify-center mb-4" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg">Need Assistance?</h3>
              <p className="text-sm mt-2 leading-relaxed" style={{ color: 'var(--graphite-400)' }}>
                Our certification team is here to help you through the process.
              </p>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('openSupportModal'))}
                className="mt-5 w-full px-4 py-3 rounded-lg font-medium text-sm transition-all flex items-center justify-center gap-2"
                style={{ background: 'var(--teal-600)', color: 'white' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Support Form Modal */}
      {showSupportModal && (
        <>
          <div
            className="modal-backdrop fixed inset-0 z-50"
            onClick={() => setShowSupportModal(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="modal-glass rounded-lg w-full max-w-lg relative">
              {/* Header */}
              <div className="flex items-center justify-between p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-600)' }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Contact Support</h3>
                    <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>We&apos;ll get back to you shortly</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSupportModal(false)}
                  className="p-2 rounded-lg transition-colors"
                  style={{ color: 'var(--graphite-400)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {/* Form */}
              <form onSubmit={handleSupportSubmit} className="p-5 space-y-4">
                <div>
                  <label className="input-label block">Subject</label>
                  <input
                    type="text"
                    value={supportForm.subject}
                    onChange={(e) => setSupportForm({ ...supportForm, subject: e.target.value })}
                    placeholder="What do you need help with?"
                    className="input-field w-full"
                    required
                  />
                </div>
                <div>
                  <label className="input-label block">Message</label>
                  <textarea
                    value={supportForm.message}
                    onChange={(e) => setSupportForm({ ...supportForm, message: e.target.value })}
                    placeholder="Describe your issue or question in detail..."
                    rows={5}
                    className="input-field w-full resize-none"
                    style={{ height: 'auto', padding: '0.75rem' }}
                    required
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowSupportModal(false)}
                    className="btn-secondary flex-1 h-10 rounded-lg text-sm font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={sendingSupport || !supportForm.subject.trim() || !supportForm.message.trim()}
                    className="btn-teal flex-1 h-10 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {sendingSupport ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        Send Message
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
