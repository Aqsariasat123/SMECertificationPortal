'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
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
  attachments: Attachment[];
}

interface OtherParty {
  id: string;
  name: string;
  email: string;
  type: 'sme' | 'user';
}

export default function ChatPage() {
  const params = useParams();
  const requestId = params.requestId as string;

  const [messages, setMessages] = useState<Message[]>([]);
  const [otherParty, setOtherParty] = useState<OtherParty | null>(null);
  const [initialMessage, setInitialMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [uploading, setUploading] = useState(false);

  // Edit/Delete states
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showMessageMenu, setShowMessageMenu] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<string | null>(null);
  const [editContent, setEditContent] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState<Message | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [requestId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowMessageMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const fetchMessages = async () => {
    try {
      const result = await api.getChatMessages(requestId);
      if (result.success && result.data) {
        setMessages(result.data.messages);
        setOtherParty(result.data.otherParty);
        setInitialMessage(result.data.initialMessage);
        setError('');
      }
    } catch (err) {
      if (!loading) setError('Failed to load messages');
    } finally {
      setLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    try {
      setSending(true);
      const result = await api.sendChatMessage(requestId, newMessage.trim());
      if (result.success && result.data) {
        setMessages((prev) => [...prev, result.data]);
        setNewMessage('');
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
    if (!file) return;

    try {
      setUploading(true);
      const result = await api.uploadChatFile(requestId, file);
      if (result.success && result.data) {
        setMessages((prev) => [...prev, result.data]);
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
    if (!editingMessage || !editContent.trim()) return;

    try {
      const result = await api.editChatMessage(requestId, editingMessage, editContent.trim());
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
    if (!showDeleteModal) return;

    try {
      const result = await api.deleteChatMessage(requestId, showDeleteModal.id, forEveryone);
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
    await api.downloadChatFile(requestId, att.id, att.originalName);
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

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const isImageFile = (mimeType: string) => mimeType.startsWith('image/');
  const isVideoFile = (mimeType: string) => mimeType.startsWith('video/');
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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-200px)]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-slate-500">Loading conversation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[calc(100vh-120px)] bg-gradient-to-b from-slate-100 to-slate-50 rounded-2xl overflow-hidden shadow-xl border border-slate-200">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-800 to-slate-900 text-white px-4 sm:px-6 py-4">
        <div className="flex items-center gap-4">
          <Link href="/sme/requests" className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </Link>
          <div className="w-11 h-11 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-lg">{otherParty?.name?.charAt(0)?.toUpperCase() || '?'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-semibold truncate">{otherParty?.name || 'Unknown'}</h2>
            <p className="text-xs text-slate-300 truncate">{otherParty?.email}</p>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-slate-300">Online</span>
          </div>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mx-4 mt-3 bg-red-500 text-white px-4 py-2 rounded-lg text-sm flex items-center gap-2 animate-pulse">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>{error}</span>
          <button onClick={() => setError('')} className="ml-auto hover:bg-white/20 rounded p-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23e2e8f0\' fill-opacity=\'0.4\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")' }}>
        {/* Initial message */}
        {initialMessage && (
          <div className="flex justify-start mb-4">
            <div className="max-w-[80%] sm:max-w-[70%]">
              <div className="bg-white rounded-2xl rounded-tl-md px-4 py-3 shadow-md">
                <p className="text-sm text-slate-700">{initialMessage}</p>
              </div>
              <p className="text-[10px] text-slate-400 mt-1 ml-2">Introduction request</p>
            </div>
          </div>
        )}

        {groupedMessages.map((group, gi) => (
          <div key={gi}>
            <div className="flex justify-center my-4">
              <span className="bg-slate-700/80 text-white text-xs px-4 py-1.5 rounded-full shadow">{group.date}</span>
            </div>

            {group.messages.map((msg) => (
              <div key={msg.id} className={`flex mb-3 ${msg.isOwnMessage ? 'justify-end' : 'justify-start'}`}>
                <div className={`relative max-w-[80%] sm:max-w-[70%] group`}>
                  {/* Message Menu Button */}
                  {msg.isOwnMessage && (
                    <button
                      onClick={() => setShowMessageMenu(showMessageMenu === msg.id ? null : msg.id)}
                      className="absolute -left-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-200 rounded-full"
                    >
                      <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                      </svg>
                    </button>
                  )}

                  {/* Message Menu Dropdown */}
                  {showMessageMenu === msg.id && (
                    <div ref={menuRef} className="absolute left-0 top-0 -translate-x-full -translate-y-2 bg-white rounded-xl shadow-xl border border-slate-200 py-2 min-w-[160px] z-50">
                      {msg.content && !msg.attachments.length && (
                        <button
                          onClick={() => {
                            setEditingMessage(msg.id);
                            setEditContent(msg.content || '');
                            setShowMessageMenu(null);
                          }}
                          className="w-full px-4 py-2 text-left text-sm hover:bg-slate-50 flex items-center gap-3"
                        >
                          <svg className="w-4 h-4 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                        className="w-full px-4 py-2 text-left text-sm hover:bg-red-50 text-red-600 flex items-center gap-3"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Delete
                      </button>
                    </div>
                  )}

                  {/* Edit Mode */}
                  {editingMessage === msg.id ? (
                    <div className="bg-white rounded-2xl px-4 py-3 shadow-lg border-2 border-blue-500">
                      <textarea
                        value={editContent}
                        onChange={(e) => setEditContent(e.target.value)}
                        className="w-full text-sm border-0 focus:ring-0 resize-none"
                        rows={2}
                        autoFocus
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => { setEditingMessage(null); setEditContent(''); }}
                          className="px-3 py-1 text-xs text-slate-600 hover:bg-slate-100 rounded-full"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleEditMessage}
                          className="px-3 py-1 text-xs bg-blue-600 text-white rounded-full hover:bg-blue-700"
                        >
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Message Bubble */}
                      <div className={`rounded-2xl px-4 py-2.5 shadow-md ${
                        msg.isOwnMessage
                          ? 'bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-tr-md'
                          : 'bg-white text-slate-800 rounded-tl-md'
                      }`}>
                        {msg.content && <p className="text-sm whitespace-pre-wrap">{msg.content}</p>}

                        {/* Attachments */}
                        {msg.attachments.map((att) => (
                          <div key={att.id} className="mt-2">
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
                                  msg.isOwnMessage ? 'bg-white/20 hover:bg-white/30' : 'bg-slate-100 hover:bg-slate-200'
                                }`}
                              >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                                  isPdfFile(att.mimeType) ? 'bg-red-500' :
                                  isVideoFile(att.mimeType) ? 'bg-purple-500' : 'bg-blue-500'
                                }`}>
                                  {isPdfFile(att.mimeType) ? (
                                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6z"/>
                                    </svg>
                                  ) : isVideoFile(att.mimeType) ? (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  )}
                                </div>
                                <div className="flex-1 min-w-0 text-left">
                                  <p className={`text-sm font-medium truncate ${msg.isOwnMessage ? 'text-white' : 'text-slate-700'}`}>
                                    {att.originalName}
                                  </p>
                                  <p className={`text-xs ${msg.isOwnMessage ? 'text-blue-100' : 'text-slate-500'}`}>
                                    {formatFileSize(att.fileSize)}
                                  </p>
                                </div>
                                <svg className={`w-5 h-5 ${msg.isOwnMessage ? 'text-white' : 'text-slate-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                              </button>
                            )}
                          </div>
                        ))}
                      </div>

                      {/* Time & Status */}
                      <div className={`flex items-center gap-1.5 mt-1 ${msg.isOwnMessage ? 'justify-end mr-2' : 'ml-2'}`}>
                        {msg.isEdited && <span className="text-[10px] text-slate-400 italic">edited</span>}
                        <span className="text-[10px] text-slate-400">{formatTime(msg.createdAt)}</span>
                        {msg.isOwnMessage && (
                          <svg className={`w-4 h-4 ${msg.isRead ? 'text-blue-500' : 'text-slate-300'}`} fill="currentColor" viewBox="0 0 24 24">
                            <path d="M18 7l-1.41-1.41-6.34 6.34 1.41 1.41L18 7zm4.24-1.41L11.66 16.17 7.48 12l-1.41 1.41L11.66 19l12-12-1.42-1.41zM.41 13.41L6 19l1.41-1.41L1.83 12 .41 13.41z"/>
                          </svg>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Delete Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Delete Message</h3>
            <p className="text-sm text-slate-600 mb-6">How would you like to delete this message?</p>
            <div className="space-y-3">
              {showDeleteModal.isOwnMessage && (
                <button
                  onClick={() => handleDeleteMessage(true)}
                  className="w-full py-3 px-4 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Delete for Everyone
                </button>
              )}
              <button
                onClick={() => handleDeleteMessage(false)}
                className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-medium transition flex items-center justify-center gap-2"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Delete for Me
              </button>
              <button
                onClick={() => setShowDeleteModal(null)}
                className="w-full py-3 px-4 text-slate-500 hover:text-slate-700 font-medium transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Input Area */}
      <div className="bg-white border-t border-slate-200 p-4">
        <form onSubmit={handleSendMessage} className="flex items-end gap-3">
          <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" accept="image/*,video/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.csv,.zip,.rar" />

          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="p-3 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <div className="w-6 h-6 border-2 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
              </svg>
            )}
          </button>

          <div className="flex-1 relative">
            <textarea
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage(e);
                }
              }}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-5 py-3 bg-slate-100 border-0 rounded-full text-sm focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all resize-none"
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>

          <button
            type="submit"
            disabled={!newMessage.trim() || sending}
            className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {sending ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
