import { Package } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import ProductsPage from './pages/ProductsPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export const productsModule: Module = {
    id: 'products',
    name: 'Catalog',
    routes: [
        {
            path: 'products',
            element: <ProtectedRoute requiredRole={['super_admin', 'editor']}><ProductsPage /></ProtectedRoute>,
        }
    ],
    navItems: [
        {
            label: 'Products',
            path: 'products',
            icon: Package,
            children: [
                { label: 'Product List', path: 'products' },
                { label: 'Variants', path: 'products/variants' },
            ]
        }
    ]
};
