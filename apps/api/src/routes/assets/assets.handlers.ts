import { StatusCode } from '@workspace/constants/status-code';
import { uploadAssetRequestSchema } from '@workspace/validators/assets';

import type { AppRouteHandler } from '@/api/lib/app';
import type { UploadAsset } from '@/api/routes/assets/assets.routes';

export const uploadAsset: AppRouteHandler<UploadAsset> = async (c) => {
  const user = c.get('user');

  try {
    // Parse the multipart/form-data body
    const body = await c.req.parseBody();

    // Validate the form data with Zod
    const validationResult = uploadAssetRequestSchema.safeParse(body);

    if (!validationResult.success) {
      const firstError = validationResult.error.issues[0];
      return c.json(
        {
          status: StatusCode.BAD_REQUEST,
          error: firstError?.message || 'Invalid file upload',
        },
        StatusCode.BAD_REQUEST,
      );
    }

    const { file } = validationResult.data;

    // Get file metadata
    const fileName = file.name;
    const fileSize = file.size;
    const fileType = file.type;

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const extension = fileName.split('.').pop() || '';
    const sanitizedExtension = extension ? `.${extension}` : '';
    const uniqueFileKey = `tmp/${timestamp}-${crypto.randomUUID()}${sanitizedExtension}`;

    // Get Cloudflare R2 binding
    const r2 = c.env.BUCKET;

    if (!r2) {
      return c.json(
        {
          status: StatusCode.INTERNAL_SERVER_ERROR,
          error: 'Storage service not configured',
        },
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    // Upload to R2
    const uploadResult = await r2.put(uniqueFileKey, file.stream(), {
      customMetadata: {
        originalName: fileName,
        uploadedBy: user.id,
        contentType: fileType,
        uploadedAt: new Date().toISOString(),
      },
    });

    if (!uploadResult) {
      return c.json(
        {
          status: StatusCode.INTERNAL_SERVER_ERROR,
          error: 'Failed to upload file',
        },
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return c.json(
      {
        status: StatusCode.CREATED,
        data: {
          fileName: `/${uniqueFileKey}`,
          originalName: fileName,
          size: fileSize,
          type: fileType,
          uploadedBy: user.id,
          uploadedAt: new Date().toISOString(),
        },
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    console.error('Upload error:', error);
    return c.json(
      {
        status: StatusCode.INTERNAL_SERVER_ERROR,
        error: 'Failed to upload file',
      },
      StatusCode.INTERNAL_SERVER_ERROR,
    );
  }
};
