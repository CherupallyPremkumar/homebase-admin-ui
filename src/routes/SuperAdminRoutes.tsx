import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load all pages for code splitting
const DashboardPage = lazy(() => import('@/features/dashboard/pages/RoleDashboard'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const CreateProductPage = lazy(() => import('@/pages/products/CreateProductPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'));
const CategoriesPage = lazy(() => import('@/features/categories/pages/CategoriesPage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/**
 * Super Admin Routes - Full platform access
 * Can access all features including seller management and platform settings
 */
export const superAdminRoutes: RouteObject[] = [
    { path: '', element: <DashboardPage /> },
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'products', element: <ProductsPage /> },
    { path: 'products/create', element: <CreateProductPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'customers', element: <CustomersPage /> },
    { path: 'categories', element: <CategoriesPage /> },
    { path: 'settings', element: <SettingsPage /> },
    { path: '*', element: <NotFound /> },
];
