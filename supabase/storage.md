# Supabase Storage

Create these buckets:

## `project-documents`

For contracts, photos, plans, deliveries, invoices, budgets, and project files.

Suggested path:

```text
{organization_id}/{project_id}/{document_id}/{filename}
```

## `templates`

For reusable Studio 17 templates.

Suggested path:

```text
{organization_id}/{template_id}/{filename}
```

## Storage Policies

Supabase Storage policies should allow authenticated users to access files only if they are members of the organization encoded in the path.

For the MVP, enforce access in server actions using the service role key, and do not expose direct public URLs.

