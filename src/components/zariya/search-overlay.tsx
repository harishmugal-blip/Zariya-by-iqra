"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, ArrowRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { cn, formatPrice } from "@/lib/utils";
import { useUI } from "@/store/use-ui";
import { PRODUCTS, CATEGORIES } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { Stars } from "./stars";

const EASE = [0.22, 1, 0.36, 1] as const;

const POPULAR_SEARCHES = [
  "Pheran",
  "Pashmina",
  "Sozni",
  "Burgundy",
  "Heirloom",
  "Kaftan",
];

export default function SearchOverlay() {
  const open = useUI((s) => s.searchOpen);
  const closeSearch = useUI((s) => s.closeSearch);
  const openProduct = useUI((s) => s.openProduct);

  const [query, setQuery] = React.useState("");
  const [focused, setFocused] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  // Reset query on close
  React.useEffect(() => {
    if (!open) {
      const t = setTimeout(() => setQuery(""), 200);
      return () => clearTimeout(t);
    } else {
      // Autofocus on open
      const t = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(t);
    }
  }, [open]);

  const results = React.useMemo<Product[]>(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase().trim();
    return PRODUCTS.filter((p) => {
      return (
        p.name.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.fabric.toLowerCase().includes(q) ||
        p.collection.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
      );
    }).slice(0, 6);
  }, [query]);

  const handleResult = (slug: string) => {
    closeSearch();
    setTimeout(() => openProduct(slug), 250);
  };

  const handleCategory = (slug: string) => {
    closeSearch();
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 300);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeSearch()}>
      <DialogContent
        showCloseButton={false}
        className="fixed inset-0 top-0 left-0 translate-x-0 translate-y-0 max-w-none w-screen h-screen rounded-none border-0 p-0 m-0 gap-0 bg-background/95 backdrop-blur-xl"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">Search ZARIYA Collection</DialogTitle>
        <DialogDescription className="sr-only">
          Search for pherans, pashmina, suits and more.
        </DialogDescription>

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: EASE }}
            className="flex h-full flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-5 md:px-8 py-4 border-b border-border/50">
              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
                ZARIYA · Search
              </span>
              <button
                onClick={closeSearch}
                aria-label="Close search"
                className="grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Search input */}
            <div className="px-5 md:px-8 pt-10 md:pt-16 max-w-4xl mx-auto w-full">
              <div className="relative">
                <Search
                  className={cn(
                    "absolute left-0 top-1/2 -translate-y-1/2 h-6 w-6 transition-colors",
                    focused ? "text-gold" : "text-muted-foreground"
                  )}
                />
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  placeholder="Search for pherans, pashmina, suits…"
                  aria-label="Search products"
                  className="w-full bg-transparent pl-12 pr-4 py-4 font-serif text-2xl md:text-4xl placeholder:text-muted-foreground/50 focus:outline-none"
                />
                <motion.div
                  className="mt-2 h-[2px] origin-left rounded-full bg-gradient-to-r from-gold via-gold/60 to-transparent"
                  animate={{ scaleX: focused ? 1 : 0.4 }}
                  transition={{ duration: 0.4, ease: EASE }}
                />
              </div>

              {/* Live suggestions */}
              <div className="mt-6">
                {query.trim() && results.length > 0 ? (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, ease: EASE }}
                  >
                    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                      {results.length} {results.length === 1 ? "result" : "results"} found
                    </p>
                    <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {results.map((p, i) => (
                        <motion.li
                          key={p.id}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.04, ease: EASE }}
                        >
                          <button
                            onClick={() => handleResult(p.slug)}
                            className="group flex w-full items-center gap-3 rounded-2xl border border-border/60 bg-background p-3 text-left transition-all hover:border-gold/40 hover:luxury-shadow"
                          >
                            <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-lg bg-muted">
                              <img
                                src={p.images[0]?.src}
                                alt={p.images[0]?.alt || p.name}
                                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-semibold uppercase tracking-wide text-gold">
                                {p.category}
                              </p>
                              <h4 className="font-serif text-base font-semibold leading-tight text-foreground truncate">
                                {p.name}
                              </h4>
                              <div className="mt-1 flex items-center gap-2">
                                <Stars rating={p.rating} size={11} />
                                <span className="text-xs font-semibold text-primary">
                                  {formatPrice(p.price)}
                                </span>
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground transition-all group-hover:translate-x-0.5 group-hover:text-gold" />
                          </button>
                        </motion.li>
                      ))}
                    </ul>
                  </motion.div>
                ) : query.trim() && results.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-2xl border border-dashed border-border p-8 text-center"
                  >
                    <p className="font-serif text-lg text-foreground">
                      No pieces match &ldquo;{query}&rdquo;
                    </p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      Try a different term, or browse popular searches below.
                    </p>
                  </motion.div>
                ) : null}
              </div>

              {/* Popular searches */}
              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Popular Searches
                </p>
                <div className="flex flex-wrap gap-2">
                  {POPULAR_SEARCHES.map((term) => (
                    <button
                      key={term}
                      onClick={() => setQuery(term)}
                      className="rounded-full border border-border bg-background px-3.5 py-1.5 text-xs font-medium text-foreground transition-all hover:border-gold hover:bg-gold/5 hover:text-gold"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Shop by category */}
              <div className="mt-10">
                <p className="mb-3 text-xs font-semibold uppercase tracking-[0.15em] text-muted-foreground">
                  Shop by Category
                </p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.id}
                      onClick={() => handleCategory(c.slug)}
                      className="group relative aspect-[4/3] overflow-hidden rounded-2xl luxury-shadow"
                    >
                      <img
                        src={c.image}
                        alt={c.name}
                        className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      <div className="absolute inset-x-0 bottom-0 p-3 text-left">
                        <h4 className="font-serif text-base font-semibold text-white">
                          {c.name}
                        </h4>
                        <p className="text-[10px] text-white/80">{c.productCount} pieces</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <div className="h-12" />
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
