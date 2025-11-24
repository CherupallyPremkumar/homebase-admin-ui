// Notification Types

export type NotificationType = 'order' | 'product' | 'category' | 'system';

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
  link?: string;
}

export interface NotificationStats {
  unreadCount: number;
  totalCount: number;
}
