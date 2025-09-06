import songs from '@/api/routes/songs';

import type { Router } from '@/api/types/router';

const API_PREFIX = '/api';

export function registerRoutes(app: Router) {
  return app.route(API_PREFIX, songs);
}
