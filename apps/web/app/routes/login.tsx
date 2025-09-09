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

export default function LoginPage() {
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
            <form>
              <div className="flex flex-col gap-6">
                <div className="grid gap-3">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    required
                    id="email"
                    placeholder="m@example.com"
                    type="email"
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
                  <Input required id="password" type="password" />
                </div>
                <div className="flex flex-col gap-3">
                  <Button className="w-full" type="submit">
                    Login
                  </Button>
                  <Button className="w-full" variant="outline">
                    Login with Google
                  </Button>
                </div>
              </div>
              <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{' '}
                <a className="underline underline-offset-4" href="#">
                  Sign up
                </a>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
