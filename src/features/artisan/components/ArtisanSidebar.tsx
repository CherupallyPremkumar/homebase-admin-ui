import { NavLink, useParams } from 'react-router-dom';
import { Hammer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';

/**
 * ArtisanSidebar - Minimal navigation for Artisans
 * Shows only Dashboard (My Workbench)
 */
export function ArtisanSidebar() {
    const { tenant } = useParams<{ tenant: string }>();

    const storeName = 'My Workbench';

    return (
        <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-border/50">
                <div className="flex items-center gap-2 text-primary font-bold text-xl">
                    <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white">
                        <Hammer className="h-5 w-5" />
                    </div>
                    <span className="text-foreground truncate">{storeName}</span>
                </div>
            </div>

            {/* Navigation */}
            <ScrollArea className="flex-1 py-4">
                <div className="px-4 space-y-6">
                    <div>
                        <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground/70 tracking-wider uppercase">
                            Production
                        </h3>
                        <div className="space-y-1">
                            <NavLink
                                to="dashboard"
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
                                    <Hammer className="h-4 w-4" />
                                    <span>My Tasks</span>
                                </div>
                            </NavLink>
                        </div>
                    </div>

                    {/* Help Section */}
                    <div className="mt-8 px-3 py-4 bg-muted/50 rounded-lg">
                        <h4 className="text-sm font-medium mb-2">Need Help?</h4>
                        <p className="text-xs text-muted-foreground">
                            Contact your shop manager for task assignments or questions.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </aside>
    );
}
