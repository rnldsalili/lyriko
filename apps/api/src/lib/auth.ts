import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';

import { initializePrisma } from '@/api/lib/db';

import type { Env } from '@/api/index';
import type { BetterAuthOptions } from 'better-auth';
import type { Context } from 'hono';

// Base configuration for better-auth
const authConfig = {
  database: {
    provider: 'sqlite' as const,
  },
  emailAndPassword: {
    enabled: true,
  },
  // Add other auth configuration here
} satisfies BetterAuthOptions;

// For runtime usage - creates auth with D1 database
export function createAuth(c: Context<Env>) {
  const prisma = initializePrisma(c.env.DB);
  return betterAuth({
    ...authConfig,
    database: prismaAdapter(prisma, authConfig.database),
    baseURL: c.env.BETTER_AUTH_URL,
    secret: c.env.BETTER_AUTH_SECRET,
  });
}

// For CLI usage only - conditionally export based on environment
export const auth = (() => {
  // Check if we're in a Node.js environment (not Cloudflare Workers)
  if (
    typeof process !== 'undefined' &&
    process.versions &&
    process.versions.node
  ) {
    // We're in Node.js environment (CLI)
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { PrismaClient } = require('@workspace/prisma');
    return betterAuth({
      database: prismaAdapter(new PrismaClient(), authConfig.database),
    });
  }

  // In Cloudflare Workers, return undefined - CLI tools won't be used here
  return undefined;
})();
