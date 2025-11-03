import { z } from 'zod';
import { extendZodWithOpenApi } from '@hono/zod-openapi';

extendZodWithOpenApi(z);

// Request schema for file upload
export const uploadAssetRequestSchema = z
  .object({
    file: z
      .instanceof(File)
      .refine((file) => file.size > 0, 'File is required and cannot be empty')
      .refine(
        (file) => file.size <= 5 * 1024 * 1024, // 5MB
        'File size must be less than 5MB',
      )
      .refine((file) => file.type.startsWith('image/'), 'File must be an image')
      .describe('The image file to upload')
      .openapi({
        type: 'string',
        format: 'binary',
        description: 'Image file (PNG, JPG, GIF) up to 5MB',
      }),
  })
  .openapi('UploadAssetRequest');

// Response schema for uploaded asset
export const uploadAssetResponseSchema = z
  .object({
    fileName: z
      .string()
      .describe('Unique filename generated for the uploaded file')
      .openapi({
        example: '1704067200000-abc123def-456.jpg',
      }),
    originalName: z
      .string()
      .describe('Original filename of the uploaded file')
      .openapi({
        example: 'my-image.jpg',
      }),
    size: z.number().int().min(0).describe('File size in bytes').openapi({
      example: 1024000,
    }),
    type: z.string().describe('MIME type of the uploaded file').openapi({
      example: 'image/jpeg',
    }),
    uploadedBy: z
      .string()
      .describe('ID of the user who uploaded the file')
      .openapi({
        example: 'clm7x8y9z0000abcdef123456',
      }),
    uploadedAt: z
      .string()
      .datetime()
      .describe('ISO 8601 timestamp when the file was uploaded')
      .openapi({
        example: '2024-01-01T12:00:00.000Z',
      }),
  })
  .openapi('UploadAssetResponse');
