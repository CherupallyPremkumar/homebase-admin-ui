/**
 * Pricing TypeScript Types
 * Matches backend CreatePriceCommand and related DTOs
 */

export interface CreatePriceCommand {
    id?: string
    variantId: string
    listPrice: number
    currentPrice: number
    currency: string
    discountAmount?: number
    discountPercent?: number
    primePrice?: number
    subscribeSavePrice?: number
    subscribeSavePercent?: number
    effectiveFrom?: string
    effectiveTo?: string
    regionalPrices?: CreateRegionalPriceCommand[]
    priceRules?: CreatePriceRuleCommand[]
}

export interface CreateRegionalPriceCommand {
    region: string
    currency: string
    priceAmount: number
    taxRate?: number
    includesTax?: boolean
    effectiveFrom?: string
    effectiveTo?: string
}

export interface CreatePriceRuleCommand {
    ruleType: PriceRuleType
    ruleCondition: string // JSON string
    adjustmentType: AdjustmentType
    adjustmentValue: number
    priority?: number
    validFrom?: string
    validUntil?: string
}

export enum PriceRuleType {
    BASE_PRICE = 'BASE_PRICE',
    BULK_DISCOUNT = 'BULK_DISCOUNT',
    SEASONAL = 'SEASONAL',
    DYNAMIC = 'DYNAMIC',
    PROMOTIONAL = 'PROMOTIONAL',
    CUSTOMER_SEGMENT = 'CUSTOMER_SEGMENT',
    LOCATION_BASED = 'LOCATION_BASED',
    TIME_BASED = 'TIME_BASED'
}

export enum AdjustmentType {
    PERCENTAGE_OFF = 'PERCENTAGE_OFF',
    FIXED_AMOUNT_OFF = 'FIXED_AMOUNT_OFF',
    FIXED_PRICE = 'FIXED_PRICE',
    PERCENTAGE_MARKUP = 'PERCENTAGE_MARKUP',
    FIXED_AMOUNT_MARKUP = 'FIXED_AMOUNT_MARKUP'
}

export interface PriceCalculationContext {
    quantity: number
    customerSegment?: string
    region?: string
    isPrimeMember?: boolean
    promoCode?: string
}

export interface PriceCalculationResult {
    basePrice: number
    finalPrice: number
    appliedRules: string[]
    discount: number
    currency: string
}

// UI-specific types
export interface RegionalPriceFormData extends CreateRegionalPriceCommand {
    id?: string
}

export interface PriceRuleFormData extends CreatePriceRuleCommand {
    id?: string
    name?: string
    description?: string
}

export const SUPPORTED_CURRENCIES = [
    { code: 'USD', symbol: '$', name: 'US Dollar' },
    { code: 'GBP', symbol: '£', name: 'British Pound' },
    { code: 'EUR', symbol: '€', name: 'Euro' },
    { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar' },
    { code: 'AUD', symbol: 'A$', name: 'Australian Dollar' },
    { code: 'JPY', symbol: '¥', name: 'Japanese Yen' },
    { code: 'INR', symbol: '₹', name: 'Indian Rupee' }
] as const

export const SUPPORTED_REGIONS = [
    { code: 'US', name: 'United States', currency: 'USD', taxRate: 0 },
    { code: 'UK', name: 'United Kingdom', currency: 'GBP', taxRate: 20 },
    { code: 'EU', name: 'European Union', currency: 'EUR', taxRate: 19 },
    { code: 'CA', name: 'Canada', currency: 'CAD', taxRate: 13 },
    { code: 'AU', name: 'Australia', currency: 'AUD', taxRate: 10 },
    { code: 'JP', name: 'Japan', currency: 'JPY', taxRate: 10 },
    { code: 'IN', name: 'India', currency: 'INR', taxRate: 18 }
] as const
