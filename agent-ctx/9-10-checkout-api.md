# Task 9-10 — Checkout Flow + Backend APIs

**Agent**: Subagent (Checkout Flow + Backend APIs)
**Task ID**: 9-10

## Files Created

### Part A — Checkout Modal
- `src/components/zariya/checkout-modal.tsx` — luxury multi-step `Dialog` checkout with 4 steps (Details → Shipping → Payment → Review), sticky order summary sidebar with trust badges, animated gold checkmark success screen with WhatsApp tracking + Continue Shopping. Burgundy/gold/ivory palette. Framer Motion + zod + sonner.

### Part B — Backend API Routes (all `NextResponse`, server-side)
- `src/app/api/products/route.ts` — GET with filters: category, collection, featured, bestseller, new, limited, q, minPrice, maxPrice, sort (price-asc|price-desc|newest|rating)
- `src/app/api/products/[slug]/route.ts` — GET single product + related, 404 on miss
- `src/app/api/categories/route.ts` — GET all categories
- `src/app/api/coupons/validate/route.ts` — POST validate code+subtotal, returns discount or 400
- `src/app/api/orders/route.ts` — POST creates order in Prisma with orderNumber `ZRY-{YYYYMMDD}-{random6}`, items as JSON string, GET for listing
- `src/app/api/newsletter/route.ts` — POST `{ email, name? }` via Prisma `create`, P2002 → "Already subscribed"
- `src/app/api/contact/route.ts` — POST persists ContactMessage
- `src/app/api/reviews/route.ts` — POST in-memory pending buffer, GET filter by productSlug

## Smoke Tests (all green)
- GET /api/products?category=pherans → 200
- GET /api/products/shahzadi-pheran-burgundy → 200 (with related)
- GET /api/products/non-existent → 404
- GET /api/categories → 200
- POST /api/coupons/validate {zariya10, 50000} → 200, discount 5000
- POST /api/coupons/validate {FAKE} → 400
- POST /api/coupons/validate {HERITAGE15, 10000} → 400 (below min)
- POST /api/orders (full) → 201, orderNumber generated
- POST /api/orders (missing fields) → 400
- POST /api/newsletter (fresh) → 201
- POST /api/newsletter (duplicate) → 200, "Already subscribed"
- POST /api/contact → 201
- POST /api/reviews → 201

## Quality Gates
- `bun run lint` — 0 errors, 0 warnings (in my new files)
- `bunx tsc --noEmit` — 0 errors in new files
- Dev server recompiles cleanly

## Important Notes for Other Agents
1. **CheckoutModal is NOT yet mounted globally.** To enable, add `<CheckoutModal />` once anywhere in the layout (alongside CartDrawer, QuickView, ProductDetail). It's controlled by `useUI().checkoutOpen` via `openCheckout()` (called from cart-drawer "Proceed to Checkout" and product-detail).
2. **Newsletter API was REPLACED** — previous route used `upsert` and returned `{ ok: true }`. New route uses `create` + P2002 handling and returns `{ success: true, message }`. Backward compatible with the existing `newsletter.tsx` section (which reads `err.error` for failures, checks `res.ok` for success).
3. Discount is computed client-side in the modal via `COUPONS` import. `/api/coupons/validate` is available for server-side validation elsewhere.
4. The CheckoutModal preserves an order snapshot (items, total, name, email, couponCode) before calling `clearCart()` so the success screen can render the WhatsApp order message correctly.
5. Success screen WhatsApp link uses `buildWhatsAppOrderMessage` + appends order number and email.
