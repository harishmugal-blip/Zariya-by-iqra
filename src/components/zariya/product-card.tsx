"use client";

import { Heart, Eye, ShoppingBag, Star, GitCompare } from "lucide-react";
import { motion } from "framer-motion";
import type { Product } from "@/lib/types";
import { cn, formatPrice, discountPercent, whatsappLink, buildProductWhatsAppMessage } from "@/lib/utils";
import { BRAND } from "@/data/catalog";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/store/use-wishlist";
import { useCompare } from "@/store/use-compare";
import { useUI } from "@/store/use-ui";
import { Stars } from "./stars";
import { toast } from "sonner";

const BADGE_STYLES: Record<string, { label: string; className: string }> = {
  new: { label: "New", className: "bg-emerald text-white" },
  bestseller: { label: "Bestseller", className: "bg-primary text-primary-foreground" },
  limited: { label: "Limited Edition", className: "bg-charcoal text-ivory" },
  sale: { label: "Sale", className: "bg-destructive text-white" },
  exclusive: { label: "Exclusive", className: "bg-gold text-charcoal" },
  handcrafted: { label: "Handcrafted", className: "glass-gold text-charcoal" },
};

export function ProductCard({ product, index = 0, className }: { product: Product; index?: number; className?: string }) {
  const addItem = useCart((s) => s.addItem);
  const toggleWish = useWishlist((s) => s.toggle);
  const hasWish = useWishlist((s) => s.has(product.id));
  const toggleCompare = useCompare((s) => s.toggle);
  const inCompare = useCompare((s) => s.has(product.id));
  const openCompare = useCompare((s) => s.openCompare);
  const openQuickView = useUI((s) => s.openQuickView);
  const openProduct = useUI((s) => s.openProduct);
  const discount = discountPercent(product.price, product.compareAtPrice);

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    addItem(product, { color: product.colors[0]?.name || "", size: product.sizes[0] || "" });
    toast.success("Added to bag", { description: product.name });
  };

  const handleWish = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWish(product.id);
    toast(hasWish ? "Removed from wishlist" : "Added to wishlist");
  };

  const handleCompare = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleCompare(product.id);
    if (!inCompare) {
      toast.success("Added to compare", {
        description: "View comparison",
        action: { label: "Compare", onClick: () => openCompare() },
      });
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    openQuickView(product.slug);
  };

  const handleWhatsApp = (e: React.MouseEvent) => {
    e.stopPropagation();
    const msg = buildProductWhatsAppMessage({
      name: product.name,
      price: product.price,
      slug: product.slug,
      color: product.colors[0]?.name,
      size: product.sizes[0],
    });
    window.open(whatsappLink(BRAND.whatsapp, msg), "_blank");
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, delay: (index % 4) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl bg-card luxury-shadow transition-all duration-500 hover:luxury-shadow-lg hover:-translate-y-1.5",
        className
      )}
      onClick={() => openProduct(product.slug)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && openProduct(product.slug)}
      aria-label={`View ${product.name}`}
    >
      {/* Image */}
      <div className="relative aspect-[3/4] overflow-hidden bg-muted/30">
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt || product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.07]"
        />
        {product.images[1] && (
          <img
            src={product.images[1].src}
            alt={product.images[1].alt}
            loading="lazy"
            className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
          />
        )}

        {/* gradient overlay */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        {/* Badges */}
        <div className="absolute left-3 top-3 flex flex-col gap-1.5">
          {product.badges.slice(0, 2).map((b) => (
            <span
              key={b}
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide backdrop-blur-md shadow-sm",
                BADGE_STYLES[b]?.className
              )}
            >
              {BADGE_STYLES[b]?.label || b}
            </span>
          ))}
          {discount > 0 && (
            <span className="rounded-full bg-destructive px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm">
              -{discount}%
            </span>
          )}
        </div>

        {/* Wishlist */}
        <button
          onClick={handleWish}
          aria-label={hasWish ? "Remove from wishlist" : "Add to wishlist"}
          className="absolute right-3 top-3 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
        >
          <motion.span
            key={hasWish ? "filled" : "empty"}
            initial={{ scale: 0.6 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 15 }}
            className="relative grid place-items-center"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-colors",
                hasWish ? "fill-destructive text-destructive" : "text-primary"
              )}
            />
            {hasWish && (
              <>
                {/* burst sparkles */}
                {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
                  <motion.span
                    key={deg}
                    initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
                    animate={{
                      opacity: 0,
                      scale: 0.8,
                      x: Math.cos((deg * Math.PI) / 180) * 14,
                      y: Math.sin((deg * Math.PI) / 180) * 14,
                    }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                    className="pointer-events-none absolute h-1 w-1 rounded-full bg-gold"
                  />
                ))}
              </>
            )}
          </motion.span>
        </button>

        {/* Compare */}
        <button
          onClick={handleCompare}
          aria-label={inCompare ? "Remove from compare" : "Add to compare"}
          className="absolute right-3 top-14 grid h-9 w-9 place-items-center rounded-full bg-white/80 text-primary shadow-sm backdrop-blur-md transition-all hover:scale-110 hover:bg-white"
        >
          <GitCompare className={cn("h-4 w-4 transition-all", inCompare && "text-gold")} />
        </button>

        {/* Hover actions */}
        <div className="absolute inset-x-3 bottom-3 flex translate-y-3 gap-2 opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
          <button
            onClick={handleAdd}
            className="flex h-11 flex-1 items-center justify-center gap-2 rounded-full bg-primary text-primary-foreground text-xs font-semibold uppercase tracking-wide shadow-lg transition-all hover:bg-primary/90 active:scale-95"
          >
            <ShoppingBag className="h-4 w-4" /> Add to Bag
          </button>
          <button
            onClick={handleQuickView}
            aria-label="Quick view"
            className="grid h-11 w-11 place-items-center rounded-full bg-white text-primary shadow-lg transition-all hover:scale-110 active:scale-95"
          >
            <Eye className="h-4 w-4" />
          </button>
        </div>

        {/* WhatsApp quick */}
        <button
          onClick={handleWhatsApp}
          aria-label="Order on WhatsApp"
          className="absolute bottom-3 right-3 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-emerald text-white opacity-0 shadow-lg transition-all duration-500 hover:scale-110 group-hover:translate-y-0 group-hover:opacity-0"
        >
          <WhatsAppIcon className="h-4 w-4" />
        </button>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-4">
        <div className="mb-1 flex items-center justify-between gap-2">
          <span className="text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
            {product.category}
          </span>
          <Stars rating={product.rating} size={12} showValue count={product.reviewCount} />
        </div>
        <h3 className="font-serif text-lg font-semibold leading-snug text-foreground transition-colors group-hover:text-primary">
          {product.name}
        </h3>
        <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">{product.subtitle}</p>

        {/* Colors */}
        <div className="mt-3 flex items-center gap-1.5">
          {product.colors.slice(0, 4).map((c) => (
            <span
              key={c.name}
              title={c.name}
              className="h-3.5 w-3.5 rounded-full border border-black/10 ring-1 ring-white"
              style={{ backgroundColor: c.hex }}
            />
          ))}
          {product.colors.length > 4 && (
            <span className="text-[10px] text-muted-foreground">+{product.colors.length - 4}</span>
          )}
        </div>

        {/* Price */}
        <div className="mt-auto flex items-end gap-2 pt-4">
          <span className="font-serif text-xl font-bold text-foreground">
            {formatPrice(product.price)}
          </span>
          {product.compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(product.compareAtPrice)}
            </span>
          )}
        </div>
        {product.stock <= 8 && (
          <p className="mt-1 text-[11px] font-medium text-destructive">
            Only {product.stock} left
          </p>
        )}
      </div>
    </motion.article>
  );
}

export function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.71.306 1.263.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
