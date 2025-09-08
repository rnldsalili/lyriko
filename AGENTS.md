# Lyriko Monorepo

> **Important**: This file is the canonical source. CLAUDE.md and GEMINI.md are symbolic links.

## Stack

- **Bun.js** package manager
- **Frontend**: React + React Router 7 → Cloudflare Workers
- **API**: Hono.js + Prisma SQLite D1 → Cloudflare Workers

## Structure

```
lyriko/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Hono.js API
├── packages/
│   ├── constants/    # Shared enums
│   ├── eslint-config/
│   ├── prisma/       # DB ORM + D1
│   ├── typescript-config/
│   └── validators/   # Zod schemas
```

## Import Rules

**Always use TypeScript path mapping, never relative imports.**

```typescript
// ✅ API imports
import { initializePrisma } from '@/api/lib/db';

// ✅ Web imports
import { Button } from '@/web/components/Button';

// ❌ Avoid
import { UserService } from '../services/user.js';
```

## Packages

- `@workspace/constants` - Shared enums/constants
- `@workspace/eslint-config` - ESLint rules
- `@workspace/typescript-config` - TS configs
- `@workspace/prisma` - DB ORM + D1 adapter
- `@workspace/validators` - Zod schemas + OpenAPI

## Database Rules

### Required Audit Fields

```prisma
model ExampleModel {
  id        String   @id @default(cuid())
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String
  @@map("example_model")
}
```

### Naming

- Fields: `camelCase`
- Models: `PascalCase`
- Tables: `singular`

## Migrations

### Steps

1. **Create** (from `packages/prisma`):

   ```bash
   bunx --bun wrangler d1 migrations create lyriko <name>
   ```

2. **Generate SQL** (from `packages/prisma`):

   ```bash
   # Initial migration
   bunx --bun prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<file>.sql

   # Schema changes
   bunx --bun prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<file>.sql
   ```

3. **Apply** (local must be from `apps/api`):

   ```bash
   # Local (from apps/api only)
   cd apps/api && bunx --bun wrangler d1 migrations apply lyriko --local

   # Remote (from either directory)
   bunx --bun wrangler d1 migrations apply lyriko --remote
   ```

4. **Generate client** (from `packages/prisma`):
   ```bash
   bunx --bun prisma generate
   ```

## Error Handling

Use `handlePrismaError` utility (`apps/api/src/lib/prisma-errors.ts`):

```typescript
import { StatusCode } from '@workspace/constants/status-code';
import { handlePrismaError } from '@/api/lib/prisma-errors';

try {
  const entity = await prisma.entity.create({
    data: {
      ...entityData,
      createdBy: <value>,
      updatedBy: <value>,
    },
  });

  return c.json(
    {
      status: StatusCode.CREATED,
      data: entity,
    },
    StatusCode.CREATED,
  );
} catch (error) {
  const prismaErrorResponse = handlePrismaError(error, {
    allowedStatusCodes: [StatusCode.BAD_REQUEST, StatusCode.CONFLICT],
    entityName: 'entity',
    fieldMappings: {
      firstName: 'first name', // Example mapping
    },
  });

  if (prismaErrorResponse) {
    return c.json(prismaErrorResponse, prismaErrorResponse.status);
  }
  throw error;
}
```

**Error codes**: P2002 (duplicates), P2000 (too long), P2003 (FK violation), P2004 (constraint), P2011/P2012/P2013 (missing fields), P2025 (not found)

**Rules**: Always use utility, specify `entityName` and `allowedStatusCodes`, map technical fields, return JSON with status code, let unhandled errors throw
