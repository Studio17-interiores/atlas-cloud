# ATLAS Cloud Deployment

## 1. Create Supabase

1. Create a new Supabase project.
2. Open SQL Editor.
3. Run `supabase/schema.sql`.
4. Create storage buckets:
   - `project-documents`
   - `templates`

## 2. Create Vercel Project

1. Push `atlas-cloud` to GitHub.
2. Import the repo in Vercel.
3. Add environment variables from `.env.example`.
4. Deploy.

## 3. Auth Setup

In Supabase Auth:

- Enable email/password.
- Set site URL to your Vercel URL.
- Add redirect URLs for production and localhost.

## 4. First Organization

Create an organization for Studio 17 and add your user as owner.

This can be done with a temporary SQL insert after your first login.

## 5. Required Before Real Use

- Confirm RLS policies.
- Test user cannot access another organization.
- Test file upload/download.
- Enable database backups.
- Enable Vercel production protection if needed.

