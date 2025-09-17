import { StatusCode } from '@workspace/constants/status-code';
import { createMiddleware } from 'hono/factory';

import { createAuth } from '@/api/lib/auth';

import type { Env } from '@/api/index';

export const requireAuth = createMiddleware<Env>(async (c, next) => {
  const auth = createAuth(c);
  const session = await auth.api.getSession({ headers: c.req.raw.headers });

  if (!session) {
    return c.json(
      {
        status: StatusCode.UNAUTHORIZED,
        error: 'Authentication required',
        details: 'You must be signed in to access this resource',
      },
      StatusCode.UNAUTHORIZED,
    );
  }

  c.set('user', session.user);
  c.set('session', session.session);

  return next();
});
