import { lazy, Suspense } from 'react';
import { usePermissions } from '@/hooks/usePermissions';

// Lazy load headers for code splitting
const SuperAdminHeader = lazy(() => import('@/features/admin/components/AdminHeader').then(m => ({ default: m.AdminHeader })));
const SellerHeader = lazy(() => import('@/features/seller/components/SellerHeader').then(m => ({ default: m.SellerHeader })));
const ArtisanHeader = lazy(() => import('@/features/artisan/components/ArtisanHeader').then(m => ({ default: m.ArtisanHeader })));

// Loading fallback
function HeaderLoader() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-3.5">
        <div className="animate-pulse h-6 w-32 bg-muted rounded"></div>
        <div className="animate-pulse h-8 w-40 bg-muted rounded"></div>
      </div>
    </header>
  );
}

/**
 * Header - Role-based header router
 * Renders different header components based on user role
 * Uses code splitting for optimal bundle size
 */
export function Header() {
  const { isSuperAdmin, isSeller, isArtisan } = usePermissions();

  return (
    <Suspense fallback={<HeaderLoader />}>
      {isSuperAdmin && <SuperAdminHeader />}
      {isSeller && <SellerHeader />}
      {isArtisan && <ArtisanHeader />}
    </Suspense>
  );
}
