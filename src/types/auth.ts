// Authentication Types

/**
 * User Role Hierarchy:
 * - super_admin: Platform owner, can manage all sellers and artisans
 * - seller: Shop owner, can create products and manage their artisans
 * - artisan: Maker/worker, can view and update assigned products
 */
export type UserRole = 'super_admin' | 'seller' | 'artisan';

export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatarUrl?: string;
  lastLogin?: string;

  // Multi-tenant hierarchy
  tenantId: string;      // Always required
  sellerId?: string;     // Required for seller and artisan roles
  artisanId?: string;    // Required for artisan role
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
