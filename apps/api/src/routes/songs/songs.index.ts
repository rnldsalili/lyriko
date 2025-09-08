import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/songs/songs.handlers';
import * as routes from '@/api/routes/songs/songs.routes';

const songs = createRouter()
  .basePath('/songs')
  .openapi(routes.getSongsRoute, handlers.getSongs)
  .openapi(routes.getSongRoute, handlers.getSong)
  .openapi(routes.createSongRoute, handlers.createSong)
  .openapi(routes.updateSongRoute, handlers.updateSong)
  .openapi(routes.deleteSongRoute, handlers.deleteSong);

export default songs;
