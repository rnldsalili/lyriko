import { StatusCode } from '@workspace/constants/status-code';
import { Prisma } from '@workspace/prisma';

interface PrismaErrorConfig<T extends StatusCode = StatusCode> {
  allowedStatusCodes: T[];
  customMessages?: Partial<
    Record<
      string,
      (error: Prisma.PrismaClientKnownRequestError) => {
        status: T;
        error: string;
        details: string;
      }
    >
  >;
  fieldMappings?: Record<string, string>;
  entityName?: string;
}

const getField = (
  error: Prisma.PrismaClientKnownRequestError,
  mappings?: Record<string, string>,
) => {
  const field = error.meta?.target as string[] | string | undefined;
  const fieldName = Array.isArray(field) ? field[0] : field;
  return fieldName ? (mappings?.[fieldName] ?? fieldName) : undefined;
};

/**
 * Maps Prisma error codes to appropriate HTTP status codes within allowed set
 */
const mapToAllowedStatus = <T extends StatusCode>(
  preferredStatus: StatusCode,
  allowedStatuses: T[],
): T => {
  // Return preferred if it's allowed
  if (allowedStatuses.includes(preferredStatus as T)) {
    return preferredStatus as T;
  }

  // Fallback mapping based on error type
  if (
    preferredStatus === StatusCode.CONFLICT &&
    allowedStatuses.includes(StatusCode.BAD_REQUEST as T)
  ) {
    return StatusCode.BAD_REQUEST as T;
  }

  if (
    preferredStatus === StatusCode.NOT_FOUND &&
    allowedStatuses.includes(StatusCode.BAD_REQUEST as T)
  ) {
    return StatusCode.BAD_REQUEST as T;
  }

  // Default to first allowed status (usually 400 for errors)
  return allowedStatuses.find((status) => status >= 400) || allowedStatuses[0];
};

const createErrorHandler =
  <T extends StatusCode>(
    preferredStatus: StatusCode,
    errorMessage: string,
    detailsMessage: string,
  ) =>
  (
    error: Prisma.PrismaClientKnownRequestError,
    entity: string,
    mappings: Record<string, string> | undefined,
    allowedStatuses: T[],
  ): { status: T; error: string; details: string } => ({
    status: mapToAllowedStatus(preferredStatus, allowedStatuses),
    error: errorMessage,
    details: detailsMessage,
  });

const ERRORS: Record<
  string,
  (
    error: Prisma.PrismaClientKnownRequestError,
    entity: string,
    mappings: Record<string, string> | undefined,
    allowedStatuses: StatusCode[],
  ) => { status: StatusCode; error: string; details: string }
> = {
  P2002: (error, entity, mappings, allowedStatuses) => {
    const field = getField(error, mappings);
    const preferredStatus = StatusCode.CONFLICT;
    const mappedStatus = mapToAllowedStatus(preferredStatus, allowedStatuses);

    if (field === 'email') {
      return {
        status: mappedStatus,
        error: 'An account with this email address already exists',
        details:
          'Please use a different email address or sign in with your existing account',
      };
    }

    return {
      status: mappedStatus,
      error: `A ${entity} with this information already exists`,
      details: `Please check your input${field ? ` (${field} must be unique)` : ''}`,
    };
  },

  P2000: createErrorHandler(
    StatusCode.BAD_REQUEST,
    'One or more fields exceed the maximum allowed length',
    'Please check that all fields are within the allowed character limits',
  ),

  P2003: (error, entity, mappings, allowedStatuses) => ({
    status: mapToAllowedStatus(StatusCode.BAD_REQUEST, allowedStatuses),
    error: `Invalid reference in ${entity} data`,
    details: 'One or more referenced items do not exist',
  }),

  P2004: createErrorHandler(
    StatusCode.BAD_REQUEST,
    'Data constraint violation',
    'The provided data does not meet the required constraints',
  ),

  P2011: (error, entity, mappings, allowedStatuses) => {
    const field = getField(error, mappings);
    return {
      status: mapToAllowedStatus(StatusCode.BAD_REQUEST, allowedStatuses),
      error: `Missing required field${field ? `: ${field}` : ''}`,
      details: 'Please provide all required information',
    };
  },

  P2012: (error, entity, mappings, allowedStatuses) => {
    const field = getField(error, mappings);
    return {
      status: mapToAllowedStatus(StatusCode.BAD_REQUEST, allowedStatuses),
      error: `Missing required value${field ? ` for ${field}` : ''}`,
      details: 'Please provide all required fields',
    };
  },

  P2013: (error, entity, mappings, allowedStatuses) => {
    const field = getField(error, mappings);
    return {
      status: mapToAllowedStatus(StatusCode.BAD_REQUEST, allowedStatuses),
      error: `Missing required field${field ? `: ${field}` : ''}`,
      details: 'Please ensure all required fields are provided',
    };
  },

  P2025: (error, entity, mappings, allowedStatuses) => {
    // For NOT_FOUND, check if 404 is allowed, otherwise use 400
    const preferredStatus = StatusCode.NOT_FOUND;
    const mappedStatus = mapToAllowedStatus(preferredStatus, allowedStatuses);

    return {
      status: mappedStatus,
      error: `${entity} not found`,
      details: 'The requested item does not exist or has been deleted',
    };
  },
};

/**
 * Handles Prisma errors and returns appropriate error responses within allowed status codes
 *
 * @param error - The error to handle
 * @param config - Configuration including allowed status codes, custom messages, etc.
 * @returns ErrorResponse with mapped status code or null if not a Prisma error
 *
 * @example
 * ```ts
 * // For a route that only allows 200, 400, 409
 * const errorResponse = handlePrismaError(error, {
 *   allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
 *   entityName: 'user',
 *   fieldMappings: { firstName: 'first name' }
 * });
 * ```
 */
export function handlePrismaError<T extends StatusCode>(
  error: unknown,
  config: PrismaErrorConfig<T>,
): { status: T; error: string; details: string } | null {
  if (!(error instanceof Prisma.PrismaClientKnownRequestError)) return null;

  const {
    allowedStatusCodes,
    customMessages = {},
    fieldMappings,
    entityName = 'item',
  } = config;

  // Check for custom handler first
  const customHandler = customMessages[error.code];
  if (customHandler) {
    return customHandler(error);
  }

  // Use default handler
  const defaultHandler = ERRORS[error.code];
  if (defaultHandler) {
    const result = defaultHandler(
      error,
      entityName,
      fieldMappings,
      allowedStatusCodes as StatusCode[],
    );
    return result as { status: T; error: string; details: string };
  }

  // Fallback for unhandled errors
  console.error('Unhandled Prisma error:', error);
  const fallbackStatus = mapToAllowedStatus(
    StatusCode.BAD_REQUEST,
    allowedStatusCodes,
  );

  return {
    status: fallbackStatus,
    error: `Invalid ${entityName} data provided`,
    details: 'Please check your input and try again',
  };
}
