import { Hono } from 'hono';
import { createFactory } from 'hono/factory';

import type { Env } from '@/api/index';

export const createRouter = () => {
  return new Hono<Env>();
};

export const createHonoFactory = () => {
  return createFactory<Env>();
};
