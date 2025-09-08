import { createRouter } from '@/api/lib/app';
import * as handlers from '@/api/routes/users/users.handlers';
import * as routes from '@/api/routes/users/users.routes';

const users = createRouter()
  .basePath('/users')
  .openapi(routes.getUsersRoute, handlers.getUsers)
  .openapi(routes.createUserRoute, handlers.createUser);

export default users;
