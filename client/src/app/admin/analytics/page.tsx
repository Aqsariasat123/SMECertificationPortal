'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnalyticsData } from '@/types';

// Tooltip component
function Tooltip({ text }: { text: string }) {
  return (
    <span className="relative group inline-flex ml-1 cursor-help">
      <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-400)' }}>
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-1.5 text-xs rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50" style={{ background: 'var(--graphite-800)', color: 'white' }}>
        {text}
      </span>
    </span>
  );
}

export default function AdminAnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [timeRange, setTimeRange] = useState<'7' | '30' | '90'>('30');
  const [roleFilter, setRoleFilter] = useState<string>('');
  const [timezone, setTimezone] = useState<string>(() => {
    try { return Intl.DateTimeFormat().resolvedOptions().timeZone; } catch { return 'UTC'; }
  });

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange, roleFilter, timezone]);

  const fetchAnalytics = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.getAdminAnalytics(parseInt(timeRange), roleFilter || undefined, timezone);
      if (result.success && result.data) {
        setAnalytics(result.data);
      } else {
        setError(result.message || 'Failed to load analytics data');
      }
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Unable to connect to the analytics service');
    } finally {
      setLoading(false);
    }
  };

  const getActionLabel = (action: string) => {
    const labels: Record<string, string> = {
      'USER_LOGIN': 'User Logins',
      'USER_REGISTERED': 'New Signups',
      'USER_LOGOUT': 'Logouts',
      'PROFILE_UPDATED': 'Profile Updates',
      'CERTIFICATION_SUBMITTED': 'Certifications Submitted',
      'CERTIFICATION_START_REVIEW': 'Reviews Started',
      'CERTIFICATION_APPROVE': 'Certifications Approved',
      'CERTIFICATION_REJECT': 'Certifications Rejected',
      'CERTIFICATION_REQUEST_REVISION': 'Revisions Requested',
      'DOCUMENT_UPLOADED': 'Documents Uploaded',
      'INTRODUCTION_REQUESTED': 'Introduction Requests',
      'LISTING_ENABLED': 'Listings Enabled',
      'LISTING_DISABLED': 'Listings Disabled',
      'KYC_APPROVE': 'KYC Approved',
      'KYC_REJECT': 'KYC Rejected',
      'EMAIL_VERIFIED': 'Emails Verified',
      'PASSWORD_RESET_REQUESTED': 'Password Resets',
      'LEGAL_PAGE_UPDATED': 'Legal Pages Updated',
      'AUDIT_LOGS_EXPORTED': 'Audit Logs Exported',
      'APPLICATIONS_EXPORTED': 'Applications Exported',
      'REGISTRY_SEARCH': 'Registry Searches',
      'REGISTRY_VIEW': 'Registry Views',
      'REGISTRY_ZERO_RESULTS': 'Zero-Result Searches',
    };
    return labels[action] || action.replace(/_/g, ' ');
  };

  const getSectorLabel = (sector: string) => {
    const labels: Record<string, string> = {
      technology: 'Technology',
      healthcare: 'Healthcare',
      finance: 'Finance',
      retail: 'Retail',
      manufacturing: 'Manufacturing',
      real_estate: 'Real Estate',
      hospitality: 'Hospitality',
      education: 'Education',
      other: 'Other',
    };
    return labels[sector] || sector.replace(/_/g, ' ');
  };

  const getActionColor = (action: string) => {
    if (action.includes('APPROVE') || action.includes('ENABLED') || action.includes('VERIFIED')) return 'var(--success-500)';
    if (action.includes('REJECT') || action.includes('DISABLED')) return 'var(--danger-500)';
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

  const getFunnelLabel = (status: string) => {
    const labels: Record<string, string> = {
      draft: 'Draft',
      submitted: 'Submitted',
      under_review: 'Under Review',
      certified: 'Certified',
      rejected: 'Rejected',
      revision_requested: 'Revision',
    };
    return labels[status] || status;
  };

  const getFunnelColor = (status: string) => {
    const colors: Record<string, string> = {
      draft: 'var(--graphite-400)',
      submitted: 'var(--teal-500)',
      under_review: 'var(--warning-500)',
      certified: 'var(--success-500)',
      rejected: 'var(--danger-500)',
      revision_requested: 'var(--warning-600)',
    };
    return colors[status] || 'var(--graphite-400)';
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

  if (error || !analytics) {
    return (
      <div className="flex flex-col items-center justify-center py-24">
        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4" style={{ background: 'var(--danger-100)' }}>
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--danger-500)' }}>
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold mb-1" style={{ color: 'var(--graphite-900)' }}>Failed to load analytics</h2>
        <p className="text-sm mb-4" style={{ color: 'var(--graphite-500)' }}>{error || 'No data available'}</p>
        <button
          onClick={fetchAnalytics}
          className="px-5 py-2.5 text-sm font-medium rounded-lg text-white transition-all"
          style={{ background: 'var(--teal-600)' }}
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Activity Analytics</h1>
          <p style={{ color: 'var(--graphite-500)' }} className="mt-1">Platform metrics and certification diagnostics</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border-0 font-medium"
            style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
          >
            <option value="">All Roles</option>
            <option value="sme">SME</option>
            <option value="user">Partners</option>
            <option value="admin">Admin</option>
          </select>

          {/* Timezone */}
          <select
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            className="px-3 py-2 text-sm rounded-lg border-0 font-medium max-w-[140px]"
            style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
          >
            <option value="UTC">UTC</option>
            <option value="Asia/Dubai">Dubai (GST)</option>
            <option value="Asia/Karachi">Karachi (PKT)</option>
            <option value="Europe/London">London (GMT)</option>
            <option value="America/New_York">New York (EST)</option>
          </select>

          {/* Time Range */}
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

      {/* Login Segmentation Cards */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center" style={{ color: 'var(--graphite-500)' }}>Login Segmentation<Tooltip text="Login counts grouped by user role in the selected period" /></h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Logins', value: analytics.loginSegmentation.total, color: 'teal', icon: 'M15 19l-7-7 7-7' },
            { label: 'SME Logins', value: analytics.loginSegmentation.sme, color: 'teal', icon: 'M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4' },
            { label: 'Partner Logins', value: analytics.loginSegmentation.user, color: 'warning', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Admin Logins', value: analytics.loginSegmentation.admin, color: 'graphite', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
          ].map((item) => (
            <div key={item.label} className="solid-card rounded-xl p-4 sm:p-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: `var(--${item.color}-100)`, color: `var(--${item.color}-600)` }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <p className="text-xl font-bold" style={{ color: 'var(--graphite-900)' }}>{item.value}</p>
                  <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{item.label}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Usage Quality + Certification Lifecycle */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Usage Quality */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center" style={{ color: 'var(--graphite-500)' }}>Usage Quality<Tooltip text="Unique users, repeat visitors, and inactive certified SMEs" /></h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: 'var(--graphite-700)' }}>Unique Logins</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--graphite-900)' }}>{analytics.usageQuality.uniqueLogins}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <span className="text-sm" style={{ color: 'var(--graphite-700)' }}>Repeat Logins</span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--graphite-900)' }}>{analytics.usageQuality.repeatLogins}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4.832c-.77-.833-2.694-.833-3.464 0L3.34 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <span className="text-sm flex items-center" style={{ color: 'var(--graphite-700)' }}>Inactive Certified SMEs<Tooltip text="Certified SMEs with no login in 30 days" /></span>
              </div>
              <span className="text-lg font-bold" style={{ color: 'var(--warning-600)' }}>{analytics.usageQuality.inactiveCertified}</span>
            </div>
          </div>
        </div>

        {/* Certification Lifecycle */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wider mb-4 flex items-center" style={{ color: 'var(--graphite-500)' }}>Certification Lifecycle<Tooltip text="Average days from signup to submission and drop-off by stage" /></h2>
          <div className="mb-4 p-3 rounded-lg" style={{ background: 'var(--teal-50)' }}>
            <p className="text-xs" style={{ color: 'var(--teal-600)' }}>Avg. Days to Submit</p>
            <p className="text-2xl font-bold" style={{ color: 'var(--teal-700)' }}>
              {analytics.certificationLifecycle.avgDaysToSubmit} <span className="text-sm font-normal">days</span>
            </p>
          </div>
          <div className="space-y-2">
            {Object.entries(analytics.certificationLifecycle.funnel)
              .sort(([, a], [, b]) => b - a)
              .map(([status, count]) => {
                const total = Object.values(analytics.certificationLifecycle.funnel).reduce((s, v) => s + v, 0);
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={status}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-medium" style={{ color: 'var(--graphite-700)' }}>{getFunnelLabel(status)}</span>
                      <span className="text-xs font-bold" style={{ color: 'var(--graphite-900)' }}>{count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                      <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: getFunnelColor(status) }} />
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Actions', value: analytics.totalActions, subtext: `Last ${timeRange} days`, color: 'teal' },
          { label: 'Approval Rate', value: `${analytics.certificationStats.approvalRate}%`, subtext: `${analytics.certificationStats.approved} of ${analytics.certificationStats.approved + analytics.certificationStats.rejected} decided`, color: 'success' },
          { label: 'Pending Review', value: analytics.certificationStats.pending, subtext: 'Applications waiting', color: 'warning' },
          { label: 'Total Applications', value: analytics.certificationStats.total, subtext: 'All time', color: 'graphite' },
        ].map((stat) => (
          <div key={stat.label} className={`solid-card rounded-xl p-4 sm:p-5 stat-accent-${stat.color}`}>
            <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stat.value}</p>
            <p className="text-xs sm:text-sm font-medium" style={{ color: 'var(--graphite-500)' }}>{stat.label}</p>
            <p className="text-xs hidden sm:block" style={{ color: 'var(--graphite-400)' }}>{stat.subtext}</p>
          </div>
        ))}
      </div>

      {/* Activity Chart */}
      <div className="solid-card rounded-xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>Activity Over Time</h2>
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
              <defs>
                <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="var(--teal-500)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--teal-500)" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              {[0, 25, 50, 75, 100].map((y) => (
                <line key={y} x1="0" y1={200 - (y * 2)} x2="800" y2={200 - (y * 2)} stroke="var(--graphite-200)" strokeWidth="1" strokeDasharray={y === 0 ? "0" : "4 4"} />
              ))}
              {/* Area fill */}
              {analytics.activityByDay.length > 1 && (
                <path
                  d={(() => {
                    const data = analytics.activityByDay;
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
              )}
              {/* Line */}
              {analytics.activityByDay.length > 1 && (
                <path
                  d={(() => {
                    const data = analytics.activityByDay;
                    const maxVal = getMaxActivity();
                    return data.map((d, i) => {
                      const x = (i / (data.length - 1)) * 800;
                      const y = 200 - (d.count / maxVal) * 180;
                      return `${i === 0 ? 'M' : 'L'}${x},${y}`;
                    }).join(' ');
                  })()}
                  fill="none"
                  stroke="var(--teal-500)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {/* Data points */}
              {analytics.activityByDay.map((d, i) => {
                const data = analytics.activityByDay;
                if (data.length <= 1) return null;
                const maxVal = getMaxActivity();
                const x = (i / (data.length - 1)) * 800;
                const y = 200 - (d.count / maxVal) * 180;
                return (
                  <g key={d.date}>
                    <circle cx={x} cy={y} r="5" fill="white" stroke="var(--teal-500)" strokeWidth="2" className="opacity-0 hover:opacity-100 transition-opacity cursor-pointer" />
                    <title>{`${formatDate(d.date)}: ${d.count} actions`}</title>
                  </g>
                );
              })}
            </svg>
            {/* X-axis labels */}
            <div className="flex justify-between mt-2 text-xs" style={{ color: 'var(--graphite-400)' }}>
              {analytics.activityByDay.filter((_, i) => i % Math.ceil(analytics.activityByDay.length / 6) === 0 || i === analytics.activityByDay.length - 1).map((day) => (
                <span key={day.date}>{formatDate(day.date)}</span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Actions by Type + Certification Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Actions by Type */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Actions by Type</h2>
          <div className="space-y-3">
            {Object.entries(analytics.actionsByType)
              .sort(([, a], [, b]) => b - a)
              .slice(0, 10)
              .map(([action, count]) => (
                <div key={action} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: getActionColor(action) }} />
                  <span className="flex-1 text-sm truncate" style={{ color: 'var(--graphite-700)' }}>{getActionLabel(action)}</span>
                  <span className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>{count}</span>
                </div>
              ))}
            {Object.keys(analytics.actionsByType).length === 0 && (
              <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>No actions recorded</p>
            )}
          </div>
        </div>

        {/* Certification Breakdown */}
        <div className="solid-card rounded-xl p-6">
          <h2 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Certification Breakdown</h2>
          <div className="space-y-4">
            {/* Visual Bar */}
            {analytics.certificationStats.total > 0 && (
              <div className="h-8 rounded-lg overflow-hidden flex" style={{ background: 'var(--graphite-100)' }}>
                {analytics.certificationStats.approved > 0 && (
                  <div className="h-full" style={{ width: `${(analytics.certificationStats.approved / analytics.certificationStats.total) * 100}%`, background: 'var(--success-500)' }}
                    title={`Approved: ${analytics.certificationStats.approved}`} />
                )}
                {analytics.certificationStats.pending > 0 && (
                  <div className="h-full" style={{ width: `${(analytics.certificationStats.pending / analytics.certificationStats.total) * 100}%`, background: 'var(--warning-500)' }}
                    title={`Pending: ${analytics.certificationStats.pending}`} />
                )}
                {analytics.certificationStats.rejected > 0 && (
                  <div className="h-full" style={{ width: `${(analytics.certificationStats.rejected / analytics.certificationStats.total) * 100}%`, background: 'var(--danger-500)' }}
                    title={`Rejected: ${analytics.certificationStats.rejected}`} />
                )}
              </div>
            )}
            {/* Legend */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              <div className="text-center p-2 sm:p-3 rounded-lg" style={{ background: 'var(--success-50)' }}>
                <p className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--success-600)' }}>{analytics.certificationStats.approved}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--success-700)' }}>Approved</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--warning-50)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--warning-600)' }}>{analytics.certificationStats.pending}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--warning-700)' }}>Pending</p>
              </div>
              <div className="text-center p-3 rounded-lg" style={{ background: 'var(--danger-50)' }}>
                <p className="text-2xl font-bold" style={{ color: 'var(--danger-600)' }}>{analytics.certificationStats.rejected}</p>
                <p className="text-xs font-medium" style={{ color: 'var(--danger-700)' }}>Rejected</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Registry Consumption */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center" style={{ color: 'var(--graphite-500)' }}>Registry Consumption<Tooltip text="How users interact with the SME registry — searches, views, and filters" /></h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Registry Stats Cards */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Search & View Stats</h3>
            <div className="space-y-3">
              {[
                { label: 'Total Registry Views', value: analytics.registryConsumption.totalViews, icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z', bg: 'teal' },
                { label: 'Total Searches', value: analytics.registryConsumption.totalSearches, icon: 'M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z', bg: 'teal' },
                { label: 'Text Searches', value: analytics.registryConsumption.textSearches, icon: 'M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129', bg: 'graphite' },
                { label: 'Sector-Only Searches', value: analytics.registryConsumption.sectorSearches, icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10', bg: 'graphite' },
                { label: 'Zero-Result Searches', value: analytics.registryConsumption.zeroResultSearches, icon: 'M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636', bg: 'danger' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--graphite-50)' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `var(--${item.bg}-100)`, color: `var(--${item.bg}-600)` }}>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                      </svg>
                    </div>
                    <span className="text-sm" style={{ color: 'var(--graphite-700)' }}>{item.label}</span>
                  </div>
                  <span className="text-lg font-bold" style={{ color: item.bg === 'danger' && item.value > 0 ? 'var(--danger-600)' : 'var(--graphite-900)' }}>{item.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Views by Sector Bar Chart */}
          <div className="solid-card rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Views by Sector</h3>
            {Object.keys(analytics.registryConsumption.viewsBySector).length > 0 ? (
              <div className="space-y-3">
                {(() => {
                  const entries = Object.entries(analytics.registryConsumption.viewsBySector).sort(([, a], [, b]) => b - a);
                  const maxVal = Math.max(...entries.map(([, v]) => v), 1);
                  return entries.map(([sector, count]) => (
                    <div key={sector}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-sm font-medium" style={{ color: 'var(--graphite-700)' }}>{getSectorLabel(sector)}</span>
                        <span className="text-sm font-bold" style={{ color: 'var(--graphite-900)' }}>{count}</span>
                      </div>
                      <div className="h-3 rounded-full overflow-hidden" style={{ background: 'var(--graphite-100)' }}>
                        <div className="h-full rounded-full transition-all" style={{ width: `${(count / maxVal) * 100}%`, background: 'var(--teal-500)' }} />
                      </div>
                    </div>
                  ));
                })()}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12" style={{ color: 'var(--graphite-400)' }}>
                <svg className="w-12 h-12 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <p className="text-sm">No registry views tracked yet</p>
                <p className="text-xs mt-1">Views will appear as users browse the registry</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Risk & Compliance */}
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-3 flex items-center" style={{ color: 'var(--graphite-500)' }}>Risk & Compliance<Tooltip text="Compliance signals — missing docs, expiring licenses, admin interventions" /></h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {[
            { label: 'Missing Documents', value: analytics.riskCompliance.missingDocs, desc: 'Certified SMEs without docs', color: 'warning', icon: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z' },
            { label: 'Near Expiry', value: analytics.riskCompliance.nearExpiry, desc: 'License expires within 30d', color: 'warning', icon: 'M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' },
            { label: 'Expired Licenses', value: analytics.riskCompliance.expiredLicenses, desc: 'Certified with expired license', color: 'danger', icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z' },
            { label: 'Admin Overrides', value: analytics.riskCompliance.adminOverrides, desc: `Visibility toggles (${timeRange}d)`, color: 'graphite', icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z' },
            { label: 'Rejections', value: analytics.riskCompliance.rejectionsPeriod, desc: `Cert rejections (${timeRange}d)`, color: 'danger', icon: 'M6 18L18 6M6 6l12 12' },
          ].map((item) => (
            <div key={item.label} className="solid-card rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: `var(--${item.color}-100)`, color: `var(--${item.color}-600)` }}>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                </div>
              </div>
              <p className="text-2xl font-bold" style={{ color: item.value > 0 && (item.color === 'danger' || item.color === 'warning') ? `var(--${item.color}-600)` : 'var(--graphite-900)' }}>{item.value}</p>
              <p className="text-xs font-medium" style={{ color: 'var(--graphite-700)' }}>{item.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--graphite-400)' }}>{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
