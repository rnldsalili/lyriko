import { cn } from '@workspace/ui/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function Spinner({ size = 'md', className }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  return (
    <div
      className={cn(
        'animate-spin rounded-full border-b-2 border-foreground',
        sizeClasses[size],
        className,
      )}
    />
  );
}

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function LoadingSpinner({
  message = 'Loading...',
  size = 'md',
  className,
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'flex min-h-svh w-full items-center justify-center p-6 md:p-10',
        className,
      )}
    >
      <div className="text-center">
        <Spinner size={size} className="mx-auto" />
        {message && (
          <p className="mt-2 text-sm text-muted-foreground">{message}</p>
        )}
      </div>
    </div>
  );
}
