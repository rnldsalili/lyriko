import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/genres/genres.handlers';
import * as routes from '@/api/routes/genres/genres.routes';

const genres = createRouter()
  .basePath('/genres')
  .openapi(routes.getGenresRoute, handlers.getGenres)
  .openapi(routes.getGenreRoute, handlers.getGenre)
  .openapi(routes.createGenreRoute, handlers.createGenre)
  .openapi(routes.updateGenreRoute, handlers.updateGenre)
  .openapi(routes.deleteGenreRoute, handlers.deleteGenre);

export default genres;
