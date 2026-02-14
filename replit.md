# replit.md

## Overview

This is a **Valentine's Day anonymous confession and bouquet-sending platform** called "V4ULT" (Vault). Users can create a personalized Valentine page with a custom URL slug (e.g., `/to/sarah`), share the link, and receive anonymous confessions or virtual bouquets. Creators can log into an inbox to view received messages. The design theme is "Botanical Letter Press" with warm parchment tones, wax-red accents, and rose/sage colors.

**Core user flows:**
1. **Home page** (`/`): Create a Valentine page by choosing a display name, custom slug, and passcode
2. **Send page** (`/to/:slug`): Anonymous visitors send either a "confession" (with a vibe like coffee/dinner/romance) or a virtual bouquet with a note
3. **Inbox page** (`/inbox`): Creators log in with slug + passcode to view received messages

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight client-side router)
- **State/Data Fetching**: TanStack React Query v5 for server state management
- **UI Components**: shadcn/ui (new-york style) built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming; custom "Botanical Letter Press" theme defined in `client/src/index.css`
- **Animations**: Framer Motion for card animations, transitions, and micro-interactions
- **Forms**: React Hook Form with Zod resolvers for validation
- **Special effects**: canvas-confetti for celebration animations after sending messages
- **Fonts**: Cormorant Garamond (headlines), Lora (body), DM Sans (UI) via Google Fonts
- **Build**: Vite with React plugin; output to `dist/public`
- **Path aliases**: `@/` → `client/src/`, `@shared/` → `shared/`, `@assets/` → `attached_assets/`

### Backend
- **Runtime**: Node.js with Express
- **Language**: TypeScript, executed via `tsx`
- **API style**: RESTful JSON API under `/api/*` prefix
- **API contract**: Shared route definitions in `shared/routes.ts` with Zod schemas for input/output validation — acts as a contract between frontend and backend
- **Sessions**: express-session with MemoryStore (for inbox authentication)
- **Authentication**: Simple passcode-based auth (no user accounts/passwords in traditional sense). Creators set a passcode; they log in with slug + passcode to access their inbox. Session stores `creatorId`.
- **Build for production**: esbuild bundles the server to `dist/index.cjs`; Vite builds the client to `dist/public`

### Shared Layer (`shared/`)
- **Schema** (`shared/schema.ts`): Drizzle ORM table definitions and Zod insert schemas for `creators` and `messages` tables
- **Routes** (`shared/routes.ts`): API contract definitions with method, path, input schemas, and response schemas — used by both client hooks and server route handlers

### Database
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Database**: PostgreSQL (connection via `DATABASE_URL` environment variable)
- **Schema push**: `npm run db:push` uses drizzle-kit to push schema to database
- **Tables**:
  - `creators`: id, display_name, slug (unique), passcode, created_at
  - `messages`: id, creator_id (FK), type (confession/bouquet), vibe, content, bouquet_id, note, sender_device, sender_location, sender_timestamp, is_read, is_archived
- **Storage layer**: `server/storage.ts` wraps all database operations in a `DatabaseStorage` class implementing `IStorage` interface

### Key Design Decisions

1. **Shared API contract pattern**: The `shared/routes.ts` file defines API contracts with Zod schemas shared between client and server. This ensures type safety across the boundary without code generation. Client hooks in `use-creators.ts` and `use-messages.ts` reference these contracts directly.

2. **Simple passcode auth over full user system**: The app uses a lightweight passcode model rather than email/password authentication, fitting the ephemeral Valentine's Day use case. Sessions are stored in memory (MemoryStore).

3. **Anonymous messaging by design**: Messages don't require sender authentication. Some metadata (device, location, timestamp) is captured for safety/transparency.

4. **Monorepo structure**: Client, server, and shared code live in one repo with path aliases, allowing direct import of schemas and route contracts across boundaries.

## External Dependencies

### Required Services
- **PostgreSQL Database**: Required. Connection string via `DATABASE_URL` environment variable. Used for all persistent data (creators and messages).

### Key Environment Variables
- `DATABASE_URL` — PostgreSQL connection string (required)
- `SESSION_SECRET` — Secret for express-session (defaults to `'valentine_secret'` if not set)
- `NODE_ENV` — Controls production vs development behavior (static serving vs Vite dev server, secure cookies)

### Notable NPM Packages
- `drizzle-orm` + `drizzle-kit` — Database ORM and migration tooling
- `framer-motion` — Animations
- `canvas-confetti` — Confetti celebration effects
- `wouter` — Client-side routing
- `@tanstack/react-query` — Server state management
- `react-hook-form` + `@hookform/resolvers` — Form handling with Zod validation
- `express-session` + `memorystore` — Session management
- Full suite of `@radix-ui/*` components via shadcn/ui