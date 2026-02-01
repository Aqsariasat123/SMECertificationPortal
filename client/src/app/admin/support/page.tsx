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
}

interface Message {
  id: string;
  content: string;
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
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const result = await api.getAdminSupportTickets(statusFilter ? { status: statusFilter } : undefined);
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
      setLoadingMessages(true);
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setSelectedTicket(result.data as TicketDetail);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    } finally {
      setLoadingMessages(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedTicket) return;
    setSending(true);
    try {
      const result = await api.sendSupportMessage(selectedTicket.id, newMessage.trim());
      if (result.success) {
        setNewMessage('');
        fetchTicketMessages(selectedTicket.id);
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleUpdateStatus = async (ticketId: string, newStatus: string) => {
    try {
      const result = await api.updateSupportTicketStatus(ticketId, newStatus as 'open' | 'in_progress' | 'resolved' | 'closed');
      if (result.success) {
        fetchTickets();
        if (selectedTicket?.id === ticketId) {
          fetchTicketMessages(ticketId);
        }
      }
    } catch (error) {
      console.error('Failed to update status:', error);
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; text: string }> = {
      open: { bg: 'var(--warning-100)', text: 'var(--warning-700)' },
      in_progress: { bg: 'var(--teal-100)', text: 'var(--teal-700)' },
      resolved: { bg: 'var(--success-100)', text: 'var(--success-700)' },
      closed: { bg: 'var(--graphite-100)', text: 'var(--graphite-600)' },
    };
    const style = styles[status] || styles.open;
    const label = status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-medium" style={{ backgroundColor: style.bg, color: style.text }}>
        {label}
      </span>
    );
  };

  const formatTime = (dateStr: string) => {
    return new Date(dateStr).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) return 'Today';
    if (date.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatConversationTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  // Filter tickets by search
  const filteredTickets = tickets.filter(t =>
    t.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  (selectedTicket?.messages || []).forEach((msg) => {
    const msgDate = formatDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  return (
    <div className="solid-card flex h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-lg" style={{ borderColor: 'var(--graphite-200)' }}>
      {/* Left Panel - Tickets List */}
      <div className="w-[380px] flex flex-col bg-white" style={{ borderRight: '1px solid var(--graphite-200)' }}>
        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Support Tickets</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tickets or users"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all"
              style={{ backgroundColor: 'var(--graphite-100)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--teal-500)'; }}
              onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex px-3 py-2 gap-1 overflow-x-auto" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
          {[
            { value: '', label: 'All', count: tickets.length },
            { value: 'open', label: 'Open', count: openCount },
            { value: 'in_progress', label: 'In Progress', count: inProgressCount },
            { value: 'resolved', label: 'Resolved', count: tickets.filter(t => t.status === 'resolved').length },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 whitespace-nowrap"
              style={{
                backgroundColor: statusFilter === tab.value ? 'var(--teal-100)' : 'transparent',
                color: statusFilter === tab.value ? 'var(--teal-700)' : 'var(--graphite-600)',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full" style={{
                  backgroundColor: statusFilter === tab.value ? 'var(--teal-500)' : 'var(--graphite-200)',
                  color: statusFilter === tab.value ? 'white' : 'var(--graphite-600)',
                }}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tickets List */}
        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }}></div>
            </div>
          ) : filteredTickets.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32" style={{ color: 'var(--graphite-500)' }}>
              <svg className="w-12 h-12 mb-2" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm">No tickets found</p>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => fetchTicketMessages(ticket.id)}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-all"
                style={{
                  backgroundColor: selectedTicket?.id === ticket.id ? 'var(--teal-50)' : 'transparent',
                  borderLeft: selectedTicket?.id === ticket.id ? '4px solid var(--teal-500)' : '4px solid transparent'
                }}
                onMouseOver={(e) => { if (selectedTicket?.id !== ticket.id) e.currentTarget.style.backgroundColor = 'var(--graphite-50)'; }}
                onMouseOut={(e) => { if (selectedTicket?.id !== ticket.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: ticket.status === 'open' ? 'linear-gradient(to bottom right, var(--warning-400), var(--warning-600))' :
                               ticket.status === 'in_progress' ? 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' :
                               ticket.status === 'resolved' ? 'linear-gradient(to bottom right, var(--success-400), var(--success-600))' :
                               'linear-gradient(to bottom right, var(--graphite-400), var(--graphite-600))'
                  }}>
                    <span className="text-white font-semibold text-lg">
                      {ticket.user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate" style={{ color: 'var(--graphite-900)' }}>{ticket.user.fullName}</h3>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--graphite-500)' }}>
                      {formatConversationTime(ticket.updatedAt)}
                    </span>
                  </div>
                  <p className="text-sm truncate" style={{ color: 'var(--graphite-700)' }}>{ticket.subject}</p>
                  <div className="flex items-center justify-between mt-1">
                    <p className="text-xs truncate pr-2" style={{ color: 'var(--graphite-500)' }}>
                      {ticket.lastMessage?.content || 'No messages yet'}
                    </p>
                    {getStatusBadge(ticket.status)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--graphite-50)' }}>
        {!selectedTicket ? (
          // No ticket selected
          <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--graphite-400)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--graphite-200)' }}>
              <svg className="w-12 h-12" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--graphite-600)' }}>Select a ticket</h3>
            <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Choose a ticket to view and respond</p>
          </div>
        ) : loadingMessages ? (
          <div className="flex-1 flex items-center justify-center">
            <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }}></div>
          </div>
        ) : (
          <>
            {/* Chat Header */}
            <div className="bg-white px-6 py-4" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: selectedTicket.status === 'open' ? 'linear-gradient(to bottom right, var(--warning-400), var(--warning-600))' :
                               selectedTicket.status === 'in_progress' ? 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' :
                               selectedTicket.status === 'resolved' ? 'linear-gradient(to bottom right, var(--success-400), var(--success-600))' :
                               'linear-gradient(to bottom right, var(--graphite-400), var(--graphite-600))'
                  }}>
                    <span className="text-white font-semibold text-lg">
                      {selectedTicket.user.fullName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>{selectedTicket.subject}</h2>
                    <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>
                      {selectedTicket.user.fullName} • {selectedTicket.user.email}
                    </p>
                  </div>
                </div>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  className="px-3 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer"
                  style={{
                    border: '1px solid var(--graphite-200)',
                    backgroundColor: 'white',
                    color: 'var(--graphite-700)',
                    outline: 'none'
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-500)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {groupedMessages.map((group, gi) => (
                <div key={gi}>
                  {/* Date Divider */}
                  <div className="flex justify-center my-6">
                    <span className="bg-white text-xs px-4 py-1.5 rounded-full shadow-sm" style={{ color: 'var(--graphite-500)', border: '1px solid var(--graphite-200)' }}>
                      {group.date}
                    </span>
                  </div>

                  {group.messages.map((msg) => {
                    const isAdmin = msg.sender.role === 'admin';
                    return (
                      <div key={msg.id} className={`flex mb-4 ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                        {/* User Message */}
                        {!isAdmin && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--graphite-400), var(--graphite-600))' }}>
                              <span className="text-white font-semibold text-sm">
                                {msg.sender.fullName?.charAt(0)?.toUpperCase() || 'U'}
                              </span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{msg.sender.fullName}</span>
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                              </div>
                              <div className="rounded-2xl rounded-tl-md px-4 py-2.5 bg-white" style={{ border: '1px solid var(--graphite-200)' }}>
                                <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--graphite-800)' }}>{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Admin Message */}
                        {isAdmin && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>You (Admin)</span>
                              </div>
                              <div className="rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-900)' }}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                              <span className="text-white font-semibold text-sm">A</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            {selectedTicket.status !== 'closed' && (
              <div className="bg-white p-4" style={{ borderTop: '1px solid var(--graphite-200)' }}>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your response..."
                      className="w-full px-4 py-3.5 border-0 rounded-full text-sm transition-all"
                      style={{ backgroundColor: 'var(--graphite-100)', outline: 'none' }}
                      onFocus={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--teal-500)'; }}
                      onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; e.currentTarget.style.boxShadow = 'none'; }}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-3 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--teal-500)' }}
                    onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--teal-600)'; }}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-500)'}
                  >
                    {sending ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
                      </svg>
                    )}
                  </button>
                </form>
              </div>
            )}

            {/* Closed Notice */}
            {selectedTicket.status === 'closed' && (
              <div className="bg-white px-6 py-4 text-center" style={{ borderTop: '1px solid var(--graphite-200)' }}>
                <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                  This ticket has been closed. Change the status to respond.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
