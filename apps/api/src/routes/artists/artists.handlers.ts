import { StatusCode } from '@workspace/constants/status-code';

import { finalizeAssetPath } from '@/api/lib/assets';
import { handlePrismaError } from '@/api/lib/prisma-errors';
import { generateSlug } from '@/api/lib/utils';

import type { AppRouteHandler } from '@/api/lib/app';
import type {
  GetArtists,
  GetArtist,
  CreateArtist,
  UpdateArtist,
  DeleteArtist,
} from '@/api/routes/artists/artists.routes';

export const getArtists: AppRouteHandler<GetArtists> = async (c) => {
  const prisma = c.get('prisma');
  const { page, limit, search } = c.req.valid('query');

  const skip = (page - 1) * limit;

  try {
    const where = search
      ? {
          OR: [{ name: { contains: search } }, { bio: { contains: search } }],
        }
      : {};

    const [artists, total] = await Promise.all([
      prisma.artist.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          slug: true,
          bio: true,
          image: true,
          website: true,
          spotifyUrl: true,
          country: true,
          debutYear: true,
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
      prisma.artist.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          artists,
          pagination: {
            total,
            skip,
            page,
            count: artists.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'artist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const getArtist: AppRouteHandler<GetArtist> = async (c) => {
  const prisma = c.get('prisma');
  const { slug } = c.req.valid('param');

  try {
    const artist = await prisma.artist.findUnique({
      where: { slug },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        image: true,
        website: true,
        spotifyUrl: true,
        country: true,
        debutYear: true,
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

    if (!artist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Artist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    return c.json(
      {
        status: StatusCode.OK,
        data: artist,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'artist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createArtist: AppRouteHandler<CreateArtist> = async (c) => {
  const prisma = c.get('prisma');
  const artistData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Generate slug from name
    const slug = generateSlug(artistData.name);
    const { image, ...artistPayload } = artistData;

    const finalizedImage = await finalizeAssetPath({
      bucket: c.env.BUCKET,
      fileName: image,
      targetPrefix: '/assets',
    });

    const artist = await prisma.artist.create({
      data: {
        ...artistPayload,
        ...(typeof finalizedImage === 'string'
          ? { image: finalizedImage }
          : {}),
        slug,
        createdBy: user.id,
        updatedBy: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        image: true,
        website: true,
        spotifyUrl: true,
        country: true,
        debutYear: true,
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
        data: artist,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
      entityName: 'artist',
      fieldMappings: {
        name: 'artist name',
        slug: 'artist name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const updateArtist: AppRouteHandler<UpdateArtist> = async (c) => {
  const prisma = c.get('prisma');
  const { slug } = c.req.valid('param');
  const updateData = c.req.valid('json');
  const user = c.get('user');

  try {
    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { slug },
    });

    if (!existingArtist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Artist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Generate new slug if name is being updated
    const newSlug = updateData.name ? generateSlug(updateData.name) : undefined;
    const { image, ...updatePayload } = updateData;

    const finalizedImage =
      image !== undefined
        ? await finalizeAssetPath({
            bucket: c.env.BUCKET,
            fileName: image,
            targetPrefix: '/assets',
          })
        : undefined;

    const artist = await prisma.artist.update({
      where: { id: existingArtist.id },
      data: {
        ...updatePayload,
        ...(newSlug && { slug: newSlug }),
        ...(typeof finalizedImage === 'string'
          ? { image: finalizedImage }
          : {}),
        updatedBy: user.id,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        image: true,
        website: true,
        spotifyUrl: true,
        country: true,
        debutYear: true,
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
        data: artist,
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
      entityName: 'artist',
      fieldMappings: {
        name: 'artist name',
        slug: 'artist name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const deleteArtist: AppRouteHandler<DeleteArtist> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    // Check if artist exists
    const existingArtist = await prisma.artist.findUnique({
      where: { id },
      include: {
        songs: true,
        albums: true,
      },
    });

    if (!existingArtist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Artist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Check if artist has associated songs or albums
    if (existingArtist.songs.length > 0 || existingArtist.albums.length > 0) {
      return c.json(
        {
          status: StatusCode.BAD_REQUEST,
          error: 'Cannot delete artist with associated songs or albums',
        },
        StatusCode.BAD_REQUEST,
      );
    }

    await prisma.artist.delete({
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
      entityName: 'artist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
