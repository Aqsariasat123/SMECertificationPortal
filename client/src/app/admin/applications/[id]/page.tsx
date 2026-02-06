'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminApplication, AuditLogEntry, CertificationStatus, ReviewAction, CertificateData, InternalDimensions, DimensionStatus, PaymentData } from '@/types';

export default function ApplicationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [application, setApplication] = useState<AdminApplication | null>(null);
  const [auditHistory, setAuditHistory] = useState<AuditLogEntry[]>([]);
  const [certificate, setCertificate] = useState<CertificateData | null>(null);
  const [payment, setPayment] = useState<PaymentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Modal states
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [showRevisionModal, setShowRevisionModal] = useState(false);
  const [showApproveModal, setShowApproveModal] = useState(false);
  const [showRevokeModal, setShowRevokeModal] = useState(false);
  const [showReissueModal, setShowReissueModal] = useState(false);
  const [showRequestPaymentModal, setShowRequestPaymentModal] = useState(false);
  const [showCancelPaymentModal, setShowCancelPaymentModal] = useState(false);
  const [notes, setNotes] = useState('');
  const [revokeReason, setRevokeReason] = useState('');
  const [visibilityLoading, setVisibilityLoading] = useState(false);
  const [certActionLoading, setCertActionLoading] = useState(false);
  const [paymentActionLoading, setPaymentActionLoading] = useState(false);

  // Internal Review state
  const [internalDimensions, setInternalDimensions] = useState<InternalDimensions>({
    legal_ownership: 'not_reviewed',
    financial_discipline: 'not_reviewed',
    business_model: 'not_reviewed',
    governance_controls: 'not_reviewed',
    risk_continuity: 'not_reviewed',
  });
  const [internalNotes, setInternalNotes] = useState('');
  const [internalReviewLoading, setInternalReviewLoading] = useState(false);
  const [internalReviewSaving, setInternalReviewSaving] = useState(false);
  const [lastInternalReviewAt, setLastInternalReviewAt] = useState<string | null>(null);

  useEffect(() => {
    fetchApplicationDetail();
    fetchInternalReview();
  }, [id]);

  // Fetch payment when application is loaded and certified
  useEffect(() => {
    if (application?.certificationStatus === 'certified' && application?.id) {
      fetchPaymentData();
    }
  }, [application?.certificationStatus, application?.id]);

  const fetchInternalReview = async () => {
    try {
      setInternalReviewLoading(true);
      const result = await api.getInternalReview(id);
      if (result.success && result.data) {
        setInternalDimensions(result.data.dimensions);
        setInternalNotes(result.data.internalNotes || '');
        setLastInternalReviewAt(result.data.lastInternalReviewAt);
      }
    } catch (err) {
      console.error('Failed to fetch internal review:', err);
    } finally {
      setInternalReviewLoading(false);
    }
  };

  const handleDimensionChange = async (dimension: keyof InternalDimensions, value: DimensionStatus) => {
    // Optimistic update
    const prevDimensions = { ...internalDimensions };
    setInternalDimensions({ ...internalDimensions, [dimension]: value });

    try {
      setInternalReviewSaving(true);
      const result = await api.updateInternalReview(id, { dimensions: { [dimension]: value } });
      if (result.success && result.data) {
        setLastInternalReviewAt(result.data.lastInternalReviewAt);
      } else {
        // Revert on failure
        setInternalDimensions(prevDimensions);
        setError(result.message || 'Failed to save dimension status');
      }
    } catch (err) {
      setInternalDimensions(prevDimensions);
      setError('Failed to save dimension status');
    } finally {
      setInternalReviewSaving(false);
    }
  };

  const handleNotesBlur = async () => {
    try {
      setInternalReviewSaving(true);
      const result = await api.updateInternalReview(id, { internalNotes });
      if (result.success && result.data) {
        setLastInternalReviewAt(result.data.lastInternalReviewAt);
      }
    } catch (err) {
      console.error('Failed to save notes:', err);
    } finally {
      setInternalReviewSaving(false);
    }
  };

  const fetchApplicationDetail = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminApplicationDetail(id);
      if (result.success && result.data) {
        setApplication(result.data.application);
        setAuditHistory(result.data.auditHistory);
        // Handle certificate data from backend (extended response)
        const extendedData = result.data as { application: AdminApplication; auditHistory: AuditLogEntry[]; certificate?: CertificateData };
        if (extendedData.certificate) {
          setCertificate(extendedData.certificate);
        }
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

  const handleRevokeCertificate = async () => {
    if (!certificate) return;

    try {
      setCertActionLoading(true);
      const result = await api.revokeCertificate(certificate.certificateId, revokeReason || undefined);
      if (result.success) {
        setShowRevokeModal(false);
        setRevokeReason('');
        fetchApplicationDetail();
      } else {
        setError(result.message || 'Failed to revoke certificate');
      }
    } catch (err) {
      setError('Failed to revoke certificate');
    } finally {
      setCertActionLoading(false);
    }
  };

  const handleReissueCertificate = async () => {
    if (!certificate) return;

    try {
      setCertActionLoading(true);
      const result = await api.reissueCertificate(certificate.certificateId);
      if (result.success) {
        setShowReissueModal(false);
        fetchApplicationDetail();
      } else {
        setError(result.message || 'Failed to reissue certificate');
      }
    } catch (err) {
      setError('Failed to reissue certificate');
    } finally {
      setCertActionLoading(false);
    }
  };

  // Payment functions
  const fetchPaymentData = async () => {
    if (!application?.id) return;
    try {
      const result = await api.getPaymentBySmeProfile(application.id);
      if (result.success) {
        setPayment(result.data ?? null);
      }
    } catch (err) {
      console.error('Failed to fetch payment:', err);
    }
  };

  const handleRequestPayment = async () => {
    if (!application?.id) return;

    try {
      setPaymentActionLoading(true);
      const result = await api.requestPayment(application.id);
      if (result.success) {
        setShowRequestPaymentModal(false);
        fetchPaymentData();
      } else {
        setError(result.message || 'Failed to request payment');
      }
    } catch (err) {
      setError('Failed to request payment');
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const handleCancelPayment = async () => {
    if (!payment?.id) return;

    try {
      setPaymentActionLoading(true);
      const result = await api.cancelPayment(payment.id);
      if (result.success) {
        setShowCancelPaymentModal(false);
        fetchPaymentData();
      } else {
        setError(result.message || 'Failed to cancel payment');
      }
    } catch (err) {
      setError('Failed to cancel payment');
    } finally {
      setPaymentActionLoading(false);
    }
  };

  const getPaymentStatusConfig = (status: string) => {
    const configs: Record<string, { bg: string; text: string; label: string }> = {
      not_requested: { bg: 'var(--graphite-100)', text: 'var(--graphite-600)', label: 'Not Requested' },
      pending: { bg: 'var(--warning-100)', text: 'var(--warning-700)', label: 'Pending' },
      processing: { bg: 'var(--teal-100)', text: 'var(--teal-700)', label: 'Processing' },
      completed: { bg: 'var(--success-100)', text: 'var(--success-700)', label: 'Completed' },
      failed: { bg: 'var(--danger-100)', text: 'var(--danger-700)', label: 'Failed' },
      refunded: { bg: 'var(--graphite-100)', text: 'var(--graphite-600)', label: 'Refunded' },
    };
    return configs[status] || configs.not_requested;
  };

  const formatCurrency = (amount: number, currency: string = 'AED') => {
    return `${currency} ${amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
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

  // Document types with categories and requirement levels
  type RequirementLevel = 'required' | 'conditional' | 'optional';

  interface DocumentTypeInfo {
    label: string;
    description: string;
    category: string;
    level: RequirementLevel;
  }

  const DOCUMENT_TYPE_INFO: Record<string, DocumentTypeInfo> = {
    // Legal & Registration
    trade_license: { label: 'Trade License', description: 'Valid commercial license issued by the relevant authority.', category: 'Legal & Registration', level: 'required' },
    certificate_of_incorporation: { label: 'Certificate of Incorporation', description: 'Required where applicable based on legal form.', category: 'Legal & Registration', level: 'conditional' },
    company_registration: { label: 'Company Registration Details', description: 'Official registration extract or equivalent.', category: 'Legal & Registration', level: 'required' },
    // Ownership & Management
    moa_shareholding: { label: 'Memorandum of Association (MOA) / Shareholding Structure', description: 'Ownership and control structure.', category: 'Ownership & Management', level: 'conditional' },
    signatory_id: { label: 'Authorized Signatory Identification', description: 'Government-issued ID of the authorized representative.', category: 'Ownership & Management', level: 'required' },
    // Financial Information
    financial_statements: { label: 'Latest Financial Statements', description: 'Most recent audited or management accounts.', category: 'Financial Information', level: 'required' },
    bank_statement: { label: 'Bank Statement (Last 6 Months)', description: 'Used to support financial activity verification.', category: 'Financial Information', level: 'optional' },
    wps_certificate: { label: 'WPS Certificate / Wage Protection Compliance', description: 'Proof of wage protection compliance (where applicable).', category: 'Financial Information', level: 'optional' },
    // Operations & Compliance
    company_profile: { label: 'Company Profile', description: 'Overview of business activities and operations.', category: 'Operations & Compliance', level: 'required' },
    licenses_permits: { label: 'Key Licenses / Permits (if applicable)', description: 'Sector-specific regulatory approvals.', category: 'Operations & Compliance', level: 'conditional' },
    contracts_references: { label: 'Key Contracts or Client References', description: 'May support operational context where relevant.', category: 'Operations & Compliance', level: 'optional' },
  };

  const DOCUMENT_CATEGORIES = ['Legal & Registration', 'Ownership & Management', 'Financial Information', 'Operations & Compliance'];

  const getDocumentTypeLabel = (type: string): string => {
    return DOCUMENT_TYPE_INFO[type]?.label || type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getDocumentInfo = (type: string): DocumentTypeInfo | null => {
    return DOCUMENT_TYPE_INFO[type] || null;
  };

  const getLevelBadgeStyle = (level: RequirementLevel) => {
    switch (level) {
      case 'required':
        return { bg: 'var(--danger-50)', color: 'var(--danger-700)', dot: 'var(--danger-500)' };
      case 'conditional':
        return { bg: 'var(--amber-50)', color: 'var(--amber-700)', dot: 'var(--amber-500)' };
      case 'optional':
        return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)', dot: 'var(--graphite-400)' };
    }
  };

  const getDimensionStatusStyle = (status: DimensionStatus) => {
    switch (status) {
      case 'ready':
        return { bg: 'var(--success-100)', color: 'var(--success-700)' };
      case 'requires_clarification':
        return { bg: 'var(--warning-100)', color: 'var(--warning-700)' };
      case 'under_review':
        return { bg: 'var(--teal-100)', color: 'var(--teal-700)' };
      case 'deferred':
        return { bg: 'var(--graphite-200)', color: 'var(--graphite-600)' };
      case 'not_certified':
        return { bg: 'var(--danger-100)', color: 'var(--danger-700)' };
      case 'not_reviewed':
      default:
        return { bg: 'var(--graphite-100)', color: 'var(--graphite-500)' };
    }
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
              {application.documents?.uploadedFiles && application.documents.uploadedFiles.length > 0 && (
                <span className="ml-2 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}>
                  {application.documents.uploadedFiles.length} files
                </span>
              )}
            </h3>

            {/* Document Levels Legend */}
            <div className="flex flex-wrap items-center gap-3 mb-5 pb-4" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
              <span className="text-xs font-medium" style={{ color: 'var(--graphite-500)' }}>Levels:</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--danger-50)', color: 'var(--danger-700)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danger-500)' }}></span>
                Required
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--amber-50)', color: 'var(--amber-700)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--amber-500)' }}></span>
                Conditional
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}>
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--graphite-400)' }}></span>
                Optional
              </span>
            </div>

            {application.documents?.uploadedFiles && application.documents.uploadedFiles.length > 0 ? (
              <div className="space-y-6">
                {DOCUMENT_CATEGORIES.map((category) => {
                  const allDocs = (application.documents?.uploadedFiles || []) as Array<{ id?: string; type?: string; name?: string; originalName?: string; path?: string; size?: number }>;
                  const categoryDocs = allDocs.filter(
                    (doc) => getDocumentInfo(doc.type || '')?.category === category
                  );
                  if (categoryDocs.length === 0) return null;

                  return (
                    <div key={category}>
                      <h4 className="text-sm font-semibold mb-3 flex items-center gap-2" style={{ color: 'var(--graphite-700)' }}>
                        {category}
                        <span className="text-xs font-normal" style={{ color: 'var(--graphite-400)' }}>
                          ({categoryDocs.length} uploaded)
                        </span>
                      </h4>
                      <div className="space-y-2">
                        {categoryDocs.map((doc: { id?: string; type?: string; name?: string; originalName?: string; path?: string; size?: number }, idx: number) => {
                          const docInfo = getDocumentInfo(doc.type || '');
                          const levelStyle = docInfo ? getLevelBadgeStyle(docInfo.level) : getLevelBadgeStyle('optional');

                          return (
                            <div
                              key={doc.id || idx}
                              className="flex items-center justify-between p-3 rounded-lg transition-colors"
                              style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-100)' }}
                            >
                              <div className="flex items-center gap-3 flex-1 min-w-0">
                                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </div>
                                <div className="min-w-0 flex-1">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <p className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{getDocumentTypeLabel(doc.type || '')}</p>
                                    {docInfo && (
                                      <span
                                        className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-xs font-medium"
                                        style={{ background: levelStyle.bg, color: levelStyle.color }}
                                      >
                                        <span className="w-1 h-1 rounded-full" style={{ background: levelStyle.dot }}></span>
                                        {docInfo.level.charAt(0).toUpperCase() + docInfo.level.slice(1)}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-xs truncate" style={{ color: 'var(--graphite-500)' }}>
                                    {doc.originalName || doc.name}
                                    {doc.size && <span className="ml-2">({formatFileSize(doc.size)})</span>}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                                <a
                                  href={`${API_BASE_URL}${doc.path}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-sm font-medium rounded-lg transition-colors"
                                  style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}
                                  title="View"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                </a>
                                <a
                                  href={`${API_BASE_URL}${doc.path}`}
                                  download={doc.originalName || doc.name}
                                  className="p-2 text-sm font-medium rounded-lg transition-colors"
                                  style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                                  title="Download"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                  </svg>
                                </a>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}

                {/* Uncategorized documents (legacy) */}
                {((application.documents?.uploadedFiles || []) as Array<{ id?: string; type?: string; name?: string; originalName?: string; path?: string; size?: number }>).filter(
                  (doc) => !getDocumentInfo(doc.type || '')
                ).length > 0 && (
                  <div>
                    <h4 className="text-sm font-semibold mb-3" style={{ color: 'var(--graphite-700)' }}>Other Documents</h4>
                    <div className="space-y-2">
                      {((application.documents?.uploadedFiles || []) as Array<{ id?: string; type?: string; name?: string; originalName?: string; path?: string; size?: number }>)
                        .filter((doc) => !getDocumentInfo(doc.type || ''))
                        .map((doc, idx) => (
                          <div
                            key={doc.id || idx}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-100)' }}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{getDocumentTypeLabel(doc.type || '')}</p>
                                <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
                                  {doc.originalName || doc.name}
                                  {doc.size && <span className="ml-2">({formatFileSize(doc.size)})</span>}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center gap-1">
                              <a
                                href={`${API_BASE_URL}${doc.path}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 rounded-lg"
                                style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}
                                title="View"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                </svg>
                              </a>
                              <a
                                href={`${API_BASE_URL}${doc.path}`}
                                download={doc.originalName || doc.name}
                                className="p-2 rounded-lg"
                                style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                                title="Download"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </a>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>
                )}
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

          {/* Certificate Management */}
          {application.certificationStatus === 'certified' && certificate && (
            <div className="solid-card rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                Certificate
              </h3>
              <div className="space-y-3">
                <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Certificate ID</p>
                  <p className="font-mono text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>{certificate.certificateId}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Version</p>
                    <p className="font-medium" style={{ color: 'var(--graphite-800)' }}>{certificate.version}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Status</p>
                    <span
                      className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium"
                      style={{
                        background: certificate.status === 'active' ? 'var(--success-100)' : certificate.status === 'expired' ? 'var(--warning-100)' : 'var(--danger-100)',
                        color: certificate.status === 'active' ? 'var(--success-700)' : certificate.status === 'expired' ? 'var(--warning-700)' : 'var(--danger-700)',
                      }}
                    >
                      {certificate.status.toUpperCase()}
                    </span>
                  </div>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Expires</p>
                  <p className="font-medium" style={{ color: 'var(--graphite-800)' }}>{formatDate(certificate.expiresAt)}</p>
                </div>
                <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                  <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Verification URL</p>
                  <a
                    href={certificate.verificationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm break-all hover:underline"
                    style={{ color: 'var(--teal-600)' }}
                  >
                    {certificate.verificationUrl}
                  </a>
                </div>
                {certificate.revocationReason && (
                  <div className="p-3 rounded-lg" style={{ background: 'var(--danger-50)' }}>
                    <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--danger-500)' }}>Revocation Reason</p>
                    <p className="text-sm" style={{ color: 'var(--danger-700)' }}>{certificate.revocationReason}</p>
                  </div>
                )}
                <div className="flex gap-2 pt-2">
                  {certificate.status !== 'revoked' && (
                    <button
                      onClick={() => setShowRevokeModal(true)}
                      className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                      style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}
                    >
                      Revoke
                    </button>
                  )}
                  <button
                    onClick={() => setShowReissueModal(true)}
                    className="flex-1 px-3 py-2 text-sm font-medium rounded-lg transition-all"
                    style={{ background: 'var(--teal-100)', color: 'var(--teal-700)' }}
                  >
                    Reissue
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Payment Management */}
          {application.certificationStatus === 'certified' && (
            <div className="solid-card rounded-xl p-5">
              <h3 className="font-semibold mb-4 flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--warning-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Certification Fee
              </h3>

              {!payment ? (
                // No payment requested yet
                <div className="space-y-3">
                  <div className="p-4 rounded-lg text-center" style={{ background: 'var(--graphite-50)' }}>
                    <p className="text-sm" style={{ color: 'var(--graphite-600)' }}>No payment requested yet</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--graphite-400)' }}>Request certification fee from this SME</p>
                  </div>
                  <button
                    onClick={() => setShowRequestPaymentModal(true)}
                    className="w-full px-4 py-2.5 text-sm font-medium rounded-lg transition-all"
                    style={{ background: 'var(--warning-600)', color: 'white' }}
                  >
                    Request Payment
                  </button>
                </div>
              ) : (
                // Payment exists
                <div className="space-y-3">
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-xs uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Status</p>
                      <span
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium"
                        style={{
                          background: getPaymentStatusConfig(payment.status).bg,
                          color: getPaymentStatusConfig(payment.status).text,
                        }}
                      >
                        {getPaymentStatusConfig(payment.status).label}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Amount</p>
                      <p className="font-semibold" style={{ color: 'var(--graphite-800)' }}>
                        {formatCurrency(payment.amount, payment.currency)}
                      </p>
                    </div>
                    <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Invoice</p>
                      <p className="font-mono text-xs" style={{ color: 'var(--graphite-800)' }}>
                        {payment.invoiceNumber || 'N/A'}
                      </p>
                    </div>
                  </div>

                  {payment.requestedAt && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--graphite-500)' }}>Requested</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-800)' }}>{formatDate(payment.requestedAt)}</p>
                    </div>
                  )}

                  {payment.paidAt && (
                    <div className="p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
                      <p className="text-xs uppercase tracking-wider mb-1" style={{ color: 'var(--success-600)' }}>Paid</p>
                      <p className="text-sm font-medium" style={{ color: 'var(--success-700)' }}>{formatDate(payment.paidAt)}</p>
                    </div>
                  )}

                  {payment.status === 'pending' && (
                    <button
                      onClick={() => setShowCancelPaymentModal(true)}
                      className="w-full px-4 py-2 text-sm font-medium rounded-lg transition-all"
                      style={{ background: 'var(--danger-100)', color: 'var(--danger-700)' }}
                    >
                      Cancel Payment Request
                    </button>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Internal Review Dimensions (Admin-only) */}
          {(application.certificationStatus === 'under_review' || application.certificationStatus === 'submitted' || application.certificationStatus === 'certified') && (
            <div className="solid-card rounded-xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold flex items-center gap-2" style={{ color: 'var(--graphite-900)' }}>
                  <svg className="w-5 h-5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Internal Review
                </h3>
                {internalReviewSaving && (
                  <span className="text-xs flex items-center gap-1" style={{ color: 'var(--teal-600)' }}>
                    <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Saving...
                  </span>
                )}
              </div>

              {internalReviewLoading ? (
                <div className="flex items-center justify-center py-6">
                  <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2" style={{ borderColor: 'var(--teal-600)' }}></div>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Dimension 1: Legal & Ownership Readiness */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>Legal & Ownership Readiness</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-500)' }}>Trade license, registration, shareholder docs</p>
                      </div>
                      <select
                        value={internalDimensions.legal_ownership}
                        onChange={(e) => handleDimensionChange('legal_ownership', e.target.value as DimensionStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer"
                        style={{
                          background: getDimensionStatusStyle(internalDimensions.legal_ownership).bg,
                          color: getDimensionStatusStyle(internalDimensions.legal_ownership).color,
                        }}
                      >
                        <option value="not_reviewed">Not Reviewed</option>
                        <option value="ready">Ready</option>
                        <option value="requires_clarification">Requires Clarification</option>
                        <option value="under_review">Under Review</option>
                        <option value="deferred">Deferred</option>
                        <option value="not_certified">Not Certified</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimension 2: Financial Discipline */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>Financial Discipline</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-500)' }}>Bank statements, audited accounts, tax records</p>
                      </div>
                      <select
                        value={internalDimensions.financial_discipline}
                        onChange={(e) => handleDimensionChange('financial_discipline', e.target.value as DimensionStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer"
                        style={{
                          background: getDimensionStatusStyle(internalDimensions.financial_discipline).bg,
                          color: getDimensionStatusStyle(internalDimensions.financial_discipline).color,
                        }}
                      >
                        <option value="not_reviewed">Not Reviewed</option>
                        <option value="ready">Ready</option>
                        <option value="requires_clarification">Requires Clarification</option>
                        <option value="under_review">Under Review</option>
                        <option value="deferred">Deferred</option>
                        <option value="not_certified">Not Certified</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimension 3: Business Model & Unit Economics */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>Business Model & Unit Economics</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-500)' }}>Revenue model, client contracts, projections</p>
                      </div>
                      <select
                        value={internalDimensions.business_model}
                        onChange={(e) => handleDimensionChange('business_model', e.target.value as DimensionStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer"
                        style={{
                          background: getDimensionStatusStyle(internalDimensions.business_model).bg,
                          color: getDimensionStatusStyle(internalDimensions.business_model).color,
                        }}
                      >
                        <option value="not_reviewed">Not Reviewed</option>
                        <option value="ready">Ready</option>
                        <option value="requires_clarification">Requires Clarification</option>
                        <option value="under_review">Under Review</option>
                        <option value="deferred">Deferred</option>
                        <option value="not_certified">Not Certified</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimension 4: Governance & Controls */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>Governance & Controls</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-500)' }}>Board structure, compliance policies, AML</p>
                      </div>
                      <select
                        value={internalDimensions.governance_controls}
                        onChange={(e) => handleDimensionChange('governance_controls', e.target.value as DimensionStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer"
                        style={{
                          background: getDimensionStatusStyle(internalDimensions.governance_controls).bg,
                          color: getDimensionStatusStyle(internalDimensions.governance_controls).color,
                        }}
                      >
                        <option value="not_reviewed">Not Reviewed</option>
                        <option value="ready">Ready</option>
                        <option value="requires_clarification">Requires Clarification</option>
                        <option value="under_review">Under Review</option>
                        <option value="deferred">Deferred</option>
                        <option value="not_certified">Not Certified</option>
                      </select>
                    </div>
                  </div>

                  {/* Dimension 5: Risk / Continuity / Shock Resistance */}
                  <div className="p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>Risk / Continuity / Shock Resistance</p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-500)' }}>Insurance, BCP, key-man dependency</p>
                      </div>
                      <select
                        value={internalDimensions.risk_continuity}
                        onChange={(e) => handleDimensionChange('risk_continuity', e.target.value as DimensionStatus)}
                        className="px-2 py-1 rounded text-xs font-medium border-0 cursor-pointer"
                        style={{
                          background: getDimensionStatusStyle(internalDimensions.risk_continuity).bg,
                          color: getDimensionStatusStyle(internalDimensions.risk_continuity).color,
                        }}
                      >
                        <option value="not_reviewed">Not Reviewed</option>
                        <option value="ready">Ready</option>
                        <option value="requires_clarification">Requires Clarification</option>
                        <option value="under_review">Under Review</option>
                        <option value="deferred">Deferred</option>
                        <option value="not_certified">Not Certified</option>
                      </select>
                    </div>
                  </div>

                  {/* Internal Notes */}
                  <div className="pt-2">
                    <label className="text-xs font-medium uppercase tracking-wider block mb-2" style={{ color: 'var(--graphite-500)' }}>
                      Internal Notes (Admin Only)
                    </label>
                    <textarea
                      value={internalNotes}
                      onChange={(e) => setInternalNotes(e.target.value)}
                      onBlur={handleNotesBlur}
                      placeholder="Add internal notes about this application..."
                      rows={3}
                      className="w-full px-3 py-2 rounded-lg text-sm resize-none transition-colors"
                      style={{
                        background: 'var(--white)',
                        border: '1px solid var(--graphite-200)',
                        color: 'var(--graphite-800)',
                      }}
                    />
                  </div>

                  {/* Last Updated */}
                  {lastInternalReviewAt && (
                    <p className="text-xs" style={{ color: 'var(--graphite-400)' }}>
                      Last updated: {formatDate(lastInternalReviewAt)}
                    </p>
                  )}
                </div>
              )}
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

      {/* Certificate Revoke Modal */}
      {showRevokeModal && certificate && (
        <Modal title="Revoke Certificate" onClose={() => { setShowRevokeModal(false); setRevokeReason(''); }}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Are you sure you want to revoke certificate <strong>{certificate.certificateId}</strong>?
            This action cannot be easily undone.
          </p>
          <textarea
            value={revokeReason}
            onChange={(e) => setRevokeReason(e.target.value)}
            placeholder="Enter revocation reason (optional)..."
            className="input-field w-full h-24 resize-none"
          />
          <div className="flex justify-end gap-3 mt-4">
            <button onClick={() => { setShowRevokeModal(false); setRevokeReason(''); }} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={handleRevokeCertificate}
              disabled={certActionLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--danger-600)' }}
            >
              {certActionLoading ? 'Revoking...' : 'Revoke Certificate'}
            </button>
          </div>
        </Modal>
      )}

      {/* Certificate Reissue Modal */}
      {showReissueModal && certificate && (
        <Modal title="Reissue Certificate" onClose={() => setShowReissueModal(false)}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            This will issue a new version of certificate <strong>{certificate.certificateId}</strong> with:
          </p>
          <ul className="list-disc pl-5 mb-4 space-y-1" style={{ color: 'var(--graphite-600)' }}>
            <li>New version number ({certificate.version} + 1)</li>
            <li>New expiry date (12 months from now)</li>
            <li>New verification hash</li>
            <li>Status reset to Active (if revoked)</li>
          </ul>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowReissueModal(false)} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={handleReissueCertificate}
              disabled={certActionLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--teal-600)' }}
            >
              {certActionLoading ? 'Reissuing...' : 'Reissue Certificate'}
            </button>
          </div>
        </Modal>
      )}

      {/* Request Payment Modal */}
      {showRequestPaymentModal && (
        <Modal title="Request Certification Fee" onClose={() => setShowRequestPaymentModal(false)}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            You are about to request the certification fee from <strong>{application.companyName}</strong>.
          </p>
          <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--graphite-50)' }}>
            <div className="flex items-center justify-between">
              <span style={{ color: 'var(--graphite-600)' }}>Certification Fee</span>
              <span className="font-semibold" style={{ color: 'var(--graphite-900)' }}>AED 500.00</span>
            </div>
          </div>
          <p className="text-sm mb-4" style={{ color: 'var(--graphite-500)' }}>
            The SME will be notified and can complete the payment through their dashboard.
          </p>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowRequestPaymentModal(false)} className="btn-secondary px-4 py-2.5 rounded-xl">Cancel</button>
            <button
              onClick={handleRequestPayment}
              disabled={paymentActionLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--warning-600)' }}
            >
              {paymentActionLoading ? 'Requesting...' : 'Request Payment'}
            </button>
          </div>
        </Modal>
      )}

      {/* Cancel Payment Modal */}
      {showCancelPaymentModal && payment && (
        <Modal title="Cancel Payment Request" onClose={() => setShowCancelPaymentModal(false)}>
          <p style={{ color: 'var(--graphite-600)' }} className="mb-4">
            Are you sure you want to cancel the payment request for <strong>{application.companyName}</strong>?
          </p>
          <div className="p-4 rounded-lg mb-4" style={{ background: 'var(--warning-50)' }}>
            <p className="text-sm" style={{ color: 'var(--warning-700)' }}>
              This will mark the current payment request as cancelled. You can request payment again later if needed.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <button onClick={() => setShowCancelPaymentModal(false)} className="btn-secondary px-4 py-2.5 rounded-xl">Keep Request</button>
            <button
              onClick={handleCancelPayment}
              disabled={paymentActionLoading}
              className="px-5 py-2.5 rounded-xl font-semibold text-white disabled:opacity-50"
              style={{ background: 'var(--danger-600)' }}
            >
              {paymentActionLoading ? 'Cancelling...' : 'Cancel Request'}
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
