import users from '@/api/routes/users/users.index';

import type { Router } from '@/api/types/router';

const API_PREFIX = '/api';

export function registerRoutes(app: Router) {
  app.route(API_PREFIX, users);
  return app;
}
