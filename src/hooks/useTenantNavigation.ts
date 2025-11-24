// Tenant-aware navigation hook

import { useNavigate, useParams } from 'react-router-dom';
import { detectTenant } from '@/utils/tenant';

export const useTenantNavigation = () => {
  const navigate = useNavigate();
  const params = useParams();
  
  // Get tenant from URL params or detection
  const tenantFromParams = params.tenant;
  const detectedTenant = detectTenant();
  const tenant = tenantFromParams || detectedTenant.tenantId;

  /**
   * Navigate to a path with tenant awareness
   * @param path - The path to navigate to (e.g., '/dashboard', '/products')
   * @param options - Navigation options
   */
  const navigateWithTenant = (path: string, options?: { replace?: boolean }) => {
    // Remove leading slash if present
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    // Build tenant-aware path
    const fullPath = tenant && tenant !== 'default' 
      ? `/${tenant}/admin/${cleanPath}`
      : `/${cleanPath}`;
    
    navigate(fullPath, options);
  };

  /**
   * Get a tenant-aware path without navigating
   * @param path - The path to convert (e.g., '/dashboard', '/products')
   */
  const getTenantPath = (path: string): string => {
    const cleanPath = path.startsWith('/') ? path.slice(1) : path;
    
    return tenant && tenant !== 'default' 
      ? `/${tenant}/admin/${cleanPath}`
      : `/${cleanPath}`;
  };

  return {
    navigate: navigateWithTenant,
    getTenantPath,
    tenant,
  };
};
