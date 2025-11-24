// Tenant Detection Utilities

export interface TenantInfo {
  tenantId: string;
  source: 'subdomain' | 'path' | 'default';
}

/**
 * Detects tenant from stored session or URL path
 * Priority: stored tenant > path > default
 */
export const detectTenant = (): TenantInfo => {
  // First check if we have a stored tenant ID from login
  const storedTenant = getStoredTenant();
  if (storedTenant) {
    return {
      tenantId: storedTenant,
      source: 'subdomain', // Mark as authoritative source
    };
  }

  // Check URL path (e.g., /tenant1/admin/login)
  const pathname = window.location.pathname;
  const pathMatch = pathname.match(/^\/([^\/]+)\/admin/);
  
  if (pathMatch && pathMatch[1]) {
    return {
      tenantId: pathMatch[1],
      source: 'path',
    };
  }

  // Default tenant for development/single-tenant mode
  return {
    tenantId: 'default',
    source: 'default',
  };
};

/**
 * Get stored tenant ID from localStorage or sessionStorage
 */
export const getStoredTenant = (): string | null => {
  return localStorage.getItem('tenantId') || sessionStorage.getItem('tenantId');
};

/**
 * Store tenant ID in both localStorage and sessionStorage
 */
export const storeTenant = (tenantId: string, rememberMe: boolean = true): void => {
  if (rememberMe) {
    localStorage.setItem('tenantId', tenantId);
  }
  sessionStorage.setItem('tenantId', tenantId);
};

/**
 * Clear stored tenant ID from both storages
 */
export const clearTenant = (): void => {
  localStorage.removeItem('tenantId');
  sessionStorage.removeItem('tenantId');
};

/**
 * Build tenant-specific dashboard URL
 */
export const getTenantDashboardUrl = (tenantId: string, role: string): string => {
  // Always use tenant-based routing for consistency
  const basePath = `/${tenantId}/admin`;
  
  // All roles go to dashboard in tenant-based routing
  return `${basePath}/dashboard`;
};

/**
 * Apply tenant-specific theme
 */
export const applyTenantTheme = (config?: { primaryColor?: string; secondaryColor?: string }): void => {
  if (!config) return;

  const root = document.documentElement;
  
  if (config.primaryColor) {
    root.style.setProperty('--tenant-primary', config.primaryColor);
  }
  
  if (config.secondaryColor) {
    root.style.setProperty('--tenant-secondary', config.secondaryColor);
  }
};
