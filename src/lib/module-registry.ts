import { RouteObject } from 'react-router-dom';
import { LucideIcon } from 'lucide-react';

export interface NavItem {
    label: string;
    path: string;
    icon?: LucideIcon;
    children?: NavItem[];
    permissions?: string[];
}

export interface Module {
    id: string;
    name: string;
    routes: RouteObject[];
    navItems: NavItem[];
    permissions?: string[];
}

class ModuleRegistry {
    private modules: Map<string, Module> = new Map();

    register(module: Module) {
        if (this.modules.has(module.id)) {
            console.warn(`Module ${module.id} is already registered.`);
            return;
        }
        this.modules.set(module.id, module);
    }

    getRoutes(): RouteObject[] {
        const routes: RouteObject[] = [];
        this.modules.forEach((module) => {
            routes.push(...module.routes);
        });
        return routes;
    }

    getNavItems(): { title: string; items: NavItem[] }[] {
        // Group nav items by module name (or a custom group property if we added one)
        // For now, we'll just return a flat list wrapped in groups based on the module name
        const groups: { title: string; items: NavItem[] }[] = [];

        this.modules.forEach((module) => {
            if (module.navItems.length > 0) {
                groups.push({
                    title: module.name.toUpperCase(),
                    items: module.navItems,
                });
            }
        });

        return groups;
    }

    getAllModules(): Module[] {
        return Array.from(this.modules.values());
    }
}

export const moduleRegistry = new ModuleRegistry();
