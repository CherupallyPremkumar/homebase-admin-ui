/**
 * Dashboard API
 * Handles dashboard statistics and analytics with date range support
 */

import { DashboardStats, DashboardMetrics, DailyStats, HourlyData, RecentOrder, TopProduct } from '@/types';
import { httpClient, apiConfig, mockDelay } from '@/api/base';
import { DateRange, formatDateRangeForAPI, getComparisonPeriod } from '@/utils/date-range';
import { calculateComparison } from '@/utils/comparison';
import { formatDistanceToNow } from 'date-fns';

/**
 * Dashboard API Class
 */
class DashboardAPI {
  /**
   * Get dashboard statistics (legacy - for backwards compatibility)
   */
  async getStats(): Promise<DashboardStats> {
    if (apiConfig.useMockData) {
      const stats: DashboardStats = {
        totalProducts: 3,
        totalOrders: 2,
        totalSales: 214.47,
        lowStockProducts: 1,
        todaysOrders: 5,
        shippedOrders: 12,
      };
      return mockDelay(stats);
    }
    return httpClient.get<DashboardStats>('/dashboard/stats');
  }

  /**
   * Get daily dashboard metrics for a date range
   */
  async getDailyMetrics(dateRange: DateRange, tenantId?: string): Promise<DashboardMetrics> {
    if (apiConfig.useMockData) {
      // Generate mock data
      const currentStats: DailyStats = {
        date: dateRange.startDate.toISOString(),
        sales: 1234.56,
        orders: 45,
        revenue: 5678.90,
        customers: 38,
        averageOrderValue: 27.43,
      };

      // Calculate comparison with previous period
      const comparisonPeriod = getComparisonPeriod(dateRange);
      const previousStats = {
        sales: 1100.00,
        orders: 40,
        revenue: 5200.00,
        customers: 35,
      };

      currentStats.comparison = {
        sales: calculateComparison(currentStats.sales, previousStats.sales, 'vs previous period'),
        orders: calculateComparison(currentStats.orders, previousStats.orders, 'vs previous period'),
        revenue: calculateComparison(currentStats.revenue, previousStats.revenue, 'vs previous period'),
        customers: calculateComparison(currentStats.customers, previousStats.customers, 'vs previous period'),
      };

      const hourlyData: HourlyData[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        sales: Math.floor(Math.random() * 100) + 20,
        orders: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 500) + 100,
      }));

      const recentOrders: RecentOrder[] = [
        {
          id: '1',
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          total: 125.50,
          status: 'pending',
          itemCount: 3,
          createdAt: new Date(Date.now() - 1000 * 60 * 5).toISOString(),
          timeAgo: '5 minutes ago',
        },
        {
          id: '2',
          customerName: 'Jane Smith',
          customerEmail: 'jane@example.com',
          total: 89.99,
          status: 'processing',
          itemCount: 2,
          createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
          timeAgo: '15 minutes ago',
        },
        {
          id: '3',
          customerName: 'Bob Johnson',
          customerEmail: 'bob@example.com',
          total: 234.00,
          status: 'shipped',
          itemCount: 5,
          createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
          timeAgo: '30 minutes ago',
        },
      ];

      const topProducts: TopProduct[] = [
        {
          id: '1',
          name: 'Handmade Ceramic Vase',
          sales: 45,
          revenue: 2250.00,
          orders: 45,
        },
        {
          id: '2',
          name: 'Artisan Wooden Bowl',
          sales: 32,
          revenue: 1280.00,
          orders: 32,
        },
        {
          id: '3',
          name: 'Woven Wall Hanging',
          sales: 28,
          revenue: 1680.00,
          orders: 28,
        },
      ];

      return mockDelay({
        daily: currentStats,
        hourly: hourlyData,
        recentOrders,
        topProducts,
      });
    }

    const { startDate, endDate } = formatDateRangeForAPI(dateRange);
    const params = new URLSearchParams({
      startDate,
      endDate,
      ...(tenantId && { tenantId }),
    });

    return httpClient.get<DashboardMetrics>(`/dashboard/metrics?${params}`);
  }

  /**
   * Get hourly breakdown for a specific date
   */
  async getHourlyData(date: Date, tenantId?: string): Promise<HourlyData[]> {
    if (apiConfig.useMockData) {
      const hourlyData: HourlyData[] = Array.from({ length: 24 }, (_, hour) => ({
        hour,
        sales: Math.floor(Math.random() * 100) + 20,
        orders: Math.floor(Math.random() * 10) + 1,
        revenue: Math.floor(Math.random() * 500) + 100,
      }));
      return mockDelay(hourlyData);
    }

    const params = new URLSearchParams({
      date: date.toISOString(),
      ...(tenantId && { tenantId }),
    });

    return httpClient.get<HourlyData[]>(`/dashboard/hourly?${params}`);
  }

  /**
   * Get recent orders
   */
  async getRecentOrders(limit: number = 10, tenantId?: string): Promise<RecentOrder[]> {
    if (apiConfig.useMockData) {
      const orders: RecentOrder[] = Array.from({ length: Math.min(limit, 10) }, (_, i) => ({
        id: `order-${i + 1}`,
        customerName: `Customer ${i + 1}`,
        customerEmail: `customer${i + 1}@example.com`,
        total: Math.floor(Math.random() * 300) + 50,
        status: ['pending', 'processing', 'shipped', 'delivered'][Math.floor(Math.random() * 4)] as any,
        itemCount: Math.floor(Math.random() * 5) + 1,
        createdAt: new Date(Date.now() - 1000 * 60 * (i * 10 + 5)).toISOString(),
        timeAgo: formatDistanceToNow(new Date(Date.now() - 1000 * 60 * (i * 10 + 5)), { addSuffix: true }),
      }));
      return mockDelay(orders);
    }

    const params = new URLSearchParams({
      limit: limit.toString(),
      ...(tenantId && { tenantId }),
    });

    return httpClient.get<RecentOrder[]>(`/dashboard/recent-orders?${params}`);
  }
}

// Export singleton instance
export const dashboardApi = new DashboardAPI();
