'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RegistrySMEDetail } from '@/types';

const STATIC_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

export default function SMEDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sme, setSme] = useState<RegistrySMEDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'business' | 'credentials' | 'contact'>('overview');
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [introMessage, setIntroMessage] = useState('');
  const [introSending, setIntroSending] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const [introError, setIntroError] = useState('');

  useEffect(() => {
    const fetchSME = async () => {
      try {
        setLoading(true);
        const result = await api.getRegistrySMEDetail(params.id as string);
        if (result.success && result.data) {
          setSme(result.data);
        } else {
          setError('Company not found');
        }
      } catch (err) {
        setError('Failed to load company details');
      } finally {
        setLoading(false);
      }
    };
    if (params.id) fetchSME();
  }, [params.id]);

  const getInitials = (name: string | null | undefined) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const formatSector = (sector: string | null | undefined) => {
    if (!sector) return 'Unknown Sector';
    return sector.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formatEmployeeCount = (count: string | number | null | undefined) => {
    if (!count) return 'N/A';
    return String(count);
  };

  const formatEnumValue = (value: string | null | undefined) => {
    if (!value) return null;
    return value.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const [alreadyConnected, setAlreadyConnected] = useState(false);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);
  const [messageSentToExisting, setMessageSentToExisting] = useState(false);

  const handleSendIntroduction = async () => {
    if (!sme) return;
    setIntroSending(true);
    setIntroError('');
    setAlreadyConnected(false);
    setExistingConversationId(null);
    setMessageSentToExisting(false);
    try {
      const result = await api.requestIntroduction(sme.id, introMessage);
      if (result.success) {
        const data = result.data as { id: string; existing?: boolean } | undefined;
        // If existing conversation exists
        if (data?.existing && data?.id) {
          setAlreadyConnected(true);
          setExistingConversationId(data.id);

          // If user typed a message, send it to the existing conversation
          if (introMessage.trim()) {
            try {
              const msgResult = await api.sendChatMessage(data.id, introMessage.trim());
              if (msgResult.success) {
                setMessageSentToExisting(true);
              }
            } catch (e) {
              // Message sending failed silently - user can still go to messages
            }
          }
        } else {
          // New request created
          setIntroSent(true);
          setTimeout(() => {
            setShowIntroModal(false);
            setIntroSent(false);
            setIntroMessage('');
          }, 2500);
        }
      } else {
        setIntroError(result.message || 'Failed to send request');
      }
    } catch (err) {
      setIntroError('Failed to send introduction request');
    } finally {
      setIntroSending(false);
    }
  };

  const handleGoToMessages = () => {
    if (existingConversationId) {
      router.push(`/user/messages?chat=${existingConversationId}`);
    } else {
      router.push('/user/messages');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '3px solid #e5e7eb', borderTopColor: '#14b8a6' }} />
      </div>
    );
  }

  if (error || !sme) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: '#fee2e2' }}>
          <svg className="w-10 h-10" style={{ color: '#ef4444' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: '#111827' }}>Company Not Found</h2>
        <p className="mb-6" style={{ color: '#6b7280' }}>{error}</p>
        <button onClick={() => router.push('/user')} className="btn-teal px-6 py-3 rounded-xl font-semibold">
          Back to Registry
        </button>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
    { id: 'business', label: 'Business', icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z' },
    { id: 'credentials', label: 'Credentials', icon: 'M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z' },
    { id: 'contact', label: 'Contact', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
  ];

  return (
    <div className="pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/user')}
        className="mb-6 flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
        style={{ color: '#6b7280' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Registry
      </button>

      {/* Hero Section */}
      <div className="rounded-2xl p-6 mb-6" style={{ background: 'linear-gradient(135deg, var(--graphite-800) 0%, var(--graphite-900) 100%)' }}>
        <div className="relative">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Logo */}
            <div className="relative">
              {sme.companyLogo ? (
                <div className="w-28 h-28 rounded-2xl overflow-hidden bg-white shadow-xl border-4 border-white/20">
                  <img
                    src={`${STATIC_BASE_URL}${sme.companyLogo}`}
                    alt={sme.companyName || 'Company Logo'}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-3xl font-bold" style="background: linear-gradient(135deg, var(--graphite-700) 0%, var(--graphite-900) 100%); color: white;">${getInitials(sme.companyName)}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-28 h-28 rounded-2xl flex items-center justify-center text-3xl font-bold shadow-xl border-4 border-white/20" style={{ background: 'linear-gradient(135deg, var(--graphite-700) 0%, var(--graphite-900) 100%)', color: 'white' }}>
                  {getInitials(sme.companyName)}
                </div>
              )}
              <div className="absolute -bottom-2 -right-2 w-10 h-10 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0095F6">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </svg>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{sme.companyName || 'Unnamed Company'}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {formatSector(sme.industrySector)}
                </span>
                <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(74, 143, 135, 0.2)', color: '#5eead4' }}>
                  Certified SME
                </span>
                {sme.fundingStage && (
                  <span className="px-3 py-1.5 rounded-full text-xs font-semibold" style={{ background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc' }}>
                    {formatEnumValue(sme.fundingStage)}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{formatEmployeeCount(sme.employeeCount)} Employees</span>
                </div>
                {sme.foundingDate && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span>Founded {new Date(sme.foundingDate).getFullYear()}</span>
                  </div>
                )}
                {sme.registrationCity && sme.registrationCountry && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{sme.registrationCity}, {sme.registrationCountry}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Phase 1: Read-Only Access Badge */}
            <div className="md:self-center">
              <div
                className="w-full md:w-auto px-6 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
                style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.9)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                Read-Only Access
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 p-1 rounded-xl overflow-x-auto" style={{ background: '#f3f4f6' }}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all whitespace-nowrap ${activeTab === tab.id ? 'shadow-sm' : ''}`}
            style={activeTab === tab.id ? { background: 'white', color: '#1f2937' } : { color: '#6b7280' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} />
            </svg>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* About Section */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              About Company
            </h2>
            <p className="leading-relaxed text-base" style={{ color: '#4b5563' }}>
              {sme.companyDescription || 'No company description available. Request an introduction to learn more about this certified SME.'}
            </p>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="rounded-xl p-5 text-center" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>{formatEmployeeCount(sme.employeeCount)}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Employees</p>
            </div>

            <div className="rounded-xl p-5 text-center" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'var(--teal-50)' }}>
                <svg className="w-6 h-6" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>{sme.foundingDate ? new Date(sme.foundingDate).getFullYear() : 'N/A'}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Founded</p>
            </div>

            <div className="rounded-xl p-5 text-center" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#8b5cf6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-2xl font-bold" style={{ color: '#1f2937' }}>{sme.operatingCountries?.length || 1}</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Countries</p>
            </div>

            <div className="rounded-xl p-5 text-center" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl flex items-center justify-center" style={{ background: 'rgba(245, 158, 11, 0.1)' }}>
                <svg className="w-6 h-6" style={{ color: '#f59e0b' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              <p className="text-2xl font-bold" style={{ color: 'var(--teal-600)' }}>Verified</p>
              <p className="text-xs mt-1" style={{ color: '#6b7280' }}>Status</p>
            </div>
          </div>

          {/* Company Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sme.legalStructure && (
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f3f4f6' }}>
                  <svg className="w-5 h-5" style={{ color: '#4b5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Legal Structure</p>
                  <p className="font-semibold" style={{ color: '#1f2937' }}>{formatEnumValue(sme.legalStructure)}</p>
                </div>
              </div>
            )}

            {sme.businessModel && (
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f3f4f6' }}>
                  <svg className="w-5 h-5" style={{ color: '#4b5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Business Model</p>
                  <p className="font-semibold" style={{ color: '#1f2937' }}>{formatEnumValue(sme.businessModel)}</p>
                </div>
              </div>
            )}

            {sme.officeType && (
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f3f4f6' }}>
                  <svg className="w-5 h-5" style={{ color: '#4b5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Office Type</p>
                  <p className="font-semibold" style={{ color: '#1f2937' }}>{formatEnumValue(sme.officeType)}</p>
                </div>
              </div>
            )}

            {(sme.address || sme.headOfficeAddress) && (
              <div className="flex items-center gap-4 rounded-xl p-4" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#f3f4f6' }}>
                  <svg className="w-5 h-5" style={{ color: '#4b5563' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-xs" style={{ color: '#6b7280' }}>Address</p>
                  <p className="font-semibold" style={{ color: '#1f2937' }}>{sme.headOfficeAddress || sme.address}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Business Tab */}
      {activeTab === 'business' && (
        <div className="space-y-6">
          {/* Financial Highlights */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              Financial Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {sme.fundingStage && (
                <div className="rounded-xl p-4" style={{ background: '#f9fafb' }}>
                  <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Funding Stage</p>
                  <p className="font-bold text-lg" style={{ color: '#1f2937' }}>{formatEnumValue(sme.fundingStage)}</p>
                </div>
              )}
              {sme.revenueRange && (
                <div className="rounded-xl p-4" style={{ background: '#f9fafb' }}>
                  <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Revenue Range</p>
                  <p className="font-bold text-lg" style={{ color: '#1f2937' }}>{sme.revenueRange}</p>
                </div>
              )}
              {sme.revenueGrowth && (
                <div className="rounded-xl p-4" style={{ background: '#f9fafb' }}>
                  <p className="text-xs mb-1" style={{ color: '#6b7280' }}>Revenue Growth</p>
                  <p className="font-bold text-lg" style={{ color: 'var(--teal-600)' }}>{sme.revenueGrowth}</p>
                </div>
              )}
            </div>
            {!sme.fundingStage && !sme.revenueRange && !sme.revenueGrowth && (
              <p className="text-center py-6" style={{ color: '#9ca3af' }}>Financial information not disclosed</p>
            )}
          </div>

          {/* Operating Countries */}
          {sme.operatingCountries && sme.operatingCountries.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                Operating Countries
              </h2>
              <div className="flex flex-wrap gap-2">
                {sme.operatingCountries.map((country, index) => (
                  <span key={index} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: '#f3f4f6', color: '#374151' }}>
                    {country}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Major Clients */}
          {sme.majorClients && sme.majorClients.length > 0 && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                Major Clients
              </h2>
              <div className="flex flex-wrap gap-2">
                {sme.majorClients.map((client, index) => (
                  <span key={index} className="px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#b45309' }}>
                    {client}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Credentials Tab */}
      {activeTab === 'credentials' && (
        <div className="space-y-6">
          {/* Certifications */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                </svg>
              </div>
              Certifications
            </h2>
            {sme.existingCertifications && sme.existingCertifications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sme.existingCertifications.map((cert, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-xl p-4" style={{ background: '#f9fafb' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'var(--teal-50)' }}>
                      <svg className="w-5 h-5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#1f2937' }}>{cert.name}</p>
                      <p className="text-sm" style={{ color: '#6b7280' }}>Issued by {cert.issuedBy}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Valid until {new Date(cert.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6" style={{ color: '#9ca3af' }}>No additional certifications listed</p>
            )}
          </div>

          {/* Regulatory Licenses */}
          <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              Regulatory Licenses
            </h2>
            {sme.regulatoryLicenses && sme.regulatoryLicenses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sme.regulatoryLicenses.map((license, index) => (
                  <div key={index} className="flex items-start gap-4 rounded-xl p-4" style={{ background: '#f9fafb' }}>
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.2)' }}>
                      <svg className="w-5 h-5" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold" style={{ color: '#1f2937' }}>{license.name}</p>
                      <p className="text-sm" style={{ color: '#6b7280' }}>License #{license.licenseNumber}</p>
                      <p className="text-xs mt-1" style={{ color: '#9ca3af' }}>Valid until {new Date(license.validUntil).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6" style={{ color: '#9ca3af' }}>No regulatory licenses listed</p>
            )}
          </div>

          {/* Certification Badge */}
          <div className="rounded-2xl p-6 text-center" style={{ background: 'linear-gradient(135deg, var(--teal-50) 0%, rgba(74, 143, 135, 0.1) 100%)', border: '1px solid var(--teal-200)' }}>
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)', boxShadow: '0 10px 30px -10px rgba(74, 143, 135, 0.5)' }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold mb-2" style={{ color: '#1f2937' }}>Naiwa Verified</h3>
            <p className="text-sm mb-2" style={{ color: '#4b5563' }}>This company has been verified and certified by Naiwa</p>
            {sme.submittedDate && (
              <p className="text-xs" style={{ color: '#9ca3af' }}>Certified since {new Date(sme.submittedDate).toLocaleDateString()}</p>
            )}
          </div>
        </div>
      )}

      {/* Contact Tab */}
      {activeTab === 'contact' && (
        <div className="space-y-6">
          {/* Contact Person */}
          {sme.contactInfo && (sme.contactInfo.contactName || sme.contactInfo.contactEmail) && (
            <div className="rounded-2xl p-6" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
              <h2 className="text-lg font-bold mb-4 flex items-center gap-3" style={{ color: '#111827' }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)' }}>
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                Contact Person
              </h2>
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)', color: 'white' }}>
                  {getInitials(sme.contactInfo.contactName)}
                </div>
                <div>
                  <p className="font-bold text-lg" style={{ color: '#1f2937' }}>{sme.contactInfo.contactName || 'Contact Person'}</p>
                  {sme.contactInfo.contactPosition && (
                    <p className="text-sm" style={{ color: '#6b7280' }}>{sme.contactInfo.contactPosition}</p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Contact Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sme.contactInfo?.contactEmail && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59, 130, 246, 0.1)' }}>
                    <svg className="w-6 h-6" style={{ color: '#3b82f6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Email Address</p>
                    <p className="font-semibold" style={{ color: '#1f2937' }}>{sme.contactInfo.contactEmail}</p>
                  </div>
                </div>
              </div>
            )}

            {sme.contactInfo?.contactPhone && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, var(--teal-500) 0%, var(--teal-600) 100%)' }}>
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Phone Number</p>
                    <p className="font-semibold" style={{ color: '#1f2937' }}>{sme.contactInfo.contactPhone}</p>
                  </div>
                </div>
              </div>
            )}

            {sme.website && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139, 92, 246, 0.1)' }}>
                    <svg className="w-6 h-6" style={{ color: '#8b5cf6' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Website</p>
                    <a
                      href={sme.website.startsWith('http') ? sme.website : `https://${sme.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                      style={{ color: 'var(--teal-600)' }}
                    >
                      {sme.website}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sme.linkedinUrl && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0077b5 0%, #005582 100%)' }}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>LinkedIn</p>
                    <a
                      href={sme.linkedinUrl.startsWith('http') ? sme.linkedinUrl : `https://${sme.linkedinUrl}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold hover:underline"
                      style={{ color: '#0077b5' }}
                    >
                      View Profile
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sme.socialMedia?.twitter && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1da1f2 0%, #0c85d0 100%)' }}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Twitter / X</p>
                    <a href={sme.socialMedia.twitter.startsWith('http') ? sme.socialMedia.twitter : `https://twitter.com/${sme.socialMedia.twitter}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#1da1f2' }}>
                      {sme.socialMedia.twitter}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sme.socialMedia?.instagram && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Instagram</p>
                    <a href={sme.socialMedia.instagram.startsWith('http') ? sme.socialMedia.instagram : `https://instagram.com/${sme.socialMedia.instagram}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#e1306c' }}>
                      {sme.socialMedia.instagram}
                    </a>
                  </div>
                </div>
              </div>
            )}

            {sme.socialMedia?.facebook && (
              <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-300)' }}>
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #1877f2 0%, #0c5dc7 100%)' }}>
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: '#6b7280' }}>Facebook</p>
                    <a href={sme.socialMedia.facebook.startsWith('http') ? sme.socialMedia.facebook : `https://facebook.com/${sme.socialMedia.facebook}`} target="_blank" rel="noopener noreferrer" className="font-semibold hover:underline" style={{ color: '#1877f2' }}>
                      {sme.socialMedia.facebook}
                    </a>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* No Contact Info Message */}
          {!sme.contactInfo?.contactEmail && !sme.contactInfo?.contactPhone && !sme.website && !sme.linkedinUrl && !sme.socialMedia?.twitter && !sme.socialMedia?.instagram && !sme.socialMedia?.facebook && (
            <div className="rounded-2xl p-12 text-center" style={{ background: '#f9fafb' }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: '#e5e7eb' }}>
                <svg className="w-8 h-8" style={{ color: '#9ca3af' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: '#374151' }}>Contact Information Not Available</h3>
              <p className="text-sm" style={{ color: '#6b7280' }}>Public contact details have not been disclosed for this company.</p>
            </div>
          )}
        </div>
      )}

{/* Phase 1: Request Introduction Modal hidden (Read-Only mode) */}
    </div>
  );
}
