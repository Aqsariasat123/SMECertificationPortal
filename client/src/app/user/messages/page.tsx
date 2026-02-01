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

  // Chat state
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherParty, setOtherParty] = useState<OtherParty | null>(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Fetch messages when active chat changes
  useEffect(() => {
    if (activeRequestId) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 5000);
      return () => clearInterval(interval);
    } else {
      setMessages([]);
      setOtherParty(null);
    }
  }, [activeRequestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const result = await api.getChatConversations();
      if (result.success && result.data) {
        setConversations(result.data);
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending || !activeRequestId) return;

    try {
      setSending(true);
      const result = await api.sendChatMessage(activeRequestId, newMessage.trim());
      if (result.success && result.data) {
        setMessages((prev) => [...prev, result.data as Message]);
        setNewMessage('');
        fetchConversations();
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (mimeType: string) => mimeType.startsWith('image/');
  const isPdfFile = (mimeType: string) => mimeType === 'application/pdf';

  // Group messages by date
  const groupedMessages: { date: string; messages: Message[] }[] = [];
  let currentDate = '';
  messages.forEach((msg) => {
    const msgDate = formatDate(msg.createdAt);
    if (msgDate !== currentDate) {
      currentDate = msgDate;
      groupedMessages.push({ date: msgDate, messages: [msg] });
    } else {
      groupedMessages[groupedMessages.length - 1].messages.push(msg);
    }
  });

  const totalUnread = conversations.reduce((sum, c) => sum + (c.unreadCount || 0), 0);

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
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-white">Messages</h1>
                  <p className="text-violet-200">Connect with certified SMEs</p>
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
                <p className="text-3xl font-bold text-white">{conversations.length}</p>
                <p className="text-violet-200 text-sm">Conversations</p>
              </div>
              <div className="px-6 py-4 rounded-2xl bg-white/15 backdrop-blur text-center min-w-[100px]">
                <p className="text-3xl font-bold text-white">{totalUnread}</p>
                <p className="text-violet-200 text-sm">Unread</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm" style={{ height: 'calc(100vh - 340px)', minHeight: '500px' }}>
        <div className="flex h-full">
          {/* Conversations List */}
          <div className="w-[350px] border-r border-gray-100 flex flex-col">
            <div className="p-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-800">Conversations</h2>
            </div>

            <div className="flex-1 overflow-y-auto">
              {loadingConversations ? (
                <div className="flex items-center justify-center h-32">
                  <div className="w-8 h-8 border-3 rounded-full animate-spin" style={{ borderColor: '#E9D5FF', borderTopColor: '#8B5CF6' }} />
                </div>
              ) : conversations.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-6 text-center">
                  <div className="w-16 h-16 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' }}>
                    <svg className="w-8 h-8 text-violet-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <p className="text-gray-500 text-sm">No conversations yet</p>
                  <p className="text-gray-400 text-xs mt-1">Connect with SMEs from the Registry</p>
                </div>
              ) : (
                conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => selectConversation(conv.id)}
                    className={`w-full flex items-center gap-3 px-4 py-4 text-left transition-all hover:bg-violet-50 ${
                      activeRequestId === conv.id ? 'bg-violet-50 border-l-4 border-violet-500' : 'border-l-4 border-transparent'
                    }`}
                  >
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                      <span className="text-white font-semibold text-lg">
                        {conv.recipientName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-semibold text-gray-800 truncate">{conv.recipientName}</h3>
                        <span className="text-xs text-gray-400 flex-shrink-0 ml-2">
                          {formatConversationTime(conv.lastMessageDate)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-gray-500 truncate pr-2">{conv.lastMessage}</p>
                        {conv.unreadCount > 0 && (
                          <span className="flex-shrink-0 w-5 h-5 text-white text-xs font-bold rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                            {conv.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col" style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, #FFFFFF 100%)' }}>
            {!activeRequestId ? (
              <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
                <div className="w-24 h-24 rounded-full flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #EDE9FE 0%, #DDD6FE 100%)' }}>
                  <svg className="w-12 h-12 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-600 mb-1">Select a conversation</h3>
                <p className="text-sm text-gray-400">Choose from your existing conversations</p>
              </div>
            ) : loadingMessages && messages.length === 0 ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="w-10 h-10 border-3 rounded-full animate-spin" style={{ borderColor: '#E9D5FF', borderTopColor: '#8B5CF6' }} />
              </div>
            ) : (
              <>
                {/* Chat Header */}
                <div className="flex-shrink-0 px-6 py-4 bg-white border-b border-gray-100">
                  <div className="flex items-center gap-4">
                    <div className="w-11 h-11 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                      <span className="text-white font-bold text-lg">
                        {otherParty?.name?.charAt(0)?.toUpperCase() || '?'}
                      </span>
                    </div>
                    <div>
                      <h2 className="font-semibold text-gray-800">{otherParty?.name || 'Unknown'}</h2>
                      <p className="text-xs text-gray-500">{otherParty?.email}</p>
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
                  {/* Initial Introduction Message */}
                  {initialMessage && (
                    <div className="flex justify-end mb-6">
                      <div className="max-w-[70%]">
                        <div className="rounded-2xl px-5 py-4 text-white" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                          <p className="text-sm whitespace-pre-wrap">{initialMessage}</p>
                        </div>
                        <p className="text-xs mt-2 text-right text-gray-400">Introduction request</p>
                      </div>
                    </div>
                  )}

                  {groupedMessages.map((group, gi) => (
                    <div key={gi}>
                      {/* Date Divider */}
                      <div className="flex items-center justify-center my-6">
                        <span className="px-4 py-1.5 rounded-full bg-gray-100 text-xs text-gray-500 font-medium">
                          {group.date}
                        </span>
                      </div>

                      {group.messages.map((msg) => (
                        <div key={msg.id} className={`flex mb-4 ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[70%] ${msg.isOwnMessage ? '' : ''}`}>
                            {/* Sender info for received messages */}
                            {!msg.isOwnMessage && (
                              <div className="flex items-center gap-2 mb-2">
                                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' }}>
                                  <span className="text-white text-xs font-semibold">
                                    {msg.senderName?.charAt(0)?.toUpperCase() || '?'}
                                  </span>
                                </div>
                                <span className="text-sm font-semibold text-violet-700">{msg.senderName}</span>
                              </div>
                            )}

                            {msg.isDeletedForEveryone ? (
                              <div className="rounded-2xl px-5 py-4 bg-gray-100 border border-gray-200">
                                <p className="text-sm italic text-gray-500 flex items-center gap-2">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                  </svg>
                                  {msg.isOwnMessage ? 'You deleted this message' : 'This message was deleted'}
                                </p>
                              </div>
                            ) : (
                              <>
                                <div
                                  className={`rounded-2xl px-5 py-4 ${
                                    msg.isOwnMessage
                                      ? 'text-white'
                                      : 'bg-white border border-gray-100 shadow-sm'
                                  }`}
                                  style={msg.isOwnMessage ? { background: 'linear-gradient(135deg, #7C3AED 0%, #8B5CF6 100%)' } : {}}
                                >
                                  {msg.content && <p className={`text-sm whitespace-pre-wrap ${msg.isOwnMessage ? '' : 'text-gray-800'}`}>{msg.content}</p>}

                                  {/* Attachments */}
                                  {msg.attachments.map((att) => (
                                    <div key={att.id} className="mt-3">
                                      {isImageFile(att.mimeType) ? (
                                        <div className="relative">
                                          <img
                                            src={`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001'}${att.filePath}`}
                                            alt={att.originalName}
                                            className="max-w-full rounded-xl cursor-pointer hover:opacity-90 transition"
                                            onClick={() => handleDownloadFile(att)}
                                          />
                                          <button
                                            onClick={() => handleDownloadFile(att)}
                                            className="absolute bottom-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition"
                                          >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                            </svg>
                                          </button>
                                        </div>
                                      ) : (
                                        <button
                                          onClick={() => handleDownloadFile(att)}
                                          className={`flex items-center gap-3 p-3 rounded-xl w-full transition ${
                                            msg.isOwnMessage ? 'bg-white/20 hover:bg-white/30' : 'bg-gray-50 hover:bg-gray-100'
                                          }`}
                                        >
                                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isPdfFile(att.mimeType) ? 'bg-red-500' : 'bg-violet-500'}`}>
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                          </div>
                                          <div className="flex-1 min-w-0 text-left">
                                            <p className={`text-sm font-medium truncate ${msg.isOwnMessage ? 'text-white' : 'text-gray-700'}`}>
                                              {att.originalName}
                                            </p>
                                            <p className={`text-xs ${msg.isOwnMessage ? 'text-white/70' : 'text-gray-500'}`}>
                                              {formatFileSize(att.fileSize)}
                                            </p>
                                          </div>
                                          <svg className={`w-5 h-5 ${msg.isOwnMessage ? 'text-white' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                          </svg>
                                        </button>
                                      )}
                                    </div>
                                  ))}
                                </div>

                                {/* Time */}
                                <p className={`text-xs mt-2 ${msg.isOwnMessage ? 'text-right' : ''} text-gray-400`}>
                                  {msg.isEdited && <span className="italic mr-1">edited</span>}
                                  {formatTime(msg.createdAt)}
                                </p>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>

                {/* Input Area */}
                <div className="flex-shrink-0 bg-white border-t border-gray-100 px-6 py-4">
                  <form onSubmit={handleSendMessage} className="flex gap-3 items-center">
                    <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar" />

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading}
                      className="p-3 rounded-xl transition-colors hover:bg-violet-50 text-gray-500 hover:text-violet-600 disabled:opacity-50"
                    >
                      {uploading ? (
                        <div className="w-5 h-5 border-2 rounded-full animate-spin" style={{ borderColor: '#E9D5FF', borderTopColor: '#8B5CF6' }} />
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
                      placeholder="Type your message..."
                      className="flex-1 px-5 py-3.5 rounded-xl text-sm bg-gray-50 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-400 transition-all"
                    />

                    <button
                      type="submit"
                      disabled={!newMessage.trim() || sending}
                      className="px-6 py-3.5 rounded-xl font-medium text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg"
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
                  </form>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
