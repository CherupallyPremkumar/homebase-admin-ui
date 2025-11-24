/**
 * Order API
 * Handles all order-related API calls
 */

import { Order, OrderStatus } from '@/types';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock data for development
let mockOrders: Order[] = [
  {
    id: 'ORD001',
    customerName: 'Sarah Johnson',
    customerEmail: 'sarah@example.com',
    items: [
      { productId: '1', productName: 'Handwoven Basket', quantity: 2, price: 45.99 },
    ],
    total: 91.98,
    status: 'pending',
    createdAt: '2024-02-15T10:30:00Z',
    updatedAt: '2024-02-15T10:30:00Z',
  },
  {
    id: 'ORD002',
    customerName: 'Michael Chen',
    customerEmail: 'michael@example.com',
    items: [
      { productId: '2', productName: 'Ceramic Vase', quantity: 1, price: 32.50 },
      { productId: '3', productName: 'Wooden Wall Art', quantity: 1, price: 89.99 },
    ],
    total: 122.49,
    status: 'shipped',
    createdAt: '2024-02-14T14:20:00Z',
    updatedAt: '2024-02-15T09:00:00Z',
  },
];

/**
 * Order API Class
 */
class OrderAPI {
  /**
   * Get all orders
   */
  async getAll(): Promise<Order[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockOrders);
    }
    return httpClient.get<Order[]>('/orders');
  }

  /**
   * Get order by ID
   */
  async getById(id: string): Promise<Order> {
    if (apiConfig.useMockData) {
      const order = mockOrders.find(o => o.id === id);
      if (!order) throw new Error('Order not found');
      return mockDelay(order);
    }
    return httpClient.get<Order>(`/orders/${id}`);
  }

  /**
   * Update order status
   */
  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    if (apiConfig.useMockData) {
      const index = mockOrders.findIndex(o => o.id === id);
      if (index === -1) throw new Error('Order not found');
      
      mockOrders[index] = {
        ...mockOrders[index],
        status,
        updatedAt: new Date().toISOString(),
      };
      return mockDelay(mockOrders[index]);
    }
    return httpClient.patch<Order>(`/orders/${id}/status`, { status });
  }
}

// Export singleton instance
export const orderApi = new OrderAPI();
