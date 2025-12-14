/**
 * Product API Service
 * Connects to Java Spring Boot backend product orchestration endpoints
 * Backend uses ProductContext which wraps CreateProductCommand
 */

import { CreateProductCommand } from '@/types/product.types'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

class ProductApiService {
    // Product orchestration endpoint
    private baseUrl = `${API_BASE_URL}/api/product-orchestration`

    /**
     * Create a new product with variants and pricing
     * Backend wraps this in ProductContext automatically
     */
    async createProduct(data: CreateProductCommand): Promise<any> {
        const response = await fetch(`${this.baseUrl}/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders()
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            const error = await response.json()
            throw new Error(error.message || `Failed to create product: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get product by ID
     */
    async getProduct(productId: string): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Failed to get product: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Update product
     */
    async updateProduct(productId: string, data: Partial<CreateProductCommand>): Promise<any> {
        const response = await fetch(`${API_BASE_URL}/api/products/${productId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                ...this.getHeaders()
            },
            body: JSON.stringify(data)
        })

        if (!response.ok) {
            throw new Error(`Failed to update product: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get all products with pagination
     */
    async getProducts(page = 0, size = 20): Promise<any> {
        const response = await fetch(
            `${API_BASE_URL}/api/products?page=${page}&size=${size}`,
            {
                headers: this.getHeaders()
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to get products: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Upload product images
     */
    async uploadImages(files: File[]): Promise<string[]> {
        const formData = new FormData()
        files.forEach(file => formData.append('files', file))

        const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: formData
        })

        if (!response.ok) {
            throw new Error(`Failed to upload images: ${response.statusText}`)
        }

        return response.json()
    }

    /**
     * Get categories
     */
    async getCategories(): Promise<any[]> {
        const response = await fetch(`${API_BASE_URL}/api/categories`, {
            headers: this.getHeaders()
        })

        if (!response.ok) {
            throw new Error(`Failed to get categories: ${response.statusText}`)
        }

        return response.json()
    }

    private getToken(): string {
        return localStorage.getItem('authToken') || ''
    }

    private getHeaders(): HeadersInit {
        const headers: HeadersInit = {
            'Authorization': `Bearer ${this.getToken()}`
        }

        // Get tenant ID (always required)
        const tenantId = localStorage.getItem('userTenantId')
        if (tenantId) {
            headers['x-tenant-id'] = tenantId
        }

        // Get seller ID (from context or user profile)
        const sellerId = localStorage.getItem('currentSellerId')
        if (sellerId) {
            headers['x-seller-id'] = sellerId
        }

        // Get artisan ID (if applicable)
        const artisanId = localStorage.getItem('currentArtisanId')
        if (artisanId) {
            headers['x-artisan-id'] = artisanId
        }

        return headers
    }
}

export const productApi = new ProductApiService()
