'use client';

import { useState, useEffect } from 'react';
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
  const [sending, setSending] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('');

  useEffect(() => {
    fetchTickets();
  }, [statusFilter]);

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

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const openCount = tickets.filter(t => t.status === 'open').length;
  const inProgressCount = tickets.filter(t => t.status === 'in_progress').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>Support Tickets</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--foreground-muted)' }}>Manage user support requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="solid-card rounded-xl p-4">
          <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>Total</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--graphite-900)' }}>{tickets.length}</p>
        </div>
        <div className="solid-card rounded-xl p-4">
          <p className="text-sm" style={{ color: 'var(--warning-600)' }}>Open</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--warning-600)' }}>{openCount}</p>
        </div>
        <div className="solid-card rounded-xl p-4">
          <p className="text-sm" style={{ color: 'var(--teal-600)' }}>In Progress</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--teal-600)' }}>{inProgressCount}</p>
        </div>
        <div className="solid-card rounded-xl p-4">
          <p className="text-sm" style={{ color: 'var(--success-600)' }}>Resolved</p>
          <p className="text-2xl font-bold mt-1" style={{ color: 'var(--success-600)' }}>{tickets.filter(t => t.status === 'resolved').length}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['', 'open', 'in_progress', 'resolved', 'closed'].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className="px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{
              backgroundColor: statusFilter === status ? 'var(--teal-600)' : 'var(--graphite-100)',
              color: statusFilter === status ? 'white' : 'var(--graphite-600)',
            }}
          >
            {status === '' ? 'All' : status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
          </button>
        ))}
      </div>

      {/* Tickets List */}
      <div className="solid-card rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }} />
          </div>
        ) : tickets.length === 0 ? (
          <div className="text-center py-16">
            <p style={{ color: 'var(--graphite-600)' }}>No tickets found</p>
          </div>
        ) : (
          <table className="w-full">
            <thead>
              <tr style={{ backgroundColor: 'var(--graphite-50)' }}>
                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--graphite-500)' }}>User</th>
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
                    <p className="font-medium" style={{ color: 'var(--graphite-900)' }}>{ticket.user.fullName}</p>
                    <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{ticket.user.email}</p>
                  </td>
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

      {/* Ticket Detail Modal */}
      {showTicketModal && selectedTicket && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-xl max-h-[80vh] flex flex-col">
            <div className="p-6 border-b" style={{ borderColor: 'var(--graphite-100)' }}>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-lg font-semibold" style={{ color: 'var(--graphite-900)' }}>{selectedTicket.subject}</h2>
                  <p className="text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>
                    {selectedTicket.user.fullName} • {selectedTicket.user.email}
                  </p>
                </div>
                <select
                  value={selectedTicket.status}
                  onChange={(e) => handleUpdateStatus(selectedTicket.id, e.target.value)}
                  className="px-3 py-1.5 rounded-lg text-sm border"
                  style={{ borderColor: 'var(--graphite-200)' }}
                >
                  <option value="open">Open</option>
                  <option value="in_progress">In Progress</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {selectedTicket.messages.map((msg) => {
                const isAdmin = msg.sender.role === 'admin';
                return (
                  <div key={msg.id} className={`flex ${isAdmin ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[75%] rounded-xl px-4 py-3 ${!isAdmin ? 'bg-gray-100' : ''}`}
                      style={isAdmin ? { backgroundColor: 'var(--teal-50)' } : {}}
                    >
                      <p className="text-xs font-medium mb-1" style={{ color: 'var(--graphite-500)' }}>
                        {isAdmin ? 'You (Admin)' : msg.sender.fullName}
                      </p>
                      <p className="text-sm" style={{ color: 'var(--graphite-800)' }}>{msg.content}</p>
                      <p className="text-xs mt-1" style={{ color: 'var(--graphite-400)' }}>{formatDate(msg.createdAt)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            {selectedTicket.status !== 'closed' && (
              <div className="p-4 border-t" style={{ borderColor: 'var(--graphite-100)' }}>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSendMessage()}
                    className="input-field flex-1 h-11 px-4 rounded-lg"
                    placeholder="Type a response..."
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
