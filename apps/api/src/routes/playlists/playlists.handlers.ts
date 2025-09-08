import { StatusCode } from '@workspace/constants/status-code';

import { handlePrismaError } from '@/api/lib/prisma-errors';

import type { AppRouteHandler } from '@/api/lib/app';
import type {
  GetPlaylists,
  GetPlaylist,
  CreatePlaylist,
  UpdatePlaylist,
  DeletePlaylist,
  AddSongToPlaylist,
  RemoveSongFromPlaylist,
} from '@/api/routes/playlists/playlists.routes';

export const getPlaylists: AppRouteHandler<GetPlaylists> = async (c) => {
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

    const [playlists, total] = await Promise.all([
      prisma.playlist.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          description: true,
          coverImage: true,
          isPublic: true,
          userId: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          name: 'asc',
        },
      }),
      prisma.playlist.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          playlists,
          pagination: {
            total,
            skip,
            page,
            count: playlists.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'playlist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const getPlaylist: AppRouteHandler<GetPlaylist> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    const playlist = await prisma.playlist.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        description: true,
        coverImage: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!playlist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Playlist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    return c.json(
      {
        status: StatusCode.OK,
        data: playlist,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'playlist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createPlaylist: AppRouteHandler<CreatePlaylist> = async (c) => {
  const prisma = c.get('prisma');
  const playlistData = c.req.valid('json');

  try {
    const playlist = await prisma.playlist.create({
      data: {
        ...playlistData,
        createdBy: 'system',
        updatedBy: 'system',
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverImage: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.CREATED,
        data: playlist,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      entityName: 'playlist',
      fieldMappings: {
        name: 'playlist name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const updatePlaylist: AppRouteHandler<UpdatePlaylist> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const updateData = c.req.valid('json');

  try {
    // Check if playlist exists
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Playlist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    const playlist = await prisma.playlist.update({
      where: { id },
      data: {
        ...updateData,
        updatedBy: 'system',
      },
      select: {
        id: true,
        name: true,
        description: true,
        coverImage: true,
        isPublic: true,
        userId: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.OK,
        data: playlist,
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.NOT_FOUND],
      entityName: 'playlist',
      fieldMappings: {
        name: 'playlist name',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const deletePlaylist: AppRouteHandler<DeletePlaylist> = async (c) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');

  try {
    // Check if playlist exists
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Playlist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    await prisma.playlist.delete({
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
      entityName: 'playlist',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const addSongToPlaylist: AppRouteHandler<AddSongToPlaylist> = async (
  c,
) => {
  const prisma = c.get('prisma');
  const { id } = c.req.valid('param');
  const { songId, position } = c.req.valid('json');

  try {
    // Check if playlist exists
    const existingPlaylist = await prisma.playlist.findUnique({
      where: { id },
    });

    if (!existingPlaylist) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Playlist not found',
        },
        StatusCode.NOT_FOUND,
      );
    }

    // Check if song exists
    const existingSong = await prisma.song.findUnique({
      where: { id: songId },
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

    // Get next position if not provided
    const nextPosition =
      position ||
      (await prisma.playlistItem.count({
        where: { playlistId: id },
      })) + 1;

    const playlistItem = await prisma.playlistItem.create({
      data: {
        playlistId: id,
        songId,
        position: nextPosition,
        createdBy: 'system',
        updatedBy: 'system',
      },
      select: {
        id: true,
        playlistId: true,
        songId: true,
        position: true,
        createdAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.CREATED,
        data: playlistItem,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [
        StatusCode.BAD_REQUEST,
        StatusCode.CONFLICT,
        StatusCode.NOT_FOUND,
      ],
      entityName: 'playlist item',
      fieldMappings: {
        playlistId_songId: 'song in playlist',
      },
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const removeSongFromPlaylist: AppRouteHandler<
  RemoveSongFromPlaylist
> = async (c) => {
  const prisma = c.get('prisma');
  const { id, songId } = c.req.valid('param');

  try {
    // Check if playlist item exists
    const existingPlaylistItem = await prisma.playlistItem.findFirst({
      where: {
        playlistId: id,
        songId,
      },
    });

    if (!existingPlaylistItem) {
      return c.json(
        {
          status: StatusCode.NOT_FOUND,
          error: 'Song not found in playlist',
        },
        StatusCode.NOT_FOUND,
      );
    }

    await prisma.playlistItem.delete({
      where: { id: existingPlaylistItem.id },
    });

    return c.json(
      {
        status: StatusCode.OK,
        data: { removed: true },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.NOT_FOUND],
      entityName: 'playlist item',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
