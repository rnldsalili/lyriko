# Project Architecture & Stack

> **Important**: This file (AGENTS.md) is the canonical source for project documentation. CLAUDE.md and GEMINI.md are symbolic links to this file. Always update this file directly rather than the symbolic links.

## Overview

Lyriko is built as a monorepo with separate frontend and API applications, both designed for deployment on Cloudflare Workers.

## Tech Stack

### Package Manager

- **Bun.js** - Fast JavaScript runtime and package manager

### Frontend (`apps/web`)

- **Framework**: React
- **Routing**: React Router 7
- **Deployment**: Cloudflare Workers

### API (`apps/api`)

- **Framework**: Hono.js
- **Runtime**: Cloudflare Workers
- **Database**: Prisma ORM with SQLite D1
- **Deployment**: Cloudflare Workers

## Project Structure

```
lyriko/
├── apps/
│   ├── web/          # React frontend with React Router 7
│   └── api/          # Hono.js API server
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
│   ├── prisma/             # Prisma ORM with SQLite D1 database
│   └── typescript-config/  # Shared TypeScript configuration
└── ...
```

## Deployment Strategy

All services are architected to leverage Cloudflare Workers for:

- Global edge deployment
- Serverless execution
- Low latency response times
- Automatic scaling

## Development Notes

- Frontend and API are decoupled for independent scaling and deployment
- Both applications are optimized for the Cloudflare Workers runtime environment
- The monorepo structure allows for shared dependencies and consistent tooling

## Import Conventions

### Path Mapping

**ALWAYS use TypeScript path mapping instead of relative imports across all applications.**

Each application has its own path mapping configuration:

**API (`apps/api`)**:

```typescript
// ✅ Use path mapping
import { initializePrisma } from '@/api/lib/db';
import { UserService } from '@/api/services/user';

// ❌ Avoid relative imports
import { initializePrisma } from '../../lib/db.js';
import { UserService } from '../services/user.js';
```

**Frontend (`apps/web`)**:

```typescript
// ✅ Use path mapping (configure as needed)
import { Button } from '@/web/components/Button';
import { useAuth } from '@/web/hooks/useAuth';

// ❌ Avoid relative imports
import { Button } from '../../../components/Button';
import { useAuth } from '../../hooks/useAuth';
```

## Shared Packages

### ESLint Configuration (`packages/eslint-config`)

- **Package**: `@workspace/eslint-config`
- **Purpose**: Shared ESLint configuration for consistent code style across the workspace

### TypeScript Configuration (`packages/typescript-config`)

- **Package**: `@workspace/typescript-config`
- **Purpose**: Shared TypeScript configuration with multiple presets

### Prisma ORM (`packages/prisma`)

- **Package**: `@workspace/prisma`
- **Purpose**: Database ORM using Prisma with SQLite D1 for Cloudflare Workers
- **Features**: Schema management, client generation, and D1 adapter integration

## Database Guidelines

### Model Standards

When creating new database models, ensure they include the following audit fields:

- **createdAt**: DateTime field for tracking record creation timestamp
- **createdBy**: Field for tracking which user created the record
- **updatedAt**: DateTime field for tracking last modification timestamp
- **updatedBy**: Field for tracking which user last modified the record

### Naming Conventions

- All field names must use **camelCase** convention
- Model names should use **PascalCase**
- Database table names should be **singular** (not plural)
- Database constraints and indexes should follow descriptive naming patterns

### Example Model Structure

```prisma
model ExampleModel {
  id        String   @id @default(cuid())
  name      String
  // ... other fields
  createdAt DateTime @default(now())
  createdBy String
  updatedAt DateTime @updatedAt
  updatedBy String

  @@map("example_model")
}
```
