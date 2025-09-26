import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import {
  paginationResponseSchema,
  datetimeSchema,
  creatorSchema,
} from './common';

extendZodWithOpenApi(z);

export const createArtistSchema = z.object({
  name: z
    .string({
      message: 'Name is required and must be a string',
    })
    .min(1, 'Name is required')
    .max(100, 'Name must contain at most 100 characters')
    .describe('Artist name')
    .openapi({
      example: 'Taylor Swift',
    }),
  bio: z
    .string()
    .max(1000, 'Bio must contain at most 1000 characters')
    .optional()
    .describe('Artist biography')
    .openapi({
      example:
        'American singer-songwriter known for narrative songs about her personal life',
    }),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .describe('Artist profile image URL')
    .openapi({
      example: 'https://example.com/artist-image.jpg',
    }),
  website: z
    .string()
    .url('Website must be a valid URL')
    .optional()
    .describe('Artist official website')
    .openapi({
      example: 'https://taylorswift.com',
    }),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .describe('Artist Spotify profile URL')
    .openapi({
      example: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    }),
  country: z
    .string()
    .max(50, 'Country must contain at most 50 characters')
    .optional()
    .describe('Artist country of origin')
    .openapi({
      example: 'United States',
    }),
  debutYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .describe('Year artist debuted')
    .openapi({
      example: 2006,
    }),
});

export const updateArtistSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must contain at most 100 characters')
    .optional()
    .describe('Artist name')
    .openapi({
      example: 'Taylor Swift',
    }),
  bio: z
    .string()
    .max(1000, 'Bio must contain at most 1000 characters')
    .optional()
    .describe('Artist biography')
    .openapi({
      example:
        'American singer-songwriter known for narrative songs about her personal life',
    }),
  image: z
    .string()
    .url('Image must be a valid URL')
    .optional()
    .describe('Artist profile image URL')
    .openapi({
      example: 'https://example.com/artist-image.jpg',
    }),
  website: z
    .string()
    .url('Website must be a valid URL')
    .optional()
    .describe('Artist official website')
    .openapi({
      example: 'https://taylorswift.com',
    }),
  spotifyUrl: z
    .string()
    .url('Spotify URL must be a valid URL')
    .optional()
    .describe('Artist Spotify profile URL')
    .openapi({
      example: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    }),
  country: z
    .string()
    .max(50, 'Country must contain at most 50 characters')
    .optional()
    .describe('Artist country of origin')
    .openapi({
      example: 'United States',
    }),
  debutYear: z
    .number()
    .int()
    .min(1900)
    .max(new Date().getFullYear())
    .optional()
    .describe('Year artist debuted')
    .openapi({
      example: 2006,
    }),
});

export type CreateArtistRequest = z.infer<typeof createArtistSchema>;
export type UpdateArtistRequest = z.infer<typeof updateArtistSchema>;

export const deleteArtistResponseSchema = z.object({
  deleted: z.boolean().openapi({ example: true }),
});

// Artist response schema for OpenAPI documentation
export const artistResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    name: z.string().openapi({ example: 'Taylor Swift' }),
    slug: z.string().openapi({ example: 'taylor-swift' }),
    bio: z.string().nullable().openapi({
      example:
        'American singer-songwriter known for narrative songs about her personal life',
    }),
    image: z.string().nullable().openapi({
      example: 'https://example.com/artist-image.jpg',
    }),
    website: z.string().nullable().openapi({
      example: 'https://taylorswift.com',
    }),
    spotifyUrl: z.string().nullable().openapi({
      example: 'https://open.spotify.com/artist/06HL4z0CvFAxyc27GXpf02',
    }),
    country: z.string().nullable().openapi({ example: 'United States' }),
    debutYear: z.number().nullable().openapi({ example: 2006 }),
    createdAt: datetimeSchema,
    updatedAt: datetimeSchema,
    creator: creatorSchema,
  })
  .openapi('Artist');

export const artistsListResponseSchema = z.object({
  artists: z.array(artistResponseSchema),
  pagination: paginationResponseSchema,
});
