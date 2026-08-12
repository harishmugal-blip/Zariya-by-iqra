"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Minus, Plus, ShoppingBag, Eye, ChevronRight } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, discountPercent, whatsappLink, buildProductWhatsAppMessage } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { useUI } from "@/store/use-ui";
import { PRODUCTS, BRAND } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { Stars } from "./stars";
import { WhatsAppIcon } from "./product-card";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function QuickView() {
  const activeSlug = useUI((s) => s.activeProductSlug);
  const variant = useUI((s) => s.activeVariant);
  const closeProduct = useUI((s) => s.closeProduct);
  const openProduct = useUI((s) => s.openProduct);
  const addItem = useCart((s) => s.addItem);

  const open = variant === "quick" && !!activeSlug;
  const product = React.useMemo<Product | undefined>(
    () => PRODUCTS.find((p) => p.slug === activeSlug),
    [activeSlug]
  );

  const [activeImg, setActiveImg] = React.useState(0);
  const [color, setColor] = React.useState<string>("");
  const [size, setSize] = React.useState<string>("");
  const [qty, setQty] = React.useState(1);

  // Reset selections whenever the active product changes
  React.useEffect(() => {
    if (product) {
      setColor(product.colors[0]?.name || "");
      setSize(product.sizes[0] || "");
      setQty(1);
      setActiveImg(0);
    }
  }, [product?.slug]);

  if (!product) return null;

  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAdd = () => {
    addItem(product, { color, size, quantity: qty });
    toast.success("Added to bag", { description: `${product.name} — ${color} / ${size}` });
    closeProduct();
  };

  const handleWhatsApp = () => {
    const msg = buildProductWhatsAppMessage({
      name: product.name,
      price: product.price,
      color,
      size,
      slug: product.slug,
    });
    window.open(whatsappLink(BRAND.whatsapp, msg), "_blank");
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeProduct()}>
      <DialogContent
        showCloseButton
        className="max-w-4xl w-[95vw] sm:w-[90vw] p-0 overflow-hidden rounded-2xl luxury-shadow border-gold/20"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{product.name}</DialogTitle>
        <DialogDescription className="sr-only">
          Quick view of {product.name} — {product.subtitle}
        </DialogDescription>

        <AnimatePresence mode="wait">
          <motion.div
            key={product.slug}
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="grid grid-cols-1 md:grid-cols-2 max-h-[90vh] overflow-hidden"
          >
            {/* LEFT — Image gallery */}
            <div className="flex flex-col gap-3 bg-muted/30 p-4 md:p-6">
              <div className="relative aspect-[3/4] overflow-hidden rounded-2xl bg-background luxury-shadow">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={activeImg}
                    src={product.images[activeImg]?.src}
                    alt={product.images[activeImg]?.alt || product.name}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="h-full w-full object-cover"
                  />
                </AnimatePresence>
                {discount > 0 && (
                  <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
                    -{discount}%
                  </span>
                )}
              </div>
              {/* Thumbnails */}
              <div className="flex gap-2 overflow-x-auto scrollbar-lux pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImg(i)}
                    aria-label={`View image ${i + 1}`}
                    aria-pressed={i === activeImg}
                    className={cn(
                      "relative h-16 w-14 shrink-0 overflow-hidden rounded-lg border-2 bg-background transition-all",
                      i === activeImg
                        ? "border-gold ring-2 ring-gold/30"
                        : "border-transparent opacity-70 hover:opacity-100"
                    )}
                  >
                    <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            </div>

            {/* RIGHT — Details */}
            <div className="flex flex-col overflow-y-auto scrollbar-lux p-5 md:p-7 gap-4">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {BRAND.fullName}
                </span>
                {product.badges[0] && (
                  <Badge variant="secondary" className="rounded-full bg-gold/15 text-gold border border-gold/20 text-[10px] uppercase tracking-wide">
                    {product.badges[0]}
                  </Badge>
                )}
              </div>

              <div>
                <h2 className="font-serif text-2xl md:text-3xl font-semibold leading-tight text-foreground">
                  {product.name}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">{product.subtitle}</p>
              </div>

              <div className="flex items-center gap-2">
                <Stars rating={product.rating} size={15} showValue />
                <span className="text-xs text-muted-foreground">
                  ({product.reviewCount} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="flex items-end gap-3">
                <span className="font-serif text-3xl font-bold text-primary">
                  {formatPrice(product.price)}
                </span>
                {product.compareAtPrice && (
                  <span className="text-base text-muted-foreground line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-xs font-semibold text-destructive">
                    Save {discount}%
                  </span>
                )}
              </div>

              <p className="text-sm leading-relaxed text-foreground/80 line-clamp-4">
                {product.description}
              </p>

              <Separator />

              {/* Color */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Colour
                  </span>
                  <span className="text-xs text-foreground/60">{color}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setColor(c.name)}
                      aria-label={c.name}
                      aria-pressed={color === c.name}
                      title={c.name}
                      className={cn(
                        "relative h-9 w-9 rounded-full border transition-all",
                        color === c.name
                          ? "border-gold ring-2 ring-gold/40 scale-105"
                          : "border-black/10 hover:scale-105"
                      )}
                      style={{ backgroundColor: c.hex }}
                    >
                      {color === c.name && (
                        <span className="absolute inset-0 grid place-items-center">
                          <span className="h-2 w-2 rounded-full bg-white mix-blend-difference" />
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              {/* Size */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                    Size
                  </span>
                  <button
                    onClick={() => openProduct(product.slug)}
                    className="text-[11px] text-gold underline-offset-2 hover:underline"
                  >
                    View size guide
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      aria-pressed={size === s}
                      className={cn(
                        "min-w-11 rounded-full border px-3.5 py-2 text-xs font-medium transition-all",
                        size === s
                          ? "border-primary bg-primary text-primary-foreground shadow-md"
                          : "border-border bg-background text-foreground hover:border-primary/50"
                      )}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                  Quantity
                </span>
                <div className="flex items-center gap-1 rounded-full border border-border bg-background p-1">
                  <button
                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-8 text-center text-sm font-semibold">{qty}</span>
                  <button
                    onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                    className="grid h-8 w-8 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {product.stock <= 8 && (
                <p className="text-[11px] font-medium text-destructive">
                  Only {product.stock} left — almost gone
                </p>
              )}

              <Separator />

              {/* Actions */}
              <div className="flex flex-col gap-2 pt-1">
                <Button
                  onClick={handleAdd}
                  size="lg"
                  className="h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Bag — {formatPrice(product.price * qty)}
                </Button>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    onClick={() => openProduct(product.slug)}
                    variant="outline"
                    size="lg"
                    className="h-11 rounded-full border-primary/30 text-primary hover:bg-primary/5"
                  >
                    <Eye className="mr-2 h-4 w-4" />
                    View Full Details
                  </Button>
                  <Button
                    onClick={handleWhatsApp}
                    size="lg"
                    className="h-11 rounded-full bg-emerald text-white hover:bg-emerald/90"
                  >
                    <WhatsAppIcon className="mr-2 h-4 w-4" />
                    Order on WhatsApp
                  </Button>
                </div>
              </div>

              <button
                onClick={() => openProduct(product.slug)}
                className="group mt-1 inline-flex items-center justify-center gap-1 text-xs font-medium text-foreground/60 hover:text-primary"
              >
                See full story, fabric & reviews
                <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
              </button>
            </div>
          </motion.div>
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
