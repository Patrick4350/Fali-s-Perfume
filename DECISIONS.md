# Design & Technical Decisions

## Color Palette

- **Base**: Warm stone tones (oklch-based, not pure grey — avoids the cold AI look)
- **Perfume accent**: Warm amber `oklch(73% 0.18 68)` — evokes heat, depth, luxury
- **Clothing accent**: Muted sage `oklch(58% 0.08 155)` — natural, earthy, quiet
- **Dark mode**: Near-black with warm undertone `oklch(15% 0.008 60)`, not `#000000`
- **Decision**: One accent color per category, not a global brand accent, to differentiate the two product lines clearly

## Typography

- **Serif**: Fraunces (Google Fonts) — optical size axis, slight warmth, modern editorial feel without the coldness of Cormorant or the overuse of Playfair
- **Sans**: Inter — neutral, readable, does not compete with Fraunces
- **Decision**: Serif used only for headings and brand name. All UI text (prices, labels, navigation) is sans — prevents the serif from feeling overwrought

## Layout Philosophy

- Hero: full-bleed with left-aligned text over dark overlay — editorial, asymmetric
- Category pages: two-column split, each taking 50% viewport — forces equal visual weight between perfume and clothing
- New arrivals: horizontal scroll, not a grid — signals "browse" rather than "shop the full catalog"
- Product cards: 3:4 aspect ratio — standard for fashion and fragrance
- **Decision**: No purple gradients, no glassmorphism, no floating blobs

## Admin Dashboard

- Visually distinct from storefront: denser, sans-only typography, no serif headlines
- Side navigation vs top nav — side nav scales better as admin features grow
- Inspired by: Linear, Vercel dashboard — data-forward, no decorative elements

## Cart Persistence

- Guest cart: Zustand persisted to localStorage (session-scoped UUID)
- Auth cart: synced to Supabase `carts` table on login
- **Decision**: Guest cart is merged with user cart on login — standard ecommerce pattern, prevents frustrating loss of selections

## Search Implementation

- Postgres `tsvector` with GIN index and `websearch_to_tsquery` — handles quoted phrases, AND/OR, negation naturally
- Debounced at 300ms on the client
- **Decision**: Avoided Algolia/Typesense — unnecessary cost and operational complexity for a catalog of ~50 products

## Stock Race Condition Prevention

- `SELECT ... FOR UPDATE` in the stock decrement trigger, wrapped in a transaction
- This prevents two simultaneous purchases from both succeeding when only 1 unit remains
- **Decision**: Handled at the database layer (trigger) not application layer — ensures correctness regardless of which service calls it

## Stripe Webhook Idempotency

- Before creating an order, query for an existing order with the same `stripe_session_id`
- If found, skip processing — Stripe can deliver webhooks more than once
- **Decision**: Check-before-insert pattern is simpler than distributed locks for this scale

## Image Strategy

- All product images via Unsplash during development (real photos, not placeholders)
- Production: Supabase Storage `product-media` bucket (public CDN) for published products
- Raw uploads go to `admin-uploads` (private, signed URLs) before being processed and moved
- Client-side image compression before upload (browser-image-compression) to reduce storage costs
- **Decision**: Client-side compression acceptable for admin use case; admins can handle the UX cost

## Framework Version

- Next.js 15 (not 14 as spec said) — create-next-app scaffolded 15. No architectural differences for this project; features used are stable in both
