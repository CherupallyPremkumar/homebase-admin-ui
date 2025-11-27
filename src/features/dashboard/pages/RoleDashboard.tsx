import { lazy, Suspense } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

// Lazy load dashboards - each dashboard only loads when needed
const DashboardPage = lazy(() => import('@/features/dashboard/pages/DashboardPage'));
const SuperAdminDashboard = lazy(() => import('@/features/dashboard/pages/SuperAdminDashboard'));
const ArtisanDashboard = lazy(() => import('@/features/dashboard/pages/ArtisanDashboard'));

// Loading fallback component
function DashboardLoader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading dashboard...</p>
            </div>
        </div>
    );
}

/**
 * RoleDashboard - Routes user to appropriate dashboard based on role
 * - Super Admin: Platform-wide metrics
 * - Seller: Individual shop metrics
 * - Artisan: Production tasks and workbench
 * 
 * Uses code splitting to reduce initial bundle size
 */
export default function RoleDashboard() {
    const { isSuperAdmin, isArtisan } = usePermissions();

    return (
        <Suspense fallback={<DashboardLoader />}>
            {/* Super Admins see platform-wide dashboard */}
            {isSuperAdmin && <SuperAdminDashboard />}

            {/* Artisans see production workbench */}
            {isArtisan && !isSuperAdmin && <ArtisanDashboard />}

            {/* Sellers see seller-specific dashboard */}
            {!isSuperAdmin && !isArtisan && <DashboardPage />}
        </Suspense>
    );
}
