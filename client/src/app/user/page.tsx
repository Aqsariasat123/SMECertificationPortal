'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { RegistrySME, RegistrySMEDetail, PaginationData, IndustrySector } from '@/types';
import { useAuth } from '@/contexts/AuthContext';

export default function InvestorDashboardPage() {
  const { user } = useAuth();
  const [smes, setSmes] = useState<RegistrySME[]>([]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSME, setSelectedSME] = useState<RegistrySMEDetail | null>(null);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showIntroModal, setShowIntroModal] = useState(false);
  const [introMessage, setIntroMessage] = useState('');
  const [introSending, setIntroSending] = useState(false);
  const [introSent, setIntroSent] = useState(false);
  const [introError, setIntroError] = useState('');
  const [myRequestsCount, setMyRequestsCount] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [smeResult, requestsResult] = await Promise.all([
        api.getRegistrySMEs({ page: 1, limit: 6, search: searchQuery || undefined, sector: selectedSector || undefined }),
        api.getMyIntroductionRequests().catch(() => ({ success: false, data: null })),
      ]);

      if (smeResult.success && smeResult.data) {
        setSmes(smeResult.data.smes);
        setSectors(smeResult.data.sectors);
        setPagination(smeResult.data.pagination);
      }

      if (requestsResult.success && requestsResult.data) {
        setMyRequestsCount(requestsResult.data.length);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  }, [searchQuery, selectedSector]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleViewProfile = async (sme: RegistrySME) => {
    setSelectedSME(sme as RegistrySMEDetail);
    setShowProfileModal(true);
    try {
      const result = await api.getRegistrySMEDetail(sme.id);
      if (result.success && result.data) {
        setSelectedSME(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch SME detail:', error);
    }
  };

  const handleRequestIntroduction = (sme: RegistrySME) => {
    setSelectedSME(sme as RegistrySMEDetail);
    setIntroMessage('');
    setIntroSent(false);
    setIntroError('');
    setShowIntroModal(true);
  };

  const handleSendIntroduction = async () => {
    if (!selectedSME) return;
    setIntroSending(true);
    setIntroError('');
    try {
      const result = await api.requestIntroduction(selectedSME.id, introMessage);
      if (result.success) {
        setIntroSent(true);
        setTimeout(() => {
          setShowIntroModal(false);
          setIntroSent(false);
          fetchData();
        }, 2000);
      } else {
        setIntroError(result.message || 'Failed to send introduction request');
      }
    } catch (error) {
      setIntroError('An error occurred. Please try again.');
    } finally {
      setIntroSending(false);
    }
  };

  const formatSector = (sector: IndustrySector | null) => {
    if (!sector) return 'Not specified';
    return sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const formatEmployeeCount = (count: number | null) => {
    if (!count) return 'N/A';
    if (count < 10) return '1-10';
    if (count < 50) return '10-50';
    if (count < 100) return '50-100';
    return '100+';
  };

  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  if (loading && smes.length === 0) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-40 rounded-2xl bg-gradient-to-r from-violet-500/20 to-purple-500/20"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 rounded-xl bg-slate-100"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-600 p-6 text-white">
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-1/4 w-48 h-48 bg-white/5 rounded-full translate-y-1/2"></div>
        <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <p className="text-violet-200 text-sm">{greeting}</p>
            <h1 className="text-2xl font-bold mt-1">{user?.fullName || 'Welcome'}</h1>
            <p className="text-violet-200 mt-1 text-sm">Discover certified SMEs and connect with promising businesses</p>
          </div>
          <div className="flex gap-3">
            <Link href="/user/requests" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors backdrop-blur-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              My Requests
            </Link>
            <Link href="/user/messages" className="inline-flex items-center gap-2 px-4 py-2.5 bg-white text-violet-700 hover:bg-violet-50 rounded-xl text-sm font-semibold transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Messages
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{pagination?.total || 0}</p>
            <p className="text-sm text-slate-500">Certified SMEs</p>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <div>
            <p className="text-3xl font-bold text-slate-900">{sectors.length}</p>
            <p className="text-sm text-slate-500">Industry Sectors</p>
          </div>
        </div>

        <Link href="/user/requests" className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm flex items-center gap-4 hover:shadow-md hover:border-violet-200 transition-all group">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div className="flex-1">
            <p className="text-3xl font-bold text-slate-900">{myRequestsCount}</p>
            <p className="text-sm text-slate-500">My Requests</p>
          </div>
          <svg className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>

      {/* Search & Filter Section */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search companies by name, sector, or description..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 pl-12 pr-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-slate-900"
            />
          </div>
          <div className="flex gap-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="h-12 px-4 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all text-slate-700 min-w-[180px]"
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{formatSector(sector as IndustrySector)}</option>
              ))}
            </select>
            <button
              onClick={fetchData}
              className="h-12 px-5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-medium transition-colors flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search
            </button>
          </div>
        </div>
      </div>

      {/* SME Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Discover Certified SMEs</h2>
          <p className="text-sm text-slate-500">{pagination?.total || 0} companies available</p>
        </div>

        {smes.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-slate-900">No SMEs found</h3>
            <p className="text-slate-500 mt-1">Try adjusting your search or filter criteria</p>
            {(searchQuery || selectedSector) && (
              <button
                onClick={() => { setSearchQuery(''); setSelectedSector(''); }}
                className="mt-4 px-4 py-2 text-sm font-medium text-violet-600 hover:bg-violet-50 rounded-lg transition-colors"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {smes.map((sme) => (
              <div key={sme.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-lg hover:border-violet-200 transition-all group">
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {sme.companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${sme.companyLogo}`}
                        alt={sme.companyName || 'Company'}
                        className="w-14 h-14 rounded-xl object-contain bg-slate-50 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center text-white text-lg font-semibold flex-shrink-0">
                        {getInitials(sme.companyName)}
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-slate-900 truncate">{sme.companyName || 'Unnamed'}</h3>
                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="#0095F6">
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      </div>
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-100 text-violet-700 mt-2">
                        {formatSector(sme.industrySector)}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-slate-600 mt-4 line-clamp-2">
                    {sme.companyDescription || 'No description available'}
                  </p>
                  <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {formatEmployeeCount(sme.employeeCount)}
                    </span>
                    {sme.website && (
                      <span className="flex items-center gap-1.5">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Website
                      </span>
                    )}
                  </div>
                </div>
                <div className="px-5 py-4 bg-slate-50 border-t border-slate-100 flex gap-3">
                  <button
                    onClick={() => handleViewProfile(sme)}
                    className="flex-1 h-10 px-4 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    View Profile
                  </button>
                  <button
                    onClick={() => handleRequestIntroduction(sme)}
                    className="flex-1 h-10 px-4 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition-colors"
                  >
                    Connect
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center mt-6">
            <Link
              href="/user/dashboard"
              className="px-6 py-3 text-sm font-medium text-violet-600 bg-violet-50 hover:bg-violet-100 rounded-xl transition-colors"
            >
              View All {pagination.total} Companies →
            </Link>
          </div>
        )}
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Link href="/user/profile" className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:from-violet-100 group-hover:to-purple-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">My Profile</h3>
              <p className="text-sm text-slate-500">Manage your account settings</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link href="/user/support" className="group bg-white rounded-xl border border-slate-200 p-5 hover:shadow-md hover:border-violet-200 transition-all">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center group-hover:from-violet-100 group-hover:to-purple-100 transition-colors">
              <svg className="w-6 h-6 text-slate-600 group-hover:text-violet-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900">Get Support</h3>
              <p className="text-sm text-slate-500">Contact our support team</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* View Profile Modal */}
      {showProfileModal && selectedSME && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="bg-gradient-to-r from-violet-600 to-purple-600 p-5">
              <div className="flex items-center gap-4">
                {selectedSME.companyLogo ? (
                  <img
                    src={`${API_BASE_URL}${selectedSME.companyLogo}`}
                    alt={selectedSME.companyName || 'Company'}
                    className="w-16 h-16 rounded-xl object-contain bg-white/10 flex-shrink-0"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center text-white text-xl font-semibold">
                    {getInitials(selectedSME.companyName)}
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-bold text-white">{selectedSME.companyName}</h2>
                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#fff">
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                    </svg>
                  </div>
                  <p className="text-violet-200 text-sm mt-1">{formatSector(selectedSME.industrySector)}</p>
                </div>
                <button onClick={() => setShowProfileModal(false)} className="p-2 hover:bg-white/10 rounded-lg transition-colors">
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
            <div className="p-5 max-h-[50vh] overflow-y-auto space-y-5">
              <div>
                <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">About</h3>
                <p className="text-sm text-slate-700">{selectedSME.companyDescription || 'No description available'}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Employees</h3>
                  <p className="text-sm font-medium text-slate-900">{formatEmployeeCount(selectedSME.employeeCount)}</p>
                </div>
                {selectedSME.foundingDate && (
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Founded</h3>
                    <p className="text-sm font-medium text-slate-900">{new Date(selectedSME.foundingDate).getFullYear()}</p>
                  </div>
                )}
              </div>
              {(selectedSME.website || selectedSME.contactInfo) && (
                <div>
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">Contact</h3>
                  <div className="space-y-2">
                    {selectedSME.contactInfo?.contactEmail && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        {selectedSME.contactInfo.contactEmail}
                      </p>
                    )}
                    {selectedSME.website && (
                      <p className="text-sm text-slate-600 flex items-center gap-2">
                        <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        {selectedSME.website}
                      </p>
                    )}
                  </div>
                </div>
              )}
            </div>
            <div className="p-5 border-t border-slate-100 flex gap-3">
              <button
                onClick={() => setShowProfileModal(false)}
                className="flex-1 h-11 px-4 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
              >
                Close
              </button>
              <button
                onClick={() => { setShowProfileModal(false); handleRequestIntroduction(selectedSME); }}
                className="flex-1 h-11 px-4 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors"
              >
                Request Introduction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Introduction Request Modal */}
      {showIntroModal && selectedSME && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl">
            <div className="p-5 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">Request Introduction</h2>
              <p className="text-sm text-slate-500 mt-1">Connect with {selectedSME.companyName}</p>
            </div>
            <div className="p-5">
              {introSent ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-slate-900">Request Sent!</h3>
                  <p className="text-sm text-slate-500 mt-1">Your introduction request has been sent successfully.</p>
                </div>
              ) : (
                <>
                  {introError && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-xl">
                      <p className="text-sm text-red-600">{introError}</p>
                    </div>
                  )}
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl mb-4">
                    {selectedSME.companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${selectedSME.companyLogo}`}
                        alt={selectedSME.companyName || 'Company'}
                        className="w-12 h-12 rounded-lg object-contain bg-white"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-slate-700 flex items-center justify-center text-white font-semibold">
                        {getInitials(selectedSME.companyName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-slate-900">{selectedSME.companyName}</p>
                      <p className="text-xs text-slate-500">{formatSector(selectedSME.industrySector)}</p>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-slate-700 mb-2 block">Message (Optional)</label>
                    <textarea
                      value={introMessage}
                      onChange={(e) => setIntroMessage(e.target.value)}
                      rows={4}
                      placeholder="Introduce yourself and explain why you'd like to connect..."
                      className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20 transition-all resize-none text-slate-900"
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setShowIntroModal(false)}
                      disabled={introSending}
                      className="flex-1 h-11 px-4 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendIntroduction}
                      disabled={introSending}
                      className="flex-1 h-11 px-4 text-sm font-medium text-white bg-violet-600 rounded-xl hover:bg-violet-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {introSending ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Sending...
                        </>
                      ) : (
                        'Send Request'
                      )}
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
