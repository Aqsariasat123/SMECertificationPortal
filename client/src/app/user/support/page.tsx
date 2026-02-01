'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
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
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTicketId = searchParams.get('ticket');

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [activeTicket, setActiveTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', message: '', priority: 'medium' });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (activeTicketId) {
      fetchTicketMessages(activeTicketId);
      const interval = setInterval(() => fetchTicketMessages(activeTicketId), 10000);
      return () => clearInterval(interval);
    } else {
      setActiveTicket(null);
    }
  }, [activeTicketId]);

  useEffect(() => {
    scrollToBottom();
  }, [activeTicket?.messages]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      const container = messagesEndRef.current.parentElement;
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
    }
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await api.getSupportTickets();
      if (result.success && result.data) {
        setTickets(result.data as SupportTicket[]);
      }
    } catch (error) {
      console.error('Failed to fetch tickets:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchTicketMessages = async (ticketId: string) => {
    try {
      if (!activeTicket) setLoadingMessages(true);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setActiveTicket(result.data);
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, unreadCount: 0 } : t));
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const selectTicket = (ticketId: string) => {
    router.push(`/user/support?ticket=${ticketId}`);
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !activeTicket) return;

    try {
      setSending(true);
      const result = await api.sendSupportMessage(activeTicket.id, newMessage);
      if (result.success && result.data) {
        setActiveTicket(prev => prev ? {
          ...prev,
          messages: [...prev.messages, result.data as Message],
        } : null);
        setNewMessage('');
        fetchTickets();
      }
    } catch (error) {
      setError('Failed to send message');
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
        selectTicket(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicket(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'open': return { bg: '#FEF3C7', border: '#FCD34D', text: '#92400E', label: 'Awaiting Response' };
      case 'in_progress': return { bg: '#DBEAFE', border: '#93C5FD', text: '#1E40AF', label: 'In Progress' };
      case 'resolved': return { bg: '#D1FAE5', border: '#6EE7B7', text: '#065F46', label: 'Resolved' };
      case 'closed': return { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280', label: 'Closed' };
      default: return { bg: '#F3F4F6', border: '#D1D5DB', text: '#6B7280', label: status };
    }
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' });
  };

  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  (activeTicket?.messages || []).forEach((msg) => {
    const msgDate = formatDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  const totalUnread = tickets.reduce((sum, t) => sum + t.unreadCount, 0);
  const activeTickets = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;

  return (
    <div className="min-h-screen pb-8">
      {/* Header Section - Teal theme */}
      <div className="relative mb-8 rounded-3xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #363c45 0%, #2a2f36 100%)' }}>
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full" />
          <div className="absolute top-1/2 -left-12 w-32 h-32 bg-white/5 rounded-full" />
          <div className="absolute bottom-0 right-1/3 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
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
                  <h1 className="text-2xl font-bold text-white">Support</h1>
                  <p className="text-slate-300">Priority assistance for your investment journey</p>
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
                <p className="text-slate-300 text-sm">Active</p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-center min-w-[100px]">
                <p className="text-3xl font-bold text-white">{tickets.length}</p>
                <p className="text-slate-300 text-sm">Total</p>
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
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium text-sm transition-all hover:shadow-lg"
          style={{ background: 'var(--teal-600)' }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>
      </div>

      {/* Main Content - Two Panel Layout */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm" style={{ height: 'calc(100vh - 380px)', minHeight: '450px' }}>
        <div className="flex h-full">
          {/* Tickets List */}
          <div className="w-[350px] border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-800">Tickets</h3>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }} />
                </div>
              ) : tickets.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--teal-100)' }}>
                    <svg className="w-8 h-8" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No support tickets yet</p>
                  <p className="text-gray-400 text-xs mt-1">Create a new request to get help</p>
                </div>
              ) : (
                tickets.map((ticket) => {
                  const statusConfig = getStatusConfig(ticket.status);
                  return (
                    <button
                      key={ticket.id}
                      onClick={() => selectTicket(ticket.id)}
                      className={`w-full flex items-start gap-3 px-4 py-4 text-left transition-all hover:bg-[var(--teal-50)] ${
                        activeTicketId === ticket.id ? 'bg-[var(--teal-50)] border-l-4' : 'border-l-4 border-transparent'
                      }`}
                      style={{ borderLeftColor: activeTicketId === ticket.id ? 'var(--teal-600)' : 'transparent' }}
                    >
                      <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'var(--teal-600)' }}>
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-gray-800 truncate text-sm">{ticket.subject}</h4>
                          {ticket.unreadCount > 0 && (
                            <span className="flex-shrink-0 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center ml-2" style={{ background: 'var(--teal-600)' }}>
                              {ticket.unreadCount}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 mb-1">
                          <span
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ background: statusConfig.bg, color: statusConfig.text, border: `1px solid ${statusConfig.border}` }}
                          >
                            {statusConfig.label}
                          </span>
                          <span className="text-xs text-gray-400">
                            {formatConversationTime(ticket.updatedAt)}
                          </span>
                        </div>
                        {ticket.lastMessage && (
                          <p className="text-xs text-gray-500 truncate">
                            {ticket.lastMessage.sender.role === 'admin' ? 'Support: ' : 'You: '}
                            {ticket.lastMessage.content}
                          </p>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, var(--teal-50) 0%, #FFFFFF 100%)' }}>
            {!activeTicketId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: 'var(--teal-100)' }}>
                  <svg className="w-12 h-12" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">Select a ticket</h3>
                <p className="text-sm text-gray-400">Choose from your support requests</p>
              </div>
            ) : loadingMessages ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }} />
              </div>
            ) : activeTicket ? (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100">
                  <div className="flex items-center justify-between">
                    <div>
                      <h2 className="font-semibold text-gray-800">{activeTicket.subject}</h2>
                      <div className="flex items-center gap-2 mt-1">
                        <span
                          className="text-xs px-2 py-0.5 rounded-full font-medium"
                          style={{
                            background: getStatusConfig(activeTicket.status).bg,
                            color: getStatusConfig(activeTicket.status).text,
                            border: `1px solid ${getStatusConfig(activeTicket.status).border}`
                          }}
                        >
                          {getStatusConfig(activeTicket.status).label}
                        </span>
                        <span className="text-xs text-gray-400">
                          Created {new Date(activeTicket.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Error */}
                {error && (
                  <div className="mx-4 mt-3 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ background: '#EF4444' }}>
                    <span>{error}</span>
                    <button onClick={() => setError('')} className="ml-auto hover:bg-white/20 rounded p-1">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                )}

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-6 py-6">
                  {groupedMessages.map((group, gi) => (
                    <div key={gi}>
                      {/* Date Divider */}
                      <div className="flex items-center justify-center my-6">
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">
                          {group.date}
                        </span>
                      </div>

                      {group.messages.map((msg) => {
                        const isAdmin = msg.sender.role === 'admin';
                        return (
                          <div key={msg.id} className={`flex mb-4 ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                            <div className="max-w-[70%]">
                              {/* Sender info for admin messages */}
                              {isAdmin && (
                                <div className="flex items-center gap-2 mb-2">
                                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--teal-600)' }}>
                                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                    </svg>
                                  </div>
                                  <span className="text-sm font-semibold" style={{ color: 'var(--teal-600)' }}>Support Team</span>
                                </div>
                              )}

                              <div
                                className={`rounded-2xl px-5 py-4 ${
                                  isAdmin
                                    ? 'bg-white border border-gray-100 shadow-sm'
                                    : 'text-white'
                                }`}
                                style={!isAdmin ? { background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' } : {}}
                              >
                                <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-gray-800' : ''}`}>{msg.content}</p>
                              </div>
                              <p className={`text-xs mt-2 ${isAdmin ? '' : 'text-right'} text-gray-400`}>
                                {formatTime(msg.createdAt)}
                              </p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                {activeTicket.status !== 'closed' && activeTicket.status !== 'resolved' ? (
                  <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-4">
                    <div className="flex gap-3 items-center">
                      <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            sendMessage();
                          }
                        }}
                        placeholder="Type your message..."
                        className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)]/20 focus:border-[var(--teal-500)] transition-all"
                      />
                      <button
                        onClick={sendMessage}
                        disabled={!newMessage.trim() || sending}
                        className="px-6 py-3.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
                        style={{ background: 'var(--teal-600)' }}
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
                ) : (
                  <div className="flex-shrink-0 bg-gray-50 border-t border-gray-100 px-6 py-4 text-center">
                    <p className="text-sm text-gray-500">
                      This ticket has been {activeTicket.status}. Need more help?{' '}
                      <button
                        onClick={() => setShowNewTicket(true)}
                        className="font-medium hover:underline"
                        style={{ color: 'var(--teal-600)' }}
                      >
                        Create a new request
                      </button>
                    </p>
                  </div>
                )}
              </>
            ) : null}
          </div>
        </div>
      </div>

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
              <div className="p-8 text-center" style={{ background: 'var(--teal-600)' }}>
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-white">Contact Support</h3>
                <p className="text-teal-100 mt-2">Our team typically responds within a few hours</p>
              </div>

              <form onSubmit={createTicket} className="p-6 space-y-5">
                {/* Subject */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Subject</label>
                  <input
                    type="text"
                    value={newTicketForm.subject}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, subject: e.target.value }))}
                    placeholder="What do you need help with?"
                    required
                    className="w-full px-4 py-3.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)]/20 focus:border-[var(--teal-500)]"
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
                    className="w-full px-4 py-3.5 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[var(--teal-500)]/20 focus:border-[var(--teal-500)] resize-none"
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
                    style={{ background: 'var(--teal-600)' }}
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
