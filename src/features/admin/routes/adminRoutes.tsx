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
const SellersPage = lazy(() => import('@/features/admin/pages/SellersPage'));
const CreateSellerPage = lazy(() => import('@/features/admin/pages/CreateSellerPage'));
const StripeOnboardingSimulator = lazy(() => import('@/features/admin/pages/StripeOnboardingSimulator'));
const StripeOnboardingComplete = lazy(() => import('@/features/admin/pages/StripeOnboardingComplete'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/**
 * Super Admin Routes - Full platform access
 * Can access all features including seller management and platform settings
 */
export const adminRoutes: RouteObject[] = [
    { path: '', element: <DashboardPage /> },
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'sellers', element: <SellersPage /> },
    { path: 'sellers/create', element: <CreateSellerPage /> },
    { path: 'sellers/onboarding/stripe-simulator', element: <StripeOnboardingSimulator /> },
    { path: 'sellers/onboarding/razorpay-simulator', element: <StripeOnboardingSimulator /> },
    { path: 'sellers/onboarding/paypal-simulator', element: <StripeOnboardingSimulator /> },
    { path: 'sellers/onboarding/complete', element: <StripeOnboardingComplete /> },
    { path: 'products', element: <ProductsPage /> },
    { path: 'products/create', element: <CreateProductPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'customers', element: <CustomersPage /> },
    { path: 'categories', element: <CategoriesPage /> },
    { path: 'settings', element: <SettingsPage /> },
    { path: '*', element: <NotFound /> },
];
