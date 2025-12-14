import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/types/auth';

/**
 * Permission Hooks for Role-Based Access Control
 */

export function usePermissions() {
    const { user } = useAuth();

    // Role checkers
    const isSuperAdmin = user?.role === 'super_admin';
    const isSeller = user?.role === 'seller';
    const isArtisan = user?.role === 'artisan';

    // Permission checks
    const canManageAllSellers = isSuperAdmin;
    const canSwitchSeller = isSuperAdmin;
    const canCreateProducts = isSuperAdmin || isSeller;
    const canDeleteProducts = isSuperAdmin || isSeller;
    const canViewProducts = true; // All roles can view
    const canUpdateProductStatus = true; // All roles can update status

    // Get hierarchy IDs
    const getTenantId = () => user?.tenantId || null;
    const getSellerId = () => user?.sellerId || null;
    const getArtisanId = () => user?.artisanId || null;

    return {
        // Role flags
        isSuperAdmin,
        isSeller,
        isArtisan,

        // Permissions
        canManageAllSellers,
        canSwitchSeller,
        canCreateProducts,
        canDeleteProducts,
        canViewProducts,
        canUpdateProductStatus,

        // Hierarchy
        getTenantId,
        getSellerId,
        getArtisanId,
    };
}

/**
 * Check if user has any of the specified roles
 */
export function useHasRole(roles: UserRole | UserRole[]): boolean {
    const { user } = useAuth();
    if (!user) return false;

    const roleArray = Array.isArray(roles) ? roles : [roles];
    return roleArray.includes(user.role);
}
