'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/lib/api';

interface SupportTicket {
  id: string;
  subject: string;
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  priority: string;
  createdAt: string;
  updatedAt: string;
  lastMessage: {
    content: string;
    createdAt: string;
    sender: { fullName: string; role: string };
  } | null;
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

export default function SMESupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', message: '' });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [selectedTicket?.messages]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!selectedTicket) return;
    const interval = setInterval(() => {
      selectTicket(selectedTicket.id);
    }, 10000);
    return () => clearInterval(interval);
  }, [selectedTicket?.id]);

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await api.getSupportTickets();
      if (result.success && result.data) {
        setTickets(result.data);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const selectTicket = async (ticketId: string) => {
    try {
      setLoadingMessages(true);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setSelectedTicket(result.data);
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
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const createTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) return;

    try {
      setCreatingTicket(true);
      const result = await api.createSupportTicket(newTicketForm.subject, newTicketForm.message);
      if (result.success && result.data) {
        setShowNewTicket(false);
        setNewTicketForm({ subject: '', message: '' });
        fetchTickets();
        // Auto-select the new ticket
        selectTicket(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicket(false);
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

  const totalUnread = tickets.reduce((sum, t) => sum + t.unreadCount, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="rounded-2xl p-6 text-white relative overflow-hidden" style={{ background: 'var(--graphite-800)' }}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Support</h1>
            <p style={{ color: 'var(--graphite-400)' }}>Get help from our support team</p>
          </div>
          <button
            onClick={() => setShowNewTicket(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-semibold rounded-xl transition-colors"
            style={{ background: 'var(--teal-600)', color: 'white' }}
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: '500px' }}>
        {/* Tickets List */}
        <div className="solid-card rounded-2xl overflow-hidden flex flex-col">
          <div className="p-4 flex items-center justify-between" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
            <h3 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Your Tickets</h3>
            {totalUnread > 0 && (
              <span className="px-2 py-0.5 text-xs font-bold rounded-full text-white" style={{ background: 'var(--teal-500)' }}>
                {totalUnread} unread
              </span>
            )}
          </div>

          <div className="flex-1 overflow-y-auto">
            {loading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-16 rounded-lg" style={{ background: 'var(--graphite-100)' }} />
                  </div>
                ))}
              </div>
            ) : tickets.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--graphite-100)' }}>
                  <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <p className="font-medium" style={{ color: 'var(--graphite-600)' }}>No support requests</p>
                <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Click &quot;New Request&quot; to get help</p>
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
                          {ticket.lastMessage && (
                            <p className="text-xs mt-1 truncate" style={{ color: 'var(--graphite-500)' }}>
                              {ticket.lastMessage.sender.role === 'admin' ? 'Admin: ' : 'You: '}
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
                    Status: <span className="font-medium capitalize">{selectedTicket.status.replace('_', ' ')}</span>
                  </p>
                </div>
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
                        <div key={message.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <div
                            className="max-w-[70%] rounded-2xl px-4 py-3"
                            style={{
                              background: isAdmin ? 'white' : 'var(--teal-600)',
                              color: isAdmin ? 'var(--graphite-900)' : 'white',
                              boxShadow: isAdmin ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
                            }}
                          >
                            {isAdmin && (
                              <p className="text-xs font-semibold mb-1" style={{ color: 'var(--teal-600)' }}>Admin Support</p>
                            )}
                            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                            <p className="text-xs mt-1" style={{ color: isAdmin ? 'var(--graphite-400)' : 'rgba(255,255,255,0.7)' }}>
                              {formatDate(message.createdAt)}
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
              {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
                <div className="p-4" style={{ borderTop: '1px solid var(--graphite-100)' }}>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                      placeholder="Type your message..."
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
              )}

              {(selectedTicket.status === 'closed' || selectedTicket.status === 'resolved') && (
                <div className="p-4 text-center" style={{ borderTop: '1px solid var(--graphite-100)', background: 'var(--graphite-50)' }}>
                  <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                    This ticket has been {selectedTicket.status}. Create a new request if you need further assistance.
                  </p>
                </div>
              )}
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
                <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Or create a new support request</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => setShowNewTicket(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
              <div className="p-5 flex items-center justify-between" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
                <h3 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>New Support Request</h3>
                <button
                  onClick={() => setShowNewTicket(false)}
                  className="p-2 rounded-lg transition-colors hover:bg-gray-100"
                  style={{ color: 'var(--graphite-400)' }}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <form onSubmit={createTicket} className="p-5 space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Subject</label>
                  <input
                    type="text"
                    value={newTicketForm.subject}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What do you need help with?"
                    required
                    className="w-full px-4 py-2.5 rounded-xl text-sm"
                    style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', color: 'var(--graphite-900)' }}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Message</label>
                  <textarea
                    value={newTicketForm.message}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Describe your issue or question in detail..."
                    required
                    rows={4}
                    className="w-full px-4 py-2.5 rounded-xl text-sm resize-none"
                    style={{ background: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', color: 'var(--graphite-900)' }}
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm"
                    style={{ background: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                    className="flex-1 px-4 py-2.5 rounded-xl font-medium text-sm text-white disabled:opacity-50"
                    style={{ background: 'var(--teal-600)' }}
                  >
                    {creatingTicket ? 'Sending...' : 'Send Request'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
