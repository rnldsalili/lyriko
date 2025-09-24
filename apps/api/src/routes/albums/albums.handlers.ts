import { StatusCode } from '@workspace/constants/status-code';

import { handlePrismaError } from '@/api/lib/prisma-errors';
import { generateSlug } from '@/api/lib/utils';

import type { AppRouteHandler } from '@/api/lib/app';
import type {
  GetAlbums,
  GetAlbum,
  CreateAlbum,
  UpdateAlbum,
  DeleteAlbum,
} from '@/api/routes/albums/albums.routes';

export const getAlbums: AppRouteHandler<GetAlbums> = async (c) => {
  const prisma = c.get('prisma');
  const { page, limit, search } = c.req.valid('query');

  const skip = (page - 1) * limit;

  try {
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [albums, total] = await Promise.all([
      prisma.album.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          description: true,
          coverImage: true,
          releaseDate: true,
          albumType: true,
          totalTracks: true,
          createdAt: true,
          updatedAt: true,
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
        orderBy: {
          title: 'asc',
        },
      }),
      prisma.album.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          albums,
          pagination: {
            total,
            skip,
            page,
            count: albums.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'album',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const getAlbum: AppRouteHandler<GetAlbum> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    const album = await prisma.album.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        albumType: true,
        totalTracks: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!album) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Album not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    return c.json(
      {
        status: StatusCode.OK,
        data: album,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'album',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createAlbum: AppRouteHandler<CreateAlbum> = async (c) => {
  const prisma = c.get('prisma');
  const albumData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Generate slug from title
    const slug = generateSlug(albumData.title);

    // Convert releaseDate string to Date if provided
    const releaseDate = albumData.releaseDate
      ? new Date(albumData.releaseDate)
      : undefined;

    const album = await prisma.album.create({
      data: {
        ...albumData,
        slug,
        releaseDate,
        createdBy: user.id,
        updatedBy: user.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        albumType: true,
        totalTracks: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(
      {
        status: StatusCode.CREATED,
        data: album,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
      entityName: 'album',
      fieldMappings: {
        title: 'album title',
        slug: 'album title',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const updateAlbum: AppRouteHandler<UpdateAlbum> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const updateData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Check if album exists
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
    });

    if (!existingAlbum) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Album not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Generate new slug if title is being updated
    const slug = updateData.title ? generateSlug(updateData.title) : undefined;

    // Convert releaseDate string to Date if provided
    const releaseDate = updateData.releaseDate
      ? new Date(updateData.releaseDate)
      : undefined;

    const album = await prisma.album.update({
      where: { id },
      data: {
        ...updateData,
        ...(slug && { slug }),
        ...(releaseDate && { releaseDate }),
        updatedBy: user.id,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        coverImage: true,
        releaseDate: true,
        albumType: true,
        totalTracks: true,
        createdAt: true,
        updatedAt: true,
        creator: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return c.json(
      {
        status: StatusCode.OK,
        data: album,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [
        StatusCode.BAD_REQUEST,
        StatusCode.CONFLICT,
        StatusCode.NOT_FOUND,
      ],
      entityName: 'album',
      fieldMappings: {
        title: 'album title',
        slug: 'album title',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const deleteAlbum: AppRouteHandler<DeleteAlbum> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    // Check if album exists
    const existingAlbum = await prisma.album.findUnique({
      where: { id },
      include: {
        songs: true,
      },
    });

    if (!existingAlbum) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Album not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Check if album has associated songs
    if (existingAlbum.songs.length > 0) {
      return c.json(
        {
          status: StatusCode.BAD_REQUEST,
          error: 'Cannot delete album with associated songs',
        },
        StatusCode.BAD_REQUEST,
      );
    }

    await prisma.album.delete({
      where: { id },
    });

    return c.json(
      {
        status: StatusCode.OK,
        data: { deleted: true },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.NOT_FOUND],
      entityName: 'album',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
