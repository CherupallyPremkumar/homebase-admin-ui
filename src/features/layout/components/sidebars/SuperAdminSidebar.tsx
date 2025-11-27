import { NavLink, useParams } from 'react-router-dom';
import { Users, BarChart2, Settings, Shield, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * SuperAdminSidebar - Platform management navigation
 * Shows platform-wide features: Sellers, Analytics, Settings
 * Does NOT show product/order management (that's seller-specific)
 */
export function SuperAdminSidebar() {
    const { tenant } = useParams<{ tenant: string }>();

    const storeName = 'Platform Admin';

    const menuItems = [
        { icon: BarChart2, label: 'Dashboard', path: 'dashboard' },
        { icon: Store, label: 'Sellers', path: 'sellers' },
        { icon: Users, label: 'All Customers', path: 'customers' },
        { icon: BarChart2, label: 'Analytics', path: 'analytics' },
        { icon: Shield, label: 'Platform Settings', path: 'settings' },
    ];

    return (
        <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Shield className="h-5 w-5" />
                    </div>
                    <span className="text-foreground truncate">{storeName}</span>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <div className="px-4 space-y-6">
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground/70 tracking-wider uppercase">
                            Platform Management
                        </h3>
                        <div className="space-y-1">
                            {menuItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    to={item.path}
                                    className={({ isActive }) =>
                                        cn(
                                            "flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                                            isActive
                                                ? "bg-primary/10 text-primary"
                                                : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                        )
                                    }
                                >
                                    <div className="flex items-center gap-3">
                                        <item.icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 px-3 py-4 bg-blue-50 rounded-lg border border-blue-200">
                        <h4 className="text-sm font-medium text-blue-900 mb-2">💡 Tip</h4>
                        <p className="text-xs text-blue-700">
                            Select a seller from the top bar to manage their shop.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
