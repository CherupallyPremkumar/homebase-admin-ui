import { stripeApi } from './stripeApi';
import { razorpayApi } from './razorpayApi';
import { paypalApi } from './paypalApi';
import { PaymentGateway } from '@/types/payment.types';

/**
 * Unified Payment Gateway API
 * Abstracts the specific payment gateway implementation
 */

export interface PaymentAccountResult {
    gateway: PaymentGateway;
    accountId: string;
    onboardingUrl: string;
    isComplete: boolean;
}

export interface PaymentAccountStatus {
    gateway: PaymentGateway;
    accountId: string;
    isVerified: boolean;
    canReceivePayments: boolean;
}

class PaymentGatewayService {
    /**
     * Create a payment account using the appropriate gateway
     */
    async createAccount(
        gateway: PaymentGateway,
        sellerId: string,
        email: string,
        phone?: string
    ): Promise<PaymentAccountResult> {
        let result;

        switch (gateway) {
            case 'razorpay':
                if (!phone) {
                    throw new Error('Phone number required for Razorpay');
                }
                result = await razorpayApi.createAccount(sellerId, email, phone);
                break;

            case 'stripe':
                result = await stripeApi.createConnectAccount(sellerId, email);
                break;

            case 'paypal':
                result = await paypalApi.createAccount(sellerId, email);
                break;

            default:
                throw new Error(`Unsupported payment gateway: ${gateway}`);
        }

        return {
            gateway,
            ...result,
        };
    }

    /**
     * Get payment account status
     */
    async getAccountStatus(
        gateway: PaymentGateway,
        sellerId: string
    ): Promise<PaymentAccountStatus> {
        let status;

        switch (gateway) {
            case 'razorpay':
                status = await razorpayApi.getAccountStatus(sellerId);
                return {
                    gateway,
                    accountId: status.accountId,
                    isVerified: status.isVerified,
                    canReceivePayments: status.canReceivePayments,
                };

            case 'stripe':
                status = await stripeApi.getAccountStatus(sellerId);
                return {
                    gateway,
                    accountId: status.accountId,
                    isVerified: status.isVerified,
                    canReceivePayments: status.payoutsEnabled,
                };

            case 'paypal':
                status = await paypalApi.getAccountStatus(sellerId);
                return {
                    gateway,
                    accountId: status.accountId,
                    isVerified: status.isVerified,
                    canReceivePayments: status.canReceivePayments,
                };

            default:
                throw new Error(`Unsupported payment gateway: ${gateway}`);
        }
    }
}

export const paymentGatewayService = new PaymentGatewayService();
