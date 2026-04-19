# Architecture

## Three Environments

```
┌──────────────────────────────────────────────────────────┐
│                    DEVELOPMENT (local)                    │
│  Next.js dev server (localhost:3000)                     │
│  Supabase CLI + Docker (localhost:54321)                 │
│  Stripe test keys                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                 STAGING / PREVIEW (per-PR)               │
│  Vercel preview URL (auto-deployed from PR)             │
│  Supabase staging project (separate from prod)          │
│  Stripe test keys                                        │
└──────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────┐
│                    PRODUCTION                             │
│  Vercel production (main branch)                        │
│  Supabase production project (PITR enabled)             │
│  Stripe live keys                                        │
└──────────────────────────────────────────────────────────┘
```

## Data Flow

```
Browser
  │
  ├── Static assets ──────────────────► Vercel CDN
  │
  ├── Page requests ─────────────────► Next.js App Router (SSR/RSC)
  │                                         │
  │                                         ├── Supabase (RLS-gated queries)
  │                                         │     └── PostgreSQL (Supabase Cloud)
  │                                         │
  │                                         └── Stripe API (server-side only)
  │
  ├── Client mutations ──────────────► Next.js Server Actions
  │                                         └── Supabase (anon key + RLS)
  │
  └── Realtime (WebSocket) ──────────► Supabase Realtime (stock updates)

Stripe Checkout (hosted) ────────────► Stripe Webhook ──► /api/webhooks/stripe
                                                               └── Order creation
                                                               └── Stock decrement
                                                               └── Cart clear
```

## Key Architectural Decisions

| Decision      | Choice                     | Rationale                                                     |
| ------------- | -------------------------- | ------------------------------------------------------------- |
| Auth          | Supabase Auth              | Integrated with DB, handles email + magic link                |
| Client state  | Zustand                    | Lightweight, no boilerplate, persists to localStorage         |
| Server state  | TanStack Query             | Caching, refetching, optimistic updates                       |
| Search        | Postgres tsvector + GIN    | No external service needed; scales well for this catalog size |
| Image storage | Supabase Storage CDN       | Integrated auth, public CDN for storefront images             |
| Payments      | Stripe Checkout            | PCI compliant, handles complex tax/shipping UI                |
| Admin gate    | Middleware + profiles.role | RLS double-checked server-side for every request              |
