import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/playlists/playlists.handlers';
import * as routes from '@/api/routes/playlists/playlists.routes';

const playlists = createRouter()
  .basePath('/playlists')
  .openapi(routes.getPlaylistsRoute, handlers.getPlaylists)
  .openapi(routes.getPlaylistRoute, handlers.getPlaylist)
  .openapi(routes.createPlaylistRoute, handlers.createPlaylist)
  .openapi(routes.updatePlaylistRoute, handlers.updatePlaylist)
  .openapi(routes.deletePlaylistRoute, handlers.deletePlaylist)
  .openapi(routes.addSongToPlaylistRoute, handlers.addSongToPlaylist)
  .openapi(routes.removeSongFromPlaylistRoute, handlers.removeSongFromPlaylist);

export default playlists;
