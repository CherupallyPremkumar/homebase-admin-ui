import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

/**
 * Accessible error state component
 * Includes retry functionality and proper ARIA attributes
 */
export function ErrorState({ 
  title = 'Error', 
  message, 
  onRetry 
}: ErrorStateProps) {
  return (
    <div className="flex items-center justify-center min-h-[400px] p-6">
      <Alert variant="destructive" className="max-w-lg" role="alert">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>{title}</AlertTitle>
        <AlertDescription className="mt-2 space-y-4">
          <p>{message}</p>
          {onRetry && (
            <Button 
              onClick={onRetry} 
              variant="outline"
              className="mt-2"
              aria-label="Retry loading data"
            >
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
