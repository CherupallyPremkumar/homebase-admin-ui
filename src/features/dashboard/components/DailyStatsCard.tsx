import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { ComparisonMetric } from '@/types';
import { MetricComparisonBadge } from '@/components/shared/MetricComparisonBadge';
import { cn } from '@/lib/utils';

interface DailyStatsCardProps {
    title: string;
    value: string | number;
    icon: LucideIcon;
    comparison?: ComparisonMetric;
    isLoading?: boolean;
    className?: string;
    valuePrefix?: string;
    inverse?: boolean;
    onClick?: () => void;
}

export function DailyStatsCard({
    title,
    value,
    icon: Icon,
    comparison,
    isLoading,
    className,
    valuePrefix = '',
    inverse = false,
    onClick,
}: DailyStatsCardProps) {
    if (isLoading) {
        return (
            <Card className={cn('', className)}>
                <CardContent className="p-6">
                    <div className="space-y-3">
                        <Skeleton className="h-4 w-24" />
                        <Skeleton className="h-8 w-32" />
                        <Skeleton className="h-4 w-20" />
                    </div>
                </CardContent>
            </Card>
        );
    }

    const displayValue = typeof value === 'number'
        ? `${valuePrefix}${value.toLocaleString()}`
        : value;

    return (
        <Card className={cn('hover:shadow-md transition-shadow', className)}>
            <CardContent className="p-6">
                <div className="flex items-start justify-between">
                    <div className="space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">{title}</p>
                        <div className="flex items-baseline gap-2">
                            <h3
                                className={cn(
                                    "text-2xl font-bold tracking-tight",
                                    onClick && "cursor-pointer hover:text-primary transition-colors underline-offset-4 hover:underline"
                                )}
                                onClick={onClick}
                            >
                                {displayValue}
                            </h3>
                        </div>
                        {comparison && (
                            <div className="pt-1">
                                <MetricComparisonBadge comparison={comparison} inverse={inverse} />
                            </div>
                        )}
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-5 w-5 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
