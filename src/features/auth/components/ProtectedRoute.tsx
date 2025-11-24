import { ReactNode } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';
import { Loader2 } from 'lucide-react';
import { detectTenant } from '@/utils/tenant';

interface ProtectedRouteProps {
  children: ReactNode;
  requiredRole?: UserRole | UserRole[];
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const location = useLocation();
  const params = useParams();
  
  // Get tenant from URL params or detection
  const tenantFromParams = params.tenant;
  const detectedTenant = detectTenant();
  const tenant = tenantFromParams || detectedTenant.tenantId;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect to tenant-specific login if tenant is present
    const loginPath = tenant && tenant !== 'default' 
      ? `/${tenant}/admin/login` 
      : '/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Role-based access control
  if (requiredRole && user) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    
    if (!allowedRoles.includes(user.role)) {
      // Redirect based on user role with tenant awareness
      const basePath = `/${tenant}/admin`;
      
      if (user.role === 'viewer') {
        return <Navigate to={`${basePath}/dashboard`} replace />;
      }
      return <Navigate to={`${basePath}/dashboard`} replace />;
    }
  }

  return <>{children}</>;
}
