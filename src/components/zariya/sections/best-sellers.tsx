"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Filter, SlidersHorizontal, Check, Star } from "lucide-react";
import {
  PRODUCTS,
  CATEGORIES,
  COLORS,
  BRAND,
} from "@/data/catalog";
import { ProductCard } from "@/components/zariya/product-card";
import { useUI } from "@/store/use-ui";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const FABRICS = ["Pashmina", "Silk", "Georgette", "Cotton", "Velvet"];
const SIZES = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];
const PRICE_MAX = 60000;

type SortKey = "featured" | "price-asc" | "price-desc" | "newest" | "rating";

interface FilterState {
  categories: Set<string>;
  maxPrice: number;
  colors: Set<string>;
  fabrics: Set<string>;
  sizes: Set<string>;
  inStockOnly: boolean;
  sort: SortKey;
}

const INITIAL: FilterState = {
  categories: new Set(),
  maxPrice: PRICE_MAX,
  colors: new Set(),
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

function filterAndSort(state: FilterState) {
  let list = PRODUCTS.filter((p) => {
    if (state.categories.size > 0 && !state.categories.has(p.category)) return false;
    if (p.price > state.maxPrice) return false;
    if (state.colors.size > 0 && !p.colors.some((c) => state.colors.has(c.name))) return false;
    if (
      state.fabrics.size > 0 &&
      !Array.from(state.fabrics).some((f) =>
        p.fabric.toLowerCase().includes(f.toLowerCase())
      )
    )
      return false;
    if (state.sizes.size > 0 && !p.sizes.some((s) => state.sizes.has(s))) return false;
    if (state.inStockOnly && p.stock <= 0) return false;
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
      list.sort((a, b) => Number(b.newArrival) - Number(a.newArrival) || b.reviewCount - a.reviewCount);
      break;
    case "rating":
      list.sort((a, b) => b.rating - a.rating);
      break;
    case "featured":
    default:
      list.sort(
        (a, b) =>
          Number(b.featured) - Number(a.featured) ||
          Number(b.bestSeller) - Number(a.bestSeller) ||
          b.rating - a.rating
      );
  }
  return list;
}

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <h4 className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
    {children}
  </h4>
);

function FiltersPanel({
  state,
  setState,
}: {
  state: FilterState;
  setState: (updater: (prev: FilterState) => FilterState) => void;
}) {
  const colorEntries = Object.entries(COLORS);
  const activeCount =
    state.categories.size +
    state.colors.size +
    state.fabrics.size +
    state.sizes.size +
    (state.inStockOnly ? 1 : 0) +
    (state.maxPrice < PRICE_MAX ? 1 : 0);

  return (
    <div className="flex flex-col gap-7">
      {/* Header + clear */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gold" />
          <span className="font-serif text-lg font-semibold text-foreground">Filters</span>
          {activeCount > 0 && (
            <Badge className="bg-gold text-charcoal hover:bg-gold/80">{activeCount}</Badge>
          )}
        </div>
        {activeCount > 0 && (
          <button
            onClick={() => setState(() => ({ ...INITIAL }))}
            className="text-[11px] font-semibold uppercase tracking-[0.15em] text-muted-foreground transition-colors hover:text-primary"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Categories */}
      <div>
        <SectionLabel>Category</SectionLabel>
        <div className="flex flex-col gap-2.5">
          {CATEGORIES.map((c) => {
            const checked = state.categories.has(c.slug);
            return (
              <label
                key={c.id}
                htmlFor={`cat-${c.id}`}
                className="group flex cursor-pointer items-center gap-3 text-sm text-foreground/90 transition-colors hover:text-primary"
              >
                <Checkbox
                  id={`cat-${c.id}`}
                  checked={checked}
                  onCheckedChange={() =>
                    setState((p) => ({ ...p, categories: toggle(p.categories, c.slug) }))
                  }
                />
                <span className="flex-1">{c.name}</span>
                <span className="text-[11px] text-muted-foreground">{c.productCount}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Price */}
      <div>
        <SectionLabel>Max Price</SectionLabel>
        <div className="mb-3 flex items-center justify-between text-sm text-foreground">
          <span className="text-muted-foreground">Up to</span>
          <span className="font-serif font-semibold text-primary">
            {formatPrice(state.maxPrice)}
          </span>
        </div>
        <Slider
          value={[state.maxPrice]}
          min={5000}
          max={PRICE_MAX}
          step={1000}
          onValueChange={(v) => setState((p) => ({ ...p, maxPrice: v[0] }))}
          className="[&_[role=slider]]:border-gold [&_[role=slider]]:bg-gold [&_[role=slider]]:h-5 [&_[role=slider]]:w-5 [&_[role=slider]]:shadow-md [&_.bg-primary]:bg-gold"
        />
        <div className="mt-1.5 flex justify-between text-[10px] text-muted-foreground">
          <span>₹5K</span>
          <span>₹60K</span>
        </div>
      </div>

      {/* Colors */}
      <div>
        <SectionLabel>Colour</SectionLabel>
        <div className="flex flex-wrap gap-2.5">
          {colorEntries.map(([key, c]) => {
            const active = state.colors.has(c.name);
            return (
              <button
                key={key}
                title={c.name}
                onClick={() =>
                  setState((p) => ({ ...p, colors: toggle(p.colors, c.name) }))
                }
                className={cn(
                  "relative h-8 w-8 rounded-full ring-2 ring-offset-2 ring-offset-background transition-all duration-300 hover:scale-110",
                  active ? "ring-gold scale-110" : "ring-black/10 hover:ring-gold/50"
                )}
                style={{ backgroundColor: c.hex }}
              >
                {active && (
                  <Check
                    className="absolute inset-0 m-auto h-4 w-4"
                    style={{ color: ["#FAF8F5", "#F3EDE0", "#E5D4A8", "#E8C4B8"].includes(c.hex) ? "#1E1E1E" : "#fff" }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Fabric */}
      <div>
        <SectionLabel>Fabric</SectionLabel>
        <div className="flex flex-col gap-2.5">
          {FABRICS.map((f) => {
            const checked = state.fabrics.has(f);
            return (
              <label
                key={f}
                className="flex cursor-pointer items-center gap-3 text-sm text-foreground/90 transition-colors hover:text-primary"
              >
                <Checkbox
                  checked={checked}
                  onCheckedChange={() =>
                    setState((p) => ({ ...p, fabrics: toggle(p.fabrics, f) }))
                  }
                />
                {f}
              </label>
            );
          })}
        </div>
      </div>

      {/* Size */}
      <div>
        <SectionLabel>Size</SectionLabel>
        <div className="grid grid-cols-4 gap-2">
          {SIZES.map((s) => {
            const checked = state.sizes.has(s);
            return (
              <button
                key={s}
                onClick={() => setState((p) => ({ ...p, sizes: toggle(p.sizes, s) }))}
                className={cn(
                  "rounded-lg border py-2 text-xs font-semibold transition-all duration-300",
                  checked
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border bg-card text-foreground/80 hover:border-gold hover:text-primary"
                )}
              >
                {s === "One Size" ? "OS" : s}
              </button>
            );
          })}
        </div>
      </div>

      {/* Availability */}
      <div>
        <SectionLabel>Availability</SectionLabel>
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="in-stock" className="cursor-pointer text-sm text-foreground/90">
            In stock only
          </Label>
          <Switch
            id="in-stock"
            checked={state.inStockOnly}
            onCheckedChange={(v) => setState((p) => ({ ...p, inStockOnly: v }))}
          />
        </div>
      </div>
    </div>
  );
}

export default function BestSellers() {
  const [state, setState] = useState<FilterState>(INITIAL);
  const [mobileOpen, setMobileOpen] = useState(false);
  const filtersOpen = useUI((s) => s.filtersOpen);
  const setFiltersOpen = useUI((s) => s.setFiltersOpen);

  const filtered = useMemo(() => filterAndSort(state), [state]);

  const update = (updater: (prev: FilterState) => FilterState) => {
    setState(updater);
  };

  // Mobile sheet open state is driven by the global UI store too (kept in sync)
  const sheetOpen = mobileOpen || filtersOpen;
  const closeSheet = (open: boolean) => {
    setMobileOpen(open);
    setFiltersOpen(open);
  };

  return (
    <section
      id="shop"
      aria-label="Best sellers shop"
      className="relative scroll-mt-20 bg-background py-20 md:py-28"
    >
      {/* Heading */}
      <div className="mx-auto mb-10 max-w-7xl px-4 text-center sm:px-6 lg:px-8 md:mb-14">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            Best Sellers
            <span className="h-px w-6 bg-gold/60" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            Loved by women across the world
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Filter by category, colour, fabric or size to find the piece meant for you.
          </p>
        </motion.div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Mobile filter bar */}
        <div className="mb-6 flex items-center justify-between gap-3 lg:hidden">
          <Button
            variant="outline"
            onClick={() => closeSheet(true)}
            className="gap-2 rounded-full border-gold/40 text-primary"
          >
            <Filter className="h-4 w-4" /> Filters
          </Button>
          <SortSelect state={state} setState={setState} />
        </div>

        <div className="flex gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden w-64 shrink-0 lg:block">
            <div className="sticky top-24 max-h-[calc(100vh-7rem)] overflow-y-auto scrollbar-lux pr-2">
              <FiltersPanel state={state} setState={update} />
            </div>
          </aside>

          {/* Grid */}
          <div className="min-w-0 flex-1">
            {/* Toolbar */}
            <div className="mb-6 hidden items-center justify-between gap-4 lg:flex">
              <p className="text-sm text-muted-foreground">
                Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
                <span className="font-semibold text-foreground">{PRODUCTS.length}</span> pieces
              </p>
              <div className="flex items-center gap-3">
                <span className="text-xs uppercase tracking-[0.15em] text-muted-foreground">Sort</span>
                <SortSelect state={state} setState={setState} />
              </div>
            </div>

            <p className="mb-4 text-sm text-muted-foreground lg:hidden">
              Showing <span className="font-semibold text-foreground">{filtered.length}</span> of{" "}
              <span className="font-semibold text-foreground">{PRODUCTS.length}</span> pieces
            </p>

            {filtered.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 sm:gap-5 lg:grid-cols-3 xl:grid-cols-4 xl:gap-6">
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} index={i} />
                ))}
              </div>
            ) : (
              <EmptyState onReset={() => setState({ ...INITIAL })} />
            )}
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      <Sheet open={sheetOpen} onOpenChange={closeSheet}>
        <SheetContent
          side="left"
          className="w-full overflow-y-auto bg-background p-0 sm:max-w-md"
        >
          <SheetHeader className="flex flex-row items-center justify-between border-b border-border p-5">
            <SheetTitle className="font-serif text-xl text-foreground">Filters</SheetTitle>
          </SheetHeader>
          <div className="p-5">
            <FiltersPanel state={state} setState={update} />
            <div className="mt-7 flex gap-3">
              <Button
                variant="outline"
                onClick={() => setState({ ...INITIAL })}
                className="flex-1 rounded-full"
              >
                Clear all
              </Button>
              <Button
                onClick={() => closeSheet(false)}
                className="flex-1 rounded-full bg-primary text-primary-foreground"
              >
                Show {filtered.length} pieces
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </section>
  );
}

function SortSelect({
  state,
  setState,
}: {
  state: FilterState;
  setState: (updater: (prev: FilterState) => FilterState) => void;
}) {
  return (
    <Select
      value={state.sort}
      onValueChange={(v) => setState((p) => ({ ...p, sort: v as SortKey }))}
    >
      <SelectTrigger className="h-10 w-[180px] rounded-full border-border bg-card text-sm">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="featured">Featured</SelectItem>
        <SelectItem value="price-asc">Price: Low to High</SelectItem>
        <SelectItem value="price-desc">Price: High to Low</SelectItem>
        <SelectItem value="newest">Newest</SelectItem>
        <SelectItem value="rating">
          <span className="flex items-center gap-2">
            <Star className="h-3.5 w-3.5 fill-gold text-gold" /> Top Rated
          </span>
        </SelectItem>
      </SelectContent>
    </Select>
  );
}

function EmptyState({ onReset }: { onReset: () => void }) {
  const waHref = whatsappLink(
    BRAND.whatsapp,
    "Namaste ZARIYA! I am looking for a specific piece. Could you help me find it?"
  );
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/50 px-6 py-16 text-center">
      <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-muted">
        <SlidersHorizontal className="h-6 w-6 text-muted-foreground" />
      </div>
      <h3 className="font-serif text-xl font-semibold text-foreground">No pieces match</h3>
      <p className="mt-2 max-w-sm text-sm text-muted-foreground">
        Try widening your filters, or message our concierge — we may have the perfect piece waiting in the atelier.
      </p>
      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <Button
          onClick={onReset}
          className="rounded-full bg-primary text-primary-foreground"
        >
          Clear filters
        </Button>
        <a
          href={waHref}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex h-10 items-center justify-center rounded-full border border-gold/50 px-6 text-sm font-semibold text-gold transition-colors hover:bg-gold hover:text-charcoal"
        >
          Ask on WhatsApp
        </a>
      </div>
    </div>
  );
}


