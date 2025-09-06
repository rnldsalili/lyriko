// Re-export everything from the generated Prisma client (default import for Cloudflare Workers with D1 adapter)
export * from './generated/prisma';

// For easier imports, also re-export the adapter
export { PrismaD1 } from '@prisma/adapter-d1';
