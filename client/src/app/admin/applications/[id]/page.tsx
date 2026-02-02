'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminApplication, AuditLogEntry, CertificationStatus, ReviewAction } from '@/types';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<AdminApplication | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditLogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [visibilityLoading, setVisibilityLoading] = useState(false);

  useEffect(() => {
    fetchApplicationDetail();
  }, [id]);

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminApplicationDetail(id);
      if (result.success && result.data) {
        setApplication(result.data.application);
        setAuditHistory(result.data.auditHistory);
      } else {
        setError(result.message || 'Failed to load application');
      }
    } catch (err) {
      setError('Failed to load application');
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (action: ReviewAction) => {
    if ((action === 'reject' || action === 'request_revision') && !notes.trim()) {
      return;
    }

    try {
      setActionLoading(true);
      const result = await api.reviewApplication(id, action, notes || undefined);
      if (result.success) {
        setShowRejectModal(false);
        setShowRevisionModal(false);
        setShowApproveModal(false);
        setNotes('');
        fetchApplicationDetail();
      } else {
        setError(result.message || 'Action failed');
      }
    } catch (err) {
      setError('Action failed');
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleVisibility = async () => {
    if (!application) return;

    try {
      setVisibilityLoading(true);
      const result = await api.updateSMEVisibility(id, !application.listingVisible);
      if (result.success) {
        fetchApplicationDetail();
      } else {
        setError(result.message || 'Failed to update visibility');
      }
    } catch (err) {
      setError('Failed to update visibility');
    } finally {
      setVisibilityLoading(false);
    }
  };

  const getStatusConfig = (status: CertificationStatus) => {
    const configs: Record<CertificationStatus, { bg: string; text: string; dot: string; label: string }> = {
      draft: { bg: '#f3f4f6', text: '#374151', dot: '#6b7280', label: 'Draft' },
      submitted: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Pending Review' },
      under_review: { bg: '#e0efed', text: '#3a736d', dot: '#4a8f87', label: 'Under Review' },
      certified: { bg: '#d1fae5', text: '#065f46', dot: '#10b981', label: 'Certified' },
      rejected: { bg: '#fee2e2', text: '#991b1b', dot: '#ef4444', label: 'Rejected' },
      revision_requested: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Revision Requested' },
    };
    return configs[status];
  };

  const calculateCompletion = (app: AdminApplication) => {
    const fields = [
      app.companyName,
      app.tradeLicenseNumber,
      app.industrySector,
      app.companyDescription,
      app.registrationNumber,
      app.vatNumber,
      app.legalStructure,
      app.licenseExpiryDate,
      app.registrationCountry,
      app.registrationCity,
    ];
    const filled = fields.filter(f => f !== null && f !== undefined && f !== '').length;
    return Math.round((filled / fields.length) * 100);
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatSector = (sector: string | null) => {
    if (!sector) return 'Not specified';
    return sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getDocumentTypeLabel = (type: string): string => {
    const labels: Record<string, string> = {
      trade_license: 'Trade License',
      certificate_of_incorporation: 'Certificate of Incorporation',
      financial_statements: 'Financial Statements',
      company_profile: 'Company Profile / Brochure',
    };
    return labels[type] || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

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
        <p className="font-medium">{error || 'Application not found'}</p>
        <button
          onClick={() => router.push('/admin/applications')}
          className="mt-4 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
          style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}
        >
          Back to Applications
        </button>
      </div>
    );
  }

  const canStartReview = application.certificationStatus === 'submitted';
  const canTakeAction = application.certificationStatus === 'under_review';
  const statusConfig = getStatusConfig(application.certificationStatus);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div
        className="rounded-2xl p-6 text-white relative overflow-hidden"
        style={{ background: 'var(--graphite-800)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/admin/applications')}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: 'rgba(255,255,255,0.1)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div>
              <h1 className="text-2xl font-bold">{application.companyName || 'Unnamed Company'}</h1>
              <p style={{ color: 'var(--graphite-400)' }}>Application #{application.id.slice(0, 8)}</p>
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
      {(canStartReview || canTakeAction) && (
        <div className="solid-card rounded-xl p-5">
          <h3 className="font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Review Actions</h3>
          <div className="flex flex-wrap gap-3">
            {canStartReview && (
              <button
                onClick={() => handleAction('start_review')}
                disabled={actionLoading}
                className="btn-primary px-5 py-2.5 rounded-xl font-semibold disabled:opacity-50"
              >
                {actionLoading ? 'Processing...' : 'Start Review'}
              </button>
            )}
            {canTakeAction && (
              <>
                <button
                  onClick={() => setShowApproveModal(true)}
                  className="px-5 py-2.5 rounded-xl font-semibold text-white transition-colors"
                  style={{ background: 'var(--success-600)' }}
                >
                  Approve
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
              </>
            )}
          </div>
        </div>
      )}

      {/* Revision Notes */}
      {application.revisionNotes && (
        <div className="rounded-xl p-5" style={{ background: 'var(--warning-50)', border: '1px solid var(--warning-100)' }}>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--warning-700)' }}>Review Notes</h3>
              <p className="mt-1" style={{ color: 'var(--warning-600)' }}>{application.revisionNotes}</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
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
              <InfoField label="Company Name" value={application.companyName} />
              <InfoField label="Trade License" value={application.tradeLicenseNumber} />
              <InfoField label="Industry Sector" value={formatSector(application.industrySector)} />
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Profile Completion</label>
                <div className="mt-2 flex items-center gap-3">
                  <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                    <div className="h-full rounded-full" style={{ width: `${calculateCompletion(application)}%`, background: 'var(--teal-600)' }} />
                  </div>
                  <span className="text-sm font-bold" style={{ color: 'var(--teal-600)' }}>{calculateCompletion(application)}%</span>
                </div>
              </div>
              <div className="md:col-span-2">
                <InfoField label="Description" value={application.companyDescription} />
              </div>
            </div>
          </div>

          {/* Legal & Registration */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              Legal & Registration
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Registration Number" value={application.registrationNumber} />
              <InfoField label="VAT Number" value={application.vatNumber} />
              <InfoField label="Legal Structure" value={formatSector(application.legalStructure)} />
              <InfoField label="License Expiry" value={application.licenseExpiryDate ? formatDate(application.licenseExpiryDate) : null} />
              <InfoField label="Registration Country" value={application.registrationCountry} />
              <InfoField label="Registration City" value={application.registrationCity} />
            </div>
          </div>

          {/* Ownership & Management */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              Ownership & Management
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Owner Name" value={application.ownerName} />
              <InfoField label="Owner Nationality" value={application.ownerNationality} />
              <InfoField label="Owner ID Number" value={application.ownerIdNumber} />
              {application.shareholderStructure && application.shareholderStructure.length > 0 && (
                <div className="md:col-span-2">
                  <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Shareholders</label>
                  <div className="mt-2 space-y-1">
                    {application.shareholderStructure.map((sh, idx) => (
                      <p key={idx} style={{ color: 'var(--graphite-800)' }}>{sh.name} ({sh.nationality}) - {sh.percentage}%</p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Financial Information */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Financial Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Annual Revenue" value={application.annualRevenue ? `$${Number(application.annualRevenue).toLocaleString()}` : null} />
              <InfoField label="Funding Stage" value={formatSector(application.fundingStage)} />
              <InfoField label="Bank Name" value={application.bankName} />
              <InfoField label="Auditor Name" value={application.auditorName} />
              <InfoField label="Last Audit Date" value={application.lastAuditDate ? formatDate(application.lastAuditDate) : null} />
              <InfoField label="Profit Margin" value={application.profitMargin ? `${application.profitMargin}%` : null} />
            </div>
          </div>

          {/* Business Operations */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              Business Operations
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Business Model" value={formatSector(application.businessModel)} />
              <InfoField label="Office Type" value={formatSector(application.officeType)} />
              <InfoField label="Employee Count" value={application.employeeCount?.toString()} />
              <InfoField label="Founding Date" value={application.foundingDate ? formatDate(application.foundingDate) : null} />
              <InfoField label="Website" value={application.website} />
              <InfoField label="Address" value={application.address} />
              {application.operatingCountries && application.operatingCountries.length > 0 && (
                <div className="md:col-span-2">
                  <InfoField label="Operating Countries" value={application.operatingCountries.join(', ')} />
                </div>
              )}
            </div>
          </div>

          {/* Compliance */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              Compliance & Policies
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>AML Policy</label>
                <p className="mt-1 font-medium" style={{ color: application.hasAmlPolicy ? 'var(--success-600)' : 'var(--graphite-400)' }}>
                  {application.hasAmlPolicy ? '✓ Yes' : '✗ No'}
                </p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Data Protection Policy</label>
                <p className="mt-1 font-medium" style={{ color: application.hasDataProtectionPolicy ? 'var(--success-600)' : 'var(--graphite-400)' }}>
                  {application.hasDataProtectionPolicy ? '✓ Yes' : '✗ No'}
                </p>
              </div>
              <InfoField label="Compliance Officer" value={application.complianceOfficerName} />
              <InfoField label="Compliance Email" value={application.complianceOfficerEmail} />
            </div>
          </div>

          {/* Documents */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Uploaded Documents
            </h3>
            {application.documents?.uploadedFiles && application.documents.uploadedFiles.length > 0 ? (
              <div className="space-y-3">
                {application.documents.uploadedFiles.map((doc: { id?: string; type?: string; name?: string; originalName?: string; path?: string; size?: number }, idx: number) => (
                  <div
                    key={doc.id || idx}
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
                        <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>{getDocumentTypeLabel(doc.type || '')}</p>
                        <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>{doc.originalName || doc.name}</p>
                        {doc.size && <p className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatFileSize(doc.size)}</p>}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <a
                        href={`${API_BASE_URL}${doc.path}`}
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
                        href={`${API_BASE_URL}${doc.path}`}
                        download={doc.originalName || doc.name}
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

          {/* Applicant Information */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="font-semibold mb-5 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              Applicant Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <InfoField label="Full Name" value={application.user.fullName} />
              <InfoField label="Email" value={application.user.email} />
              <InfoField label="Phone" value={application.user.phoneNumber} />
              {application.reviewedBy && <InfoField label="Reviewed By" value={application.reviewedBy.fullName} />}
              {application.secondaryContactName && (
                <>
                  <InfoField label="Secondary Contact" value={application.secondaryContactName} />
                  <InfoField label="Secondary Email" value={application.secondaryContactEmail} />
                </>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Registry Visibility */}
          {application.certificationStatus === 'certified' && (
            <div className="solid-card rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--success-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Registry Visibility
              </h3>
              <p className="text-sm mb-4" style={{ color: 'var(--graphite-500)' }}>
                Control whether this SME appears in the public registry.
              </p>
              <div className="flex items-center justify-between p-4 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ background: application.listingVisible ? 'var(--success-500)' : 'var(--graphite-300)' }} />
                  <span className="font-medium" style={{ color: 'var(--graphite-700)' }}>
                    {application.listingVisible ? 'Visible' : 'Hidden'}
                  </span>
                </div>
                <button
                  onClick={handleToggleVisibility}
                  disabled={visibilityLoading}
                  className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                  style={{
                    background: application.listingVisible ? 'var(--graphite-200)' : 'var(--success-600)',
                    color: application.listingVisible ? 'var(--graphite-700)' : 'white'
                  }}
                >
                  {visibilityLoading ? 'Updating...' : application.listingVisible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          )}

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
                <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(application.submittedDate)}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Last Updated</label>
                <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(application.updatedAt)}</p>
              </div>
              <div>
                <label className="text-xs font-medium uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Created</label>
                <p className="mt-1 font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(application.createdAt)}</p>
              </div>
            </div>
          </div>

          {/* Activity Log */}
          <div className="solid-card rounded-xl p-5">
            <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
              <svg className="w-5 h-5" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Activity Log
            </h3>
            {auditHistory.length === 0 ? (
              <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>No activity recorded yet.</p>
            ) : (
              <div className="space-y-3">
                {auditHistory.slice(0, 5).map((log) => (
                  <div key={log.id} className="pl-4 py-1" style={{ borderLeft: '2px solid var(--graphite-200)' }}>
                    <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>{log.actionDescription}</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--graphite-500)' }}>
                      {log.user.fullName} - {formatDate(log.timestamp)}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modals */}
      {showApproveModal && (
        <Modal title="Approve Certification" onClose={() => setShowApproveModal(false)}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-6">
            Are you sure you want to approve the certification for <strong>{application.companyName}</strong>?
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
        <Modal title="Reject Application" onClose={() => { setShowRejectModal(false); setNotes(''); }}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Please provide a reason for rejecting <strong>{application.companyName}</strong>&apos;s application.
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
              {actionLoading ? 'Processing...' : 'Reject Application'}
            </button>
          </div>
        </Modal>
      )}

      {showRevisionModal && (
        <Modal title="Request Revision" onClose={() => { setShowRevisionModal(false); setNotes(''); }}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Please specify what changes <strong>{application.companyName}</strong> needs to make.
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
