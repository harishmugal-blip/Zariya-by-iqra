# Task 6-7 — Product Modals & Shopping Drawers

**Agent**: Z.ai Code (subagent)
**Task ID**: 6-7
**Scope**: Build QuickView, ProductDetail, CartDrawer, SearchOverlay, WishlistDrawer components for ZARIYA by IQRA luxury fashion eCommerce.

## Files created
- `src/components/zariya/quick-view.tsx` (default export `QuickView`)
- `src/components/zariya/product-detail.tsx` (default export `ProductDetail`)
- `src/components/zariya/cart-drawer.tsx` (default export `CartDrawer`)
- `src/components/zariya/search-overlay.tsx` (default export `SearchOverlay`)
- `src/components/zariya/wishlist-drawer.tsx` (default export `WishlistDrawer`)

## Implementation summary

### QuickView (`useUI().activeVariant === "quick"`)
- shadcn `Dialog` controlled by store; framer-motion scale+fade on content.
- Left: main image (aspect 3/4) + thumbnail strip with selected ring (gold).
- Right: brand gold tag, name (Playfair), subtitle, star rating + review count, price block with strikethrough + discount badge, line-clamped description, color swatches with selected ring, size pills, quantity stepper with min/max stock guard, "Add to Bag" (primary burgundy, shows total), "View Full Details" (outline) → `openProduct(slug)`, WhatsApp button (emerald). Includes low-stock alert.
- Closes drawer automatically when adding to bag.

### ProductDetail (`useUI().activeVariant === "full"`)
- Full-screen `Dialog` `max-w-7xl w-[95vw] h-[92vh]` with two-column layout.
- **Gallery (left, scrollable, sticky-on-large)**: breadcrumb, main image with **hover zoom magnify** (image scale 2.2x following cursor + circular lens indicator + "Hover to zoom" hint), decorative **360° View** button that cycles through images for 3s with spinning icon, decorative video play button, thumbnail grid (4 cols), discount badge.
- Mobile: horizontal thumbnail strip instead.
- **Info (right, scrollable)**: brand gold tag, badges, Playfair 3xl/4xl name, subtitle, clickable rating that smooth-scrolls to reviews, price block with savings amount, italic story excerpt with gold left-border, color swatches with BadgeCheck indicator, size pills with **Size Guide popover** (filtered table of measurements), quantity stepper + stock indicator (red when ≤8, emerald otherwise), **sticky bottom action bar** with Add to Bag + Buy Now (adds to cart then opens checkout) + WhatsApp + wishlist heart, SKU/category/fabric/tag chips, trust badges row.
- **Tabs** (shadcn): Description (with story excerpt + separator), Fabric Details (table from `fabricDetails`), Care Instructions, Shipping & Returns.
- **Reviews**: large rating number + stars + verified count, breakdown bars (5★→1★ percentages), review cards with author, location, verified badge, date, stars, title, body. "Write a Review" decorative button.
- **FAQs**: shadcn Accordion with first 4 FAQ items.
- **Related Products**: horizontal scroll of 4 same-category ProductCards.
- **Recently Viewed**: horizontal scroll of `useUI().recentlyViewed` mapped to PRODUCTS → ProductCard.

### CartDrawer (`useCart().isOpen`)
- shadcn `Sheet` side="right" `w-full sm:max-w-lg`.
- Header: "Your Bag" (Playfair) + item count + close button.
- **Free shipping progress**: gold gradient bar; shows "Add ₹X more for complimentary white-glove delivery" when below ₹25,000, otherwise "You've unlocked complimentary delivery ✓".
- Item list (`max-h-50vh overflow-y-auto scrollbar-lux`): each item has clickable image (opens product detail), name, color · size, quantity stepper, remove (trash), line total. Empty state with elegant icon + "Explore the Collection" button.
- **Coupon input**: text field + Apply button; validates against `COUPONS` (case-insensitive code match + `subtotal >= minOrder`); shows success/error toasts via sonner; applied coupon shows as emerald chip with remove (x).
- Footer: subtotal, discount (emerald), free delivery, total (Playfair), "Proceed to Checkout" (primary, opens checkout), "Order on WhatsApp" (emerald outline, builds message via `buildWhatsAppOrderMessage`).
- Smooth item add/remove with framer-motion `layout` + AnimatePresence.

### SearchOverlay (`useUI().searchOpen`)
- Full-screen `Dialog` with `bg-background/95 backdrop-blur-xl`.
- Large Playfair input (2xl/4xl) with gold gradient underline that animates on focus.
- **Live suggestions**: filters PRODUCTS by name, subtitle, category, fabric, collection, tags, color names. Shows up to 6 result cards (image thumb + name + stars + price + chevron). Click → `openProduct(slug)` + close.
- **Popular Searches** chips (Pheran, Pashmina, Sozni, Burgundy, Heirloom, Kaftan) that set query.
- **Shop by Category**: 4/3 aspect category cards with hover zoom + gradient overlay + name + count.
- Autofocus on open, query reset on close, ESC + backdrop click close (handled by Dialog).

### WishlistDrawer (`useWishlist().isOpen`)
- shadcn `Sheet` side="right" `w-full sm:max-w-md`.
- Header: heart icon (filled destructive) + "Wishlist" + count badge + close.
- Item list: image (clickable → openProduct), category gold tag, name, star rating, price (with compareAt strikethrough), remove (trash), "Add to Bag" button (per item, opens cart).
- Empty state: heart icon + "Your wishlist is empty" + "Discover Pieces" button.
- Footer: count + total value + "Move All to Bag" button.

## Shared APIs used (no redefinition)
- `useCart`, `useWishlist`, `useUI` stores as specified.
- `PRODUCTS`, `COUPONS`, `FAQS`, `BRAND`, `CATEGORIES` from `@/data/catalog`.
- `Product`, `CartItem` types from `@/lib/types`.
- `cn`, `formatPrice`, `discountPercent`, `whatsappLink`, `buildProductWhatsAppMessage`, `buildWhatsAppOrderMessage` from `@/lib/utils`.
- `ProductCard`, `WhatsAppIcon` from `./product-card`.
- `Stars` from `./stars`.
- shadcn ui: dialog, sheet, tabs, accordion, popover, badge, button, input, separator.
- framer-motion, lucide-react, sonner toasts.

## Design conformance
- Colors: burgundy primary, gold accents, ivory background, emerald success, destructive red — NO blue/indigo.
- Headings: `font-serif` (Playfair) throughout.
- Cards: `rounded-2xl`, `luxury-shadow` / `luxury-shadow-lg`.
- Animations: framer-motion with `ease [0.22, 1, 0.36, 1]` (EASE constant).
- Sticky action bar in product detail (`sticky bottom-0`).
- Mobile-first: gallery stacks to horizontal scroll on mobile.
- Accessibility: ARIA labels on every interactive control, sr-only Dialog titles/descriptions, focus-visible outlines via shadcn primitives, keyboard-trapped dialogs (radix).

## Quality checks
- `bun run lint` — passes with 0 errors, 0 warnings.
- All exports default (named per spec).
- All files `"use client"`.
- No test files written.
- No modifications to globals.css, layout.tsx, stores, data files, or product-card.tsx.

## Integration note for the home page agent
These five components mount at the root level (controlled by their respective stores). The home page agent should mount all five once at the app root (e.g., in `page.tsx` or a `<ZariyaOverlays />` wrapper near `</main>`):
```tsx
import QuickView from "@/components/zariya/quick-view";
import ProductDetail from "@/components/zariya/product-detail";
import CartDrawer from "@/components/zariya/cart-drawer";
import SearchOverlay from "@/components/zariya/search-overlay";
import WishlistDrawer from "@/components/zariya/wishlist-drawer";
// then render <QuickView/><ProductDetail/><CartDrawer/><SearchOverlay/><WishlistDrawer/> at root
```
Any trigger (header cart icon, ProductCard heart/eye, search button, etc.) simply calls the corresponding `open*` action from the stores — the overlays handle the rest.
