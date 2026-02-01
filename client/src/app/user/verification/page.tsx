'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';

type InvestorType = 'individual' | 'company' | null;
type KycStatus = 'not_submitted' | 'pending' | 'approved' | 'rejected' | 'revision_requested';

interface KycDocument {
  type: string;
  name: string;
  path: string;
  uploadedAt: string;
}

const INDIVIDUAL_DOCUMENTS = [
  { type: 'emirates_id_front', label: 'Emirates ID (Front)', required: true },
  { type: 'emirates_id_back', label: 'Emirates ID (Back)', required: true },
  { type: 'passport', label: 'Passport Copy', required: true },
  { type: 'proof_of_address', label: 'Proof of Address (Utility Bill/Bank Statement)', required: true },
  { type: 'source_of_funds', label: 'Source of Funds Document', required: false },
];

const COMPANY_DOCUMENTS = [
  { type: 'trade_license', label: 'Trade License', required: true },
  { type: 'moa', label: 'Memorandum of Association (MOA)', required: true },
  { type: 'auth_rep_emirates_id', label: 'Authorized Representative Emirates ID', required: true },
  { type: 'auth_rep_passport', label: 'Authorized Representative Passport', required: true },
  { type: 'board_resolution', label: 'Board Resolution / POA', required: true },
  { type: 'bank_statement', label: 'Company Bank Statement (Last 3 months)', required: false },
  { type: 'financial_statements', label: 'Audited Financial Statements', required: false },
];

export default function InvestorVerificationPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [investorType, setInvestorType] = useState<InvestorType>(null);
  const [kycStatus, setKycStatus] = useState<KycStatus>('not_submitted');
  const [kycDocuments, setKycDocuments] = useState<KycDocument[]>([]);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);
  const [uploadingDoc, setUploadingDoc] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'documents'>('info');
  const [formData, setFormData] = useState<Record<string, string | number | null>>({});
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const fileInputRefs = useRef<Record<string, HTMLInputElement | null>>({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const result = await api.getUserProfile();
      if (result.success && result.data) {
        const data = result.data;
        const status = (data.kycStatus as KycStatus) || 'not_submitted';
        setKycStatus(status);

        // Only load investor type from DB if KYC has been submitted
        // Otherwise, always show type selection first
        if (status !== 'not_submitted') {
          setInvestorType(data.investorType as InvestorType);
        }
        setKycDocuments((data.kycDocuments as KycDocument[]) || []);
        setRejectionReason(data.kycRejectionReason as string | null);
        setRevisionNotes(data.kycRevisionNotes as string | null);

        // Set form data
        setFormData({
          // Individual fields
          nationality: data.nationality as string || '',
          dateOfBirth: data.dateOfBirth ? (data.dateOfBirth as string).split('T')[0] : '',
          gender: data.gender as string || '',
          residencyStatus: data.residencyStatus as string || '',
          emiratesId: data.emiratesId as string || '',
          emiratesIdExpiry: data.emiratesIdExpiry ? (data.emiratesIdExpiry as string).split('T')[0] : '',
          passportNumber: data.passportNumber as string || '',
          passportExpiry: data.passportExpiry ? (data.passportExpiry as string).split('T')[0] : '',
          passportCountry: data.passportCountry as string || '',
          residentialAddress: data.residentialAddress as string || '',
          city: data.city as string || '',
          country: data.country as string || '',
          poBox: data.poBox as string || '',
          employmentStatus: data.employmentStatus as string || '',
          employerName: data.employerName as string || '',
          occupation: data.occupation as string || '',
          annualIncome: data.annualIncome as string || '',
          sourceOfFunds: data.sourceOfFunds as string || '',
          // Company fields
          companyName: data.companyName as string || '',
          companyType: data.companyType as string || '',
          tradeLicenseNumber: data.tradeLicenseNumber as string || '',
          tradeLicenseExpiry: data.tradeLicenseExpiry ? (data.tradeLicenseExpiry as string).split('T')[0] : '',
          registrationNumber: data.registrationNumber as string || '',
          registrationDate: data.registrationDate ? (data.registrationDate as string).split('T')[0] : '',
          registrationAuthority: data.registrationAuthority as string || '',
          companyAddress: data.companyAddress as string || '',
          companyCity: data.companyCity as string || '',
          companyCountry: data.companyCountry as string || '',
          companyPoBox: data.companyPoBox as string || '',
          authRepName: data.authRepName as string || '',
          authRepPosition: data.authRepPosition as string || '',
          authRepEmiratesId: data.authRepEmiratesId as string || '',
          authRepEmail: data.authRepEmail as string || '',
          authRepPhone: data.authRepPhone as string || '',
          companyAnnualRevenue: data.companyAnnualRevenue as string || '',
          companyEmployeeCount: data.companyEmployeeCount as number || null,
        });
      }
    } catch (err) {
      console.error('Failed to fetch profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectInvestorType = (type: 'individual' | 'company') => {
    // Only set local state - type will be saved when KYC is submitted
    setInvestorType(type);
    setError(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmitKyc = async () => {
    try {
      setSaving(true);
      setError(null);
      // Include investor type with form data
      const result = await api.submitKyc({ ...formData, investorType });
      if (result.success) {
        setKycStatus('pending');
        setSuccess('KYC submitted successfully! Our team will review your application.');
        setTimeout(() => setSuccess(null), 5000);
      } else {
        setError(result.message || 'Failed to submit KYC');
      }
    } catch (err) {
      setError('An error occurred');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadDocument = async (docType: string, file: File) => {
    try {
      setUploadingDoc(docType);
      const result = await api.uploadKycDocument(file, docType);
      if (result.success && result.data) {
        setKycDocuments((result.data as { allDocuments: KycDocument[] }).allDocuments || []);
        setSuccess('Document uploaded successfully');
        setTimeout(() => setSuccess(null), 3000);
      } else {
        setError(result.message || 'Failed to upload document');
      }
    } catch (err) {
      setError('Upload failed');
    } finally {
      setUploadingDoc(null);
    }
  };

  const handleRemoveDocument = async (docType: string) => {
    try {
      setUploadingDoc(docType);
      const result = await api.removeKycDocument(docType);
      if (result.success) {
        setKycDocuments((result.data as { documents: KycDocument[] })?.documents || []);
        setSuccess('Document removed');
        setTimeout(() => setSuccess(null), 3000);
      }
    } catch (err) {
      setError('Failed to remove document');
    } finally {
      setUploadingDoc(null);
    }
  };

  const getStatusBadge = () => {
    const statusConfig: Record<KycStatus, { bg: string; text: string; label: string }> = {
      not_submitted: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Not Submitted' },
      pending: { bg: 'bg-amber-100', text: 'text-amber-700', label: 'Under Review' },
      approved: { bg: 'bg-emerald-100', text: 'text-emerald-700', label: 'Verified' },
      rejected: { bg: 'bg-red-100', text: 'text-red-700', label: 'Rejected' },
      revision_requested: { bg: 'bg-orange-100', text: 'text-orange-700', label: 'Revision Requested' },
    };
    const config = statusConfig[kycStatus];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const isDocumentUploaded = (docType: string) => {
    return kycDocuments.some(d => d.type === docType);
  };

  const requiredDocs = investorType === 'individual' ? INDIVIDUAL_DOCUMENTS : COMPANY_DOCUMENTS;
  const uploadedRequiredCount = requiredDocs.filter(d => d.required && isDocumentUploaded(d.type)).length;
  const totalRequiredCount = requiredDocs.filter(d => d.required).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#0D9488' }} />
      </div>
    );
  }

  // Fields are read-only after KYC is submitted
  const isReadOnly = kycStatus === 'pending' || kycStatus === 'approved';

  // Show status page for pending/approved KYC
  if ((kycStatus === 'pending' || kycStatus === 'approved') && !showDetails) {
    const isApproved = kycStatus === 'approved';
    return (
      <div className="pb-8">
        {/* Header Card - Full Width */}
        <div className="rounded-2xl overflow-hidden shadow-lg mb-6" style={{ background: 'linear-gradient(135deg, #363c45 0%, #2a2f36 100%)' }}>
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="flex items-start gap-4">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 ${isApproved ? 'bg-emerald-500/20' : 'bg-violet-500/20'}`}>
                  {isApproved ? (
                    <svg className="w-7 h-7 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  ) : (
                    <svg className="w-7 h-7 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                    </svg>
                  )}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-xl md:text-2xl font-bold text-white">
                      {isApproved ? 'Verification Complete' : 'KYC Under Review'}
                    </h1>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${isApproved ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                      {isApproved ? 'Verified' : 'Pending'}
                    </span>
                  </div>
                  <p className="text-slate-400 text-sm">
                    {isApproved
                      ? 'Your identity has been verified. You now have full access to all investment features.'
                      : 'Our compliance team is reviewing your submitted documents and information.'}
                  </p>
                </div>
              </div>
              {isApproved && (
                <button
                  onClick={() => router.push('/user')}
                  className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm transition-all flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Browse SMEs
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Two Column Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Timeline */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-6">Verification Progress</h2>
              <div className="flex items-center justify-between">
                {/* Step 1: Submitted */}
                <div className="flex flex-col items-center flex-1">
                  <div className="w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center mb-2 shadow-lg shadow-emerald-500/30">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-900">Submitted</span>
                  <span className="text-xs text-emerald-600">Complete</span>
                </div>
                {/* Connector */}
                <div className="h-1 flex-1 mx-3 rounded-full bg-emerald-500" />
                {/* Step 2: Under Review */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 shadow-lg ${isApproved ? 'bg-emerald-500 shadow-emerald-500/30' : 'bg-violet-500 shadow-violet-500/30'}`}>
                    {isApproved ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">Under Review</span>
                  <span className={`text-xs ${isApproved ? 'text-emerald-600' : 'text-violet-600'}`}>{isApproved ? 'Complete' : 'In Progress'}</span>
                </div>
                {/* Connector */}
                <div className={`h-1 flex-1 mx-3 rounded-full ${isApproved ? 'bg-emerald-500' : 'bg-gray-200'}`} />
                {/* Step 3: Verified */}
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${isApproved ? 'bg-emerald-500 shadow-lg shadow-emerald-500/30' : 'bg-gray-100'}`}>
                    {isApproved ? (
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-900">Verified</span>
                  <span className={`text-xs ${isApproved ? 'text-emerald-600' : 'text-gray-500'}`}>{isApproved ? 'Complete' : 'Pending'}</span>
                </div>
              </div>
            </div>

            {/* Application Summary */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100">
                <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Application Summary</h2>
              </div>
              <div className="divide-y divide-gray-100">
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Investor Type</p>
                      <p className="text-sm text-gray-500">Account category</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">
                    {investorType === 'individual' ? 'Individual' : 'Company'}
                  </span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Documents</p>
                      <p className="text-sm text-gray-500">Uploaded files</p>
                    </div>
                  </div>
                  <span className="font-semibold text-gray-900">{kycDocuments.length} files</span>
                </div>
                <div className="flex items-center justify-between px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isApproved ? 'bg-emerald-100' : 'bg-amber-100'}`}>
                      {isApproved ? (
                        <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      )}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{isApproved ? 'Status' : 'Review Time'}</p>
                      <p className="text-sm text-gray-500">{isApproved ? 'Verification complete' : 'Estimated duration'}</p>
                    </div>
                  </div>
                  <span className={`font-semibold ${isApproved ? 'text-emerald-600' : 'text-gray-900'}`}>
                    {isApproved ? 'Verified' : '1-3 business days'}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <button
              onClick={() => setShowDetails(true)}
              className="w-full py-4 rounded-xl font-semibold transition-all flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 shadow-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              View Application Details
            </button>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => router.push('/user')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-teal-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Browse SME Registry</p>
                    <p className="text-xs text-gray-500">Discover investment opportunities</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/user/messages')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Messages</p>
                    <p className="text-xs text-gray-500">View your conversations</p>
                  </div>
                </button>
                <button
                  onClick={() => router.push('/user/support')}
                  className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                    <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 text-sm">Support</p>
                    <p className="text-xs text-gray-500">Get help with your account</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Need Help Card */}
            <div className="rounded-2xl p-6 text-white" style={{ background: 'linear-gradient(135deg, #363c45 0%, #2a2f36 100%)' }}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="font-semibold">Need Help?</h3>
              </div>
              <p className="text-sm text-white/80 mb-4">
                {isApproved
                  ? 'Have questions about investing? Our team is here to help you get started.'
                  : 'Questions about the verification process? Our support team is here to help.'}
              </p>
              <button
                onClick={() => router.push('/user/support')}
                className="w-full py-2.5 rounded-lg bg-white/20 hover:bg-white/30 text-sm font-medium transition-colors"
              >
                Contact Support
              </button>
            </div>

            {/* Info Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">
                {isApproved ? 'Your Benefits' : 'What Happens Next?'}
              </h2>
              <div className="space-y-4">
                {isApproved ? (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Browse and connect with verified SMEs</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Access detailed financial reports</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-3.5 h-3.5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <p className="text-sm text-gray-600">Make direct investment requests</p>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-violet-600">1</span>
                      </div>
                      <p className="text-sm text-gray-600">Our team reviews your documents</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-violet-600">2</span>
                      </div>
                      <p className="text-sm text-gray-600">Identity verification completed</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-violet-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-xs font-semibold text-violet-600">3</span>
                      </div>
                      <p className="text-sm text-gray-600">You&apos;ll receive email notification</p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Back button for details view */}
      {(kycStatus === 'pending' || kycStatus === 'approved') && showDetails && (
        <button
          onClick={() => setShowDetails(false)}
          className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Status
        </button>
      )}

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-2">
          {investorType && kycStatus === 'not_submitted' && (
            <button
              onClick={() => setInvestorType(null)}
              className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:bg-gray-100"
              style={{ background: 'var(--graphite-100)' }}
            >
              <svg className="w-5 h-5" style={{ color: 'var(--graphite-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
          )}
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>KYC Verification</h1>
            {getStatusBadge()}
          </div>
        </div>
        <p className={`text-sm ${investorType && kycStatus === 'not_submitted' ? 'ml-14' : ''}`} style={{ color: 'var(--foreground-muted)' }}>
          Complete your verification to unlock full investment capabilities
        </p>
      </div>

      {/* Status Alert */}
      {kycStatus === 'rejected' && rejectionReason && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-red-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-red-800">Your application was rejected</p>
              <p className="text-sm text-red-700 mt-1">{rejectionReason}</p>
            </div>
          </div>
        </div>
      )}

      {kycStatus === 'revision_requested' && revisionNotes && (
        <div className="mb-6 p-4 rounded-xl bg-orange-50 border border-orange-200">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium text-orange-800">Revision Requested</p>
              <p className="text-sm text-orange-700 mt-1">{revisionNotes}</p>
            </div>
          </div>
        </div>
      )}

      {kycStatus === 'approved' && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200">
          <div className="flex items-center gap-3">
            <svg className="w-5 h-5 text-emerald-500" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <p className="font-medium text-emerald-800">Your account is verified! You have full access to investment features.</p>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700">
          {success}
        </div>
      )}

      {/* Step 1: Investor Type Selection */}
      {!investorType && (
        <div className="bg-white rounded-2xl border border-gray-100 p-8">
          <h2 className="text-lg font-semibold mb-2" style={{ color: 'var(--foreground)' }}>Select Investor Type</h2>
          <p className="text-sm mb-6" style={{ color: 'var(--foreground-muted)' }}>Choose the type that best describes you</p>

          <div className="grid md:grid-cols-2 gap-4">
            <button
              onClick={() => handleSelectInvestorType('individual')}
              disabled={saving}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">Individual Investor</h3>
              <p className="text-sm text-gray-500">Personal investment account for individuals</p>
            </button>

            <button
              onClick={() => handleSelectInvestorType('company')}
              disabled={saving}
              className="p-6 rounded-xl border-2 border-gray-200 hover:border-violet-500 hover:bg-violet-50 transition-all text-left group"
            >
              <div className="w-12 h-12 rounded-xl bg-violet-100 flex items-center justify-center mb-4 group-hover:bg-violet-200 transition-colors">
                <svg className="w-6 h-6 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h3 className="font-semibold text-lg mb-1">Company / Institution</h3>
              <p className="text-sm text-gray-500">Business or institutional investment account</p>
            </button>
          </div>
        </div>
      )}

      {/* Step 2: KYC Form */}
      {investorType && kycStatus !== 'approved' && (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          {/* Investor Type Header */}
          <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center">
                {investorType === 'individual' ? (
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                )}
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {investorType === 'individual' ? 'Individual Investor' : 'Company / Institution'}
                </p>
                <p className="text-xs text-gray-500">
                  {investorType === 'individual' ? 'Personal investment account' : 'Business investment account'}
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-100">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'info' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Personal Information
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'documents' ? 'text-violet-600 border-b-2 border-violet-600' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents ({uploadedRequiredCount}/{totalRequiredCount})
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'info' && investorType === 'individual' && (
              <div className="space-y-6">
                {/* Personal Details */}
                <div>
                  <h3 className="font-semibold mb-4">Personal Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Nationality *</label>
                      <input
                        type="text"
                        value={formData.nationality as string || ''}
                        onChange={(e) => handleInputChange('nationality', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="e.g. UAE, British, Indian"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
                      <input
                        type="date"
                        value={formData.dateOfBirth as string || ''}
                        onChange={(e) => handleInputChange('dateOfBirth', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        value={formData.gender as string || ''}
                        onChange={(e) => handleInputChange('gender', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Residency Status *</label>
                      <select
                        value={formData.residencyStatus as string || ''}
                        onChange={(e) => handleInputChange('residencyStatus', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="citizen">UAE Citizen</option>
                        <option value="resident">UAE Resident</option>
                        <option value="visitor">Non-Resident</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Identification */}
                <div>
                  <h3 className="font-semibold mb-4">Identification</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID *</label>
                      <input
                        type="text"
                        value={formData.emiratesId as string || ''}
                        onChange={(e) => handleInputChange('emiratesId', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="784-XXXX-XXXXXXX-X"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID Expiry *</label>
                      <input
                        type="date"
                        value={formData.emiratesIdExpiry as string || ''}
                        onChange={(e) => handleInputChange('emiratesIdExpiry', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number *</label>
                      <input
                        type="text"
                        value={formData.passportNumber as string || ''}
                        onChange={(e) => handleInputChange('passportNumber', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry *</label>
                      <input
                        type="date"
                        value={formData.passportExpiry as string || ''}
                        onChange={(e) => handleInputChange('passportExpiry', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issuing Country *</label>
                      <input
                        type="text"
                        value={formData.passportCountry as string || ''}
                        onChange={(e) => handleInputChange('passportCountry', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h3 className="font-semibold mb-4">Residential Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        value={formData.residentialAddress as string || ''}
                        onChange={(e) => handleInputChange('residentialAddress', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={formData.city as string || ''}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input
                        type="text"
                        value={formData.country as string || ''}
                        onChange={(e) => handleInputChange('country', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Employment & Source of Funds */}
                <div>
                  <h3 className="font-semibold mb-4">Employment & Source of Funds</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Employment Status *</label>
                      <select
                        value={formData.employmentStatus as string || ''}
                        onChange={(e) => handleInputChange('employmentStatus', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="employed">Employed</option>
                        <option value="self_employed">Self-Employed</option>
                        <option value="business_owner">Business Owner</option>
                        <option value="retired">Retired</option>
                        <option value="student">Student</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
                      <input
                        type="text"
                        value={formData.occupation as string || ''}
                        onChange={(e) => handleInputChange('occupation', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Annual Income Range *</label>
                      <select
                        value={formData.annualIncome as string || ''}
                        onChange={(e) => handleInputChange('annualIncome', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="below_100k">Below AED 100,000</option>
                        <option value="100k_250k">AED 100,000 - 250,000</option>
                        <option value="250k_500k">AED 250,000 - 500,000</option>
                        <option value="500k_1m">AED 500,000 - 1,000,000</option>
                        <option value="above_1m">Above AED 1,000,000</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Source of Funds *</label>
                      <select
                        value={formData.sourceOfFunds as string || ''}
                        onChange={(e) => handleInputChange('sourceOfFunds', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="salary">Salary / Employment Income</option>
                        <option value="business">Business Income</option>
                        <option value="investments">Investment Returns</option>
                        <option value="inheritance">Inheritance</option>
                        <option value="property">Property Sale</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && investorType === 'company' && (
              <div className="space-y-6">
                {/* Company Details */}
                <div>
                  <h3 className="font-semibold mb-4">Company Details</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                      <input
                        type="text"
                        value={formData.companyName as string || ''}
                        onChange={(e) => handleInputChange('companyName', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company Type *</label>
                      <select
                        value={formData.companyType as string || ''}
                        onChange={(e) => handleInputChange('companyType', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      >
                        <option value="">Select...</option>
                        <option value="llc">LLC</option>
                        <option value="corporation">Corporation</option>
                        <option value="partnership">Partnership</option>
                        <option value="free_zone">Free Zone Company</option>
                        <option value="offshore">Offshore Company</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trade License Number *</label>
                      <input
                        type="text"
                        value={formData.tradeLicenseNumber as string || ''}
                        onChange={(e) => handleInputChange('tradeLicenseNumber', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Trade License Expiry *</label>
                      <input
                        type="date"
                        value={formData.tradeLicenseExpiry as string || ''}
                        onChange={(e) => handleInputChange('tradeLicenseExpiry', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Authority *</label>
                      <input
                        type="text"
                        value={formData.registrationAuthority as string || ''}
                        onChange={(e) => handleInputChange('registrationAuthority', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="e.g. DED Dubai, JAFZA, DMCC"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Registration Date</label>
                      <input
                        type="date"
                        value={formData.registrationDate as string || ''}
                        onChange={(e) => handleInputChange('registrationDate', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Company Address */}
                <div>
                  <h3 className="font-semibold mb-4">Company Address</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
                      <input
                        type="text"
                        value={formData.companyAddress as string || ''}
                        onChange={(e) => handleInputChange('companyAddress', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City *</label>
                      <input
                        type="text"
                        value={formData.companyCity as string || ''}
                        onChange={(e) => handleInputChange('companyCity', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
                      <input
                        type="text"
                        value={formData.companyCountry as string || ''}
                        onChange={(e) => handleInputChange('companyCountry', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>

                {/* Authorized Representative */}
                <div>
                  <h3 className="font-semibold mb-4">Authorized Representative</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                      <input
                        type="text"
                        value={formData.authRepName as string || ''}
                        onChange={(e) => handleInputChange('authRepName', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Position/Title *</label>
                      <input
                        type="text"
                        value={formData.authRepPosition as string || ''}
                        onChange={(e) => handleInputChange('authRepPosition', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                        placeholder="e.g. CEO, Managing Director"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Emirates ID *</label>
                      <input
                        type="text"
                        value={formData.authRepEmiratesId as string || ''}
                        onChange={(e) => handleInputChange('authRepEmiratesId', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                      <input
                        type="email"
                        value={formData.authRepEmail as string || ''}
                        onChange={(e) => handleInputChange('authRepEmail', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                      <input
                        type="tel"
                        value={formData.authRepPhone as string || ''}
                        onChange={(e) => handleInputChange('authRepPhone', e.target.value)}
                        disabled={isReadOnly}
                        className={`w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 ${isReadOnly ? "bg-gray-100 cursor-not-allowed" : ""}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'documents' && (
              <div className="space-y-4">
                <p className="text-sm text-gray-500 mb-4">
                  Upload clear, colored copies of the following documents. Accepted formats: PDF, JPG, PNG (max 10MB)
                </p>
                {requiredDocs.map((doc) => {
                  const uploaded = kycDocuments.find(d => d.type === doc.type);
                  return (
                    <div key={doc.type} className="flex items-center justify-between p-4 rounded-xl border border-gray-200 hover:border-gray-300 transition-colors">
                      <div className="flex items-center gap-3">
                        {uploaded ? (
                          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
                            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                        )}
                        <div>
                          <p className="font-medium text-sm">
                            {doc.label}
                            {doc.required && <span className="text-red-500 ml-1">*</span>}
                          </p>
                          {uploaded && (
                            <p className="text-xs text-gray-500">{uploaded.name}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {uploaded && !isReadOnly && (
                          <button
                            onClick={() => handleRemoveDocument(doc.type)}
                            disabled={uploadingDoc === doc.type}
                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        <input
                          type="file"
                          ref={(el) => { fileInputRefs.current[doc.type] = el; }}
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleUploadDocument(doc.type, file);
                          }}
                          accept=".pdf,.jpg,.jpeg,.png"
                          className="hidden"
                        />
                        {!isReadOnly && (
                          <button
                            onClick={() => fileInputRefs.current[doc.type]?.click()}
                            disabled={uploadingDoc === doc.type}
                            className="px-4 py-2 text-sm font-medium rounded-lg bg-violet-50 text-violet-600 hover:bg-violet-100 transition-colors disabled:opacity-50"
                          >
                            {uploadingDoc === doc.type ? (
                              <span className="flex items-center gap-2">
                                <div className="w-4 h-4 border-2 border-violet-300 border-t-violet-600 rounded-full animate-spin" />
                                Uploading...
                              </span>
                            ) : uploaded ? 'Replace' : 'Upload'}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Button */}
          {(kycStatus === 'not_submitted' || kycStatus === 'rejected' || kycStatus === 'revision_requested') && (
            <div className="p-6 border-t border-gray-100">
              <button
                onClick={handleSubmitKyc}
                disabled={saving || uploadedRequiredCount < totalRequiredCount}
                className="w-full py-3 rounded-xl text-white font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
              >
                {saving ? 'Saving...' : 'Save and Continue'}
              </button>
            </div>
          )}

          {kycStatus === 'pending' && (
            <div className="p-6 border-t border-gray-100 text-center">
              <p className="text-gray-600">
                Your application is under review. We will notify you once the review is complete.
              </p>
            </div>
          )}
        </div>
      )}

    </div>
  );
}
