/**
 * Customer API
 * Handles customer-related API calls
 */

import { Customer } from '@/types';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock data for development
let mockCustomers: Customer[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@example.com',
    phone: '+1234567890',
    orderCount: 5,
    totalSpent: 450.00,
    createdAt: '2024-01-10',
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'michael@example.com',
    orderCount: 3,
    totalSpent: 320.00,
    createdAt: '2024-01-15',
  },
];

/**
 * Customer API Class
 */
class CustomerAPI {
  /**
   * Get all customers
   */
  async getAll(): Promise<Customer[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockCustomers);
    }
    return httpClient.get<Customer[]>('/customers');
  }

  /**
   * Get customer by ID
   */
  async getById(id: string): Promise<Customer> {
    if (apiConfig.useMockData) {
      const customer = mockCustomers.find(c => c.id === id);
      if (!customer) throw new Error('Customer not found');
      return mockDelay(customer);
    }
    return httpClient.get<Customer>(`/customers/${id}`);
  }
}

// Export singleton instance
export const customerApi = new CustomerAPI();
