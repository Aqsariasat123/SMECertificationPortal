'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { api } from '@/lib/api';
import { IntroductionRequest } from '@/types';

const API_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api').replace('/api', '');

// Helper function to capitalize each word
const capitalizeWords = (str: string) => {
  return str.split(' ').map(word =>
    word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  ).join(' ');
};

export default function UserProfilePage() {
  const { user, checkAuth } = useAuth();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(tabParam === 'introductions' ? 'introductions' : tabParam === 'security' ? 'security' : 'profile');
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Update active tab when URL param changes
  useEffect(() => {
    if (tabParam === 'introductions') {
      setActiveTab('introductions');
    } else if (tabParam === 'security') {
      setActiveTab('security');
    }
  }, [tabParam]);

  // Profile picture state
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  const profilePictureInputRef = useRef<HTMLInputElement>(null);

  // Split full name into first and last name with proper capitalization
  const fullName = user?.fullName ? capitalizeWords(user.fullName) : '';
  const nameParts = fullName.split(' ');
  const initialFirstName = nameParts[0] || '';
  const initialLastName = nameParts.slice(1).join(' ') || '';
  const initials = `${initialFirstName.charAt(0)}${initialLastName.charAt(0) || initialFirstName.charAt(1) || ''}`.toUpperCase() || 'U';

  // Form state
  const [formData, setFormData] = useState({
    firstName: initialFirstName,
    lastName: initialLastName,
    phoneNumber: user?.phoneNumber || '',
    organization: '',
  });

  // Update form when user data loads
  useEffect(() => {
    if (user) {
      const name = user.fullName ? capitalizeWords(user.fullName) : '';
      const parts = name.split(' ');
      setFormData({
        firstName: parts[0] || '',
        lastName: parts.slice(1).join(' ') || '',
        phoneNumber: user.phoneNumber || '',
        organization: user.organization || '',
      });
      // Load profile picture from user data
      if (user.profilePicture) {
        setProfilePicture(`${API_BASE_URL}${user.profilePicture}`);
      } else {
        setProfilePicture(null);
      }
    }
  }, [user]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setSaving(true);
    try {
      const result = await api.updateProfile({
        firstName: formData.firstName,
        lastName: formData.lastName,
        phoneNumber: formData.phoneNumber || undefined,
        organization: formData.organization || undefined,
      });

      if (result.success) {
        // Refresh auth context to update user data globally
        await checkAuth();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form to original values
    const name = user?.fullName ? capitalizeWords(user.fullName) : '';
    const parts = name.split(' ');
    setFormData({
      firstName: parts[0] || '',
      lastName: parts.slice(1).join(' ') || '',
      phoneNumber: user?.phoneNumber || '',
      organization: user?.organization || '',
    });
    // Show brief feedback that form was reset
    setSaveSuccess(false);
    // Scroll to top of form to show reset
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleProfilePictureChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }

    setUploadingPicture(true);

    try {
      // Upload to server
      const result = await api.uploadProfilePicture(file);

      if (result.success && result.data) {
        setProfilePicture(`${API_BASE_URL}${result.data.profilePicture}`);
        // Refresh auth context to update user data globally
        await checkAuth();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      } else {
        alert(result.message || 'Failed to upload profile picture');
      }
    } catch (error) {
      console.error('Failed to upload profile picture:', error);
      alert('Failed to upload profile picture');
    } finally {
      setUploadingPicture(false);
      if (profilePictureInputRef.current) {
        profilePictureInputRef.current.value = '';
      }
    }
  };

  const handleRemoveProfilePicture = async () => {
    try {
      const result = await api.removeProfilePicture();
      if (result.success) {
        setProfilePicture(null);
        await checkAuth();
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 3000);
      }
    } catch (error) {
      console.error('Failed to remove profile picture:', error);
    }
  };

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [introductionRequests, setIntroductionRequests] = useState<IntroductionRequest[]>([]);
  const [requestsLoading, setRequestsLoading] = useState(true);

  const fetchIntroductionRequests = useCallback(async () => {
    setRequestsLoading(true);
    try {
      const result = await api.getUserIntroductionRequests();
      if (result.success && result.data) {
        setIntroductionRequests(result.data.requests);
      }
    } catch (error) {
      console.error('Failed to fetch introduction requests:', error);
    } finally {
      setRequestsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchIntroductionRequests();
  }, [fetchIntroductionRequests]);

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setPasswordError('');
  };

  const handleUpdatePassword = async () => {
    setPasswordError('');

    // Validation
    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      setPasswordError('Please fill in all password fields');
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordError('New password must be at least 8 characters');
      return;
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError('New passwords do not match');
      return;
    }

    setPasswordSaving(true);

    try {
      const result = await api.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      });

      if (result.success) {
        setPasswordSuccess(true);
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordSuccess(false), 3000);
      } else {
        setPasswordError(result.message || 'Failed to update password');
      }
    } catch {
      setPasswordError('An error occurred. Please try again.');
    } finally {
      setPasswordSaving(false);
    }
  };

  // For display
  const firstName = formData.firstName;
  const lastName = formData.lastName;

  const getStatusConfig = (status: string) => {
    const config: Record<string, { bgStyle: React.CSSProperties; textStyle: React.CSSProperties; dotStyle: React.CSSProperties; label: string }> = {
      pending: {
        bgStyle: { backgroundColor: 'var(--warning-50)' },
        textStyle: { color: 'var(--warning-700)' },
        dotStyle: { backgroundColor: 'var(--warning-500)' },
        label: 'Pending'
      },
      viewed: {
        bgStyle: { backgroundColor: 'var(--teal-50)' },
        textStyle: { color: 'var(--teal-700)' },
        dotStyle: { backgroundColor: 'var(--teal-500)' },
        label: 'Viewed'
      },
      responded: {
        bgStyle: { backgroundColor: 'var(--success-50)' },
        textStyle: { color: 'var(--success-700)' },
        dotStyle: { backgroundColor: 'var(--success-500)' },
        label: 'Responded'
      },
    };
    return config[status] || config.pending;
  };

  const formatSector = (sector: string | null) => {
    if (!sector) return 'Not specified';
    return sector.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  const getInitials = (name: string | null) => {
    if (!name) return '??';
    return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    )},
    { id: 'introductions', label: 'Introductions', count: introductionRequests.length, icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
      </svg>
    )},
    { id: 'security', label: 'Security', icon: (
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    )},
  ];

  const memberSince = user?.createdAt
    ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })
    : 'N/A';

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold" style={{ color: 'var(--graphite-900)' }}>My Profile</h1>
        <p className="text-sm sm:text-base mt-1" style={{ color: 'var(--foreground-muted)' }}>Manage your account and view your introduction requests</p>
      </div>

      {/* Profile Card */}
      <div className="solid-card overflow-hidden">
        {/* Header with user info */}
        <div className="px-4 sm:px-6 pt-6 pb-16 sm:pb-6" style={{ backgroundColor: 'var(--graphite-800)' }}>
          {/* Mobile: Centered layout */}
          <div className="flex flex-col items-center text-center sm:hidden">
            <div className="relative group">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={initials}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg border-4 border-white/20"
                  onError={() => setProfilePicture(null)}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white/20" style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={uploadingPicture}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"
              >
                {uploadingPicture ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="mt-3 space-y-1">
              <h2 className="text-xl font-bold text-white">{fullName || 'Investor'}</h2>
              <p className="text-sm" style={{ color: 'var(--graphite-300)' }}>{user?.email || 'No email'}</p>
              <div className="flex items-center justify-center gap-2 flex-wrap pt-2">
                {user?.isVerified && (
                  <span className="inline-flex items-center gap-1 text-xs text-white bg-white/20 px-2 py-0.5 rounded-full font-medium">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Verified
                  </span>
                )}
                <span className="text-xs" style={{ color: 'var(--graphite-400)' }}>Member since {memberSince}</span>
              </div>
            </div>
          </div>

          {/* Desktop: Horizontal layout */}
          <div className="hidden sm:flex sm:items-center gap-5">
            <div className="relative group flex-shrink-0">
              {profilePicture ? (
                <img
                  src={profilePicture}
                  alt={initials}
                  className="w-20 h-20 rounded-2xl object-cover shadow-lg border-4 border-white/20"
                  onError={() => setProfilePicture(null)}
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg border-4 border-white/20" style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}>
                  {initials}
                </div>
              )}
              <button
                onClick={() => profilePictureInputRef.current?.click()}
                disabled={uploadingPicture}
                className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
              >
                {uploadingPicture ? (
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                )}
              </button>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <h2 className="text-xl font-bold text-white truncate">{fullName || 'Investor'}</h2>
                  <p className="truncate" style={{ color: 'var(--graphite-300)' }}>{user?.email || 'No email'}</p>
                  <div className="flex items-center gap-3 mt-2 flex-wrap">
                    {user?.isVerified && (
                      <span className="inline-flex items-center gap-1.5 text-xs text-white bg-white/20 px-2.5 py-1 rounded-full font-medium">
                        <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        Email Verified
                      </span>
                    )}
                    <span className="text-sm" style={{ color: 'var(--graphite-400)' }}>Member since {memberSince}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="solid-card">
        <div style={{ borderBottomWidth: '1px', borderBottomColor: 'var(--graphite-200)' }}>
          <div className="flex overflow-x-auto scrollbar-hide -mb-px">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-3 sm:py-4 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all min-w-0"
                style={activeTab === tab.id
                  ? { borderBottomColor: 'var(--teal-600)', color: 'var(--teal-600)', backgroundColor: 'var(--teal-50)' }
                  : { borderBottomColor: 'transparent', color: 'var(--graphite-500)' }
                }
              >
                <span className="flex-shrink-0">{tab.icon}</span>
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
                <span className="xs:hidden sm:hidden">{tab.label.split(' ')[0]}</span>
                {tab.count !== undefined && (
                  <span
                    className="px-1.5 sm:px-2 py-0.5 text-xs font-semibold rounded-full"
                    style={activeTab === tab.id
                      ? { backgroundColor: 'var(--teal-100)', color: 'var(--teal-700)' }
                      : { backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-600)' }
                    }
                  >
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6 sm:space-y-8">
              {/* Success Message */}
              {saveSuccess && (
                <div className="rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--success-50)', borderWidth: '1px', borderColor: 'var(--success-200)' }}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--success-100)' }}>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--success-600)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="text-sm font-medium" style={{ color: 'var(--success-800)' }}>Your profile has been updated successfully!</p>
                </div>
              )}

              {/* Profile Picture Section */}
              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--graphite-900)' }}>Profile Picture</h3>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--graphite-50)', borderWidth: '1px', borderColor: 'var(--graphite-200)' }}>
                  <div className="relative group">
                    {profilePicture ? (
                      <img
                        src={profilePicture}
                        alt={initials}
                        className="w-20 h-20 rounded-xl object-cover border-2 border-slate-200"
                        onError={() => setProfilePicture(null)}
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-xl flex items-center justify-center text-white text-2xl font-bold" style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))', borderWidth: '2px', borderColor: 'var(--graphite-200)' }}>
                        {initials}
                      </div>
                    )}
                    {uploadingPicture && (
                      <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-xl">
                        <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-sm sm:text-base" style={{ color: 'var(--graphite-900)' }}>Upload a photo</p>
                    <p className="text-xs sm:text-sm mt-0.5" style={{ color: 'var(--graphite-500)' }}>This picture will be visible in chats and your profile. Max 5MB.</p>
                    <div className="flex flex-wrap gap-2 mt-3">
                      <button
                        onClick={() => profilePictureInputRef.current?.click()}
                        disabled={uploadingPicture}
                        className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors disabled:opacity-50"
                        style={{ color: 'var(--teal-600)', backgroundColor: 'var(--teal-50)' }}
                      >
                        {uploadingPicture ? 'Uploading...' : profilePicture ? 'Change Photo' : 'Upload Photo'}
                      </button>
                      {profilePicture && (
                        <button
                          onClick={handleRemoveProfilePicture}
                          className="px-4 py-2 text-sm font-semibold rounded-lg transition-colors"
                          style={{ color: 'var(--danger-600)' }}
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--graphite-900)' }}>Personal Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>First Name</label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--graphite-900)' }}>Contact Information</h3>
                <div className="space-y-4 sm:space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Email Address</label>
                    <input
                      type="email"
                      defaultValue={user?.email || ''}
                      disabled
                      className="w-full h-11 sm:h-12 px-4 rounded-xl cursor-not-allowed text-sm sm:text-base"
                      style={{ backgroundColor: 'var(--graphite-100)', color: 'var(--graphite-500)', borderWidth: '1px', borderColor: 'var(--graphite-200)' }}
                    />
                    <p className="text-xs mt-1.5 flex items-center gap-1" style={{ color: 'var(--graphite-400)' }}>
                      <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                      Email cannot be changed for security reasons
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Phone Number</label>
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+971 50 123 4567"
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Organization (Optional)</label>
                    <input
                      type="text"
                      name="organization"
                      value={formData.organization}
                      onChange={handleInputChange}
                      placeholder="Enter your organization name"
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                <button
                  onClick={handleSaveChanges}
                  disabled={saving}
                  className="btn-teal px-6 py-3 font-semibold rounded-xl transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {saving ? (
                    <>
                      <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  disabled={saving}
                  className="btn-secondary px-6 py-3 font-semibold rounded-xl transition-colors text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {activeTab === 'introductions' && (
            <div className="space-y-3 sm:space-y-4">
              {requestsLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center gap-4 p-4 sm:p-5 rounded-xl animate-pulse" style={{ backgroundColor: 'var(--graphite-50)', borderWidth: '1px', borderColor: 'var(--graphite-200)' }}>
                      <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 rounded w-1/3" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                        <div className="h-3 rounded w-1/2" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                      </div>
                      <div className="w-20 h-6 rounded-full" style={{ backgroundColor: 'var(--graphite-200)' }}></div>
                    </div>
                  ))}
                </div>
              ) : introductionRequests.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4 sm:mb-6">
                    <p className="text-xs sm:text-sm" style={{ color: 'var(--graphite-500)' }}>
                      You have <span className="font-semibold" style={{ color: 'var(--graphite-700)' }}>{introductionRequests.length}</span> introduction requests
                    </p>
                    <Link
                      href="/user"
                      className="text-xs sm:text-sm font-medium"
                      style={{ color: 'var(--teal-600)' }}
                    >
                      Browse SME Registry →
                    </Link>
                  </div>
                  {introductionRequests.map((request) => {
                    const statusConfig = getStatusConfig(request.status);
                    return (
                      <Link
                        key={request.id}
                        href={`/user/messages?chat=${request.id}`}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl transition-colors group gap-3 sm:gap-4 cursor-pointer hover:shadow-md"
                        style={{ backgroundColor: 'var(--graphite-50)', borderWidth: '1px', borderColor: 'var(--graphite-200)' }}
                      >
                        <div className="flex items-center gap-3 sm:gap-4">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md flex-shrink-0" style={{ background: 'linear-gradient(to bottom right, var(--graphite-700), var(--graphite-900))' }}>
                            {getInitials(request.smeName)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-semibold text-sm sm:text-base group-hover:underline" style={{ color: 'var(--graphite-900)' }}>{request.smeName || 'Unknown Company'}</h4>
                            <div className="flex items-center gap-2 sm:gap-3 mt-0.5 sm:mt-1 flex-wrap">
                              <span className="text-xs sm:text-sm" style={{ color: 'var(--graphite-500)' }}>{formatSector(request.smeSector)}</span>
                              <span className="hidden sm:inline" style={{ color: 'var(--graphite-300)' }}>•</span>
                              <span className="text-xs sm:text-sm" style={{ color: 'var(--graphite-400)' }}>{formatDate(request.requestedDate)}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs font-semibold"
                            style={{ ...statusConfig.bgStyle, ...statusConfig.textStyle }}
                          >
                            <span className="w-1.5 h-1.5 rounded-full" style={statusConfig.dotStyle} />
                            {statusConfig.label}
                          </span>
                          <svg className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-400)' }}>
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                          </svg>
                        </div>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <div className="text-center py-10 sm:py-16">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6" style={{ backgroundColor: 'var(--graphite-100)' }}>
                    <svg className="w-8 h-8 sm:w-10 sm:h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-400)' }}>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                    </svg>
                  </div>
                  <h3 className="font-bold text-base sm:text-lg" style={{ color: 'var(--graphite-900)' }}>No introduction requests yet</h3>
                  <p className="mt-2 max-w-sm mx-auto text-sm" style={{ color: 'var(--graphite-500)' }}>Browse the SME registry to find certified companies and request introductions</p>
                  <Link
                    href="/user"
                    className="btn-teal inline-flex items-center gap-2 mt-5 sm:mt-6 px-5 sm:px-6 py-2.5 sm:py-3 font-semibold rounded-xl transition-all text-sm"
                  >
                    Browse SME Registry
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </Link>
                </div>
              )}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6 sm:space-y-8">
              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--graphite-900)' }}>Change Password</h3>

                {/* Password Success Message */}
                {passwordSuccess && (
                  <div className="mb-4 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--success-50)', borderWidth: '1px', borderColor: 'var(--success-200)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--success-100)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--success-600)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--success-800)' }}>Password updated successfully!</p>
                  </div>
                )}

                {/* Password Error Message */}
                {passwordError && (
                  <div className="mb-4 rounded-xl p-4 flex items-center gap-3" style={{ backgroundColor: 'var(--danger-50)', borderWidth: '1px', borderColor: 'var(--danger-200)' }}>
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--danger-100)' }}>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--danger-600)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <p className="text-sm font-medium" style={{ color: 'var(--danger-800)' }}>{passwordError}</p>
                  </div>
                )}

                <div className="space-y-4 sm:space-y-5">
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Current Password</label>
                    <input
                      type="password"
                      name="currentPassword"
                      value={passwordData.currentPassword}
                      onChange={handlePasswordChange}
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                      placeholder="Enter current password"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>New Password</label>
                    <input
                      type="password"
                      name="newPassword"
                      value={passwordData.newPassword}
                      onChange={handlePasswordChange}
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                      placeholder="Enter new password"
                    />
                    <p className="text-xs mt-1.5" style={{ color: 'var(--graphite-400)' }}>Must be at least 8 characters with uppercase, lowercase, and numbers</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1.5 sm:mb-2" style={{ color: 'var(--graphite-700)' }}>Confirm New Password</label>
                    <input
                      type="password"
                      name="confirmPassword"
                      value={passwordData.confirmPassword}
                      onChange={handlePasswordChange}
                      className="input-field w-full h-11 sm:h-12 px-4 rounded-xl text-sm sm:text-base"
                      placeholder="Confirm new password"
                    />
                  </div>
                  <div className="pt-2">
                    <button
                      onClick={handleUpdatePassword}
                      disabled={passwordSaving}
                      className="btn-teal w-full sm:w-auto px-6 py-2.5 sm:py-3 font-semibold rounded-xl transition-all text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                      {passwordSaving ? (
                        <>
                          <svg className="w-4 h-4 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Updating...
                        </>
                      ) : (
                        'Update Password'
                      )}
                    </button>
                  </div>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--graphite-200)' }} />

              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--graphite-900)' }}>Two-Factor Authentication</h3>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:p-5 rounded-xl gap-3 sm:gap-4" style={{ backgroundColor: 'var(--graphite-50)', borderWidth: '1px', borderColor: 'var(--graphite-200)' }}>
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: 'var(--graphite-200)' }}>
                      <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" style={{ color: 'var(--graphite-500)' }}>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--graphite-900)' }}>Authenticator App</p>
                      <p className="text-xs sm:text-sm" style={{ color: 'var(--graphite-500)' }}>Add an extra layer of security to your account</p>
                    </div>
                  </div>
                  <button
                    onClick={() => alert('Two-Factor Authentication setup coming soon! This feature will allow you to add an authenticator app for extra security.')}
                    className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-xl transition-colors flex-shrink-0 hover:bg-teal-50"
                    style={{ color: 'var(--teal-600)', borderWidth: '1px', borderColor: 'var(--teal-200)' }}
                  >
                    Enable
                  </button>
                </div>
              </div>

              <hr style={{ borderColor: 'var(--graphite-200)' }} />

              <div>
                <h3 className="text-xs sm:text-sm font-semibold uppercase tracking-wider mb-3 sm:mb-4" style={{ color: 'var(--danger-600)' }}>Danger Zone</h3>
                <div className="p-4 sm:p-5 rounded-xl" style={{ backgroundColor: 'var(--danger-50)', borderWidth: '1px', borderColor: 'var(--danger-100)' }}>
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-4">
                    <div>
                      <p className="font-semibold text-sm sm:text-base" style={{ color: 'var(--graphite-900)' }}>Delete Account</p>
                      <p className="text-xs sm:text-sm mt-1" style={{ color: 'var(--graphite-500)' }}>Once you delete your account, there is no going back. Please be certain.</p>
                    </div>
                    <button
                      onClick={() => alert('Account deletion feature coming soon. For immediate assistance, please contact support.')}
                      className="w-full sm:w-auto px-4 py-2 text-sm font-semibold rounded-xl transition-colors whitespace-nowrap flex-shrink-0 hover:bg-red-50"
                      style={{ color: 'var(--danger-600)', borderWidth: '1px', borderColor: 'var(--danger-200)' }}
                    >
                      Delete Account
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hidden file input for profile picture */}
      <input
        ref={profilePictureInputRef}
        type="file"
        accept="image/*"
        onChange={handleProfilePictureChange}
        className="hidden"
      />
    </div>
  );
}
