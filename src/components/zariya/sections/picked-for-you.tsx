"use client";

import { motion } from "framer-motion";
import { Sparkles, ChevronRight } from "lucide-react";
import { useWishlist } from "@/store/use-wishlist";
import { useUI } from "@/store/use-ui";
import { PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/zariya/product-card";
import type { Product } from "@/lib/types";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Personalised recommendations based on wishlist + recently viewed.
 * Falls back to bestsellers if no signal available.
 */
export function PickedForYou() {
  const wishlistIds = useWishlist((s) => s.ids);
  const recentlyViewed = useUI((s) => s.recentlyViewed);

  // Determine the user's preferred categories from wishlist + recent
  const signalProducts = [
    ...wishlistIds.map((id) => PRODUCTS.find((p) => p.id === id)),
    ...recentlyViewed.map((slug) => PRODUCTS.find((p) => p.slug === slug)),
  ].filter(Boolean) as Product[];

  const preferredCategories = new Set(signalProducts.map((p) => p.category));
  const preferredCollection = signalProducts
    .map((p) => p.collection)
    .sort((a, b) =>
      signalProducts.filter((p) => p.collection === b).length -
      signalProducts.filter((p) => p.collection === a).length
    )[0];

  // Exclude already-viewed/wishlisted
  const excludeIds = new Set([...wishlistIds, ...signalProducts.map((p) => p.id)]);

  // Score: same category +3, same collection +2, bestseller +1, featured +1
  const scored = PRODUCTS.filter((p) => !excludeIds.has(p.id))
    .map((p) => {
      let score = 0;
      if (preferredCategories.has(p.category)) score += 3;
      if (preferredCollection && p.collection === preferredCollection) score += 2;
      if (p.bestSeller) score += 1;
      if (p.featured) score += 1;
      return { p, score };
    })
    .sort((a, b) => b.score - a.score);

  const picks = scored.slice(0, 4).map((s) => s.p);

  // Fallback: top bestsellers if no signal
  const finalPicks =
    picks.length >= 2
      ? picks
      : PRODUCTS.filter((p) => p.bestSeller && !excludeIds.has(p.id)).slice(0, 4);

  if (finalPicks.length === 0) return null;

  const isPersonalised = signalProducts.length > 0;

  return (
    <section className="bg-gradient-to-b from-background to-muted/20 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-8 flex flex-col items-start justify-between gap-3 sm:flex-row sm:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              <Sparkles className="h-3.5 w-3.5" />
              {isPersonalised ? "Curated for You" : "Editor's Picks"}
            </span>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {isPersonalised ? "Picked for You" : "You May Love These"}
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              {isPersonalised
                ? "Based on the pieces you've loved and viewed — a selection we think will speak to you."
                : "A hand-selected edit of our most-loved heirlooms to begin your journey."}
            </p>
          </div>
          {isPersonalised && (
            <span className="hidden items-center gap-1 rounded-full bg-gold/10 px-3 py-1.5 text-[11px] font-semibold text-gold sm:flex">
              <Sparkles className="h-3 w-3" /> Personalised
            </span>
          )}
        </motion.div>

        <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
          {finalPicks.map((p, i) => (
            <ProductCard key={p.id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
