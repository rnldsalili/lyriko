import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';

extendZodWithOpenApi(z);

export const headerSchema = z.object({
  authorization: z.string().describe('Authorization header').openapi({
    example: 'Bearer <token>',
  }),
});

export const commonGetListSchema = z.object({
  page: z.coerce
    .number()
    .default(1)
    .describe('Page number for pagination')
    .openapi({
      example: 1,
    }),
  limit: z.coerce
    .number()
    .default(10)
    .describe('Number of items per page')
    .openapi({
      example: 10,
    }),
  search: z
    .string({
      message: 'Search must be a string',
    })
    .default('')
    .describe('Search query string')
    .openapi({
      example: 'search term',
    }),
});

export const commonGetOneByIdSchema = z.object({
  id: z.string().describe('Unique identifier').openapi({
    example: 'clm7x8y9z0000abcdef123456',
  }),
});

export const commonGetOneBySlugSchema = z.object({
  slug: z.string().describe('Unique slug identifier').openapi({
    example: 'example-slug',
  }),
});

export const nameSchema = z
  .string({
    message: 'Name is required and must be a string',
  })
  .min(1, 'Name must be atleast 1 character')
  .max(100, 'Name must contain at most 100 characters')
  .describe('Name field with 1-100 character limit')
  .openapi({
    example: 'Example Name',
  });

export const descriptionSchema = z
  .string({
    message: 'Description must be a string',
  })
  .max(1000, 'Description must contain at most 1000 characters')
  .describe('Description field with up to 1000 characters')
  .openapi({
    example: 'This is an example description that provides additional details.',
  });

export const isDefaultSchema = z
  .boolean({
    message: 'Is default is required and must be a boolean',
  })
  .describe('Flag indicating if this is the default option')
  .openapi({
    example: false,
  });

export const emailSchema = z
  .string({
    message: 'Email is required and must be a string',
  })
  .regex(
    /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
    'Invalid email format',
  )
  .describe('Email address')
  .openapi({
    example: 'user@example.com',
  });

export const datetimeSchema = z
  .string({
    message: 'Datetime is required and must be a string',
  })
  .regex(
    /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z$/,
    'Invalid datetime format, must be ISO 8601',
  )
  .describe('ISO 8601 datetime string')
  .openapi({
    example: '2023-01-01T00:00:00Z',
  });

// OpenAPI response schemas
export const successResponseSchema = z.object({
  status: z.number().openapi({ example: 200 }),
  data: z.any().optional(),
  message: z.string().optional().openapi({ example: 'Success' }),
});

export const errorResponseSchema = z.object({
  status: z.number().openapi({ example: 400 }),
  error: z.string().openapi({ example: 'Bad Request' }),
  details: z
    .string()
    .optional()
    .openapi({ example: 'Additional error details' }),
});

export const notFoundResponseSchema = z.object({
  status: z.number().openapi({ example: 404 }),
  error: z.string().openapi({ example: 'Not Found' }),
});

export const internalServerErrorResponseSchema = z.object({
  status: z.number().openapi({ example: 500 }),
  error: z.string().openapi({ example: 'Internal Server Error' }),
});

export const paginationResponseSchema = z.object({
  total: z.number().describe('Total number of items').openapi({ example: 100 }),
  skip: z.number().describe('Number of items skipped').openapi({ example: 0 }),
  page: z.number().describe('Current page number').openapi({ example: 1 }),
  count: z
    .number()
    .describe('Number of items in current page')
    .openapi({ example: 10 }),
});

export const creatorSchema = z
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
  });

const isValidAssetReference = (value: string) => {
  const trimmed = value.trim();

  if (!trimmed) {
    return false;
  }

  if (trimmed.startsWith('/')) {
    return trimmed.length > 1;
  }

  if (trimmed.startsWith('tmp/')) {
    return trimmed.length > 4;
  }

  try {
    new URL(trimmed);
    return true;
  } catch {
    return false;
  }
};

export const assetReferenceSchema = z
  .string({
    message: 'Asset reference must be a string',
  })
  .refine(isValidAssetReference, {
    message: 'Asset reference must be a valid URL or start with /',
  })
  .describe('Reference to an uploaded asset')
  .openapi({
    example: '/assets/1704067200000-abc123def.jpg',
  });
