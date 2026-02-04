import {
  ApiResponse,
  AuthResponse,
  LoginCredentials,
  ForgotPasswordData,
  ResetPasswordData,
  RegisterData,
  User,
  SMEProfileData,
  SMEProfileUpdateData,
  AdminUser,
  AdminApplication,
  AdminDashboardStats,
  AuditLogEntry,
  PaginationData,
  ReviewAction,
  RegistrySME,
  RegistrySMEDetail,
  IntroductionRequest,
  AdminIntroductionRequest,
  KycApplication,
} from '@/types';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

class ApiClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private getToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getToken();

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...((options.headers as Record<string, string>) || {}),
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'An error occurred',
          errors: data.errors,
        };
      }

      return data;
    } catch (error) {
      console.error('API request failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Auth endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async logout(): Promise<ApiResponse> {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async forgotPassword(data: ForgotPasswordData): Promise<ApiResponse> {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async resetPassword(data: ResetPasswordData): Promise<ApiResponse> {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async verifyEmail(token: string): Promise<ApiResponse> {
    return this.request(`/auth/verify/${token}`, {
      method: 'GET',
    });
  }

  async resendVerification(email: string): Promise<ApiResponse> {
    return this.request('/auth/resend-verification', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async getMe(): Promise<ApiResponse<User>> {
    return this.request<User>('/auth/me', {
      method: 'GET',
    });
  }

  async register(data: RegisterData): Promise<ApiResponse<AuthResponse>> {
    return this.request<AuthResponse>('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // User profile endpoints
  async updateProfile(data: { firstName: string; lastName: string; phoneNumber?: string; organization?: string }): Promise<ApiResponse<User>> {
    return this.request<User>('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async changePassword(data: { currentPassword: string; newPassword: string }): Promise<ApiResponse> {
    return this.request('/user/change-password', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async deleteAccount(password: string): Promise<ApiResponse> {
    return this.request('/user/account', {
      method: 'DELETE',
      body: JSON.stringify({ password }),
    });
  }

  async uploadProfilePicture(file: File): Promise<ApiResponse<{ profilePicture: string }>> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch(`${this.baseUrl}/user/profile-picture`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async removeProfilePicture(): Promise<ApiResponse> {
    return this.request('/user/profile-picture', {
      method: 'DELETE',
    });
  }

  // User profile (investor) endpoints
  async getUserProfile(): Promise<ApiResponse<Record<string, unknown>>> {
    return this.request('/user/profile', {
      method: 'GET',
    });
  }

  // Investor KYC endpoints
  async setInvestorType(investorType: 'individual' | 'company'): Promise<ApiResponse> {
    return this.request('/user/investor-type', {
      method: 'PUT',
      body: JSON.stringify({ investorType }),
    });
  }

  async submitKyc(kycData: Record<string, unknown>): Promise<ApiResponse> {
    return this.request('/user/kyc', {
      method: 'PUT',
      body: JSON.stringify(kycData),
    });
  }

  async uploadKycDocument(file: File, documentType: string): Promise<ApiResponse> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    try {
      const response = await fetch(`${this.baseUrl}/user/kyc/documents`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async removeKycDocument(documentType: string): Promise<ApiResponse> {
    return this.request(`/user/kyc/documents/${documentType}`, {
      method: 'DELETE',
    });
  }

  // SME Profile endpoints
  async getSMEProfile(): Promise<ApiResponse<SMEProfileData>> {
    return this.request<SMEProfileData>('/sme/profile', {
      method: 'GET',
    });
  }

  async updateSMEProfile(data: SMEProfileUpdateData): Promise<ApiResponse<SMEProfileData>> {
    return this.request<SMEProfileData>('/sme/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async submitCertification(): Promise<ApiResponse<SMEProfileData>> {
    return this.request<SMEProfileData>('/sme/submit-certification', {
      method: 'POST',
    });
  }

  async getCertificationStatus(): Promise<ApiResponse> {
    return this.request('/sme/certification-status', {
      method: 'GET',
    });
  }

  async getSMEIntroductionRequests(): Promise<ApiResponse<{ requests: Array<{ id: string; requester: { id: string; fullName: string; email: string } | null; message: string; status: string; smeResponse: string | null; respondedAt: string | null; requestedDate: string }>; count: number }>> {
    return this.request('/sme/introduction-requests', {
      method: 'GET',
    });
  }

  async respondToIntroductionRequest(requestId: string, response: string): Promise<ApiResponse<{ id: string; status: string; smeResponse: string; respondedAt: string }>> {
    return this.request(`/sme/introduction-requests/${requestId}/respond`, {
      method: 'POST',
      body: JSON.stringify({ response }),
    });
  }

  // Document endpoints
  async getDocuments(): Promise<ApiResponse> {
    return this.request('/sme/documents', {
      method: 'GET',
    });
  }

  async uploadDocument(file: File, documentType: string): Promise<ApiResponse> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('document', file);
    formData.append('documentType', documentType);

    try {
      const response = await fetch(`${this.baseUrl}/sme/upload-document`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async deleteDocument(documentId: string): Promise<ApiResponse> {
    return this.request(`/sme/document/${documentId}`, {
      method: 'DELETE',
    });
  }

  async uploadCompanyLogo(file: File): Promise<ApiResponse<{ companyLogo: string }>> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('logo', file);

    try {
      const response = await fetch(`${this.baseUrl}/sme/upload-logo`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Logo upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  async deleteCompanyLogo(): Promise<ApiResponse> {
    return this.request('/sme/logo', {
      method: 'DELETE',
    });
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse<{ stats: AdminDashboardStats; recentActivity: AuditLogEntry[] }>> {
    return this.request('/admin/dashboard', {
      method: 'GET',
    });
  }

  async getAdminUsers(params?: { page?: number; limit?: number; search?: string; role?: string }): Promise<ApiResponse<{ users: AdminUser[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.role) searchParams.set('role', params.role);

    const queryString = searchParams.toString();
    return this.request(`/admin/users${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getAdminApplications(params?: { page?: number; limit?: number; search?: string; status?: string }): Promise<ApiResponse<{ applications: AdminApplication[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    return this.request(`/admin/applications${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getAdminApplicationDetail(id: string): Promise<ApiResponse<{ application: AdminApplication; auditHistory: AuditLogEntry[] }>> {
    return this.request(`/admin/applications/${id}`, {
      method: 'GET',
    });
  }

  async reviewApplication(id: string, action: ReviewAction, notes?: string): Promise<ApiResponse<AdminApplication>> {
    return this.request(`/admin/applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  }

  async getAuditLogs(params?: { page?: number; limit?: number; actionType?: string }): Promise<ApiResponse<{ logs: AuditLogEntry[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.actionType) searchParams.set('actionType', params.actionType);

    const queryString = searchParams.toString();
    return this.request(`/admin/audit-logs${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  // Registry endpoints (for users)
  async getRegistrySMEs(params?: { page?: number; limit?: number; search?: string; sector?: string }): Promise<ApiResponse<{ smes: RegistrySME[]; sectors: string[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.search) searchParams.set('search', params.search);
    if (params?.sector) searchParams.set('sector', params.sector);

    const queryString = searchParams.toString();
    return this.request(`/registry${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getRegistrySMEDetail(profileId: string): Promise<ApiResponse<RegistrySMEDetail>> {
    return this.request(`/registry/${profileId}`, {
      method: 'GET',
    });
  }

  async requestIntroduction(profileId: string, message?: string): Promise<ApiResponse<{ id: string; smeCompanyName: string; status: string; createdAt: string }>> {
    return this.request(`/registry/${profileId}/request-introduction`, {
      method: 'POST',
      body: JSON.stringify({ message: message || '' }),
    });
  }

  async getUserIntroductionRequests(): Promise<ApiResponse<{ requests: IntroductionRequest[] }>> {
    return this.request('/user/requests', {
      method: 'GET',
    });
  }

  // Admin registry management
  async updateSMEVisibility(profileId: string, visible: boolean): Promise<ApiResponse<{ id: string; companyName: string; listingVisible: boolean }>> {
    return this.request(`/admin/registry/${profileId}/visibility`, {
      method: 'PUT',
      body: JSON.stringify({ visible }),
    });
  }

  async getAdminIntroductionRequests(params?: { page?: number; limit?: number; status?: string }): Promise<ApiResponse<{ requests: AdminIntroductionRequest[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);

    const queryString = searchParams.toString();
    return this.request(`/admin/introduction-requests${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async exportAuditLogs(params?: { actionType?: string; startDate?: string; endDate?: string }): Promise<void> {
    const searchParams = new URLSearchParams();
    if (params?.actionType) searchParams.set('actionType', params.actionType);
    if (params?.startDate) searchParams.set('startDate', params.startDate);
    if (params?.endDate) searchParams.set('endDate', params.endDate);

    const queryString = searchParams.toString();
    const token = this.getToken();

    const response = await fetch(`${this.baseUrl}/admin/audit-logs/export${queryString ? `?${queryString}` : ''}`, {
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });

    if (response.ok) {
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  }

  // Admin KYC endpoints
  async getKycApplications(params?: { page?: number; limit?: number; status?: string; search?: string }): Promise<ApiResponse<{ applications: KycApplication[]; pagination: PaginationData }>> {
    const searchParams = new URLSearchParams();
    if (params?.page) searchParams.set('page', params.page.toString());
    if (params?.limit) searchParams.set('limit', params.limit.toString());
    if (params?.status) searchParams.set('status', params.status);
    if (params?.search) searchParams.set('search', params.search);

    const queryString = searchParams.toString();
    return this.request(`/admin/kyc-applications${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  async getKycApplicationDetail(id: string): Promise<ApiResponse<{ application: KycApplication }>> {
    return this.request(`/admin/kyc-applications/${id}`, {
      method: 'GET',
    });
  }

  async reviewKycApplication(id: string, action: 'approve' | 'reject' | 'request_revision', notes?: string): Promise<ApiResponse> {
    return this.request(`/admin/kyc-applications/${id}/review`, {
      method: 'POST',
      body: JSON.stringify({ action, notes }),
    });
  }

  // Chat endpoints
  async getConversations(): Promise<ApiResponse<{ id: string; otherParty: { id: string; name: string; email: string }; lastMessage: { content: string; senderName: string; createdAt: string }; unreadCount: number; status: string; createdAt: string }[]>> {
    return this.request('/chat/conversations', {
      method: 'GET',
    });
  }

  async getChatConversations(): Promise<ApiResponse<{ id: string; recipientName: string; recipientEmail: string; lastMessage: string; lastMessageDate: string; unreadCount: number; status: string }[]>> {
    const result = await this.getConversations();
    if (result.success && result.data) {
      const transformed = result.data.map((conv) => ({
        id: conv.id,
        recipientName: conv.otherParty?.name || 'Unknown',
        recipientEmail: conv.otherParty?.email || '',
        lastMessage: conv.lastMessage?.content || 'No messages yet',
        lastMessageDate: conv.lastMessage?.createdAt || conv.createdAt,
        unreadCount: conv.unreadCount || 0,
        status: conv.status,
      }));
      return { success: true, data: transformed, message: '' };
    }
    return { success: false, message: result.message || 'Failed to load conversations' };
  }

  async getChatMessages(requestId: string): Promise<ApiResponse<{
    conversationId: string;
    initialMessage: string;
    initialResponse: string | null;
    otherParty: { id: string; name: string; email: string; type: 'sme' | 'user' };
    currentUserId: string;
    messages: Array<{
      id: string;
      content: string | null;
      senderId: string;
      senderName: string;
      isOwnMessage: boolean;
      createdAt: string;
      isRead: boolean;
      attachments: Array<{
        id: string;
        fileName: string;
        originalName: string;
        filePath: string;
        fileSize: number;
        mimeType: string;
      }>;
    }>;
  }>> {
    return this.request(`/chat/${requestId}/messages`, {
      method: 'GET',
    });
  }

  async sendChatMessage(requestId: string, content: string): Promise<ApiResponse<{
    id: string;
    content: string;
    senderId: string;
    senderName: string;
    isOwnMessage: boolean;
    createdAt: string;
    isRead: boolean;
    attachments: Array<{
      id: string;
      fileName: string;
      originalName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
    }>;
  }>> {
    return this.request(`/chat/${requestId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  async uploadChatFile(requestId: string, file: File, content?: string): Promise<ApiResponse<{
    id: string;
    content: string | null;
    senderId: string;
    senderName: string;
    isOwnMessage: boolean;
    createdAt: string;
    isRead: boolean;
    attachments: Array<{
      id: string;
      fileName: string;
      originalName: string;
      filePath: string;
      fileSize: number;
      mimeType: string;
    }>;
  }>> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);
    if (content) {
      formData.append('content', content);
    }

    try {
      const response = await fetch(`${this.baseUrl}/chat/${requestId}/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  getAttachmentDownloadUrl(requestId: string, attachmentId: string): string {
    return `${this.baseUrl}/chat/${requestId}/download/${attachmentId}`;
  }

  async downloadChatFile(requestId: string, attachmentId: string, fileName: string): Promise<void> {
    const token = this.getToken();
    try {
      const response = await fetch(`${this.baseUrl}/chat/${requestId}/download/${attachmentId}`, {
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  async editChatMessage(requestId: string, messageId: string, content: string): Promise<ApiResponse<{ id: string; content: string; isEdited: boolean; editedAt: string }>> {
    return this.request(`/chat/${requestId}/messages/${messageId}`, {
      method: 'PUT',
      body: JSON.stringify({ content }),
    });
  }

  async deleteChatMessage(requestId: string, messageId: string, deleteForEveryone: boolean): Promise<ApiResponse<{ messageId: string; deletedForEveryone: boolean }>> {
    return this.request(`/chat/${requestId}/messages/${messageId}`, {
      method: 'DELETE',
      body: JSON.stringify({ deleteForEveryone }),
    });
  }

  async deleteConversation(requestId: string): Promise<ApiResponse<{ success: boolean }>> {
    return this.request(`/chat/${requestId}`, {
      method: 'DELETE',
    });
  }

  // ============================================
  // SUPPORT TICKET ENDPOINTS
  // ============================================

  // Create a new support ticket
  async createSupportTicket(subject: string, message: string): Promise<ApiResponse<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    messages: Array<{
      id: string;
      content: string;
      senderId: string;
      createdAt: string;
      sender: { id: string; fullName: string; role: string };
    }>;
  }>> {
    return this.request('/support/tickets', {
      method: 'POST',
      body: JSON.stringify({ subject, message }),
    });
  }

  // Get user's support tickets
  async getSupportTickets(): Promise<ApiResponse<Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    lastMessage: { content: string; createdAt: string; sender: { fullName: string; role: string } } | null;
    unreadCount: number;
  }>>> {
    return this.request('/support/tickets', {
      method: 'GET',
    });
  }

  // Get messages for a specific ticket
  async getSupportTicketMessages(ticketId: string): Promise<ApiResponse<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    user: { id: string; fullName: string; email: string; role: string };
    messages: Array<{
      id: string;
      content: string;
      isRead: boolean;
      createdAt: string;
      sender: { id: string; fullName: string; role: string };
    }>;
  }>> {
    return this.request(`/support/tickets/${ticketId}`, {
      method: 'GET',
    });
  }

  // Send a message in a support ticket
  async sendSupportMessage(ticketId: string, content: string): Promise<ApiResponse<{
    id: string;
    content: string;
    createdAt: string;
    sender: { id: string; fullName: string; role: string };
  }>> {
    return this.request(`/support/tickets/${ticketId}/messages`, {
      method: 'POST',
      body: JSON.stringify({ content }),
    });
  }

  // ADMIN: Get all support tickets
  async getAdminSupportTickets(params?: { status?: string; priority?: string }): Promise<ApiResponse<Array<{
    id: string;
    subject: string;
    status: string;
    priority: string;
    createdAt: string;
    updatedAt: string;
    user: { id: string; fullName: string; email: string; role: string };
    lastMessage: { content: string; createdAt: string; sender: { fullName: string; role: string } } | null;
    messageCount: number;
    unreadCount: number;
  }>>> {
    const searchParams = new URLSearchParams();
    if (params?.status) searchParams.set('status', params.status);
    if (params?.priority) searchParams.set('priority', params.priority);

    const queryString = searchParams.toString();
    return this.request(`/support/admin/tickets${queryString ? `?${queryString}` : ''}`, {
      method: 'GET',
    });
  }

  // ADMIN: Get support statistics
  async getSupportStats(): Promise<ApiResponse<{
    open: number;
    inProgress: number;
    resolved: number;
    total: number;
    unread: number;
  }>> {
    return this.request('/support/admin/stats', {
      method: 'GET',
    });
  }

  // ADMIN: Update ticket status
  async updateSupportTicketStatus(ticketId: string, status: 'open' | 'in_progress' | 'resolved' | 'closed'): Promise<ApiResponse<{
    id: string;
    status: string;
    closedAt: string | null;
  }>> {
    return this.request(`/support/admin/tickets/${ticketId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status }),
    });
  }

  // Upload attachment in support ticket
  async uploadSupportAttachment(ticketId: string, file: File): Promise<ApiResponse<{
    id: string;
    content: string;
    createdAt: string;
    sender: { id: string; fullName: string; role: string };
    attachment: {
      fileName: string;
      originalName: string;
      mimeType: string;
      size: number;
      path: string;
    };
  }>> {
    const token = this.getToken();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${this.baseUrl}/support/tickets/${ticketId}/upload`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          message: data.message || 'Upload failed',
        };
      }

      return data;
    } catch (error) {
      console.error('Upload failed:', error);
      return {
        success: false,
        message: 'Network error. Please check your connection.',
      };
    }
  }

  // Download support attachment (uses static URL)
  async downloadSupportAttachment(ticketId: string, filename: string, originalName: string): Promise<void> {
    try {
      const baseUrl = this.baseUrl.replace('/api', '');
      const url = `${baseUrl}/uploads/support/${ticketId}/${filename}`;

      const response = await fetch(url);
      if (response.ok) {
        const blob = await response.blob();
        const blobUrl = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = blobUrl;
        a.download = originalName;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(blobUrl);
        document.body.removeChild(a);
      }
    } catch (error) {
      console.error('Download failed:', error);
    }
  }

  getSupportAttachmentUrl(ticketId: string, filename: string): string {
    const baseUrl = this.baseUrl.replace('/api', '');
    return `${baseUrl}/uploads/support/${ticketId}/${filename}`;
  }
}

export const api = new ApiClient(API_BASE_URL);
