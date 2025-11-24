import { Folder, Box, Tag } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import CategoriesPage from './pages/CategoriesPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export const categoriesModule: Module = {
    id: 'categories',
    name: 'Catalog',
    routes: [
        {
            path: 'categories',
            element: <ProtectedRoute requiredRole={['super_admin', 'editor']}><CategoriesPage /></ProtectedRoute>,
        }
    ],
    navItems: [
        { icon: Folder, label: 'Categories', path: 'categories' },
        { icon: Box, label: 'Inventory', path: 'inventory' },
        { icon: Tag, label: 'Attributes', path: 'attributes' },
    ]
};
