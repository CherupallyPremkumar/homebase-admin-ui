import { LayoutDashboard, BarChart2 } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import RoleDashboard from './pages/RoleDashboard';

export const dashboardModule: Module = {
    id: 'dashboard',
    name: 'Main',
    routes: [
        {
            path: 'dashboard',
            element: <RoleDashboard />,
        },
        {
            path: '', // Default route
            element: <RoleDashboard />,
        }
    ],
    navItems: [
        { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
        { icon: BarChart2, label: 'Analytics', path: 'analytics' },
    ]
};
