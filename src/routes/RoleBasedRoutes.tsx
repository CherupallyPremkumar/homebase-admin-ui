import { Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { usePermissions } from '@/hooks/usePermissions';
import { adminRoutes } from '@/features/admin/routes/adminRoutes';
import { sellerRoutes } from '@/features/seller/routes/sellerRoutes';
import { artisanRoutes } from '@/features/artisan/routes/artisanRoutes';

// Loading fallback
function RouteLoader() {
    return (
        <div className="flex items-center justify-center h-screen">
            <div className="text-center space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

/**
 * RoleBasedRoutes - Dynamic routing based on user role
 * Loads different route configurations for each role
 */
export function RoleBasedRoutes() {
    const { isSuperAdmin, isSeller, isArtisan } = usePermissions();

    // Select route configuration based on role
    let routes = artisanRoutes; // Default (most restrictive)

    if (isSuperAdmin) {
        routes = adminRoutes;
    } else if (isSeller) {
        routes = sellerRoutes;
    }

    return (
        <Suspense fallback={<RouteLoader />}>
            <Routes>
                {routes.map((route, index) => (
                    <Route key={index} path={route.path} element={route.element} />
                ))}
            </Routes>
        </Suspense>
    );
}
