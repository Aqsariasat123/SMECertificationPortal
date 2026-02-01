'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { KycApplication, KycStatus, PaginationData } from '@/types';

export default function AdminKycPage() {
  const router = useRouter();
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState<KycApplication[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApplications();
  }, [filter, searchTerm]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const result = await api.getKycApplications({
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
      console.error('Failed to fetch KYC applications:', err);
    } finally {
      setLoading(false);
    }
  };

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(a => a.kycStatus === 'pending').length,
    approved: applications.filter(a => a.kycStatus === 'approved').length,
    rejected: applications.filter(a => a.kycStatus === 'rejected').length,
    revision_requested: applications.filter(a => a.kycStatus === 'revision_requested').length,
  };

  const getStatusBadge = (status: KycStatus) => {
    const config: Record<KycStatus, { badgeClass: string; dotColor: string; label: string }> = {
      not_submitted: { badgeClass: 'badge badge-neutral', dotColor: 'var(--graphite-400)', label: 'Not Submitted' },
      pending: { badgeClass: 'badge badge-warning', dotColor: 'var(--warning-500)', label: 'Pending Review' },
      approved: { badgeClass: 'badge badge-success', dotColor: 'var(--success-500)', label: 'Approved' },
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

  const getInvestorTypeBadge = (type: string | null) => {
    if (!type) return null;
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium" style={{
        backgroundColor: type === 'individual' ? 'var(--teal-100)' : 'var(--graphite-100)',
        color: type === 'individual' ? 'var(--teal-700)' : 'var(--graphite-700)',
      }}>
        {type === 'individual' ? 'Individual' : 'Company'}
      </span>
    );
  };

  const getStatIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      folder: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      clock: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      check: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      x: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[icon];
  };

  const getStatStyles = (color: string) => {
    const styles: Record<string, { accentClass: string; iconBg: string; iconColor: string }> = {
      teal: { accentClass: 'stat-accent-teal', iconBg: 'var(--teal-100)', iconColor: 'var(--teal-600)' },
      warning: { accentClass: 'stat-accent-warning', iconBg: 'var(--warning-100)', iconColor: 'var(--warning-600)' },
      success: { accentClass: 'stat-accent-success', iconBg: 'var(--success-100)', iconColor: 'var(--success-600)' },
      danger: { accentClass: 'stat-accent-danger', iconBg: 'var(--danger-100)', iconColor: 'var(--danger-600)' },
    };
    return styles[color];
  };

  const stats = [
    { label: 'Total Applications', value: pagination?.total?.toString() || '0', icon: 'folder', color: 'teal', change: 'All KYC submissions' },
    { label: 'Pending Review', value: statusCounts.pending.toString(), icon: 'clock', color: 'warning', change: 'Requires attention' },
    { label: 'Approved', value: statusCounts.approved.toString(), icon: 'check', color: 'success', change: 'Verified investors' },
    { label: 'Rejected', value: statusCounts.rejected.toString(), icon: 'x', color: 'danger', change: 'Failed verification' },
  ];

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
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
                placeholder="Search investors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-12 pr-4 h-12 rounded-xl"
                style={{ backgroundColor: 'var(--graphite-50)' }}
              />
            </div>
          </div>

          {/* Status Tabs */}
          <div className="rounded-xl p-1.5 inline-flex gap-1 overflow-x-auto" style={{ backgroundColor: 'var(--graphite-100)' }}>
            {[
              { key: 'all', label: 'All' },
              { key: 'pending', label: 'Pending' },
              { key: 'approved', label: 'Approved' },
              { key: 'rejected', label: 'Rejected' },
              { key: 'revision_requested', label: 'Revision' },
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
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="font-medium" style={{ color: 'var(--graphite-500)' }}>No KYC applications found</p>
          <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Applications will appear here once investors submit their KYC</p>
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
                      style={{ background: 'linear-gradient(to bottom right, var(--teal-600), var(--teal-800))' }}
                    >
                      {getInitials(app.user.fullName)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-bold text-lg" style={{ color: 'var(--graphite-900)' }}>{app.user.fullName}</h3>
                        {getInvestorTypeBadge(app.investorType)}
                      </div>
                      <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>{app.user.email}</p>
                      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-3 text-sm">
                        {app.investorType === 'individual' ? (
                          <>
                            {app.nationality && (
                              <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                </div>
                                {app.nationality}
                              </span>
                            )}
                            {app.emiratesId && (
                              <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
                                  </svg>
                                </div>
                                Emirates ID: {app.emiratesId.slice(0, 6)}...
                              </span>
                            )}
                          </>
                        ) : (
                          <>
                            {app.companyNameKyc && (
                              <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                  </svg>
                                </div>
                                {app.companyNameKyc}
                              </span>
                            )}
                            {app.companyTradeLicense && (
                              <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                License: {app.companyTradeLicense}
                              </span>
                            )}
                          </>
                        )}
                        <span className="flex items-center gap-2" style={{ color: 'var(--graphite-600)' }}>
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
                            <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                          </div>
                          Submitted: {formatDate(app.kycSubmittedDate)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(app.kycStatus)}
                  <button
                    onClick={() => router.push(`/admin/kyc/${app.id}`)}
                    className="btn-teal px-5 py-2.5 text-sm font-semibold rounded-xl"
                  >
                    Review
                  </button>
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
