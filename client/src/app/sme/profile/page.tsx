'use client';

import { useState, useEffect, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { SMEProfileUpdateData, CertificationStatus } from '@/types';

// Document types
interface UploadedDocument {
  id: string;
  type: string;
  name: string;
  originalName: string;
  path: string;
  size: number;
  mimeType: string;
  uploadedAt: string;
}

const DOCUMENT_TYPES = [
  { type: 'trade_license', label: 'Trade License', required: true },
  { type: 'certificate_of_incorporation', label: 'Certificate of Incorporation', required: true },
  { type: 'financial_statements', label: 'Financial Statements (Last 2 years)', required: true },
  { type: 'company_profile', label: 'Company Profile / Brochure', required: false },
];

export default function SMEProfilePage() {
  const searchParams = useSearchParams();
  const initialTab = searchParams.get('tab') || 'basic';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  // Remove backend-based completion - we'll calculate dynamically
  const [certificationStatus, setCertificationStatus] = useState<CertificationStatus>('draft');
  const [revisionNotes, setRevisionNotes] = useState<string | null>(null);

  // Documents state
  const [documents, setDocuments] = useState<UploadedDocument[]>([]);
  const [uploading, setUploading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const fileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});

  // Company logo state
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [deletingLogo, setDeletingLogo] = useState(false);
  const logoInputRef = useRef<HTMLInputElement | null>(null);
  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

  // Check if profile can be edited
  const canEdit = certificationStatus === 'draft' || certificationStatus === 'revision_requested';

  // Form state
  const [formData, setFormData] = useState<SMEProfileUpdateData>({
    // Basic Info
    companyName: '',
    tradeLicenseNumber: '',
    companyDescription: '',
    industrySector: '',
    website: '',
    address: '',
    foundingDate: '',
    employeeCount: undefined,
    contactName: '',
    contactPosition: '',
    contactEmail: '',
    contactPhone: '',
    revenueRange: '',
    revenueGrowth: '',
    // Legal & Registration
    registrationNumber: '',
    vatNumber: '',
    licenseExpiryDate: '',
    legalStructure: '',
    registrationCountry: '',
    registrationCity: '',
    // Ownership & Management
    ownerName: '',
    ownerNationality: '',
    ownerIdNumber: '',
    shareholderStructure: [],
    boardMembers: [],
    // Financial Info
    bankName: '',
    bankAccountNumber: '',
    auditorName: '',
    lastAuditDate: '',
    profitMargin: undefined,
    fundingStage: '',
    // Business Operations
    businessModel: '',
    operatingCountries: [],
    majorClients: [],
    officeType: '',
    // Compliance & Certifications
    existingCertifications: [],
    regulatoryLicenses: [],
    complianceOfficerName: '',
    complianceOfficerEmail: '',
    hasAmlPolicy: false,
    hasDataProtectionPolicy: false,
    // Contact & Social
    linkedinUrl: '',
    socialMedia: {},
    headOfficeAddress: '',
    secondaryContactName: '',
    secondaryContactPhone: '',
    secondaryContactEmail: '',
  });

  // Calculate completion percentage dynamically
  const calculateCompletionPercentage = () => {
    let completed = 0;
    const total = 7; // 7 sections

    // Basic Info (companyName + tradeLicenseNumber + industrySector)
    if (formData.companyName && formData.tradeLicenseNumber && formData.industrySector) completed++;

    // Legal & Registration (registrationNumber + legalStructure)
    if (formData.registrationNumber && formData.legalStructure) completed++;

    // Ownership (ownerName + ownerNationality)
    if (formData.ownerName && formData.ownerNationality) completed++;

    // Financial Info (fundingStage or bankName)
    if (formData.fundingStage || formData.bankName) completed++;

    // Business Operations (businessModel)
    if (formData.businessModel) completed++;

    // Compliance (at least one policy)
    if (formData.hasAmlPolicy || formData.hasDataProtectionPolicy) completed++;

    // Documents (at least 3 uploaded)
    if (documents.length >= 3) completed++;

    return Math.round((completed / total) * 100);
  };

  const completionPercentage = calculateCompletionPercentage();

  const tabs = [
    { id: 'basic', label: 'Basic Info', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    )},
    { id: 'legal', label: 'Legal & Registration', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
      </svg>
    )},
    { id: 'ownership', label: 'Ownership', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
      </svg>
    )},
    { id: 'financial', label: 'Financial', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    )},
    { id: 'operations', label: 'Operations', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'compliance', label: 'Compliance', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
      </svg>
    )},
    { id: 'documents', label: 'Documents', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    )},
  ];

  const sectors = [
    { value: 'technology', label: 'Technology' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'finance', label: 'Finance' },
    { value: 'retail', label: 'Retail' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'hospitality', label: 'Hospitality' },
    { value: 'education', label: 'Education' },
    { value: 'other', label: 'Other' },
  ];

  const legalStructures = [
    { value: 'llc', label: 'LLC (Limited Liability Company)' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'free_zone', label: 'Free Zone Company' },
    { value: 'branch', label: 'Branch Office' },
    { value: 'other', label: 'Other' },
  ];

  const businessModels = [
    { value: 'b2b', label: 'B2B (Business to Business)' },
    { value: 'b2c', label: 'B2C (Business to Consumer)' },
    { value: 'b2b2c', label: 'B2B2C (Business to Business to Consumer)' },
    { value: 'marketplace', label: 'Marketplace' },
    { value: 'saas', label: 'SaaS (Software as a Service)' },
    { value: 'other', label: 'Other' },
  ];

  const fundingStages = [
    { value: 'bootstrapped', label: 'Bootstrapped' },
    { value: 'pre_seed', label: 'Pre-Seed' },
    { value: 'seed', label: 'Seed' },
    { value: 'series_a', label: 'Series A' },
    { value: 'series_b', label: 'Series B' },
    { value: 'series_c_plus', label: 'Series C+' },
    { value: 'profitable', label: 'Profitable' },
    { value: 'other', label: 'Other' },
  ];

  const officeTypes = [
    { value: 'own_premises', label: 'Own Premises' },
    { value: 'rented', label: 'Rented Office' },
    { value: 'shared_coworking', label: 'Shared / Coworking Space' },
    { value: 'virtual', label: 'Virtual Office' },
    { value: 'home_based', label: 'Home Based' },
  ];

  const tabOrder = ['basic', 'legal', 'ownership', 'financial', 'operations', 'compliance', 'documents'];

  // Sync tab with URL parameter
  useEffect(() => {
    const tabFromUrl = searchParams.get('tab');
    if (tabFromUrl && ['basic', 'legal', 'ownership', 'financial', 'operations', 'compliance', 'documents'].includes(tabFromUrl)) {
      setActiveTab(tabFromUrl);
    }
  }, [searchParams]);

  // Fetch profile on mount
  useEffect(() => {
    fetchProfile();
  }, []);

  // Fetch documents when switching to documents tab
  useEffect(() => {
    if (activeTab === 'documents') {
      fetchDocuments();
    }
  }, [activeTab]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const result = await api.getSMEProfile();
      if (result.success && result.data) {
        const profile = result.data;
        const docs = profile.documents || {};

        setFormData({
          // Basic Info
          companyName: profile.companyName || '',
          tradeLicenseNumber: profile.tradeLicenseNumber || '',
          companyDescription: profile.companyDescription || '',
          industrySector: profile.industrySector || '',
          website: profile.website || '',
          address: profile.address || '',
          foundingDate: profile.foundingDate ? profile.foundingDate.split('T')[0] : '',
          employeeCount: profile.employeeCount || undefined,
          contactName: docs.contactName || '',
          contactPosition: docs.contactPosition || '',
          contactEmail: docs.contactEmail || '',
          contactPhone: docs.contactPhone || '',
          revenueRange: docs.revenueRange || '',
          revenueGrowth: docs.revenueGrowth || '',
          // Legal & Registration
          registrationNumber: profile.registrationNumber || '',
          vatNumber: profile.vatNumber || '',
          licenseExpiryDate: profile.licenseExpiryDate ? profile.licenseExpiryDate.split('T')[0] : '',
          legalStructure: profile.legalStructure || '',
          registrationCountry: profile.registrationCountry || '',
          registrationCity: profile.registrationCity || '',
          // Ownership & Management
          ownerName: profile.ownerName || '',
          ownerNationality: profile.ownerNationality || '',
          ownerIdNumber: profile.ownerIdNumber || '',
          shareholderStructure: profile.shareholderStructure || [],
          boardMembers: profile.boardMembers || [],
          // Financial Info
          bankName: profile.bankName || '',
          bankAccountNumber: profile.bankAccountNumber || '',
          auditorName: profile.auditorName || '',
          lastAuditDate: profile.lastAuditDate ? profile.lastAuditDate.split('T')[0] : '',
          profitMargin: profile.profitMargin || undefined,
          fundingStage: profile.fundingStage || '',
          // Business Operations
          businessModel: profile.businessModel || '',
          operatingCountries: profile.operatingCountries || [],
          majorClients: profile.majorClients || [],
          officeType: profile.officeType || '',
          // Compliance & Certifications
          existingCertifications: profile.existingCertifications || [],
          regulatoryLicenses: profile.regulatoryLicenses || [],
          complianceOfficerName: profile.complianceOfficerName || '',
          complianceOfficerEmail: profile.complianceOfficerEmail || '',
          hasAmlPolicy: profile.hasAmlPolicy || false,
          hasDataProtectionPolicy: profile.hasDataProtectionPolicy || false,
          // Contact & Social
          linkedinUrl: profile.linkedinUrl || '',
          socialMedia: profile.socialMedia || {},
          headOfficeAddress: profile.headOfficeAddress || '',
          secondaryContactName: profile.secondaryContactName || '',
          secondaryContactPhone: profile.secondaryContactPhone || '',
          secondaryContactEmail: profile.secondaryContactEmail || '',
        });
        setCertificationStatus(profile.certificationStatus);
        setRevisionNotes(profile.revisionNotes);

        // Set documents if available
        if (docs.uploadedFiles && Array.isArray(docs.uploadedFiles)) {
          // Filter to only include properly formatted documents
          const validDocs = docs.uploadedFiles.filter(
            (doc: Partial<UploadedDocument>) => doc.id && doc.type && doc.name
          ) as UploadedDocument[];
          setDocuments(validDocs);
        }

        // Set company logo if available
        if (docs.companyLogo) {
          setCompanyLogo(docs.companyLogo);
        }
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error);
      setErrorMessage('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const fetchDocuments = async () => {
    try {
      const result = await api.getDocuments();
      if (result.success && result.data) {
        const data = result.data as { documents?: UploadedDocument[] };
        setDocuments(data.documents || []);
      }
    } catch (error) {
      console.error('Failed to fetch documents:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    setSuccessMessage('');
    setErrorMessage('');
  };

  const handleSaveDraft = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.updateSMEProfile(formData);
      if (result.success) {
        setSuccessMessage('Draft saved successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to save draft');
      }
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Failed to save draft. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndContinue = async () => {
    setSaving(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.updateSMEProfile(formData);
      if (result.success) {
        const currentIndex = tabOrder.indexOf(activeTab);
        if (currentIndex < tabOrder.length - 1) {
          setActiveTab(tabOrder[currentIndex + 1]);
          setSuccessMessage('Saved! Moving to next section...');
        } else {
          setSuccessMessage('All sections completed! You can now submit for certification.');
        }
      } else {
        setErrorMessage(result.message || 'Failed to save');
      }
    } catch (error) {
      console.error('Save error:', error);
      setErrorMessage('Failed to save. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // Handle logo upload
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      setErrorMessage('Invalid file type. Only JPG, PNG, GIF, and WebP are allowed.');
      return;
    }

    // Validate file size (5MB for logos)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Logo file size must be less than 5MB');
      return;
    }

    setUploadingLogo(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.uploadCompanyLogo(file);
      if (result.success && result.data) {
        setCompanyLogo(result.data.companyLogo);
        setSuccessMessage('Company logo uploaded successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to upload logo');
      }
    } catch (error) {
      console.error('Logo upload error:', error);
      setErrorMessage('Failed to upload logo. Please try again.');
    } finally {
      setUploadingLogo(false);
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    }
  };

  // Handle logo delete
  const handleLogoDelete = async () => {
    if (!confirm('Are you sure you want to delete the company logo?')) return;

    setDeletingLogo(true);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.deleteCompanyLogo();
      if (result.success) {
        setCompanyLogo(null);
        setSuccessMessage('Company logo deleted successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to delete logo');
      }
    } catch (error) {
      console.error('Logo delete error:', error);
      setErrorMessage('Failed to delete logo. Please try again.');
    } finally {
      setDeletingLogo(false);
    }
  };

  const handleFileSelect = (documentType: string) => {
    fileInputRefs.current[documentType]?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>, documentType: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      setErrorMessage('File size must be less than 10MB');
      return;
    }

    setUploading(documentType);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.uploadDocument(file, documentType);
      if (result.success && result.data) {
        const data = result.data as { documents?: UploadedDocument[] };
        setDocuments(data.documents || []);
        setSuccessMessage('Document uploaded successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to upload document');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setErrorMessage('Failed to upload document. Please try again.');
    } finally {
      setUploading(null);
      // Reset file input
      if (fileInputRefs.current[documentType]) {
        fileInputRefs.current[documentType]!.value = '';
      }
    }
  };

  const handleDeleteDocument = async (documentId: string) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    setDeleting(documentId);
    setSuccessMessage('');
    setErrorMessage('');

    try {
      const result = await api.deleteDocument(documentId);
      if (result.success) {
        const data = result.data as { documents?: UploadedDocument[] } | undefined;
        setDocuments(data?.documents || []);
        setSuccessMessage('Document deleted successfully!');
      } else {
        setErrorMessage(result.message || 'Failed to delete document');
      }
    } catch (error) {
      console.error('Delete error:', error);
      setErrorMessage('Failed to delete document. Please try again.');
    } finally {
      setDeleting(null);
    }
  };

  const getUploadedDocument = (documentType: string): UploadedDocument | undefined => {
    return documents.find(doc => doc.type === documentType);
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isTabComplete = (tabId: string): boolean => {
    switch (tabId) {
      case 'basic':
        return !!(formData.companyName && formData.tradeLicenseNumber && formData.companyDescription && formData.industrySector && formData.address);
      case 'legal':
        return !!(formData.registrationNumber && formData.legalStructure);
      case 'ownership':
        return !!(formData.ownerName && formData.ownerNationality);
      case 'financial':
        return !!(formData.fundingStage || formData.bankName);
      case 'operations':
        return !!(formData.businessModel);
      case 'compliance':
        return !!(formData.hasAmlPolicy || formData.hasDataProtectionPolicy);
      case 'documents':
        const requiredTypes = DOCUMENT_TYPES.filter(d => d.required).map(d => d.type);
        return requiredTypes.every(type => documents.some(doc => doc.type === type));
      default:
        return false;
    }
  };

  const getMissingFields = (tabId: string): string[] => {
    const missing: string[] = [];
    switch (tabId) {
      case 'basic':
        if (!formData.companyName) missing.push('Company Name');
        if (!formData.tradeLicenseNumber) missing.push('Trade License Number');
        if (!formData.companyDescription) missing.push('Company Description');
        if (!formData.industrySector) missing.push('Industry Sector');
        if (!formData.address) missing.push('Business Address');
        break;
      case 'legal':
        if (!formData.registrationNumber) missing.push('Registration Number');
        if (!formData.legalStructure) missing.push('Legal Structure');
        break;
      case 'ownership':
        if (!formData.ownerName) missing.push('Owner Name');
        if (!formData.ownerNationality) missing.push('Owner Nationality');
        break;
      case 'financial':
        if (!formData.fundingStage && !formData.bankName) missing.push('Funding Stage or Bank Name');
        break;
      case 'operations':
        if (!formData.businessModel) missing.push('Business Model');
        break;
      case 'compliance':
        if (!formData.hasAmlPolicy && !formData.hasDataProtectionPolicy) missing.push('At least one compliance policy');
        break;
      case 'documents':
        const requiredDocs = DOCUMENT_TYPES.filter(d => d.required);
        requiredDocs.forEach(doc => {
          if (!documents.some(d => d.type === doc.type)) {
            missing.push(doc.label);
          }
        });
        break;
    }
    return missing;
  };

  const allTabsComplete = tabs.every(tab => isTabComplete(tab.id));
  const canSubmitCertification = canEdit && allTabsComplete && (certificationStatus === 'draft' || certificationStatus === 'revision_requested');

  const [submitting, setSubmitting] = useState(false);

  const handleSubmitCertification = async () => {
    if (!canSubmitCertification) return;

    setSubmitting(true);
    setErrorMessage('');

    try {
      const result = await api.submitCertification();
      if (result.success) {
        setSuccessMessage('Application submitted successfully! Our team will review it shortly.');
        setCertificationStatus('submitted');
      } else {
        setErrorMessage(result.message || 'Failed to submit application');
      }
    } catch (error) {
      setErrorMessage('Failed to submit application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-8 w-48 rounded" style={{ background: 'var(--graphite-200)' }} />
        <div className="h-32 rounded-2xl" style={{ background: 'var(--graphite-200)' }} />
        <div className="h-96 rounded-2xl" style={{ background: 'var(--graphite-200)' }} />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div
        className="rounded-2xl p-6 sm:p-8 text-white relative overflow-hidden"
        style={{ background: 'var(--graphite-800)' }}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
            <div>
              <h1 className="text-2xl font-bold">Company Profile</h1>
              <p style={{ color: 'var(--graphite-300)' }} className="mt-0.5">Complete your company information for certification</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/sme"
              className="px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors shadow-lg"
              style={{ background: 'var(--teal-600)', color: 'white' }}
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div
          className="px-4 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: 'var(--success-50)',
            border: '1px solid var(--success-100)',
            color: 'var(--success-600)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div
          className="px-4 py-3 rounded-xl flex items-center gap-2"
          style={{
            background: 'var(--danger-50)',
            border: '1px solid var(--danger-100)',
            color: 'var(--danger-600)'
          }}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}

      {/* Revision Notes Banner */}
      {certificationStatus === 'revision_requested' && revisionNotes && (
        <div
          className="rounded-xl p-4 sm:p-5"
          style={{
            background: 'var(--warning-50)',
            border: '1px solid var(--warning-100)'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--warning-600)' }}>Revision Required</h3>
              <p className="mt-2 text-sm sm:text-base" style={{ color: 'var(--warning-500)' }}>{revisionNotes}</p>
              <p className="mt-3 text-sm" style={{ color: 'var(--warning-500)' }}>Please address the above feedback and resubmit your application from the dashboard.</p>
            </div>
          </div>
        </div>
      )}

      {/* Read-Only Status Banner */}
      {!canEdit && (
        <div
          className="border rounded-xl p-4 sm:p-5"
          style={{
            background: certificationStatus === 'certified'
              ? 'var(--success-50)'
              : certificationStatus === 'rejected'
              ? 'var(--danger-50)'
              : 'var(--teal-50)',
            borderColor: certificationStatus === 'certified'
              ? 'var(--success-100)'
              : certificationStatus === 'rejected'
              ? 'var(--danger-100)'
              : 'var(--teal-100)'
          }}
        >
          <div className="flex items-start gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{
                background: certificationStatus === 'certified'
                  ? 'var(--success-100)'
                  : certificationStatus === 'rejected'
                  ? 'var(--danger-100)'
                  : 'var(--teal-100)',
                color: certificationStatus === 'certified'
                  ? 'var(--success-600)'
                  : certificationStatus === 'rejected'
                  ? 'var(--danger-600)'
                  : 'var(--teal-600)'
              }}
            >
              {certificationStatus === 'certified' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              ) : certificationStatus === 'rejected' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </div>
            <div className="flex-1">
              <h3
                className="font-bold text-base sm:text-lg"
                style={{
                  color: certificationStatus === 'certified'
                    ? 'var(--success-600)'
                    : certificationStatus === 'rejected'
                    ? 'var(--danger-600)'
                    : 'var(--teal-700)'
                }}
              >
                {certificationStatus === 'certified'
                  ? 'Profile Certified'
                  : certificationStatus === 'rejected'
                  ? 'Application Rejected'
                  : certificationStatus === 'under_review'
                  ? 'Application Under Review'
                  : 'Application Submitted'}
              </h3>
              <p
                className="mt-1 text-sm"
                style={{
                  color: certificationStatus === 'certified'
                    ? 'var(--success-500)'
                    : certificationStatus === 'rejected'
                    ? 'var(--danger-500)'
                    : 'var(--teal-600)'
                }}
              >
                {certificationStatus === 'certified'
                  ? 'Your company profile is certified. You can view your information below.'
                  : certificationStatus === 'rejected'
                  ? 'Your application has been rejected. Please contact support for more information.'
                  : 'Your application is being reviewed. You cannot make changes until the review is complete.'}
              </p>
              {certificationStatus === 'rejected' && revisionNotes && (
                <p className="mt-2 text-sm font-medium" style={{ color: 'var(--danger-600)' }}>Reason: {revisionNotes}</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress Banner */}
      <div className="solid-card rounded-2xl p-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-center gap-4">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
              style={{ background: 'var(--teal-600)' }}
            >
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h3 className="font-bold" style={{ color: 'var(--graphite-900)' }}>Profile Completion</h3>
              <p className="text-sm mt-0.5" style={{ color: 'var(--graphite-500)' }}>Complete all sections to submit for certification</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex-1 lg:w-56">
              <div className="flex items-center justify-between text-sm mb-2">
                <span style={{ color: 'var(--graphite-500)' }}>Progress</span>
                <span className="font-bold" style={{ color: 'var(--teal-600)' }}>{completionPercentage}%</span>
              </div>
              <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ width: `${completionPercentage}%`, background: 'var(--teal-600)' }}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="solid-card rounded-2xl">
        <div style={{ borderBottom: '1px solid var(--graphite-100)' }}>
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-all"
                style={{
                  borderColor: activeTab === tab.id ? 'var(--teal-600)' : 'transparent',
                  color: activeTab === tab.id ? 'var(--teal-600)' : 'var(--graphite-500)',
                  background: activeTab === tab.id ? 'var(--teal-50)' : 'transparent'
                }}
              >
                {tab.icon}
                {tab.label}
                {isTabComplete(tab.id) && (
                  <svg className="w-4 h-4" style={{ color: 'var(--success-500)' }} fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-6 md:p-8">
          {activeTab === 'basic' && (
            <div className="space-y-8">
              {/* Company Logo Section */}
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Company Logo</h3>
                <div
                  className="flex flex-col sm:flex-row items-start sm:items-center gap-6 p-5 rounded-xl"
                  style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)' }}
                >
                  {/* Logo Preview */}
                  <div
                    className="w-24 h-24 rounded-xl flex items-center justify-center overflow-hidden flex-shrink-0"
                    style={{
                      background: companyLogo ? 'white' : 'var(--graphite-100)',
                      border: '2px dashed var(--graphite-300)'
                    }}
                  >
                    {companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${companyLogo}`}
                        alt="Company Logo"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <svg className="w-10 h-10" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    )}
                  </div>

                  {/* Logo Info & Actions */}
                  <div className="flex-1">
                    <p className="font-medium mb-1" style={{ color: 'var(--graphite-800)' }}>
                      {companyLogo ? 'Logo uploaded' : 'No logo uploaded'}
                    </p>
                    <p className="text-sm mb-3" style={{ color: 'var(--graphite-500)' }}>
                      Upload your company logo. It will appear on your public registry profile. Recommended: Square image, at least 200x200px. Max 5MB.
                    </p>

                    {/* Hidden file input */}
                    <input
                      ref={logoInputRef}
                      type="file"
                      accept="image/jpeg,image/png,image/gif,image/webp"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />

                    {canEdit && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => logoInputRef.current?.click()}
                          disabled={uploadingLogo}
                          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                          style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}
                        >
                          {uploadingLogo ? (
                            <span className="flex items-center gap-2">
                              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                              </svg>
                              Uploading...
                            </span>
                          ) : companyLogo ? 'Change Logo' : 'Upload Logo'}
                        </button>
                        {companyLogo && (
                          <button
                            onClick={handleLogoDelete}
                            disabled={deletingLogo}
                            className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50"
                            style={{ color: 'var(--danger-600)' }}
                          >
                            {deletingLogo ? 'Deleting...' : 'Remove'}
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Company Identity</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Company Name <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="companyName"
                      value={formData.companyName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{
                        background: canEdit ? 'white' : 'var(--graphite-100)',
                        cursor: canEdit ? 'text' : 'not-allowed'
                      }}
                      placeholder="Enter company name"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      Trade License Number <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="tradeLicenseNumber"
                      value={formData.tradeLicenseNumber}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Enter license number"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="input-label block mb-2">
                  Company Description <span style={{ color: 'var(--danger-500)' }}>*</span>
                </label>
                <textarea
                  name="companyDescription"
                  value={formData.companyDescription}
                  onChange={handleInputChange}
                  disabled={!canEdit}
                  rows={4}
                  className="w-full px-4 py-3 rounded-xl transition-all resize-none"
                  style={{
                    border: '1px solid var(--graphite-200)',
                    background: 'white'
                  }}
                  placeholder="Describe your company and its services..."
                />
                <p className="text-xs mt-1.5" style={{ color: 'var(--graphite-400)' }}>Minimum 100 characters recommended for better visibility</p>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Industry & Web Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Industry Sector <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <select
                      name="industrySector"
                      value={formData.industrySector}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select sector</option>
                      {sectors.map((sector) => (
                        <option key={sector.value} value={sector.value}>{sector.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label block mb-2">Website</label>
                    <input
                      type="url"
                      name="website"
                      value={formData.website}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Business Location</h3>
                <div>
                  <label className="input-label block mb-2">
                    Business Address <span style={{ color: 'var(--danger-500)' }}>*</span>
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    disabled={!canEdit}
                    rows={2}
                    className="w-full px-4 py-3 rounded-xl transition-all resize-none"
                    style={{
                      border: '1px solid var(--graphite-200)',
                      background: 'white'
                    }}
                    placeholder="Enter full business address including emirate"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Legal & Registration Tab */}
          {activeTab === 'legal' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Registration Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Registration / CR Number <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationNumber"
                      value={formData.registrationNumber}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Company registration number"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      VAT / Tax Number
                    </label>
                    <input
                      type="text"
                      name="vatNumber"
                      value={formData.vatNumber}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="VAT registration number"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="input-label block mb-2">
                      License Expiry Date <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="date"
                      name="licenseExpiryDate"
                      value={formData.licenseExpiryDate}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      Legal Structure <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <select
                      name="legalStructure"
                      value={formData.legalStructure}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select legal structure</option>
                      {legalStructures.map((ls) => (
                        <option key={ls.value} value={ls.value}>{ls.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Registration Location</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Country of Incorporation <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationCountry"
                      value={formData.registrationCountry}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="e.g. United Arab Emirates"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      City of Registration <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="registrationCity"
                      value={formData.registrationCity}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="e.g. Dubai"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Ownership Tab */}
          {activeTab === 'ownership' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Primary Owner / CEO</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Owner / CEO Name <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerName"
                      value={formData.ownerName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Full name of owner or CEO"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      Nationality <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="ownerNationality"
                      value={formData.ownerNationality}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="e.g. Emirati, Indian, British"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="input-label block mb-2">
                      Emirates ID / National ID
                    </label>
                    <input
                      type="text"
                      name="ownerIdNumber"
                      value={formData.ownerIdNumber}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="ID number (kept confidential)"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Contact Person</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">
                      Contact Name <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="contactName"
                      value={formData.contactName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Full name of primary contact"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      Position <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="text"
                      name="contactPosition"
                      value={formData.contactPosition}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="e.g. CEO, Managing Director"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                  <div>
                    <label className="input-label block mb-2">
                      Contact Email <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="email"
                      name="contactEmail"
                      value={formData.contactEmail}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="contact@company.ae"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">
                      Contact Phone <span style={{ color: 'var(--danger-500)' }}>*</span>
                    </label>
                    <input
                      type="tel"
                      name="contactPhone"
                      value={formData.contactPhone}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Secondary Contact (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <label className="input-label block mb-2">Name</label>
                    <input
                      type="text"
                      name="secondaryContactName"
                      value={formData.secondaryContactName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Secondary contact name"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Email</label>
                    <input
                      type="email"
                      name="secondaryContactEmail"
                      value={formData.secondaryContactEmail}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="secondary@company.ae"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Phone</label>
                    <input
                      type="tel"
                      name="secondaryContactPhone"
                      value={formData.secondaryContactPhone}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="+971 50 123 4567"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'financial' && (
            <div className="space-y-8">
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'var(--warning-50)',
                  border: '1px solid var(--warning-100)'
                }}
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--warning-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--warning-600)' }}>Financial Information (Optional)</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--warning-500)' }}>This information helps in certification verification and will be kept confidential</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Revenue Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">Annual Revenue (AED)</label>
                    <select
                      name="revenueRange"
                      value={formData.revenueRange}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select revenue range</option>
                      <option value="<1m">Less than 1 Million</option>
                      <option value="1m-5m">1 - 5 Million</option>
                      <option value="5m-10m">5 - 10 Million</option>
                      <option value="10m-50m">10 - 50 Million</option>
                      <option value="50m-100m">50 - 100 Million</option>
                      <option value=">100m">More than 100 Million</option>
                    </select>
                  </div>
                  <div>
                    <label className="input-label block mb-2">Revenue Growth (YoY)</label>
                    <select
                      name="revenueGrowth"
                      value={formData.revenueGrowth}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select growth rate</option>
                      <option value="negative">Declining</option>
                      <option value="0-10">0 - 10%</option>
                      <option value="10-25">10 - 25%</option>
                      <option value="25-50">25 - 50%</option>
                      <option value="50-100">50 - 100%</option>
                      <option value=">100">More than 100%</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Funding & Banking</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">Funding Stage</label>
                    <select
                      name="fundingStage"
                      value={formData.fundingStage}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select funding stage</option>
                      {fundingStages.map((fs) => (
                        <option key={fs.value} value={fs.value}>{fs.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label block mb-2">Primary Bank</label>
                    <input
                      type="text"
                      name="bankName"
                      value={formData.bankName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="e.g. Emirates NBD, ADCB"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Audit Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">External Auditor</label>
                    <input
                      type="text"
                      name="auditorName"
                      value={formData.auditorName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Auditing firm name"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Last Audit Date</label>
                    <input
                      type="date"
                      name="lastAuditDate"
                      value={formData.lastAuditDate}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Operations Tab */}
          {activeTab === 'operations' && (
            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Business Model</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">Business Model <span style={{ color: 'var(--danger-500)' }}>*</span></label>
                    <select
                      name="businessModel"
                      value={formData.businessModel}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select business model</option>
                      {businessModels.map((bm) => (
                        <option key={bm.value} value={bm.value}>{bm.label}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="input-label block mb-2">Office Type</label>
                    <select
                      name="officeType"
                      value={formData.officeType}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select office type</option>
                      {officeTypes.map((ot) => (
                        <option key={ot.value} value={ot.value}>{ot.label}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Company Timeline</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">Founding Date</label>
                    <input
                      type="date"
                      name="foundingDate"
                      value={formData.foundingDate}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Number of Employees</label>
                    <select
                      name="employeeCount"
                      value={formData.employeeCount || ''}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      style={{ color: 'var(--graphite-700)' }}
                    >
                      <option value="">Select range</option>
                      <option value="5">1-10 employees</option>
                      <option value="25">11-50 employees</option>
                      <option value="75">51-100 employees</option>
                      <option value="175">101-250 employees</option>
                      <option value="375">251-500 employees</option>
                      <option value="500">500+ employees</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Online Presence</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">LinkedIn URL</label>
                    <input
                      type="url"
                      name="linkedinUrl"
                      value={formData.linkedinUrl}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="https://linkedin.com/company/..."
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Head Office Address</label>
                    <input
                      type="text"
                      name="headOfficeAddress"
                      value={formData.headOfficeAddress}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Full office address"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Compliance Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-8">
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'var(--teal-50)',
                  border: '1px solid var(--teal-100)'
                }}
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--teal-600)' }}>Compliance Information</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--teal-600)' }}>Add your compliance policies and certifications to build trust</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Policies</h3>
                <div className="space-y-4">
                  <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ background: formData.hasAmlPolicy ? 'var(--success-50)' : 'var(--graphite-50)', border: `1px solid ${formData.hasAmlPolicy ? 'var(--success-200)' : 'var(--graphite-200)'}` }}>
                    <input
                      type="checkbox"
                      name="hasAmlPolicy"
                      checked={formData.hasAmlPolicy}
                      onChange={(e) => setFormData({ ...formData, hasAmlPolicy: e.target.checked })}
                      disabled={!canEdit}
                      className="w-5 h-5 rounded"
                    />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>AML Policy</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Company has an Anti-Money Laundering policy in place</p>
                    </div>
                  </label>
                  <label className="flex items-center gap-3 p-4 rounded-lg cursor-pointer transition-colors" style={{ background: formData.hasDataProtectionPolicy ? 'var(--success-50)' : 'var(--graphite-50)', border: `1px solid ${formData.hasDataProtectionPolicy ? 'var(--success-200)' : 'var(--graphite-200)'}` }}>
                    <input
                      type="checkbox"
                      name="hasDataProtectionPolicy"
                      checked={formData.hasDataProtectionPolicy}
                      onChange={(e) => setFormData({ ...formData, hasDataProtectionPolicy: e.target.checked })}
                      disabled={!canEdit}
                      className="w-5 h-5 rounded"
                    />
                    <div>
                      <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>Data Protection Policy</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Company complies with data protection / privacy regulations</p>
                    </div>
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: 'var(--graphite-900)' }}>Compliance Officer (Optional)</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="input-label block mb-2">Compliance Officer Name</label>
                    <input
                      type="text"
                      name="complianceOfficerName"
                      value={formData.complianceOfficerName}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="Full name"
                    />
                  </div>
                  <div>
                    <label className="input-label block mb-2">Compliance Officer Email</label>
                    <input
                      type="email"
                      name="complianceOfficerEmail"
                      value={formData.complianceOfficerEmail}
                      onChange={handleInputChange}
                      disabled={!canEdit}
                      className="input-field w-full h-12"
                      placeholder="compliance@company.ae"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'documents' && (
            <div className="space-y-8">
              <div
                className="rounded-xl p-4"
                style={{
                  background: 'var(--teal-50)',
                  border: '1px solid var(--teal-100)'
                }}
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="font-semibold" style={{ color: 'var(--teal-700)' }}>Required Documents</p>
                    <p className="text-sm mt-0.5" style={{ color: 'var(--teal-600)' }}>Please upload clear copies of all required documents. Accepted formats: PDF, JPG, PNG, DOC, DOCX (max 10MB each)</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                {DOCUMENT_TYPES.map((docType) => {
                  const uploadedDoc = getUploadedDocument(docType.type);
                  const isUploading = uploading === docType.type;
                  const isDeleting = deleting === uploadedDoc?.id;

                  return (
                    <div
                      key={docType.type}
                      className="flex items-center justify-between p-5 rounded-xl border-2 transition-colors"
                      style={{
                        borderColor: uploadedDoc ? 'var(--success-500)' : 'var(--graphite-200)',
                        borderStyle: uploadedDoc ? 'solid' : 'dashed',
                        background: uploadedDoc ? 'var(--success-50)' : 'var(--graphite-50)'
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className="w-12 h-12 rounded-xl flex items-center justify-center"
                          style={{ background: uploadedDoc ? 'var(--success-100)' : 'var(--graphite-100)' }}
                        >
                          {uploadedDoc ? (
                            <svg className="w-6 h-6" style={{ color: 'var(--success-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <svg className="w-6 h-6" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-semibold" style={{ color: 'var(--graphite-900)' }}>
                            {docType.label}
                            {docType.required && <span style={{ color: 'var(--danger-500)' }} className="ml-1">*</span>}
                          </p>
                          {uploadedDoc ? (
                            <p className="text-sm" style={{ color: 'var(--success-600)' }}>
                              {uploadedDoc.originalName} ({formatFileSize(uploadedDoc.size)})
                            </p>
                          ) : (
                            <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>No file uploaded</p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Hidden file input */}
                        <input
                          ref={(el) => { fileInputRefs.current[docType.type] = el; }}
                          type="file"
                          accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                          onChange={(e) => handleFileUpload(e, docType.type)}
                          className="hidden"
                        />

                        {uploadedDoc ? (
                          <>
                            {canEdit && (
                              <>
                                <button
                                  onClick={() => handleFileSelect(docType.type)}
                                  disabled={isUploading || isDeleting}
                                  className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                                  style={{ color: 'var(--teal-600)' }}
                                >
                                  Replace
                                </button>
                                <button
                                  onClick={() => handleDeleteDocument(uploadedDoc.id)}
                                  disabled={isUploading || isDeleting}
                                  className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                                  style={{ color: 'var(--danger-600)' }}
                                >
                                  {isDeleting ? 'Deleting...' : 'Remove'}
                                </button>
                              </>
                            )}
                          </>
                        ) : canEdit ? (
                          <button
                            onClick={() => handleFileSelect(docType.type)}
                            disabled={isUploading}
                            className="px-4 py-2 text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
                            style={{
                              background: 'var(--teal-50)',
                              color: 'var(--teal-600)'
                            }}
                          >
                            {isUploading ? (
                              <span className="flex items-center gap-2">
                                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                Uploading...
                              </span>
                            ) : (
                              'Upload'
                            )}
                          </button>
                        ) : (
                          <span className="px-4 py-2 text-sm" style={{ color: 'var(--graphite-400)' }}>Not uploaded</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Upload Summary */}
              <div className="rounded-xl p-4" style={{ background: 'var(--graphite-50)' }}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium" style={{ color: 'var(--graphite-700)' }}>Upload Progress</p>
                    <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                      {documents.length} of {DOCUMENT_TYPES.filter(d => d.required).length} required documents uploaded
                    </p>
                  </div>
                  {isTabComplete('documents') && (
                    <span className="badge badge-success">
                      All required documents uploaded
                    </span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Save Buttons - Only show on non-documents tabs when profile is editable */}
          {activeTab !== 'documents' && canEdit && (
            <div className="pt-8 mt-8 flex items-center justify-between" style={{ borderTop: '1px solid var(--graphite-100)' }}>
              <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                <span style={{ color: 'var(--danger-500)' }}>*</span> Required fields
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleSaveDraft}
                  disabled={saving}
                  className="btn-secondary px-5 py-2.5 font-semibold rounded-xl transition-colors disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save as Draft'}
                </button>
                <button
                  onClick={handleSaveAndContinue}
                  disabled={saving}
                  className="btn-teal px-6 py-2.5 font-semibold rounded-xl transition-all disabled:opacity-50"
                >
                  {saving ? 'Saving...' : 'Save & Continue'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Submit Certification Section */}
      {canEdit && (
        <div
          className="rounded-2xl p-6"
          style={{
            background: allTabsComplete ? 'var(--teal-700)' : 'white',
            border: allTabsComplete ? 'none' : '1px solid var(--graphite-200)'
          }}
        >
          {allTabsComplete ? (
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold text-white text-lg">Application Ready</h3>
                  <p className="text-sm" style={{ color: 'var(--teal-200)' }}>All requirements completed. Proceed to submit for certification review.</p>
                </div>
              </div>
              <button
                onClick={handleSubmitCertification}
                disabled={submitting}
                className="px-6 py-3 bg-white font-semibold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                style={{ color: 'var(--teal-700)' }}
              >
                {submitting ? (
                  <>
                    <div className="w-4 h-4 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--teal-600)', borderTopColor: 'transparent' }} />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit for Certification
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ background: 'var(--warning-100)' }}
                >
                  <svg className="w-5 h-5" style={{ color: 'var(--warning-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold" style={{ color: 'var(--graphite-900)' }}>Complete All Sections to Submit</h3>
                  <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>The following items are still required:</p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {tabs.map((tab) => {
                  const missing = getMissingFields(tab.id);
                  if (missing.length === 0) return null;
                  return (
                    <div key={tab.id} className="rounded-xl p-4" style={{ background: 'var(--graphite-50)' }}>
                      <p className="font-medium text-sm mb-2" style={{ color: 'var(--graphite-700)' }}>{tab.label}:</p>
                      <ul className="space-y-1">
                        {missing.map((field, idx) => (
                          <li key={idx} className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--danger-500)' }} />
                            {field}
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      </div>
  );
}
