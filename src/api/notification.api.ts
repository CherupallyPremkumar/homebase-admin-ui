/**
 * Notification API
 * Handles notification management
 */

import { Notification, NotificationStats } from '@/types/notification';
import { httpClient, apiConfig, mockDelay } from './base';

// Mock notifications data
let mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'order',
    title: 'New Order Received',
    message: 'Order #ORD001 from Sarah Johnson - $91.98',
    read: false,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    link: '/orders',
  },
  {
    id: '2',
    type: 'product',
    title: 'Low Stock Alert',
    message: 'Ceramic Vase stock is running low (8 remaining)',
    read: false,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    link: '/products',
  },
  {
    id: '3',
    type: 'product',
    title: 'Product Added',
    message: 'New product "Wooden Wall Art" has been added',
    read: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    link: '/products',
  },
  {
    id: '4',
    type: 'category',
    title: 'Category Updated',
    message: 'Storage category has been updated',
    read: true,
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    link: '/categories',
  },
  {
    id: '5',
    type: 'system',
    title: 'System Maintenance',
    message: 'Scheduled maintenance on Sunday at 2 AM',
    read: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

/**
 * Notification API Class
 */
class NotificationAPI {
  /**
   * Get all notifications
   */
  async getAll(): Promise<Notification[]> {
    if (apiConfig.useMockData) {
      return mockDelay(mockNotifications);
    }
    return httpClient.get<Notification[]>('/notifications');
  }

  /**
   * Get notification statistics
   */
  async getStats(): Promise<NotificationStats> {
    if (apiConfig.useMockData) {
      const stats: NotificationStats = {
        unreadCount: mockNotifications.filter(n => !n.read).length,
        totalCount: mockNotifications.length,
      };
      return mockDelay(stats);
    }
    return httpClient.get<NotificationStats>('/notifications/stats');
  }

  /**
   * Mark notification as read
   */
  async markAsRead(id: string): Promise<void> {
    if (apiConfig.useMockData) {
      const notification = mockNotifications.find(n => n.id === id);
      if (notification) {
        notification.read = true;
      }
      return mockDelay(undefined);
    }
    return httpClient.patch<void>(`/notifications/${id}/read`);
  }

  /**
   * Mark all notifications as read
   */
  async markAllAsRead(): Promise<void> {
    if (apiConfig.useMockData) {
      mockNotifications.forEach(n => n.read = true);
      return mockDelay(undefined);
    }
    return httpClient.patch<void>('/notifications/read-all');
  }

  /**
   * Create new notification
   */
  async create(notification: Omit<Notification, 'id' | 'createdAt'>): Promise<Notification> {
    if (apiConfig.useMockData) {
      const newNotification: Notification = {
        ...notification,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
      };
      mockNotifications.unshift(newNotification);
      return mockDelay(newNotification);
    }
    return httpClient.post<Notification>('/notifications', notification);
  }
}

// Export singleton instance
export const notificationApi = new NotificationAPI();
