/**
 * Product API
 * Handles all product-related API calls
 */

import { Product } from '@/types';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock data for development
let mockProducts: Product[] = [
  {
    id: '1',
    name: 'Handwoven Basket',
    description: 'Beautiful handwoven basket perfect for storage',
    price: 45.99,
    stock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?w=400',
    category: 'Storage',
    tags: ['handmade', 'natural'],
    rating: 4.5,
    featured: true,
    createdAt: '2024-01-15',
    updatedAt: '2024-01-15',
  },
  {
    id: '2',
    name: 'Ceramic Vase',
    description: 'Elegant ceramic vase with modern design',
    price: 32.50,
    stock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1578500494198-246f612d3b3d?w=400',
    category: 'Decorative',
    tags: ['ceramic', 'modern'],
    rating: 4.8,
    featured: false,
    createdAt: '2024-01-20',
    updatedAt: '2024-01-20',
  },
  {
    id: '3',
    name: 'Wooden Wall Art',
    description: 'Rustic wooden wall art piece',
    price: 89.99,
    stock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?w=400',
    category: 'Wall Art',
    tags: ['wood', 'rustic'],
    rating: 4.3,
    featured: true,
    createdAt: '2024-02-01',
    updatedAt: '2024-02-01',
  },
];

/**
 * Product API Class
 */
class ProductAPI {
  /**
   * Get all products
   */
  async getAll(): Promise<Product[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockProducts);
    }
    return httpClient.get<Product[]>('/products');
  }

  /**
   * Get product by ID
   */
  async getById(id: string): Promise<Product> {
    if (apiConfig.useMockData) {
      const product = mockProducts.find(p => p.id === id);
      if (!product) throw new Error('Product not found');
      return mockDelay(product);
    }
    return httpClient.get<Product>(`/products/${id}`);
  }

  /**
   * Create new product
   */
  async create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<Product> {
    if (apiConfig.useMockData) {
      const newProduct: Product = {
        ...product,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      mockProducts.push(newProduct);
      return mockDelay(newProduct);
    }
    return httpClient.post<Product>('/products', product);
  }

  /**
   * Update product
   */
  async update(id: string, product: Partial<Product>): Promise<Product> {
    if (apiConfig.useMockData) {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index === -1) throw new Error('Product not found');
      
      mockProducts[index] = {
        ...mockProducts[index],
        ...product,
        updatedAt: new Date().toISOString(),
      };
      return mockDelay(mockProducts[index]);
    }
    return httpClient.put<Product>(`/products/${id}`, product);
  }

  /**
   * Delete product
   */
  async delete(id: string): Promise<void> {
    if (apiConfig.useMockData) {
      const index = mockProducts.findIndex(p => p.id === id);
      if (index !== -1) {
        mockProducts.splice(index, 1);
      }
      return mockDelay(undefined);
    }
    return httpClient.delete<void>(`/products/${id}`);
  }
}

// Export singleton instance
export const productApi = new ProductAPI();
