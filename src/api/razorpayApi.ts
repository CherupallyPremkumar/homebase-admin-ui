/**
 * Razorpay Route API for Indian Sellers
 * Handles seller onboarding and payout setup for India
 */

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';
const USE_MOCK = import.meta.env.VITE_USE_MOCK_DATA !== 'false';

export interface RazorpayAccount {
    accountId: string;
    onboardingUrl: string;
    isComplete: boolean;
}

export interface RazorpayAccountStatus {
    accountId: string;
    isVerified: boolean;
    kycStatus: 'pending' | 'verified' | 'rejected';
    bankAccountLinked: boolean;
    canReceivePayments: boolean;
}

class RazorpayApiService {
    private getHeaders(): HeadersInit {
        const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
        return {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        };
    }

    /**
     * Create a Razorpay Route account for Indian seller
     */
    async createAccount(sellerId: string, email: string, phone: string): Promise<RazorpayAccount> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 1000));

            const mockAccountId = `razorpay_${Date.now()}`;
            const mockOnboardingUrl = `/sellers/onboarding/razorpay-simulator?account=${mockAccountId}`;

            console.log('Mock Razorpay account created:', {
                sellerId,
                email,
                phone,
                accountId: mockAccountId,
            });

            return {
                accountId: mockAccountId,
                onboardingUrl: mockOnboardingUrl,
                isComplete: false,
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/razorpay/account`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify({ sellerId, email, phone }),
        });

        if (!response.ok) {
            throw new Error('Failed to create Razorpay account');
        }

        return response.json();
    }

    /**
     * Get Razorpay account status
     */
    async getAccountStatus(sellerId: string): Promise<RazorpayAccountStatus> {
        if (USE_MOCK) {
            await new Promise(resolve => setTimeout(resolve, 300));

            return {
                accountId: `razorpay_${sellerId}`,
                isVerified: true,
                kycStatus: 'verified',
                bankAccountLinked: true,
                canReceivePayments: true,
            };
        }

        const response = await fetch(`${API_BASE_URL}/api/sellers/${sellerId}/razorpay/status`, {
            headers: this.getHeaders(),
        });

        if (!response.ok) {
            throw new Error('Failed to fetch Razorpay account status');
        }

        return response.json();
    }
}

export const razorpayApi = new RazorpayApiService();
