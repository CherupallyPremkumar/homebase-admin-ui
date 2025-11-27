import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

/**
 * HierarchyContext manages the 3-tier organizational structure:
 * - Tenant (Platform/Company)
 * - Seller (Shop/Vendor)
 * - Artisan (Maker/Worker)
 * 
 * Rules:
 * - Super Admin: Can select any seller and artisan
 * - Seller: Locked to their own sellerId, can select artisans
 * - Artisan: Locked to both sellerId and artisanId
 */

interface HierarchyContextType {
    currentSellerId: string | null;
    currentArtisanId: string | null;
    setSellerId: (id: string) => void;
    setArtisanId: (id: string) => void;
    availableSellers: Seller[];
    availableArtisans: Artisan[];
}

interface Seller {
    id: string;
    name: string;
}

interface Artisan {
    id: string;
    name: string;
    sellerId: string;
}

const HierarchyContext = createContext<HierarchyContextType | undefined>(undefined);

// Mock data for demo (replace with API calls)
const MOCK_SELLERS: Seller[] = [
    { id: 'SELLER-001', name: "John's Crafts" },
    { id: 'SELLER-002', name: "Premium Pottery" },
    { id: 'SELLER-003', name: "Vintage Vault" },
];

const MOCK_ARTISANS: Artisan[] = [
    { id: 'ARTISAN-001', name: 'Alice Potter', sellerId: 'SELLER-001' },
    { id: 'ARTISAN-002', name: 'Bob Weaver', sellerId: 'SELLER-001' },
    { id: 'ARTISAN-003', name: 'Carol Smith', sellerId: 'SELLER-002' },
];

export function HierarchyProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    // Initialize based on user role
    const [currentSellerId, setCurrentSellerIdState] = useState<string | null>(() => {
        if (!user) return null;

        // Seller or Artisan: Use their own sellerId
        if (user.sellerId) {
            return user.sellerId;
        }

        // Super Admin: Restore from localStorage or default to first seller
        return localStorage.getItem('currentSellerId') || MOCK_SELLERS[0]?.id || null;
    });

    const [currentArtisanId, setCurrentArtisanIdState] = useState<string | null>(() => {
        if (!user) return null;

        // Artisan: Use their own artisanId
        if (user.artisanId) {
            return user.artisanId;
        }

        // Super Admin or Seller: No artisan selected by default
        return null;
    });

    // Sync with user changes
    useEffect(() => {
        if (!user) return;

        if (user.sellerId) {
            setCurrentSellerIdState(user.sellerId);
        }

        if (user.artisanId) {
            setCurrentArtisanIdState(user.artisanId);
        }
    }, [user]);

    // Persist seller selection for Super Admin only
    useEffect(() => {
        if (user?.role === 'super_admin' && currentSellerId) {
            localStorage.setItem('currentSellerId', currentSellerId);
        }
    }, [currentSellerId, user?.role]);

    // Persist artisan selection
    useEffect(() => {
        if (currentArtisanId) {
            localStorage.setItem('currentArtisanId', currentArtisanId);
        } else {
            localStorage.removeItem('currentArtisanId');
        }
    }, [currentArtisanId]);

    const setSellerId = (id: string) => {
        // Only Super Admin can change seller
        if (user?.role === 'super_admin') {
            setCurrentSellerIdState(id || null);
            setCurrentArtisanIdState(null); // Reset artisan when seller changes

            // Clear from localStorage if empty (platform mode)
            if (!id) {
                localStorage.removeItem('currentSellerId');
            }
        }
    };

    const setArtisanId = (id: string) => {
        // Super Admin and Seller can change artisan
        if (user?.role === 'super_admin' || user?.role === 'seller') {
            setCurrentArtisanIdState(id);
        }
    };

    // Filter artisans by current seller
    const availableArtisans = currentSellerId
        ? MOCK_ARTISANS.filter(a => a.sellerId === currentSellerId)
        : [];

    return (
        <HierarchyContext.Provider
            value={{
                currentSellerId,
                currentArtisanId,
                setSellerId,
                setArtisanId,
                availableSellers: MOCK_SELLERS,
                availableArtisans,
            }}
        >
            {children}
        </HierarchyContext.Provider>
    );
}

export function useHierarchy() {
    const context = useContext(HierarchyContext);
    if (context === undefined) {
        throw new Error('useHierarchy must be used within a HierarchyProvider');
    }
    return context;
}

// Backwards compatibility alias
export const SellerProvider = HierarchyProvider;
export const useSeller = useHierarchy;
