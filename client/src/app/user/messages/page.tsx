'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { api } from '@/lib/api';

interface Attachment {
  id: string;
  fileName: string;
  originalName: string;
  filePath: string;
  fileSize: number;
  mimeType: string;
}

interface Message {
  id: string;
  content: string | null;
  senderId: string;
  senderName: string;
  isOwnMessage: boolean;
  createdAt: string;
  isRead: boolean;
  isEdited?: boolean;
  editedAt?: string | null;
  isDeletedForEveryone?: boolean;
  attachments: Attachment[];
}

interface Conversation {
  id: string;
  recipientName: string;
  recipientEmail: string;
  lastMessage: string;
  lastMessageDate: string;
  unreadCount: number;
  status: string;
}

interface OtherParty {
  id: string;
  name: string;
  email: string;
  type: 'sme' | 'user';
}

export default function MessagesPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeRequestId = searchParams.get('chat');

  // Conversations state
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'current' | 'archived'>('current');

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherParty, setOtherParty] = useState<OtherParty | null>(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  // Edit/Delete states
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<Message | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showChatSearch, setShowChatSearch] = useState(false);
  const [chatSearchTerm, setChatSearchTerm] = useState('');
  const [favoriteChats, setFavoriteChats] = useState<Set<string>>(new Set());
  const [showDeleteChatModal, setShowDeleteChatModal] = useState(false);
  const [deletingChat, setDeletingChat] = useState(false);
  const [lightboxImage, setLightboxImage] = useState<{ url: string; name: string } | null>(null);
  const chatMenuRef = useRef<HTMLDivElement>(null);
  const chatSearchRef = useRef<HTMLInputElement>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const emojiPickerRef = useRef<HTMLDivElement>(null);
  const isInitialLoadRef = useRef(true);
  const shouldScrollRef = useRef(true);

  // Common emojis for quick access
  const commonEmojis = ['😊', '😂', '❤️', '👍', '🙏', '😍', '🔥', '✨', '🎉', '💪', '👏', '😎', '🤔', '😢', '😮', '👋', '✅', '💡', '📌', '🚀'];

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeRequestId) {
      isInitialLoadRef.current = true; // Reset for new conversation
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
      setOtherParty(null);
    }
    // Reset chat search when changing conversations
    setShowChatSearch(false);
    setChatSearchTerm('');
  }, [activeRequestId]);

  // Focus search input when it opens
  useEffect(() => {
    if (showChatSearch && chatSearchRef.current) {
      chatSearchRef.current.focus();
    }
  }, [showChatSearch]);

  // Scroll to bottom only on initial load or when user sends a message
  useEffect(() => {
    if (isInitialLoadRef.current && messages.length > 0) {
      scrollToBottom(true);
      isInitialLoadRef.current = false;
    } else if (shouldScrollRef.current) {
      scrollToBottom(true);
      shouldScrollRef.current = false;
    }
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMessageMenu(null);
      }
      if (emojiPickerRef.current && !emojiPickerRef.current.contains(e.target as Node)) {
        setShowEmojiPicker(false);
      }
      if (chatMenuRef.current && !chatMenuRef.current.contains(e.target as Node)) {
        setShowChatMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleArchiveChat = async () => {
    if (!activeRequestId) return;
    try {
      // Toggle archive status
      const currentConv = conversations.find(c => c.id === activeRequestId);
      const newStatus = currentConv?.status === 'archived' ? 'accepted' : 'archived';

      // Update local state
      setConversations(prev => prev.map(c =>
        c.id === activeRequestId ? { ...c, status: newStatus } : c
      ));
      setShowChatMenu(false);

      // In production, call API to update status:
      // await api.updateConversationStatus(activeRequestId, newStatus);
    } catch (err) {
      setError('Failed to archive conversation');
    }
  };

  const handleToggleFavorite = () => {
    if (!activeRequestId) return;
    setFavoriteChats(prev => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(activeRequestId)) {
        newFavorites.delete(activeRequestId);
      } else {
        newFavorites.add(activeRequestId);
      }
      return newFavorites;
    });
    setShowChatMenu(false);
    // In production, call API to save favorite status:
    // await api.toggleFavoriteChat(activeRequestId);
  };

  const isChatFavorited = activeRequestId ? favoriteChats.has(activeRequestId) : false;

  const handleDeleteChat = async () => {
    if (!activeRequestId) return;
    try {
      setDeletingChat(true);
      // Call API to delete conversation
      const result = await api.deleteConversation(activeRequestId);
      if (result.success) {
        // Remove from local state
        setConversations(prev => prev.filter(c => c.id !== activeRequestId));
        // Clear active chat and navigate away
        router.push('/user/messages');
        setShowDeleteChatModal(false);
      } else {
        setError(result.message || 'Failed to delete conversation');
      }
    } catch (err) {
      setError('Failed to delete conversation');
    } finally {
      setDeletingChat(false);
    }
  };

  const insertEmoji = (emoji: string) => {
    setNewMessage((prev) => prev + emoji);
    setShowEmojiPicker(false);
  };

  const fetchConversations = async () => {
    try {
      const result = await api.getChatConversations();
      if (result.success && result.data) {
        setConversations(result.data);
      } else {
        console.error('Failed to load conversations:', result.message);
      }
    } catch (err) {
      console.error('Failed to load conversations:', err);
    } finally {
      setLoadingConversations(false);
    }
  };

  const fetchMessages = async () => {
    if (!activeRequestId) return;
    try {
      setLoadingMessages(true);
      const result = await api.getChatMessages(activeRequestId);
      if (result.success && result.data) {
        setMessages(result.data.messages);
        setOtherParty(result.data.otherParty);
        setInitialMessage(result.data.initialMessage);
        setError('');
      }
    } catch (err) {
      setError('Failed to load messages');
    } finally {
      setLoadingMessages(false);
    }
  };

  const scrollToBottom = (instant = false) => {
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: instant ? 'instant' : 'smooth' });
    }, 100);
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !activeRequestId) return;

    try {
      setSending(true);
      const result = await api.sendChatMessage(activeRequestId, newMessage.trim());
      if (result.success && result.data) {
        shouldScrollRef.current = true; // Scroll to bottom after sending
        setMessages((prev) => [...prev, result.data as Message]);
        setNewMessage('');
        fetchConversations(); // Refresh conversation list
      } else {
        setError(result.message || 'Failed to send message');
      }
    } catch (err) {
      setError('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !activeRequestId) return;

    try {
      setUploading(true);
      const result = await api.uploadChatFile(activeRequestId, file);
      if (result.success && result.data) {
        shouldScrollRef.current = true; // Scroll to bottom after upload
        setMessages((prev) => [...prev, result.data as Message]);
        fetchConversations();
      } else {
        setError(result.message || 'Failed to upload file');
      }
    } catch (err) {
      setError('Failed to upload file');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleEditMessage = async () => {
    if (!editingMessage || !editContent.trim() || !activeRequestId) return;

    try {
      const result = await api.editChatMessage(activeRequestId, editingMessage, editContent.trim());
      if (result.success) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === editingMessage
              ? { ...msg, content: editContent.trim(), isEdited: true }
              : msg
          )
        );
        setEditingMessage(null);
        setEditContent('');
      } else {
        setError(result.message || 'Failed to edit message');
      }
    } catch (err) {
      setError('Failed to edit message');
    }
  };

  const handleDeleteMessage = async (forEveryone: boolean) => {
    if (!showDeleteModal || !activeRequestId) return;

    try {
      const result = await api.deleteChatMessage(activeRequestId, showDeleteModal.id, forEveryone);
      if (result.success) {
        setMessages((prev) => prev.filter((msg) => msg.id !== showDeleteModal.id));
        setShowDeleteModal(null);
      } else {
        setError(result.message || 'Failed to delete message');
      }
    } catch (err) {
      setError('Failed to delete message');
    }
  };

  const handleDownloadFile = async (att: Attachment) => {
    if (!activeRequestId) return;
    await api.downloadChatFile(activeRequestId, att.id, att.originalName);
  };

  const selectConversation = (id: string) => {
    router.push(`/user/messages?chat=${id}`);
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
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatConversationTime = (dateString: string) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) {
      return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (mimeType: string) => mimeType.startsWith('image/');
  const isVideoFile = (mimeType: string) => mimeType.startsWith('video/');
  const isPdfFile = (mimeType: string) => mimeType === 'application/pdf';

  const getImageUrl = (filePath: string) => {
    const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001').replace('/api', '');
    return `${baseUrl}${filePath}`;
  };

  const openImageLightbox = (filePath: string, name: string) => {
    setLightboxImage({ url: getImageUrl(filePath), name });
  };

  // Format preview text for conversation list
  const formatPreviewText = (text: string | undefined) => {
    if (!text || text === 'No messages yet') return '📎 Attachment';
    return text;
  };

  // Filter messages by chat search term (must be defined before using)
  const filteredMessages = chatSearchTerm.trim()
    ? messages.filter(msg =>
        msg.content?.toLowerCase().includes(chatSearchTerm.toLowerCase()) ||
        msg.senderName?.toLowerCase().includes(chatSearchTerm.toLowerCase())
      )
    : messages;

  // Get search result count
  const searchResultCount = chatSearchTerm.trim() ? filteredMessages.length : 0;

  // Group messages by date (use filtered messages if searching)
  const messagesToShow = chatSearchTerm.trim() ? filteredMessages : messages;
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  messagesToShow.forEach((msg) => {
    const msgDate = formatDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  // Helper function to highlight search term in text
  const highlightSearchTerm = (text: string) => {
    if (!chatSearchTerm.trim() || !text) return text;
    const regex = new RegExp(`(${chatSearchTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark key={i} style={{ backgroundColor: 'var(--warning-100)', color: 'var(--warning-700)', padding: '0 2px', borderRadius: '2px' }}>{part}</mark>
      ) : part
    );
  };

  // Filter conversations by search and tab
  const filteredConversations = conversations.filter((c) => {
    const matchesSearch = c.recipientName.toLowerCase().includes(searchTerm.toLowerCase());
    const isArchived = c.status === 'archived' || c.status === 'ARCHIVED';
    const matchesTab = activeTab === 'archived' ? isArchived : !isArchived;
    return matchesSearch && matchesTab;
  });

  // Count for tabs - only show unread count (like WhatsApp)
  const currentConversations = conversations.filter(c => c.status !== 'archived' && c.status !== 'ARCHIVED');
  const totalUnreadCount = currentConversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);
  const archivedCount = conversations.filter(c => c.status === 'archived' || c.status === 'ARCHIVED').length;

  return (
    <div className="solid-card flex h-[calc(100vh-120px)] rounded-2xl overflow-hidden shadow-lg" style={{ borderColor: 'var(--graphite-200)' }}>
      {/* Left Panel - Conversations List */}
      <div className="w-[380px] flex flex-col bg-white" style={{ borderRight: '1px solid var(--graphite-200)' }}>
        {/* Header */}
        <div className="p-5" style={{ borderBottom: '1px solid var(--graphite-100)' }}>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-xl font-semibold" style={{ color: 'var(--graphite-900)' }}>Messages</h1>
          </div>

          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-0 rounded-xl text-sm transition-all"
              style={{ backgroundColor: 'var(--graphite-100)', outline: 'none' }}
              onFocus={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--teal-600)'; }}
              onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; e.currentTarget.style.boxShadow = 'none'; }}
            />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
          <button
            onClick={() => setActiveTab('current')}
            className="flex-1 py-3 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === 'current' ? 'var(--graphite-900)' : 'var(--graphite-500)' }}
          >
            Current
            {totalUnreadCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full font-semibold" style={{ backgroundColor: 'var(--teal-600)', color: 'white' }}>
                {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
              </span>
            )}
            {activeTab === 'current' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--graphite-900)' }}></div>
            )}
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className="flex-1 py-3 text-sm font-medium transition-colors relative"
            style={{ color: activeTab === 'archived' ? 'var(--graphite-900)' : 'var(--graphite-500)' }}
          >
            Archived
            {archivedCount > 0 && (
              <span className="ml-2 px-2 py-0.5 text-xs rounded-full" style={{ backgroundColor: 'var(--graphite-200)', color: 'var(--graphite-700)' }}>
                {archivedCount}
              </span>
            )}
            {activeTab === 'archived' && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ backgroundColor: 'var(--graphite-900)' }}></div>
            )}
          </button>
        </div>

        {/* Conversations List */}
        <div className="flex-1 overflow-y-auto">
          {loadingConversations ? (
            <div className="flex items-center justify-center h-32">
              <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: 'var(--teal-200)', borderTopColor: 'var(--teal-600)' }}></div>
            </div>
          ) : filteredConversations.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-32" style={{ color: 'var(--graphite-500)' }}>
              <svg className="w-12 h-12 mb-2" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-sm">No conversations yet</p>
            </div>
          ) : (
            filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => selectConversation(conv.id)}
                className="flex items-center gap-3 px-5 py-4 cursor-pointer transition-all"
                style={{
                  backgroundColor: activeRequestId === conv.id ? 'var(--teal-50)' : 'transparent',
                  borderLeft: activeRequestId === conv.id ? '4px solid var(--teal-600)' : '4px solid transparent'
                }}
                onMouseOver={(e) => { if (activeRequestId !== conv.id) e.currentTarget.style.backgroundColor = 'var(--graphite-50)'; }}
                onMouseOut={(e) => { if (activeRequestId !== conv.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
              >
                {/* Avatar */}
                <div className="relative flex-shrink-0">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                    <span className="text-white font-semibold text-lg">
                      {conv.recipientName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  {/* Online indicator */}
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 border-2 border-white rounded-full" style={{ backgroundColor: 'var(--teal-600)' }}></div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <h3 className="font-semibold truncate" style={{ color: 'var(--graphite-900)' }}>{conv.recipientName}</h3>
                      {favoriteChats.has(conv.id) && (
                        <svg className="w-3.5 h-3.5 flex-shrink-0" style={{ color: 'var(--warning-500)' }} fill="currentColor" viewBox="0 0 24 24">
                          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs flex-shrink-0 ml-2" style={{ color: 'var(--graphite-500)' }}>
                      {formatConversationTime(conv.lastMessageDate)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <p className="text-sm truncate pr-2" style={{ color: 'var(--graphite-500)' }}>{formatPreviewText(conv.lastMessage)}</p>
                    {conv.unreadCount > 0 && (
                      <span className="flex-shrink-0 w-6 h-6 text-white text-xs font-medium rounded-full flex items-center justify-center" style={{ backgroundColor: 'var(--teal-600)' }}>
                        {conv.unreadCount > 99 ? '99+' : conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Right Panel - Chat Area */}
      <div className="flex-1 flex flex-col" style={{ backgroundColor: 'var(--graphite-50)' }}>
        {!activeRequestId ? (
          // No chat selected
          <div className="flex-1 flex flex-col items-center justify-center" style={{ color: 'var(--graphite-400)' }}>
            <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: 'var(--graphite-200)' }}>
              <svg className="w-12 h-12" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium mb-1" style={{ color: 'var(--graphite-600)' }}>Select a conversation</h3>
            <p className="text-sm" style={{ color: 'var(--graphite-400)' }}>Choose from your existing conversations</p>
          </div>
        ) : loadingMessages && messages.length === 0 ? (
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
                    <span className="text-white font-bold text-lg">
                      {otherParty?.name?.charAt(0)?.toUpperCase() || '?'}
                    </span>
                  </div>
                  <div>
                    <h2 className="font-semibold" style={{ color: 'var(--graphite-900)' }}>{otherParty?.name || 'Unknown'}</h2>
                    <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{otherParty?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setShowChatSearch(!showChatSearch)}
                    className="p-2.5 rounded-full transition-colors"
                    style={{ backgroundColor: showChatSearch ? 'var(--teal-100)' : 'transparent', color: showChatSearch ? 'var(--teal-600)' : 'var(--graphite-500)' }}
                    onMouseOver={(e) => { if (!showChatSearch) e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; }}
                    onMouseOut={(e) => { if (!showChatSearch) e.currentTarget.style.backgroundColor = 'transparent'; }}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </button>
                  <div className="relative" ref={chatMenuRef}>
                    <button
                      onClick={() => setShowChatMenu(!showChatMenu)}
                      className="p-2.5 rounded-full transition-colors"
                      style={{ backgroundColor: 'transparent' }}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <svg className="w-5 h-5" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>

                    {/* Chat Menu Dropdown */}
                    {showChatMenu && (
                      <div className="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-xl py-2 min-w-[180px] z-50" style={{ border: '1px solid var(--graphite-200)' }}>
                        <button
                          onClick={handleToggleFavorite}
                          className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3"
                          style={{ color: isChatFavorited ? 'var(--warning-600)' : 'var(--graphite-700)', backgroundColor: 'transparent' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-50)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill={isChatFavorited ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                          </svg>
                          {isChatFavorited ? 'Remove from Favorites' : 'Add to Favorites'}
                        </button>
                        <button
                          onClick={handleArchiveChat}
                          className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3"
                          style={{ color: 'var(--graphite-700)', backgroundColor: 'transparent' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-50)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                          </svg>
                          {conversations.find(c => c.id === activeRequestId)?.status === 'archived' ? 'Unarchive' : 'Archive'} Chat
                        </button>
                        <button
                          onClick={() => { setShowChatMenu(false); }}
                          className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3"
                          style={{ color: 'var(--graphite-700)', backgroundColor: 'transparent' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-50)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.728-2.728" />
                          </svg>
                          Mute Notifications
                        </button>
                        <hr className="my-2" style={{ borderColor: 'var(--graphite-100)' }} />
                        <button
                          onClick={() => { setShowChatMenu(false); setShowDeleteChatModal(true); }}
                          className="w-full px-4 py-2.5 text-left text-sm flex items-center gap-3"
                          style={{ color: 'var(--danger-600)', backgroundColor: 'transparent' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-50)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Delete Chat
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Chat Search Bar */}
            {showChatSearch && (
              <div className="bg-white px-6 py-3" style={{ borderBottom: '1px solid var(--graphite-200)' }}>
                <div className="relative">
                  <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <input
                    ref={chatSearchRef}
                    type="text"
                    placeholder="Search in conversation..."
                    value={chatSearchTerm}
                    onChange={(e) => setChatSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-lg text-sm"
                    style={{ border: '1px solid var(--graphite-200)', outline: 'none' }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = 'var(--teal-600)'; e.currentTarget.style.boxShadow = '0 0 0 2px rgba(74, 143, 135, 0.1)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'var(--graphite-200)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                  {chatSearchTerm && (
                    <button
                      onClick={() => setChatSearchTerm('')}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full transition-colors"
                      style={{ color: 'var(--graphite-400)' }}
                      onMouseOver={(e) => e.currentTarget.style.color = 'var(--graphite-600)'}
                      onMouseOut={(e) => e.currentTarget.style.color = 'var(--graphite-400)'}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
                {chatSearchTerm && (
                  <p className="text-xs mt-2" style={{ color: 'var(--graphite-500)' }}>
                    {searchResultCount} {searchResultCount === 1 ? 'message' : 'messages'} found
                  </p>
                )}
              </div>
            )}

            {/* Error */}
            {error && (
              <div className="mx-4 mt-3 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2" style={{ backgroundColor: 'var(--danger-500)' }}>
                <span>{error}</span>
                <button onClick={() => setError('')} className="ml-auto hover:bg-white/20 rounded p-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              {/* No search results */}
              {chatSearchTerm.trim() && filteredMessages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full" style={{ color: 'var(--graphite-400)' }}>
                  <svg className="w-16 h-16 mb-3" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="font-medium mb-1" style={{ color: 'var(--graphite-600)' }}>No messages found</h3>
                  <p className="text-sm">Try a different search term</p>
                </div>
              )}

              {/* Initial message - Your introduction request (right side) */}
              {initialMessage && !chatSearchTerm.trim() && (
                <div className="flex justify-end mb-6">
                  <div className="flex items-start gap-3 max-w-[70%]">
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>Introduction request</span>
                        <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>You</span>
                      </div>
                      <div className="text-white rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--graphite-800)' }}>
                        <p className="text-sm">{initialMessage}</p>
                      </div>
                    </div>
                    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--graphite-600), var(--graphite-800))' }}>
                      <span className="text-white font-semibold text-sm">Y</span>
                    </div>
                  </div>
                </div>
              )}

              {groupedMessages.map((group, gi) => (
                <div key={gi}>
                  {/* Date Divider */}
                  <div className="flex justify-center my-6">
                    <span className="bg-white text-xs px-4 py-1.5 rounded-full shadow-sm" style={{ color: 'var(--graphite-500)', border: '1px solid var(--graphite-200)' }}>
                      {group.date}
                    </span>
                  </div>

                  {group.messages.map((msg) => (
                    <div key={msg.id} className={`flex mb-4 ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                      {/* Received Message */}
                      {!msg.isOwnMessage && (
                        <div className="flex items-start gap-3 max-w-[70%]">
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--teal-400), var(--teal-600))' }}>
                            <span className="text-white font-semibold text-sm">
                              {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2 mb-1">
                              <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>{msg.senderName}</span>
                              <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                            </div>
                            {msg.isDeletedForEveryone ? (
                              <div className="rounded-2xl rounded-tl-md px-4 py-2.5" style={{ backgroundColor: 'var(--graphite-100)', border: '1px solid var(--graphite-200)' }}>
                                <p className="text-sm italic flex items-center gap-2" style={{ color: 'var(--graphite-500)' }}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  This message was deleted
                                </p>
                              </div>
                            ) : (
                              <>
                                <div className="rounded-2xl rounded-tl-md px-4 py-2.5" style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-900)' }}>
                                  {msg.content && <p className="text-sm whitespace-pre-wrap">{highlightSearchTerm(msg.content)}</p>}
                                  {msg.attachments.map((att) => (
                                    <div key={att.id} className="mt-2">
                                      {isImageFile(att.mimeType) ? (
                                        <img
                                          src={getImageUrl(att.filePath)}
                                          alt={att.originalName}
                                          className="rounded-xl cursor-pointer hover:opacity-90 transition"
                                          style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'cover' }}
                                          onClick={() => openImageLightbox(att.filePath, att.originalName)}
                                        />
                                      ) : (
                                        <button
                                          onClick={() => handleDownloadFile(att)}
                                          className="flex items-center gap-3 p-3 bg-white/50 hover:bg-white/80 rounded-xl w-full transition"
                                        >
                                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isPdfFile(att.mimeType) ? 'var(--danger-500)' : isVideoFile(att.mimeType) ? 'var(--graphite-500)' : 'var(--teal-600)' }}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium truncate" style={{ color: 'var(--graphite-800)' }}>{att.originalName}</p>
                                            <p className="text-xs" style={{ color: 'var(--graphite-500)' }}>{formatFileSize(att.fileSize)}</p>
                                          </div>
                                          <svg className="w-5 h-5" style={{ color: 'var(--graphite-400)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                                {msg.isEdited && <span className="text-[10px] ml-2 italic" style={{ color: 'var(--graphite-400)' }}>edited</span>}
                              </>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Sent Message */}
                      {msg.isOwnMessage && (
                        <div className="flex items-start gap-3 max-w-[70%] group">
                          <div className="flex flex-col items-end">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>{formatTime(msg.createdAt)}</span>
                              <span className="font-medium text-sm" style={{ color: 'var(--graphite-900)' }}>You</span>
                            </div>

                            {/* Edit Mode */}
                            {editingMessage === msg.id ? (
                              <div className="bg-white rounded-2xl px-4 py-3 shadow-lg" style={{ border: '2px solid var(--teal-600)' }}>
                                <textarea
                                  value={editContent}
                                  onChange={(e) => setEditContent(e.target.value)}
                                  className="w-full text-sm border-0 focus:ring-0 resize-none min-w-[200px]"
                                  rows={2}
                                  autoFocus
                                />
                                <div className="flex justify-end gap-2 mt-2">
                                  <button
                                    onClick={() => { setEditingMessage(null); setEditContent(''); }}
                                    className="px-3 py-1 text-xs rounded-full"
                                    style={{ color: 'var(--graphite-600)', backgroundColor: 'transparent' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    onClick={handleEditMessage}
                                    className="px-3 py-1 text-xs text-white rounded-full"
                                    style={{ backgroundColor: 'var(--teal-600)' }}
                                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-700)'}
                                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-600)'}
                                  >
                                    Save
                                  </button>
                                </div>
                              </div>
                            ) : msg.isDeletedForEveryone ? (
                              <div className="rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--graphite-200)', border: '1px solid var(--graphite-300)' }}>
                                <p className="text-sm italic flex items-center gap-2" style={{ color: 'var(--graphite-500)' }}>
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  You deleted this message
                                </p>
                              </div>
                            ) : (
                              <div className="relative">
                                {/* Message Menu Button */}
                                <button
                                  onClick={() => setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id)}
                                  className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded-full"
                                  style={{ backgroundColor: 'transparent' }}
                                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-200)'}
                                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                  <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                  </svg>
                                </button>

                                {/* Message Menu Dropdown */}
                                {showMessageMenu === msg.id && (
                                  <div ref={menuRef} className="absolute right-full top-0 mr-2 bg-white rounded-xl shadow-xl py-2 min-w-[140px] z-50" style={{ border: '1px solid var(--graphite-200)' }}>
                                    {msg.content && !msg.attachments.length && (
                                      <button
                                        onClick={() => {
                                          setEditingMessage(msg.id);
                                          setEditContent(msg.content || '');
                                          setShowMessageMenu(null);
                                        }}
                                        className="w-full px-4 py-2 text-left text-sm flex items-center gap-3"
                                        style={{ backgroundColor: 'transparent' }}
                                        onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-50)'}
                                        onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                      >
                                        <svg className="w-4 h-4" style={{ color: 'var(--graphite-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        Edit
                                      </button>
                                    )}
                                    <button
                                      onClick={() => {
                                        setShowDeleteModal(msg);
                                        setShowMessageMenu(null);
                                      }}
                                      className="w-full px-4 py-2 text-left text-sm flex items-center gap-3"
                                      style={{ color: 'var(--danger-600)', backgroundColor: 'transparent' }}
                                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-50)'}
                                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                      </svg>
                                      Delete
                                    </button>
                                  </div>
                                )}

                                <div className="text-white rounded-2xl rounded-tr-md px-4 py-2.5" style={{ backgroundColor: 'var(--graphite-800)' }}>
                                  {msg.content && <p className="text-sm whitespace-pre-wrap">{highlightSearchTerm(msg.content)}</p>}
                                  {msg.attachments.map((att) => (
                                    <div key={att.id} className="mt-2">
                                      {isImageFile(att.mimeType) ? (
                                        <img
                                          src={getImageUrl(att.filePath)}
                                          alt={att.originalName}
                                          className="rounded-xl cursor-pointer hover:opacity-90 transition"
                                          style={{ maxWidth: '280px', maxHeight: '200px', objectFit: 'cover' }}
                                          onClick={() => openImageLightbox(att.filePath, att.originalName)}
                                        />
                                      ) : (
                                        <button
                                          onClick={() => handleDownloadFile(att)}
                                          className="flex items-center gap-3 p-3 bg-white/10 hover:bg-white/20 rounded-xl w-full transition"
                                        >
                                          <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: isPdfFile(att.mimeType) ? 'var(--danger-500)' : isVideoFile(att.mimeType) ? 'var(--graphite-500)' : 'var(--teal-600)' }}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0 text-left">
                                            <p className="text-sm font-medium text-white truncate">{att.originalName}</p>
                                            <p className="text-xs" style={{ color: 'var(--graphite-300)' }}>{formatFileSize(att.fileSize)}</p>
                                          </div>
                                          <svg className="w-5 h-5" style={{ color: 'var(--graphite-300)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            <div className="flex items-center gap-1.5 mt-1 mr-1">
                              {msg.isEdited && <span className="text-[10px] italic" style={{ color: 'var(--graphite-400)' }}>edited</span>}
                              {/* Double tick - Blue when read, Gray when delivered */}
                              <svg className="w-4 h-4" style={{ color: msg.isRead ? 'var(--teal-600)' : 'var(--graphite-400)' }} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                              </svg>
                            </div>
                          </div>
                          <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--graphite-600), var(--graphite-800))' }}>
                            <span className="text-white font-semibold text-sm">Y</span>
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <div className="bg-white p-4" style={{ borderTop: '1px solid var(--graphite-200)' }}>
              <form onSubmit={handleSendMessage} className="flex items-center gap-3">
                <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar" />

                <div className="flex-1 relative">
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="absolute left-4 top-1/2 -translate-y-1/2 transition-colors"
                    style={{ color: 'var(--graphite-400)' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--graphite-600)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--graphite-400)'}
                  >
                    {uploading ? (
                      <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: 'var(--graphite-300)', borderTopColor: 'var(--graphite-600)' }}></div>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    )}
                  </button>
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage(e);
                      }
                    }}
                    placeholder="Your message..."
                    className="w-full pl-12 pr-4 py-3.5 border-0 rounded-full text-sm transition-all"
                    style={{ backgroundColor: 'var(--graphite-100)', outline: 'none' }}
                    onFocus={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.boxShadow = '0 0 0 2px var(--teal-600)'; }}
                    onBlur={(e) => { e.currentTarget.style.backgroundColor = 'var(--graphite-100)'; e.currentTarget.style.boxShadow = 'none'; }}
                  />
                </div>

                <div className="relative" ref={emojiPickerRef}>
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                    className="p-3 rounded-full transition-colors"
                    style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-600)' }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-200)'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-100)'}
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>
                </div>

                {/* Emoji Picker Popup - Outside overflow container */}
                {showEmojiPicker && (
                  <div
                    ref={emojiPickerRef}
                    className="fixed bottom-20 right-8 bg-white rounded-2xl shadow-xl p-3 z-[100]"
                    style={{ border: '1px solid var(--graphite-200)' }}
                  >
                    <div className="grid grid-cols-5 gap-1">
                      {commonEmojis.map((emoji, index) => (
                        <button
                          key={index}
                          type="button"
                          onClick={() => insertEmoji(emoji)}
                          className="w-10 h-10 text-xl rounded-lg transition-colors flex items-center justify-center"
                          style={{ backgroundColor: 'transparent' }}
                          onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
                          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                        >
                          {emoji}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="p-3 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--teal-100)', color: 'var(--teal-600)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-200)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--teal-100)'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                  </svg>
                </button>

                <button
                  type="submit"
                  disabled={!newMessage.trim() || sending}
                  className="p-3 text-white rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ backgroundColor: 'var(--teal-600)' }}
                  onMouseOver={(e) => { if (!e.currentTarget.disabled) e.currentTarget.style.backgroundColor = 'var(--teal-600)'; }}
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
          </>
        )}
      </div>

      {/* Delete Message Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold mb-2" style={{ color: 'var(--graphite-900)' }}>Delete Message</h3>
            <p className="text-sm mb-6" style={{ color: 'var(--graphite-600)' }}>How would you like to delete this message?</p>
            <div className="space-y-3">
              {showDeleteModal.isOwnMessage && (
                <button
                  onClick={() => handleDeleteMessage(true)}
                  className="w-full py-3 px-4 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                  style={{ backgroundColor: 'var(--danger-500)' }}
                  onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-600)'}
                  onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-500)'}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Delete for Everyone
                </button>
              )}
              <button
                onClick={() => handleDeleteMessage(false)}
                className="w-full py-3 px-4 rounded-xl font-medium transition flex items-center justify-center gap-2"
                style={{ backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-700)' }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-200)'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--graphite-100)'}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Delete for Me
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="w-full py-3 px-4 font-medium transition"
                style={{ color: 'var(--graphite-500)' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--graphite-700)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--graphite-500)'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Chat Confirmation Modal */}
      {showDeleteChatModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ backgroundColor: 'var(--danger-100)' }}>
              <svg className="w-7 h-7" style={{ color: 'var(--danger-500)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center" style={{ color: 'var(--graphite-900)' }}>Delete Conversation?</h3>
            <p className="text-sm mb-6 text-center" style={{ color: 'var(--graphite-600)' }}>
              This will permanently delete this conversation and all its messages. This action cannot be undone.
            </p>
            <div className="space-y-3">
              <button
                onClick={handleDeleteChat}
                disabled={deletingChat}
                className="w-full py-3 px-4 text-white rounded-xl font-medium transition flex items-center justify-center gap-2 disabled:opacity-50"
                style={{ backgroundColor: 'var(--danger-500)' }}
                onMouseOver={(e) => { if (!deletingChat) e.currentTarget.style.backgroundColor = 'var(--danger-600)'; }}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'var(--danger-500)'}
              >
                {deletingChat ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Deleting...
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete Conversation
                  </>
                )}
              </button>
              <button
                onClick={() => setShowDeleteChatModal(false)}
                disabled={deletingChat}
                className="w-full py-3 px-4 font-medium transition"
                style={{ color: 'var(--graphite-500)' }}
                onMouseOver={(e) => e.currentTarget.style.color = 'var(--graphite-700)'}
                onMouseOut={(e) => e.currentTarget.style.color = 'var(--graphite-500)'}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Image Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 bg-black/90 flex items-center justify-center z-[100] p-4"
          onClick={() => setLightboxImage(null)}
        >
          {/* Close button */}
          <button
            onClick={() => setLightboxImage(null)}
            className="absolute top-4 right-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Download button */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              const link = document.createElement('a');
              link.href = lightboxImage.url;
              link.download = lightboxImage.name;
              link.click();
            }}
            className="absolute top-4 left-4 p-2 text-white/70 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center gap-2"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span className="text-sm">Download</span>
          </button>

          {/* Image */}
          <img
            src={lightboxImage.url}
            alt={lightboxImage.name}
            className="max-w-full max-h-full object-contain rounded-lg"
            onClick={(e) => e.stopPropagation()}
          />

          {/* Image name */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/70 text-sm bg-black/50 px-4 py-2 rounded-full">
            {lightboxImage.name}
          </div>
        </div>
      )}
    </div>
  );
}
