import { Button } from '@workspace/ui/base/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@workspace/ui/base/card';
import { Input } from '@workspace/ui/base/input';
import { Label } from '@workspace/ui/base/label';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router';

import { AuthGuard } from '@/web/components/auth-guard';
import { signIn } from '@/web/lib/auth';

function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Get the redirect URL from search params, default to /home
    const redirectTo = searchParams.get('redirect');
    const callbackURL = redirectTo ? decodeURIComponent(redirectTo) : '/home';

    await signIn.email(
      {
        email,
        password,
        callbackURL,
      },
      {
        onRequest: () => {
          setIsLoading(true);
          setError('');
        },
        onSuccess: () => {
          setIsLoading(false);
        },
        onError: (ctx) => {
          setError(ctx.error.message || 'Failed to sign in');
          setIsLoading(false);
        },
      },
    );

    setIsLoading(false);
  };

  return (
    <div className="flex min-h-[calc(100vh-theme(spacing.32))] w-full items-center justify-center p-6">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center">
              Sign in to your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your email below to sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  required
                  id="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@example.com"
                  type="email"
                  value={email}
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
                    href="#"
                  >
                    Forgot your password?
                  </a>
                </div>
                <Input
                  required
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                />
              </div>

              {error && (
                <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded border border-destructive/20">
                  {error}
                </div>
              )}

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Button>

              <Button className="w-full" type="button" variant="outline">
                Sign in with Google
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Don&apos;t have an account?{' '}
              <Link
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                to="/signup"
              >
                Sign up
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <AuthGuard>
      <LoginForm />
    </AuthGuard>
  );
}
