import { NotificationsDropdown } from './NotificationsDropdown';
import { ProfileDropdown } from './ProfileDropdown';
import { Menu, Search, Moon, Globe, Grid, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="sticky top-0 z-20 bg-white border-b border-border shadow-sm">
      <div className="flex items-center justify-between px-6 py-3.5">
        {/* Left side - Breadcrumbs */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="lg:hidden">
            <Menu className="h-5 w-5" />
          </Button>

          <div className="hidden md:flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-4 w-4" />
            </Button>
            <span className="text-foreground font-medium">Home</span>
            <ChevronRight className="h-4 w-4" />
            <span>Apps</span>
            <ChevronRight className="h-4 w-4" />
            <span>Pages</span>
            <ChevronRight className="h-4 w-4" />
            <span>Auths</span>
          </div>
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
