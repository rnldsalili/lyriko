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
import { Link, useNavigate } from 'react-router';

import { signIn } from '@/web/lib/auth';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    const { data, error } = await signIn.email(
      {
        email,
        password,
        callbackURL: '/home',
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
    <div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm">
        <Card>
          <CardHeader>
            <CardTitle>Login to your account</CardTitle>
            <CardDescription>
              Enter your email below to login to your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="m@example.com"
                    type="email"
                    value={email}
                  />
                </div>
                <div className="grid gap-3">
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
                    type="password"
                    value={password}
                  />
                </div>

                {error && (
                  <div className="text-red-600 text-sm text-center bg-red-50 p-2 rounded">
                    {error}
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <Button className="w-full" disabled={isLoading} type="submit">
                    {isLoading ? 'Signing in...' : 'Login'}
                  </Button>
                  <Button className="w-full" type="button" variant="outline">
                    Login with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <Link
                  className="underline underline-offset-4 hover:text-blue-600"
                  to="/signup"
                >
                  Sign up
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
