import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/artists/artists.handlers';
import * as routes from '@/api/routes/artists/artists.routes';

const artists = createRouter()
  .basePath('/artists')
  .openapi(routes.getArtistsRoute, handlers.getArtists)
  .openapi(routes.getArtistRoute, handlers.getArtist)
  .openapi(routes.createArtistRoute, handlers.createArtist)
  .openapi(routes.updateArtistRoute, handlers.updateArtist)
  .openapi(routes.deleteArtistRoute, handlers.deleteArtist);

export default artists;
