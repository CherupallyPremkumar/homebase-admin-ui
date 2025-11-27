import { useEffect, useState } from 'react';
import { platformApi, PlatformStats, TopSeller, Activity } from '@/api/platformApi';
import { StatCard } from '@/components/StatCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
    Users,
    Package,
    ShoppingCart,
    DollarSign,
    TrendingUp,
    Store,
    ArrowUp,
    ArrowDown,
    AlertCircle,
    CheckCircle,
    Bell
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SuperAdminDashboard() {
    const [stats, setStats] = useState<PlatformStats | null>(null);
    const [topSellers, setTopSellers] = useState<TopSeller[]>([]);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            const [statsData, sellersData, activitiesData] = await Promise.all([
                platformApi.getPlatformStats(),
                platformApi.getTopSellers(5),
                platformApi.getRecentActivities(10),
            ]);
            setStats(statsData);
            setTopSellers(sellersData);
            setActivities(activitiesData);
        } catch (error) {
            console.error('Failed to load dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatNumber = (num: number) => {
        return new Intl.NumberFormat('en-US').format(num);
    };

    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'new_seller':
                return <Store className="h-4 w-4" />;
            case 'milestone':
                return <CheckCircle className="h-4 w-4 text-green-600" />;
            case 'alert':
                return <AlertCircle className="h-4 w-4 text-amber-600" />;
            case 'order':
                return <ShoppingCart className="h-4 w-4 text-blue-600" />;
            default:
                return <Bell className="h-4 w-4" />;
        }
    };

    const getRelativeTime = (timestamp: string) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInHours = Math.floor((now.getTime() - time.getTime()) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Just now';
        if (diffInHours === 1) return '1 hour ago';
        if (diffInHours < 24) return `${diffInHours} hours ago`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays === 1) return '1 day ago';
        return `${diffInDays} days ago`;
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="text-muted-foreground">Loading platform metrics...</div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Platform Overview</h1>
                <p className="text-muted-foreground mt-1">
                    Monitor performance across all sellers
                </p>
            </div>

            {/* Stats Grid */}
            {stats && (
                <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <StatCard
                        title="Total Sellers"
                        value={formatNumber(stats.totalSellers)}
                        change={stats.newSellersThisMonth}
                        changeLabel={`${stats.newSellersThisMonth} new this month`}
                        icon={Users}
                        iconColor="text-blue-600"
                        iconBgColor="bg-blue-50"
                    />
                    <StatCard
                        title="Total Products"
                        value={formatNumber(stats.totalProducts)}
                        icon={Package}
                        iconColor="text-purple-600"
                        iconBgColor="bg-purple-50"
                    />
                    <StatCard
                        title="Total Orders"
                        value={formatNumber(stats.totalOrders)}
                        icon={ShoppingCart}
                        iconColor="text-green-600"
                        iconBgColor="bg-green-50"
                    />
                    <StatCard
                        title="Total Revenue"
                        value={formatCurrency(stats.totalRevenue)}
                        change={stats.monthlyGrowth}
                        changeLabel="vs last month"
                        icon={DollarSign}
                        iconColor="text-emerald-600"
                        iconBgColor="bg-emerald-50"
                    />
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2">
                {/* Top Sellers */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5" />
                            Top Performers
                        </CardTitle>
                        <CardDescription>Highest revenue sellers this month</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {topSellers.map((seller, index) => (
                                <div key={seller.id} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                                            {index + 1}
                                        </div>
                                        <div>
                                            <div className="font-medium">{seller.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {formatNumber(seller.orders)} orders • {formatNumber(seller.products)} products
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold">{formatCurrency(seller.revenue)}</div>
                                        <div className={cn('text-xs flex items-center gap-1 justify-end',
                                            seller.growth > 0 ? 'text-green-600' : 'text-red-600'
                                        )}>
                                            {seller.growth > 0 ? (
                                                <ArrowUp className="h-3 w-3" />
                                            ) : (
                                                <ArrowDown className="h-3 w-3" />
                                            )}
                                            {Math.abs(seller.growth)}%
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Bell className="h-5 w-5" />
                            Recent Activity
                        </CardTitle>
                        <CardDescription>Latest platform updates and alerts</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.map((activity) => (
                                <div key={activity.id} className="flex items-start gap-3">
                                    <div className="mt-0.5">
                                        {getActivityIcon(activity.type)}
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm">{activity.message}</p>
                                        <p className="text-xs text-muted-foreground mt-0.5">
                                            {getRelativeTime(activity.timestamp)}
                                        </p>
                                    </div>
                                    {activity.type === 'alert' && (
                                        <Badge variant="outline" className="text-xs">
                                            Action Required
                                        </Badge>
                                    )}
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
