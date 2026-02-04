'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { RegistrySME, RegistrySMEDetail, PaginationData, IndustrySector } from '@/types';

export default function UserDashboardPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSector, setSelectedSector] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
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
  const [profileLoading, setProfileLoading] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');

  const itemsPerPage = 6;

  const fetchSMEs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getRegistrySMEs({
        page: currentPage,
        limit: itemsPerPage,
        search: searchQuery || undefined,
        sector: selectedSector || undefined,
      });

      if (result.success && result.data) {
        setSmes(result.data.smes);
        setSectors(result.data.sectors);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch SMEs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchQuery, selectedSector]);

  useEffect(() => {
    fetchSMEs();
  }, [fetchSMEs]);

  // Reset to page 1 when search or filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedSector]);

  const stats = [
    { label: 'Certified SMEs', value: pagination?.total.toString() || '0', icon: 'shield', accent: 'stat-accent-teal', iconBg: 'var(--teal-50)', iconColor: 'var(--teal-600)' },
    { label: 'Industry Sectors', value: sectors.length.toString(), icon: 'building', accent: 'stat-accent-warning', iconBg: 'var(--warning-50)', iconColor: 'var(--warning-600)' },
    { label: 'Current Page', value: `${currentPage} of ${pagination?.pages || 1}`, icon: 'page', accent: 'stat-accent-success', iconBg: 'var(--success-50)', iconColor: 'var(--success-600)' },
  ];

  const handleViewProfile = (sme: RegistrySME) => {
    router.push(`/user/registry/${sme.id}`);
  };

  const handleRequestIntroduction = (sme: RegistrySME) => {
    setSelectedSME(sme as RegistrySMEDetail);
    setIntroMessage('');
    setIntroSent(false);
    setIntroError('');
    setShowIntroModal(true);
  };

  const [alreadyConnected, setAlreadyConnected] = useState(false);
  const [existingConversationId, setExistingConversationId] = useState<string | null>(null);

  const handleSendIntroduction = async () => {
    if (!selectedSME) return;

    setIntroSending(true);
    setIntroError('');
    setAlreadyConnected(false);
    setExistingConversationId(null);

    try {
      const result = await api.requestIntroduction(selectedSME.id, introMessage);

      if (result.success) {
        const data = result.data as { id: string; existing?: boolean } | undefined;

        // If already connected, redirect to messages
        if (data?.existing && data?.id) {
          setAlreadyConnected(true);
          setExistingConversationId(data.id);

          // If user typed a message, send it to existing conversation
          if (introMessage.trim()) {
            try {
              await api.sendChatMessage(data.id, introMessage.trim());
            } catch (e) {
              // Silent fail - user can still go to messages
            }
          }
        } else {
          // New request created
          setIntroSent(true);
          setTimeout(() => {
            setShowIntroModal(false);
            setIntroSent(false);
            setIntroMessage('');
          }, 2000);
        }
      } else {
        setIntroError(result.message || 'Failed to send introduction request');
      }
    } catch (error) {
      setIntroError('An error occurred. Please try again.');
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

  const handlePageChange = (page: number) => {
    if (pagination && page >= 1 && page <= pagination.pages) {
      setCurrentPage(page);
    }
  };

  const getStatIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      shield: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      building: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      page: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
    };
    return icons[icon];
  };

  const formatSector = (sector: IndustrySector | null) => {
    if (!sector) return 'Not specified';
    return sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

  const formatEmployeeCount = (count: number | null) => {
    if (!count) return 'N/A';
    if (count < 10) return '1-10';
    if (count < 50) return '10-50';
    if (count < 100) return '50-100';
    if (count < 200) return '100-200';
    if (count < 500) return '200-500';
    return '500+';
  };

  // Loading skeleton
  if (loading && smes.length === 0) {
    return (
      <div className="space-y-5">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="solid-card rounded-lg p-4 animate-pulse">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded" style={{ background: 'var(--graphite-200)' }}></div>
                <div className="space-y-2 flex-1">
                  <div className="h-5 rounded w-16" style={{ background: 'var(--graphite-200)' }}></div>
                  <div className="h-3 rounded w-24" style={{ background: 'var(--graphite-100)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Search skeleton */}
        <div className="solid-card rounded-lg p-4 animate-pulse">
          <div className="flex gap-3">
            <div className="flex-1 h-10 rounded" style={{ background: 'var(--graphite-200)' }}></div>
            <div className="w-36 h-10 rounded" style={{ background: 'var(--graphite-200)' }}></div>
          </div>
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="solid-card rounded-lg p-4 animate-pulse">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded" style={{ background: 'var(--graphite-200)' }}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-3/4" style={{ background: 'var(--graphite-200)' }}></div>
                  <div className="h-3 rounded w-1/4" style={{ background: 'var(--graphite-100)' }}></div>
                  <div className="h-3 rounded w-full" style={{ background: 'var(--graphite-100)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Stats - Match Admin Users Style */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl p-6 ${stat.accent}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                {getStatIcon(stat.icon)}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--graphite-500)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="solid-card rounded-lg p-4">
        <div className="flex flex-col gap-3">
          <div className="flex-1">
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg
                  className="w-4 h-4"
                  style={{ color: 'var(--graphite-400)' }}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search certified SMEs..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-[42px] rounded-md text-[0.9375rem]"
                style={{
                  paddingLeft: '2.5rem',
                  paddingRight: '0.875rem',
                  border: '1px solid var(--graphite-200)',
                  background: 'white',
                  color: 'var(--graphite-800)',
                }}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={selectedSector}
              onChange={(e) => setSelectedSector(e.target.value)}
              className="input-field w-full sm:min-w-[180px]"
              style={{ paddingRight: '1rem' }}
            >
              <option value="">All Sectors</option>
              {sectors.map((sector) => (
                <option key={sector} value={sector}>{formatSector(sector as IndustrySector)}</option>
              ))}
            </select>
            {/* View Toggle */}
            <div className="flex items-center rounded-md overflow-hidden" style={{ border: '1px solid var(--graphite-200)' }}>
              <button
                onClick={() => setViewMode('grid')}
                className="h-10 w-10 flex items-center justify-center transition-colors"
                style={{
                  background: viewMode === 'grid' ? 'var(--teal-600)' : 'white',
                  color: viewMode === 'grid' ? 'white' : 'var(--graphite-600)'
                }}
                title="Grid View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </button>
              <div style={{ width: '1px', height: '24px', background: 'var(--graphite-200)' }} />
              <button
                onClick={() => setViewMode('list')}
                className="h-10 w-10 flex items-center justify-center transition-colors"
                style={{
                  background: viewMode === 'list' ? 'var(--teal-600)' : 'white',
                  color: viewMode === 'list' ? 'white' : 'var(--graphite-600)'
                }}
                title="List View"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
              </button>
            </div>
            <button
              onClick={fetchSMEs}
              className="btn-secondary h-10 px-4 rounded flex items-center justify-center gap-2 text-sm w-full sm:w-auto"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* SME Cards */}
      {smes.length === 0 ? (
        <div className="empty-state solid-card rounded-lg">
          <div className="empty-state-icon mx-auto">
            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-base" style={{ color: 'var(--graphite-900)' }}>No certified SMEs found</h3>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
            {searchQuery || selectedSector
              ? 'Try adjusting your search or filter criteria'
              : 'There are no certified SMEs in the registry yet'}
          </p>
          {(searchQuery || selectedSector) && (
            <button
              onClick={() => { setSearchQuery(''); setSelectedSector(''); }}
              className="mt-4 px-4 py-2 text-sm font-medium rounded transition-colors"
              style={{ color: 'var(--teal-600)' }}
            >
              Clear filters
            </button>
          )}
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {smes.map((sme) => (
            <div
              key={sme.id}
              className="solid-card rounded-lg p-4 card-hover"
            >
              <div className="flex items-start gap-3">
                {sme.companyLogo ? (
                  <img
                    src={`${API_BASE_URL}${sme.companyLogo}`}
                    alt={sme.companyName || 'Company Logo'}
                    className="w-12 h-12 rounded object-contain flex-shrink-0"
                    style={{ background: 'var(--graphite-50)' }}
                  />
                ) : (
                  <div
                    className="w-12 h-12 rounded flex items-center justify-center text-white text-base font-semibold flex-shrink-0"
                    style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}
                  >
                    {getInitials(sme.companyName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-semibold text-sm" style={{ color: 'var(--graphite-900)' }}>
                      {sme.companyName || 'Unnamed Company'}
                    </h3>
                    <svg
                      className="w-6 h-6 flex-shrink-0"
                      viewBox="0 0 24 24"
                      fill="#0095F6"
                      aria-label="Certified SME"
                    >
                      <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                    </svg>
                  </div>
                  <span className="badge badge-teal mt-1.5 inline-flex">
                    {formatSector(sme.industrySector)}
                  </span>
                  <p className="text-xs mt-2 leading-relaxed line-clamp-2" style={{ color: 'var(--graphite-600)' }}>
                    {sme.companyDescription || 'No description available'}
                  </p>
                  <div className="flex items-center gap-3 mt-3 text-xs flex-wrap" style={{ color: 'var(--foreground-muted)' }}>
                    <span className="flex items-center gap-1">
                      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {formatEmployeeCount(sme.employeeCount)}
                    </span>
                    {sme.website && (
                      <span className="flex items-center gap-1">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Website
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div
                className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 mt-4 pt-4"
                style={{ borderTop: '1px solid var(--graphite-100)' }}
              >
                <button
                  onClick={() => handleViewProfile(sme)}
                  className="btn-primary flex-1 h-9 text-xs font-medium rounded"
                >
                  View Profile
                </button>
                {/* Phase 1: Request Introduction hidden
                <button
                  onClick={() => handleRequestIntroduction(sme)}
                  className="btn-primary flex-1 h-9 text-xs font-medium rounded"
                >
                  Request Introduction
                </button>
                */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="solid-card rounded-lg overflow-hidden">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th className="hidden md:table-cell" style={{ paddingRight: '3rem' }}>Sector</th>
                <th className="hidden lg:table-cell" style={{ paddingRight: '3rem' }}>Employees</th>
                <th style={{ textAlign: 'left', width: '120px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {smes.map((sme) => (
                <tr key={sme.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {sme.companyLogo ? (
                        <img
                          src={`${API_BASE_URL}${sme.companyLogo}`}
                          alt={sme.companyName || 'Company Logo'}
                          className="w-9 h-9 rounded object-contain flex-shrink-0"
                          style={{ background: 'var(--graphite-50)' }}
                        />
                      ) : (
                        <div
                          className="w-9 h-9 rounded flex items-center justify-center text-white text-xs font-semibold flex-shrink-0"
                          style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}
                        >
                          {getInitials(sme.companyName)}
                        </div>
                      )}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5">
                          <p className="font-medium text-sm truncate" style={{ color: 'var(--graphite-900)' }}>
                            {sme.companyName || 'Unnamed'}
                          </p>
                          <svg
                            className="w-5 h-5 flex-shrink-0"
                            viewBox="0 0 24 24"
                            fill="#0095F6"
                            aria-label="Certified SME"
                          >
                            <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                          </svg>
                        </div>
                        <p className="text-xs truncate max-w-[180px] md:hidden" style={{ color: 'var(--foreground-muted)' }}>
                          {formatSector(sme.industrySector)}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="hidden md:table-cell" style={{ paddingRight: '3rem' }}>
                    <span className="badge badge-teal">
                      {formatSector(sme.industrySector)}
                    </span>
                  </td>
                  <td className="hidden lg:table-cell" style={{ paddingRight: '3rem' }}>
                    <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                      {formatEmployeeCount(sme.employeeCount)}
                    </span>
                  </td>
                  <td style={{ textAlign: 'left', width: '120px' }}>
                    <button
                      onClick={() => handleViewProfile(sme)}
                      className="btn-primary px-3 py-1.5 text-xs font-medium rounded"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.total > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs order-2 sm:order-1" style={{ color: 'var(--foreground-muted)' }}>
            Showing <span className="font-medium" style={{ color: 'var(--graphite-700)' }}>
              {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
            </span> of <span className="font-medium" style={{ color: 'var(--graphite-700)' }}>{pagination.total}</span> results
          </p>
          <div className="flex items-center gap-1.5 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="btn-secondary px-3 py-1.5 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {Array.from({ length: Math.min(pagination.pages, 5) }, (_, i) => {
              let pageNum;
              if (pagination.pages <= 5) {
                pageNum = i + 1;
              } else if (currentPage <= 3) {
                pageNum = i + 1;
              } else if (currentPage >= pagination.pages - 2) {
                pageNum = pagination.pages - 4 + i;
              } else {
                pageNum = currentPage - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  onClick={() => handlePageChange(pageNum)}
                  className="px-3 py-1.5 text-xs font-medium rounded min-w-[32px] transition-colors"
                  style={{
                    background: currentPage === pageNum ? 'var(--teal-600)' : 'transparent',
                    color: currentPage === pageNum ? 'white' : 'var(--graphite-600)'
                  }}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === pagination.pages}
              className="btn-secondary px-3 py-1.5 text-sm rounded disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* View Profile Modal */}
      {showProfileModal && selectedSME && (
        <div className="modal-backdrop fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="rounded-lg max-w-lg w-full max-h-[90vh] overflow-hidden" style={{ backgroundColor: '#363c45', boxShadow: '0 20px 40px -12px rgba(0, 0, 0, 0.25)' }}>
            <div className="p-5">
                  <div className="flex items-center gap-4">
                    {selectedSME.companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${selectedSME.companyLogo}`}
                        alt={selectedSME.companyName || 'Company Logo'}
                        className="w-14 h-14 rounded object-contain flex-shrink-0"
                        style={{ background: 'rgba(255,255,255,0.1)' }}
                      />
                    ) : (
                      <div
                        className="w-14 h-14 rounded flex items-center justify-center text-white text-xl font-semibold"
                        style={{ backgroundColor: '#545d6a' }}
                      >
                        {getInitials(selectedSME.companyName)}
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-lg font-semibold text-white">{selectedSME.companyName || 'Unnamed Company'}</h2>
                        <svg
                          className="w-7 h-7"
                          viewBox="0 0 24 24"
                          fill="#0095F6"
                          aria-label="Certified SME"
                        >
                          <path d="M22.5 12.5c0-1.58-.875-2.95-2.148-3.6.154-.435.238-.905.238-1.4 0-2.21-1.71-3.998-3.818-3.998-.47 0-.92.084-1.336.25C14.818 2.415 13.51 1.5 12 1.5s-2.816.917-3.437 2.25c-.415-.165-.866-.25-1.336-.25-2.11 0-3.818 1.79-3.818 4 0 .494.083.964.237 1.4-1.272.65-2.147 2.018-2.147 3.6 0 1.495.782 2.798 1.942 3.486-.02.17-.032.34-.032.514 0 2.21 1.708 4 3.818 4 .47 0 .92-.086 1.335-.25.62 1.334 1.926 2.25 3.437 2.25 1.512 0 2.818-.916 3.437-2.25.415.163.865.248 1.336.248 2.11 0 3.818-1.79 3.818-4 0-.174-.012-.344-.033-.513 1.158-.687 1.943-1.99 1.943-3.484zm-6.616-3.334l-4.334 6.5c-.145.217-.382.334-.625.334-.143 0-.288-.04-.416-.126l-.115-.094-2.415-2.415c-.293-.293-.293-.768 0-1.06s.768-.294 1.06 0l1.77 1.767 3.825-5.74c.23-.345.696-.436 1.04-.207.346.23.44.696.21 1.04z" />
                        </svg>
                      </div>
                      <p className="text-sm mt-0.5" style={{ color: 'var(--graphite-400)' }}>
                        {formatSector(selectedSME.industrySector)}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-5 space-y-4 bg-white max-h-[60vh] overflow-y-auto">
                  <div>
                    <h3 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--foreground-muted)' }}>
                      About
                    </h3>
                    <p className="text-sm" style={{ color: 'var(--graphite-700)' }}>
                      {selectedSME.companyDescription || 'No description available'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--foreground-muted)' }}>
                        Employees
                      </h3>
                      <p className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>
                        {formatEmployeeCount(selectedSME.employeeCount)}
                      </p>
                    </div>
                    {selectedSME.foundingDate && (
                      <div>
                        <h3 className="text-xs font-semibold uppercase tracking-wider mb-1.5" style={{ color: 'var(--foreground-muted)' }}>
                          Founded
                        </h3>
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>
                          {new Date(selectedSME.foundingDate).getFullYear()}
                        </p>
                      </div>
                    )}
                  </div>
                  {(selectedSME.website || selectedSME.address || selectedSME.contactInfo) && (
                    <div className="space-y-2">
                      <h3 className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--foreground-muted)' }}>
                        Contact
                      </h3>
                      <div className="space-y-1.5">
                        {selectedSME.contactInfo?.contactEmail && (
                          <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            {selectedSME.contactInfo.contactEmail}
                          </p>
                        )}
                        {selectedSME.contactInfo?.contactPhone && (
                          <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            {selectedSME.contactInfo.contactPhone}
                          </p>
                        )}
                        {selectedSME.website && (
                          <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                            </svg>
                            {selectedSME.website}
                          </p>
                        )}
                        {selectedSME.address && (
                          <p className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {selectedSME.address}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-3 pt-4" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                    <button
                      onClick={() => setShowProfileModal(false)}
                      className="btn-secondary flex-1 h-10 text-sm font-medium rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={() => { setShowProfileModal(false); handleRequestIntroduction(selectedSME); }}
                      className="btn-primary flex-1 h-10 text-sm font-medium rounded"
                    >
                      Request Introduction
                    </button>
                  </div>
                </div>
          </div>
        </div>
      )}

      {/* Request Introduction Modal */}
      {showIntroModal && selectedSME && (
        <div className="modal-backdrop fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="modal-glass rounded-lg max-w-md w-full">
            <div className="p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
              <h2 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Request Introduction</h2>
              <p className="text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                Send a request to connect with {selectedSME.companyName}
              </p>
            </div>
            <div className="p-5">
              {alreadyConnected ? (
                <div className="text-center py-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' }}
                  >
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Already Connected!</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                    You already have a conversation with this company.
                  </p>
                  {introMessage.trim() && (
                    <p className="text-sm mt-2" style={{ color: '#10b981' }}>
                      <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Your message has been sent!
                    </p>
                  )}
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => {
                        setShowIntroModal(false);
                        setAlreadyConnected(false);
                        setExistingConversationId(null);
                        setIntroMessage('');
                      }}
                      className="btn-secondary flex-1 h-10 text-sm font-medium rounded"
                    >
                      Close
                    </button>
                    <button
                      onClick={handleGoToMessages}
                      className="flex-1 h-10 text-sm font-medium rounded text-white flex items-center justify-center gap-2"
                      style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      Go to Messages
                    </button>
                  </div>
                </div>
              ) : introSent ? (
                <div className="text-center py-6">
                  <div
                    className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3"
                    style={{ background: 'var(--success-100)' }}
                  >
                    <svg className="w-7 h-7" style={{ color: 'var(--success-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <h3 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Request Sent!</h3>
                  <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>
                    Your introduction request has been sent successfully.
                  </p>
                </div>
              ) : (
                <>
                  {introError && (
                    <div
                      className="mb-4 rounded p-3 flex items-center gap-2"
                      style={{ background: 'var(--danger-50)', border: '1px solid var(--danger-100)' }}
                    >
                      <svg className="w-4 h-4 flex-shrink-0" style={{ color: 'var(--danger-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-sm" style={{ color: 'var(--danger-600)' }}>{introError}</p>
                    </div>
                  )}
                  <div
                    className="flex items-center gap-3 p-3 rounded mb-4"
                    style={{ background: 'var(--graphite-50)' }}
                  >
                    {selectedSME.companyLogo ? (
                      <img
                        src={`${API_BASE_URL}${selectedSME.companyLogo}`}
                        alt={selectedSME.companyName || 'Company Logo'}
                        className="w-10 h-10 rounded object-contain flex-shrink-0"
                        style={{ background: 'white' }}
                      />
                    ) : (
                      <div
                        className="w-10 h-10 rounded flex items-center justify-center text-white text-sm font-semibold"
                        style={{ background: 'var(--graphite-700)' }}
                      >
                        {getInitials(selectedSME.companyName)}
                      </div>
                    )}
                    <div>
                      <p className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>
                        {selectedSME.companyName || 'Unnamed Company'}
                      </p>
                      <p className="text-xs" style={{ color: 'var(--foreground-muted)' }}>
                        {formatSector(selectedSME.industrySector)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <label className="input-label block">Message (Optional)</label>
                    <textarea
                      value={introMessage}
                      onChange={(e) => setIntroMessage(e.target.value)}
                      rows={4}
                      placeholder="Introduce yourself and explain why you'd like to connect..."
                      className="input-field w-full resize-none"
                      style={{ height: 'auto', padding: '0.75rem' }}
                    />
                  </div>
                  <div className="flex gap-3 mt-5">
                    <button
                      onClick={() => setShowIntroModal(false)}
                      disabled={introSending}
                      className="btn-secondary flex-1 h-10 text-sm font-medium rounded disabled:opacity-50"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSendIntroduction}
                      disabled={introSending}
                      className="btn-primary flex-1 h-10 text-sm font-medium rounded disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {introSending ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
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
