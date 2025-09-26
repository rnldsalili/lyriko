import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import {
  paginationResponseSchema,
  datetimeSchema,
  creatorSchema,
} from './common';

extendZodWithOpenApi(z);

export const createGenreSchema = z.object({
  name: z
    .string({
      message: 'Name is required and must be a string',
    })
    .min(1, 'Name is required')
    .max(50, 'Name must contain at most 50 characters')
    .describe('Genre name')
    .openapi({
      example: 'Rock',
    }),
  description: z
    .string()
    .max(500, 'Description must contain at most 500 characters')
    .optional()
    .describe('Genre description')
    .openapi({
      example:
        'A genre characterized by strong rhythms and amplified instruments',
    }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .describe('Genre color for UI theming')
    .openapi({
      example: '#FF5722',
    }),
});

export const updateGenreSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(50, 'Name must contain at most 50 characters')
    .optional()
    .describe('Genre name')
    .openapi({
      example: 'Alternative Rock',
    }),
  description: z
    .string()
    .max(500, 'Description must contain at most 500 characters')
    .optional()
    .describe('Genre description')
    .openapi({
      example: 'A subgenre of rock music that emerged in the 1980s',
    }),
  color: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/, 'Color must be a valid hex color')
    .optional()
    .describe('Genre color for UI theming')
    .openapi({
      example: '#9C27B0',
    }),
});

export type CreateGenreRequest = z.infer<typeof createGenreSchema>;
export type UpdateGenreRequest = z.infer<typeof updateGenreSchema>;

export const deleteGenreResponseSchema = z.object({
  deleted: z.boolean().openapi({ example: true }),
});

// Genre response schema for OpenAPI documentation
export const genreResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    name: z.string().openapi({ example: 'Rock' }),
    slug: z.string().openapi({ example: 'rock' }),
    description: z.string().nullable().openapi({
      example:
        'A genre characterized by strong rhythms and amplified instruments',
    }),
    color: z.string().nullable().openapi({ example: '#FF5722' }),
    createdAt: datetimeSchema,
    updatedAt: datetimeSchema,
    creator: creatorSchema,
  })
  .openapi('Genre');

export const genresListResponseSchema = z.object({
  genres: z.array(genreResponseSchema),
  pagination: paginationResponseSchema,
});
