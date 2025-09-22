# Lyriko

A modern monorepo built with React and Hono.js, designed for deployment on Cloudflare Workers.

## 🏗️ Architecture

This project uses a monorepo structure with separate frontend and API applications:

- **Frontend (`apps/web`)**: React application with React Router 7
- **API (`apps/api`)**: Hono.js server
- **Packages**: Shared ESLint and TypeScript configurations

## 🚀 Tech Stack

- **Runtime**: Bun.js
- **Frontend**: React + React Router 7
- **Backend**: Hono.js
- **Deployment**: Cloudflare Workers
- **Styling**: Tailwind CSS
- **Type Safety**: TypeScript
- **Code Quality**: ESLint + Prettier

## 📁 Project Structure

```
lyriko/
├── apps/
│   ├── web/          # React frontend
│   └── api/          # Hono.js API
├── packages/
│   ├── eslint-config/      # Shared ESLint config
│   └── typescript-config/  # Shared TypeScript config
└── ...
```

## 🛠️ Development

### Prerequisites

- [Bun](https://bun.sh) - Fast JavaScript runtime and package manager

### Installation

```bash
pnpm install
```

### Available Scripts

```bash
# Development
pnpm run dev          # Start all apps in development mode

# Code Quality
pnpm run lint         # Lint all workspaces
pnpm run format       # Format all workspaces

# Individual Apps
cd apps/web && pnpm run dev      # Start web app only
cd apps/api && pnpm run dev      # Start API only
```

### Environment Setup

Both applications are configured for Cloudflare Workers deployment. Make sure you have:

1. Wrangler CLI configured
2. Cloudflare account set up
3. Required environment variables in `.env` files

### Database

pnpm dlx wrangler d1 migrations create lyriko create_user_table
pnpm dlx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create_user_table.sql

pnpm dlx wrangler d1 migrations apply lyriko --local
pnpm dlx wrangler d1 migrations apply lyriko --remote
pnpm dlx prisma generate

### UI

cd packages/ui
pnpm dlx shadcn@latest add button

## 🚢 Deployment

Both apps are optimized for Cloudflare Workers:

```bash
# Deploy web app
cd apps/web && pnpm run deploy

# Deploy API
cd apps/api && pnpm run deploy
```

## 📋 Initial Setup Commands

The project was bootstrapped using:

```bash
# API setup
pnpm create hono@latest

# Web app setup
pnpm create cloudflare@latest -- my-react-router-app --framework=react-router
```

## 🤖 AI Agents Configuration

To set up symbolic links for AI agent configuration files:

```bash
ln -s AGENTS.md CLAUDE.md
ln -s AGENTS.md GEMINI.md
```

This creates symbolic links so that both Claude and Gemini agents reference the same configuration file. When making updates to coding standards and project rules, only edit the `AGENTS.md` file - changes will automatically apply to both agents.

---
