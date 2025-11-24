// Authentication Types

export type UserRole = 'super_admin' | 'editor' | 'viewer';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string;
  tenantId?: string;
}

export interface TenantConfig {
  id: string;
  name: string;
  subdomain: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
  tenantId?: string;
}

export interface LoginResponse {
  user: AdminUser;
  token: string;
  requiresTwoFactor?: boolean;
  sessionId?: string;
  tenantConfig?: TenantConfig;
}

export interface TwoFactorVerification {
  code: string;
  sessionId: string;
}

export interface PasswordResetRequest {
  email: string;
}

export interface PasswordResetConfirm {
  token: string;
  newPassword: string;
}

export interface LoginAttempt {
  timestamp: string;
  ipAddress: string;
  deviceInfo: string;
  success: boolean;
  failureReason?: string;
}

export interface SessionInfo {
  sessionId: string;
  userId: string;
  lastActivity: string;
  expiresAt: string;
}
