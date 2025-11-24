/**
 * API Module Exports
 * Central export point for all API modules
 */

// Base HTTP client and utilities
export {
  httpClient,
  apiConfig,
  mockDelay,
  withAuthHeaders,
  handleApiError,
  retryRequest,
  logApiPerformance,
  getTenantId,
  getAuthToken,
} from './base';

export type {
  ApiConfig,
  ApiError,
  RequestConfig,
} from './base';

// API modules
export { productApi } from './product.api';
export { orderApi } from './order.api';
export { categoryApi, tagApi } from './category.api';
export { customerApi } from './customer.api';
export { dashboardApi } from '@/features/dashboard/api/dashboard.api';
export { profileApi } from './profile.api';
export { notificationApi } from './notification.api';
export { partnerApi } from './partner.api';

// Import for legacy compatibility
import { productApi } from './product.api';
import { orderApi } from './order.api';
import { categoryApi, tagApi } from './category.api';
import { customerApi } from './customer.api';
import { dashboardApi } from '@/features/dashboard/api/dashboard.api';
import { profileApi } from './profile.api';
import { notificationApi } from './notification.api';
import { partnerApi } from './partner.api';

// Legacy compatibility exports (static references - no dynamic imports)
export const productsApi = {
  getAll: () => productApi.getAll(),
  getById: (id: string) => productApi.getById(id),
  create: (data: any) => productApi.create(data),
  update: (id: string, data: any) => productApi.update(id, data),
  delete: (id: string) => productApi.delete(id),
};

export const ordersApi = {
  getAll: () => orderApi.getAll(),
  getById: (id: string) => orderApi.getById(id),
  updateStatus: (id: string, status: any) => orderApi.updateStatus(id, status),
};

export const categoriesApi = {
  getAll: () => categoryApi.getAll(),
  create: (data: any) => categoryApi.create(data),
  update: (id: string, data: any) => categoryApi.update(id, data),
  delete: (id: string) => categoryApi.delete(id),
};

export const tagsApi = {
  getAll: () => tagApi.getAll(),
  create: (data: any) => tagApi.create(data),
  delete: (id: string) => tagApi.delete(id),
};

export const customersApi = {
  getAll: () => customerApi.getAll(),
};

// Use different export name to avoid conflict
export const dashboardApiCompat = {
  getStats: () => dashboardApi.getStats(),
};

export const profileApiCompat = {
  get: () => profileApi.get(),
  update: (data: any) => profileApi.update(data),
  uploadAvatar: (file: File) => profileApi.uploadAvatar(file),
};

export const notificationsApi = {
  getAll: () => notificationApi.getAll(),
  getStats: () => notificationApi.getStats(),
  markAsRead: (id: string) => notificationApi.markAsRead(id),
  markAllAsRead: () => notificationApi.markAllAsRead(),
  create: (data: any) => notificationApi.create(data),
};

export const partnersApi = {
  register: (data: any) => partnerApi.register(data),
  verifyEmail: (token: string) => partnerApi.verifyEmail(token),
  resendVerification: (email: string) => partnerApi.resendVerification(email),
  getApplicationStatus: (partnerId: string) => partnerApi.getApplicationStatus(partnerId),
};
