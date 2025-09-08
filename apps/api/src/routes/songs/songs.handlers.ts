import { StatusCode } from '@workspace/constants/status-code';

import { handlePrismaError } from '@/api/lib/prisma-errors';

import type { AppRouteHandler } from '@/api/lib/app';
import type {
  GetSongs,
  GetSong,
  CreateSong,
  UpdateSong,
  DeleteSong,
} from '@/api/routes/songs/songs.routes';

export const getSongs: AppRouteHandler<GetSongs> = async (c) => {
  const prisma = c.get('prisma');
  const { page, limit, search } = c.req.valid('query');

  const skip = (page - 1) * limit;

  try {
    const where = search
      ? {
          OR: [
            { title: { contains: search } },
            { lyrics: { contains: search } },
          ],
        }
      : {};

    const [songs, total] = await Promise.all([
      prisma.song.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          slug: true,
          lyrics: true,
          duration: true,
          trackNumber: true,
          albumId: true,
          releaseDate: true,
          language: true,
          isExplicit: true,
          isPublished: true,
          lyricsSource: true,
          lyricsVerified: true,
          spotifyUrl: true,
          youtubeUrl: true,
          appleMusicUrl: true,
          viewCount: true,
          favoriteCount: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          title: 'asc',
        },
      }),
      prisma.song.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          songs,
          pagination: {
            total,
            skip,
            page,
            count: songs.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'song',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const getSong: AppRouteHandler<GetSong> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    const song = await prisma.song.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        slug: true,
        lyrics: true,
        duration: true,
        trackNumber: true,
        albumId: true,
        releaseDate: true,
        language: true,
        isExplicit: true,
        isPublished: true,
        lyricsSource: true,
        lyricsVerified: true,
        spotifyUrl: true,
        youtubeUrl: true,
        appleMusicUrl: true,
        viewCount: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!song) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Song not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    return c.json(
      {
        status: StatusCode.OK,
        data: song,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'song',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createSong: AppRouteHandler<CreateSong> = async (c) => {
  const prisma = c.get('prisma');
  const songData = c.req.valid('json');

  try {
    // Generate slug from title
    const slug = songData.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');

    // Convert releaseDate string to Date if provided
    const releaseDate = songData.releaseDate
      ? new Date(songData.releaseDate)
      : undefined;

    const song = await prisma.song.create({
      data: {
        ...songData,
        slug,
        releaseDate,
        createdBy: 'system',
        updatedBy: 'system',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        lyrics: true,
        duration: true,
        trackNumber: true,
        albumId: true,
        releaseDate: true,
        language: true,
        isExplicit: true,
        isPublished: true,
        lyricsSource: true,
        lyricsVerified: true,
        spotifyUrl: true,
        youtubeUrl: true,
        appleMusicUrl: true,
        viewCount: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.CREATED,
        data: song,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
      entityName: 'song',
      fieldMappings: {
        title: 'song title',
        slug: 'song title',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const updateSong: AppRouteHandler<UpdateSong> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const updateData = c.req.valid('json');

  try {
    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id },
    });

    if (!existingSong) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Song not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Generate new slug if title is being updated
    const slug = updateData.title
      ? updateData.title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '')
      : undefined;

    // Convert releaseDate string to Date if provided
    const releaseDate = updateData.releaseDate
      ? new Date(updateData.releaseDate)
      : undefined;

    const song = await prisma.song.update({
      where: { id },
      data: {
        ...updateData,
        ...(slug && { slug }),
        ...(releaseDate && { releaseDate }),
        updatedBy: 'system',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        lyrics: true,
        duration: true,
        trackNumber: true,
        albumId: true,
        releaseDate: true,
        language: true,
        isExplicit: true,
        isPublished: true,
        lyricsSource: true,
        lyricsVerified: true,
        spotifyUrl: true,
        youtubeUrl: true,
        appleMusicUrl: true,
        viewCount: true,
        favoriteCount: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.OK,
        data: song,
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
      entityName: 'song',
      fieldMappings: {
        title: 'song title',
        slug: 'song title',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const deleteSong: AppRouteHandler<DeleteSong> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id },
    });

    if (!existingSong) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Song not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    await prisma.song.delete({
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
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'song',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
