import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load artisan-specific pages
const DashboardPage = lazy(() => import('@/features/dashboard/pages/RoleDashboard'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/**
 * Artisan Routes - Production workbench
 * Can only access dashboard to view and update assigned tasks
 */
export const artisanRoutes: RouteObject[] = [
    { path: '', element: <DashboardPage /> },
    { path: 'dashboard', element: <DashboardPage /> },
    { path: '*', element: <NotFound /> },
];
