import { ShoppingCart, Truck, FileText, RotateCcw } from 'lucide-react';
import { Module } from '@/lib/module-registry';
import OrdersPage from './pages/OrdersPage';

export const ordersModule: Module = {
    id: 'orders',
    name: 'Sales',
    routes: [
        {
            path: 'orders',
            element: <OrdersPage />,
        }
    ],
    navItems: [
        { icon: ShoppingCart, label: 'Orders', path: 'orders' },
        { icon: Truck, label: 'Shipments', path: 'shipments' },
        { icon: FileText, label: 'Invoices', path: 'invoices' },
        { icon: RotateCcw, label: 'Returns', path: 'returns' },
    ]
};
