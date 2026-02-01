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
  const [searchTerm, setSearchTerm] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTickets();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedTicket?.messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
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

  const handleCreateTicket = async () => {
    if (!newTicketForm.subject.trim() || !newTicketForm.message.trim()) return;
    setCreatingTicket(true);
    try {
      const result = await api.createSupportTicket(newTicketForm.subject, newTicketForm.message);
      if (result.success) {
        setNewTicketForm({ subject: '', message: '' });
        setShowNewTicket(false);
        fetchTickets();
      }
    } catch (error) {
      console.error('Failed to create ticket:', error);
    } finally {
      setCreatingTicket(false);
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
    t.subject.toLowerCase().includes(searchTerm.toLowerCase())
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

  return (
    <div className="solid-card flex h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-lg" style={{ borderColor: 'var(--graphite-200)' }}>
      {/* Left Panel - Tickets List */}
      <div className="w-[380px] flex flex-col bg-white" style={{ borderRight: '1px solid var(--graphite-200)' }}>
        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Support</h1>
            <button
              onClick={() => setShowNewTicket(true)}
              className="p-2 rounded-full transition-colors"
              style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-600)' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-200)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-100)'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tickets"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all"
              style={{ backgroundColor: 'var(--graphite-100)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--teal-500)'; }}
              onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="flex px-5 py-3" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ color: 'var(--graphite-600)' }}>All Tickets</span>
            <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--graphite-200)', color: 'var(--graphite-700)' }}>
              {tickets.length}
            </span>
          </div>
          {openCount > 0 && (
            <div className="flex items-center gap-2 ml-4">
              <span className="text-sm" style={{ color: 'var(--warning-600)' }}>Open</span>
              <span className="px-2 py-0.5 text-xs rounded-full font-medium" style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)' }}>
                {openCount}
              </span>
            </div>
          )}
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
              <p className="text-sm">No support tickets yet</p>
              <button
                onClick={() => setShowNewTicket(true)}
                className="mt-2 text-sm font-medium"
                style={{ color: 'var(--teal-600)' }}
              >
                Create your first ticket
              </button>
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
                {/* Icon */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                    background: ticket.status === 'open' ? 'linear-gradient(to bottom right, var(--warning-400), var(--warning-600))' :
                               ticket.status === 'in_progress' ? 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' :
                               ticket.status === 'resolved' ? 'linear-gradient(to bottom right, var(--success-400), var(--success-600))' :
                               'linear-gradient(to bottom right, var(--graphite-400), var(--graphite-600))'
                  }}>
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="font-semibold truncate" style={{ color: 'var(--graphite-900)' }}>{ticket.subject}</h3>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--graphite-500)' }}>
                      {formatConversationTime(ticket.updatedAt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate pr-2" style={{ color: 'var(--graphite-500)' }}>
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
            <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Choose from your support tickets or create a new one</p>
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
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>{selectedTicket.subject}</h2>
                    <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>Created {formatDate(selectedTicket.createdAt)}</p>
                  </div>
                </div>
                {getStatusBadge(selectedTicket.status)}
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
                    const isSupport = msg.sender.role === 'admin';
                    return (
                      <div key={msg.id} className={`flex mb-4 ${isSupport ? 'justify-start' : 'justify-end'}`}>
                        {/* Support Message */}
                        {isSupport && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                              <span className="text-white font-semibold text-sm">S</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>Support Team</span>
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                              </div>
                              <div className="rounded-2xl rounded-tl-md px-4 py-2.5" style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-900)' }}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* User Message */}
                        {!isSupport && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>You</span>
                              </div>
                              <div className="text-white rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--graphite-800)' }}>
                                <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                              </div>
                            </div>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--graphite-600), var(--graphite-800))' }}>
                              <span className="text-white font-semibold text-sm">Y</span>
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
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="bg-white p-4" style={{ borderTop: '1px solid var(--graphite-200)' }}>
                <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
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

            {/* Closed/Resolved Notice */}
            {(selectedTicket.status === 'closed' || selectedTicket.status === 'resolved') && (
              <div className="bg-white px-6 py-4 text-center" style={{ borderTop: '1px solid var(--graphite-200)' }}>
                <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                  This ticket has been {selectedTicket.status}. Create a new ticket if you need further assistance.
                </p>
              </div>
            )}
          </>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl">
            <div className="p-6 border-b" style={{ borderColor: 'var(--graphite-100)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>New Support Request</h2>
              <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>Describe your issue and we'll get back to you</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="w-full h-11 px-4 rounded-xl text-sm transition-all"
                  style={{ border: '1px solid var(--graphite-200)', outline: 'none' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-500)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(74, 143, 135, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="What do you need help with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Message</label>
                <textarea
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl resize-none text-sm transition-all"
                  style={{ border: '1px solid var(--graphite-200)', outline: 'none' }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-500)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(74, 143, 135, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                  rows={4}
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--graphite-100)' }}>
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ color: 'var(--graphite-600)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--teal-500)' }}
                onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--teal-600)'; }}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-500)'}
              >
                {creatingTicket ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
