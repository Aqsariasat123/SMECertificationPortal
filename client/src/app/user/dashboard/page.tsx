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

  const firstName = user?.fullName?.split(' ')[0] || 'User';
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

      {/* Phase 1: Read-Only Access Info */}
      <div className="glass-card rounded-xl p-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
          </div>
          <div>
            <p className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Read-Only Registry Access</p>
            <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Browse certified businesses and view verified company profiles</p>
          </div>
        </div>
      </div>

      {/* Quick Actions - Phase 1: Only Browse Registry */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/user"
          className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(to bottom right, var(--teal-600), var(--teal-500))', boxShadow: '0 10px 15px -3px rgba(74, 143, 135, 0.2)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 transition-colors">Browse Registry</h3>
              <p className="text-sm text-slate-500 mt-0.5">View certified businesses and company profiles</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>

        <Link
          href="/user/profile"
          className="group bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:shadow-md hover:border-teal-200 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform" style={{ background: 'linear-gradient(to bottom right, var(--teal-600), var(--teal-500))', boxShadow: '0 10px 15px -3px rgba(74, 143, 135, 0.2)' }}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 transition-colors" style={{ color: 'var(--graphite-900)' }}>My Profile</h3>
              <p className="text-sm text-slate-500 mt-0.5">Manage your account settings</p>
            </div>
            <svg className="w-5 h-5 text-slate-300 group-hover:translate-x-1 transition-all" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </Link>
      </div>

      {/* Phase 1: Getting Started Info */}
      <div className="solid-card rounded-xl p-6">
        <h2 className="font-semibold mb-4" style={{ color: 'var(--graphite-900)' }}>Getting Started</h2>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--graphite-800)' }}>Browse the SME Registry</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>View certified businesses and their verified profiles</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: 'var(--teal-50)', color: 'var(--teal-600)' }}>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-medium text-sm" style={{ color: 'var(--graphite-800)' }}>View Company Details</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>Access business information, credentials, and contact details</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
