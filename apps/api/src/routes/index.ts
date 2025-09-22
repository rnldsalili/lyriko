import { createRouter } from '@/api/lib/app';
import albums from '@/api/routes/albums/albums.index';
import artists from '@/api/routes/artists/artists.index';
import genres from '@/api/routes/genres/genres.index';
import playlists from '@/api/routes/playlists/playlists.index';
import songs from '@/api/routes/songs/songs.index';
import users from '@/api/routes/users/users.index';

import type { Router } from '@/api/types/router';

const API_PREFIX = '/api';

export function registerRoutes(app: Router) {
  return app
    .route(API_PREFIX, users)
    .route(API_PREFIX, genres)
    .route(API_PREFIX, artists)
    .route(API_PREFIX, albums)
    .route(API_PREFIX, songs)
    .route(API_PREFIX, playlists);
}

// Stand alone router type used for api client
export const router = registerRoutes(createRouter());

export type APIClientRouter = typeof router;
