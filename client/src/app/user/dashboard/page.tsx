'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { IntroductionRequest, IndustrySector } from '@/types';

export default function UserDashboard() {
  const { user } = useAuth();
  const [introductionRequests, setIntroductionRequests] = useState<IntroductionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    respondedRequests: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await api.getUserIntroductionRequests();
        if (result.success && result.data) {
          const requests = result.data.requests || [];
          setIntroductionRequests(requests);
          setStats({
            totalRequests: requests.length,
            pendingRequests: requests.filter(r => r.status === 'pending').length,
            respondedRequests: requests.filter(r => r.status === 'responded').length,
          });
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const formatSector = (sector: IndustrySector | null) => {
    if (!sector) return 'Other';
    return sector.charAt(0).toUpperCase() + sector.slice(1).replace(/_/g, ' ');
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'responded':
        return {
          label: 'Responded',
          bg: 'bg-green-50',
          text: 'text-green-700',
          dot: 'bg-green-500',
        };
      case 'viewed':
        return {
          label: 'Viewed',
          bg: 'bg-amber-50',
          text: 'text-amber-700',
          dot: 'bg-amber-500',
        };
      default:
        return {
          label: 'Pending',
          bg: 'bg-gray-100',
          text: 'text-gray-600',
          dot: 'bg-gray-400',
        };
    }
  };

  const getInitials = (name: string | null) => {
    if (!name) return '?';
    return name.charAt(0).toUpperCase();
  };

  const firstName = user?.fullName?.split(' ')[0] || 'Investor';
  const greeting = new Date().getHours() < 12 ? 'Good morning' : new Date().getHours() < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="rounded-2xl p-6" style={{ background: 'linear-gradient(135deg, var(--graphite-800) 0%, var(--graphite-900) 100%)' }}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <p className="text-sm mb-1" style={{ color: 'var(--graphite-400)' }}>{greeting}</p>
            <h1 className="text-xl sm:text-2xl font-bold text-white">
              Welcome back, {firstName}!
            </h1>
            <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>
              Here's an overview of your activity on SME Registry
            </p>
          </div>
          <Link
            href="/user"
            className="btn-teal inline-flex items-center gap-2 px-5 py-2.5 font-semibold rounded-xl transition-all text-sm whitespace-nowrap"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse SMEs
          </Link>
        </div>
      </div>

      {/* Stats Cards - Modern with colored left accent */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-cyan-400 to-teal-600" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.totalRequests}</p>
              <p className="text-sm text-slate-500 mt-1">Total Requests</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-50 to-teal-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-teal-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-400 to-orange-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.pendingRequests}</p>
              <p className="text-sm text-slate-500 mt-1">Pending</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm relative overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-400 to-green-500" />
          <div className="flex items-center justify-between">
            <div>
              <p className="text-3xl font-bold text-slate-900">{stats.respondedRequests}</p>
              <p className="text-sm text-slate-500 mt-1">Responded</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-50 to-green-50 flex items-center justify-center">
              <svg className="w-6 h-6 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions - Modern cards with gradient hover */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/user"
          className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-teal-600 to-cyan-600 flex items-center justify-center shadow-lg shadow-teal-600/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-teal-600 transition-colors">Browse Registry</h3>
              <p className="text-sm text-slate-500 mt-0.5">Find and connect with certified SMEs</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-teal-600 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/user/messages"
          className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-violet-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg shadow-violet-500/20 group-hover:scale-105 transition-transform">
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-violet-600 transition-colors">Messages</h3>
              <p className="text-sm text-slate-500 mt-0.5">View your conversations with SMEs</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:text-violet-500 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Recent Introduction Requests */}
      <div className="solid-card rounded-xl overflow-hidden">
        <div className="p-5 border-b" style={{ borderColor: 'var(--graphite-200)' }}>
          <div className="flex items-center justify-between">
            <h2 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Recent Introduction Requests</h2>
            <Link
              href="/user/profile?tab=introductions"
              className="text-sm font-medium"
              style={{ color: 'var(--teal-600)' }}
            >
              View All →
            </Link>
          </div>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <div className="w-8 h-8 border-2 border-t-transparent rounded-full animate-spin mx-auto" style={{ borderColor: 'var(--teal-600)', borderTopColor: 'transparent' }} />
            <p className="mt-3 text-sm" style={{ color: 'var(--graphite-500)' }}>Loading...</p>
          </div>
        ) : introductionRequests.length > 0 ? (
          <div className="divide-y" style={{ borderColor: 'var(--graphite-100)' }}>
            {introductionRequests.slice(0, 5).map((request) => {
              const statusConfig = getStatusConfig(request.status);
              return (
                <Link
                  key={request.id}
                  href={`/user/messages?chat=${request.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-sm" style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}>
                      {getInitials(request.smeName)}
                    </div>
                    <div>
                      <p className="font-medium text-sm group-hover:underline" style={{ color: 'var(--graphite-900)' }}>{request.smeName || 'Unknown Company'}</p>
                      <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{formatSector(request.smeSector)} • {formatDate(request.requestedDate)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${statusConfig.bg} ${statusConfig.text}`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                      {statusConfig.label}
                    </span>
                    <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-400)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="p-8 text-center">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-4" style={{ backgroundColor: 'var(--graphite-100)' }}>
              <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-400)' }}>
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>No requests yet</h3>
            <p className="text-sm mt-1 mb-4" style={{ color: 'var(--graphite-500)' }}>Browse the SME registry to find companies and request introductions</p>
            <Link
              href="/user"
              className="btn-teal inline-flex items-center gap-2 px-4 py-2 font-semibold rounded-lg text-sm"
            >
              Browse Registry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
