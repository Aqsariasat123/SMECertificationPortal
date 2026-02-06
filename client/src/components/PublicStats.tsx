'use client';

import { useEffect, useState } from 'react';

interface Stats {
  certifiedCount: number;
  completionRate: number;
  avgReviewHours: number;
}

export default function PublicStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
        const response = await fetch(`${apiUrl}/api/public/stats`);
        const data = await response.json();
        if (data.success) {
          setStats(data.data);
        }
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const formatCount = (count: number): string => {
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}k+`;
    }
    if (count > 0) {
      return `${count}+`;
    }
    return '0';
  };

  const formatReviewTime = (hours: number): string => {
    if (hours < 24) {
      return `~${hours}h`;
    }
    const days = Math.round(hours / 24);
    if (days === 1) {
      return '~24h';
    }
    return `~${days}d`;
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
        <div className="text-center">
          <div className="h-9 w-16 mx-auto rounded animate-pulse" style={{ background: 'var(--graphite-200)' }} />
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Certified SMEs</p>
        </div>
        <div className="text-center sm:border-x" style={{ borderColor: 'var(--graphite-200)' }}>
          <div className="h-9 w-16 mx-auto rounded animate-pulse" style={{ background: 'var(--graphite-200)' }} />
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Approval Rate</p>
        </div>
        <div className="text-center">
          <div className="h-9 w-16 mx-auto rounded animate-pulse" style={{ background: 'var(--graphite-200)' }} />
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Typical Review</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-8">
      <div className="text-center">
        <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
          {stats ? formatCount(stats.certifiedCount) : '—'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Certified SMEs</p>
      </div>
      <div className="text-center sm:border-x" style={{ borderColor: 'var(--graphite-200)' }}>
        <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
          {stats ? `${stats.completionRate}%` : '—'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Approval Rate</p>
      </div>
      <div className="text-center">
        <p className="text-3xl font-semibold" style={{ color: 'var(--graphite-900)' }}>
          {stats ? formatReviewTime(stats.avgReviewHours) : '—'}
        </p>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Typical Review</p>
      </div>
    </div>
  );
}
