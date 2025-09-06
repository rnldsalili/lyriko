import { cors } from 'hono/cors';
import { logger } from 'hono/logger';

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

app.get('/', (c) => {
  return c.json({
    message: 'Lyriko API',
    version: '1.0.0',
    endpoints: {
      songs: '/api/songs',
      artists: '/api/artists',
    },
  });
});

export default app;
