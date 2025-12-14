import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AdminUser, TenantConfig } from '@/types/auth';
import { authApi } from '@/services/auth';
import { useNavigate } from 'react-router-dom';
import { storeTenant, clearTenant, applyTenantTheme } from '@/utils/tenant';

interface AuthContextType {
  user: AdminUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  tenantId: string | null;
  tenantConfig: TenantConfig | null;
  login: (user: AdminUser, token: string, rememberMe?: boolean, tenantConfig?: TenantConfig) => void;
  logout: () => Promise<void>;
  checkSession: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes before timeout

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AdminUser | null>(null);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [tenantConfig, setTenantConfig] = useState<TenantConfig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastActivity, setLastActivity] = useState(Date.now());
  const navigate = useNavigate();

  // Track user activity
  useEffect(() => {
    const updateActivity = () => {
      setLastActivity(Date.now());
    };

    window.addEventListener('mousedown', updateActivity);
    window.addEventListener('keydown', updateActivity);
    window.addEventListener('scroll', updateActivity);
    window.addEventListener('touchstart', updateActivity);

    return () => {
      window.removeEventListener('mousedown', updateActivity);
      window.removeEventListener('keydown', updateActivity);
      window.removeEventListener('scroll', updateActivity);
      window.removeEventListener('touchstart', updateActivity);
    };
  }, []);

  // Check for session timeout
  useEffect(() => {
    if (!user) return;

    const checkTimeout = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivity;

      // Show warning
      if (timeSinceLastActivity >= SESSION_TIMEOUT - WARNING_BEFORE_TIMEOUT) {
        // TODO: Show session expiry warning modal
        console.warn('Session will expire soon');
      }

      // Auto logout
      if (timeSinceLastActivity >= SESSION_TIMEOUT) {
        handleAutoLogout();
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkTimeout);
  }, [user, lastActivity]);

  const handleAutoLogout = async () => {
    await logout();
    // TODO: Show "Session expired" notification
    navigate('/login', { state: { sessionExpired: true } });
  };

  const loadUser = useCallback(async () => {
    try {
      setIsLoading(true);
      const userData = await authApi.getCurrentUser();
      setUser(userData);

      // Restore tenant information from both storages
      const storedTenantId = localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId');
      if (storedTenantId) {
        setTenantId(storedTenantId);
      }
    } catch (error) {
      setUser(null);
      setTenantId(null);
      localStorage.removeItem('authToken');
      sessionStorage.removeItem('authToken');
      clearTenant();
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
    if (token) {
      loadUser();
    } else {
      setIsLoading(false);
    }
  }, [loadUser]);

  const login = (userData: AdminUser, token: string, rememberMe = false, tenantConfigData?: TenantConfig) => {
    setUser(userData);
    setLastActivity(Date.now());

    // Store tenant information
    const userTenantId = userData.tenantId || 'default';
    setTenantId(userTenantId);
    storeTenant(userTenantId, rememberMe); // Pass rememberMe to tenant storage

    // Store tenantId in localStorage for API headers
    localStorage.setItem('userTenantId', userTenantId);

    if (tenantConfigData) {
      setTenantConfig(tenantConfigData);
      applyTenantTheme(tenantConfigData);
    }

    if (rememberMe) {
      localStorage.setItem('authToken', token);
    } else {
      sessionStorage.setItem('authToken', token);
    }
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      const currentTenant = tenantId || 'default';
      setUser(null);
      setTenantId(null);
      setTenantConfig(null);
      clearTenant();

      // Redirect to tenant-specific login
      const loginPath = currentTenant && currentTenant !== 'default'
        ? `/${currentTenant}/admin/login`
        : '/login';
      navigate(loginPath);
    }
  };

  const checkSession = async (): Promise<boolean> => {
    const sessionId = localStorage.getItem('sessionId') || sessionStorage.getItem('sessionId');
    if (!sessionId) return false;

    try {
      const isValid = await authApi.verifySession(sessionId);
      if (!isValid) {
        await logout();
        return false;
      }
      return true;
    } catch (error) {
      await logout();
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        tenantId,
        tenantConfig,
        login,
        logout,
        checkSession,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
