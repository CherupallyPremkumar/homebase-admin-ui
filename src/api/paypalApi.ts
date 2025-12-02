/**
 * PayPal API for Global Sellers
 * Handles seller onboarding for countries not supported by Stripe/Razorpay
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface PayPalAccount {
    accountId: string;
    onboardingUrl: string;
    isComplete: boolean;
}

export interface PayPalAccountStatus {
    accountId: string;
    isVerified: boolean;
    emailConfirmed: boolean;
    canReceivePayments: boolean;
}

class PayPalApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Create a PayPal partner account
     */
    async createAccount(sellerId: string, email: string): Promise<PayPalAccount> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockAccountId = `paypal_${Date.now()}`;
            const mockOnboardingUrl = `/sellers/onboarding/paypal-simulator?account=${mockAccountId}`;

            console.log('Mock PayPal account created:', {
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

        const response = await fetch(`${API_BASE_URL}/api/sellers/paypal/account`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ sellerId, email }),
        });

        if (!response.ok) {
            throw new Error('Failed to create PayPal account');
        }

        return response.json();
    }

    /**
     * Get PayPal account status
     */
    async getAccountStatus(sellerId: string): Promise<PayPalAccountStatus> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                accountId: `paypal_${sellerId}`,
                isVerified: true,
                emailConfirmed: true,
                canReceivePayments: true,
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/${sellerId}/paypal/status`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch PayPal account status');
        }

        return response.json();
    }
}

export const paypalApi = new PayPalApiService();
