'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminApplication, PaginationData, CertificationStatus } from '@/types';

export default function AdminApplicationsPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<AdminApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    fetchApplications();
  }, [filter, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminApplications({
        page: 1,
        limit: 20,
        search: searchTerm || undefined,
        status: filter !== 'all' ? filter : undefined,
      });
      if (result.success && result.data) {
        setApplications(result.data.applications);
        setPagination(result.data.pagination);
      }
    } catch (err) {
      console.error('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartReview = async (id: string) => {
    try {
      setActionLoading(id);
      const result = await api.reviewApplication(id, 'start_review');
      if (result.success) {
        router.push(`/admin/applications/${id}`);
      }
    } catch (err) {
      console.error('Failed to start review:', err);
    } finally {
      setActionLoading(null);
    }
  };

  const statusCounts = {
    all: applications.length,
    submitted: applications.filter(a => a.certificationStatus === 'submitted').length,
    under_review: applications.filter(a => a.certificationStatus === 'under_review').length,
    revision_requested: applications.filter(a => a.certificationStatus === 'revision_requested').length,
    certified: applications.filter(a => a.certificationStatus === 'certified').length,
  };

  const getStatusBadge = (status: CertificationStatus) => {
    const config: Record<CertificationStatus, { badgeClass: string; dotColor: string; label: string }> = {
      draft: { badgeClass: 'badge badge-neutral', dotColor: 'var(--graphite-400)', label: 'Draft' },
      submitted: { badgeClass: 'badge badge-warning', dotColor: 'var(--warning-500)', label: 'Pending Review' },
      under_review: { badgeClass: 'badge badge-teal', dotColor: 'var(--teal-600)', label: 'Under Review' },
      certified: { badgeClass: 'badge badge-success', dotColor: 'var(--success-500)', label: 'Certified' },
      rejected: { badgeClass: 'badge badge-danger', dotColor: 'var(--danger-500)', label: 'Rejected' },
      revision_requested: { badgeClass: 'badge badge-warning', dotColor: 'var(--warning-500)', label: 'Revision Needed' },
    };
    const { badgeClass, dotColor, label } = config[status];
    return (
      <span className={`${badgeClass} inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-semibold`}>
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: dotColor }} />
        {label}
      </span>
    );
  };

  const getStatIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      folder: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
        </svg>
      ),
      clock: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      search: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      ),
      check: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[icon];
  };

  const getStatStyles = (color: string) => {
    const styles: Record<string, { accentClass: string; iconBg: string; iconColor: string }> = {
      teal: { accentClass: 'stat-accent-teal', iconBg: 'var(--teal-100)', iconColor: 'var(--teal-600)' },
      warning: { accentClass: 'stat-accent-warning', iconBg: 'var(--warning-100)', iconColor: 'var(--warning-600)' },
      graphite: { accentClass: 'stat-accent-graphite', iconBg: 'var(--graphite-100)', iconColor: 'var(--graphite-600)' },
      success: { accentClass: 'stat-accent-success', iconBg: 'var(--success-100)', iconColor: 'var(--success-600)' },
    };
    return styles[color];
  };

  const stats = [
    { label: 'Total Applications', value: pagination?.total?.toString() || '0', icon: 'folder', color: 'teal', change: 'All applications' },
    { label: 'Pending Review', value: statusCounts.submitted.toString(), icon: 'clock', color: 'warning', change: 'Requires attention' },
    { label: 'Under Review', value: statusCounts.under_review.toString(), icon: 'search', color: 'graphite', change: 'In progress' },
    { label: 'Certified', value: statusCounts.certified.toString(), icon: 'check', color: 'success', change: 'Approved' },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSector = (sector: string | null) => {
    if (!sector) return 'Not specified';
    return sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const style = getStatStyles(stat.color);
          return (
            <div
              key={stat.label}
              className={`solid-card card-hover rounded-xl ${style.accentClass} p-6`}
            >
              <div className="flex items-start justify-between">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: style.iconBg, color: style.iconColor }}
                >
                  {getStatIcon(stat.icon)}
                </div>
              </div>
              <div className="mt-4">
                <p className="text-3xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
                <p className="text-sm mt-1 font-medium" style={{ color: 'var(--graphite-500)' }}>{stat.label}</p>
                <p className="text-xs mt-2" style={{ color: 'var(--graphite-400)' }}>{stat.change}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Search and Filters */}
      <div className="solid-card rounded-xl p-5">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search applications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-14 pr-4 h-12 rounded-xl"
                style={{ backgroundColor: 'var(--graphite-50)' }}
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="rounded-xl p-1.5 inline-flex gap-1 overflow-x-auto" style={{ backgroundColor: 'var(--graphite-100)' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'submitted', label: 'Pending' },
              { key: 'under_review', label: 'Review' },
              { key: 'revision_requested', label: 'Revision' },
              { key: 'certified', label: 'Certified' },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className="px-4 py-2.5 text-sm font-medium rounded-lg transition-all whitespace-nowrap"
                style={{
                  backgroundColor: filter === tab.key ? 'white' : 'transparent',
                  color: filter === tab.key ? 'var(--graphite-900)' : 'var(--graphite-600)',
                  boxShadow: filter === tab.key ? 'var(--card-shadow)' : 'none'
                }}
              >
                {tab.label}
                <span
                  className="ml-2 px-2 py-0.5 rounded-full text-xs font-semibold"
                  style={{
                    backgroundColor: filter === tab.key ? 'var(--teal-100)' : 'var(--graphite-200)',
                    color: filter === tab.key ? 'var(--teal-700)' : 'var(--graphite-600)'
                  }}
                >
                  {statusCounts[tab.key as keyof typeof statusCounts] || 0}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Applications List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2" style={{ borderColor: 'var(--teal-600)' }}></div>
        </div>
      ) : applications.length === 0 ? (
        <div className="solid-card rounded-xl p-12 text-center">
          <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="font-medium" style={{ color: 'var(--graphite-500)' }}>No applications found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Applications will appear here once SMEs submit their profiles</p>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div
              key={app.id}
              className="solid-card card-hover rounded-xl p-6 group"
            >
              <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div
                      className="w-14 h-14 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                      style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}
                    >
                      {getInitials(app.companyName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--graphite-900)' }}>{app.companyName || 'Unnamed Company'}</h3>
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>{formatSector(app.industrySector)}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm">
                        <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          {app.user.fullName}
                        </span>
                        <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                          </div>
                          {app.user.email}
                        </span>
                        <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          {formatDate(app.submittedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(app.certificationStatus)}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => router.push(`/admin/applications/${app.id}`)}
                      className="btn-secondary px-4 py-2.5 text-sm font-medium rounded-xl"
                    >
                      View Details
                    </button>
                    {app.certificationStatus === 'submitted' && (
                      <button
                        onClick={() => handleStartReview(app.id)}
                        disabled={actionLoading === app.id}
                        className="btn-teal px-5 py-2.5 text-sm font-semibold rounded-xl disabled:opacity-50"
                      >
                        {actionLoading === app.id ? 'Starting...' : 'Start Review'}
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Progress bar for completion */}
              <div className="mt-6 pt-6" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>Profile Completion</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--teal-600)' }}>{app.completionPercentage}%</span>
                </div>
                <div className="w-full h-2 rounded-full overflow-hidden" style={{ backgroundColor: 'var(--graphite-100)' }}>
                  <div
                    className="h-full rounded-full transition-all"
                    style={{ width: `${app.completionPercentage}%`, backgroundColor: 'var(--teal-600)' }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                page === pagination.page
                  ? 'btn-teal'
                  : 'btn-secondary'
              }`}
            >
              {page}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
