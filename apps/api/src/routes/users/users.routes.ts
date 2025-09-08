import {
  successResponseSchema,
  errorResponseSchema,
  notFoundResponseSchema,
  commonGetListSchema,
  commonGetOneSchema,
} from '@workspace/validators/common';
import {
  createUserSchema,
  userResponseSchema,
  usersListResponseSchema,
} from '@workspace/validators/users';

import { createRoute } from '@/api/lib/app';

export const createUserRoute = createRoute({
  method: 'post',
  path: '/',
  tags: ['Users'],
  summary: 'Create a new user',
  description: 'Creates a new user account with the provided information',
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
  tags: ['Users'],
  summary: 'Get all users',
  description: 'Retrieves a paginated list of users',
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
  },
});

export const getUserRoute = createRoute({
  method: 'get',
  path: '{id}',
  tags: ['Users'],
  summary: 'Get user by ID',
  description: 'Retrieves a specific user by their ID',
  request: {
    params: commonGetOneSchema,
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
