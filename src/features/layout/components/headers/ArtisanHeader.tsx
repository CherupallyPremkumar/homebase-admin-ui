import { ProfileDropdown } from '../ProfileDropdown';
import { Bell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

/**
 * ArtisanHeader - Minimal header for Artisans
 * Shows only essential actions and profile
 */
export function ArtisanHeader() {
    return (
        <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
            <div className="flex items-center justify-between px-6 py-3.5">
                {/* Left side */}
                <div className="flex items-center gap-4">
                    <h2 className="text-lg font-semibold">My Workbench</h2>
                    <Badge variant="outline" className="text-xs">
                        Artisan
                    </Badge>
                </div>

                {/* Right side - Actions */}
                <div className="flex items-center gap-2">
                    {/* Notifications */}
                    <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary relative">
                        <Bell className="h-5 w-5" />
                        <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 text-white text-xs flex items-center justify-center">
                            2
                        </span>
                    </Button>

                    <div className="h-8 w-px bg-border mx-2"></div>
                    <ProfileDropdown />
                </div>
            </div>
        </header>
    );
}
