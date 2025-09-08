import { StatusCode } from '@workspace/constants/status-code';

import { handlePrismaError } from '@/api/lib/prisma-errors';

import type { AppRouteHandler } from '@/api/lib/app';
import type { CreateUser, GetUsers } from '@/api/routes/users/users.routes';

export const getUsers: AppRouteHandler<GetUsers> = async (c) => {
  const prisma = c.get('prisma');
  const { page, limit, search } = c.req.valid('query');

  const skip = (page - 1) * limit;

  try {
    const where = search
      ? {
          OR: [
            { firstName: { contains: search } },
            { lastName: { contains: search } },
            { email: { contains: search } },
          ],
        }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          bio: true,
          isPublic: true,
          emailVerified: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.user.count({ where }),
    ]);

    return c.json(
      {
        status: StatusCode.OK,
        data: {
          users,
          pagination: {
            total,
            skip,
            page,
            count: users.length,
          },
        },
      },
      StatusCode.OK,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST],
      fieldMappings: {
        firstName: 'first name',
        lastName: 'last name',
        emailVerified: 'email verification',
      },
      entityName: 'user',
    });

    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};

export const createUser: AppRouteHandler<CreateUser> = async (c) => {
  const prisma = c.get('prisma');
  const userData = c.req.valid('json');

  try {
    const user = await prisma.user.create({
      data: {
        ...userData,
        createdBy: 'system', // Since no authentication is required
        updatedBy: 'system',
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        bio: true,
        isPublic: true,
        emailVerified: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return c.json(
      {
        status: StatusCode.CREATED,
        data: user,
      },
      StatusCode.CREATED,
    );
  } catch (error) {
    const prismaErrorResponse = handlePrismaError(error, {
      allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
      entityName: 'user',
      fieldMappings: { email: 'email address' },
    });
    if (prismaErrorResponse) {
      return c.json(prismaErrorResponse, prismaErrorResponse.status);
    }
    throw error;
  }
};
