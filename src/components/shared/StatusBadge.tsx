import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: OrderStatus;
  className?: string;
}

const STATUS_CONFIG: Record<OrderStatus, { label: string; variant: string }> = {
  pending: { label: 'Pending', variant: 'bg-yellow-100 text-yellow-800 border-yellow-300 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800' },
  processing: { label: 'Processing', variant: 'bg-blue-100 text-blue-800 border-blue-300 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800' },
  shipped: { label: 'Shipped', variant: 'bg-purple-100 text-purple-800 border-purple-300 dark:bg-purple-900/20 dark:text-purple-400 dark:border-purple-800' },
  delivered: { label: 'Delivered', variant: 'bg-green-100 text-green-800 border-green-300 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800' },
  cancelled: { label: 'Cancelled', variant: 'bg-red-100 text-red-800 border-red-300 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800' },
};

/**
 * Status badge component with semantic colors from design system
 * Accessible with proper ARIA labels
 */
export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <Badge 
      className={cn(config.variant, className)} 
      aria-label={`Status: ${config.label}`}
    >
      {config.label}
    </Badge>
  );
}
