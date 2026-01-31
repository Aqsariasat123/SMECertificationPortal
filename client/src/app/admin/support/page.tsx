'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  lastMessage: {
    content: string;
    createdAt: string;
    sender: { fullName: string; role: string };
  } | null;
  messageCount: number;
  unreadCount: number;
}

interface Message {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  sender: {
    id: string;
    fullName: string;
    role: string;
  };
}

interface TicketDetail {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: {
    id: string;
    fullName: string;
    email: string;
    role: string;
  };
  messages: Message[];
}

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [stats, setStats] = useState({ open: 0, inProgress: 0, resolved: 0, total: 0, unread: 0 });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
    fetchStats();
  }, [statusFilter]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminSupportTickets(statusFilter ? { status: statusFilter } : undefined);
      if (result.success && result.data) {
        setTickets(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const result = await api.getSupportStats();
      if (result.success && result.data) {
        setStats(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const selectTicket = async (ticketId: string) => {
    try {
      setLoadingMessages(true);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setSelectedTicket(result.data);
        // Update unread count in list
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, unreadCount: 0 } : t));
      }
    } catch (error) {
      console.error('Failed to fetch ticket messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedTicket) return;

    try {
      setSending(true);
      const result = await api.sendSupportMessage(selectedTicket.id, newMessage);
      if (result.success && result.data) {
        setSelectedTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, result.data as Message],
        } : null);
        setNewMessage('');
        fetchTickets(); // Refresh list to update last message
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const updateStatus = async (ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed') => {
    try {
      const result = await api.updateSupportTicketStatus(ticketId, status);
      if (result.success) {
        fetchTickets();
        fetchStats();
        if (selectedTicket?.id === ticketId) {
          setSelectedTicket(prev => prev ? { ...prev, status } : null);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return { bg: 'var(--warning-100)', color: 'var(--warning-700)', dot: 'var(--warning-500)' };
      case 'in_progress': return { bg: 'var(--teal-100)', color: 'var(--teal-700)', dot: 'var(--teal-500)' };
      case 'resolved': return { bg: 'var(--success-100)', color: 'var(--success-700)', dot: 'var(--success-500)' };
      case 'closed': return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)', dot: 'var(--graphite-400)' };
      default: return { bg: 'var(--graphite-100)', color: 'var(--graphite-600)', dot: 'var(--graphite-400)' };
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'sme': return 'SME';
      case 'user': return 'Investor';
      case 'admin': return 'Admin';
      default: return role;
    }
  };

  const formatDate = (dateString: string) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'var(--graphite-800)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <h1 className="text-2xl font-bold">Support Messages</h1>
          <p style={{ color: 'var(--graphite-400)' }}>Manage support tickets from SMEs and investors</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="solid-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--warning-100)', color: 'var(--warning-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stats.open}</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>Open</p>
            </div>
          </div>
        </div>
        <div className="solid-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--teal-100)', color: 'var(--teal-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stats.inProgress}</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>In Progress</p>
            </div>
          </div>
        </div>
        <div className="solid-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--success-100)', color: 'var(--success-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stats.resolved}</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>Resolved</p>
            </div>
          </div>
        </div>
        <div className="solid-card rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'var(--danger-100)', color: 'var(--danger-600)' }}>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>{stats.unread}</p>
              <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>Unread</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '600px' }}>
        {/* Tickets List */}
        <div className="solid-card rounded-2xl overflow-hidden flex flex-col">
          {/* Filter */}
          <div className="p-4" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-sm rounded-lg"
              style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', color: 'var(--graphite-700)' }}
            >
              <option value="">All Tickets</option>
              <option value="open">Open</option>
              <option value="in_progress">In Progress</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          {/* Tickets */}
          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-20 rounded-lg" style={{ background: 'var(--graphite-100)' }} />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--graphite-100)' }}>
                  <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: 'var(--graphite-600)' }}>No tickets found</p>
                <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Support tickets will appear here</p>
              </div>
            ) : (
              <div className="divide-y" style={{ borderColor: 'var(--graphite-100)' }}>
                {tickets.map((ticket) => {
                  const statusColors = getStatusColor(ticket.status);
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => selectTicket(ticket.id)}
                      className="w-full p-4 text-left transition-colors hover:bg-gray-50"
                      style={{
                        background: selectedTicket?.id === ticket.id ? 'var(--teal-50)' : 'transparent',
                      }}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="font-semibold text-sm truncate" style={{ color: 'var(--graphite-900)' }}>
                              {ticket.subject}
                            </p>
                            {ticket.unreadCount > 0 && (
                              <span className="px-1.5 py-0.5 text-xs font-bold rounded-full text-white" style={{ background: 'var(--teal-500)' }}>
                                {ticket.unreadCount}
                              </span>
                            )}
                          </div>
                          <p className="text-xs mt-1" style={{ color: 'var(--graphite-500)' }}>
                            {ticket.user.fullName} ({getRoleLabel(ticket.user.role)})
                          </p>
                          {ticket.lastMessage && (
                            <p className="text-xs mt-1 truncate" style={{ color: 'var(--graphite-400)' }}>
                              {ticket.lastMessage.content}
                            </p>
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <span
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
                            style={{ background: statusColors.bg, color: statusColors.color }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={{ background: statusColors.dot }} />
                            {ticket.status.replace('_', ' ')}
                          </span>
                          <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>
                            {formatDate(ticket.updatedAt)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Chat Area */}
        <div className="lg:col-span-2 solid-card rounded-2xl overflow-hidden flex flex-col">
          {selectedTicket ? (
            <>
              {/* Chat Header */}
              <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
                <div>
                  <h3 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>{selectedTicket.subject}</h3>
                  <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                    {selectedTicket.user.fullName} ({selectedTicket.user.email})
                  </p>
                </div>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => updateStatus(selectedTicket.id, e.target.value as 'open' | 'in_progress' | 'resolved' | 'closed')}
                  className="px-3 py-1.5 text-sm font-medium rounded-lg"
                  style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', color: 'var(--graphite-700)' }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4" style={{ background: 'var(--graphite-50)' }}>
                {loadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--graphite-200)', borderTopColor: 'var(--teal-500)' }} />
                  </div>
                ) : (
                  <>
                    {selectedTicket.messages.map((message) => {
                      const isAdmin = message.sender.role === 'admin';
                      return (
                        <div key={message.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                          <div
                            className="max-w-[70%] rounded-2xl px-4 py-3"
                            style={{
                              background: isAdmin ? 'var(--teal-600)' : 'white',
                              color: isAdmin ? 'white' : 'var(--graphite-900)',
                              boxShadow: isAdmin ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                            }}
                          >
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs mt-1" style={{ color: isAdmin ? 'rgba(255,255,255,0.7)' : 'var(--graphite-400)' }}>
                              {message.sender.fullName} · {formatDate(message.createdAt)}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                    <div ref={messagesEndRef} />
                  </>
                )}
              </div>

              {/* Message Input */}
              <div className="p-4" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your reply..."
                    className="flex-1 px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', color: 'var(--graphite-900)' }}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-5 py-2.5 rounded-xl font-medium text-sm text-white transition-colors disabled:opacity-50"
                    style={{ background: 'var(--teal-600)' }}
                  >
                    {sending ? 'Sending...' : 'Send'}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--graphite-100)' }}>
                  <svg className="w-10 h-10" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: 'var(--graphite-600)' }}>Select a ticket</p>
                <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Choose a ticket from the list to view messages</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
