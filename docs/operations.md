# Operations Runbook

## Deploy Process

1. Merge PR to `main` → CI runs (lint, typecheck, tests, build)
2. Supabase migrations applied to production via `supabase db push`
3. Vercel builds and deploys automatically
4. Sentry release created with commit SHA
5. Git tag created (`v-YYYY.MM.DD-<sha>`)
6. Post-deploy smoke test runs against production

## Rollback Steps

### App rollback (Vercel instant rollback)

1. Go to Vercel project → Deployments
2. Find the last stable deployment
3. Click "..." → "Promote to Production"
4. Vercel redirects traffic within seconds

### Database rollback

**Migrations are forward-only.** If a migration breaks production:

1. Write a new corrective migration that undoes the change
2. Deploy that migration via `supabase db push`
3. Do NOT attempt to reverse migrations manually in the dashboard

## Migration Strategy

- All schema changes via SQL files in `supabase/migrations/`
- Files are timestamped (`YYYYMMDDHHMMSS_description.sql`)
- Run `supabase db diff` locally to verify changes before committing
- Never edit the production schema in the Supabase dashboard
- CI validates migrations from scratch on every PR

## Key Rotation Runbook

### Supabase Service Role Key

1. Generate new key in Supabase dashboard → Settings → API
2. Update `SUPABASE_SERVICE_ROLE_KEY` in Vercel (all environments)
3. Update GitHub Actions secrets
4. Verify production `/api/health` returns `ok`
5. Revoke old key in Supabase dashboard

### Stripe Keys

1. Generate new keys in Stripe dashboard → Developers → API Keys
2. Update both `STRIPE_SECRET_KEY` and `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` in Vercel
3. Update webhook endpoint and copy new `STRIPE_WEBHOOK_SECRET`
4. Verify checkout flow in staging before promoting to production
5. Revoke old keys in Stripe dashboard

### GA4 / Axiom / Sentry

Follow each service's token rotation documentation. Update env vars in Vercel and GitHub Actions.

**Rotation schedule:** Rotate all service keys every 90 days, or immediately after any suspected compromise.

## Incident Response

1. **Identify** — Check Sentry for error spikes, Axiom for 5xx rates, UptimeRobot for downtime alerts
2. **Contain** — If checkout is broken, disable payment button via feature flag or env var
3. **Diagnose** — Check Axiom logs (`ecomm-prod` dataset), Sentry error trail, Vercel function logs
4. **Fix** — Deploy hotfix via standard PR process (skip branch protection for P0 with manager approval)
5. **Rollback** — If fix is not immediately available, use Vercel instant rollback
6. **Post-mortem** — Write incident report within 48h; add preventive tests

## Monitoring Links

- **Vercel**: https://vercel.com/dashboard
- **Supabase**: https://app.supabase.com/project/[project-ref]
- **Sentry**: https://sentry.io/organizations/[org]/issues/
- **Axiom**: https://app.axiom.co/[org]
- **UptimeRobot**: https://uptimerobot.com/dashboard
- **Stripe**: https://dashboard.stripe.com
