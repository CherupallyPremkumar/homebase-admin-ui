// DTOs and Types for Admin Dashboard

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  imageUrl: string;
  category: string;
  tags: string[];
  rating: number;
  featured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  productCount: number;
}

export interface Tag {
  id: string;
  name: string;
  slug: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone?: string;
  orderCount: number;
  totalSpent: number;
  createdAt: string;
}

export interface DashboardStats {
  totalProducts: number;
  totalOrders: number;
  totalSales: number;
  lowStockProducts: number;
  todaysOrders: number;
  shippedOrders: number;
}

export interface TenantTheme {
  primaryColor: string;
  secondaryColor: string;
  logo?: string;
  brandName: string;
}

// Daily Dashboard Types

export interface DailyStats {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
  customers: number;
  averageOrderValue: number;
  comparison?: ComparisonMetric;
}

export interface HourlyData {
  hour: number;
  sales: number;
  orders: number;
  revenue: number;
}

export interface ComparisonMetric {
  value: number;
  percentage: number;
  isPositive: boolean;
  label: string;
}

export interface RecentOrder {
  id: string;
  customerName: string;
  customerEmail: string;
  total: number;
  status: OrderStatus;
  itemCount: number;
  createdAt: string;
  timeAgo: string;
}

export interface DashboardMetrics {
  daily: DailyStats;
  hourly: HourlyData[];
  recentOrders: RecentOrder[];
  topProducts: TopProduct[];
}

export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  orders: number;
  imageUrl?: string;
}

