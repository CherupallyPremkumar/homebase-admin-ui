import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RecentOrder, OrderStatus } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Clock, ExternalLink } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RecentOrdersWidgetProps {
    orders: RecentOrder[];
    isLoading?: boolean;
    onOrderClick?: (orderId: string) => void;
    autoRefresh?: boolean;
    refreshInterval?: number;
}

const statusColors: Record<OrderStatus, string> = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    processing: 'bg-blue-100 text-blue-800 border-blue-200',
    shipped: 'bg-purple-100 text-purple-800 border-purple-200',
    delivered: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
};

export function RecentOrdersWidget({
    orders,
    isLoading,
    onOrderClick,
    autoRefresh = false,
    refreshInterval = 30000,
}: RecentOrdersWidgetProps) {
    if (isLoading) {
        return (
            <Card className="lg:col-span-3">
                <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {[...Array(5)].map((_, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-24" />
                                </div>
                                <Skeleton className="h-6 w-16" />
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        );
    }

    const hasOrders = orders.length > 0;

    return (
        <Card className="lg:col-span-3">
            <CardHeader className="flex flex-row items-center justify-between">
                <div>
                    <CardTitle>Recent Orders</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                        Latest incoming orders
                    </p>
                </div>
                {autoRefresh && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        <span>Auto-refresh</span>
                    </div>
                )}
            </CardHeader>
            <CardContent>
                {!hasOrders ? (
                    <div className="flex h-[200px] items-center justify-center text-muted-foreground">
                        <p>No recent orders</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {orders.map((order) => (
                            <div
                                key={order.id}
                                className={cn(
                                    'flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors',
                                    onOrderClick && 'cursor-pointer'
                                )}
                                onClick={() => onOrderClick?.(order.id)}
                            >
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className="text-sm font-medium truncate">
                                            {order.customerName}
                                        </p>
                                        {onOrderClick && (
                                            <ExternalLink className="h-3 w-3 text-muted-foreground flex-shrink-0" />
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2 mt-1">
                                        <p className="text-xs text-muted-foreground">
                                            {order.itemCount} {order.itemCount === 1 ? 'item' : 'items'}
                                        </p>
                                        <span className="text-xs text-muted-foreground">•</span>
                                        <p className="text-xs text-muted-foreground">{order.timeAgo}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3 flex-shrink-0">
                                    <p className="text-sm font-semibold">
                                        ${order.total.toLocaleString()}
                                    </p>
                                    <Badge
                                        variant="outline"
                                        className={cn('text-xs', statusColors[order.status])}
                                    >
                                        {order.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
