import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { notificationsApi } from '@/services/api';
import { Notification } from '@/types/notification';

interface NotificationContextType {
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt'>) => Promise<void>;
  refreshNotifications: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const addNotification = useCallback(async (notification: Omit<Notification, 'id' | 'createdAt'>) => {
    try {
      await notificationsApi.create(notification);
      setRefreshTrigger(prev => prev + 1);
    } catch (error) {
      console.error('Failed to create notification:', error);
    }
  }, []);

  const refreshNotifications = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification, refreshNotifications }}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotificationContext() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotificationContext must be used within NotificationProvider');
  }
  return context;
}

// Hook to trigger notifications for CRUD actions
export function useNotificationTrigger() {
  const { addNotification } = useNotificationContext();

  const notifyProductAdded = (productName: string) => {
    addNotification({
      type: 'product',
      title: 'Product Added',
      message: `New product "${productName}" has been added to inventory`,
      read: false,
      link: '/products',
    });
  };

  const notifyProductUpdated = (productName: string) => {
    addNotification({
      type: 'product',
      title: 'Product Updated',
      message: `Product "${productName}" has been updated`,
      read: false,
      link: '/products',
    });
  };

  const notifyProductDeleted = (productName: string) => {
    addNotification({
      type: 'product',
      title: 'Product Deleted',
      message: `Product "${productName}" has been removed from inventory`,
      read: false,
      link: '/products',
    });
  };

  const notifyCategoryAdded = (categoryName: string) => {
    addNotification({
      type: 'category',
      title: 'Category Created',
      message: `New category "${categoryName}" has been created`,
      read: false,
      link: '/categories',
    });
  };

  const notifyCategoryUpdated = (categoryName: string) => {
    addNotification({
      type: 'category',
      title: 'Category Updated',
      message: `Category "${categoryName}" has been updated`,
      read: false,
      link: '/categories',
    });
  };

  const notifyCategoryDeleted = (categoryName: string) => {
    addNotification({
      type: 'category',
      title: 'Category Deleted',
      message: `Category "${categoryName}" has been removed`,
      read: false,
      link: '/categories',
    });
  };

  const notifyOrderStatusChanged = (orderId: string, status: string) => {
    addNotification({
      type: 'order',
      title: 'Order Status Updated',
      message: `Order ${orderId} status changed to ${status}`,
      read: false,
      link: '/orders',
    });
  };

  const notifyLowStock = (productName: string, stock: number) => {
    addNotification({
      type: 'product',
      title: 'Low Stock Alert',
      message: `${productName} stock is running low (${stock} remaining)`,
      read: false,
      link: '/products',
    });
  };

  return {
    notifyProductAdded,
    notifyProductUpdated,
    notifyProductDeleted,
    notifyCategoryAdded,
    notifyCategoryUpdated,
    notifyCategoryDeleted,
    notifyOrderStatusChanged,
    notifyLowStock,
  };
}
