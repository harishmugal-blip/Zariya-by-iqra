"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Check, X } from "lucide-react";
import { useWishlist } from "@/store/use-wishlist";
import { PRODUCTS } from "@/data/catalog";
import { toast } from "sonner";

/**
 * Reads `?wishlist=slug1,slug2,...` from the URL on mount and imports
 * those product IDs into the wishlist. Shows a toast + banner if items
 * were imported. Cleans the URL after importing.
 */
export function WishlistImport() {
  const importSlugs = useWishlist((s) => s.importSlugs);
  const openWishlist = useWishlist((s) => s.openWishlist);
  const [imported, setImported] = useState<number>(0);
  const [showBanner, setShowBanner] = useState(false);
  const processed = useRef(false);

  useEffect(() => {
    if (processed.current) return;
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const wishlistParam = params.get("wishlist");
    if (!wishlistParam) {
      processed.current = true;
      return;
    }

    processed.current = true;
    const slugs = wishlistParam
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (slugs.length === 0) return;

    // Map slugs to product IDs
    const ids = slugs
      .map((slug) => PRODUCTS.find((p) => p.slug === slug)?.id)
      .filter(Boolean) as string[];

    if (ids.length === 0) return;

    const added = importSlugs(ids);
    if (added > 0) {
      // Defer state updates + side-effects out of the synchronous effect body
      queueMicrotask(() => {
        setImported(added);
        setShowBanner(true);
        toast.success(`${added} piece${added !== 1 ? "s" : ""} imported to your wishlist`, {
          description: "From a shared link",
          action: { label: "View", onClick: () => openWishlist() },
        });
      });
    }

    // Clean the URL
    params.delete("wishlist");
    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`;
    window.history.replaceState({}, "", newUrl);
  }, [importSlugs, openWishlist]);

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="fixed left-1/2 top-20 z-50 -translate-x-1/2 px-4"
        >
          <div className="flex items-center gap-3 rounded-full border border-gold/40 bg-card px-5 py-3 luxury-shadow-lg backdrop-blur-xl">
            <span className="grid h-7 w-7 place-items-center rounded-full bg-emerald/15">
              <Check className="h-4 w-4 text-emerald" />
            </span>
            <p className="text-sm font-medium text-foreground">
              <span className="font-serif font-bold text-gold">{imported}</span> piece
              {imported !== 1 ? "s" : ""} added to your wishlist
            </p>
            <button
              onClick={() => {
                setShowBanner(false);
                openWishlist();
              }}
              className="flex items-center gap-1 rounded-full bg-primary px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              <Heart className="h-3 w-3" /> View
            </button>
            <button
              onClick={() => setShowBanner(false)}
              aria-label="Dismiss"
              className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
