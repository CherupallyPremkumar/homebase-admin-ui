import { lazy } from 'react';
import { RouteObject } from 'react-router-dom';

// Lazy load seller-specific pages
const DashboardPage = lazy(() => import('@/features/dashboard/pages/RoleDashboard'));
const ProductsPage = lazy(() => import('@/features/products/pages/ProductsPage'));
const CreateProductPage = lazy(() => import('@/pages/products/CreateProductPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const CustomersPage = lazy(() => import('@/features/customers/pages/CustomersPage'));
const NotFound = lazy(() => import('@/pages/NotFound'));

/**
 * Seller Routes - Shop management
 * Can manage products, orders, and customers for their own shop
 */
export const sellerRoutes: RouteObject[] = [
    { path: '', element: <DashboardPage /> },
    { path: 'dashboard', element: <DashboardPage /> },
    { path: 'products', element: <ProductsPage /> },
    { path: 'products/create', element: <CreateProductPage /> },
    { path: 'orders', element: <OrdersPage /> },
    { path: 'customers', element: <CustomersPage /> },
    { path: '*', element: <NotFound /> },
];
