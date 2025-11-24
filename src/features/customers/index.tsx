import { Users, PieChart, Star } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import CustomersPage from './pages/CustomersPage';

export const customersModule: Module = {
    id: 'customers',
    name: 'Customers',
    routes: [
        {
            path: 'customers',
            element: <CustomersPage />,
        }
    ],
    navItems: [
        { icon: Users, label: 'Customers', path: 'customers' },
        { icon: PieChart, label: 'Segments', path: 'segments' },
        { icon: Star, label: 'Reviews', path: 'reviews' },
    ]
};
