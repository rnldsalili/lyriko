import {
  uploadAssetRequestSchema,
  uploadAssetResponseSchema,
} from '@workspace/validators/assets';
import {
  successResponseSchema,
  errorResponseSchema,
} from '@workspace/validators/common';

import { createRoute } from '@/api/lib/app';
import { requireAuth } from '@/api/middleware/require-auth';

const TAGS = ['Assets'];

export const uploadAssetRoute = createRoute({
  method: 'post',
  path: '/upload',
  tags: TAGS,
  summary: 'Upload an asset file',
  description: 'Uploads a file to Cloudflare R2 storage',
  middleware: [requireAuth] as const,
  request: {
    body: {
      content: {
        'multipart/form-data': {
          schema: uploadAssetRequestSchema,
        },
      },
    },
  },
  responses: {
    201: {
      content: {
        'application/json': {
          schema: successResponseSchema.extend({
            data: uploadAssetResponseSchema,
          }),
        },
      },
      description: 'File uploaded successfully',
    },
    400: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Invalid request - no file provided or invalid file format',
    },
    401: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description: 'Authentication required',
    },
    500: {
      content: {
        'application/json': {
          schema: errorResponseSchema,
        },
      },
      description:
        'Internal server error - storage service not configured or upload failed',
    },
  },
});

export type UploadAsset = typeof uploadAssetRoute;
