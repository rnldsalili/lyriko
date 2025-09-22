import { StatusCode } from '@workspace/constants/status-code';

import { handlePrismaError } from '@/api/lib/prisma-errors';
import { generateSlug } from '@/api/lib/utils';

import type { AppRouteHandler } from '@/api/lib/app';
import type {
  GetGenres,
  GetGenre,
  CreateGenre,
  UpdateGenre,
  DeleteGenre,
} from '@/api/routes/genres/genres.routes';

export const getGenres: AppRouteHandler<GetGenres> = async (c) => {
  const prisma = c.get('prisma');
  const { page, limit, search } = c.req.valid('query');

  const skip = (page - 1) * limit;

  try {
    const where = search
      ? {
          OR: [
            { name: { contains: search } },
            { description: { contains: search } },
          ],
        }
      : {};

    const [genres, total] = await Promise.all([
      prisma.genre.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          color: true,
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
          name: 'asc',
        },
      }),
      prisma.genre.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          genres,
          pagination: {
            total,
            skip,
            page,
            count: genres.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'genre',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const getGenre: AppRouteHandler<GetGenre> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    const genre = await prisma.genre.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
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

    if (!genre) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Genre not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    return c.json(
      {
        status: StatusCode.OK,
        data: genre,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'genre',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createGenre: AppRouteHandler<CreateGenre> = async (c) => {
  const prisma = c.get('prisma');
  const genreData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Generate slug from name
    const slug = generateSlug(genreData.name);

    const genre = await prisma.genre.create({
      data: {
        ...genreData,
        slug,
        createdBy: user.id,
        updatedBy: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
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
        data: genre,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
      entityName: 'genre',
      fieldMappings: {
        name: 'genre name',
        slug: 'genre name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const updateGenre: AppRouteHandler<UpdateGenre> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const updateData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
    });

    if (!existingGenre) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Genre not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Generate new slug if name is being updated
    const slug = updateData.name ? generateSlug(updateData.name) : undefined;

    const genre = await prisma.genre.update({
      where: { id },
      data: {
        ...updateData,
        ...(slug && { slug }),
        updatedBy: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        color: true,
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
        data: genre,
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
      entityName: 'genre',
      fieldMappings: {
        name: 'genre name',
        slug: 'genre name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const deleteGenre: AppRouteHandler<DeleteGenre> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    // Check if genre exists
    const existingGenre = await prisma.genre.findUnique({
      where: { id },
      include: {
        songs: true,
        albums: true,
      },
    });

    if (!existingGenre) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Genre not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Check if genre has associated songs or albums
    if (existingGenre.songs.length > 0 || existingGenre.albums.length > 0) {
      return c.json(
        {
          status: StatusCode.BAD_REQUEST,
          error: 'Cannot delete genre with associated songs or albums',
        },
        StatusCode.BAD_REQUEST,
      );
    }

    await prisma.genre.delete({
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
      entityName: 'genre',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
