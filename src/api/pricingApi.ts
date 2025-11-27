/**
 * Pricing API Service
 * Connects to Java Spring Boot backend pricing endpoints
 */

import {
    CreatePriceCommand,
    PriceCalculationContext,
    PriceCalculationResult
} from '@/types/pricing.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

class PricingApiService {
    private baseUrl = `${API_BASE_URL}/api/prices`

    /**
     * Create a new price with regional pricing and rules
     */
    async createPrice(data: CreatePriceCommand): Promise<any> {
        const response = await fetch(this.baseUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`Failed to create price: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Calculate final price with all rules applied
     */
    async calculatePrice(
        priceId: string,
        context: PriceCalculationContext
    ): Promise<PriceCalculationResult> {
        const params = new URLSearchParams(context as any)
        const response = await fetch(
            `${this.baseUrl}/${priceId}/calculate?${params}`,
            {
                headers: {
                    'Authorization': `Bearer ${this.getToken()}`
                }
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to calculate price: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Update existing price
     */
    async updatePrice(priceId: string, data: Partial<CreatePriceCommand>): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${priceId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`Failed to update price: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get price history
     */
    async getPriceHistory(priceId: string): Promise<any[]> {
        const response = await fetch(`${this.baseUrl}/${priceId}/history`, {
            headers: {
                'Authorization': `Bearer ${this.getToken()}`
            }
        })

        if (!response.ok) {
            throw new Error(`Failed to get price history: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Add regional price to existing price
     */
    async addRegionalPrice(priceId: string, regionalPrice: any): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${priceId}/regional`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(regionalPrice)
        })

        if (!response.ok) {
            throw new Error(`Failed to add regional price: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Add price rule to existing price
     */
    async addPriceRule(priceId: string, rule: any): Promise<any> {
        const response = await fetch(`${this.baseUrl}/${priceId}/rules`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.getToken()}`
            },
            body: JSON.stringify(rule)
        })

        if (!response.ok) {
            throw new Error(`Failed to add price rule: ${response.statusText}`)
        }

        return response.json()
    }

    private getToken(): string {
        // Get token from localStorage or context
        return localStorage.getItem('authToken') || ''
    }
}

export const pricingApi = new PricingApiService()
