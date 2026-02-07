'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { LegalPageData } from '@/types';

export default function AdminLegalPagesPage() {
  const [pages, setPages] = useState<LegalPageData[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [notifyingSlug, setNotifyingSlug] = useState<string | null>(null);
  const [showNotifyConfirm, setShowNotifyConfirm] = useState<string | null>(null);
  const [notifying, setNotifying] = useState(false);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    setLoading(true);
    try {
      const result = await api.getAllLegalPages();
      if (result.success && result.data) {
        setPages(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch legal pages:', error);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (page: LegalPageData) => {
    setEditingSlug(page.slug);
    setEditTitle(page.title);
    setEditContent(page.content);
    setMessage(null);
  };

  const cancelEdit = () => {
    setEditingSlug(null);
    setEditTitle('');
    setEditContent('');
    setMessage(null);
  };

  const saveEdit = async () => {
    if (!editingSlug) return;
    setSaving(true);
    setMessage(null);
    try {
      const result = await api.updateLegalPage(editingSlug, {
        title: editTitle,
        content: editContent,
      });
      if (result.success) {
        setMessage({ type: 'success', text: 'Page updated successfully' });
        setEditingSlug(null);
        fetchPages();
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to save' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while saving' });
    } finally {
      setSaving(false);
    }
  };

  const getSlugLabel = (slug: string) => {
    const labels: Record<string, string> = {
      'terms': 'Terms of Service',
      'privacy': 'Privacy Policy',
      'certification-standards': 'Certification Standards',
      'legal-notice': 'Legal Notice',
      'contact': 'Contact Us',
    };
    return labels[slug] || slug;
  };

  const getSlugIcon = (slug: string) => {
    const icons: Record<string, string> = {
      'terms': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      'privacy': 'M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z',
      'certification-standards': 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
      'legal-notice': 'M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3',
      'contact': 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
    };
    return icons[slug] || 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z';
  };

  const handleNotifyUsers = async (slug: string) => {
    setNotifying(true);
    setMessage(null);
    try {
      const result = await api.notifyLegalUpdate(slug);
      if (result.success && result.data) {
        setMessage({
          type: 'success',
          text: `Notification sent to ${result.data.sent} users${result.data.failed > 0 ? ` (${result.data.failed} failed)` : ''}`
        });
      } else {
        setMessage({ type: 'error', text: result.message || 'Failed to send notifications' });
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'Network error while sending notifications' });
    } finally {
      setNotifying(false);
      setShowNotifyConfirm(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Legal Pages</h1>
          <p className="mt-1" style={{ color: 'var(--graphite-500)' }}>Manage legal content displayed on the portal</p>
        </div>
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="solid-card rounded-xl p-6 animate-pulse">
            <div className="h-6 rounded w-48 mb-2" style={{ background: 'var(--graphite-200)' }}></div>
            <div className="h-4 rounded w-32" style={{ background: 'var(--graphite-200)' }}></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Legal Pages</h1>
        <p className="mt-1" style={{ color: 'var(--graphite-500)' }}>Manage legal content displayed on the portal</p>
      </div>

      {/* Status Message */}
      {message && (
        <div className="p-4 rounded-xl text-sm font-medium" style={{
          background: message.type === 'success' ? 'var(--success-50)' : 'var(--danger-50)',
          color: message.type === 'success' ? 'var(--success-700)' : 'var(--danger-700)',
        }}>
          {message.text}
        </div>
      )}

      {/* Page List / Editor */}
      {editingSlug ? (
        <div className="solid-card rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSlugIcon(editingSlug)} />
                </svg>
              </div>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>Editing: {getSlugLabel(editingSlug)}</h2>
                <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>/{editingSlug}</p>
              </div>
            </div>
            <button
              onClick={cancelEdit}
              className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
              style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
            >
              Cancel
            </button>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Page Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-lg text-sm"
                style={{ border: '1px solid var(--graphite-300)', background: 'white', color: 'var(--graphite-900)' }}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Content (Markdown supported)</label>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={20}
                className="w-full px-4 py-3 rounded-lg text-sm font-mono"
                style={{ border: '1px solid var(--graphite-300)', background: 'white', color: 'var(--graphite-900)', resize: 'vertical' }}
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={cancelEdit}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all"
                style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
              >
                Discard
              </button>
              <button
                onClick={saveEdit}
                disabled={saving}
                className="px-5 py-2.5 text-sm font-medium rounded-lg transition-all text-white"
                style={{ background: saving ? 'var(--graphite-400)' : 'var(--teal-600)' }}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {pages.map((page) => (
            <div key={page.slug} className="solid-card rounded-xl p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getSlugIcon(page.slug)} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold" style={{ color: 'var(--graphite-900)' }}>{page.title}</h3>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs" style={{ color: 'var(--graphite-500)' }}>/{page.slug}</span>
                    <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>
                      Updated: {new Date(page.lastUpdated).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded" style={{
                      background: page.isPublished ? 'var(--success-100)' : 'var(--graphite-200)',
                      color: page.isPublished ? 'var(--success-700)' : 'var(--graphite-600)',
                    }}>
                      {page.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/${page.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-2 text-xs font-medium rounded-lg transition-all"
                  style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
                >
                  View
                </a>
                <button
                  onClick={() => startEdit(page)}
                  className="px-3 py-2 text-xs font-medium rounded-lg transition-all text-white"
                  style={{ background: 'var(--teal-600)' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => setShowNotifyConfirm(page.slug)}
                  className="px-3 py-2 text-xs font-medium rounded-lg transition-all flex items-center gap-1.5"
                  style={{ background: 'var(--graphite-800)', color: 'white' }}
                  title="Send email notification to all users"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Notify
                </button>
              </div>
            </div>
          ))}
          {pages.length === 0 && (
            <div className="solid-card rounded-xl p-12 text-center">
              <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>No legal pages found</p>
            </div>
          )}
        </div>
      )}

      {/* Notify Confirmation Modal */}
      {showNotifyConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="solid-card rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'var(--graphite-100)' }}>
                <svg className="w-5 h-5" style={{ color: 'var(--graphite-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>Notify Users</h3>
                <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Send email notification</p>
              </div>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--graphite-600)' }}>
              This will send an email notification about the <strong>{getSlugLabel(showNotifyConfirm)}</strong> update to all verified users. Are you sure?
            </p>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={() => setShowNotifyConfirm(null)}
                disabled={notifying}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all"
                style={{ background: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleNotifyUsers(showNotifyConfirm)}
                disabled={notifying}
                className="px-4 py-2 text-sm font-medium rounded-lg transition-all text-white flex items-center gap-2"
                style={{ background: notifying ? 'var(--graphite-400)' : 'var(--teal-600)' }}
              >
                {notifying ? (
                  <>
                    <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Sending...
                  </>
                ) : (
                  'Yes, Send Notification'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
