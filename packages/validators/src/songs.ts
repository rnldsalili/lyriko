import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import { paginationResponseSchema } from './common';

extendZodWithOpenApi(z);

export const createSongSchema = z.object({
  title: z
    .string({
      message: 'Title is required and must be a string',
    })
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters')
    .describe('Song title')
    .openapi({
      example: 'Shake It Off',
    }),
  lyrics: z
    .string({
      message: 'Lyrics are required and must be a string',
    })
    .min(1, 'Lyrics are required')
    .describe('Song lyrics')
    .openapi({
      example:
        "I stay out too late\nGot nothing in my brain\nThat's what people say...",
    }),
  duration: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 second')
    .optional()
    .describe('Song duration in seconds')
    .openapi({
      example: 219,
    }),
  trackNumber: z
    .number()
    .int()
    .min(1, 'Track number must be at least 1')
    .optional()
    .describe('Track number in album')
    .openapi({
      example: 6,
    }),
  albumId: z
    .string()
    .optional()
    .describe('ID of the album this song belongs to')
    .openapi({
      example: 'clm7x8y9z0000abcdef123456',
    }),
  releaseDate: z
    .string()
    .datetime('Release date must be a valid ISO 8601 datetime')
    .optional()
    .describe('Song release date')
    .openapi({
      example: '2014-08-18T00:00:00Z',
    }),
  language: z
    .string()
    .max(50, 'Language must contain at most 50 characters')
    .optional()
    .describe('Song language')
    .openapi({
      example: 'English',
    }),
  isExplicit: z
    .boolean()
    .default(false)
    .describe('Whether the song contains explicit content')
    .openapi({
      example: false,
    }),
  isPublished: z
    .boolean()
    .default(false)
    .describe('Whether the song is published')
    .openapi({
      example: true,
    }),
  lyricsSource: z
    .string()
    .max(100, 'Lyrics source must contain at most 100 characters')
    .optional()
    .describe('Source of the lyrics')
    .openapi({
      example: 'Official release',
    }),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .describe('Spotify track URL')
    .openapi({
      example: 'https://open.spotify.com/track/5VrI6cngYDuB7pYKEYpPEu',
    }),
  youtubeUrl: z
    .string()
    .url('YouTube URL must be a valid URL')
    .optional()
    .describe('YouTube video URL')
    .openapi({
      example: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
    }),
  appleMusicUrl: z
    .string()
    .url('Apple Music URL must be a valid URL')
    .optional()
    .describe('Apple Music track URL')
    .openapi({
      example: 'https://music.apple.com/us/song/shake-it-off/907242704',
    }),
});

export const updateSongSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters')
    .optional()
    .describe('Song title')
    .openapi({
      example: 'Shake It Off (Updated)',
    }),
  lyrics: z
    .string()
    .min(1, 'Lyrics are required')
    .optional()
    .describe('Song lyrics')
    .openapi({
      example:
        "I stay out too late\nGot nothing in my brain\nThat's what people say...",
    }),
  duration: z
    .number()
    .int()
    .min(1, 'Duration must be at least 1 second')
    .optional()
    .describe('Song duration in seconds')
    .openapi({
      example: 219,
    }),
  trackNumber: z
    .number()
    .int()
    .min(1, 'Track number must be at least 1')
    .optional()
    .describe('Track number in album')
    .openapi({
      example: 6,
    }),
  albumId: z
    .string()
    .optional()
    .describe('ID of the album this song belongs to')
    .openapi({
      example: 'clm7x8y9z0000abcdef123456',
    }),
  releaseDate: z
    .string()
    .datetime('Release date must be a valid ISO 8601 datetime')
    .optional()
    .describe('Song release date')
    .openapi({
      example: '2014-08-18T00:00:00Z',
    }),
  language: z
    .string()
    .max(50, 'Language must contain at most 50 characters')
    .optional()
    .describe('Song language')
    .openapi({
      example: 'English',
    }),
  isExplicit: z
    .boolean()
    .optional()
    .describe('Whether the song contains explicit content')
    .openapi({
      example: false,
    }),
  isPublished: z
    .boolean()
    .optional()
    .describe('Whether the song is published')
    .openapi({
      example: true,
    }),
  lyricsSource: z
    .string()
    .max(100, 'Lyrics source must contain at most 100 characters')
    .optional()
    .describe('Source of the lyrics')
    .openapi({
      example: 'Official release',
    }),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .describe('Spotify track URL')
    .openapi({
      example: 'https://open.spotify.com/track/5VrI6cngYDuB7pYKEYpPEu',
    }),
  youtubeUrl: z
    .string()
    .url('YouTube URL must be a valid URL')
    .optional()
    .describe('YouTube video URL')
    .openapi({
      example: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
    }),
  appleMusicUrl: z
    .string()
    .url('Apple Music URL must be a valid URL')
    .optional()
    .describe('Apple Music track URL')
    .openapi({
      example: 'https://music.apple.com/us/song/shake-it-off/907242704',
    }),
});

export type CreateSongRequest = z.infer<typeof createSongSchema>;
export type UpdateSongRequest = z.infer<typeof updateSongSchema>;

export const deleteSongResponseSchema = z.object({
  deleted: z.boolean().openapi({ example: true }),
});

// Song response schema for OpenAPI documentation
export const songResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    title: z.string().openapi({ example: 'Shake It Off' }),
    slug: z.string().openapi({ example: 'shake-it-off' }),
    lyrics: z.string().openapi({
      example:
        "I stay out too late\nGot nothing in my brain\nThat's what people say...",
    }),
    duration: z.number().nullable().openapi({ example: 219 }),
    trackNumber: z.number().nullable().openapi({ example: 6 }),
    albumId: z
      .string()
      .nullable()
      .openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    releaseDate: z
      .string()
      .nullable()
      .openapi({ example: '2014-08-18T00:00:00Z' }),
    language: z.string().nullable().openapi({ example: 'English' }),
    isExplicit: z.boolean().openapi({ example: false }),
    isPublished: z.boolean().openapi({ example: true }),
    lyricsSource: z
      .string()
      .nullable()
      .openapi({ example: 'Official release' }),
    lyricsVerified: z.boolean().openapi({ example: false }),
    spotifyUrl: z.string().nullable().openapi({
      example: 'https://open.spotify.com/track/5VrI6cngYDuB7pYKEYpPEu',
    }),
    youtubeUrl: z.string().nullable().openapi({
      example: 'https://www.youtube.com/watch?v=nfWlot6h_JM',
    }),
    appleMusicUrl: z.string().nullable().openapi({
      example: 'https://music.apple.com/us/song/shake-it-off/907242704',
    }),
    viewCount: z.number().openapi({ example: 0 }),
    favoriteCount: z.number().openapi({ example: 0 }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
  })
  .openapi('Song');

export const songsListResponseSchema = z.object({
  songs: z.array(songResponseSchema),
  pagination: paginationResponseSchema,
});
