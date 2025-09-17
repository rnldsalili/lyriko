import { LoadingSpinner } from '@workspace/ui/components/spinner';
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';

import { useSession } from '@/web/lib/auth';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isPending && !session?.user) {
      // Encode the current path as a redirect parameter
      const redirectTo = encodeURIComponent(
        location.pathname + location.search,
      );
      navigate(`/?redirect=${redirectTo}`, { replace: true });
    }
  }, [session, isPending, navigate, location]);

  // Show loading state while checking authentication
  if (isPending) {
    return <LoadingSpinner message="Loading..." />;
  }

  // If user is not authenticated, don't render children (will redirect)
  if (!session?.user) {
    return null;
  }

  // Render children for authenticated users
  return <>{children}</>;
}
