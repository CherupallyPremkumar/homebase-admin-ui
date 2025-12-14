import { NotificationsDropdown } from '../../layout/components/NotificationsDropdown';
import { ProfileDropdown } from '../../layout/components/ProfileDropdown';
import { Search, Moon, Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SellerSelector } from '@/components/SellerSelector';

/**
 * SellerHeader - Shop-focused header for Sellers
 * Shows shop name (read-only) and essential tools
 */
export function SellerHeader() {
    return (
        <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-3.5">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">Shop Manager</h2>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Search className="h-5 w-5" />
                    </Button>
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                        <Moon className="h-5 w-5" />
                    </Button>

                    {/* Shop Name (read-only) */}
                    <div className="mx-2">
                        <SellerSelector />
                    </div>

                    <NotificationsDropdown />
                    <div className="h-8 w-px bg-border mx-2"></div>
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
