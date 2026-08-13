"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { X, GitCompare, Check, Minus, Trash2 } from "lucide-react";
import { useCompare } from "@/store/use-compare";
import { useUI } from "@/store/use-ui";
import { PRODUCTS, BRAND } from "@/data/catalog";
import { cn, formatPrice, discountPercent, whatsappLink } from "@/lib/utils";
import { Stars } from "./stars";
import { WhatsAppIcon } from "./product-card";
import { toast } from "sonner";
import type { Product } from "@/lib/types";

const MAX_COMPARE = 3;

export function CompareDrawer() {
  const ids = useCompare((s) => s.ids);
  const isOpen = useCompare((s) => s.isOpen);
  const closeCompare = useCompare((s) => s.closeCompare);
  const remove = useCompare((s) => s.remove);
  const clear = useCompare((s) => s.clear);
  const openProduct = useUI((s) => s.openProduct);

  const products = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean) as Product[];

  const rows: { label: string; render: (p: Product) => React.ReactNode }[] = [
    { label: "Price", render: (p) => <span className="font-serif font-bold text-primary">{formatPrice(p.price)}</span> },
    {
      label: "Discount",
      render: (p) => {
        const d = discountPercent(p.price, p.compareAtPrice);
        return d > 0 ? <span className="text-destructive font-semibold">-{d}%</span> : <span className="text-muted-foreground">—</span>;
      },
    },
    { label: "Rating", render: (p) => <div className="flex flex-col items-center gap-1"><Stars rating={p.rating} size={12} /><span className="text-[10px] text-muted-foreground">{p.rating} ({p.reviewCount})</span></div> },
    { label: "Fabric", render: (p) => <span className="text-xs">{p.fabric}</span> },
    { label: "Category", render: (p) => <span className="text-xs capitalize">{p.category}</span> },
    { label: "Collection", render: (p) => <span className="text-xs capitalize">{p.collection.replace(/-/g, " ")}</span> },
    { label: "Colors", render: (p) => <div className="flex justify-center gap-1">{p.colors.slice(0, 4).map((c) => <span key={c.name} className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} title={c.name} />)}</div> },
    { label: "Sizes", render: (p) => <span className="text-[10px]">{p.sizes.join(", ")}</span> },
    { label: "Stock", render: (p) => <span className={cn("text-xs font-medium", p.stock <= 5 ? "text-destructive" : "text-emerald")}>{p.stock} left</span> },
    { label: "Handcrafted", render: (p) => p.badges.includes("handcrafted") ? <Check className="mx-auto h-4 w-4 text-emerald" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" /> },
    { label: "Limited Edition", render: (p) => p.limitedEdition ? <Check className="mx-auto h-4 w-4 text-gold" /> : <Minus className="mx-auto h-4 w-4 text-muted-foreground/40" /> },
    { label: "Care", render: (p) => <span className="text-[10px] leading-tight">{p.careInstructions.slice(0, 40)}…</span> },
  ];

  return (
    <Sheet open={isOpen} onOpenChange={(v) => !v && closeCompare()}>
      <SheetContent className="w-full overflow-y-auto scrollbar-lux sm:max-w-5xl">
        <SheetHeader className="border-b border-border pb-4">
          <SheetTitle className="flex items-center gap-2 font-serif text-2xl">
            <GitCompare className="h-5 w-5 text-gold" />
            Compare Pieces
          </SheetTitle>
          <p className="text-xs text-muted-foreground">
            Side by side — find the heirloom that's meant for you.
          </p>
        </SheetHeader>

        {products.length === 0 ? (
          <div className="grid place-items-center py-20 text-center">
            <GitCompare className="h-12 w-12 text-muted-foreground/40" />
            <h3 className="mt-3 font-serif text-lg font-semibold text-muted-foreground">
              Nothing to compare yet
            </h3>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Add up to {MAX_COMPARE} pieces using the compare icon on any product
              to see them side by side.
            </p>
          </div>
        ) : (
          <div className="py-4">
            {/* Product headers */}
            <div className="mb-2 grid gap-3 overflow-x-auto scrollbar-lux pb-2" style={{ gridTemplateColumns: `110px repeat(${products.length}, minmax(150px, 1fr))` }}>
              <div />
              {products.map((p) => (
                <div key={p.id} className="relative">
                  <button
                    onClick={() => remove(p.id)}
                    aria-label="Remove from compare"
                    className="absolute right-1 top-1 z-10 grid h-6 w-6 place-items-center rounded-full bg-card/80 text-muted-foreground hover:bg-destructive hover:text-white"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                  <div className="overflow-hidden rounded-2xl border border-border bg-card">
                    <div className="aspect-[3/4] overflow-hidden">
                      <img
                        src={p.images[0]?.src}
                        alt={p.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="p-3 text-center">
                      <p className="text-[9px] uppercase tracking-wide text-gold">{p.category}</p>
                      <button
                        onClick={() => {
                          closeCompare();
                          openProduct(p.slug);
                        }}
                        className="mt-0.5 line-clamp-1 font-serif text-sm font-semibold text-foreground hover:text-primary"
                      >
                        {p.name}
                      </button>
                      <p className="mt-1 font-serif text-base font-bold text-primary">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </div>
              ))}
              {/* Empty slots */}
              {Array.from({ length: MAX_COMPARE - products.length }).map((_, i) => (
                <div
                  key={`empty-${i}`}
                  className="hidden grid-place-items-center rounded-2xl border-2 border-dashed border-border/60 py-12 text-center sm:grid"
                >
                  <div>
                    <GitCompare className="mx-auto h-6 w-6 text-muted-foreground/40" />
                    <p className="mt-1 text-[10px] text-muted-foreground">Add a piece</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Spec rows */}
            <div className="space-y-0 overflow-x-auto scrollbar-lux rounded-2xl border border-border">
              {rows.map((row, ri) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid items-center gap-3 border-b border-border/60 px-3 py-3 last:border-b-0",
                    ri % 2 === 0 ? "bg-card" : "bg-muted/30"
                  )}
                  style={{ gridTemplateColumns: `110px repeat(${products.length}, minmax(150px, 1fr))` }}
                >
                  <div className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                    {row.label}
                  </div>
                  {products.map((p) => (
                    <div key={p.id} className="text-center text-foreground">
                      {row.render(p)}
                    </div>
                  ))}
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <button
                onClick={() => {
                  clear();
                  toast("Comparison cleared");
                }}
                className="flex items-center justify-center gap-1.5 rounded-full border border-border px-4 py-2 text-xs font-semibold text-muted-foreground transition-colors hover:border-destructive/50 hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" /> Clear all
              </button>
              <a
                href={whatsappLink(
                  BRAND.whatsapp,
                  `Namaste! I'm comparing these ZARIYA pieces and would like guidance:\n${products.map((p, i) => `${i + 1}. ${p.name} — ${formatPrice(p.price)}`).join("\n")}`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 rounded-full bg-emerald px-5 py-2 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
              >
                <WhatsAppIcon className="h-3.5 w-3.5" /> Get concierge advice
              </a>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
