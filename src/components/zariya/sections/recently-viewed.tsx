"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Clock, ChevronRight } from "lucide-react";
import { useUI } from "@/store/use-ui";
import { PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/zariya/product-card";

const EASE = [0.22, 1, 0.36, 1] as const;

export function RecentlyViewed() {
  const recentlyViewed = useUI((s) => s.recentlyViewed);
  const products = recentlyViewed
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.section
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: EASE }}
        className="border-y border-border bg-card/30 py-14"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-gold" />
              <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
                Recently Viewed
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              {products.length} piece{products.length !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {products.map((p, i) => (
              <ProductCard key={p!.id} product={p!} index={i} />
            ))}
          </div>
        </div>
      </motion.section>
    </AnimatePresence>
  );
}
