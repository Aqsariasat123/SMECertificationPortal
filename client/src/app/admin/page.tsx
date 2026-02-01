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
  const [supportStats, setSupportStats] = useState({ open: 0, inProgress: 0, resolved: 0 });

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [dashboardResult, applicationsResult, supportResult] = await Promise.all([
        api.getAdminDashboard(),
        api.getAdminApplications({ limit: 5 }),
        api.getSupportStats().catch(() => ({ success: false, data: null })),
      ]);

      if (dashboardResult.success && dashboardResult.data) {
        setStats(dashboardResult.data.stats);
        setRecentActivity(dashboardResult.data.recentActivity);
      }

      if (applicationsResult.success && applicationsResult.data) {
        setRecentApplications(applicationsResult.data.applications);
      }

      if (supportResult.success && supportResult.data) {
        setSupportStats(supportResult.data);
      }
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, { bg: string; text: string; dot: string }> = {
      draft: { bg: '#f1f5f9', text: '#64748b', dot: '#94a3b8' },
      submitted: { bg: '#fef3c7', text: '#d97706', dot: '#f59e0b' },
      under_review: { bg: '#dbeafe', text: '#2563eb', dot: '#3b82f6' },
      certified: { bg: '#dcfce7', text: '#16a34a', dot: '#22c55e' },
      rejected: { bg: '#fee2e2', text: '#dc2626', dot: '#ef4444' },
      revision_requested: { bg: '#ffedd5', text: '#ea580c', dot: '#f97316' },
    };
    return colors[status] || colors.draft;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Pending',
      under_review: 'Reviewing',
      certified: 'Certified',
      rejected: 'Rejected',
      revision_requested: 'Revision',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-32 rounded-2xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20"></div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-xl bg-slate-100"></div>
          ))}
        </div>
      </div>
    );
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="space-y-6">
      {/* Admin Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 p-6 text-white">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2"></div>
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2"></div>
        <div className="relative">
          <p className="text-indigo-200 text-sm">{currentDate}</p>
          <h1 className="text-2xl font-bold mt-1">Admin Control Center</h1>
          <p className="text-indigo-200 mt-1 text-sm">Monitor platform activity, manage applications, and oversee operations</p>
        </div>
        <div className="relative flex flex-wrap gap-3 mt-4">
          <Link href="/admin/applications" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Review Applications
          </Link>
          <Link href="/admin/support" className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
            Support Tickets
          </Link>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats?.totalUsers || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Total Users</p>
          <div className="flex items-center gap-1 mt-2">
            <span className="text-xs text-emerald-600 font-medium">Active</span>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            {(stats?.pendingApplications || 0) > 0 && (
              <span className="px-2 py-1 text-xs font-semibold bg-amber-100 text-amber-700 rounded-full">
                Action Required
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats?.pendingApplications || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Pending Review</p>
          <Link href="/admin/applications" className="text-xs text-indigo-600 font-medium mt-2 inline-block hover:underline">
            View all →
          </Link>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats?.certifiedSMEs || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Certified SMEs</p>
          <div className="w-full h-1.5 bg-slate-100 rounded-full mt-3 overflow-hidden">
            <div
              className="h-full bg-emerald-500 rounded-full transition-all"
              style={{ width: `${stats?.totalSMEs ? ((stats?.certifiedSMEs || 0) / stats.totalSMEs) * 100 : 0}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <p className="text-3xl font-bold text-slate-900 mt-4">{stats?.totalSMEs || 0}</p>
          <p className="text-sm text-slate-500 mt-1">Total SMEs</p>
          <p className="text-xs text-slate-400 mt-2">Registered companies</p>
        </div>
      </div>

      {/* Support Overview */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">Support Overview</h2>
            <p className="text-sm text-slate-500">Current ticket status</p>
          </div>
          <Link href="/admin/support" className="text-sm text-indigo-600 font-medium hover:underline">
            Manage Tickets →
          </Link>
        </div>
        <div className="grid grid-cols-3 divide-x divide-slate-100">
          <div className="p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{supportStats.open}</p>
            <p className="text-sm text-slate-500">Open</p>
          </div>
          <div className="p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{supportStats.inProgress}</p>
            <p className="text-sm text-slate-500">In Progress</p>
          </div>
          <div className="p-5 text-center">
            <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
              <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-2xl font-bold text-slate-900 mt-2">{supportStats.resolved}</p>
            <p className="text-sm text-slate-500">Resolved</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Recent Applications */}
        <div className="xl:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Recent Applications</h2>
              <p className="text-sm text-slate-500">Latest certification requests</p>
            </div>
            <Link href="/admin/applications" className="text-sm text-indigo-600 font-medium hover:underline">
              View all →
            </Link>
          </div>
          {recentApplications.length === 0 ? (
            <div className="p-8 text-center">
              <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-slate-500">No applications yet</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-100">
              {recentApplications.map((app) => {
                const statusColor = getStatusColor(app.certificationStatus);
                return (
                  <div key={app.id} className="p-4 hover:bg-slate-50 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-xl bg-slate-800 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-semibold text-white">{getInitials(app.companyName)}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-slate-900 truncate">{app.companyName || 'Unnamed Company'}</p>
                        <p className="text-sm text-slate-500 truncate">
                          {app.industrySector?.replace('_', ' ') || 'No sector'} • {formatTimeAgo(app.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span
                          className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
                          style={{ backgroundColor: statusColor.bg, color: statusColor.text }}
                        >
                          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor.dot }}></span>
                          {getStatusLabel(app.certificationStatus)}
                        </span>
                        <button
                          onClick={() => router.push(`/admin/applications/${app.id}`)}
                          className="px-3 py-1.5 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                        >
                          Review
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Activity Feed */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-100">
            <h2 className="text-lg font-semibold text-slate-900">Activity Feed</h2>
            <p className="text-sm text-slate-500">Recent system events</p>
          </div>
          <div className="p-4 max-h-[400px] overflow-y-auto">
            {recentActivity.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-4">No recent activity</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div key={activity.id} className="flex gap-3">
                    <div className="relative">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
                        <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      {index !== recentActivity.length - 1 && (
                        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-px h-full bg-slate-200"></div>
                      )}
                    </div>
                    <div className="flex-1 pb-4">
                      <p className="text-sm text-slate-700">{activity.actionDescription}</p>
                      <p className="text-xs text-slate-400 mt-1">
                        {activity.user?.fullName || 'System'} • {formatTimeAgo(activity.timestamp)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <div className="p-4 border-t border-slate-100">
            <Link href="/admin/audit-logs" className="text-sm text-indigo-600 font-medium hover:underline">
              View full audit log →
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link href="/admin/applications" className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center mb-3 group-hover:bg-indigo-600 transition-colors">
            <svg className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900">Applications</h3>
          <p className="text-sm text-slate-500 mt-1">Review certification requests</p>
        </Link>

        <Link href="/admin/users" className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center mb-3 group-hover:bg-emerald-600 transition-colors">
            <svg className="w-5 h-5 text-emerald-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900">Users</h3>
          <p className="text-sm text-slate-500 mt-1">Manage platform users</p>
        </Link>

        <Link href="/admin/support" className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center mb-3 group-hover:bg-amber-600 transition-colors">
            <svg className="w-5 h-5 text-amber-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900">Support</h3>
          <p className="text-sm text-slate-500 mt-1">Handle support tickets</p>
        </Link>

        <Link href="/admin/audit-logs" className="group p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all">
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center mb-3 group-hover:bg-purple-600 transition-colors">
            <svg className="w-5 h-5 text-purple-600 group-hover:text-white transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <h3 className="font-semibold text-slate-900">Audit Logs</h3>
          <p className="text-sm text-slate-500 mt-1">View system activity</p>
        </Link>
      </div>
    </div>
  );
}
