# ATLAS Cloud Architecture

```text
ATLAS Cloud
├─ Next.js App
│  ├─ Server Components
│  ├─ Server Actions
│  ├─ API Routes
│  └─ UI Components
├─ Supabase
│  ├─ Auth
│  ├─ Postgres
│  ├─ Row Level Security
│  └─ Storage
├─ Intelligence
│  ├─ Rule-based operations engine
│  ├─ OpenAI review API
│  ├─ OCR pipeline
│  └─ Automation jobs
└─ Deployment
   ├─ Vercel
   ├─ Supabase backups
   └─ Domain + SSL
```

## Core Rule

ATLAS should never become complicated. Cloud features must preserve the local V1 principle:

> In five minutes, Studio 17 should know what matters today.

