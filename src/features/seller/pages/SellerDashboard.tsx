import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Package, ShoppingCart, DollarSign, Users, RefreshCw } from "lucide-react";
import { DailyStatsCard } from "@/features/dashboard/components/DailyStatsCard";
import { HourlySalesChart } from "@/features/dashboard/components/HourlySalesChart";
import { RecentOrdersWidget } from "@/features/dashboard/components/RecentOrdersWidget";
import { TopProductsTable } from "@/features/dashboard/components/TopProductsTable";
import { dashboardApi } from "@/features/dashboard/api/dashboard.api";
import { DashboardMetrics } from "@/types";
import { LoadingState } from "@/components/shared/LoadingState";
import { ErrorState } from "@/components/shared/ErrorState";
import { PageHeader } from "@/components/shared/PageHeader";
import { DateRangePicker } from "@/components/shared/DateRangePicker";
import { DateRange, DateRangePreset, getPresetDateRange } from "@/utils/date-range";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const { tenantId } = useAuth();
  const navigate = useNavigate();
  const [dateRange, setDateRange] = useState<DateRange>(() => getPresetDateRange(DateRangePreset.TODAY));
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadData();
  }, [dateRange, tenantId]);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadData(true); // Silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, dateRange, tenantId]);

  const loadData = async (silent = false) => {
    try {
      if (!silent) {
        setIsLoading(true);
        setError(null);
      }

      const data = await dashboardApi.getDailyMetrics(dateRange, tenantId || undefined);
      setMetrics(data);
      setLastUpdated(new Date());
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Failed to load dashboard data';
      setError(message);
    } finally {
      if (!silent) {
        setIsLoading(false);
      }
    }
  };

  const handleRefresh = () => {
    loadData();
  };

  if (isLoading) {
    return <LoadingState message="Loading dashboard data..." />;
  }

  if (error || !metrics) {
    return (
      <ErrorState
        message={error || 'Failed to load dashboard data'}
        onRetry={loadData}
      />
    );
  }

  const { daily, hourly, recentOrders, topProducts } = metrics;

  return (
    <div className="space-y-6 animate-in-stagger" role="main" aria-label="Dashboard">
      <PageHeader
        title="Dashboard"
        description={`Last updated: ${lastUpdated.toLocaleTimeString()}`}
      >
        <div className="flex items-center gap-3">
          <DateRangePicker value={dateRange} onChange={setDateRange} />
          <Button
            variant="outline"
            size="sm"
            onClick={handleRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </PageHeader>

      {/* Daily Stats Grid */}
      <section
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        aria-label="Daily statistics"
      >
        <DailyStatsCard
          title="Today's Sales"
          value={daily.sales}
          valuePrefix="$"
          icon={DollarSign}
          comparison={daily.comparison?.sales}
          className="bg-white"
        />
        <DailyStatsCard
          title="Today's Orders"
          value={daily.orders}
          icon={ShoppingCart}
          comparison={daily.comparison?.orders}
          className="bg-white"
          onClick={() => navigate('/orders')}
        />
        <DailyStatsCard
          title="Today's Revenue"
          value={daily.revenue}
          valuePrefix="$"
          icon={Package}
          comparison={daily.comparison?.revenue}
          className="bg-white"
        />
        <DailyStatsCard
          title="Today's Customers"
          value={daily.customers}
          icon={Users}
          comparison={daily.comparison?.customers}
          className="bg-white"
          onClick={() => navigate('/customers')}
        />
      </section>

      {/* Hourly Breakdown */}
      <section className="grid grid-cols-1 gap-6">
        <HourlySalesChart data={hourly} />
      </section>

      {/* Recent Orders & Top Products */}
      <section className="grid grid-cols-1 lg:grid-cols-8 gap-6">
        <RecentOrdersWidget
          orders={recentOrders}
          autoRefresh={autoRefresh}
          onOrderClick={(orderId) => {
            // Navigate to order details
            console.log('View order:', orderId);
          }}
        />
        <div className="lg:col-span-5">
          <TopProductsTable />
        </div>
      </section>
    </div>
  );
}
