import { NotificationsDropdown } from '../NotificationsDropdown';
import { ProfileDropdown } from '../ProfileDropdown';
import { Search, Moon, Globe, Grid } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SellerSelector } from '@/components/SellerSelector';

/**
 * SuperAdminHeader - Full-featured header for Super Admins
 * Includes Seller Selector and all platform tools
 */
export function SuperAdminHeader() {
    return (
        <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-3.5">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Platform Admin</h2>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Moon className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Globe className="h-5 w-5" />
                    </Button>

                    {/* Seller Selector */}
                    <div className="mx-2">
                        <SellerSelector />
                    </div>

                    <NotificationsDropdown />
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Grid className="h-5 w-5" />
                    </Button>
                    <div className="h-8 w-px bg-border mx-2"></div>
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
