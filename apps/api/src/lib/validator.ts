import { zValidator as zv } from '@hono/zod-validator';

import type { ValidationTargets } from 'hono';
import type { ZodType } from 'zod';

export const zValidator = <
  T extends ZodType,
  Target extends keyof ValidationTargets,
>(
  target: Target,
  schema: T,
) =>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  zv(target, schema, async (result, c) => {
    if (!result.success) {
      console.error(JSON.stringify(result, null, 2));
    }
  });
