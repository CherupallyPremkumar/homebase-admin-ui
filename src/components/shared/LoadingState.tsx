import { Loader2 } from 'lucide-react';

interface LoadingStateProps {
  message?: string;
}

/**
 * Accessible loading state component
 * Includes ARIA live region for screen readers
 */
export function LoadingState({ message = 'Loading...' }: LoadingStateProps) {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-[400px] gap-4"
      role="status"
      aria-live="polite"
      aria-label={message}
    >
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="text-sm text-muted-foreground">{message}</p>
    </div>
  );
}
