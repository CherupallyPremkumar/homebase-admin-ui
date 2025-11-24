import { Settings, UserCog } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';

export const settingsModule: Module = {
    id: 'settings',
    name: 'Settings',
    routes: [
        {
            path: 'settings',
            element: <ProtectedRoute requiredRole="super_admin"><SettingsPage /></ProtectedRoute>,
        },
        {
            path: 'profile',
            element: <ProfilePage />,
        }
    ],
    navItems: [
        { icon: Settings, label: 'Store Settings', path: 'settings' },
        { icon: UserCog, label: 'Team', path: 'team' },
    ]
};
