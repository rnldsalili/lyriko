import { StatusCode } from '@workspace/constants/status-code';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { swaggerUI } from '@hono/swagger-ui';

import { createRouter } from '@/api/lib/app.js';
import createPrisma from '@/api/middleware/prisma';
import { registerRoutes } from '@/api/routes';

import type { PrismaClient } from '@workspace/prisma';

export type Env = {
  Bindings: CloudflareBindings;
  Variables: {
    prisma: PrismaClient;
  };
};

const app = createRouter();

// Global middleware
app.use('*', cors());
app.use('*', createPrisma);
app.use(logger());

// Routes
registerRoutes(app);

// OpenAPI documentation endpoints
app.doc('/openapi.json', {
  openapi: '3.1.0',
  info: {
    title: 'Lyriko API',
    version: '1.0.0',
    description: 'A music lyrics platform API built with Hono and OpenAPI',
  },
});

app.get('/doc', swaggerUI({ url: '/openapi.json' }));

app.get('/', (c) => {
  return c.json({
    message: 'Lyriko API',
    version: '1.0.0',
    endpoints: {
      users: '/api/users',
      docs: '/doc',
      openapi: '/openapi.json',
    },
  });
});

// Route not found
app.notFound((c) => {
  return c.json(
    {
      status: StatusCode.NOT_FOUND,
      error: '404 Not Found',
    },
    StatusCode.NOT_FOUND,
  );
});

// Internal Server Error
app.onError((error, c) => {
  console.error('[!!!] Internal Server Error:', error);
  return c.json(
    {
      status: StatusCode.INTERNAL_SERVER_ERROR,
      error: error.message,
    },
    StatusCode.INTERNAL_SERVER_ERROR,
  );
});

export default app;
