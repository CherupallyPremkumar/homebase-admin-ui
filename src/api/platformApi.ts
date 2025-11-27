/**
 * Platform Analytics API
 * Provides platform-wide metrics for Super Admin dashboard
 */

// Mock data for platform-wide analytics
const MOCK_PLATFORM_STATS = {
    totalSellers: 150,
    activeSellers: 127,
    totalProducts: 4850,
    totalOrders: 12340,
    totalRevenue: 524800,
    monthlyRevenue: 89500,
    monthlyGrowth: 12.5,
    newSellersThisMonth: 8,
};

const MOCK_TOP_SELLERS = [
    { id: 'SELLER-001', name: "John's Crafts", revenue: 12500, orders: 345, products: 78, growth: 15.3 },
    { id: 'SELLER-002', name: 'Premium Pottery', revenue: 9800, orders: 267, products: 45, growth: 8.7 },
    { id: 'SELLER-003', name: 'Vintage Vault', revenue: 7200, orders: 198, products: 92, growth: -2.1 },
    { id: 'SELLER-004', name: 'Artisan Jewelry Co.', revenue: 6800, orders: 156, products: 134, growth: 22.4 },
    { id: 'SELLER-005', name: 'Handwoven Textiles', revenue: 5900, orders: 143, products: 67, growth: 5.2 },
];

const MOCK_RECENT_ACTIVITIES = [
    { id: '1', type: 'new_seller', message: 'New seller "Crafty Creations" joined', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString() },
    { id: '2', type: 'milestone', message: 'Platform crossed $500K revenue milestone', timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString() },
    { id: '3', type: 'alert', message: '3 sellers pending approval', timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString() },
    { id: '4', type: 'order', message: '100+ orders processed today', timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString() },
];

const MOCK_REVENUE_TREND = [
    { month: 'Jul', revenue: 65000 },
    { month: 'Aug', revenue: 72000 },
    { month: 'Sep', revenue: 79500 },
    { month: 'Oct', revenue: 84200 },
    { month: 'Nov', revenue: 89500 },
];

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface PlatformStats {
    totalSellers: number;
    activeSellers: number;
    totalProducts: number;
    totalOrders: number;
    totalRevenue: number;
    monthlyRevenue: number;
    monthlyGrowth: number;
    newSellersThisMonth: number;
}

export interface TopSeller {
    id: string;
    name: string;
    revenue: number;
    orders: number;
    products: number;
    growth: number;
}

export interface Activity {
    id: string;
    type: 'new_seller' | 'milestone' | 'alert' | 'order';
    message: string;
    timestamp: string;
}

export interface RevenueTrend {
    month: string;
    revenue: number;
}

class PlatformApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        const headers: HeadersInit = {
            'Authorization': `Bearer ${token}`,
        };

        const tenantId = localStorage.getItem('userTenantId');
        if (tenantId) {
            headers['x-tenant-id'] = tenantId;
        }

        return headers;
    }

    /**
     * Get platform-wide statistics
     */
    async getPlatformStats(): Promise<PlatformStats> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_PLATFORM_STATS;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/platform/stats`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch platform stats');
        }

        return response.json();
    }

    /**
     * Get top performing sellers
     */
    async getTopSellers(limit = 10): Promise<TopSeller[]> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_TOP_SELLERS.slice(0, limit);
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/platform/top-sellers?limit=${limit}`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch top sellers');
        }

        return response.json();
    }

    /**
     * Get recent platform activities
     */
    async getRecentActivities(limit = 20): Promise<Activity[]> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_RECENT_ACTIVITIES.slice(0, limit);
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/platform/activities?limit=${limit}`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch activities');
        }

        return response.json();
    }

    /**
     * Get revenue trend over time
     */
    async getRevenueTrend(months = 6): Promise<RevenueTrend[]> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_REVENUE_TREND.slice(-months);
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/platform/revenue-trend?months=${months}`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch revenue trend');
        }

        return response.json();
    }
}

export const platformApi = new PlatformApiService();
