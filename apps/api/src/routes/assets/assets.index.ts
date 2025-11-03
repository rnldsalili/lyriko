import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/assets/assets.handlers';
import * as routes from '@/api/routes/assets/assets.routes';

const assets = createRouter()
  .basePath('/assets')
  .openapi(routes.uploadAssetRoute, handlers.uploadAsset);

export default assets;
