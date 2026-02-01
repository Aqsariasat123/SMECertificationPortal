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
  const [expandedTicket, setExpandedTicket] = useState<string | null>(null);
  const [ticketDetails, setTicketDetails] = useState<Record<string, TicketDetail>>({});
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', message: '', category: 'general' });
  const [creatingTicket, setCreatingTicket] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'open' | 'resolved'>('all');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    if (expandedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [ticketDetails[expandedTicket || '']?.messages]);

  // Poll for new messages every 10 seconds
  useEffect(() => {
    if (!expandedTicket) return;
    const interval = setInterval(() => {
      loadTicketDetails(expandedTicket, true);
    }, 10000);
    return () => clearInterval(interval);
  }, [expandedTicket]);

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

  const loadTicketDetails = async (ticketId: string, silent = false) => {
    try {
      if (!silent) setLoadingMessages(ticketId);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setTicketDetails(prev => ({ ...prev, [ticketId]: result.data as TicketDetail }));
        setTickets(prev => prev.map(t => t.id === ticketId ? { ...t, unreadCount: 0 } : t));
      }
    } catch (error) {
      console.error('Failed to fetch ticket messages:', error);
    } finally {
      if (!silent) setLoadingMessages(null);
    }
  };

  const toggleTicket = async (ticketId: string) => {
    if (expandedTicket === ticketId) {
      setExpandedTicket(null);
    } else {
      setExpandedTicket(ticketId);
      if (!ticketDetails[ticketId]) {
        await loadTicketDetails(ticketId);
      }
    }
  };

  const sendMessage = async () => {
    if (!newMessage.trim() || !expandedTicket) return;

    try {
      setSending(true);
      const result = await api.sendSupportMessage(expandedTicket, newMessage);
      if (result.success && result.data) {
        setTicketDetails(prev => ({
          ...prev,
          [expandedTicket]: {
            ...prev[expandedTicket],
            messages: [...prev[expandedTicket].messages, result.data as Message],
          }
        }));
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
        setNewTicketForm({ subject: '', message: '', category: 'general' });
        await fetchTickets();
        // Auto-expand the new ticket
        setExpandedTicket(result.data.id);
        await loadTicketDetails(result.data.id);
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicket(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'open': return { bg: '#FEF3C7', color: '#92400E', icon: '🟡' };
      case 'in_progress': return { bg: '#CCFBF1', color: '#0F766E', icon: '🔵' };
      case 'resolved': return { bg: '#D1FAE5', color: '#065F46', icon: '✅' };
      case 'closed': return { bg: '#F3F4F6', color: '#4B5563', icon: '⚪' };
      default: return { bg: '#F3F4F6', color: '#4B5563', icon: '⚪' };
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
  const openCount = tickets.filter(t => t.status === 'open' || t.status === 'in_progress').length;
  const resolvedCount = tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length;

  const filteredTickets = tickets.filter(ticket => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'open') return ticket.status === 'open' || ticket.status === 'in_progress';
    if (activeFilter === 'resolved') return ticket.status === 'resolved' || ticket.status === 'closed';
    return true;
  });

  const helpTopics = [
    { icon: '📝', title: 'Application Help', desc: 'Questions about your certification application' },
    { icon: '📄', title: 'Document Upload', desc: 'Help with uploading required documents' },
    { icon: '💼', title: 'Profile Setup', desc: 'Assistance with company profile' },
    { icon: '🔐', title: 'Account Issues', desc: 'Login, password, or security concerns' },
  ];

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #F0FDFA 0%, #F8FAFC 100%)' }}>
      {/* Hero Header */}
      <div className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 50%, #2DD4BF 100%)' }}>
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 bg-teal-300/20 rounded-full blur-2xl" />
        </div>
        <div className="relative px-6 py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 backdrop-blur mb-4">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Help Center</h1>
          <p className="text-teal-100 text-lg max-w-md mx-auto">
            Get assistance with your SME certification journey
          </p>
          {totalUnread > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur text-white text-sm font-medium">
              <span className="w-2 h-2 bg-yellow-300 rounded-full animate-pulse" />
              {totalUnread} new {totalUnread === 1 ? 'response' : 'responses'} from support
            </div>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 -mt-6 relative z-10 pb-24">
        {/* Quick Help Topics */}
        <div className="bg-white rounded-2xl shadow-lg shadow-teal-100/50 p-6 mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">How can we help you today?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {helpTopics.map((topic, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setShowNewTicket(true);
                  setNewTicketForm(prev => ({ ...prev, subject: topic.title }));
                }}
                className="p-4 rounded-xl text-left transition-all hover:scale-105 hover:shadow-md"
                style={{ background: 'linear-gradient(135deg, #F0FDFA 0%, #CCFBF1 100%)' }}
              >
                <span className="text-2xl mb-2 block">{topic.icon}</span>
                <p className="font-medium text-gray-800 text-sm">{topic.title}</p>
                <p className="text-xs text-gray-500 mt-0.5">{topic.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Tickets Section */}
        <div className="bg-white rounded-2xl shadow-lg shadow-teal-100/50 overflow-hidden">
          {/* Tickets Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold text-gray-800">Your Support Requests</h2>
                <p className="text-sm text-gray-500">{tickets.length} total requests</p>
              </div>
              {/* Filter Tabs */}
              <div className="flex rounded-xl p-1" style={{ background: '#F0FDFA' }}>
                <button
                  onClick={() => setActiveFilter('all')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'all' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:text-teal-700'
                  }`}
                >
                  All ({tickets.length})
                </button>
                <button
                  onClick={() => setActiveFilter('open')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'open' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:text-teal-700'
                  }`}
                >
                  Open ({openCount})
                </button>
                <button
                  onClick={() => setActiveFilter('resolved')}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeFilter === 'resolved' ? 'bg-teal-600 text-white shadow' : 'text-gray-600 hover:text-teal-700'
                  }`}
                >
                  Resolved ({resolvedCount})
                </button>
              </div>
            </div>
          </div>

          {/* Tickets List - Accordion Style */}
          <div className="divide-y divide-gray-100">
            {loading ? (
              <div className="p-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="animate-pulse mb-4">
                    <div className="h-20 rounded-xl" style={{ background: '#F0FDFA' }} />
                  </div>
                ))}
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="p-12 text-center">
                <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ background: '#F0FDFA' }}>
                  <svg className="w-10 h-10 text-teal-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                  </svg>
                </div>
                <h3 className="font-semibold text-gray-800 mb-1">No support requests</h3>
                <p className="text-gray-500 text-sm">Click the button below to create your first request</p>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const statusStyle = getStatusStyle(ticket.status);
                const isExpanded = expandedTicket === ticket.id;
                const detail = ticketDetails[ticket.id];

                return (
                  <div key={ticket.id} className="transition-all">
                    {/* Ticket Header Row */}
                    <button
                      onClick={() => toggleTicket(ticket.id)}
                      className="w-full p-5 text-left hover:bg-gray-50/50 transition-colors"
                    >
                      <div className="flex items-start gap-4">
                        {/* Status Icon */}
                        <div className="text-2xl">{statusStyle.icon}</div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-800 truncate">{ticket.subject}</h3>
                            {ticket.unreadCount > 0 && (
                              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-teal-500 text-white">
                                {ticket.unreadCount} new
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-xs font-medium"
                              style={{ background: statusStyle.bg, color: statusStyle.color }}
                            >
                              {ticket.status.replace('_', ' ')}
                            </span>
                            <span className="text-gray-400">•</span>
                            <span className="text-gray-500">{formatDate(ticket.updatedAt)}</span>
                          </div>
                          {ticket.lastMessage && (
                            <p className="text-sm text-gray-500 mt-2 truncate">
                              <span className="font-medium">{ticket.lastMessage.sender.role === 'admin' ? 'Support: ' : 'You: '}</span>
                              {ticket.lastMessage.content}
                            </p>
                          )}
                        </div>

                        {/* Expand Arrow */}
                        <svg
                          className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </div>
                    </button>

                    {/* Expanded Chat Area */}
                    {isExpanded && (
                      <div className="border-t border-gray-100" style={{ background: '#F8FAFB' }}>
                        {loadingMessages === ticket.id ? (
                          <div className="p-8 flex items-center justify-center">
                            <div className="w-8 h-8 border-2 rounded-full animate-spin" style={{ borderColor: '#E5E7EB', borderTopColor: '#0D9488' }} />
                          </div>
                        ) : detail ? (
                          <>
                            {/* Messages */}
                            <div className="p-5 space-y-4 max-h-80 overflow-y-auto">
                              {detail.messages.map((message) => {
                                const isAdmin = message.sender.role === 'admin';
                                return (
                                  <div key={message.id} className={`flex ${isAdmin ? 'justify-start' : 'justify-end'}`}>
                                    <div
                                      className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                        isAdmin
                                          ? 'bg-white shadow-sm border border-gray-100'
                                          : 'bg-teal-600 text-white'
                                      }`}
                                    >
                                      {isAdmin && (
                                        <div className="flex items-center gap-2 mb-1">
                                          <div className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center">
                                            <svg className="w-3 h-3 text-teal-600" fill="currentColor" viewBox="0 0 20 20">
                                              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
                                            </svg>
                                          </div>
                                          <span className="text-xs font-semibold text-teal-600">Support Team</span>
                                        </div>
                                      )}
                                      <p className={`text-sm whitespace-pre-wrap ${isAdmin ? 'text-gray-800' : ''}`}>{message.content}</p>
                                      <p className={`text-xs mt-1.5 ${isAdmin ? 'text-gray-400' : 'text-teal-100'}`}>
                                        {formatDate(message.createdAt)}
                                      </p>
                                    </div>
                                  </div>
                                );
                              })}
                              <div ref={messagesEndRef} />
                            </div>

                            {/* Reply Input */}
                            {detail.status !== 'closed' && detail.status !== 'resolved' ? (
                              <div className="p-4 bg-white border-t border-gray-100">
                                <div className="flex gap-3">
                                  <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
                                    placeholder="Type your reply..."
                                    className="flex-1 px-4 py-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                                  />
                                  <button
                                    onClick={sendMessage}
                                    disabled={sending || !newMessage.trim()}
                                    className="px-6 py-3 rounded-xl font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                  >
                                    {sending ? (
                                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                      </svg>
                                    )}
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="p-4 bg-gray-50 border-t border-gray-100 text-center">
                                <p className="text-sm text-gray-500">
                                  This request has been {detail.status}. Create a new request if you need further help.
                                </p>
                              </div>
                            )}
                          </>
                        ) : null}
                      </div>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Floating New Request Button */}
      <button
        onClick={() => setShowNewTicket(true)}
        className="fixed bottom-6 right-6 flex items-center gap-2 px-6 py-4 rounded-full text-white font-semibold shadow-lg shadow-teal-500/30 transition-all hover:scale-105 hover:shadow-xl"
        style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' }}
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
        </svg>
        New Request
      </button>

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
              <div className="p-6 text-center" style={{ background: 'linear-gradient(135deg, #0D9488 0%, #14B8A6 100%)' }}>
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-white/20 backdrop-blur mb-3">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white">Create Support Request</h3>
                <p className="text-teal-100 text-sm mt-1">We typically respond within 24 hours</p>
              </div>

              <form onSubmit={createTicket} className="p-6 space-y-5">
                {/* Category Selection */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                  <div className="grid grid-cols-2 gap-2">
                    {[
                      { value: 'general', label: 'General', icon: '💬' },
                      { value: 'application', label: 'Application', icon: '📝' },
                      { value: 'documents', label: 'Documents', icon: '📄' },
                      { value: 'technical', label: 'Technical', icon: '🔧' },
                    ].map((cat) => (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setNewTicketForm(prev => ({ ...prev, category: cat.value }))}
                        className={`p-3 rounded-xl text-left transition-all border-2 ${
                          newTicketForm.category === cat.value
                            ? 'border-teal-500 bg-teal-50'
                            : 'border-gray-100 hover:border-gray-200'
                        }`}
                      >
                        <span className="text-lg">{cat.icon}</span>
                        <p className={`text-sm font-medium mt-1 ${
                          newTicketForm.category === cat.value ? 'text-teal-700' : 'text-gray-700'
                        }`}>{cat.label}</p>
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
                    placeholder="Brief description of your issue"
                    required
                    className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>

                {/* Message */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Message</label>
                  <textarea
                    value={newTicketForm.message}
                    onChange={(e) => setNewTicketForm(prev => ({ ...prev, message: e.target.value }))}
                    placeholder="Please describe your issue in detail. Include any relevant information that might help us assist you better."
                    required
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl text-sm border border-gray-200 focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 resize-none"
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowNewTicket(false)}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                    className="flex-1 px-4 py-3 rounded-xl font-medium text-sm text-white bg-teal-600 hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {creatingTicket ? (
                      <span className="flex items-center justify-center gap-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Sending...
                      </span>
                    ) : (
                      'Send Request'
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
