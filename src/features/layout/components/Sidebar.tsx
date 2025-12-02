import { lazy, Suspense } from 'react';
import { usePermissions } from '@/hooks/usePermissions';
import { useHierarchy } from '@/contexts/SellerContext';

// Lazy load sidebars for code splitting
const SuperAdminSidebar = lazy(() => import('@/features/admin/components/AdminSidebar').then(m => ({ default: m.AdminSidebar })));
const SellerSidebar = lazy(() => import('@/features/seller/components/SellerSidebar').then(m => ({ default: m.SellerSidebar })));
const ArtisanSidebar = lazy(() => import('@/features/artisan/components/ArtisanSidebar').then(m => ({ default: m.ArtisanSidebar })));

// Loading fallback
function SidebarLoader() {
  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </aside>
  );
}

/**
 * Sidebar - Role-based sidebar router
 * Renders different sidebar components based on user role
 * 
 * Special case: Super Admin can "impersonate" a seller
 * - No seller selected: Shows Platform Admin sidebar
 * - Seller selected: Shows Seller sidebar (impersonation mode)
 */
export function Sidebar() {
  const { isSuperAdmin, isSeller, isArtisan } = usePermissions();
  const { currentSellerId } = useHierarchy();

  return (
    <Suspense fallback={<SidebarLoader />}>
      {/* Super Admin in Impersonation Mode (seller selected) */}
      {isSuperAdmin && currentSellerId && <SellerSidebar />}

      {/* Super Admin in Platform Mode (no seller selected) */}
      {isSuperAdmin && !currentSellerId && <SuperAdminSidebar />}

      {/* Regular Seller */}
      {isSeller && <SellerSidebar />}

      {/* Artisan */}
      {isArtisan && <ArtisanSidebar />}
    </Suspense>
  );
}
