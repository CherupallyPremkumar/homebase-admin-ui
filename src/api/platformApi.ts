import { Seller, SellerStatus } from '@/types/seller.types';

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

const MOCK_SELLERS: Seller[] = [
    {
        id: 'SELLER-001',
        name: "John's Crafts",
        email: 'john@johnscrafts.com',
        phone: '+1 (555) 123-4567',
        address: '123 Craft Lane, Artisan City, AC 12345',
        status: 'ACTIVE' as SellerStatus,
        revenue: 12500,
        orders: 345,
        products: 78,
        growth: 15.3,
        createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 88 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'SELLER-002',
        name: 'Premium Pottery',
        email: 'contact@premiumpottery.com',
        phone: '+1 (555) 234-5678',
        status: 'ACTIVE' as SellerStatus,
        revenue: 9800,
        orders: 267,
        products: 45,
        growth: 8.7,
        createdAt: new Date(Date.now() - 120 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 118 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'SELLER-003',
        name: 'Vintage Vault',
        email: 'hello@vintagevault.com',
        phone: '+1 (555) 345-6789',
        status: 'PENDING' as SellerStatus,
        revenue: 0,
        orders: 0,
        products: 0,
        growth: 0,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'SELLER-004',
        name: 'Artisan Jewelry Co.',
        email: 'info@artisanjewelry.com',
        phone: '+1 (555) 456-7890',
        status: 'PENDING' as SellerStatus,
        revenue: 0,
        orders: 0,
        products: 0,
        growth: 0,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
        id: 'SELLER-005',
        name: 'Handwoven Textiles',
        email: 'sales@handwoventextiles.com',
        phone: '+1 (555) 567-8901',
        status: 'SUSPENDED' as SellerStatus,
        revenue: 5900,
        orders: 143,
        products: 67,
        growth: 5.2,
        createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
        approvedAt: new Date(Date.now() - 178 * 24 * 60 * 60 * 1000).toISOString(),
        suspendedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        suspensionReason: 'Multiple customer complaints pending investigation',
    },
];

const MOCK_RECENT_ACTIVITIES: Activity[] = [
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
            return MOCK_SELLERS.filter(s => s.status === 'ACTIVE').slice(0, limit) as TopSeller[];
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
    /**
     * Get all sellers
     */
    async getSellers(): Promise<Seller[]> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));
            return MOCK_SELLERS;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/sellers`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch sellers');
        }

        return response.json();
    }

    /**
     * Approve a seller
     */
    async approveSeller(sellerId: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const seller = MOCK_SELLERS.find(s => s.id === sellerId);
            if (seller) {
                seller.status = 'ACTIVE';
                seller.approvedAt = new Date().toISOString();
            }
            console.log('Approved seller:', sellerId);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/sellers/${sellerId}/approve`, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to approve seller');
        }
    }

    /**
     * Reject a seller
     */
    async rejectSeller(sellerId: string, reason?: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const seller = MOCK_SELLERS.find(s => s.id === sellerId);
            if (seller) {
                seller.status = 'REJECTED';
                seller.rejectedAt = new Date().toISOString();
                seller.rejectionReason = reason;
            }
            console.log('Rejected seller:', sellerId, reason);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/sellers/${sellerId}/reject`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(),
            },
            body: JSON.stringify({ reason }),
        });

        if (!response.ok) {
            throw new Error('Failed to reject seller');
        }
    }

    /**
     * Suspend a seller
     */
    async suspendSeller(sellerId: string, reason?: string): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            const seller = MOCK_SELLERS.find(s => s.id === sellerId);
            if (seller) {
                seller.status = 'SUSPENDED';
                seller.suspendedAt = new Date().toISOString();
                seller.suspensionReason = reason;
            }
            console.log('Suspended seller:', sellerId, reason);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/sellers/${sellerId}/suspend`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(),
            },
            body: JSON.stringify({ reason }),
        });

        if (!response.ok) {
            throw new Error('Failed to suspend seller');
        }
    }

    /**
     * Create a new seller
     */
    async createSeller(data: {
        name: string;
        email: string;
        phone?: string;
        address?: string;
        bankAccount?: {
            accountNumber: string;
            ifscCode: string;
            accountHolderName?: string;
        };
    }): Promise<void> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            console.log('Creating seller:', data);
            return;
        }

        const response = await fetch(`${API_BASE_URL}/api/admin/sellers`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders(),
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'Failed to create seller');
        }
    }
}

export const platformApi = new PlatformApiService();
