import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneSchema,
} from '@workspace/validators/common';
import {
  createPlaylistSchema,
  updatePlaylistSchema,
  addSongToPlaylistSchema,
  playlistResponseSchema,
  playlistItemResponseSchema,
  deletePlaylistResponseSchema,
  removeSongFromPlaylistResponseSchema,
  playlistsListResponseSchema,
  removeSongFromPlaylistParamsSchema,
} from '@workspace/validators/playlists';

import { createRoute } from '@/api/lib/app';
import { requireAuth } from '@/api/middleware/require-auth';

const TAGS = ['Playlists'];

export const createPlaylistRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new playlist',
  description: 'Creates a new playlist with the provided information',
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createPlaylistSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: playlistResponseSchema,
          }),
        },
      },
      description: 'Playlist created successfully',
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
  },
});

export const getPlaylistsRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all playlists',
  description: 'Retrieves a paginated list of playlists',
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: playlistsListResponseSchema,
          }),
        },
      },
      description: 'Playlists retrieved successfully',
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

export const getPlaylistRoute = createRoute({
  method: 'get',
  path: '/{id}',
  tags: TAGS,
  summary: 'Get playlist by ID',
  description: 'Retrieves a specific playlist by its ID',
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: playlistResponseSchema,
          }),
        },
      },
      description: 'Playlist retrieved successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Playlist not found',
    },
  },
});

export const updatePlaylistRoute = createRoute({
  method: 'put',
  path: '/{id}',
  tags: TAGS,
  summary: 'Update playlist',
  description: 'Updates an existing playlist with the provided information',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneSchema,
    body: {
      content: {
        'application/json': {
          schema: updatePlaylistSchema,
        },
      },
    },
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: playlistResponseSchema,
          }),
        },
      },
      description: 'Playlist updated successfully',
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
      description: 'Playlist not found',
    },
  },
});

export const deletePlaylistRoute = createRoute({
  method: 'delete',
  path: '/{id}',
  tags: TAGS,
  summary: 'Delete playlist',
  description: 'Deletes an existing playlist',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: deletePlaylistResponseSchema,
          }),
        },
      },
      description: 'Playlist deleted successfully',
    },
    404: {
      content: {
        'application/json': {
          schema: notFoundResponseSchema,
        },
      },
      description: 'Playlist not found',
    },
  },
});

export const addSongToPlaylistRoute = createRoute({
  method: 'post',
  path: '/{id}/songs',
  tags: TAGS,
  summary: 'Add song to playlist',
  description: 'Adds a song to an existing playlist',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneSchema,
    body: {
      content: {
        'application/json': {
          schema: addSongToPlaylistSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: playlistItemResponseSchema,
          }),
        },
      },
      description: 'Song added to playlist successfully',
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
      description: 'Playlist or song not found',
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
      description: 'Song already exists in playlist',
    },
  },
});

export const removeSongFromPlaylistRoute = createRoute({
  method: 'delete',
  path: '/{id}/songs/{songId}',
  tags: TAGS,
  summary: 'Remove song from playlist',
  description: 'Removes a song from an existing playlist',
  middleware: [requireAuth] as const,
  request: {
    params: removeSongFromPlaylistParamsSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: removeSongFromPlaylistResponseSchema,
          }),
        },
      },
      description: 'Song removed from playlist successfully',
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
      description: 'Playlist or song not found in playlist',
    },
  },
});

export type GetPlaylists = typeof getPlaylistsRoute;
export type GetPlaylist = typeof getPlaylistRoute;
export type CreatePlaylist = typeof createPlaylistRoute;
export type UpdatePlaylist = typeof updatePlaylistRoute;
export type DeletePlaylist = typeof deletePlaylistRoute;
export type AddSongToPlaylist = typeof addSongToPlaylistRoute;
export type RemoveSongFromPlaylist = typeof removeSongFromPlaylistRoute;
