import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneSchema,
} from '@workspace/validators/common';
import {
  createGenreSchema,
  updateGenreSchema,
  genreResponseSchema,
  deleteGenreResponseSchema,
  genresListResponseSchema,
} from '@workspace/validators/genres';

import { createRoute } from '@/api/lib/app';
import { requireAuth } from '@/api/middleware/require-auth';

const TAGS = ['Genres'];

export const createGenreRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new genre',
  description: 'Creates a new genre with the provided information',
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createGenreSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: genreResponseSchema,
          }),
        },
      },
      description: 'Genre created successfully',
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
      description: 'Genre already exists',
    },
  },
});

export const getGenresRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all genres',
  description: 'Retrieves a paginated list of genres',
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: genresListResponseSchema,
          }),
        },
      },
      description: 'Genres retrieved successfully',
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

export const getGenreRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: TAGS,
  summary: 'Get genre by ID',
  description: 'Retrieves a specific genre by its ID',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: genreResponseSchema,
          }),
        },
      },
      description: 'Genre retrieved successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Genre not found',
    },
  },
});

export const updateGenreRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: TAGS,
  summary: 'Update genre',
  description: 'Updates an existing genre with the provided information',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneSchema,
    body: {
      content: {
        'application/json': {
          schema: updateGenreSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: genreResponseSchema,
          }),
        },
      },
      description: 'Genre updated successfully',
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
      description: 'Genre not found',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Genre name already exists',
    },
  },
});

export const deleteGenreRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: TAGS,
  summary: 'Delete genre',
  description: 'Deletes an existing genre',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: deleteGenreResponseSchema,
          }),
        },
      },
      description: 'Genre deleted successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Cannot delete genre with associated songs or albums',
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
      description: 'Genre not found',
    },
  },
});

export type GetGenres = typeof getGenresRoute;
export type GetGenre = typeof getGenreRoute;
export type CreateGenre = typeof createGenreRoute;
export type UpdateGenre = typeof updateGenreRoute;
export type DeleteGenre = typeof deleteGenreRoute;
