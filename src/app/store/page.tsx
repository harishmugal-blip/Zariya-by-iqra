"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Filter,
  X,
  ShoppingBag,
  Heart,
  ArrowLeft,
  SlidersHorizontal,
} from "lucide-react";
import { CATEGORIES, BRAND } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/zariya/product-card";
import { cn, formatPrice } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

const FABRICS = ["Pashmina", "Silk", "Georgette", "Cotton", "Velvet", "Chiffon"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const PRICE_MAX = 60000;
const EASE = [0.22, 1, 0.36, 1] as const;

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

interface FilterState {
  categories: Set<string>;
  maxPrice: number;
  fabrics: Set<string>;
  sizes: Set<string>;
  inStockOnly: boolean;
  sort: SortKey;
}

const INITIAL: FilterState = {
  categories: new Set(),
  maxPrice: PRICE_MAX,
  fabrics: new Set(),
  sizes: new Set(),
  inStockOnly: false,
  sort: "featured",
};

function toggle(set: Set<string>, value: string): Set<string> {
  const next = new Set(set);
  if (next.has(value)) next.delete(value);
  else next.add(value);
  return next;
}

export default function StorePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [state, setState] = useState<FilterState>(INITIAL);
  const [search, setSearch] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);

  // Fetch products from DB
  useEffect(() => {
    fetch("/api/products")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.products) setProducts(data.products);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      if (state.categories.size > 0 && !state.categories.has(p.category)) return false;
      if (p.price > state.maxPrice) return false;
      if (
        state.fabrics.size > 0 &&
        !Array.from(state.fabrics).some((f) =>
          p.fabric.toLowerCase().includes(f.toLowerCase())
        )
      )
        return false;
      if (state.sizes.size > 0 && !p.sizes.some((s) => state.sizes.has(s))) return false;
      if (state.inStockOnly && p.stock <= 0) return false;
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.subtitle.toLowerCase().includes(q) &&
          !p.category.toLowerCase().includes(q) &&
          !p.fabric.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });

    list = [...list];
    switch (state.sort) {
      case "price-asc":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        list.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        list.sort(
          (a, b) =>
            Number(b.featured) - Number(a.featured) ||
            Number(b.bestSeller) - Number(a.bestSeller)
        );
    }
    return list;
  }, [products, state, search]);

  const update = (updater: (prev: FilterState) => FilterState) => setState(updater);
  const clearAll = () => setState(INITIAL);

  const FiltersPanel = (
    <div className="space-y-6">
      {/* Sort */}
      <div>
        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          Sort By
        </h3>
        <Select
          value={state.sort}
          onValueChange={(v) => update((s) => ({ ...s, sort: v as SortKey }))}
        >
          <SelectTrigger className="w-full rounded-xl border-border bg-card">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="featured">Featured</SelectItem>
            <SelectItem value="price-asc">Price: Low to High</SelectItem>
            <SelectItem value="price-desc">Price: High to Low</SelectItem>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="rating">Top Rated</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Categories */}
      <div>
        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          Categories
        </h3>
        <div className="space-y-2">
          {CATEGORIES.map((cat) => (
            <label key={cat.id} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={state.categories.has(cat.slug)}
                onCheckedChange={() =>
                  update((s) => ({ ...s, categories: toggle(s.categories, cat.slug) }))
                }
              />
              <Label className="cursor-pointer text-sm text-foreground/80">
                {cat.name}
                <span className="ml-1 text-xs text-muted-foreground">({cat.productCount})</span>
              </Label>
            </label>
          ))}
        </div>
      </div>

      {/* Price */}
      <div>
        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          Max Price
        </h3>
        <div className="px-1">
          <Slider
            value={[state.maxPrice]}
            min={5000}
            max={PRICE_MAX}
            step={1000}
            onValueChange={(v) => update((s) => ({ ...s, maxPrice: v[0] }))}
          />
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>₹5,000</span>
            <span className="font-semibold text-gold">{formatPrice(state.maxPrice)}</span>
          </div>
        </div>
      </div>

      {/* Fabric */}
      <div>
        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          Fabric
        </h3>
        <div className="space-y-2">
          {FABRICS.map((f) => (
            <label key={f} className="flex cursor-pointer items-center gap-2.5">
              <Checkbox
                checked={state.fabrics.has(f)}
                onCheckedChange={() =>
                  update((s) => ({ ...s, fabrics: toggle(s.fabrics, f) }))
                }
              />
              <Label className="cursor-pointer text-sm text-foreground/80">{f}</Label>
            </label>
          ))}
        </div>
      </div>

      {/* Size */}
      <div>
        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
          Size
        </h3>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((s) => (
            <button
              key={s}
              onClick={() => update((st) => ({ ...st, sizes: toggle(st.sizes, s) }))}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
                state.sizes.has(s)
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border text-foreground/70 hover:border-primary/50"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* In Stock */}
      <div className="flex items-center justify-between">
        <Label className="cursor-pointer text-sm font-medium text-foreground">
          In Stock Only
        </Label>
        <Switch
          checked={state.inStockOnly}
          onCheckedChange={(v) => update((s) => ({ ...s, inStockOnly: v }))}
        />
      </div>

      {/* Clear */}
      <button
        onClick={clearAll}
        className="w-full rounded-full border border-border py-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
      >
        Clear All Filters
      </button>
    </div>
  );

  return (
    <main className="min-h-screen bg-background">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-primary py-12 text-center text-primary-foreground sm:py-16">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <Link
            href="/"
            className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
          </Link>
          <span className="font-kashmiri text-2xl text-gold/80">ذریعہ</span>
          <h1 className="mt-1 font-serif text-4xl font-bold sm:text-5xl">
            The ZARIYA Store
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
            Explore our full collection of handcrafted Kashmiri heirlooms —
            pherans, pashmina shawls, embroidered suits & kaftans.
          </p>
        </div>
      </section>

      {/* Search + filter bar */}
      <div className="sticky top-0 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search products…"
              className="w-full rounded-full border border-border bg-card py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>
          {/* Mobile filter button */}
          <button
            onClick={() => setMobileOpen(true)}
            className="flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2.5 text-xs font-semibold lg:hidden"
          >
            <Filter className="h-4 w-4" /> Filters
          </button>
        </div>
      </div>

      {/* Main grid + sidebar */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <aside className="hidden w-64 flex-none lg:block">
            <div className="sticky top-20 rounded-2xl border border-border bg-card p-5">
              {FiltersPanel}
            </div>
          </aside>

          {/* Product grid */}
          <div className="min-w-0 flex-1">
            {/* Count */}
            <div className="mb-5 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                <span className="font-semibold text-foreground">{filtered.length}</span>{" "}
                {filtered.length === 1 ? "piece" : "pieces"} found
              </p>
              <span className="text-xs text-muted-foreground">
                {state.categories.size > 0 ||
                state.fabrics.size > 0 ||
                state.sizes.size > 0 ||
                state.maxPrice < PRICE_MAX ||
                state.inStockOnly
                  ? "Filters active"
                  : "All products"}
              </span>
            </div>

            {/* Products */}
            {loading ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="aspect-[3/4] animate-pulse rounded-2xl bg-muted/40"
                  />
                ))}
              </div>
            ) : filtered.length === 0 ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
                <Search className="h-12 w-12 text-muted-foreground/40" />
                <h3 className="mt-3 font-serif text-xl font-semibold text-muted-foreground">
                  No products found
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Try adjusting your filters or search.
                </p>
                <button
                  onClick={clearAll}
                  className="mt-4 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
        <SheetContent className="w-full overflow-y-auto sm:max-w-sm">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2 font-serif text-xl">
              <SlidersHorizontal className="h-5 w-5 text-gold" />
              Filters
            </SheetTitle>
          </SheetHeader>
          <div className="mt-6">{FiltersPanel}</div>
        </SheetContent>
      </Sheet>
    </main>
  );
}
