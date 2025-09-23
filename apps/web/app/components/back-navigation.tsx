import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';

interface BackNavigationProps {
  to: string;
  label?: string;
  className?: string;
}

export function BackNavigation({
  to,
  label = 'Back',
  className = 'mb-6',
}: BackNavigationProps) {
  return (
    <div className={className}>
      <Link
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        to={to}
      >
        <ArrowLeft className="w-4 h-4" />
        {label}
      </Link>
    </div>
  );
}
