# Fali's — Perfume & Clothing

A production-grade ecommerce platform built with Next.js 15, Supabase, and Stripe.

## Stack

- **Framework**: Next.js 15 App Router + TypeScript (strict)
- **Styling**: Tailwind CSS + Framer Motion
- **Backend**: Next.js Server Actions + Route Handlers
- **Database / Auth / Storage**: Supabase (Postgres + RLS)
- **Payments**: Stripe Checkout + webhooks
- **State**: Zustand (cart) + TanStack Query (server state)
- **Testing**: Vitest + Playwright
- **Hosting**: Vercel + Supabase Cloud

## Local Setup

### Prerequisites

- Node.js 20+
- Supabase CLI (`brew install supabase/tap/supabase`)
- Stripe CLI (`brew install stripe/stripe-cli/stripe`)

### 1. Clone and install

```bash
git clone https://github.com/Patrick4350/Fali-s-Perfume
cd Fali-s-Perfume
npm install
```

### 2. Environment

```bash
cp .env.example .env.local
# Fill in all values in .env.local
```

### 3. Start local Supabase

```bash
supabase start
# Note the local URL and keys — add them to .env.local
```

### 4. Run migrations and seed

```bash
supabase db reset
# This applies all migrations and runs supabase/seed.sql
```

### 5. Start dev server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
