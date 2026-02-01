'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { AuditLogEntry, PaginationData, UserRole } from '@/types';

export default function AdminAuditLogsPage() {
  const [logs, setLogs] = useState<AuditLogEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [exporting, setExporting] = useState(false);
  const limit = 10;

  const handleExport = async () => {
    setExporting(true);
    try {
      await api.exportAuditLogs({
        actionType: actionFilter || undefined,
      });
    } catch (error) {
      console.error('Failed to export audit logs:', error);
    } finally {
      setExporting(false);
    }
  };

  const fetchAuditLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getAuditLogs({
        page: currentPage,
        limit,
        actionType: actionFilter || undefined,
      });

      if (result.success && result.data) {
        setLogs(result.data.logs);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch audit logs:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, actionFilter]);

  useEffect(() => {
    fetchAuditLogs();
  }, [fetchAuditLogs]);

  // Filter logs client-side by search term
  const filteredLogs = logs.filter((log) => {
    if (!searchTerm) return true;
    const searchLower = searchTerm.toLowerCase();
    return (
      log.user.email.toLowerCase().includes(searchLower) ||
      log.user.fullName.toLowerCase().includes(searchLower) ||
      log.actionType.toLowerCase().includes(searchLower) ||
      log.actionDescription.toLowerCase().includes(searchLower)
    );
  });

  const getActionConfig = (action: string) => {
    const config: Record<string, { style: React.CSSProperties; icon: React.ReactNode }> = {
      USER_LOGIN: {
        style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-700)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
      },
      USER_LOGOUT: {
        style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-700)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
      },
      USER_REGISTERED: {
        style: { backgroundColor: 'var(--teal-50)', color: 'var(--teal-700)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
      },
      PROFILE_UPDATED: {
        style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      },
      SME_PROFILE_UPDATED: {
        style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      },
      DOCUMENT_UPLOADED: {
        style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" /></svg>
      },
      CERTIFICATION_SUBMITTED: {
        style: { backgroundColor: 'var(--teal-50)', color: 'var(--teal-700)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      },
      CERTIFICATION_APPROVED: {
        style: { backgroundColor: 'var(--success-50)', color: 'var(--success-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      },
      CERTIFICATION_REJECTED: {
        style: { backgroundColor: 'var(--danger-50)', color: 'var(--danger-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
      },
      CERTIFICATION_REVISION_REQUESTED: {
        style: { backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
      },
      REVIEW_STARTED: {
        style: { backgroundColor: 'var(--teal-50)', color: 'var(--teal-700)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
      },
      INTRODUCTION_REQUESTED: {
        style: { backgroundColor: 'var(--warning-50)', color: 'var(--warning-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
      },
      PROFILE_UPDATE_REQUEST: {
        style: { backgroundColor: 'var(--sand-100)', color: 'var(--sand-600)' },
        icon: <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
      },
    };
    return config[action] || { style: { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-700)' }, icon: null };
  };

  const getRoleColor = (role: UserRole): React.CSSProperties => {
    switch (role) {
      case 'admin': return { background: `linear-gradient(to bottom right, var(--graphite-600), var(--graphite-800))` };
      case 'sme': return { background: `linear-gradient(to bottom right, var(--teal-600), var(--teal-700))` };
      default: return { background: `linear-gradient(to bottom right, var(--teal-400), var(--teal-600))` };
    }
  };

  const formatAction = (action: string) => {
    return action.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-AE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const { page, pages } = pagination;
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );

    // Page numbers
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
          className="btn-secondary px-4 py-2 text-sm rounded-lg transition-colors"
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2" style={{ color: 'var(--graphite-400)' }}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            i === page
              ? 'btn-teal'
              : 'btn-secondary'
          }`}
        >
          {i}
        </button>
      );
    }

    if (endPage < pages) {
      if (endPage < pages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2" style={{ color: 'var(--graphite-400)' }}>...</span>);
      }
      buttons.push(
        <button
          key={pages}
          onClick={() => handlePageChange(pages)}
          className="btn-secondary px-4 py-2 text-sm rounded-lg transition-colors"
        >
          {pages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary px-4 py-2 text-sm rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  // Loading skeleton
  if (loading && logs.length === 0) {
    return (
      <div className="space-y-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="solid-card rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                <div className="space-y-2">
                  <div className="h-6 rounded w-16" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                  <div className="h-4 rounded w-24" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="solid-card rounded-xl p-5 animate-pulse">
          <div className="flex gap-4">
            <div className="flex-1 h-12 rounded-xl" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
            <div className="w-40 h-12 rounded-xl" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="solid-card rounded-xl overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-32 h-4 rounded" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                <div className="w-40 h-4 rounded" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                <div className="w-24 h-4 rounded" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                <div className="w-32 h-4 rounded" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const stats = [
    { label: 'Total Events', value: pagination?.total.toLocaleString() || '0', accent: 'stat-accent-teal' },
    { label: 'Current Page', value: pagination?.page.toString() || '1', accent: 'stat-accent-success' },
    { label: 'Total Pages', value: pagination?.pages.toString() || '1', accent: 'stat-accent-graphite' },
  ];

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className={`solid-card rounded-xl ${stat.accent} p-6`}
          >
            <div className="flex items-center gap-4">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: stat.accent === 'stat-accent-teal' ? 'var(--teal-100)' :
                    stat.accent === 'stat-accent-success' ? 'var(--success-100)' : 'var(--graphite-100)',
                  color: stat.accent === 'stat-accent-teal' ? 'var(--teal-600)' :
                    stat.accent === 'stat-accent-success' ? 'var(--success-600)' : 'var(--graphite-600)'
                }}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
                <p className="text-sm font-medium" style={{ color: 'var(--graphite-500)' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="solid-card rounded-xl p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by user, action, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-12 pr-4 h-12 rounded-xl"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={actionFilter}
              onChange={(e) => {
                setActionFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="input-field h-12 px-4 rounded-xl min-w-[160px]"
              style={{ color: 'var(--graphite-700)' }}
            >
              <option value="">All Actions</option>
              <option value="USER_LOGIN">Login</option>
              <option value="USER_REGISTERED">Registration</option>
              <option value="SME_PROFILE_UPDATED">Profile Update</option>
              <option value="PROFILE_UPDATE_REQUEST">Update Request</option>
              <option value="DOCUMENT_UPLOADED">Document Upload</option>
              <option value="CERTIFICATION_SUBMITTED">Submitted</option>
              <option value="CERTIFICATION_APPROVED">Approved</option>
              <option value="CERTIFICATION_REJECTED">Rejected</option>
              <option value="CERTIFICATION_REVISION_REQUESTED">Revision Requested</option>
              <option value="REVIEW_STARTED">Review Started</option>
            </select>
            <button
              onClick={fetchAuditLogs}
              className="btn-secondary h-12 px-5 rounded-xl flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
            <button
              onClick={handleExport}
              disabled={exporting}
              className="btn-teal h-12 px-5 rounded-xl flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              {exporting ? 'Exporting...' : 'Export CSV'}
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="solid-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User</th>
                <th>Action</th>
                <th>Description</th>
                <th>IP Address</th>
              </tr>
            </thead>
            <tbody>
              {filteredLogs.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <svg className="w-12 h-12" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <p className="font-medium" style={{ color: 'var(--graphite-500)' }}>No audit logs found</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Try adjusting your filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredLogs.map((log) => {
                  const actionConfig = getActionConfig(log.actionType);
                  return (
                    <tr key={log.id}>
                      <td>
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm font-mono" style={{ color: 'var(--graphite-600)' }}>{formatDate(log.timestamp)}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold"
                            style={getRoleColor(log.user.role)}
                          >
                            {log.user.fullName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium" style={{ color: 'var(--graphite-900)' }}>{log.user.fullName}</p>
                            <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{log.user.email}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
                          style={actionConfig.style}
                        >
                          {actionConfig.icon}
                          {formatAction(log.actionType)}
                        </span>
                      </td>
                      <td>
                        <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>{log.actionDescription}</span>
                      </td>
                      <td>
                        <span className="text-sm font-mono" style={{ color: 'var(--graphite-400)' }}>{log.ipAddress}</span>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderTop: '1px solid var(--graphite-100)' }}>
            <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
              Showing <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>{((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}</span> of <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>{pagination.total.toLocaleString()}</span> entries
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
