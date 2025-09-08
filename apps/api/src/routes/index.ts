import albums from '@/api/routes/albums/albums.index';
import artists from '@/api/routes/artists/artists.index';
import genres from '@/api/routes/genres/genres.index';
import playlists from '@/api/routes/playlists/playlists.index';
import songs from '@/api/routes/songs/songs.index';
import users from '@/api/routes/users/users.index';

import type { Router } from '@/api/types/router';

const API_PREFIX = '/api';

export function registerRoutes(app: Router) {
  app.route(API_PREFIX, users);
  app.route(API_PREFIX, genres);
  app.route(API_PREFIX, artists);
  app.route(API_PREFIX, albums);
  app.route(API_PREFIX, songs);
  app.route(API_PREFIX, playlists);
  return app;
}
