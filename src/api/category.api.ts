/**
 * Category & Tag API
 * Handles category and tag-related API calls
 */

import { Category, Tag } from '@/types';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock data for development
let mockCategories: Category[] = [
  { id: '1', name: 'Storage', slug: 'storage', description: 'Storage solutions', productCount: 12 },
  { id: '2', name: 'Decorative', slug: 'decorative', description: 'Decorative items', productCount: 25 },
  { id: '3', name: 'Wall Art', slug: 'wall-art', description: 'Wall decorations', productCount: 18 },
  { id: '4', name: 'Furniture', slug: 'furniture', description: 'Home furniture', productCount: 8 },
];

let mockTags: Tag[] = [
  { id: '1', name: 'Handmade', slug: 'handmade' },
  { id: '2', name: 'Natural', slug: 'natural' },
  { id: '3', name: 'Ceramic', slug: 'ceramic' },
  { id: '4', name: 'Modern', slug: 'modern' },
  { id: '5', name: 'Rustic', slug: 'rustic' },
];

/**
 * Category API Class
 */
class CategoryAPI {
  /**
   * Get all categories
   */
  async getAll(): Promise<Category[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockCategories);
    }
    return httpClient.get<Category[]>('/categories');
  }

  /**
   * Create new category
   */
  async create(category: Omit<Category, 'id' | 'productCount'>): Promise<Category> {
    if (apiConfig.useMockData) {
      const newCategory: Category = {
        ...category,
        id: Date.now().toString(),
        productCount: 0,
      };
      mockCategories.push(newCategory);
      return mockDelay(newCategory);
    }
    return httpClient.post<Category>('/categories', category);
  }

  /**
   * Update category
   */
  async update(id: string, category: Partial<Category>): Promise<Category> {
    if (apiConfig.useMockData) {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index === -1) throw new Error('Category not found');
      
      mockCategories[index] = { ...mockCategories[index], ...category };
      return mockDelay(mockCategories[index]);
    }
    return httpClient.put<Category>(`/categories/${id}`, category);
  }

  /**
   * Delete category
   */
  async delete(id: string): Promise<void> {
    if (apiConfig.useMockData) {
      const index = mockCategories.findIndex(c => c.id === id);
      if (index !== -1) {
        mockCategories.splice(index, 1);
      }
      return mockDelay(undefined);
    }
    return httpClient.delete<void>(`/categories/${id}`);
  }
}

/**
 * Tag API Class
 */
class TagAPI {
  /**
   * Get all tags
   */
  async getAll(): Promise<Tag[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockTags);
    }
    return httpClient.get<Tag[]>('/tags');
  }

  /**
   * Create new tag
   */
  async create(tag: Omit<Tag, 'id'>): Promise<Tag> {
    if (apiConfig.useMockData) {
      const newTag: Tag = {
        ...tag,
        id: Date.now().toString(),
      };
      mockTags.push(newTag);
      return mockDelay(newTag);
    }
    return httpClient.post<Tag>('/tags', tag);
  }

  /**
   * Delete tag
   */
  async delete(id: string): Promise<void> {
    if (apiConfig.useMockData) {
      const index = mockTags.findIndex(t => t.id === id);
      if (index !== -1) {
        mockTags.splice(index, 1);
      }
      return mockDelay(undefined);
    }
    return httpClient.delete<void>(`/tags/${id}`);
  }
}

// Export singleton instances
export const categoryApi = new CategoryAPI();
export const tagApi = new TagAPI();
