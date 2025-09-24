import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import {
  paginationResponseSchema,
  emailSchema,
  datetimeSchema,
} from '@workspace/validators/common';

import { AlbumType } from '@workspace/prisma';

extendZodWithOpenApi(z);

// Album type schema using Prisma-generated enum
export const albumTypeSchema = z.enum(Object.values(AlbumType));

export const createAlbumSchema = z.object({
  title: z
    .string({
      message: 'Title is required and must be a string',
    })
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters')
    .describe('Album title')
    .openapi({
      example: '1989',
    }),
  description: z
    .string()
    .max(1000, 'Description must contain at most 1000 characters')
    .optional()
    .describe('Album description')
    .openapi({
      example: 'A synth-pop masterpiece that marked a bold artistic evolution',
    }),
  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .describe('Album cover image URL')
    .openapi({
      example: 'https://example.com/album-cover.jpg',
    }),
  releaseDate: z
    .string()
    .datetime('Release date must be a valid ISO 8601 datetime')
    .optional()
    .describe('Album release date')
    .openapi({
      example: '2014-10-27T00:00:00Z',
    }),
  albumType: albumTypeSchema
    .default('ALBUM')
    .describe('Type of album')
    .openapi({
      example: 'ALBUM',
    }),
  totalTracks: z
    .number()
    .int()
    .min(1, 'Total tracks must be at least 1')
    .optional()
    .describe('Total number of tracks in the album')
    .openapi({
      example: 13,
    }),
});

export const updateAlbumSchema = z.object({
  title: z
    .string()
    .min(1, 'Title is required')
    .max(200, 'Title must contain at most 200 characters')
    .optional()
    .describe('Album title')
    .openapi({
      example: "1989 (Taylor's Version)",
    }),
  description: z
    .string()
    .max(1000, 'Description must contain at most 1000 characters')
    .optional()
    .describe('Album description')
    .openapi({
      example:
        'A synth-pop masterpiece that marked a bold artistic evolution - now re-recorded',
    }),
  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .describe('Album cover image URL')
    .openapi({
      example: 'https://example.com/album-cover-tv.jpg',
    }),
  releaseDate: z
    .string()
    .datetime('Release date must be a valid ISO 8601 datetime')
    .optional()
    .describe('Album release date')
    .openapi({
      example: '2023-10-27T00:00:00Z',
    }),
  albumType: albumTypeSchema.optional().describe('Type of album').openapi({
    example: 'ALBUM',
  }),
  totalTracks: z
    .number()
    .int()
    .min(1, 'Total tracks must be at least 1')
    .optional()
    .describe('Total number of tracks in the album')
    .openapi({
      example: 21,
    }),
});

export type CreateAlbumRequest = z.infer<typeof createAlbumSchema>;
export type UpdateAlbumRequest = z.infer<typeof updateAlbumSchema>;

export const deleteAlbumResponseSchema = z.object({
  deleted: z.boolean().openapi({ example: true }),
});

// Album response schema for OpenAPI documentation
export const albumResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    title: z.string().openapi({ example: '1989' }),
    slug: z.string().openapi({ example: '1989' }),
    description: z.string().nullable().openapi({
      example: 'A synth-pop masterpiece that marked a bold artistic evolution',
    }),
    coverImage: z.string().nullable().openapi({
      example: 'https://example.com/album-cover.jpg',
    }),
    releaseDate: z.string().nullable().openapi({
      example: '2014-10-27T00:00:00Z',
    }),
    albumType: albumTypeSchema.openapi({ example: 'ALBUM' }),
    totalTracks: z.number().nullable().openapi({ example: 13 }),
    createdAt: datetimeSchema,
    updatedAt: datetimeSchema,
    creator: z
      .object({
        id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
        name: z.string().nullable().openapi({ example: 'John Doe' }),
        email: emailSchema,
      })
      .openapi({
        example: {
          id: 'clm7x8y9z0000abcdef123456',
          name: 'John Doe',
          email: 'john@example.com',
        },
      }),
  })
  .openapi('Album');

export const albumsListResponseSchema = z.object({
  albums: z.array(albumResponseSchema),
  pagination: paginationResponseSchema,
});
