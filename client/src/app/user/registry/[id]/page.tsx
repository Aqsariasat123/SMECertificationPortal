'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';
import { RegistrySMEDetail } from '@/types';

export default function SMEDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [sme, setSme] = useState<RegistrySMEDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
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

    if (params.id) {
      fetchSME();
    }
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
    if (!count) return 'Not specified';
    const countStr = String(count);
    const mapping: Record<string, string> = {
      '1-10': '1-10 employees',
      '10-50': '10-50 employees',
      '11-50': '11-50 employees',
      '50-200': '50-200 employees',
      '51-200': '51-200 employees',
      '100-200': '100-200 employees',
      '201-500': '201-500 employees',
      '500+': '500+ employees',
    };
    return mapping[countStr] || countStr + ' employees';
  };

  const handleSendIntroduction = async () => {
    if (!sme) return;

    setIntroSending(true);
    setIntroError('');

    try {
      const result = await api.requestIntroduction(sme.id, introMessage);

      if (result.success) {
        setIntroSent(true);
        setTimeout(() => {
          setShowIntroModal(false);
          setIntroSent(false);
        }, 2000);
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
        <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#7C3AED' }} />
      </div>
    );
  }

  if (error || !sme) {
    return (
      <div className="max-w-4xl mx-auto pb-8">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
          <h2 className="text-xl font-semibold text-red-800 mb-2">Company Not Found</h2>
          <p className="text-red-600 mb-4">{error || 'The company you are looking for does not exist.'}</p>
          <button
            onClick={() => router.push('/user')}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Back to Registry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto pb-8">
      {/* Back Button */}
      <button
        onClick={() => router.push('/user')}
        className="mb-6 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Registry
      </button>

      {/* Header Card */}
      <div className="rounded-2xl overflow-hidden shadow-lg mb-6" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)' }}>
        <div className="p-8">
          <div className="flex items-start gap-6">
            {sme.companyLogo ? (
              <img
                src={`${API_BASE_URL}${sme.companyLogo}`}
                alt={sme.companyName || 'Company Logo'}
                className="w-20 h-20 rounded-2xl object-contain flex-shrink-0 bg-white p-2"
              />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold bg-slate-600">
                {getInitials(sme.companyName)}
              </div>
            )}
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{sme.companyName || 'Unnamed Company'}</h1>
                <svg className="w-7 h-7" viewBox="0 0 24 24" fill="#0095F6">
                  <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                </svg>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300">
                  Certified SME
                </span>
              </div>
              <p className="text-slate-300 mb-4">{formatSector(sme.industrySector)}</p>
              <button
                onClick={() => setShowIntroModal(true)}
                className="px-6 py-2.5 bg-white text-slate-900 rounded-lg font-semibold hover:bg-gray-100 transition-colors flex items-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Request Introduction
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* About Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">About</h2>
        <p className="text-gray-700 leading-relaxed">
          {sme.companyDescription || 'No description available for this company.'}
        </p>
      </div>

      {/* Company Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Basic Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Company Details</h2>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Industry Sector</p>
                <p className="font-medium text-gray-900">{formatSector(sme.industrySector)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-gray-500">Company Size</p>
                <p className="font-medium text-gray-900">{formatEmployeeCount(sme.employeeCount)}</p>
              </div>
            </div>
            {sme.foundingDate && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Founded</p>
                  <p className="font-medium text-gray-900">{new Date(sme.foundingDate).getFullYear()}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-4">Contact Information</h2>
          <div className="space-y-4">
            {sme.contactInfo?.contactEmail && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="font-medium text-gray-900">{sme.contactInfo.contactEmail}</p>
                </div>
              </div>
            )}
            {sme.contactInfo?.contactPhone && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="font-medium text-gray-900">{sme.contactInfo.contactPhone}</p>
                </div>
              </div>
            )}
            {sme.website && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-violet-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Website</p>
                  <a href={sme.website.startsWith('http') ? sme.website : `https://${sme.website}`} target="_blank" rel="noopener noreferrer" className="font-medium text-violet-600 hover:underline">
                    {sme.website}
                  </a>
                </div>
              </div>
            )}
            {sme.address && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p className="font-medium text-gray-900">{sme.address}</p>
                </div>
              </div>
            )}
            {!sme.contactInfo?.contactEmail && !sme.contactInfo?.contactPhone && !sme.website && !sme.address && (
              <p className="text-gray-500 text-sm">No contact information available.</p>
            )}
          </div>
        </div>
      </div>

      {/* Request Introduction Modal */}
      {showIntroModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-2xl max-w-md w-full shadow-xl">
            <div className="p-6 border-b border-gray-100">
              <h2 className="text-lg font-semibold text-gray-900">Request Introduction</h2>
              <p className="text-sm text-gray-500 mt-1">
                Send a request to connect with {sme.companyName}
              </p>
            </div>
            <div className="p-6">
              {introSent ? (
                <div className="text-center py-6">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold text-gray-900">Request Sent!</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Your introduction request has been sent successfully.
                  </p>
                </div>
              ) : (
                <>
                  {introError && (
                    <div className="mb-4 rounded-lg p-3 bg-red-50 border border-red-200 flex items-center gap-2">
                      <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm text-red-600">{introError}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 mb-4">
                    {sme.companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${sme.companyLogo}`}
                        alt={sme.companyName || 'Company Logo'}
                        className="w-12 h-12 rounded-lg object-contain bg-white p-1"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold bg-gray-600">
                        {getInitials(sme.companyName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-gray-900">{sme.companyName}</p>
                      <p className="text-sm text-gray-500">{formatSector(sme.industrySector)}</p>
                    </div>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                    <textarea
                      value={introMessage}
                      onChange={(e) => setIntroMessage(e.target.value)}
                      placeholder="Tell them why you'd like to connect..."
                      rows={4}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 outline-none transition-all resize-none"
                    />
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowIntroModal(false)}
                      className="flex-1 py-3 border border-gray-200 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendIntroduction}
                      disabled={introSending}
                      className="flex-1 py-3 bg-violet-600 text-white rounded-lg font-medium hover:bg-violet-700 transition-colors disabled:opacity-50"
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
