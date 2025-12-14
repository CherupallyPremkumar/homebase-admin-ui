/**
 * Payment Gateway Types
 * Defines supported payment gateways and their configurations
 */

export type PaymentGateway = 'razorpay' | 'stripe' | 'paypal';

export interface PaymentGatewayConfig {
    id: PaymentGateway;
    name: string;
    description: string;
    supportedCountries: string[];
    logo: string;
    color: string;
}

export const PAYMENT_GATEWAYS: Record<PaymentGateway, PaymentGatewayConfig> = {
    razorpay: {
        id: 'razorpay',
        name: 'Razorpay',
        description: 'For sellers in India',
        supportedCountries: ['IN'],
        logo: '🇮🇳',
        color: 'bg-blue-600',
    },
    stripe: {
        id: 'stripe',
        name: 'Stripe',
        description: 'For international sellers',
        supportedCountries: ['US', 'GB', 'CA', 'AU', 'NZ', 'SG', 'HK', 'JP', 'FR', 'DE', 'IT', 'ES', 'NL', 'BE', 'AT', 'CH', 'SE', 'NO', 'DK', 'FI', 'IE', 'PT', 'PL'],
        logo: '💳',
        color: 'bg-purple-600',
    },
    paypal: {
        id: 'paypal',
        name: 'PayPal',
        description: 'Available worldwide',
        supportedCountries: ['*'], // Wildcard for all countries
        logo: '🌐',
        color: 'bg-blue-500',
    },
};

/**
 * Get the recommended payment gateway for a country
 */
export const getPaymentGatewayForCountry = (countryCode: string): PaymentGateway => {
    // India → Razorpay
    if (countryCode === 'IN') {
        return 'razorpay';
    }

    // Stripe-supported countries
    if (PAYMENT_GATEWAYS.stripe.supportedCountries.includes(countryCode)) {
        return 'stripe';
    }

    // Fallback to PayPal for all other countries
    return 'paypal';
};

/**
 * List of countries with their codes
 */
export const COUNTRIES = [
    { code: 'IN', name: 'India', flag: '🇮🇳' },
    { code: 'US', name: 'United States', flag: '🇺🇸' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦' },
    { code: 'AU', name: 'Australia', flag: '🇦🇺' },
    { code: 'SG', name: 'Singapore', flag: '🇸🇬' },
    { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪' },
    { code: 'FR', name: 'France', flag: '🇫🇷' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸' },
    { code: 'NL', name: 'Netherlands', flag: '🇳🇱' },
    { code: 'JP', name: 'Japan', flag: '🇯🇵' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽' },
    // Add more as needed
];
