import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/albums/albums.handlers';
import * as routes from '@/api/routes/albums/albums.routes';

const albums = createRouter()
  .basePath('/albums')
  .openapi(routes.getAlbumsRoute, handlers.getAlbums)
  .openapi(routes.getAlbumRoute, handlers.getAlbum)
  .openapi(routes.createAlbumRoute, handlers.createAlbum)
  .openapi(routes.updateAlbumRoute, handlers.updateAlbum)
  .openapi(routes.deleteAlbumRoute, handlers.deleteAlbum);

export default albums;
