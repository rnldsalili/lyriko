import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import { paginationResponseSchema } from './common';

extendZodWithOpenApi(z);

export const createPlaylistSchema = z.object({
  name: z
    .string({
      message: 'Name is required and must be a string',
    })
    .min(1, 'Name is required')
    .max(100, 'Name must contain at most 100 characters')
    .describe('Playlist name')
    .openapi({
      example: 'My Favorite Songs',
    }),
  description: z
    .string()
    .max(500, 'Description must contain at most 500 characters')
    .optional()
    .describe('Playlist description')
    .openapi({
      example: 'A collection of my all-time favorite tracks',
    }),
  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .describe('Playlist cover image URL')
    .openapi({
      example: 'https://example.com/playlist-cover.jpg',
    }),
  isPublic: z
    .boolean()
    .default(true)
    .describe('Whether the playlist is public')
    .openapi({
      example: true,
    }),
  userId: z
    .string({
      message: 'User ID is required',
    })
    .describe('ID of the user who owns the playlist')
    .openapi({
      example: 'clm7x8y9z0000abcdef123456',
    }),
});

export const updatePlaylistSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must contain at most 100 characters')
    .optional()
    .describe('Playlist name')
    .openapi({
      example: 'My Updated Playlist',
    }),
  description: z
    .string()
    .max(500, 'Description must contain at most 500 characters')
    .optional()
    .describe('Playlist description')
    .openapi({
      example: 'An updated collection of my favorite tracks',
    }),
  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .describe('Playlist cover image URL')
    .openapi({
      example: 'https://example.com/new-playlist-cover.jpg',
    }),
  isPublic: z
    .boolean()
    .optional()
    .describe('Whether the playlist is public')
    .openapi({
      example: false,
    }),
});

export const addSongToPlaylistSchema = z.object({
  songId: z
    .string({
      message: 'Song ID is required',
    })
    .describe('ID of the song to add to playlist')
    .openapi({
      example: 'clm7x8y9z0000abcdef123456',
    }),
  position: z
    .number()
    .int()
    .min(1, 'Position must be at least 1')
    .optional()
    .describe('Position of the song in the playlist (defaults to end)')
    .openapi({
      example: 1,
    }),
});

export const updatePlaylistItemSchema = z.object({
  position: z
    .number()
    .int()
    .min(1, 'Position must be at least 1')
    .describe('New position of the song in the playlist')
    .openapi({
      example: 3,
    }),
});

export type CreatePlaylistRequest = z.infer<typeof createPlaylistSchema>;
export type UpdatePlaylistRequest = z.infer<typeof updatePlaylistSchema>;
export type AddSongToPlaylistRequest = z.infer<typeof addSongToPlaylistSchema>;
export type UpdatePlaylistItemRequest = z.infer<
  typeof updatePlaylistItemSchema
>;

export const deletePlaylistResponseSchema = z.object({
  deleted: z.boolean().openapi({ example: true }),
});

export const removeSongFromPlaylistResponseSchema = z.object({
  removed: z.boolean().openapi({ example: true }),
});

// Playlist response schema for OpenAPI documentation
export const playlistResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    name: z.string().openapi({ example: 'My Favorite Songs' }),
    description: z.string().nullable().openapi({
      example: 'A collection of my all-time favorite tracks',
    }),
    coverImage: z.string().nullable().openapi({
      example: 'https://example.com/playlist-cover.jpg',
    }),
    isPublic: z.boolean().openapi({ example: true }),
    userId: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
  })
  .openapi('Playlist');

export const playlistItemResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    playlistId: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    songId: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    position: z.number().openapi({ example: 1 }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
  })
  .openapi('PlaylistItem');

export const playlistsListResponseSchema = z.object({
  playlists: z.array(playlistResponseSchema),
  pagination: paginationResponseSchema,
});

export const removeSongFromPlaylistParamsSchema = z.object({
  id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
  songId: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
});
