/**
 * Product TypeScript Types
 * Matches backend CreateProductCommand and related DTOs
 */

import { CreatePriceCommand } from './pricing.types'

export interface CreateProductCommand {
    name: string
    description: string
    categoryId: string
    tags?: string[]
    primaryImage?: ProductImage
    productAttributes?: Record<string, string>
    variants: CreateVariantCommand[]
}

export interface CreateVariantCommand {
    sku: string
    title?: string
    featureDescription?: string
    attributes: VariantAttributeDTO[]
    prices: CreatePriceCommand[]
    inventory?: CreateInventoryCommand
    shippingProfiles?: CreateShippingProfileCommand[]
    primaryImageUrl?: string
    imageUrls?: string[]
}

export interface CreateInventoryCommand {
    quantityAvailable: number
    quantityReserved: number
    isBackOrderAllowed: boolean
}

export interface VariantAttributeDTO {
    attributeName: string
    attributeValue: string
}

export interface CreateShippingProfileCommand {
    weight: number
    weightUnit: string
    dimensions: ShippingDimensions
    shippingClass?: string
    handlingTime?: number
}

export interface ShippingDimensions {
    length: number
    width: number
    height: number
    unit: string
}

export interface ProductImage {
    url: string
    altText?: string
    isPrimary?: boolean
}

export enum ProductStatus {
    DRAFT = 'DRAFT',
    PENDING_REVIEW = 'PENDING_REVIEW',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    ARCHIVED = 'ARCHIVED'
}

export enum VariantStatus {
    DRAFT = 'DRAFT',
    ACTIVE = 'ACTIVE',
    INACTIVE = 'INACTIVE',
    OUT_OF_STOCK = 'OUT_OF_STOCK'
}

// UI-specific types
export interface ProductFormData {
    basicInfo: {
        name: string
        description: string
        categoryId: string
        tags: string[]
    }
    variants: VariantFormData[]
    images: {
        primary?: File
        additional: File[]
    }
}

export interface VariantFormData {
    id?: string
    sku: string
    name?: string
    attributes: VariantAttributeDTO[]
    pricing: CreatePriceCommand
    shipping?: CreateShippingProfileCommand
    images: {
        primary?: string
        additional: string[]
    }
}

export const WEIGHT_UNITS = ['kg', 'lb', 'g', 'oz'] as const
export const DIMENSION_UNITS = ['cm', 'in', 'm', 'ft'] as const

export const COMMON_ATTRIBUTES = [
    { name: 'Color', values: ['Red', 'Blue', 'Green', 'Black', 'White'] },
    { name: 'Size', values: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
    { name: 'Material', values: ['Cotton', 'Polyester', 'Wool', 'Silk', 'Leather'] },
    { name: 'Style', values: ['Casual', 'Formal', 'Sport', 'Vintage'] }
] as const
