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
  const [activeTab, setActiveTab] = useState<'overview' | 'contact'>('overview');
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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatSector = (sector: string | null | undefined) => {
    if (!sector) return 'Unknown Sector';
    return sector.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  const formatEmployeeCount = (count: string | number | null | undefined) => {
    if (!count) return 'N/A';
    return String(count);
  };

  const handleSendIntroduction = async () => {
    if (!sme) return;
    setIntroSending(true);
    setIntroError('');
    try {
      const result = await api.requestIntroduction(sme.id, introMessage);
      if (result.success) {
        setIntroSent(true);
        setTimeout(() => { setShowIntroModal(false); setIntroSent(false); }, 2000);
      } else {
        setIntroError(result.message || 'Failed to send request');
      }
    } catch (err) {
      setIntroError('Failed to send introduction request');
    } finally {
      setIntroSending(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="w-12 h-12 rounded-full animate-spin" style={{ border: '3px solid var(--graphite-200)', borderTopColor: 'var(--teal)' }} />
      </div>
    );
  }

  if (error || !sme) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center" style={{ background: 'var(--danger-100)' }}>
          <svg className="w-10 h-10" style={{ color: 'var(--danger-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--graphite-900)' }}>Company Not Found</h2>
        <p className="mb-6" style={{ color: 'var(--graphite-500)' }}>{error}</p>
        <button onClick={() => router.push('/user')} className="btn-teal px-6 py-3 rounded-xl font-semibold">
          Back to Registry
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/user')}
        className="mb-6 flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
        style={{ color: 'var(--graphite-500)' }}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Registry
      </button>

      {/* Hero Section */}
      <div className="relative rounded-2xl overflow-hidden mb-8" style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 50%, #1a1f2e 100%)' }}>
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-96 h-96 rounded-full" style={{ background: 'radial-gradient(circle, var(--teal) 0%, transparent 70%)', transform: 'translate(30%, -30%)' }} />
          <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full" style={{ background: 'radial-gradient(circle, var(--primary) 0%, transparent 70%)', transform: 'translate(-30%, 30%)' }} />
        </div>

        <div className="relative p-8">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Logo */}
            <div className="relative">
              {sme.companyLogo ? (
                <div className="w-24 h-24 rounded-2xl overflow-hidden bg-white shadow-xl">
                  <img
                    src={`${STATIC_BASE_URL}${sme.companyLogo}`}
                    alt={sme.companyName || 'Company Logo'}
                    className="w-full h-full object-contain p-3"
                    onError={(e) => {
                      const parent = e.currentTarget.parentElement;
                      if (parent) {
                        parent.innerHTML = `<div class="w-full h-full flex items-center justify-center text-2xl font-bold" style="background: linear-gradient(135deg, var(--teal) 0%, var(--primary) 100%); color: white;">${getInitials(sme.companyName)}</div>`;
                      }
                    }}
                  />
                </div>
              ) : (
                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-2xl font-bold shadow-xl" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--primary) 100%)', color: 'white' }}>
                  {getInitials(sme.companyName)}
                </div>
              )}
              {/* Verified Badge */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white shadow-lg flex items-center justify-center">
                <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#0095F6">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </svg>
              </div>
            </div>

            {/* Company Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">{sme.companyName || 'Unnamed Company'}</h1>
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.9)' }}>
                  {formatSector(sme.industrySector)}
                </span>
                <span className="px-3 py-1 rounded-full text-xs font-semibold" style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7' }}>
                  Verified SME
                </span>
              </div>
              <div className="flex flex-wrap gap-6 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
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
                {sme.address && (
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    </svg>
                    <span>{sme.address}</span>
                  </div>
                )}
              </div>
            </div>

            {/* CTA Button */}
            <div className="md:self-center">
              <button
                onClick={() => setShowIntroModal(true)}
                className="w-full md:w-auto px-8 py-4 rounded-xl font-semibold text-white transition-all transform hover:scale-105 hover:shadow-xl flex items-center justify-center gap-3"
                style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #0d9488 100%)', boxShadow: '0 10px 30px -10px rgba(13, 148, 136, 0.5)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Connect
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'overview' ? '' : 'hover:bg-gray-100'}`}
          style={activeTab === 'overview' ? { background: 'var(--graphite-800)', color: 'white' } : { color: 'var(--graphite-600)' }}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('contact')}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm transition-all ${activeTab === 'contact' ? '' : 'hover:bg-gray-100'}`}
          style={activeTab === 'contact' ? { background: 'var(--graphite-800)', color: 'white' } : { color: 'var(--graphite-600)' }}
        >
          Contact Info
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* About Card - Full Width on mobile, 2 cols on large */}
          <div className="lg:col-span-2 rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--primary) 100%)' }}>
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <h2 className="text-lg font-bold" style={{ color: 'var(--graphite-900)' }}>About Company</h2>
            </div>
            <p className="leading-relaxed" style={{ color: 'var(--graphite-600)' }}>
              {sme.companyDescription || 'No company description available. Request an introduction to learn more about this certified SME.'}
            </p>
          </div>

          {/* Quick Stats */}
          <div className="rounded-2xl p-6 transition-all hover:shadow-lg" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
            <h2 className="text-lg font-bold mb-4" style={{ color: 'var(--graphite-900)' }}>Quick Facts</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                <span className="text-sm" style={{ color: 'var(--graphite-500)' }}>Industry</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--graphite-800)' }}>{formatSector(sme.industrySector)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                <span className="text-sm" style={{ color: 'var(--graphite-500)' }}>Team Size</span>
                <span className="font-semibold text-sm" style={{ color: 'var(--graphite-800)' }}>{formatEmployeeCount(sme.employeeCount)}</span>
              </div>
              {sme.foundingDate && (
                <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'var(--graphite-50)' }}>
                  <span className="text-sm" style={{ color: 'var(--graphite-500)' }}>Founded</span>
                  <span className="font-semibold text-sm" style={{ color: 'var(--graphite-800)' }}>{new Date(sme.foundingDate).getFullYear()}</span>
                </div>
              )}
              <div className="flex items-center justify-between p-3 rounded-xl" style={{ background: 'rgba(16, 185, 129, 0.1)' }}>
                <span className="text-sm" style={{ color: 'var(--graphite-500)' }}>Status</span>
                <span className="font-semibold text-sm" style={{ color: '#059669' }}>Verified</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Contact Cards */}
          {sme.contactInfo?.contactEmail && (
            <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--graphite-500)' }}>Email Address</p>
                  <p className="font-semibold" style={{ color: 'var(--graphite-800)' }}>{sme.contactInfo.contactEmail}</p>
                </div>
              </div>
            </div>
          )}

          {sme.contactInfo?.contactPhone && (
            <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--graphite-500)' }}>Phone Number</p>
                  <p className="font-semibold" style={{ color: 'var(--graphite-800)' }}>{sme.contactInfo.contactPhone}</p>
                </div>
              </div>
            </div>
          )}

          {sme.website && (
            <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #8b5cf6 0%, #6d28d9 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--graphite-500)' }}>Website</p>
                  <a
                    href={sme.website.startsWith('http') ? sme.website : `https://${sme.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-semibold hover:underline"
                    style={{ color: '#8b5cf6' }}
                  >
                    {sme.website}
                  </a>
                </div>
              </div>
            </div>
          )}

          {sme.address && (
            <div className="rounded-2xl p-6 transition-all hover:shadow-lg hover:-translate-y-1" style={{ background: 'white', border: '1px solid var(--graphite-100)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)' }}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm mb-1" style={{ color: 'var(--graphite-500)' }}>Location</p>
                  <p className="font-semibold" style={{ color: 'var(--graphite-800)' }}>{sme.address}</p>
                </div>
              </div>
            </div>
          )}

          {!sme.contactInfo?.contactEmail && !sme.contactInfo?.contactPhone && !sme.website && !sme.address && (
            <div className="md:col-span-2 rounded-2xl p-12 text-center" style={{ background: 'var(--graphite-50)' }}>
              <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'var(--graphite-200)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2" style={{ color: 'var(--graphite-700)' }}>Contact Info Not Public</h3>
              <p className="text-sm mb-4" style={{ color: 'var(--graphite-500)' }}>Request an introduction to get in touch with this company.</p>
              <button
                onClick={() => setShowIntroModal(true)}
                className="btn-teal px-6 py-2.5 rounded-xl font-semibold"
              >
                Request Introduction
              </button>
            </div>
          )}
        </div>
      )}

      {/* Request Introduction Modal */}
      {showIntroModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
          <div className="rounded-2xl max-w-md w-full shadow-2xl overflow-hidden" style={{ background: 'white' }}>
            {/* Modal Header with gradient */}
            <div className="p-6" style={{ background: 'linear-gradient(135deg, #1a1f2e 0%, #2d3748 100%)' }}>
              <div className="flex items-center gap-4">
                {sme.companyLogo ? (
                  <div className="w-14 h-14 rounded-xl overflow-hidden bg-white">
                    <img src={`${STATIC_BASE_URL}${sme.companyLogo}`} alt="" className="w-full h-full object-contain p-2" />
                  </div>
                ) : (
                  <div className="w-14 h-14 rounded-xl flex items-center justify-center font-bold text-white" style={{ background: 'linear-gradient(135deg, var(--teal) 0%, var(--primary) 100%)' }}>
                    {getInitials(sme.companyName)}
                  </div>
                )}
                <div>
                  <h2 className="text-lg font-bold text-white">Connect with {sme.companyName}</h2>
                  <p className="text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>{formatSector(sme.industrySector)}</p>
                </div>
              </div>
            </div>

            <div className="p-6">
              {introSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)' }}>
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--graphite-900)' }}>Request Sent!</h3>
                  <p style={{ color: 'var(--graphite-500)' }}>Your introduction request has been sent successfully.</p>
                </div>
              ) : (
                <>
                  {introError && (
                    <div className="mb-4 rounded-xl p-4 flex items-center gap-3" style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}>
                      <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--danger-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--danger-600)' }}>{introError}</p>
                    </div>
                  )}
                  <div className="mb-4">
                    <label className="block text-sm font-medium mb-2" style={{ color: 'var(--graphite-700)' }}>Message (Optional)</label>
                    <textarea
                      value={introMessage}
                      onChange={(e) => setIntroMessage(e.target.value)}
                      placeholder="Introduce yourself and explain why you'd like to connect..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl resize-none transition-all outline-none"
                      style={{ background: 'var(--graphite-50)', border: '2px solid var(--graphite-100)' }}
                      onFocus={(e) => e.target.style.borderColor = 'var(--teal)'}
                      onBlur={(e) => e.target.style.borderColor = 'var(--graphite-100)'}
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowIntroModal(false)}
                      className="flex-1 py-3 rounded-xl font-semibold transition-all"
                      style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendIntroduction}
                      disabled={introSending}
                      className="flex-1 py-3 rounded-xl font-semibold text-white transition-all disabled:opacity-50"
                      style={{ background: 'linear-gradient(135deg, var(--teal) 0%, #0d9488 100%)' }}
                    >
                      {introSending ? 'Sending...' : 'Send Request'}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
