/**
 * @deprecated This file is kept for backward compatibility only.
 * Please use the new API modules from '@/api' instead.
 * 
 * Migration guide:
 * - Old: import { productsApi } from '@/services/api'
 * - New: import { productApi } from '@/api'
 * 
 * The new API structure provides:
 * - Better organization with separate modules
 * - Enhanced error handling and retry logic
 * - Type-safe HTTP client
 * - Performance monitoring
 * - Automatic authentication
 */

// Re-export from new API modules for backward compatibility
export {
  productsApi,
  ordersApi,
  categoriesApi,
  tagsApi,
  customersApi,
  notificationsApi,
} from '@/api';

// Re-export with original names
export { dashboardApiCompat as dashboardApi, profileApiCompat as profileApi } from '@/api';
