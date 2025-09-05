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
- **Deployment**: Cloudflare Workers

## Project Structure

```
lyriko/
├── apps/
│   ├── web/          # React frontend with React Router 7
│   └── api/          # Hono.js API server
├── packages/
│   ├── eslint-config/      # Shared ESLint configuration
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

## Shared Packages

### ESLint Configuration (`packages/eslint-config`)

- **Package**: `@workspace/eslint-config`
- **Purpose**: Shared ESLint configuration for consistent code style across the workspace

### TypeScript Configuration (`packages/typescript-config`)

- **Package**: `@workspace/typescript-config`
- **Purpose**: Shared TypeScript configuration with multiple presets
