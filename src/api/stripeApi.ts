/**
 * Stripe Connect API for Seller Payments
 * Handles seller onboarding and payout setup
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface StripeConnectAccount {
    accountId: string;
    onboardingUrl: string;
    isComplete: boolean;
}

export interface StripeAccountStatus {
    accountId: string;
    isVerified: boolean;
    payoutsEnabled: boolean;
    chargesEnabled: boolean;
    detailsSubmitted: boolean;
}

class StripeApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Create a Stripe Connect account for a seller
     * Returns onboarding URL to redirect seller to Stripe
     */
    async createConnectAccount(sellerId: string, email: string): Promise<StripeConnectAccount> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            // Simulate Stripe Connect account creation
            const mockAccountId = `acct_mock_${Date.now()}`;
            const mockOnboardingUrl = `/sellers/onboarding/stripe-simulator?account=${mockAccountId}`;

            console.log('Mock Stripe Connect account created:', {
                sellerId,
                email,
                accountId: mockAccountId,
            });

            return {
                accountId: mockAccountId,
                onboardingUrl: mockOnboardingUrl,
                isComplete: false,
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/stripe/connect`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ sellerId, email }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Stripe Connect account');
        }

        return response.json();
    }

    /**
     * Get Stripe account status for a seller
     */
    async getAccountStatus(sellerId: string): Promise<StripeAccountStatus> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));

            // Simulate verified account
            return {
                accountId: `acct_mock_${sellerId}`,
                isVerified: true,
                payoutsEnabled: true,
                chargesEnabled: true,
                detailsSubmitted: true,
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/${sellerId}/stripe/status`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Stripe account status');
        }

        return response.json();
    }

    /**
     * Create a new onboarding link if the previous one expired
     */
    async refreshOnboardingLink(sellerId: string): Promise<string> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 500));
            return `/sellers/onboarding/stripe-simulator?account=acct_mock_${sellerId}`;
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/${sellerId}/stripe/refresh-link`, {
            method: 'POST',
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to refresh onboarding link');
        }

        const data = await response.json();
        return data.onboardingUrl;
    }
}

export const stripeApi = new StripeApiService();
