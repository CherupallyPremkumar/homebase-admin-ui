import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
    title: string;
    value: string | number;
    change?: number;
    changeLabel?: string;
    icon: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
}

export function StatCard({
    title,
    value,
    change,
    changeLabel,
    icon: Icon,
    iconColor = 'text-primary',
    iconBgColor = 'bg-primary/10',
}: StatCardProps) {
    const isPositive = change !== undefined && change > 0;
    const isNegative = change !== undefined && change < 0;

    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                    {title}
                </CardTitle>
                <div className={cn('p-2 rounded-lg', iconBgColor)}>
                    <Icon className={cn('h-4 w-4', iconColor)} />
                </div>
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{value}</div>
                {change !== undefined && (
                    <p className="text-xs text-muted-foreground mt-1">
                        <span
                            className={cn(
                                'font-medium',
                                isPositive && 'text-green-600',
                                isNegative && 'text-red-600'
                            )}
                        >
                            {isPositive && '+'}
                            {change}%
                        </span>
                        {changeLabel && ` ${changeLabel}`}
                    </p>
                )}
            </CardContent>
        </Card>
    );
}
