import {
  createAlbumSchema,
  updateAlbumSchema,
  albumResponseSchema,
  deleteAlbumResponseSchema,
  albumsListResponseSchema,
} from '@workspace/validators/albums';
import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneByIdSchema,
  commonGetOneBySlugSchema,
} from '@workspace/validators/common';

import { createRoute } from '@/api/lib/app';
import { requireAuth } from '@/api/middleware/require-auth';

const TAGS = ['Albums'];

export const createAlbumRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new album',
  description: 'Creates a new album with the provided information',
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createAlbumSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: albumResponseSchema,
          }),
        },
      },
      description: 'Album created successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid request data',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Authentication required',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Album already exists',
    },
  },
});

export const getAlbumsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all albums',
  description: 'Retrieves a paginated list of albums',
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: albumsListResponseSchema,
          }),
        },
      },
      description: 'Albums retrieved successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid query parameters',
    },
  },
});

export const getAlbumRoute = createRoute({
  method: 'get',
  path: '/{slug}',
  tags: TAGS,
  summary: 'Get album by ID',
  description: 'Retrieves a specific album by its ID',
  request: {
    params: commonGetOneBySlugSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: albumResponseSchema,
          }),
        },
      },
      description: 'Album retrieved successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Album not found',
    },
  },
});

export const updateAlbumRoute = createRoute({
  method: 'put',
  path: '/{slug}',
  tags: TAGS,
  summary: 'Update album',
  description: 'Updates an existing album with the provided information',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneBySlugSchema,
    body: {
      content: {
        'application/json': {
          schema: updateAlbumSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: albumResponseSchema,
          }),
        },
      },
      description: 'Album updated successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid request data',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Authentication required',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Album not found',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Album title already exists',
    },
  },
});

export const deleteAlbumRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: TAGS,
  summary: 'Delete album',
  description: 'Deletes an existing album',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneByIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: deleteAlbumResponseSchema,
          }),
        },
      },
      description: 'Album deleted successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Cannot delete album with associated songs',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Authentication required',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Album not found',
    },
  },
});

export type GetAlbums = typeof getAlbumsRoute;
export type GetAlbum = typeof getAlbumRoute;
export type CreateAlbum = typeof createAlbumRoute;
export type UpdateAlbum = typeof updateAlbumRoute;
export type DeleteAlbum = typeof deleteAlbumRoute;
