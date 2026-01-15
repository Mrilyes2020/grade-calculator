# Academic Average Calculator

## Overview

This is an Academic Average Calculator application designed for students to input their grades across multiple subjects and calculate weighted averages. The application is built as a mobile-first utility tool with auto-save functionality, allowing anonymous grade entry without authentication. It calculates subject averages based on TD (Travaux Dirigés), TP (Travaux Pratiques), and Exam scores with configurable weights per subject.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter (lightweight React router)
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Styling**: Tailwind CSS with shadcn/ui component library (New York style)
- **Build Tool**: Vite with custom plugins for Replit integration

The frontend follows a component-based architecture with:
- Pages in `client/src/pages/` (calculator, not-found)
- Reusable components in `client/src/components/`
- UI primitives from shadcn/ui in `client/src/components/ui/`
- Custom hooks in `client/src/hooks/` for grades management, theming, and mobile detection

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Pattern**: RESTful API with simple CRUD operations for grade submissions
- **Structure**: 
  - `server/index.ts` - Entry point and middleware setup
  - `server/routes.ts` - API route definitions
  - `server/storage.ts` - Data access layer with interface abstraction
  - `server/db.ts` - Database connection setup

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Schema Location**: `shared/schema.ts` (shared between client and server)
- **Key Tables**:
  - `grade_submissions` - Stores anonymous grade data with session IDs
  - `users` - Basic user table (kept for compatibility)

### Session Management
- Anonymous sessions using browser-generated session IDs stored in localStorage
- No authentication required - grades are persisted per session
- Auto-save with debouncing and visual status indicators

### Key Design Decisions

1. **Anonymous Usage**: No login required. Session IDs are generated client-side and stored in localStorage, enabling users to return and see their saved grades.

2. **Shared Schema**: Zod schemas in `shared/schema.ts` provide type safety and validation across both client and server, reducing duplication.

3. **Auto-Save Pattern**: Grades auto-save with a debounce mechanism and visual feedback (saving/saved/error states) to minimize friction.

4. **Mobile-First Design**: Following Material Design principles adapted for rapid grade entry with thumb-friendly tap targets.

## External Dependencies

### Database
- **PostgreSQL**: Primary database accessed via `DATABASE_URL` environment variable
- **Drizzle ORM**: Type-safe ORM with schema defined in `shared/schema.ts`
- **Drizzle Kit**: Database migration tool (run `npm run db:push` to sync schema)

### UI Components
- **shadcn/ui**: Pre-built accessible React components based on Radix UI primitives
- **Radix UI**: Low-level accessible UI primitives (dialogs, tooltips, etc.)
- **Lucide React**: Icon library

### API & State
- **TanStack React Query**: Server state management and caching
- **Zod**: Schema validation for API requests and form data

### Build & Development
- **Vite**: Development server and production bundler
- **esbuild**: Server-side bundling for production
- **TypeScript**: Type checking across the entire codebase

### Styling
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: For component variant management
- **tailwind-merge**: For merging Tailwind classes safely