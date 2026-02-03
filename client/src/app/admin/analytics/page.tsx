'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AuditLogEntry } from '@/types';

interface AnalyticsData {
  totalActions: number;
  actionsByType: Record<string, number>;
  activityByDay: { date: string; count: number }[];
  certificationStats: {
    total: number;
    approved: number;
    rejected: number;
    pending: number;
    approvalRate: number;
  };
  recentActivity: AuditLogEntry[];
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      // Fetch audit logs and applications data
      const [logsResult, appsResult, dashboardResult] = await Promise.all([
        api.getAuditLogs({ limit: 500 }),
        api.getAdminApplications({ limit: 100 }),
        api.getAdminDashboard(),
      ]);

      const logs = logsResult.data?.logs || [];
      const apps = appsResult.data?.applications || [];
      const stats = dashboardResult.data?.stats;

      // Calculate date range
      const now = new Date();
      const daysAgo = new Date(now.getTime() - parseInt(timeRange) * 24 * 60 * 60 * 1000);

      // Filter logs by time range
      const filteredLogs = logs.filter((log: AuditLogEntry) =>
        new Date(log.timestamp) >= daysAgo
      );

      // Actions by type
      const actionsByType: Record<string, number> = {};
      filteredLogs.forEach((log: AuditLogEntry) => {
        const type = log.actionType;
        actionsByType[type] = (actionsByType[type] || 0) + 1;
      });

      // Activity by day
      const activityByDay: Record<string, number> = {};
      for (let i = 0; i < parseInt(timeRange); i++) {
        const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
        const dateStr = date.toISOString().split('T')[0];
        activityByDay[dateStr] = 0;
      }
      filteredLogs.forEach((log: AuditLogEntry) => {
        const dateStr = new Date(log.timestamp).toISOString().split('T')[0];
        if (activityByDay[dateStr] !== undefined) {
          activityByDay[dateStr]++;
        }
      });

      // Convert to array and sort
      const activityArray = Object.entries(activityByDay)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      // Certification stats
      const certified = apps.filter((a: { certificationStatus: string }) => a.certificationStatus === 'certified').length;
      const rejected = apps.filter((a: { certificationStatus: string }) => a.certificationStatus === 'rejected').length;
      const pending = apps.filter((a: { certificationStatus: string }) =>
        ['submitted', 'under_review', 'revision_requested'].includes(a.certificationStatus)
      ).length;
      const total = apps.length;
      const decided = certified + rejected;
      const approvalRate = decided > 0 ? Math.round((certified / decided) * 100) : 0;

      setAnalytics({
        totalActions: filteredLogs.length,
        actionsByType,
        activityByDay: activityArray,
        certificationStats: {
          total,
          approved: certified,
          rejected,
          pending,
          approvalRate,
        },
        recentActivity: filteredLogs.slice(0, 10),
      });
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'USER_LOGIN': 'User Logins',
      'USER_REGISTER': 'New Signups',
      'PROFILE_UPDATE': 'Profile Updates',
      'CERTIFICATION_SUBMITTED': 'Certifications Submitted',
      'CERTIFICATION_APPROVED': 'Certifications Approved',
      'CERTIFICATION_REJECTED': 'Certifications Rejected',
      'CERTIFICATION_REVISION': 'Revisions Requested',
      'DOCUMENT_UPLOAD': 'Documents Uploaded',
      'INTRODUCTION_REQUEST': 'Introduction Requests',
      'LISTING_ENABLED': 'Listings Enabled',
      'LISTING_DISABLED': 'Listings Disabled',
      'KYC_SUBMITTED': 'KYC Submitted',
      'KYC_APPROVED': 'KYC Approved',
      'KYC_REJECTED': 'KYC Rejected',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVED') || action.includes('ENABLED')) return 'var(--success-500)';
    if (action.includes('REJECTED') || action.includes('DISABLED')) return 'var(--danger-500)';
    if (action.includes('SUBMITTED') || action.includes('REQUEST')) return 'var(--warning-500)';
    if (action.includes('LOGIN') || action.includes('REGISTER')) return 'var(--teal-500)';
    return 'var(--graphite-400)';
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getMaxActivity = () => {
    if (!analytics) return 1;
    return Math.max(...analytics.activityByDay.map(d => d.count), 1);
  };

  // Loading skeleton
  if (loading) {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="solid-card rounded-xl p-6 animate-pulse">
              <div className="h-8 rounded w-16 mb-2" style={{ background: 'var(--graphite-200)' }}></div>
              <div className="h-4 rounded w-24" style={{ background: 'var(--graphite-200)' }}></div>
            </div>
          ))}
        </div>
        <div className="solid-card rounded-xl p-6 animate-pulse">
          <div className="h-48 rounded" style={{ background: 'var(--graphite-200)' }}></div>
        </div>
      </div>
    );
  }

  if (!analytics) return null;

  const statCards = [
    {
      label: 'Total Actions',
      value: analytics.totalActions,
      subtext: `Last ${timeRange} days`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'teal',
    },
    {
      label: 'Approval Rate',
      value: `${analytics.certificationStats.approvalRate}%`,
      subtext: `${analytics.certificationStats.approved} of ${analytics.certificationStats.approved + analytics.certificationStats.rejected} decided`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'success',
    },
    {
      label: 'Pending Review',
      value: analytics.certificationStats.pending,
      subtext: 'Applications waiting',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'warning',
    },
    {
      label: 'Total Applications',
      value: analytics.certificationStats.total,
      subtext: 'All time',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      color: 'graphite',
    },
  ];

  const getStatStyles = (color: string) => {
    const styles: Record<string, { iconBg: string; iconColor: string; accent: string }> = {
      teal: { iconBg: 'var(--teal-100)', iconColor: 'var(--teal-600)', accent: 'stat-accent-teal' },
      success: { iconBg: 'var(--success-100)', iconColor: 'var(--success-600)', accent: 'stat-accent-success' },
      warning: { iconBg: 'var(--warning-100)', iconColor: 'var(--warning-600)', accent: 'stat-accent-warning' },
      graphite: { iconBg: 'var(--graphite-100)', iconColor: 'var(--graphite-600)', accent: 'stat-accent-graphite' },
    };
    return styles[color];
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Activity Analytics</h1>
          <p style={{ color: 'var(--graphite-500)' }} className="mt-1">Monitor admin activity and certification metrics</p>
        </div>
        <div className="flex gap-2">
          {(['7', '30', '90'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{
                background: timeRange === range ? 'var(--teal-600)' : 'var(--graphite-100)',
                color: timeRange === range ? 'white' : 'var(--graphite-600)',
              }}
            >
              {range}D
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((stat) => {
          const style = getStatStyles(stat.color);
          return (
            <div key={stat.label} className={`solid-card rounded-xl p-4 sm:p-6 ${style.accent}`}>
              <div className="flex items-start gap-3 sm:gap-4">
                <div
                  className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: style.iconBg, color: style.iconColor }}
                >
                  {stat.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
                  <p className="text-xs sm:text-sm font-medium truncate" style={{ color: 'var(--graphite-500)' }}>{stat.label}</p>
                  <p className="text-xs hidden sm:block" style={{ color: 'var(--graphite-400)' }}>{stat.subtext}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Chart - Line Graph */}
      <div className="solid-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>
            Activity Over Time
          </h2>
          <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--graphite-500)' }}>
            <div className="w-3 h-3 rounded-full" style={{ background: 'var(--teal-500)' }} />
            <span>Actions</span>
          </div>
        </div>
        <div className="relative h-64">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-8 w-10 flex flex-col justify-between text-xs" style={{ color: 'var(--graphite-400)' }}>
            <span>{getMaxActivity()}</span>
            <span>{Math.round(getMaxActivity() * 0.75)}</span>
            <span>{Math.round(getMaxActivity() * 0.5)}</span>
            <span>{Math.round(getMaxActivity() * 0.25)}</span>
            <span>0</span>
          </div>
          {/* Chart area */}
          <div className="ml-12 h-full">
            <svg className="w-full h-56" viewBox="0 0 800 200" preserveAspectRatio="none">
              {/* Grid lines */}
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal-500)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map((y) => (
                <line
                  key={y}
                  x1="0"
                  y1={200 - (y * 2)}
                  x2="800"
                  y2={200 - (y * 2)}
                  stroke="var(--graphite-200)"
                  strokeWidth="1"
                  strokeDasharray={y === 0 ? "0" : "4 4"}
                />
              ))}
              {/* Area fill */}
              <path
                d={(() => {
                  const data = analytics.activityByDay.slice(-30);
                  const maxVal = getMaxActivity();
                  const points = data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 800;
                    const y = 200 - (d.count / maxVal) * 180;
                    return `${x},${y}`;
                  });
                  return `M0,200 L${points.join(' L')} L800,200 Z`;
                })()}
                fill="url(#areaGradient)"
              />
              {/* Line */}
              <path
                d={(() => {
                  const data = analytics.activityByDay.slice(-30);
                  const maxVal = getMaxActivity();
                  const points = data.map((d, i) => {
                    const x = (i / (data.length - 1)) * 800;
                    const y = 200 - (d.count / maxVal) * 180;
                    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                  });
                  return points.join(' ');
                })()}
                fill="none"
                stroke="var(--teal-500)"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Data points */}
              {analytics.activityByDay.slice(-30).map((d, i) => {
                const data = analytics.activityByDay.slice(-30);
                const maxVal = getMaxActivity();
                const x = (i / (data.length - 1)) * 800;
                const y = 200 - (d.count / maxVal) * 180;
                return (
                  <g key={d.date}>
                    <circle
                      cx={x}
                      cy={y}
                      r="5"
                      fill="white"
                      stroke="var(--teal-500)"
                      strokeWidth="2"
                      className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer"
                    />
                    <title>{`${formatDate(d.date)}: ${d.count} actions`}</title>
                  </g>
                );
              })}
            </svg>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--graphite-400)' }}>
              {analytics.activityByDay.slice(-30).filter((_, i) => i % Math.ceil(30 / 6) === 0 || i === analytics.activityByDay.slice(-30).length - 1).map((day) => (
                <span key={day.date}>{formatDate(day.date)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions by Type */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>
            Actions by Type
          </h2>
          <div className="space-y-3">
            {Object.entries(analytics.actionsByType)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 8)
              .map(([action, count]) => (
                <div key={action} className="flex items-center gap-3">
                  <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ background: getActionColor(action) }}
                  />
                  <span className="flex-1 text-sm truncate" style={{ color: 'var(--graphite-700)' }}>
                    {getActionLabel(action)}
                  </span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>
                    {count}
                  </span>
                </div>
              ))}
            {Object.keys(analytics.actionsByType).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>No actions recorded</p>
            )}
          </div>
        </div>

        {/* Certification Breakdown */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>
            Certification Breakdown
          </h2>
          <div className="space-y-4">
            {/* Visual Bar */}
            <div className="h-8 rounded-lg overflow-hidden flex" style={{ background: 'var(--graphite-100)' }}>
              {analytics.certificationStats.approved > 0 && (
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${(analytics.certificationStats.approved / analytics.certificationStats.total) * 100}%`,
                    background: 'var(--success-500)',
                  }}
                  title={`Approved: ${analytics.certificationStats.approved}`}
                />
              )}
              {analytics.certificationStats.pending > 0 && (
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${(analytics.certificationStats.pending / analytics.certificationStats.total) * 100}%`,
                    background: 'var(--warning-500)',
                  }}
                  title={`Pending: ${analytics.certificationStats.pending}`}
                />
              )}
              {analytics.certificationStats.rejected > 0 && (
                <div
                  className="h-full transition-all"
                  style={{
                    width: `${(analytics.certificationStats.rejected / analytics.certificationStats.total) * 100}%`,
                    background: 'var(--danger-500)',
                  }}
                  title={`Rejected: ${analytics.certificationStats.rejected}`}
                />
              )}
            </div>
            {/* Legend */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--success-600)' }}>
                  {analytics.certificationStats.approved}
                </p>
                <p className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>Approved</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--warning-50)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--warning-600)' }}>
                  {analytics.certificationStats.pending}
                </p>
                <p className="text-xs font-medium" style={{ color: 'var(--warning-700)' }}>Pending</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--danger-50)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--danger-600)' }}>
                  {analytics.certificationStats.rejected}
                </p>
                <p className="text-xs font-medium" style={{ color: 'var(--danger-700)' }}>Rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
