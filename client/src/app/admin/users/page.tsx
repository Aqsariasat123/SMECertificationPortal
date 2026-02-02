'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import { AdminUser, PaginationData, UserRole } from '@/types';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [pagination, setPagination] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 10;

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const result = await api.getAdminUsers({
        page: currentPage,
        limit,
        search: searchTerm || undefined,
        role: roleFilter || undefined,
      });

      if (result.success && result.data) {
        setUsers(result.data.users);
        setPagination(result.data.pagination);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, roleFilter]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1);
    }, 300);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  const getAvatarStyle = (role: UserRole) => {
    switch (role) {
      case 'admin': return { background: 'linear-gradient(135deg, var(--graphite-500) 0%, var(--graphite-700) 100%)' };
      case 'sme': return { background: 'linear-gradient(135deg, var(--teal-600) 0%, var(--teal-700) 100%)' };
      default: return { background: 'linear-gradient(135deg, var(--teal-400) 0%, var(--teal-600) 100%)' };
    }
  };

  const getRoleBadge = (role: UserRole) => {
    const styles: Record<string, { className: string }> = {
      admin: { className: 'badge-neutral' },
      sme: { className: 'badge-teal' },
      user: { className: 'badge-teal' },
    };
    const style = styles[role] || styles.user;
    const labels: Record<string, string> = {
      admin: 'Administrator',
      sme: 'SME Owner',
      user: 'Investor',
    };
    return (
      <span className={`badge ${style.className}`}>
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{
            background: role === 'admin' ? 'var(--graphite-500)' : 'var(--teal-600)'
          }}
        />
        {labels[role] || 'Investor'}
      </span>
    );
  };

  const getStatusBadge = (isVerified: boolean) => {
    return isVerified ? (
      <span className="badge badge-success">
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ background: 'var(--success-500)' }}
        />
        Verified
      </span>
    ) : (
      <span className="badge badge-warning">
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: 'var(--warning-500)' }}
        />
        Pending
      </span>
    );
  };

  const getStatIcon = (icon: string) => {
    const icons: Record<string, React.ReactNode> = {
      users: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      building: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      verified: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    };
    return icons[icon];
  };

  const getStatStyles = (color: string) => {
    const styles: Record<string, { accentClass: string; iconBg: string; iconText: string }> = {
      blue: { accentClass: 'stat-accent-teal', iconBg: 'var(--teal-100)', iconText: 'var(--teal-600)' },
      emerald: { accentClass: 'stat-accent-success', iconBg: 'var(--success-100)', iconText: 'var(--success-600)' },
      purple: { accentClass: 'stat-accent-graphite', iconBg: 'var(--graphite-100)', iconText: 'var(--graphite-600)' },
    };
    return styles[color];
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AE', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getInitials = (name: string) => {
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleRoleFilterChange = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const renderPaginationButtons = () => {
    if (!pagination) return null;

    const { page, pages } = pagination;
    const buttons = [];

    // Previous button
    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(page - 1)}
        disabled={page === 1}
        className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
    );

    // Page numbers
    const maxVisiblePages = 5;
    let startPage = Math.max(1, page - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(pages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    if (startPage > 1) {
      buttons.push(
        <button
          key={1}
          onClick={() => handlePageChange(1)}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ color: 'var(--graphite-600)' }}
        >
          1
        </button>
      );
      if (startPage > 2) {
        buttons.push(<span key="ellipsis1" className="px-2" style={{ color: 'var(--graphite-400)' }}>...</span>);
      }
    }

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            i === page ? 'btn-teal' : ''
          }`}
          style={i !== page ? { color: 'var(--graphite-600)' } : undefined}
        >
          {i}
        </button>
      );
    }

    if (endPage < pages) {
      if (endPage < pages - 1) {
        buttons.push(<span key="ellipsis2" className="px-2" style={{ color: 'var(--graphite-400)' }}>...</span>);
      }
      buttons.push(
        <button
          key={pages}
          onClick={() => handlePageChange(pages)}
          className="px-4 py-2 text-sm font-medium rounded-lg transition-colors"
          style={{ color: 'var(--graphite-600)' }}
        >
          {pages}
        </button>
      );
    }

    // Next button
    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(page + 1)}
        disabled={page === pages}
        className="btn-secondary px-4 py-2 text-sm font-medium rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    );

    return buttons;
  };

  // Calculate stats
  const totalUsers = pagination?.total || 0;
  const smeCount = users.filter(u => u.role === 'sme').length;
  const verifiedCount = users.filter(u => u.isVerified).length;

  const stats = [
    { label: 'Total Users', value: totalUsers.toString(), icon: 'users', color: 'blue' },
    { label: 'SME Users', value: smeCount.toString(), icon: 'building', color: 'emerald' },
    { label: 'Verified Users', value: verifiedCount.toString(), icon: 'verified', color: 'purple' },
  ];

  // Loading skeleton
  if (loading && users.length === 0) {
    return (
      <div className="space-y-8">
        {/* Stats skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="solid-card rounded-xl p-6 animate-pulse"
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl"
                  style={{ background: 'var(--graphite-200)' }}
                ></div>
                <div className="space-y-2">
                  <div
                    className="h-6 rounded w-16"
                    style={{ background: 'var(--graphite-200)' }}
                  ></div>
                  <div
                    className="h-4 rounded w-24"
                    style={{ background: 'var(--graphite-200)' }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters skeleton */}
        <div className="solid-card rounded-xl p-5 animate-pulse">
          <div className="flex gap-4">
            <div
              className="flex-1 h-12 rounded-xl"
              style={{ background: 'var(--graphite-200)' }}
            ></div>
            <div
              className="w-36 h-12 rounded-xl"
              style={{ background: 'var(--graphite-200)' }}
            ></div>
          </div>
        </div>

        {/* Table skeleton */}
        <div className="solid-card rounded-xl overflow-hidden animate-pulse">
          <div className="p-6 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex items-center gap-4">
                <div
                  className="w-11 h-11 rounded-xl"
                  style={{ background: 'var(--graphite-200)' }}
                ></div>
                <div className="flex-1 space-y-2">
                  <div
                    className="h-4 rounded w-32"
                    style={{ background: 'var(--graphite-200)' }}
                  ></div>
                  <div
                    className="h-3 rounded w-48"
                    style={{ background: 'var(--graphite-200)' }}
                  ></div>
                </div>
                <div
                  className="w-24 h-6 rounded-full"
                  style={{ background: 'var(--graphite-200)' }}
                ></div>
                <div
                  className="w-20 h-6 rounded-full"
                  style={{ background: 'var(--graphite-200)' }}
                ></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => {
          const style = getStatStyles(stat.color);
          return (
            <div
              key={stat.label}
              className={`solid-card rounded-xl ${style.accentClass} p-6`}
            >
              <div className="flex items-center gap-4">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: style.iconBg, color: style.iconText }}
                >
                  {getStatIcon(stat.icon)}
                </div>
                <div>
                  <p
                    className="text-2xl font-bold"
                    style={{ color: 'var(--graphite-900)' }}
                  >
                    {stat.value}
                  </p>
                  <p
                    className="text-sm font-medium"
                    style={{ color: 'var(--foreground-muted)' }}
                  >
                    {stat.label}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters */}
      <div className="solid-card rounded-xl p-5">
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5"
                style={{ color: 'var(--graphite-400)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field w-full pl-14 pr-4 h-12 rounded-xl"
                style={{ background: 'var(--graphite-50)' }}
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={roleFilter}
              onChange={(e) => handleRoleFilterChange(e.target.value)}
              className="input-field h-12 px-4 rounded-xl font-medium min-w-[140px]"
              style={{ background: 'var(--graphite-50)', color: 'var(--graphite-700)' }}
            >
              <option value="">All Roles</option>
              <option value="admin">Administrator</option>
              <option value="sme">SME Owner</option>
              <option value="user">User</option>
            </select>
            <button
              onClick={fetchUsers}
              className="btn-secondary h-12 px-5 font-medium rounded-xl transition-colors flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="solid-card rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>User</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Last Login</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <div className="empty-state">
                      <svg
                        className="empty-state-icon"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <p className="font-medium" style={{ color: 'var(--foreground-muted)' }}>No users found</p>
                      <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Try adjusting your search or filters</p>
                    </div>
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id}>
                    <td>
                      <div className="flex items-center gap-4">
                        <div
                          className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold shadow-sm"
                          style={getAvatarStyle(user.role)}
                        >
                          {getInitials(user.fullName)}
                        </div>
                        <div>
                          <p
                            className="font-semibold"
                            style={{ color: 'var(--graphite-900)' }}
                          >
                            {user.fullName}
                          </p>
                          <p
                            className="text-sm"
                            style={{ color: 'var(--foreground-muted)' }}
                          >
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td>{getRoleBadge(user.role)}</td>
                    <td>{getStatusBadge(user.isVerified)}</td>
                    <td>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--graphite-600)' }}
                      >
                        {formatDate(user.createdAt)}
                      </span>
                    </td>
                    <td>
                      <span
                        className="text-sm"
                        style={{ color: 'var(--foreground-muted)' }}
                      >
                        {user.lastLogin ? formatDate(user.lastLogin) : 'Never'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.total > 0 && (
          <div
            className="px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4"
            style={{ borderTop: '1px solid var(--graphite-100)' }}
          >
            <p className="text-sm" style={{ color: 'var(--foreground-muted)' }}>
              Showing{' '}
              <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>
                {((pagination.page - 1) * pagination.limit) + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)}
              </span>{' '}
              of{' '}
              <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>
                {pagination.total}
              </span>{' '}
              users
            </p>
            <div className="flex items-center gap-2">
              {renderPaginationButtons()}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
