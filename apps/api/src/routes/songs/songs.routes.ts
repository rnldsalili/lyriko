import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneSchema,
} from '@workspace/validators/common';
import {
  createSongSchema,
  updateSongSchema,
  songResponseSchema,
  deleteSongResponseSchema,
  songsListResponseSchema,
} from '@workspace/validators/songs';

import { createRoute } from '@/api/lib/app';

const TAGS = ['Songs'];

export const createSongRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new song',
  description: 'Creates a new song with the provided information',
  request: {
    body: {
      content: {
        'application/json': {
          schema: createSongSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: songResponseSchema,
          }),
        },
      },
      description: 'Song created successfully',
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
      description: 'Song already exists',
    },
  },
});

export const getSongsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all songs',
  description: 'Retrieves a paginated list of songs',
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: songsListResponseSchema,
          }),
        },
      },
      description: 'Songs retrieved successfully',
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

export const getSongRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: TAGS,
  summary: 'Get song by ID',
  description: 'Retrieves a specific song by its ID',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: songResponseSchema,
          }),
        },
      },
      description: 'Song retrieved successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Song not found',
    },
  },
});

export const updateSongRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: TAGS,
  summary: 'Update song',
  description: 'Updates an existing song with the provided information',
  request: {
    params: commonGetOneSchema,
    body: {
      content: {
        'application/json': {
          schema: updateSongSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: songResponseSchema,
          }),
        },
      },
      description: 'Song updated successfully',
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
      description: 'Song not found',
    },
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Song title already exists',
    },
  },
});

export const deleteSongRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: TAGS,
  summary: 'Delete song',
  description: 'Deletes an existing song',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: deleteSongResponseSchema,
          }),
        },
      },
      description: 'Song deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Song not found',
    },
  },
});

export type GetSongs = typeof getSongsRoute;
export type GetSong = typeof getSongRoute;
export type CreateSong = typeof createSongRoute;
export type UpdateSong = typeof updateSongRoute;
export type DeleteSong = typeof deleteSongRoute;
