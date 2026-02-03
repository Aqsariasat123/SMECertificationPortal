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

export default function UserSupportPage() {
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
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [uploading, setUploading] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isInitialLoadRef = useRef(true);
  const shouldScrollRef = useRef(false);

  useEffect(() => {
    fetchTickets();
  }, []);

  // Scroll to bottom only on initial load or when user sends a message
  useEffect(() => {
    if (selectedTicket?.messages) {
      if (isInitialLoadRef.current) {
        scrollToBottom(true);
        isInitialLoadRef.current = false;
      } else if (shouldScrollRef.current) {
        scrollToBottom(true);
        shouldScrollRef.current = false;
      }
    }
  }, [selectedTicket?.messages]);

  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'instant' : 'smooth' });
    }, 300);
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

  const fetchTicketMessages = async (ticketId: string, isNewTicket = false) => {
    try {
      setLoadingMessages(true);
      if (isNewTicket) {
        isInitialLoadRef.current = true; // Reset for new ticket selection
      }
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
    const messageContent = newMessage.trim();
    setSending(true);
    try {
      const result = await api.sendSupportMessage(selectedTicket.id, messageContent);
      if (result.success) {
        setNewMessage('');
        shouldScrollRef.current = true; // Scroll to bottom after sending
        fetchTicketMessages(selectedTicket.id);
        // Update local ticket list without full refresh (better UX)
        setTickets(prev => prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, updatedAt: new Date().toISOString(), lastMessage: { content: messageContent, createdAt: new Date().toISOString(), sender: { fullName: 'You', role: 'user' } } }
            : t
        ));
      }
    } catch (error) {
      console.error('Failed to send message:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedTicket) return;

    try {
      setUploading(true);
      const result = await api.uploadSupportAttachment(selectedTicket.id, file);
      if (result.success) {
        shouldScrollRef.current = true; // Scroll to bottom after upload
        fetchTicketMessages(selectedTicket.id);
        // Update local ticket list without full refresh (better UX)
        setTickets(prev => prev.map(t =>
          t.id === selectedTicket.id
            ? { ...t, updatedAt: new Date().toISOString(), lastMessage: { content: `📎 ${file.name}`, createdAt: new Date().toISOString(), sender: { fullName: 'You', role: 'user' } } }
            : t
        ));
      } else {
        console.error('Upload failed:', result.message);
        alert(result.message || 'Failed to upload file');
      }
    } catch (error) {
      console.error('Failed to upload file:', error);
      alert('Failed to upload file. Please try again.');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Get static image URL (uploads served directly)
  const getImageUrl = (ticketId: string, fileName: string) => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.replace('/api', '') || 'http://localhost:5001';
    return `${baseUrl}/uploads/support/${ticketId}/${fileName}`;
  };

  // Parse attachment from message content
  const parseAttachment = (content: string) => {
    // New format: [ATTACHMENT]{json}
    if (content.startsWith('[ATTACHMENT]')) {
      try {
        const jsonStr = content.substring('[ATTACHMENT]'.length);
        return JSON.parse(jsonStr);
      } catch {
        return null;
      }
    }
    // Old format: [Attachment: filename]
    const oldMatch = content.match(/^\[Attachment: (.+)\]$/);
    if (oldMatch) {
      const fileName = oldMatch[1];
      const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
      return {
        type: 'attachment',
        fileName: fileName,
        originalName: fileName,
        mimeType: isImage ? 'image/png' : 'application/octet-stream',
        size: 0,
        isOldFormat: true
      };
    }
    return null;
  };

  // Check if attachment is an image
  const isImageAttachment = (attachment: { mimeType?: string; originalName?: string }) => {
    if (attachment.mimeType?.startsWith('image/')) return true;
    if (attachment.originalName && /\.(jpg|jpeg|png|gif|webp)$/i.test(attachment.originalName)) return true;
    return false;
  };

  const openImageLightbox = (url: string, name: string) => {
    setLightboxImage({ url, name });
  };

  // Format preview text for ticket list (hide JSON, show friendly text)
  const formatPreviewText = (content: string | undefined) => {
    if (!content) return 'No messages yet';
    if (content.startsWith('[ATTACHMENT]')) {
      try {
        const json = JSON.parse(content.substring('[ATTACHMENT]'.length));
        return `📎 ${json.originalName || 'Attachment'}`;
      } catch {
        return '📎 Attachment';
      }
    }
    if (content.match(/^\[Attachment: .+\]$/)) {
      return content.replace('[Attachment: ', '📎 ').replace(']', '');
    }
    return content;
  };

  // Handle attachment download
  const handleDownloadAttachment = async (ticketId: string, attachment: { fileName: string; originalName: string }) => {
    await api.downloadSupportAttachment(ticketId, attachment.fileName, attachment.originalName);
  };

  // Format file size
  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
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

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      open: 'var(--warning-500)',
      in_progress: 'var(--teal-500)',
      resolved: 'var(--success-500)',
      closed: 'var(--graphite-500)',
    };
    return colors[status] || colors.open;
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

  // Filter tickets by search and status, sort by latest message
  const filteredTickets = tickets
    .filter(t => {
      const matchesSearch = t.subject.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = !statusFilter || t.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

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
      <div className="w-[350px] flex flex-col bg-white" style={{ borderRight: '1px solid var(--graphite-200)' }}>
        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Support</h1>
            <button
              onClick={() => setShowNewTicket(true)}
              className="p-2.5 rounded-xl transition-colors"
              style={{ backgroundColor: 'var(--teal-600)', color: 'white' }}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-700)'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-600)'}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search tickets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl text-sm transition-all"
              style={{ backgroundColor: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-600)'; e.currentTarget.style.backgroundColor = 'white'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; e.currentTarget.style.backgroundColor = 'var(--graphite-50)'; }}
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex px-4 py-3 gap-2" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
          {[
            { value: '', label: 'All', count: tickets.length },
            { value: 'open', label: 'Open', count: openCount },
            { value: 'in_progress', label: 'In Progress', count: inProgressCount },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setStatusFilter(tab.value)}
              className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all flex items-center gap-2"
              style={{
                backgroundColor: statusFilter === tab.value ? 'var(--teal-600)' : 'var(--graphite-100)',
                color: statusFilter === tab.value ? 'white' : 'var(--graphite-600)',
              }}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className="px-1.5 py-0.5 text-[10px] rounded-full font-semibold" style={{
                  backgroundColor: statusFilter === tab.value ? 'rgba(255,255,255,0.2)' : 'var(--graphite-200)',
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
            <div className="flex flex-col items-center justify-center py-16" style={{ color: 'var(--graphite-500)' }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--graphite-100)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <p className="text-sm font-medium">No tickets found</p>
              <p className="text-xs mt-1" style={{ color: 'var(--graphite-400)' }}>Create a new support request</p>
              <button
                onClick={() => setShowNewTicket(true)}
                className="mt-4 px-4 py-2 rounded-lg text-sm font-medium text-white"
                style={{ backgroundColor: 'var(--teal-600)' }}
              >
                New Ticket
              </button>
            </div>
          ) : (
            filteredTickets.map((ticket) => (
              <div
                key={ticket.id}
                onClick={() => fetchTicketMessages(ticket.id, true)}
                className="flex items-start gap-3 px-4 py-4 cursor-pointer transition-all border-b"
                style={{
                  backgroundColor: selectedTicket?.id === ticket.id ? 'var(--teal-50)' : 'transparent',
                  borderColor: 'var(--graphite-100)',
                  borderLeft: selectedTicket?.id === ticket.id ? '3px solid var(--teal-600)' : '3px solid transparent'
                }}
                onMouseOver={(e) => { if (selectedTicket?.id !== ticket.id) e.currentTarget.style.backgroundColor = 'var(--graphite-50)'; }}
                onMouseOut={(e) => { if (selectedTicket?.id !== ticket.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Avatar - Support Team */}
                <div className="flex-shrink-0 relative">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                    <span className="text-white font-semibold text-lg">S</span>
                  </div>
                  {ticket.status === 'open' && (
                    <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white" style={{ backgroundColor: 'var(--success-500)' }}></div>
                  )}
                </div>

                {/* Content - WhatsApp style */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <h3 className="font-semibold text-sm truncate" style={{ color: 'var(--graphite-900)' }}>Support Team</h3>
                    <span className="text-[11px] flex-shrink-0" style={{ color: 'var(--graphite-400)' }}>
                      {formatConversationTime(ticket.updatedAt)}
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: 'var(--graphite-500)' }}>
                    {formatPreviewText(ticket.lastMessage?.content)}
                  </p>
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
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--graphite-200)' }}>
              <svg className="w-10 h-10" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
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
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                    <span className="text-white font-bold text-lg">S</span>
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>Support Team</h2>
                    <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>{selectedTicket.subject}</p>
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
                    const senderInitial = msg.sender.fullName?.charAt(0)?.toUpperCase() || (isSupport ? 'A' : 'U');
                    const attachment = parseAttachment(msg.content);
                    return (
                      <div key={msg.id} className={`flex mb-4 ${isSupport ? 'justify-start' : 'justify-end'}`}>
                        {/* Support Message */}
                        {isSupport && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--teal-600)' }}>
                              <span className="text-white font-semibold text-sm">{senderInitial}</span>
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{msg.sender.fullName || 'Support'}</span>
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                              </div>
                              {attachment ? (
                                isImageAttachment(attachment) ? (
                                  <div className="rounded-2xl rounded-tl-md overflow-hidden bg-white" style={{ border: '1px solid var(--graphite-200)', maxWidth: '280px' }}>
                                    <div className="relative group">
                                      <img
                                        src={getImageUrl(selectedTicket.id, attachment.fileName)}
                                        alt={attachment.originalName}
                                        className="w-full object-cover cursor-pointer"
                                        style={{ maxHeight: '200px' }}
                                        onClick={() => openImageLightbox(getImageUrl(selectedTicket.id, attachment.fileName), attachment.originalName)}
                                      />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDownloadAttachment(selectedTicket.id, attachment); }}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="px-3 py-2">
                                      <p className="text-xs truncate" style={{ color: 'var(--graphite-500)' }}>{attachment.originalName}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="rounded-2xl rounded-tl-md px-4 py-3 bg-white cursor-pointer hover:bg-gray-50 transition-colors"
                                    style={{ border: '1px solid var(--graphite-200)' }}
                                    onClick={() => handleDownloadAttachment(selectedTicket.id, attachment)}
                                  >
                                    <div className="flex items-center gap-3">
                                      <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--teal-100)' }}>
                                        <svg className="w-5 h-5" style={{ color: 'var(--teal-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium" style={{ color: 'var(--graphite-800)' }}>{attachment.originalName}</p>
                                        <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{formatFileSize(attachment.size)}</p>
                                      </div>
                                      <svg className="w-5 h-5 ml-auto" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                      </svg>
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="rounded-2xl rounded-tl-md px-4 py-2.5 bg-white" style={{ border: '1px solid var(--graphite-200)' }}>
                                  <p className="text-sm whitespace-pre-wrap" style={{ color: 'var(--graphite-800)' }}>{msg.content}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* User Message */}
                        {!isSupport && (
                          <div className="flex items-start gap-3 max-w-[70%]">
                            <div className="flex flex-col items-end">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                                <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{msg.sender.fullName || 'You'}</span>
                              </div>
                              {attachment ? (
                                isImageAttachment(attachment) ? (
                                  <div className="rounded-2xl rounded-tr-md overflow-hidden" style={{ backgroundColor: 'var(--teal-600)', maxWidth: '280px' }}>
                                    <div className="relative group">
                                      <img
                                        src={getImageUrl(selectedTicket.id, attachment.fileName)}
                                        alt={attachment.originalName}
                                        className="w-full object-cover cursor-pointer"
                                        style={{ maxHeight: '200px' }}
                                        onClick={() => openImageLightbox(getImageUrl(selectedTicket.id, attachment.fileName), attachment.originalName)}
                                      />
                                      <button
                                        onClick={(e) => { e.stopPropagation(); handleDownloadAttachment(selectedTicket.id, attachment); }}
                                        className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                      >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                      </button>
                                    </div>
                                    <div className="px-3 py-2">
                                      <p className="text-xs truncate text-white/80">{attachment.originalName}</p>
                                    </div>
                                  </div>
                                ) : (
                                  <div
                                    className="rounded-2xl rounded-tr-md px-4 py-3 cursor-pointer hover:opacity-90 transition-opacity"
                                    style={{ backgroundColor: 'var(--teal-600)' }}
                                    onClick={() => handleDownloadAttachment(selectedTicket.id, attachment)}
                                  >
                                    <div className="flex items-center gap-3 text-white">
                                      <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-white/20">
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                        </svg>
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium">{attachment.originalName}</p>
                                        <p className="text-xs opacity-80">{formatFileSize(attachment.size)}</p>
                                      </div>
                                      <svg className="w-5 h-5 ml-auto opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                      </svg>
                                    </div>
                                  </div>
                                )
                              ) : (
                                <div className="text-white rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--teal-600)' }}>
                                  <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                              )}
                            </div>
                            <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--graphite-700)' }}>
                              <span className="text-white font-semibold text-sm">{senderInitial}</span>
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
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,.pdf,.doc,.docx,.txt" />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="p-3 rounded-xl transition-colors"
                    style={{ backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-500)' }}
                    onMouseOver={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-200)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; }}
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--graphite-300)', borderTopColor: 'var(--graphite-600)' }}></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    )}
                  </button>

                  <div className="flex-1">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type your message..."
                      className="w-full px-4 py-3 rounded-xl text-sm transition-all"
                      style={{ backgroundColor: 'var(--graphite-50)', border: '1px solid var(--graphite-200)', outline: 'none' }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-600)'; e.currentTarget.style.backgroundColor = 'white'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; e.currentTarget.style.backgroundColor = 'var(--graphite-50)'; }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={!newMessage.trim() || sending}
                    className="p-3 text-white rounded-xl transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: 'var(--teal-600)' }}
                    onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--teal-700)'; }}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-600)'}
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
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-600)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; }}
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
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-600)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; }}
                  rows={4}
                  placeholder="Describe your issue in detail..."
                />
              </div>
            </div>
            <div className="p-6 border-t flex justify-end gap-3" style={{ borderColor: 'var(--graphite-100)' }}>
              <button
                onClick={() => setShowNewTicket(false)}
                className="px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                style={{ backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-200)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
              >
                Cancel
              </button>
              <button
                onClick={handleCreateTicket}
                disabled={creatingTicket || !newTicketForm.subject.trim() || !newTicketForm.message.trim()}
                className="px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: 'var(--teal-600)' }}
                onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--teal-700)'; }}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-600)'}
              >
                {creatingTicket ? 'Submitting...' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black flex items-center justify-center z-[100]"
          onClick={() => setLightboxImage(null)}
        >
          {/* Top toolbar - WhatsApp style */}
          <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-4 py-3 bg-gradient-to-b from-black/70 to-transparent">
            {/* Left side - Image name */}
            <div className="text-white text-sm font-medium truncate max-w-[60%]">
              {lightboxImage.name}
            </div>

            {/* Right side - Action buttons */}
            <div className="flex items-center gap-1">
              {/* Download button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  const link = document.createElement('a');
                  link.href = lightboxImage.url;
                  link.download = lightboxImage.name;
                  link.click();
                }}
                className="p-3 text-white hover:bg-white/20 transition-colors rounded-full"
                title="Download"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
              </button>

              {/* Close button */}
              <button
                onClick={() => setLightboxImage(null)}
                className="p-3 text-white hover:bg-white/20 transition-colors rounded-full"
                title="Close"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Image */}
          <img
            src={lightboxImage.url}
            alt={lightboxImage.name}
            className="max-w-full max-h-full object-contain"
            style={{ maxHeight: 'calc(100vh - 100px)' }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}
