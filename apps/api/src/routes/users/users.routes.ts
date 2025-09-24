import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneByIdSchema,
} from '@workspace/validators/common';
import {
  createUserSchema,
  userResponseSchema,
  usersListResponseSchema,
} from '@workspace/validators/users';

import { createRoute } from '@/api/lib/app';
import { requireAuth } from '@/api/middleware/require-auth';

const TAGS = ['Users'];

export const createUserRoute = createRoute({
  method: 'post',
  path: '/',
  tags: TAGS,
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information',
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: {
        'application/json': {
          schema: createUserSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: userResponseSchema,
          }),
        },
      },
      description: 'User created successfully',
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
    409: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'User already exists',
    },
  },
});

export const getUsersRoute = createRoute({
  method: 'get',
  path: '/',
  tags: TAGS,
  summary: 'Get all users',
  description: 'Retrieves a paginated list of users',
  middleware: [requireAuth] as const,
  request: {
    query: commonGetListSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: usersListResponseSchema,
          }),
        },
      },
      description: 'Users retrieved successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid query parameters',
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

export const getUserRoute = createRoute({
  method: 'get',
  path: '{id}',
  tags: TAGS,
  summary: 'Get user by ID',
  description: 'Retrieves a specific user by their ID',
  middleware: [requireAuth] as const,
  request: {
    params: commonGetOneByIdSchema,
  },
  responses: {
    200: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: userResponseSchema,
          }),
        },
      },
      description: 'User retrieved successfully',
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
      description: 'User not found',
    },
  },
});

export type GetUsers = typeof getUsersRoute;
export type CreateUser = typeof createUserRoute;
