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
import { signUp } from '@/web/lib/auth';

function SignupForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchParams] = useSearchParams();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    setError('');

    // Get the redirect URL from search params, default to /home
    const redirectTo = searchParams.get('redirect');
    const callbackURL = redirectTo ? decodeURIComponent(redirectTo) : '/home';

    await signUp.email(
      {
        email,
        password,
        name,
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
          setError(ctx.error.message || 'Failed to create account');
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
              Create your account
            </CardTitle>
            <CardDescription className="text-center">
              Enter your details below to create your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  required
                  id="name"
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  type="text"
                  value={name}
                />
              </div>

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
                <Label htmlFor="password">Password</Label>
                <Input
                  required
                  id="password"
                  minLength={6}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  type="password"
                  value={password}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <Input
                  required
                  id="confirmPassword"
                  minLength={6}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm your password"
                  type="password"
                  value={confirmPassword}
                />
              </div>

              {error && (
                <div className="text-destructive text-sm text-center bg-destructive/10 p-2 rounded border border-destructive/20">
                  {error}
                </div>
              )}

              <Button className="w-full" disabled={isLoading} type="submit">
                {isLoading ? 'Creating account...' : 'Sign Up'}
              </Button>
            </form>

            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link
                className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline"
                to="/login"
              >
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

export default function SignupPage() {
  return (
    <AuthGuard>
      <SignupForm />
    </AuthGuard>
  );
}
