import {
  createArtistSchema,
  updateArtistSchema,
  artistResponseSchema,
  deleteArtistResponseSchema,
  artistsListResponseSchema,
} from '@workspace/validators/artists';
import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneSchema,
} from '@workspace/validators/common';

import { createRoute } from '@/api/lib/app';

const TAGS = ['Artists'];

export const createArtistRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new artist',
  description: 'Creates a new artist with the provided information',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createArtistSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: artistResponseSchema,
          }),
        },
      },
      description: 'Artist created successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid request data',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Artist already exists',
    },
  },
});

export const getArtistsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all artists',
  description: 'Retrieves a paginated list of artists',
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: artistsListResponseSchema,
          }),
        },
      },
      description: 'Artists retrieved successfully',
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

export const getArtistRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: TAGS,
  summary: 'Get artist by ID',
  description: 'Retrieves a specific artist by its ID',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: artistResponseSchema,
          }),
        },
      },
      description: 'Artist retrieved successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Artist not found',
    },
  },
});

export const updateArtistRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: TAGS,
  summary: 'Update artist',
  description: 'Updates an existing artist with the provided information',
  request: {
    params: commonGetOneSchema,
    body: {
      content: {
        'application/json': {
          schema: updateArtistSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: artistResponseSchema,
          }),
        },
      },
      description: 'Artist updated successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid request data',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Artist not found',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Artist name already exists',
    },
  },
});

export const deleteArtistRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: TAGS,
  summary: 'Delete artist',
  description: 'Deletes an existing artist',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: deleteArtistResponseSchema,
          }),
        },
      },
      description: 'Artist deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Artist not found',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Cannot delete artist with associated songs or albums',
    },
  },
});

export type GetArtists = typeof getArtistsRoute;
export type GetArtist = typeof getArtistRoute;
export type CreateArtist = typeof createArtistRoute;
export type UpdateArtist = typeof updateArtistRoute;
export type DeleteArtist = typeof deleteArtistRoute;
