/**
 * Seller Types and Interfaces
 */

export type SellerStatus = 'PENDING' | 'ACTIVE' | 'SUSPENDED' | 'REJECTED';

export interface Seller {
    id: string;
    name: string;
    email: string;
    phone?: string;
    address?: string;
    description?: string;
    status: SellerStatus;
    createdAt: string;
    approvedAt?: string;
    rejectedAt?: string;
    suspendedAt?: string;
    rejectionReason?: string;
    suspensionReason?: string;

    // Metrics (from existing TopSeller interface)
    revenue?: number;
    orders?: number;
    products?: number;
    growth?: number;
}

export interface SellerStatusBadgeProps {
    status: SellerStatus;
}

export const SELLER_STATUS_CONFIG: Record<SellerStatus, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; className: string }> = {
    PENDING: {
        label: 'Pending',
        variant: 'outline',
        className: 'bg-yellow-50 text-yellow-700 border-yellow-200'
    },
    ACTIVE: {
        label: 'Active',
        variant: 'outline',
        className: 'bg-green-50 text-green-700 border-green-200'
    },
    SUSPENDED: {
        label: 'Suspended',
        variant: 'outline',
        className: 'bg-orange-50 text-orange-700 border-orange-200'
    },
    REJECTED: {
        label: 'Rejected',
        variant: 'outline',
        className: 'bg-red-50 text-red-700 border-red-200'
    }
};
