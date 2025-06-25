# 案件管理システム (Project Management System)

## Overview

This is a full-stack project management application built for managing "anken" (projects/cases) in a Japanese business context. The application provides comprehensive CRUD operations for project management with a modern React frontend and Express.js backend.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state
- **Routing**: Wouter for client-side routing
- **Form Handling**: React Hook Form with Zod validation
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **API Style**: RESTful API architecture
- **Data Validation**: Zod schemas shared between frontend and backend
- **Development**: Hot reload with Vite middleware integration

### Data Storage Solutions
- **Database**: PostgreSQL with relational schema
- **ORM**: Prisma ORM with type-safe queries and relations
- **Schema Management**: Prisma schema with foreign key relationships
- **Tables**: accounts, contacts, anken with proper relational mapping
- **API Integration**: Automatic inclusion of related data (contact_name, account_name)

## Key Components

### Database Schema
The core entity is `anken` (project) with comprehensive fields:
- Basic info: name, detail, notes, status
- Timeline: start_date, end_date, limit_date
- Financial: price, contract details
- Technical: required_skills, nice_skills, platform, framework, database
- Location: ken (prefecture), location details
- Work arrangements: telework options, meeting requirements

### API Endpoints
- `GET /api/anken` - List all projects with search and filter capabilities
- `GET /api/anken/:id` - Get specific project details
- `POST /api/anken` - Create new project
- `PUT /api/anken/:id` - Update existing project
- `DELETE /api/anken/:id` - Delete project
- `GET /api/stats` - Get dashboard statistics

### UI Components
- **Dashboard**: Main interface with statistics and project table
- **Project Table**: Paginated table with search, filter, and actions
- **Project Forms**: Modal-based create/edit forms with validation
- **Project View**: Read-only detailed project view
- **Statistics Cards**: Overview metrics display

## Data Flow

1. **Client Requests**: React components use TanStack Query hooks
2. **API Layer**: Express.js routes handle HTTP requests
3. **Validation**: Zod schemas validate input data
4. **Storage Layer**: MemStorage (development) or Drizzle ORM (production)
5. **Response**: JSON responses sent back to client
6. **UI Updates**: TanStack Query automatically updates UI state

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL connection for production
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **react-hook-form**: Form handling
- **wouter**: Lightweight routing

### Development Dependencies
- **tsx**: TypeScript execution for development
- **esbuild**: Fast bundling for production
- **@replit/vite-plugin-***: Replit-specific development tools

## Deployment Strategy

### Development Environment
- **Command**: `npm run dev`
- **Port**: 5000 (configured for Replit)
- **Features**: Hot reload, Vite middleware, development middleware

### Production Build
- **Frontend Build**: `vite build` - Creates optimized static assets
- **Backend Build**: `esbuild` - Bundles server code with external packages
- **Output**: `dist/` directory with both client and server assets

### Database Setup
- **Development**: Uses MemStorage for quick iteration
- **Production**: PostgreSQL via Neon serverless with Drizzle migrations
- **Migration Command**: `npm run db:push`

### Deployment Configuration
- **Target**: Autoscale deployment on Replit
- **Build Command**: `npm run build`
- **Start Command**: `npm run start`
- **Environment**: Requires `DATABASE_URL` for PostgreSQL connection

## Changelog
- June 24, 2025: Enhanced database schema based on real account data
  - Expanded Account model with comprehensive business fields (address, contact info, industry, revenue)
  - Enhanced Contact model with job details and contact information
  - Updated forms to capture detailed account and contact information
  - Removed unnecessary status and meeting fields from anken
  - Implemented telework display with symbols (〇△✕) and legends
  - Added comprehensive search and filter functionality
  - Converted to card-based layout for better information display
- June 24, 2025: Converted to Prisma-based relational system
  - Implemented PostgreSQL with Prisma ORM
  - Added accounts, contacts, and anken tables with foreign key relationships
  - Created RESTful APIs for all entities with relational data
  - Built HTML/JS frontend for managing opportunities with linked contacts and accounts
  - Added Docker support for portable deployment
- June 24, 2025: Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.
Japanese business conventions: Surname first, given name second in contact forms.
Data structure: Email addresses belong to contacts, not accounts (companies).
Form simplification: Remove unnecessary fields like salutation and duplicate company name fields.
Duplicate prevention: Company names must be unique (block registration), contact names show warning but allow registration.
Auto-generation: Contact names automatically generated from lastname + firstname when both fields are provided.