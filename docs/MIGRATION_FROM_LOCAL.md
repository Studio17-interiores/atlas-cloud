# Migration From Local ATLAS V1

The local ATLAS V1 stores data in browser `localStorage` and files in browser `IndexedDB`.

## Data Migration

1. Open local ATLAS.
2. Go to `Sistema`.
3. Export backup.
4. Use the future cloud import page to upload the JSON.

## File Migration

Files stored in IndexedDB cannot be exported automatically through the JSON backup.

Recommended process:

1. Open each project in local ATLAS.
2. Download documents.
3. Upload them to ATLAS Cloud project documents.
4. Upload reusable files to Templates.

## Mapping

Local arrays map to cloud tables:

- `clients` -> `clients`
- `projects` -> `projects`
- `tasks` -> `tasks`
- `meetings` -> `meetings`
- `decisions` -> `decisions`
- `invoices`, `budgets`, `transactions` -> `money_movements`
- `projectDocuments` -> `documents`
- `templates` -> `templates`
- `businessGoals`, `goals`, `marketing` -> `goals`
- `projectNotes` -> `notes`
- `history` -> `history_events`
- `weeklyReviews` -> `weekly_reviews`

