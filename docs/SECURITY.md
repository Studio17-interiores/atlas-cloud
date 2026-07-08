# Security Model

ATLAS Cloud uses Supabase Auth and Postgres Row Level Security.

## Principles

- Every business record belongs to an organization.
- Every user must be a member of the organization to access its data.
- Storage files are never public by default.
- Server-side routes use service role only for controlled operations.
- AI routes must never expose secrets to the browser.

## Minimum Production Checklist

- Enable RLS on every table.
- Test cross-organization access denial.
- Use private storage buckets.
- Enable Supabase backups.
- Use Vercel environment variables.
- Rotate service role key if exposed.
- Add audit events for sensitive changes.

