'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

interface NavItem {
  label: string;
  href: string;
  icon: React.ReactNode;
}

interface DashboardShellProps {
  children: React.ReactNode;
  navItems: NavItem[];
  title: string;
}

export default function DashboardShell({ children, navItems, title }: DashboardShellProps) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === pathname) return true;
    const basePaths = ['/admin', '/sme', '/user'];
    if (basePaths.includes(href) && href === pathname) return true;
    if (href !== '/' && !basePaths.includes(href) && pathname.startsWith(href)) return true;
    return false;
  };

  const getRoleLabel = () => {
    switch (user?.role) {
      case 'admin': return 'Administrator';
      case 'sme': return 'SME Owner';
      default: return 'User';
    }
  };

  return (
    <div className="min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          style={{ background: 'rgba(42, 47, 54, 0.5)' }}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-60 transform transition-transform duration-200 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
        style={{ background: 'var(--sidebar-bg)' }}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="px-5 py-4" style={{ borderBottom: '1px solid var(--graphite-700)' }}>
            <Link href="/" className="flex items-center gap-2.5">
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: 'var(--teal-600)' }}
              >
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <div>
                <span className="text-white font-medium text-sm block">SME Readiness</span>
                <span className="text-xs" style={{ color: 'var(--graphite-500)' }}>Portal</span>
              </div>
            </Link>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto">
            <div className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`sidebar-nav-item ${isActive(item.href) ? 'active' : ''}`}
                >
                  <span className="w-4 h-4 flex-shrink-0">{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </div>
          </nav>

          {/* User Section */}
          <div className="p-4" style={{ borderTop: '1px solid var(--graphite-700)' }}>
            <div className="flex items-center gap-2.5 mb-3 px-1">
              {user?.profilePicture ? (
                <img
                  src={`${API_BASE_URL}${user.profilePicture}`}
                  alt={user.fullName || 'User'}
                  className="w-8 h-8 rounded-lg object-cover flex-shrink-0"
                />
              ) : (
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: 'var(--graphite-600)' }}
                >
                  <span className="text-white text-xs font-medium">
                    {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm truncate">{user?.fullName}</p>
                <p className="text-xs truncate" style={{ color: 'var(--graphite-500)' }}>{getRoleLabel()}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="w-full flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-lg text-xs font-medium transition-all hover:bg-red-600"
              style={{ background: 'var(--graphite-600)', color: 'white' }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:pl-60">
        {/* Header */}
        <header
          className="sticky top-0 z-30"
          style={{ background: 'rgba(255,255,255,0.9)', backdropFilter: 'blur(8px)', borderBottom: '1px solid var(--graphite-200)' }}
        >
          <div className="flex items-center justify-between px-4 lg:px-6 py-3">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-1.5 rounded-lg transition-colors"
                style={{ color: 'var(--graphite-500)' }}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              <h1 className="text-base font-semibold" style={{ color: 'var(--graphite-900)' }}>{title}</h1>
            </div>
            <div className="flex items-center gap-3">
              <span
                className="hidden sm:inline-flex text-xs px-2.5 py-1 rounded"
                style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
              >
                {getRoleLabel()}
              </span>
              <Link
                href={user?.role === 'admin' ? '/admin' : user?.role === 'sme' ? '/sme/profile' : '/user/profile'}
                className="flex items-center gap-2 px-2 py-1 -mr-2 rounded-lg transition-colors hover:bg-gray-100"
                title="View Profile"
              >
                <span className="hidden sm:inline text-xs font-medium" style={{ color: 'var(--graphite-700)' }}>
                  {user?.fullName?.split(' ')[0]}
                </span>
                {user?.profilePicture ? (
                  <img
                    src={`${API_BASE_URL}${user.profilePicture}`}
                    alt={user.fullName || 'User'}
                    className="w-8 h-8 rounded-lg object-cover"
                  />
                ) : (
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center"
                    style={{ background: 'var(--graphite-700)', color: 'white' }}
                  >
                    <span className="text-xs font-medium">
                      {user?.fullName?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  </div>
                )}
              </Link>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
