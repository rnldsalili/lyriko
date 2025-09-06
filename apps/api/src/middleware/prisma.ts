import { createMiddleware } from 'hono/factory';

import { initializePrisma } from '@/api/lib/db';

import type { Env } from '@/api/index';

const createPrisma = createMiddleware<Env>(async (c, next) => {
  const prisma = initializePrisma(c.env.DB);

  c.set('prisma', prisma);

  await next();
});

export default createPrisma;
