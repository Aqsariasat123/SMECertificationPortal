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

export default function InvestorSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [openChat, setOpenChat] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (openChat) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [openChat?.messages]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!openChat) return;
    const interval = setInterval(() => {
      refreshChat(openChat.id);
    }, 10000);
    return () => clearInterval(interval);
  }, [openChat?.id]);

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

  const openTicketChat = async (ticketId: string) => {
    try {
      setLoadingChat(true);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setOpenChat(result.data);
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, unreadCount: 0 } : t));
      }
    } catch (error) {
      console.error('Failed to fetch ticket messages:', error);
    } finally {
      setLoadingChat(false);
    }
  };

  const refreshChat = async (ticketId: string) => {
    try {
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setOpenChat(result.data);
      }
    } catch (error) {
      console.error('Failed to refresh chat:', error);
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !openChat) return;

    try {
      setSending(true);
      const result = await api.sendSupportMessage(openChat.id, newMessage);
      if (result.success && result.data) {
        setOpenChat(prev => prev ? {
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
        setNewTicketForm({ subject: '', message: '', priority: 'medium' });
        await fetchTickets();
        openTicketChat(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicket(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { bg: 'bg-amber-50', border: 'border-amber-200', text: 'text-amber-700', label: 'Awaiting Response' };
      case 'in_progress': return { bg: 'bg-violet-50', border: 'border-violet-200', text: 'text-violet-700', label: 'In Progress' };
      case 'resolved': return { bg: 'bg-emerald-50', border: 'border-emerald-200', text: 'text-emerald-700', label: 'Resolved' };
      case 'closed': return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', label: 'Closed' };
      default: return { bg: 'bg-gray-50', border: 'border-gray-200', text: 'text-gray-500', label: status };
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const formatRelative = (dateString: string) => {
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
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedTickets = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  return (
    <div className="min-h-screen pb-8">
      {/* Header Section */}
      <div className="relative mb-8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 50%, #A78BFA 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 -left-12 w-32 h-32 bg-violet-400/20 rounded-full" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-purple-300/10 rounded-full blur-2xl" />
        </div>

        <div className="relative px-8 py-10">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur flex items-center justify-center">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Investor Support</h1>
                  <p className="text-violet-200">Priority assistance for your investment journey</p>
                </div>
              </div>

              {totalUnread > 0 && (
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur">
                  <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">{totalUnread} unread {totalUnread === 1 ? 'message' : 'messages'}</span>
                </div>
              )}
            </div>

            {/* Stats Cards */}
            <div className="flex gap-4">
              <div className="px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-center min-w-[100px]">
                <p className="text-3xl font-bold text-white">{activeTickets}</p>
                <p className="text-violet-200 text-sm">Active</p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-center min-w-[100px]">
                <p className="text-3xl font-bold text-white">{resolvedTickets}</p>
                <p className="text-violet-200 text-sm">Resolved</p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-center min-w-[100px]">
                <p className="text-3xl font-bold text-white">{tickets.length}</p>
                <p className="text-violet-200 text-sm">Total</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-800">Support Requests</h2>
        <button
          onClick={() => setShowNewTicket(true)}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-lg hover:shadow-violet-500/25"
          style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>
      </div>

      {/* Tickets Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="animate-pulse bg-white rounded-2xl p-6 border border-gray-100">
              <div className="h-4 w-3/4 bg-gray-100 rounded mb-3" />
              <div className="h-3 w-1/2 bg-gray-100 rounded mb-4" />
              <div className="h-8 w-24 bg-gray-100 rounded" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="bg-white rounded-3xl border border-gray-100 p-16 text-center">
          <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6" style={{ background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' }}>
            <svg className="w-12 h-12 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Support Requests Yet</h3>
          <p className="text-gray-500 mb-6 max-w-md mx-auto">
            Need help with your investments or account? Our dedicated support team is here to assist you.
          </p>
          <button
            onClick={() => setShowNewTicket(true)}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:shadow-lg"
            style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Your First Request
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tickets.map((ticket) => {
            const statusConfig = getStatusConfig(ticket.status);
            return (
              <button
                key={ticket.id}
                onClick={() => openTicketChat(ticket.id)}
                className="bg-white rounded-2xl p-6 border border-gray-100 text-left transition-all hover:shadow-lg hover:shadow-violet-100 hover:border-violet-200 group"
              >
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold text-gray-800 truncate group-hover:text-violet-700 transition-colors">
                        {ticket.subject}
                      </h3>
                      {ticket.unreadCount > 0 && (
                        <span className="flex-shrink-0 px-2 py-0.5 rounded-full text-xs font-bold bg-violet-600 text-white">
                          {ticket.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{formatRelative(ticket.updatedAt)}</p>
                  </div>
                  <span className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-medium border ${statusConfig.bg} ${statusConfig.border} ${statusConfig.text}`}>
                    {statusConfig.label}
                  </span>
                </div>

                {ticket.lastMessage && (
                  <div className="p-3 rounded-xl bg-gray-50 mb-4">
                    <p className="text-sm text-gray-600 line-clamp-2">
                      <span className="font-medium text-gray-700">
                        {ticket.lastMessage.sender.role === 'admin' ? 'Support: ' : 'You: '}
                      </span>
                      {ticket.lastMessage.content}
                    </p>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-400">
                    Created {formatDate(ticket.createdAt)}
                  </span>
                  <span className="text-sm font-medium text-violet-600 group-hover:text-violet-700 flex items-center gap-1">
                    View Conversation
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Full Screen Chat Modal */}
      {(openChat || loadingChat) && (
        <div className="fixed inset-0 z-50 flex flex-col" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)' }}>
          {/* Chat Header */}
          <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100 shadow-sm">
            <div className="max-w-4xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setOpenChat(null)}
                  className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                {openChat && (
                  <div>
                    <h2 className="font-semibold text-gray-800">{openChat.subject}</h2>
                    <div className="flex items-center gap-2 text-sm">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusConfig(openChat.status).bg} ${getStatusConfig(openChat.status).text}`}>
                        {getStatusConfig(openChat.status).label}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-gray-500">Created {formatDate(openChat.createdAt)}</span>
                    </div>
                  </div>
                )}
              </div>
              <button
                onClick={() => setOpenChat(null)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors text-gray-500"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-6 py-6">
              {loadingChat ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: '#E9D5FF', borderTopColor: '#8B5CF6' }} />
                </div>
              ) : openChat ? (
                <div className="space-y-6">
                  {openChat.messages.map((message, idx) => {
                    const isAdmin = message.sender.role === 'admin';
                    const showDate = idx === 0 ||
                      new Date(message.createdAt).toDateString() !== new Date(openChat.messages[idx - 1].createdAt).toDateString();

                    return (
                      <div key={message.id}>
                        {showDate && (
                          <div className="flex items-center justify-center my-6">
                            <span className="px-4 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">
                              {new Date(message.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
                            </span>
                          </div>
                        )}
                        <div className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                          <div className={`max-w-[70%] ${isAdmin ? 'order-2' : 'order-1'}`}>
                            {isAdmin && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                  </svg>
                                </div>
                                <span className="text-sm font-semibold text-violet-700">Support Team</span>
                              </div>
                            )}
                            <div
                              className={`rounded-2xl px-5 py-4 ${
                                isAdmin
                                  ? 'bg-white border border-gray-100 shadow-sm'
                                  : 'text-white'
                              }`}
                              style={!isAdmin ? { background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' } : {}}
                            >
                              <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-gray-800' : ''}`}>{message.content}</p>
                            </div>
                            <p className={`text-xs mt-2 ${isAdmin ? 'text-gray-400' : 'text-right text-gray-400'}`}>
                              {new Date(message.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              ) : null}
            </div>
          </div>

          {/* Input Area */}
          {openChat && openChat.status !== 'closed' && openChat.status !== 'resolved' && (
            <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-4">
              <div className="max-w-4xl mx-auto">
                <div className="flex gap-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                    placeholder="Type your message..."
                    className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="px-8 py-3.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <span className="flex items-center gap-2">
                        Send
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

          {openChat && (openChat.status === 'closed' || openChat.status === 'resolved') && (
            <div className="flex-shrink-0 bg-gray-50 border-t border-gray-100 px-6 py-4 text-center">
              <p className="text-sm text-gray-500">
                This conversation has been {openChat.status}. Need more help?{' '}
                <button
                  onClick={() => { setOpenChat(null); setShowNewTicket(true); }}
                  className="text-violet-600 font-medium hover:underline"
                >
                  Create a new request
                </button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* New Ticket Modal */}
      {showNewTicket && (
        <>
          <div
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowNewTicket(false)}
          />
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden">
              {/* Modal Header */}
              <div className="p-8 text-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Contact Support</h3>
                <p className="text-violet-200 mt-2">Our team typically responds within a few hours</p>
              </div>

              <form onSubmit={createTicket} className="p-6 space-y-5">
                {/* Priority Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">Priority Level</label>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { value: 'low', label: 'Low', desc: 'General question', color: 'gray' },
                      { value: 'medium', label: 'Medium', desc: 'Need assistance', color: 'violet' },
                      { value: 'high', label: 'High', desc: 'Urgent matter', color: 'red' },
                    ].map((p) => (
                      <button
                        key={p.value}
                        type="button"
                        onClick={() => setNewTicketForm(prev => ({ ...prev, priority: p.value }))}
                        className={`p-3 rounded-xl text-center transition-all border-2 ${
                          newTicketForm.priority === p.value
                            ? p.color === 'violet'
                              ? 'border-violet-500 bg-violet-50'
                              : p.color === 'red'
                                ? 'border-red-500 bg-red-50'
                                : 'border-gray-500 bg-gray-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <p className={`text-sm font-semibold ${
                          newTicketForm.priority === p.value
                            ? p.color === 'violet' ? 'text-violet-700' : p.color === 'red' ? 'text-red-700' : 'text-gray-700'
                            : 'text-gray-700'
                        }`}>{p.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{p.desc}</p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newTicketForm.subject}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What do you need help with?"
                    required
                    className="w-full px-4 py-3.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newTicketForm.message}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Please provide details about your issue or question..."
                    required
                    rows={4}
                    className="w-full px-4 py-3.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-3.5 rounded-xl font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                    className="flex-1 px-4 py-3.5 rounded-xl font-medium text-sm text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                    style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}
                  >
                    {creatingTicket ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Submit Request'
                    )}
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
