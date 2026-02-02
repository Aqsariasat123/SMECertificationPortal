'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { AdminDashboardStats, AuditLogEntry, AdminApplication } from '@/types';

export default function AdminDashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminDashboardStats | null>(null);
  const [recentActivity, setRecentActivity] = useState<AuditLogEntry[]>([]);
  const [recentApplications, setRecentApplications] = useState<AdminApplication[]>([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResult, applicationsResult] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminApplications({ limit: 4 }),
      ]);

      if (dashboardResult.success && dashboardResult.data) {
        setStats(dashboardResult.data.stats);
        setRecentActivity(dashboardResult.data.recentActivity);
      }

      if (applicationsResult.success && applicationsResult.data) {
        setRecentApplications(applicationsResult.data.applications);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      label: 'Total Users',
      value: stats?.totalUsers?.toString() || '0',
      accent: 'graphite',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
    },
    {
      label: 'Pending Applications',
      value: stats?.pendingApplications?.toString() || '0',
      accent: 'warning',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      label: 'Certified SMEs',
      value: stats?.certifiedSMEs?.toString() || '0',
      accent: 'success',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      label: 'Total SMEs',
      value: stats?.totalSMEs?.toString() || '0',
      accent: 'teal',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
    },
  ];

  const getStatusBadge = (status: string) => {
    const badges: Record<string, string> = {
      draft: 'badge badge-neutral',
      submitted: 'badge badge-warning',
      under_review: 'badge badge-teal',
      certified: 'badge badge-success',
      rejected: 'badge badge-danger',
      revision_requested: 'badge badge-warning',
    };
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Pending',
      under_review: 'Under Review',
      certified: 'Certified',
      rejected: 'Rejected',
      revision_requested: 'Revision Needed',
    };
    return (
      <span className={badges[status] || 'badge badge-neutral'}>
        <span className="status-dot status-dot-neutral" style={{
          background: status === 'certified' ? 'var(--success-500)' :
                     status === 'rejected' ? 'var(--danger-500)' :
                     status === 'submitted' || status === 'revision_requested' ? 'var(--warning-500)' :
                     status === 'under_review' ? 'var(--teal-600)' : 'var(--graphite-400)'
        }} />
        {labels[status] || status}
      </span>
    );
  };

  const getActivityIcon = (actionType: string) => {
    if (actionType.includes('CERTIFICATION')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    if (actionType.includes('PROFILE') || actionType.includes('DOCUMENT')) {
      return (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    }
    return (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    );
  };

  const getActivityColor = (actionType: string) => {
    if (actionType.includes('APPROVE') || actionType.includes('CERTIFIED')) {
      return { bg: 'var(--success-50)', color: 'var(--success-600)' };
    }
    if (actionType.includes('REJECT')) {
      return { bg: 'var(--danger-50)', color: 'var(--danger-600)' };
    }
    if (actionType.includes('SUBMIT') || actionType.includes('PROFILE')) {
      return { bg: 'var(--teal-50)', color: 'var(--teal-600)' };
    }
    return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)' };
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="glass-card rounded-lg p-5 animate-pulse">
              <div className="h-10 w-10 rounded-lg mb-3" style={{ background: 'var(--graphite-200)' }}></div>
              <div className="h-7 w-16 rounded mb-1" style={{ background: 'var(--graphite-200)' }}></div>
              <div className="h-4 w-24 rounded" style={{ background: 'var(--graphite-200)' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((stat) => (
          <div
            key={stat.label}
            className={`glass-card rounded-lg p-5 stat-accent-${stat.accent}`}
          >
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
              style={{
                background: stat.accent === 'graphite' ? 'var(--graphite-100)' :
                           stat.accent === 'warning' ? 'var(--warning-50)' :
                           stat.accent === 'success' ? 'var(--success-50)' : 'var(--teal-50)',
                color: stat.accent === 'graphite' ? 'var(--graphite-600)' :
                       stat.accent === 'warning' ? 'var(--warning-600)' :
                       stat.accent === 'success' ? 'var(--success-600)' : 'var(--teal-600)'
              }}
            >
              {stat.icon}
            </div>
            <p className="text-2xl font-semibold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
            <p className="text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="lg:col-span-2 glass-card rounded-lg overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--graphite-100)' }}>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Recent Applications</h2>
                <p className="text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>Latest certification requests</p>
              </div>
              <Link
                href="/admin/applications"
                className="text-sm font-medium transition-colors"
                style={{ color: 'var(--teal-600)' }}
              >
                View all
              </Link>
            </div>
          </div>

          {recentApplications.length === 0 ? (
            <div className="p-8 text-center">
              <p style={{ color: 'var(--foreground-muted)' }}>No applications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => (
                <div key={app.id} className="p-4 table-row-hover transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: 'var(--graphite-800)' }}
                      >
                        <span className="text-xs font-semibold text-white">{getInitials(app.companyName)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate" style={{ color: 'var(--graphite-900)' }}>
                          {app.companyName || 'Unnamed Company'}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--foreground-muted)' }}>
                          {app.industrySector?.replace('_', ' ') || 'No sector'} &bull; {formatTimeAgo(app.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-0 sm:ml-auto">
                      {getStatusBadge(app.certificationStatus)}
                      <button
                        onClick={() => router.push(`/admin/applications/${app.id}`)}
                        className="btn-secondary px-3 py-1.5 text-sm rounded-lg"
                      >
                        Review
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Recent Activity */}
        <div className="glass-card rounded-lg overflow-hidden">
          <div className="p-5 border-b" style={{ borderColor: 'var(--graphite-100)' }}>
            <h2 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>Recent Activity</h2>
            <p className="text-sm mt-0.5" style={{ color: 'var(--foreground-muted)' }}>Latest system events</p>
          </div>
          <div className="p-3">
            {recentActivity.length === 0 ? (
              <div className="p-4 text-center">
                <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>No recent activity</p>
              </div>
            ) : (
              <div className="space-y-1">
                {recentActivity.map((activity) => {
                  const colors = getActivityColor(activity.actionType);
                  return (
                    <div key={activity.id} className="flex gap-3 p-2.5 rounded-lg table-row-hover transition-colors">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ background: colors.bg, color: colors.color }}
                      >
                        {getActivityIcon(activity.actionType)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium leading-snug" style={{ color: 'var(--graphite-700)' }}>
                          {activity.actionDescription}
                        </p>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-400)' }}>
                          {activity.user?.fullName || 'System'} &bull; {formatTimeAgo(activity.timestamp)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          href="/admin/applications"
          className="group rounded-lg p-5 text-white card-hover"
          style={{ background: 'var(--graphite-800)' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold">Review Applications</h3>
          <p className="text-sm mt-1 opacity-70">{stats?.pendingApplications || 0} awaiting review</p>
        </Link>

        <Link
          href="/admin/users"
          className="group rounded-lg p-5 text-white card-hover"
          style={{ background: 'var(--teal-600)' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold">User Management</h3>
          <p className="text-sm mt-1 opacity-70">{stats?.totalUsers || 0} users in system</p>
        </Link>

        <Link
          href="/admin/audit-logs"
          className="group rounded-lg p-5 text-white card-hover"
          style={{ background: 'var(--graphite-600)' }}
        >
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center mb-3"
            style={{ background: 'rgba(255,255,255,0.1)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-semibold">Audit Logs</h3>
          <p className="text-sm mt-1 opacity-70">View system activity</p>
        </Link>
      </div>
    </div>
  );
}
