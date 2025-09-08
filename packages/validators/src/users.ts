import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';
import { emailSchema } from '@workspace/validators/common';

extendZodWithOpenApi(z);

export const createUserSchema = z.object({
  email: emailSchema,
  password: z
    .string({
      message: 'Password is required and must be a string',
    })
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must contain at most 128 characters')
    .describe('User password')
    .openapi({
      example: 'securePassword123',
    }),
  firstName: z
    .string()
    .max(50, 'First name must contain at most 50 characters')
    .optional()
    .describe('User first name')
    .openapi({
      example: 'John',
    }),
  lastName: z
    .string()
    .max(50, 'Last name must contain at most 50 characters')
    .optional()
    .describe('User last name')
    .openapi({
      example: 'Doe',
    }),
  bio: z
    .string()
    .max(500, 'Bio must contain at most 500 characters')
    .optional()
    .describe('User biography')
    .openapi({
      example: 'Music lover and lyric enthusiast',
    }),
  isPublic: z
    .boolean()
    .default(true)
    .describe('Whether user profile is public')
    .openapi({
      example: true,
    }),
});

export type CreateUserRequest = z.infer<typeof createUserSchema>;

// User response schema for OpenAPI documentation
export const userResponseSchema = z
  .object({
    id: z.string().openapi({ example: 'clm7x8y9z0000abcdef123456' }),
    email: emailSchema,
    firstName: z.string().nullable().openapi({ example: 'John' }),
    lastName: z.string().nullable().openapi({ example: 'Doe' }),
    bio: z
      .string()
      .nullable()
      .openapi({ example: 'Music lover and lyric enthusiast' }),
    isPublic: z.boolean().openapi({ example: true }),
    emailVerified: z.boolean().openapi({ example: false }),
    createdAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
    updatedAt: z
      .string()
      .datetime()
      .openapi({ example: '2023-01-01T00:00:00Z' }),
  })
  .openapi('User');
