# Euchre Card Rankings

## Overview

This is an interactive learning tool that teaches beginners how card rankings work in the card game Euchre. Users select a trump suit, and the app visually displays how card hierarchies shift — including the Right and Left Bower mechanics. Cards animate smoothly between positions using Framer Motion when the trump suit changes.

The app is primarily a client-side educational tool. The backend exists as scaffolding but the core functionality lives entirely in the React frontend.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Monorepo Structure
The project uses a three-folder monorepo layout:
- **`client/`** — React SPA (Vite + TypeScript)
- **`server/`** — Express 5 API server
- **`shared/`** — Code shared between client and server (schema, route definitions, types)

### Frontend
- **Framework**: React with TypeScript, bundled by Vite
- **Routing**: Wouter (lightweight client-side router)
- **State Management**: React Query (`@tanstack/react-query`) for server state, React `useState`/`useMemo` for local state
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming, custom fonts (DM Sans, Outfit)
- **Animations**: Framer Motion for card layout animations with `layoutId` for smooth transitions between trump suit changes
- **Icons**: Lucide React
- **Path aliases**: `@/` maps to `client/src/`, `@shared/` maps to `shared/`

### Core Domain Logic
- **`client/src/lib/euchre.ts`** — Contains all Euchre game logic: suit definitions, card ranking calculations, bower detection, and trump hierarchy generation. This is a pure client-side module with no backend dependency.
- **`client/src/components/PlayingCard.tsx`** — Animated card component with bower badges and trump indicators
- **`client/src/components/SuitIcon.tsx`** — SVG suit icons using Lucide

### Backend
- **Framework**: Express 5 on Node.js with TypeScript (run via `tsx`)
- **Database**: PostgreSQL via `node-postgres` (`pg` Pool)
- **ORM**: Drizzle ORM with Drizzle Zod for schema validation
- **API Pattern**: Routes defined in `shared/routes.ts` with Zod schemas, implemented in `server/routes.ts`
- **Dev Server**: Vite dev server middleware is attached to Express in development; static files served in production
- **Build**: Custom build script using esbuild for server + Vite for client, outputs to `dist/`

### Database Schema
- Currently minimal — just a `dummy` table with `id` (serial) and `name` (text)
- Schema defined in `shared/schema.ts` using Drizzle's `pgTable`
- Also contains Zod schemas for Euchre domain types (Suit, Card) used client-side
- Migrations managed via `drizzle-kit push` (schema push approach, not migration files)

### Key Commands
- `npm run dev` — Start development server
- `npm run build` — Build for production
- `npm run start` — Run production build
- `npm run db:push` — Push schema changes to database

## External Dependencies

### Database
- **PostgreSQL** — Connected via `DATABASE_URL` environment variable. Required for the server to start, though the app's core Euchre functionality is client-only.

### Key NPM Packages
- **drizzle-orm** + **drizzle-kit** — Database ORM and migration tooling
- **connect-pg-simple** — PostgreSQL session store (available but not actively used yet)
- **framer-motion** — Card shuffle animations
- **wouter** — Client-side routing
- **zod** — Runtime schema validation shared between client and server
- **@tanstack/react-query** — Async state management

### Replit-Specific
- **@replit/vite-plugin-runtime-error-modal** — Error overlay in development
- **@replit/vite-plugin-cartographer** — Dev tooling (dev only)
- **@replit/vite-plugin-dev-banner** — Dev banner (dev only)