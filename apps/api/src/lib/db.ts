import { PrismaClient, PrismaD1 } from '@workspace/prisma';

let prisma: PrismaClient;

/**
 * Initialize Prisma client with D1 adapter for Cloudflare Workers
 */
export function initializePrisma(db: D1Database): PrismaClient {
  if (!prisma) {
    const adapter = new PrismaD1(db);
    prisma = new PrismaClient({ adapter });
  }
  return prisma;
}
