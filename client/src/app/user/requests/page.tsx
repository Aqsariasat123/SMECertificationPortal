'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';

interface Conversation {
  id: string;
  otherParty: {
    id: string;
    name: string;
    email: string;
  };
  lastMessage: {
    content: string;
    senderName: string;
    createdAt: string;
  };
  unreadCount: number;
  status: string;
  createdAt: string;
}

export default function UserRequestsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const result = await api.getConversations();
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        setError(result.message || 'Failed to load conversations');
      }
    } catch (err) {
      setError('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (days === 0) {
      return date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
      });
    } else if (days === 1) {
      return 'Yesterday';
    } else if (days < 7) {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    }
  };

  const getStatusConfig = (status: string) => {
    const config: Record<string, { bgStyle: React.CSSProperties; textStyle: React.CSSProperties; dotStyle: React.CSSProperties; label: string }> = {
      pending: {
        bgStyle: { backgroundColor: 'var(--warning-50)' },
        textStyle: { color: 'var(--warning-700)' },
        dotStyle: { backgroundColor: 'var(--warning-500)' },
        label: 'Awaiting Response'
      },
      viewed: {
        bgStyle: { backgroundColor: 'var(--teal-50)' },
        textStyle: { color: 'var(--teal-700)' },
        dotStyle: { backgroundColor: 'var(--teal-500)' },
        label: 'Seen'
      },
      responded: {
        bgStyle: { backgroundColor: 'var(--success-50)' },
        textStyle: { color: 'var(--success-700)' },
        dotStyle: { backgroundColor: 'var(--success-500)' },
        label: 'Active'
      },
    };
    return config[status] || config.pending;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div
          className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2"
          style={{ borderColor: 'var(--teal-500)' }}
        ></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>My Conversations</h1>
        <p className="mt-1" style={{ color: 'var(--foreground-muted)' }}>Your introduction requests and messages with companies</p>
      </div>

      {/* Error Message */}
      {error && (
        <div
          className="px-4 py-3 rounded-xl flex items-center gap-3 border"
          style={{
            backgroundColor: 'var(--danger-50)',
            borderColor: 'var(--danger-200)',
            color: 'var(--danger-700)'
          }}
        >
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
        </div>
      )}

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <div className="solid-card p-8 sm:p-12 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--graphite-100)' }}
          >
            <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>No Conversations Yet</h3>
          <p className="max-w-md mx-auto mb-6" style={{ color: 'var(--graphite-500)' }}>
            Browse the SME Registry and request introductions to start conversations with companies.
          </p>
          <Link
            href="/registry"
            className="btn-teal inline-flex items-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Browse Registry
          </Link>
        </div>
      ) : (
        <div className="solid-card overflow-hidden">
          <div className="divide-y" style={{ borderColor: 'var(--graphite-100)' }}>
            {conversations.map((conv) => {
              const statusConfig = getStatusConfig(conv.status);

              return (
                <Link
                  key={conv.id}
                  href={`/user/chat/${conv.id}`}
                  className="flex items-center gap-4 p-4 sm:p-6 transition-colors"
                  style={{ ['--hover-bg' as string]: 'var(--graphite-50)' }}
                  onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-50)'}
                  onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: 'var(--teal-100)' }}
                    >
                      <span className="font-bold text-lg" style={{ color: 'var(--teal-600)' }}>
                        {conv.otherParty.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    {conv.unreadCount > 0 && (
                      <div
                        className="absolute -top-1 -right-1 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center"
                        style={{ backgroundColor: 'var(--teal-600)' }}
                      >
                        {conv.unreadCount > 9 ? '9+' : conv.unreadCount}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--graphite-900)' }}>
                        {conv.otherParty.name}
                      </h3>
                      <span className="text-xs flex-shrink-0" style={{ color: 'var(--graphite-400)' }}>
                        {formatDate(conv.lastMessage.createdAt)}
                      </span>
                    </div>
                    <p
                      className={`text-sm truncate mt-0.5 ${conv.unreadCount > 0 ? 'font-medium' : ''}`}
                      style={{ color: conv.unreadCount > 0 ? 'var(--graphite-700)' : 'var(--graphite-500)' }}
                    >
                      {conv.lastMessage.senderName === 'You' ? 'You: ' : ''}
                      {conv.lastMessage.content || 'Sent an attachment'}
                    </p>
                    <span
                      className="badge inline-flex items-center gap-1.5 mt-2"
                      style={{ ...statusConfig.bgStyle, ...statusConfig.textStyle }}
                    >
                      <span className="w-1.5 h-1.5 rounded-full" style={statusConfig.dotStyle} />
                      {statusConfig.label}
                    </span>
                  </div>

                  {/* Arrow */}
                  <svg className="w-5 h-5 flex-shrink-0" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
