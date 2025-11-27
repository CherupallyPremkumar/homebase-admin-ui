// Mock Authentication Service
// TODO: Replace with actual backend API calls

import {
  AdminUser,
  LoginCredentials,
  LoginResponse,
  TwoFactorVerification,
  PasswordResetRequest,
  LoginAttempt,
  SessionInfo
} from '@/types/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://handmade-backend-981536694150.asia-south1.run.app/api';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false'; // Use real backend when env var is 'false'

// Mock tenant configurations
const MOCK_TENANTS = {
  tenant1: {
    id: 'tenant1',
    name: 'Tenant 1 Store',
    subdomain: 'tenant1',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=tenant1',
    primaryColor: '340 75% 55%',
    secondaryColor: '142 30% 55%',
  },
  tenant2: {
    id: 'tenant2',
    name: 'Tenant 2 Shop',
    subdomain: 'tenant2',
    logoUrl: 'https://api.dicebear.com/7.x/shapes/svg?seed=tenant2',
    primaryColor: '220 75% 55%',
    secondaryColor: '280 60% 55%',
  },
  default: {
    id: 'default',
    name: 'Home Decor Admin',
    subdomain: 'default',
  },
};

// Mock delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock users database
const MOCK_USERS = [
  // Super Admin - Platform Owner
  {
    id: '1',
    email: 'admin@handmade.com',
    password: 'admin123',
    name: 'Platform Admin',
    role: 'super_admin' as const,
    tenantId: 'handmade-inc',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin',
    requiresTwoFactor: false,
  },

  // Seller - Shop Owner
  {
    id: '2',
    email: 'seller@johncrafts.com',
    password: 'seller123',
    name: 'John Williams',
    role: 'seller' as const,
    tenantId: 'handmade-inc',
    sellerId: 'SELLER-001',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=seller',
    requiresTwoFactor: false,
  },

  // Artisan - Worker/Maker
  {
    id: '3',
    email: 'artisan@alice.com',
    password: 'artisan123',
    name: 'Alice Potter',
    role: 'artisan' as const,
    tenantId: 'handmade-inc',
    sellerId: 'SELLER-001',
    artisanId: 'ARTISAN-001',
    avatarUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=artisan',
    requiresTwoFactor: false,
  },
];

// Track login attempts for throttling
const loginAttempts = new Map<string, { count: number; lastAttempt: number; lockedUntil?: number }>();
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes

// Track sessions
const activeSessions = new Map<string, SessionInfo>();

export const authApi = {
  // Login
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    await delay(800);

    if (USE_MOCK) {
      const tenantId = credentials.tenantId || 'default';
      const tenantConfig = MOCK_TENANTS[tenantId as keyof typeof MOCK_TENANTS];
      // Check for account lockout
      const attemptData = loginAttempts.get(credentials.email);
      if (attemptData?.lockedUntil && attemptData.lockedUntil > Date.now()) {
        const remainingMinutes = Math.ceil((attemptData.lockedUntil - Date.now()) / 60000);
        throw new Error(`Account locked. Try again in ${remainingMinutes} minutes.`);
      }

      // Find user
      const user = MOCK_USERS.find(u => u.email === credentials.email);

      if (!user || user.password !== credentials.password) {
        // Track failed attempt
        const currentAttempts = attemptData?.count || 0;
        const newCount = currentAttempts + 1;

        if (newCount >= MAX_ATTEMPTS) {
          loginAttempts.set(credentials.email, {
            count: newCount,
            lastAttempt: Date.now(),
            lockedUntil: Date.now() + LOCKOUT_DURATION,
          });
          throw new Error('Too many failed attempts. Account locked for 15 minutes.');
        }

        loginAttempts.set(credentials.email, {
          count: newCount,
          lastAttempt: Date.now(),
        });

        throw new Error('Invalid email or password');
      }

      // Reset attempts on successful login
      loginAttempts.delete(credentials.email);

      // Generate mock token
      const token = btoa(`${user.id}:${Date.now()}`);
      const sessionId = `session_${Date.now()}`;

      // Store session
      const session: SessionInfo = {
        sessionId,
        userId: user.id,
        lastActivity: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // 24 hours
      };
      activeSessions.set(sessionId, session);

      // Log login activity
      const loginActivity: LoginAttempt = {
        timestamp: new Date().toISOString(),
        ipAddress: '192.168.1.1', // Mock IP
        deviceInfo: navigator.userAgent,
        success: true,
      };

      const activities = JSON.parse(localStorage.getItem('loginActivities') || '[]');
      activities.unshift(loginActivity);
      localStorage.setItem('loginActivities', JSON.stringify(activities.slice(0, 50)));

      // Store token
      if (credentials.rememberMe) {
        localStorage.setItem('authToken', token);
        localStorage.setItem('sessionId', sessionId);
      } else {
        sessionStorage.setItem('authToken', token);
        sessionStorage.setItem('sessionId', sessionId);
      }

      const { password, ...userWithoutPassword } = user;

      return {
        user: { ...userWithoutPassword, lastLogin: new Date().toISOString(), tenantId },
        token,
        requiresTwoFactor: user.requiresTwoFactor,
        sessionId: user.requiresTwoFactor ? sessionId : undefined,
        tenantConfig,
      };
    }

    // Real API call - Backend will determine tenant from admin credentials
    const response = await fetch(`${API_BASE_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(error || 'Login failed');
    }

    const loginResponse: LoginResponse = await response.json();

    // Store the token and tenant ID from backend response
    const tenantId = loginResponse.tenantConfig?.id || loginResponse.user.tenantId || 'default';

    if (credentials.rememberMe) {
      localStorage.setItem('authToken', loginResponse.token);
      localStorage.setItem('tenantId', tenantId);
    } else {
      sessionStorage.setItem('authToken', loginResponse.token);
      sessionStorage.setItem('tenantId', tenantId);
    }

    return loginResponse;
  },

  // Verify 2FA code
  verifyTwoFactor: async (verification: TwoFactorVerification): Promise<{ success: boolean }> => {
    await delay(500);

    if (USE_MOCK) {
      // Mock: accept "123456" as valid code
      if (verification.code === '123456') {
        return { success: true };
      }
      throw new Error('Invalid verification code');
    }

    const response = await fetch(`${API_BASE_URL}/admin/verify-2fa`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(verification),
    });

    if (!response.ok) {
      throw new Error('2FA verification failed');
    }

    return response.json();
  },

  // Get current user
  getCurrentUser: async (): Promise<AdminUser> => {
    await delay(300);

    if (USE_MOCK) {
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token');
      }

      const [userId] = atob(token).split(':');
      const user = MOCK_USERS.find(u => u.id === userId);

      if (!user) {
        throw new Error('User not found');
      }

      const { password, ...userWithoutPassword } = user;
      return { ...userWithoutPassword, lastLogin: new Date().toISOString() };
    }

    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    const tenantId = localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId') || 'default';

    const response = await fetch(`${API_BASE_URL}/admin/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'X-Tenant-ID': tenantId,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to get user');
    }

    return response.json();
  },

  // Logout
  logout: async (): Promise<void> => {
    await delay(200);

    const sessionId = localStorage.getItem('sessionId') || sessionStorage.getItem('sessionId');
    if (sessionId) {
      activeSessions.delete(sessionId);
    }

    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
    sessionStorage.removeItem('authToken');
    sessionStorage.removeItem('sessionId');

    if (!USE_MOCK) {
      await fetch(`${API_BASE_URL}/admin/logout`, { method: 'POST' });
    }
  },

  // Request password reset
  requestPasswordReset: async (data: PasswordResetRequest): Promise<{ message: string }> => {
    await delay(800);

    if (USE_MOCK) {
      const user = MOCK_USERS.find(u => u.email === data.email);
      if (!user) {
        // Don't reveal if email exists (security best practice)
        return { message: 'If an account exists, a reset link has been sent to your email.' };
      }

      // In real implementation, send email with reset token
      console.log('Password reset token (mock):', btoa(`reset:${user.id}:${Date.now()}`));
      return { message: 'If an account exists, a reset link has been sent to your email.' };
    }

    const response = await fetch(`${API_BASE_URL}/admin/password-reset`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error('Password reset request failed');
    }

    return response.json();
  },

  // Verify session
  verifySession: async (sessionId: string): Promise<boolean> => {
    if (USE_MOCK) {
      const session = activeSessions.get(sessionId);
      if (!session) return false;

      const now = new Date();
      const expiresAt = new Date(session.expiresAt);

      if (now > expiresAt) {
        activeSessions.delete(sessionId);
        return false;
      }

      // Update last activity
      session.lastActivity = now.toISOString();
      return true;
    }

    const response = await fetch(`${API_BASE_URL}/admin/verify-session`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId }),
    });

    return response.ok;
  },

  // Get login activities
  getLoginActivities: (): LoginAttempt[] => {
    return JSON.parse(localStorage.getItem('loginActivities') || '[]');
  },
};
