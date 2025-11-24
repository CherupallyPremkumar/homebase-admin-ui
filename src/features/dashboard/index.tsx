import { LayoutDashboard, BarChart2 } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import DashboardPage from './pages/DashboardPage';

export const dashboardModule: Module = {
    id: 'dashboard',
    name: 'Main',
    routes: [
        {
            path: 'dashboard',
            element: <DashboardPage />,
        },
        {
            path: '', // Default route
            element: <DashboardPage />,
        }
    ],
    navItems: [
        { icon: LayoutDashboard, label: 'Dashboard', path: 'dashboard' },
        { icon: BarChart2, label: 'Analytics', path: 'analytics' },
    ]
};
