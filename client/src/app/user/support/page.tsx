'use client';

import { useState, useEffect } from 'react';
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

export default function UserSupportPage() {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<TicketDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showNewTicket, setShowNewTicket] = useState(false);
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [newTicketForm, setNewTicketForm] = useState({ subject: '', message: '' });
  const [creatingTicket, setCreatingTicket] = useState(false);

  useEffect(() => {
    fetchTickets();
  }, []);

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
      const result = await api.getSupportTicketMessages(ticketId);
      if (result.success && result.data) {
        setSelectedTicket(result.data as TicketDetail);
        setShowTicketModal(true);
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error);
    }
  };

  const handleSendMessage = async () => {
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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Support</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Get help with your account</p>
        </div>
        <button
          onClick={() => setShowNewTicket(true)}
          className="btn-teal px-4 py-2.5 rounded-lg font-medium text-sm flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          New Request
        </button>
      </div>

      {/* Tickets List */}
      <div className="solid-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--graphite-100)' }}>
              <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p style={{ color: 'var(--graphite-600)' }}>No support requests yet</p>
            <p className="text-sm mt-1" style={{ color: 'var(--graphite-400)' }}>Create a new request to get help</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--graphite-50)' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Subject</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Last Update</th>
                <th className="text-right px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>Action</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: 'var(--graphite-100)' }}>
              {tickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>{ticket.subject}</p>
                    {ticket.lastMessage && (
                      <p className="text-sm mt-1 truncate max-w-xs" style={{ color: 'var(--graphite-500)' }}>
                        {ticket.lastMessage.content}
                      </p>
                    )}
                  </td>
                  <td className="px-6 py-4">{getStatusBadge(ticket.status)}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: 'var(--graphite-500)' }}>{formatDate(ticket.updatedAt)}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => fetchTicketMessages(ticket.id)}
                      className="text-sm font-medium transition-colors"
                      style={{ color: 'var(--teal-600)' }}
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* New Ticket Modal */}
      {showNewTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-md shadow-xl">
            <div className="p-6 border-b" style={{ borderColor: 'var(--graphite-100)' }}>
              <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>New Support Request</h2>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Subject</label>
                <input
                  type="text"
                  value={newTicketForm.subject}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, subject: e.target.value })}
                  className="input-field w-full h-11 px-4 rounded-lg"
                  placeholder="What do you need help with?"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--graphite-700)' }}>Message</label>
                <textarea
                  value={newTicketForm.message}
                  onChange={(e) => setNewTicketForm({ ...newTicketForm, message: e.target.value })}
                  className="input-field w-full px-4 py-3 rounded-lg resize-none"
                  rows={4}
                  placeholder="Describe your issue..."
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--graphite-100)' }}>
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-4 py-2.5 rounded-lg text-sm font-medium"
                style={{ color: 'var(--graphite-600)' }}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                className="btn-teal px-4 py-2.5 rounded-lg text-sm font-medium disabled:opacity-50"
              >
                {creatingTicket ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b flex items-center justify-between" style={{ borderColor: 'var(--graphite-100)' }}>
              <div>
                <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>{selectedTicket.subject}</h2>
                <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>Created {formatDate(selectedTicket.createdAt)}</p>
              </div>
              {getStatusBadge(selectedTicket.status)}
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedTicket.messages.map((msg) => {
                const isSupport = msg.sender.role === 'admin';
                return (
                  <div key={msg.id} className={`flex ${isSupport ? 'justify-start' : 'justify-end'}`}>
                    <div className={`max-w-[75%] rounded-xl px-4 py-3 ${isSupport ? 'bg-gray-100' : ''}`}
                      style={!isSupport ? { backgroundColor: 'var(--teal-50)' } : {}}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--graphite-500)' }}>
                        {isSupport ? 'Support Team' : 'You'}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--graphite-800)' }}>{msg.content}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--graphite-400)' }}>{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedTicket.status !== 'closed' && selectedTicket.status !== 'resolved' && (
              <div className="p-4 border-t" style={{ borderColor: 'var(--graphite-100)' }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="input-field flex-1 h-11 px-4 rounded-lg"
                    placeholder="Type a message..."
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={sending || !newMessage.trim()}
                    className="btn-teal px-4 rounded-lg disabled:opacity-50"
                  >
                    {sending ? '...' : 'Send'}
                  </button>
                </div>
              </div>
            )}
            <div className="p-4 border-t" style={{ borderColor: 'var(--graphite-100)' }}>
              <button
                onClick={() => { setShowTicketModal(false); setSelectedTicket(null); }}
                className="w-full py-2.5 rounded-lg text-sm font-medium"
                style={{ backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
