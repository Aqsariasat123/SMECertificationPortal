'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { User, LoginCredentials } from '@/types';

// Session timeout configuration (in milliseconds)
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 2 * 60 * 1000; // Show warning 2 minutes before timeout

interface TwoFactorData {
  userId: string;
  email: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<{ success: boolean; message: string; requiresTwoFactor?: boolean }>;
  loginWithGoogle: (credential: string) => Promise<{ success: boolean; message: string }>;
  loginWithUAEPass: (code: string, state: string) => Promise<{ success: boolean; message: string }>;
  initUAEPassAuth: () => Promise<{ success: boolean; authUrl?: string; state?: string; message?: string }>;
  verify2FA: (otp: string) => Promise<{ success: boolean; message: string }>;
  resend2FAOTP: () => Promise<{ success: boolean; message: string }>;
  logout: () => Promise<void>;
  checkAuth: () => Promise<void>;
  extendSession: () => void;
  sessionWarningVisible: boolean;
  sessionTimeRemaining: number;
  twoFactorPending: boolean;
  twoFactorData: TwoFactorData | null;
  cancel2FA: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';

function getRedirectPath(role: string): string {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'sme':
      return '/sme';
    case 'user':
      return '/user';
    default:
      return '/login';
  }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [sessionWarningVisible, setSessionWarningVisible] = useState(false);
  const [sessionTimeRemaining, setSessionTimeRemaining] = useState(0);
  const [twoFactorPending, setTwoFactorPending] = useState(false);
  const [twoFactorData, setTwoFactorData] = useState<TwoFactorData | null>(null);
  const router = useRouter();

  // Refs for timers
  const idleTimerRef = useRef<NodeJS.Timeout | null>(null);
  const warningTimerRef = useRef<NodeJS.Timeout | null>(null);
  const countdownRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());

  // Reset idle timer on activity
  const resetIdleTimer = useCallback(() => {
    lastActivityRef.current = Date.now();

    // Clear existing timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);

    // Hide warning if visible
    if (sessionWarningVisible) {
      setSessionWarningVisible(false);
    }

    // Only set timers if user is authenticated
    if (user) {
      // Set warning timer
      warningTimerRef.current = setTimeout(() => {
        setSessionWarningVisible(true);
        setSessionTimeRemaining(Math.floor(WARNING_BEFORE_TIMEOUT / 1000));

        // Start countdown
        countdownRef.current = setInterval(() => {
          setSessionTimeRemaining(prev => {
            if (prev <= 1) {
              if (countdownRef.current) clearInterval(countdownRef.current);
              return 0;
            }
            return prev - 1;
          });
        }, 1000);
      }, SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT);

      // Set logout timer
      idleTimerRef.current = setTimeout(() => {
        console.log('Session expired due to inactivity');
        performLogout('Session expired due to inactivity');
      }, SESSION_TIMEOUT);
    }
  }, [user, sessionWarningVisible]);

  // Extend session (called when user clicks "Stay Logged In")
  const extendSession = useCallback(() => {
    resetIdleTimer();
  }, [resetIdleTimer]);

  // Setup activity listeners
  useEffect(() => {
    if (!user) return;

    const activityEvents = ['mousedown', 'keydown', 'scroll', 'touchstart', 'mousemove'];

    const handleActivity = () => {
      // Throttle: only reset if more than 1 second since last reset
      if (Date.now() - lastActivityRef.current > 1000) {
        resetIdleTimer();
      }
    };

    // Add listeners
    activityEvents.forEach(event => {
      window.addEventListener(event, handleActivity, { passive: true });
    });

    // Initialize timer
    resetIdleTimer();

    // Cleanup
    return () => {
      activityEvents.forEach(event => {
        window.removeEventListener(event, handleActivity);
      });
      if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
    };
  }, [user, resetIdleTimer]);

  // Logout helper that can include a reason
  const performLogout = async (reason?: string) => {
    // Clear all timers
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (countdownRef.current) clearInterval(countdownRef.current);
    setSessionWarningVisible(false);

    setIsLoading(true);
    try {
      await api.logout();
    } catch {
      // Continue with logout even if API call fails
    } finally {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
      setIsLoading(false);
      // Add reason as query param if session expired
      if (reason) {
        router.push('/login?session=expired');
      } else {
        router.push('/login');
      }
    }
  };

  const checkAuth = useCallback(async () => {
    const token = localStorage.getItem(TOKEN_KEY);

    if (!token) {
      setUser(null);
      setIsLoading(false);
      return;
    }

    try {
      const response = await api.getMe();

      if (response.success && response.data) {
        setUser(response.data);
      } else {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  const login = async (credentials: LoginCredentials): Promise<{ success: boolean; message: string; requiresTwoFactor?: boolean }> => {
    setIsLoading(true);

    try {
      const response = await api.login(credentials);

      if (response.success && response.data) {
        // Check if 2FA is required
        if ('requiresTwoFactor' in response.data && response.data.requiresTwoFactor) {
          const data = response.data as unknown as { requiresTwoFactor: boolean; userId: string; email: string };
          setTwoFactorPending(true);
          setTwoFactorData({ userId: data.userId, email: data.email });
          setIsLoading(false);
          return { success: true, message: 'Verification code sent', requiresTwoFactor: true };
        }

        localStorage.setItem(TOKEN_KEY, response.data.token);
        setUser(response.data.user);

        const redirectPath = getRedirectPath(response.data.user.role);
        router.push(redirectPath);

        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: response.message };
    } catch {
      return { success: false, message: 'An error occurred during login' };
    } finally {
      setIsLoading(false);
    }
  };

  const verify2FA = async (otp: string): Promise<{ success: boolean; message: string }> => {
    if (!twoFactorData) {
      return { success: false, message: 'No 2FA session active' };
    }

    setIsLoading(true);

    try {
      const response = await api.verify2FALogin(twoFactorData.userId, otp);

      if (response.success && response.data) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        setUser(response.data.user);
        setTwoFactorPending(false);
        setTwoFactorData(null);

        const redirectPath = getRedirectPath(response.data.user.role);
        router.push(redirectPath);

        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: response.message || 'Invalid verification code' };
    } catch {
      return { success: false, message: 'An error occurred during verification' };
    } finally {
      setIsLoading(false);
    }
  };

  const resend2FAOTP = async (): Promise<{ success: boolean; message: string }> => {
    if (!twoFactorData) {
      return { success: false, message: 'No 2FA session active' };
    }

    try {
      const response = await api.resend2FAOTP(twoFactorData.userId);
      return { success: response.success, message: response.message || 'Verification code sent' };
    } catch {
      return { success: false, message: 'Failed to resend verification code' };
    }
  };

  const cancel2FA = () => {
    setTwoFactorPending(false);
    setTwoFactorData(null);
  };

  // UAE Pass Authentication
  const initUAEPassAuth = async (): Promise<{ success: boolean; authUrl?: string; state?: string; message?: string }> => {
    try {
      const response = await api.initUAEPassAuth();
      if (response.success && response.data) {
        return { success: true, authUrl: response.data.authUrl, state: response.data.state };
      }
      return { success: false, message: response.message || 'UAE Pass is not configured' };
    } catch {
      return { success: false, message: 'Failed to initialize UAE Pass' };
    }
  };

  const loginWithUAEPass = async (code: string, state: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response = await api.uaePassCallback(code, state);

      if (response.success && response.data) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        setUser(response.data.user);

        const redirectPath = getRedirectPath(response.data.user.role);
        router.push(redirectPath);

        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: response.message || 'UAE Pass authentication failed' };
    } catch {
      return { success: false, message: 'An error occurred during UAE Pass authentication' };
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async (credential: string): Promise<{ success: boolean; message: string }> => {
    setIsLoading(true);

    try {
      const response = await api.googleAuth(credential);

      if (response.success && response.data) {
        localStorage.setItem(TOKEN_KEY, response.data.token);
        setUser(response.data.user);

        const redirectPath = getRedirectPath(response.data.user.role);
        router.push(redirectPath);

        return { success: true, message: 'Login successful' };
      }

      return { success: false, message: response.message || 'Google authentication failed' };
    } catch {
      return { success: false, message: 'An error occurred during Google authentication' };
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    await performLogout();
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginWithUAEPass,
    initUAEPassAuth,
    verify2FA,
    resend2FAOTP,
    logout,
    checkAuth,
    extendSession,
    sessionWarningVisible,
    sessionTimeRemaining,
    twoFactorPending,
    twoFactorData,
    cancel2FA,
  };

  // Format time remaining
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <AuthContext.Provider value={value}>
      {children}

      {/* Session Timeout Warning Modal */}
      {sessionWarningVisible && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.6)' }}>
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
            {/* Header */}
            <div className="p-6 text-center" style={{ background: 'var(--warning-50)' }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'var(--warning-100)' }}>
                <svg className="w-8 h-8" style={{ color: 'var(--warning-600)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h2 className="text-xl font-bold" style={{ color: 'var(--graphite-900)' }}>Session Expiring</h2>
              <p className="mt-2 text-sm" style={{ color: 'var(--graphite-600)' }}>
                Your session will expire due to inactivity
              </p>
            </div>

            {/* Countdown */}
            <div className="p-6 text-center">
              <div className="text-4xl font-bold mb-2" style={{ color: 'var(--danger-600)' }}>
                {formatTime(sessionTimeRemaining)}
              </div>
              <p className="text-sm" style={{ color: 'var(--graphite-500)' }}>
                You will be logged out automatically
              </p>
            </div>

            {/* Actions */}
            <div className="p-4 flex gap-3" style={{ background: 'var(--graphite-50)', borderTop: '1px solid var(--graphite-200)' }}>
              <button
                onClick={() => performLogout()}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors"
                style={{ background: 'var(--graphite-200)', color: 'var(--graphite-700)' }}
              >
                Log Out Now
              </button>
              <button
                onClick={extendSession}
                className="flex-1 px-4 py-2.5 text-sm font-medium rounded-lg text-white transition-colors"
                style={{ background: 'var(--teal-600)' }}
              >
                Stay Logged In
              </button>
            </div>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
