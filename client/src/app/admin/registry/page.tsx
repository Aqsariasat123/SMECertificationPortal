'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { AdminApplication, PaginationData } from '@/types';

interface RegistryEntry {
  id: string;
  companyName: string | null;
  industrySector: string | null;
  listingVisible: boolean;
  submittedDate: string | null;
  user: {
    fullName: string;
    email: string;
  };
}

export default function AdminRegistryPage() {
  const [entries, setEntries] = useState<RegistryEntry[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [visibilityFilter, setVisibilityFilter] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const limit = 10;

  const fetchRegistry = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch certified SMEs from applications endpoint
      const result = await api.getAdminApplications({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        status: 'certified',
      });

      if (result.success && result.data) {
        const certifiedEntries: RegistryEntry[] = result.data.applications.map((app: AdminApplication) => ({
          id: app.id,
          companyName: app.companyName,
          industrySector: app.industrySector,
          listingVisible: app.listingVisible,
          submittedDate: app.submittedDate,
          user: app.user,
        }));

        // Filter by visibility if needed
        const filtered = visibilityFilter
          ? certifiedEntries.filter(e =>
              visibilityFilter === 'visible' ? e.listingVisible : !e.listingVisible
            )
          : certifiedEntries;

        setEntries(filtered);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch registry:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, visibilityFilter]);

  useEffect(() => {
    fetchRegistry();
  }, [fetchRegistry]);

  const handleToggleVisibility = async (profileId: string, currentVisibility: boolean) => {
    setTogglingId(profileId);
    try {
      const result = await api.updateSMEVisibility(profileId, !currentVisibility);
      if (result.success) {
        // Update local state
        setEntries(prev =>
          prev.map(entry =>
            entry.id === profileId
              ? { ...entry, listingVisible: !currentVisibility }
              : entry
          )
        );
      }
    } catch (error) {
      console.error('Failed to toggle visibility:', error);
    } finally {
      setTogglingId(null);
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
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
        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
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
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ color: 'var(--graphite-600)' }}
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
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={i === page
            ? { background: 'var(--teal-600)', color: 'white' }
            : { color: 'var(--graphite-600)' }
          }
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
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ color: 'var(--graphite-600)' }}
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
        className="px-4 py-2 text-sm font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  // Calculate stats
  const visibleCount = entries.filter(e => e.listingVisible).length;
  const hiddenCount = entries.filter(e => !e.listingVisible).length;

  const stats = [
    {
      label: 'Total Certified',
      value: pagination?.total || entries.length,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      iconBg: 'var(--teal-100)',
      iconColor: 'var(--teal-600)',
      accentClass: 'stat-accent-teal',
    },
    {
      label: 'Visible in Registry',
      value: visibleCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      ),
      iconBg: 'var(--success-100)',
      iconColor: 'var(--success-600)',
      accentClass: 'stat-accent-success',
    },
    {
      label: 'Hidden from Registry',
      value: hiddenCount,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ),
      iconBg: 'var(--graphite-100)',
      iconColor: 'var(--graphite-600)',
      accentClass: 'stat-accent-graphite',
    },
  ];

  // Loading skeleton
  if (loading && entries.length === 0) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="solid-card rounded-xl p-6 animate-pulse">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl" style={{ background: 'var(--graphite-200)' }}></div>
                <div className="space-y-2">
                  <div className="h-6 rounded w-16" style={{ background: 'var(--graphite-200)' }}></div>
                  <div className="h-4 rounded w-24" style={{ background: 'var(--graphite-200)' }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="solid-card rounded-xl p-5 animate-pulse">
          <div className="h-12 rounded-xl w-40" style={{ background: 'var(--graphite-200)' }}></div>
        </div>
        <div className="solid-card rounded-xl overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg" style={{ background: 'var(--graphite-200)' }}></div>
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded w-48" style={{ background: 'var(--graphite-200)' }}></div>
                  <div className="h-3 rounded w-32" style={{ background: 'var(--graphite-200)' }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Registry Management</h1>
        <p style={{ color: 'var(--graphite-500)' }} className="mt-1">Control which certified SMEs appear in the public registry</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className={`solid-card rounded-xl p-6 ${stat.accentClass}`}>
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
      <div className="solid-card rounded-xl p-5">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--graphite-400)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by company name..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="input-field w-full h-12 rounded-xl"
                style={{ background: 'var(--graphite-50)', paddingLeft: '3.5rem' }}
              />
            </div>
          </div>
          <select
            value={visibilityFilter}
            onChange={(e) => {
              setVisibilityFilter(e.target.value);
              setCurrentPage(1);
            }}
            className="input-field h-12 px-4 rounded-xl font-medium min-w-[160px]"
            style={{ background: 'var(--graphite-50)', color: 'var(--graphite-700)' }}
          >
            <option value="">All Visibility</option>
            <option value="visible">Visible Only</option>
            <option value="hidden">Hidden Only</option>
          </select>
          <button
            onClick={fetchRegistry}
            className="h-12 px-5 font-medium rounded-xl transition-colors flex items-center gap-2"
            style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      {/* Registry Table */}
      <div className="solid-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Company</th>
                <th>Industry</th>
                <th>Owner</th>
                <th>Certified Date</th>
                <th>Visibility</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {entries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center">
                    <div className="empty-state">
                      <svg
                        className="empty-state-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <p className="font-medium" style={{ color: 'var(--foreground-muted)' }}>No certified SMEs found</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Certified SMEs will appear here for visibility management</p>
                    </div>
                  </td>
                </tr>
              ) : (
                entries.map((entry) => (
                  <tr key={entry.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div
                          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm"
                          style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}
                        >
                          {entry.companyName?.charAt(0).toUpperCase() || '?'}
                        </div>
                        <span className="font-medium" style={{ color: 'var(--graphite-900)' }}>
                          {entry.companyName || 'Unnamed'}
                        </span>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                        {formatSector(entry.industrySector)}
                      </span>
                    </td>
                    <td>
                      <div>
                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-900)' }}>{entry.user.fullName}</p>
                        <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{entry.user.email}</p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>
                        {formatDate(entry.submittedDate)}
                      </span>
                    </td>
                    <td>
                      {entry.listingVisible ? (
                        <span className="badge badge-success">
                          <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: 'var(--success-500)' }} />
                          Visible
                        </span>
                      ) : (
                        <span className="badge badge-neutral">
                          <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--graphite-400)' }} />
                          Hidden
                        </span>
                      )}
                    </td>
                    <td>
                      <button
                        onClick={() => handleToggleVisibility(entry.id, entry.listingVisible)}
                        disabled={togglingId === entry.id}
                        className="px-4 py-2 text-sm font-medium rounded-lg transition-all disabled:opacity-50"
                        style={{
                          background: entry.listingVisible ? 'var(--graphite-100)' : 'var(--teal-600)',
                          color: entry.listingVisible ? 'var(--graphite-700)' : 'white',
                        }}
                      >
                        {togglingId === entry.id ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                          </span>
                        ) : entry.listingVisible ? (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                            </svg>
                            Hide
                          </span>
                        ) : (
                          <span className="flex items-center gap-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            Show
                          </span>
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div
            className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid var(--graphite-100)' }}
          >
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>
                {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>
                {pagination.total}
              </span>{' '}
              certified SMEs
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
