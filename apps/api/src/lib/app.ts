import { OpenAPIHono, createRoute } from '@hono/zod-openapi';

import { formatZodErrors } from '@/api/lib/format-zod-errors';

import type { Env } from '@/api/index';
import type { RouteConfig, RouteHandler } from '@hono/zod-openapi';

export const createRouter = () => {
  return new OpenAPIHono<Env>({
    defaultHook: (result, c) => {
      if (!result.success) {
        return c.json(
          {
            ok: false,
            error: 'Schema validation error',
            errors: formatZodErrors(result),
            source: 'custom_error_handler',
          },
          422,
        );
      }
    },
  });
};

export { createRoute };

export type AppRouteHandler<R extends RouteConfig> = RouteHandler<R, Env>;
