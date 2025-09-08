import type { ZodError } from 'zod';

export interface FormattedZodError {
  field: string;
  message: string;
  code: string;
}

export interface ZodValidationResult {
  success: false;
  error: ZodError;
}

/**
 * Formats Zod validation errors into a user-friendly structure
 *
 * @example
 * ```typescript
 * // For a validation error on { user: { email: "invalid" } }
 * const result = {
 *   success: false,
 *   error: zodError
 * };
 * const formatted = formatZodErrors(result);
 * // Returns: [{ field: "user.email", message: "Invalid email", code: "invalid_string" }]
 * ```
 *
 * @example
 * ```typescript
 * // For array validation errors
 * const result = {
 *   success: false,
 *   error: zodErrorWithArrayIssues
 * };
 * const formatted = formatZodErrors(result);
 * // Returns: [{ field: "items[0].name", message: "Required", code: "invalid_type" }]
 * ```
 */
export function formatZodErrors(
  result: ZodValidationResult,
): FormattedZodError[] {
  if (result.success) {
    return [];
  }

  return result.error.issues.map((issue) => ({
    field: formatFieldPath(issue.path),
    message: issue.message,
    code: issue.code,
  }));
}

/**
 * Formats the field path from Zod issue path array
 */
function formatFieldPath(path: (string | number | symbol)[]): string {
  if (path.length === 0) {
    return 'root';
  }

  return path
    .map((segment, index) => {
      // Handle array indices
      if (typeof segment === 'number') {
        return `[${segment}]`;
      }

      // Convert symbol to string
      const segmentStr =
        typeof segment === 'symbol' ? segment.toString() : segment;

      // Handle nested object properties
      if (index === 0) {
        return segmentStr;
      }

      // Check if the previous segment was an array index
      const prevSegment = path[index - 1];
      if (typeof prevSegment === 'number') {
        return `.${segmentStr}`;
      }

      return `.${segmentStr}`;
    })
    .join('');
}
