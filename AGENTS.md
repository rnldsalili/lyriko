# Lyriko Monorepo

> **Important**: This file is the canonical source. CLAUDE.md and GEMINI.md are symbolic links.

## Development Guidelines

**Always follow existing implementations in the codebase to ensure consistency.**

When adding new features or making changes:

- Study similar existing code patterns and structures
- Follow the same naming conventions, file organization, and architectural patterns
- Use the same libraries, utilities, and approaches already established
- Maintain consistency in error handling, validation, and response formats

## Stack

- **Bun.js** package manager
- **Frontend**: React + React Router 7 → Cloudflare Workers
- **API**: Hono.js + Prisma SQLite D1 → Cloudflare Workers
- **Authentication**: Better Auth

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
│   ├── ui/           # shadcn/ui components
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

- `@workspace/api-client` - Type-safe API client
- `@workspace/constants` - Shared enums/constants
- `@workspace/eslint-config` - ESLint rules
- `@workspace/typescript-config` - TS configs
- `@workspace/prisma` - DB ORM + D1 adapter
- `@workspace/ui` - shadcn/ui React components
- `@workspace/validators` - Zod schemas + OpenAPI

## Validation Rules

When creating new validation schemas, **always check `@workspace/validators/common` first** for available reusable validators before creating new ones.

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

## Authentication (Better Auth)

Better Auth handles user authentication with Prisma adapter for database integration.

### Schema Integration

Better Auth models are integrated with the main Prisma schema:

- `User` - Enhanced with better-auth fields (`name`, `email`, `emailVerified`, `image`)
- `Session` - Auth sessions
- `Account` - OAuth accounts and credentials
- `Verification` - Email verification tokens

### Configuration Files

- **Backend**: `apps/api/src/lib/auth.ts` - Creates auth instances
- **Frontend**: `apps/web/app/lib/auth.ts` - Auth client and hooks

**Frontend** (React components):

```typescript
import { useSession, signIn, signOut } from '@/web/lib/auth';

const { data: session, isLoading } = useSession();
await signIn.email({ email, password });
await signOut();
```

### Environment Detection

Auth setup uses environment detection to avoid Cloudflare Workers compatibility issues:

- Node.js (CLI): Uses regular PrismaClient
- Cloudflare Workers: Uses D1 adapter via `createAuth()`

## UI Components

The `@workspace/ui` package uses **shadcn/ui** for React components.

### Adding New Components

To add shadcn/ui components (e.g., Button, Card, etc.):

```bash
cd packages/ui
bunx --bun shadcn@latest add button
```

### Usage

Import UI components using TypeScript path mapping:

```typescript
// ✅ Correct import
import { Button } from '@workspace/ui/components/button';

// ❌ Avoid relative imports
import { Button } from '../../packages/ui/components/button';
```

**Important**: Always use shadcn/ui CLI to add new components rather than creating them manually. This ensures proper component structure, theming, and TypeScript definitions.

## Icon Guidelines

**Always use lucide-react for all icons. Never create custom SVG icons.**

```typescript
// ✅ Correct
import { Menu, LogOut, Github } from 'lucide-react';
<Menu className="h-6 w-6" />

// ❌ Avoid custom SVGs
<svg><path d="..." /></svg>
```

## shadcn/ui Component Usage

When asked to use shadcn components, use the MCP server.

### Planning Rule

When asked to plan using anything related to shadcn:

- Use the MCP server during planning
- Apply components wherever components are applicable
- Use whole blocks where possible (e.g., login page, calendar)

### Implementation Rule

When implementing:

- First call the demo tool to see how it is used
- Then implement it so that it is implemented correctly

## Theme and Styling Guidelines

**Always use the theme system defined in `packages/ui/src/styles/globals.css`.**

### CSS Custom Properties

The project uses CSS custom properties for theming with automatic dark mode support. **Never use hardcoded colors.**

```typescript
// ✅ Use theme colors
className = 'bg-background text-foreground';
className = 'border-border bg-card text-card-foreground';
className = 'bg-primary text-primary-foreground';

// ❌ Avoid hardcoded colors
className = 'bg-white text-black dark:bg-gray-900 dark:text-white';
className = 'border-gray-200 dark:border-gray-800';
```

### Available Theme Colors

Use these semantic color tokens from the theme system:

- **Layout**: `background`, `foreground`, `border`
- **Content**: `card`, `card-foreground`, `popover`, `popover-foreground`
- **Interactive**: `primary`, `primary-foreground`, `secondary`, `secondary-foreground`
- **States**: `muted`, `muted-foreground`, `accent`, `accent-foreground`, `destructive`, `destructive-foreground`
- **Forms**: `input`, `ring`
- **Sidebar**: `sidebar`, `sidebar-foreground`, `sidebar-primary`, `sidebar-primary-foreground`, `sidebar-accent`, `sidebar-accent-foreground`, `sidebar-border`, `sidebar-ring`
- **Charts**: `chart-1` through `chart-5`
- **Typography**: Custom font families available via `font-sans` (Geist), `font-serif` (Lora), `font-mono` (Fira Code)
- **Shadows**: `shadow-2xs`, `shadow-xs`, `shadow-sm`, `shadow`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`

### Dark Mode Support

The theme automatically handles dark mode through CSS custom properties. Components should:

- Use semantic color tokens instead of specific colors
- Rely on the `.dark` class for dark mode switching
- Never manually implement dark mode logic

### Examples

```typescript
// ✅ Correct theming
<div className="bg-card border-border rounded-lg p-4">
  <h2 className="text-card-foreground font-semibold">Title</h2>
  <p className="text-muted-foreground">Description</p>
  <Button className="bg-primary text-primary-foreground">Action</Button>
</div>

// ✅ Loading spinner with theme colors
<div className="animate-spin border-b-2 border-foreground" />

// ❌ Avoid hardcoded colors
<div className="bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700">
  <span className="text-gray-900 dark:text-white">Text</span>
</div>
```
