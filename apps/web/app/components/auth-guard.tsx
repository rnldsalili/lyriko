import { LoadingSpinner } from '@workspace/ui/components/spinner';
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router';

import { useSession } from '@/web/lib/auth';

interface AuthGuardProps {
  children: React.ReactNode;
  defaultRedirectTo?: string;
}

export function AuthGuard({
  children,
  defaultRedirectTo = '/home',
}: AuthGuardProps) {
  const { data: session, isPending } = useSession();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (!isPending && session?.user) {
      // Check if there's a redirect parameter in the URL
      const redirectTo = searchParams.get('redirect');
      const destination = redirectTo
        ? decodeURIComponent(redirectTo)
        : defaultRedirectTo;
      navigate(destination, { replace: true });
    }
  }, [session, isPending, navigate, searchParams, defaultRedirectTo]);

  // Show loading state while checking authentication
  if (isPending) {
    return <LoadingSpinner message="Loading..." />;
  }

  // If user is authenticated, don't render children (will redirect)
  if (session?.user) {
    return null;
  }

  // Render children for unauthenticated users
  return <>{children}</>;
}
