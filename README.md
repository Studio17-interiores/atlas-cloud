# ATLAS Cloud

ATLAS Cloud is the production-ready foundation for Studio 17's operating system.

This is not the local prototype. This folder contains the real platform architecture:

- Next.js application structure.
- Supabase PostgreSQL schema.
- Row Level Security policies.
- Storage bucket plan.
- Data model for clients, projects, tasks, decisions, money, documents, templates, goals, notes, history, and automations.
- Migration path from the local ATLAS V1.
- Deployment checklist for Vercel + Supabase.

## Recommended Stack

- Frontend: Next.js App Router.
- Backend: Next.js Server Actions and API routes.
- Auth: Supabase Auth.
- Database: Supabase Postgres.
- Storage: Supabase Storage.
- AI: OpenAI API via server-side route.
- Hosting: Vercel.

## What Is Ready Here

- Product architecture.
- Database schema.
- Security policies.
- App file structure.
- Typed domain model.
- Supabase client setup.
- Cloud migration utilities.
- Deployment guide.

## What Requires External Setup

To run this as a real cloud platform, you need:

1. Create a Supabase project.
2. Run `supabase/schema.sql`.
3. Create storage buckets from `supabase/storage.md`.
4. Create a Vercel project.
5. Add environment variables from `.env.example`.
6. Install dependencies and deploy.

