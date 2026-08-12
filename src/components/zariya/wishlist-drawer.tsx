"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Heart,
  X,
  ShoppingBag,
  Trash2,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice } from "@/lib/utils";
import { useWishlist } from "@/store/use-wishlist";
import { useCart } from "@/store/use-cart";
import { useUI } from "@/store/use-ui";
import { PRODUCTS } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { Stars } from "./stars";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function WishlistDrawer() {
  const isOpen = useWishlist((s) => s.isOpen);
  const closeWishlist = useWishlist((s) => s.closeWishlist);
  const ids = useWishlist((s) => s.ids);
  const remove = useWishlist((s) => s.remove);
  const addItem = useCart((s) => s.addItem);
  const openCart = useCart((s) => s.openCart);
  const openProduct = useUI((s) => s.openProduct);

  const items: Product[] = React.useMemo(
    () => ids.map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean) as Product[],
    [ids]
  );

  const handleAddToBag = (p: Product) => {
    addItem(p, {
      color: p.colors[0]?.name || "",
      size: p.sizes[0] || "",
    });
    toast.success("Added to bag", { description: p.name });
    closeWishlist();
    setTimeout(() => openCart(), 200);
  };

  const handleMoveAll = () => {
    if (items.length === 0) return;
    items.forEach((p) =>
      addItem(p, { color: p.colors[0]?.name || "", size: p.sizes[0] || "" })
    );
    toast.success(`${items.length} pieces moved to bag`);
    closeWishlist();
    setTimeout(() => openCart(), 200);
  };

  const handleViewProduct = (slug: string) => {
    closeWishlist();
    setTimeout(() => openProduct(slug), 200);
  };

  const handleDiscover = () => {
    closeWishlist();
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeWishlist()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md p-0 flex flex-col gap-0 border-l border-gold/15"
      >
        <SheetTitle className="sr-only">Your Wishlist</SheetTitle>
        <SheetDescription className="sr-only">
          Save your favourite pieces and revisit them any time.
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <Heart className="h-5 w-5 fill-destructive text-destructive" />
            <h2 className="font-serif text-2xl font-semibold">Wishlist</h2>
            {items.length > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {items.length}
              </span>
            )}
          </div>
          <button
            onClick={closeWishlist}
            aria-label="Close wishlist"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto scrollbar-lux px-5 py-4">
          {items.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: EASE }}
              className="flex h-full flex-col items-center justify-center gap-4 py-10 text-center"
            >
              <div className="grid h-24 w-24 place-items-center rounded-full bg-muted/40">
                <Heart className="h-9 w-9 text-muted-foreground/60" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Your wishlist is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Tap the heart on any piece to save it here.
                </p>
              </div>
              <Button
                onClick={handleDiscover}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Discover Pieces
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <ul className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {items.map((p) => (
                  <motion.li
                    key={p.id}
                    layout
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 30 }}
                    transition={{ duration: 0.3, ease: EASE }}
                    className="flex gap-3 rounded-2xl border border-border/60 bg-background p-3 luxury-shadow"
                  >
                    <button
                      onClick={() => handleViewProduct(p.slug)}
                      className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                      aria-label={`View ${p.name}`}
                    >
                      <img src={p.images[0]?.src} alt={p.images[0]?.alt || p.name} className="h-full w-full object-cover" />
                    </button>

                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0 flex-1">
                          <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                            {p.category}
                          </p>
                          <h4 className="font-serif text-sm font-semibold leading-tight text-foreground truncate">
                            {p.name}
                          </h4>
                          <div className="mt-1 flex items-center gap-1.5">
                            <Stars rating={p.rating} size={11} showValue />
                          </div>
                        </div>
                        <button
                          onClick={() => remove(p.id)}
                          aria-label={`Remove ${p.name} from wishlist`}
                          className="grid h-7 w-7 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="mt-auto flex items-end justify-between pt-2">
                        <div className="flex items-end gap-2">
                          <span className="font-serif text-base font-bold text-primary">
                            {formatPrice(p.price)}
                          </span>
                          {p.compareAtPrice && (
                            <span className="text-xs text-muted-foreground line-through">
                              {formatPrice(p.compareAtPrice)}
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => handleAddToBag(p)}
                          size="sm"
                          className="h-8 rounded-full bg-primary px-3 text-[11px] text-primary-foreground hover:bg-primary/90"
                        >
                          <ShoppingBag className="mr-1 h-3 w-3" />
                          Add to Bag
                        </Button>
                      </div>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-background px-5 py-4 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {items.length} {items.length === 1 ? "piece" : "pieces"} saved
              </span>
              <span className="font-serif text-lg font-bold text-primary">
                {formatPrice(items.reduce((s, p) => s + p.price, 0))}
              </span>
            </div>
            <Separator />
            <Button
              onClick={handleMoveAll}
              size="lg"
              className="h-12 w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Move All to Bag
            </Button>
            <p className="text-center text-[10px] text-muted-foreground">
              Saved pieces stay here for 30 days · Tap to view full details
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
