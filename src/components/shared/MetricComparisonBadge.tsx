import { ComparisonMetric } from '@/types';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip';
import { formatComparisonPercentage, getComparisonColorClass } from '@/utils/comparison';

interface MetricComparisonBadgeProps {
    comparison: ComparisonMetric;
    inverse?: boolean;
    showValue?: boolean;
    className?: string;
}

export function MetricComparisonBadge({
    comparison,
    inverse = false,
    showValue = false,
    className,
}: MetricComparisonBadgeProps) {
    const isPositive = inverse ? !comparison.isPositive : comparison.isPositive;
    const Icon = isPositive ? TrendingUp : TrendingDown;
    const colorClass = getComparisonColorClass(comparison, inverse);

    return (
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <div
                        className={cn(
                            'inline-flex items-center gap-1 text-sm font-medium',
                            colorClass,
                            className
                        )}
                    >
                        <Icon className="h-3.5 w-3.5" />
                        <span>{formatComparisonPercentage(comparison)}</span>
                        {showValue && (
                            <span className="text-muted-foreground">
                                ({comparison.isPositive ? '+' : '-'}
                                {Math.abs(comparison.value).toLocaleString()})
                            </span>
                        )}
                    </div>
                </TooltipTrigger>
                <TooltipContent>
                    <p className="text-xs">{comparison.label}</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
    );
}
