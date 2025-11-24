import { NavLink, useLocation, useParams } from 'react-router-dom';
import {
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useState } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { moduleRegistry } from '@/lib/module-registry';

export function Sidebar() {
  const location = useLocation();
  const { tenant } = useParams<{ tenant: string }>();
  const [openItems, setOpenItems] = useState<string[]>(['products']);

  const storeName = tenant ? tenant.charAt(0).toUpperCase() + tenant.slice(1) : 'Store';
  const storeInitial = storeName.charAt(0);

  const menuGroups = moduleRegistry.getNavItems();

  const toggleItem = (path: string) => {
    setOpenItems(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <aside className="w-64 bg-white border-r border-border h-screen sticky top-0 flex flex-col">
      {/* Logo */}
      <div className="h-16 flex items-center px-6 border-b border-border/50">
        <div className="flex items-center gap-2 text-primary font-bold text-xl">
          <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center text-white uppercase">
            {storeInitial}
          </div>
          <span className="text-foreground truncate">{storeName}</span>
        </div>
      </div>

      {/* Navigation */}
      <ScrollArea className="flex-1 py-4">
        <div className="px-4 space-y-6">
          {menuGroups.map((group, i) => (
            <div key={i}>
              <h3 className="mb-2 px-2 text-xs font-semibold text-muted-foreground/70 tracking-wider uppercase">
                {group.title}
              </h3>
              <div className="space-y-1">
                {group.items.map((item) => {
                  if (item.children) {
                    const isOpen = openItems.includes(item.path);
                    const isActive = location.pathname.startsWith('/' + item.path);

                    return (
                      <Collapsible
                        key={item.path}
                        open={isOpen}
                        onOpenChange={() => toggleItem(item.path)}
                      >
                        <CollapsibleTrigger className={cn(
                          "flex items-center justify-between w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                          isActive
                            ? "bg-primary/5 text-primary"
                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                        )}>
                          <div className="flex items-center gap-3">
                            {item.icon && <item.icon className="h-4 w-4" />}
                            <span>{item.label}</span>
                          </div>
                          {isOpen ? (
                            <ChevronDown className="h-4 w-4 opacity-50" />
                          ) : (
                            <ChevronRight className="h-4 w-4 opacity-50" />
                          )}
                        </CollapsibleTrigger>
                        <CollapsibleContent className="pl-9 space-y-1 pt-1">
                          {item.children.map((child) => (
                            <NavLink
                              key={child.path}
                              to={child.path}
                              className={({ isActive }) =>
                                cn(
                                  "block px-3 py-2 rounded-lg text-sm transition-colors",
                                  isActive
                                    ? "text-primary font-medium bg-primary/10"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                                )
                              }
                            >
                              {child.label}
                            </NavLink>
                          ))}
                        </CollapsibleContent>
                      </Collapsible>
                    );
                  }

                  return (
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
                        {item.icon && <item.icon className="h-4 w-4" />}
                        <span>{item.label}</span>
                      </div>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </aside>
  );
}
