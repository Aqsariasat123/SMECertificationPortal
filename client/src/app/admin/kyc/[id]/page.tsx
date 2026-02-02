'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KycApplication, KycStatus } from '@/types';

type KycReviewAction = 'approve' | 'reject' | 'request_revision';

export default function KycDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<KycApplication | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [notes, setNotes] = useState('');

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

  useEffect(() => {
    fetchKycDetail();
  }, [id]);

  const fetchKycDetail = async () => {
    try {
      setLoading(true);
      const result = await api.getKycApplicationDetail(id);
      if (result.success && result.data) {
        setApplication(result.data.application);
      } else {
        setError(result.message || 'Failed to load KYC application');
      }
    } catch (err) {
      setError('Failed to load KYC application');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: KycReviewAction) => {
    if ((action === 'reject' || action === 'request_revision') && !notes.trim()) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await api.reviewKycApplication(id, action, notes || undefined);
      if (result.success) {
        setShowRejectModal(false);
        setShowRevisionModal(false);
        setShowApproveModal(false);
        setNotes('');
        fetchKycDetail();
      } else {
        setError(result.message || 'Action failed');
      }
    } catch (err) {
      setError('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusConfig = (status: KycStatus) => {
    const configs: Record<KycStatus, { bg: string; text: string; dot: string; label: string }> = {
      not_submitted: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280', label: 'Not Submitted' },
      pending: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Pending Review' },
      approved: { bg: '#d1fae5', text: '#065f46', dot: '#10b981', label: 'Approved' },
      rejected: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Rejected' },
      revision_requested: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Revision Requested' },
    };
    return configs[status];
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getDocumentLabel = (type: string): string => {
    const labels: Record<string, string> = {
      emirates_id_front: 'Emirates ID (Front)',
      emirates_id_back: 'Emirates ID (Back)',
      passport: 'Passport',
      proof_of_address: 'Proof of Address',
      trade_license: 'Trade License',
      moa: 'Memorandum of Association',
      shareholder_register: 'Shareholder Register',
      board_resolution: 'Board Resolution',
      authorized_signatory: 'Authorized Signatory Letter',
    };
    return labels[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2" style={{ borderColor: 'var(--teal-600)' }}></div>
      </div>
    );
  }

  if (error || !application) {
    return (
      <div className="p-6 rounded-xl text-center" style={{ background: 'var(--danger-50)', color: 'var(--danger-600)' }}>
        <p className="font-medium">{error || 'KYC application not found'}</p>
        <button
          onClick={() => router.push('/admin/kyc')}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}
        >
          Back to KYC Applications
        </button>
      </div>
    );
  }

  const canTakeAction = application.kycStatus === 'pending';
  const statusConfig = getStatusConfig(application.kycStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'linear-gradient(to right, var(--teal-700), var(--teal-900))' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/kyc')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">{application.user.fullName}</h1>
              <p style={{ color: 'rgba(255,255,255,0.7)' }}>
                {application.investorType === 'individual' ? 'Individual Investor' : 'Company Investor'} KYC
              </p>
            </div>
          </div>
          <span
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold"
            style={{ background: statusConfig.bg, color: statusConfig.text }}
          >
            <span className="w-2 h-2 rounded-full" style={{ background: statusConfig.dot }} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      {canTakeAction && (
        <div className="solid-card rounded-xl p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Review Actions</h3>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setShowApproveModal(true)}
              className="px-5 py-2.5 rounded-xl font-semibold text-white transition-colors"
              style={{ background: 'var(--success-600)' }}
            >
              Approve KYC
            </button>
            <button
              onClick={() => setShowRevisionModal(true)}
              className="px-5 py-2.5 rounded-xl font-semibold transition-colors"
              style={{ background: 'var(--warning-100)', color: 'var(--warning-700)' }}
            >
              Request Revision
            </button>
            <button
              onClick={() => setShowRejectModal(true)}
              className="px-5 py-2.5 rounded-xl font-semibold transition-colors"
              style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}
            >
              Reject
            </button>
          </div>
        </div>
      )}

      {/* Review Notes */}
      {application.kycNotes && (
        <div className="rounded-xl p-5" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-100)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--warning-700)' }}>Review Notes</h3>
              <p className="mt-1" style={{ color: 'var(--warning-600)' }}>{application.kycNotes}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="xl:col-span-2 space-y-6">
          {/* Contact Information */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Full Name" value={application.user.fullName} />
              <InfoField label="Email" value={application.user.email} />
              <InfoField label="Phone" value={application.user.phoneNumber} />
              <InfoField label="Investor Type" value={application.investorType === 'individual' ? 'Individual' : 'Company'} />
            </div>
          </div>

          {application.investorType === 'individual' ? (
            <>
              {/* Personal Information */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                    </svg>
                  </div>
                  Personal Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField label="Nationality" value={application.nationality} />
                  <InfoField label="Date of Birth" value={formatDate(application.dateOfBirth)} />
                  <InfoField label="Emirates ID" value={application.emiratesId} />
                  <InfoField label="Passport Number" value={application.passportNumber} />
                  <InfoField label="Passport Expiry" value={formatDate(application.passportExpiry)} />
                </div>
              </div>

              {/* Address Information */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Address Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <InfoField label="Residential Address" value={application.residentialAddress} />
                  </div>
                  <InfoField label="City" value={application.city} />
                  <InfoField label="Country" value={application.country} />
                  <InfoField label="Postal Code" value={application.postalCode} />
                </div>
              </div>

              {/* Employment Information */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  Employment & Financial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField label="Employment Status" value={application.employmentStatus} />
                  <InfoField label="Employer Name" value={application.employerName} />
                  <InfoField label="Job Title" value={application.jobTitle} />
                  <InfoField label="Annual Income" value={application.annualIncome} />
                  <InfoField label="Source of Funds" value={application.sourceOfFunds} />
                  <InfoField label="Investment Experience" value={application.investmentExperience} />
                  <InfoField label="Risk Tolerance" value={application.riskTolerance} />
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Company Information */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  Company Information
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField label="Company Name" value={application.companyNameKyc} />
                  <InfoField label="Trade License Number" value={application.companyTradeLicense} />
                  <InfoField label="Registration Number" value={application.companyRegistrationNumber} />
                  <InfoField label="Incorporation Date" value={formatDate(application.companyIncorporationDate)} />
                  <InfoField label="Jurisdiction" value={application.companyJurisdiction} />
                </div>
              </div>

              {/* Company Address */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  Company Address
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="md:col-span-2">
                    <InfoField label="Address" value={application.companyAddress} />
                  </div>
                  <InfoField label="City" value={application.companyCity} />
                  <InfoField label="Country" value={application.companyCountry} />
                </div>
              </div>

              {/* Authorized Representative */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  Authorized Representative
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField label="Name" value={application.authorizedRepName} />
                  <InfoField label="Title" value={application.authorizedRepTitle} />
                  <InfoField label="Email" value={application.authorizedRepEmail} />
                  <InfoField label="Phone" value={application.authorizedRepPhone} />
                </div>
              </div>

              {/* Beneficial Owners */}
              {application.beneficialOwners && application.beneficialOwners.length > 0 && (
                <div className="solid-card rounded-xl p-6">
                  <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    Beneficial Owners
                  </h3>
                  <div className="space-y-4">
                    {application.beneficialOwners.map((owner, idx) => (
                      <div key={idx} className="p-4 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Name</label>
                            <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{owner.name}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Nationality</label>
                            <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{owner.nationality}</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Ownership %</label>
                            <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{owner.ownershipPercentage}%</p>
                          </div>
                          <div>
                            <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>ID Number</label>
                            <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{owner.idNumber}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Company Financial */}
              <div className="solid-card rounded-xl p-6">
                <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  Company Financial
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InfoField label="Bank Name" value={application.companyBankName} />
                  <InfoField label="Bank Account" value={application.companyBankAccountNumber} />
                  <InfoField label="Annual Revenue" value={application.companyAnnualRevenue} />
                  <InfoField label="Source of Funds" value={application.companySourceOfFunds} />
                </div>
              </div>
            </>
          )}

          {/* Documents */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              KYC Documents
            </h3>
            {application.kycDocuments && Object.keys(application.kycDocuments).length > 0 ? (
              <div className="space-y-3">
                {Object.entries(application.kycDocuments).map(([type, path]) => (
                  <div
                    key={type}
                    className="flex items-center justify-between p-4 rounded-xl transition-colors"
                    style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-100)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>{getDocumentLabel(type)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`${API_BASE_URL}${path}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </a>
                      <a
                        href={`${API_BASE_URL}${path}`}
                        download
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors flex items-center gap-2"
                        style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                        Download
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                <svg className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <p style={{ color: 'var(--graphite-500)' }}>No documents uploaded yet</p>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Timeline */}
          <div className="solid-card rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--warning-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Timeline
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Submitted</label>
                <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(application.kycSubmittedDate)}</p>
              </div>
              {application.kycReviewedDate && (
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Reviewed</label>
                  <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(application.kycReviewedDate)}</p>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="solid-card rounded-xl p-5">
            <h3 className="font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Quick Info</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Investor Type</span>
                <span className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>
                  {application.investorType === 'individual' ? 'Individual' : 'Company'}
                </span>
              </div>
              <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Status</span>
                <span className="text-sm font-semibold" style={{ color: statusConfig.text }}>
                  {statusConfig.label}
                </span>
              </div>
              {application.investorType === 'individual' ? (
                <>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Nationality</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>
                      {application.nationality || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Emirates ID</span>
                    <span className="text-sm font-semibold" style={{ color: application.emiratesId ? 'var(--success-600)' : 'var(--graphite-400)' }}>
                      {application.emiratesId ? 'Provided' : 'Missing'}
                    </span>
                  </div>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Company</span>
                    <span className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>
                      {application.companyNameKyc || 'N/A'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between py-2 px-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>Trade License</span>
                    <span className="text-sm font-semibold" style={{ color: application.companyTradeLicense ? 'var(--success-600)' : 'var(--graphite-400)' }}>
                      {application.companyTradeLicense ? 'Provided' : 'Missing'}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <Modal title="Approve KYC" onClose={() => setShowApproveModal(false)}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-6">
            Are you sure you want to approve the KYC for <strong>{application.user.fullName}</strong>? This will grant them verified investor status.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowApproveModal(false)} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={() => handleAction('approve')}
              disabled={actionLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--success-600)' }}
            >
              {actionLoading ? 'Processing...' : 'Confirm Approval'}
            </button>
          </div>
        </Modal>
      )}

      {showRejectModal && (
        <Modal title="Reject KYC" onClose={() => { setShowRejectModal(false); setNotes(''); }}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Please provide a reason for rejecting <strong>{application.user.fullName}</strong>&apos;s KYC application.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter rejection reason..."
            className="input-field w-full h-32 resize-none"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => { setShowRejectModal(false); setNotes(''); }} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={() => handleAction('reject')}
              disabled={actionLoading || !notes.trim()}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--danger-600)' }}
            >
              {actionLoading ? 'Processing...' : 'Reject KYC'}
            </button>
          </div>
        </Modal>
      )}

      {showRevisionModal && (
        <Modal title="Request Revision" onClose={() => { setShowRevisionModal(false); setNotes(''); }}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Please specify what changes <strong>{application.user.fullName}</strong> needs to make to their KYC application.
          </p>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Enter revision requirements..."
            className="input-field w-full h-32 resize-none"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => { setShowRevisionModal(false); setNotes(''); }} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={() => handleAction('request_revision')}
              disabled={actionLoading || !notes.trim()}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--warning-600)' }}
            >
              {actionLoading ? 'Processing...' : 'Request Revision'}
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}

// Helper Components
function InfoField({ label, value }: { label: string; value: string | null | undefined }) {
  return (
    <div>
      <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>{label}</label>
      <p className="mt-1 font-medium" style={{ color: value ? 'var(--graphite-800)' : 'var(--graphite-400)' }}>
        {value || 'Not provided'}
      </p>
    </div>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl">
        <h3 className="text-lg font-bold mb-4" style={{ color: 'var(--graphite-900)' }}>{title}</h3>
        {children}
      </div>
    </div>
  );
}
