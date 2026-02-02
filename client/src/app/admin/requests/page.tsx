'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { AdminIntroductionRequest, PaginationData, IntroductionRequestStatus } from '@/types';

export default function AdminRequestsPage() {
  const [requests, setRequests] = useState<AdminIntroductionRequest[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getAdminIntroductionRequests({
        page: currentPage,
        limit,
        status: statusFilter || undefined,
      });

      if (result.success && result.data) {
        setRequests(result.data.requests);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch introduction requests:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, statusFilter]);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const getStatusBadge = (status: IntroductionRequestStatus) => {
    const config: Record<IntroductionRequestStatus, { bg: string; text: string; dot: string; label: string }> = {
      pending: { bg: '#fef3c7', text: '#92400e', dot: '#f59e0b', label: 'Pending' },
      viewed: { bg: '#dbeafe', text: '#1e40af', dot: '#3b82f6', label: 'Viewed' },
      responded: { bg: '#d1fae5', text: '#065f46', dot: '#10b981', label: 'Responded' },
    };
    const { bg, text, dot, label } = config[status];
    return (
      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
        style={{ backgroundColor: bg, color: text }}
      >
        <span className="w-2 h-2 rounded-full" style={{ backgroundColor: dot }} />
        {label}
      </span>
    );
  };

  const formatDate = (dateString: string) => {
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

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const { page, pages } = pagination;
    const buttons = [];

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );

    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2 text-slate-400">...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={i === page ? { background: 'var(--teal-600)', color: 'white' } : {}}
        >
          {i}
        </button>
      );
    }

    if (endPage < pages) {
      if (endPage < pages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2 text-slate-400">...</span>);
      }
      buttons.push(
        <button
          key={pages}
          onClick={() => handlePageChange(pages)}
          className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors"
        >
          {pages}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  // Loading skeleton
  if (loading && requests.length === 0) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl border border-slate-200/60 p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                <div className="space-y-2">
                  <div className="h-6 bg-slate-200 rounded w-16"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 p-5 animate-pulse">
          <div className="h-12 bg-slate-200 rounded-xl w-40"></div>
        </div>
        <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 bg-slate-200 rounded-lg"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-slate-200 rounded w-48"></div>
                  <div className="h-3 bg-slate-200 rounded w-32"></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    {
      label: 'Total Requests',
      value: pagination?.total || 0,
      accent: 'teal',
      iconBg: 'var(--teal-50)',
      iconColor: 'var(--teal-600)',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      )
    },
    {
      label: 'Pending',
      value: requests.filter(r => r.status === 'pending').length,
      accent: 'warning',
      iconBg: 'var(--warning-50)',
      iconColor: 'var(--warning-600)',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      label: 'Responded',
      value: requests.filter(r => r.status === 'responded').length,
      accent: 'success',
      iconBg: 'var(--success-50)',
      iconColor: 'var(--success-600)',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Introduction Requests</h1>
        <p className="text-slate-500 mt-1">Manage introduction requests between users and SMEs</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-xl p-6 stat-accent-${stat.accent}`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{ background: stat.iconBg, color: stat.iconColor }}
              >
                {stat.icon}
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--foreground-muted)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-200/60 p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="h-12 px-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 bg-slate-50/50 text-slate-700 font-medium min-w-[160px]"
          >
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="viewed">Viewed</option>
            <option value="responded">Responded</option>
          </select>
          <button
            onClick={fetchRequests}
            className="h-12 px-5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition-colors flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white rounded-xl border border-slate-200/60 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50/80">
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Requester</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">SME</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Message</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="text-left py-4 px-6 text-xs font-semibold text-slate-500 uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {requests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-slate-500 font-medium">No introduction requests found</p>
                      <p className="text-sm text-slate-400">Requests will appear here when users request introductions</p>
                    </div>
                  </td>
                </tr>
              ) : (
                requests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ background: 'linear-gradient(to bottom right, var(--teal-600), var(--teal-500))' }}>
                          {request.requester.fullName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">{request.requester.fullName}</p>
                          <p className="text-xs text-slate-500">{request.requester.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{request.sme.companyName || 'Unnamed'}</p>
                        <p className="text-xs text-slate-500">{formatSector(request.sme.industrySector)}</p>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-sm text-slate-600 max-w-xs truncate" title={request.message}>
                        {request.message || 'No message provided'}
                      </p>
                    </td>
                    <td className="py-4 px-6">
                      {getStatusBadge(request.status)}
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-sm text-slate-500">{formatDate(request.requestedDate)}</span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">
              Showing <span className="font-semibold text-slate-700">{((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold text-slate-700">{pagination.total}</span> requests
            </p>
            <div className="flex items-center gap-2">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
