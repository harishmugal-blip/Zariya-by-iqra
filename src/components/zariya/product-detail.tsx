"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  ShoppingBag,
  Truck,
  RefreshCw,
  Play,
  ZoomIn,
  BadgeCheck,
  ChevronRight,
  Heart,
  ShieldCheck,
  Sparkles,
  MessageCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn, formatPrice, discountPercent, whatsappLink, buildProductWhatsAppMessage } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { useUI } from "@/store/use-ui";
import { useWishlist } from "@/store/use-wishlist";
import { PRODUCTS, FAQS, BRAND } from "@/data/catalog";
import type { Product } from "@/lib/types";
import { Stars } from "./stars";
import { ProductCard, WhatsAppIcon } from "./product-card";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

// Approximate size guide data
const SIZE_GUIDE = [
  { size: "XS", bust: '32"', waist: '26"', hip: '34"', shoulder: '14.5"' },
  { size: "S", bust: '34"', waist: '28"', hip: '36"', shoulder: '15"' },
  { size: "M", bust: '36"', waist: '30"', hip: '38"', shoulder: '15.5"' },
  { size: "L", bust: '38"', waist: '32"', hip: '40"', shoulder: '16"' },
  { size: "XL", bust: '40"', waist: '34"', hip: '42"', shoulder: '16.5"' },
  { size: "XXL", bust: '42"', waist: '36"', hip: '44"', shoulder: '17"' },
];

export default function ProductDetail() {
  const activeSlug = useUI((s) => s.activeProductSlug);
  const variant = useUI((s) => s.activeVariant);
  const closeProduct = useUI((s) => s.closeProduct);
  const openCheckout = useUI((s) => s.openCheckout);
  const recentlyViewed = useUI((s) => s.recentlyViewed);
  const addItem = useCart((s) => s.addItem);
  const toggleWish = useWishlist((s) => s.toggle);
  const hasWish = useWishlist((s) => s.has);

  const open = variant === "full" && !!activeSlug;
  const product = React.useMemo<Product | undefined>(
    () => PRODUCTS.find((p) => p.slug === activeSlug),
    [activeSlug]
  );

  const [activeImg, setActiveImg] = React.useState(0);
  const [color, setColor] = React.useState("");
  const [size, setSize] = React.useState("");
  const [qty, setQty] = React.useState(1);
  const [zoom, setZoom] = React.useState(false);
  const [lens, setLens] = React.useState({ x: 50, y: 50 });
  const [spin360, setSpin360] = React.useState(false);
  const imageWrapRef = React.useRef<HTMLDivElement>(null);

  const reviewsRef = React.useRef<HTMLDivElement>(null);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Reset selections on product change
  React.useEffect(() => {
    if (product) {
      setColor(product.colors[0]?.name || "");
      setSize(product.sizes[0] || "");
      setQty(1);
      setActiveImg(0);
      setZoom(false);
      setSpin360(false);
    }
  }, [product?.slug]);

  // 360° rotating animation — cycle images for ~3s
  React.useEffect(() => {
    if (!spin360 || !product) return;
    let i = 0;
    const id = setInterval(() => {
      i = (i + 1) % product.images.length;
      setActiveImg(i);
    }, 220);
    const stop = setTimeout(() => {
      clearInterval(id);
      setSpin360(false);
    }, 3000);
    return () => {
      clearInterval(id);
      clearTimeout(stop);
    };
  }, [spin360, product]);

  if (!product) return null;

  const discount = discountPercent(product.price, product.compareAtPrice);
  const related = PRODUCTS.filter(
    (p) => p.category === product.category && p.slug !== product.slug
  ).slice(0, 4);
  const recent = recentlyViewed
    .filter((slug) => slug !== product.slug)
    .map((slug) => PRODUCTS.find((p) => p.slug === slug))
    .filter(Boolean)
    .slice(0, 8) as Product[];
  const faqs = FAQS.slice(0, 4);

  // Star breakdown (mock distribution based on rating)
  const breakdown = [5, 4, 3, 2, 1].map((star) => {
    const base = star === 5 ? 80 : star === 4 ? 14 : star === 3 ? 4 : star === 2 ? 1 : 1;
    return { star, pct: base };
  });

  const handleAdd = (openCart = false) => {
    addItem(product, { color, size, quantity: qty });
    toast.success("Added to bag", { description: `${product.name} — ${color} / ${size}` });
    if (openCart) closeProduct();
  };

  const handleBuyNow = () => {
    addItem(product, { color, size, quantity: qty });
    closeProduct();
    setTimeout(() => openCheckout(), 200);
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

  const handleWish = () => {
    toggleWish(product.id);
    toast(hasWish(product.id) ? "Removed from wishlist" : "Saved to wishlist");
  };

  const scrollToReviews = () => {
    reviewsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onImageMove = (e: React.MouseEvent) => {
    if (!imageWrapRef.current) return;
    const rect = imageWrapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLens({ x: Math.max(0, Math.min(100, x)), y: Math.max(0, Math.min(100, y)) });
  };

  return (
    <Dialog open={open} onOpenChange={(o) => !o && closeProduct()}>
      <DialogContent
        showCloseButton
        className="max-w-7xl w-[95vw] h-[92vh] p-0 overflow-hidden rounded-2xl luxury-shadow-lg border-gold/20 gap-0"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{product.name} — Full Details</DialogTitle>
        <DialogDescription className="sr-only">
          Complete product details, fabric information, reviews and related pieces for{" "}
          {product.name}.
        </DialogDescription>

        <div className="grid h-full grid-cols-1 lg:grid-cols-2 overflow-hidden">
          {/* LEFT — Gallery */}
          <div className="hidden lg:flex lg:flex-col gap-3 bg-muted/30 p-5 overflow-y-auto scrollbar-lux">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="text-xs text-muted-foreground">
              <ol className="flex items-center gap-1.5 capitalize">
                <li>Home</li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li>{product.category}</li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li className="text-foreground font-medium truncate">{product.name}</li>
              </ol>
            </nav>

            {/* Main image with hover zoom */}
            <div
              ref={imageWrapRef}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
              onMouseMove={onImageMove}
              className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-background luxury-shadow cursor-zoom-in"
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImg}
                  src={product.images[activeImg]?.src}
                  alt={product.images[activeImg]?.alt || product.name}
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-200"
                  style={
                    zoom
                      ? {
                          transform: "scale(2.2)",
                          transformOrigin: `${lens.x}% ${lens.y}%`,
                        }
                      : undefined
                  }
                />
              </AnimatePresence>

              {/* Zoom lens indicator */}
              {zoom && (
                <div
                  className="pointer-events-none absolute h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white/80 bg-white/10 backdrop-blur-[1px] shadow-lg"
                  style={{ left: `${lens.x}%`, top: `${lens.y}%` }}
                />
              )}

              {/* Zoom hint */}
              {!zoom && (
                <div className="pointer-events-none absolute bottom-3 right-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-[10px] text-white backdrop-blur-md">
                  <ZoomIn className="h-3 w-3" /> Hover to zoom
                </div>
              )}

              {/* 360° button */}
              <button
                onClick={() => setSpin360(true)}
                aria-label="View 360"
                className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/40 px-3 py-1.5 text-[10px] font-medium text-white backdrop-blur-md transition-colors hover:bg-black/60"
              >
                <RefreshCw className={cn("h-3 w-3", spin360 && "animate-spin")} />
                {spin360 ? "Rotating…" : "360° View"}
              </button>

              {/* Decorative video play */}
              <button
                aria-label="Play video"
                className="absolute right-3 top-3 grid h-10 w-10 place-items-center rounded-full bg-white/85 text-primary shadow-md backdrop-blur-md transition-transform hover:scale-110"
              >
                <Play className="h-4 w-4 fill-current" />
              </button>

              {discount > 0 && (
                <span className="absolute left-3 top-3 rounded-full bg-destructive px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-md">
                  -{discount}%
                </span>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImg(i)}
                  aria-label={`View image ${i + 1}`}
                  aria-pressed={i === activeImg}
                  className={cn(
                    "relative aspect-square overflow-hidden rounded-xl border-2 bg-background transition-all",
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

          {/* Mobile gallery (horizontal scroll) */}
          <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-lux p-3 bg-muted/30">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={cn(
                  "relative aspect-[3/4] h-44 shrink-0 overflow-hidden rounded-xl border-2 bg-background",
                  i === activeImg ? "border-gold" : "border-transparent opacity-70"
                )}
              >
                <img src={img.src} alt={img.alt} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          {/* RIGHT — Scrollable info */}
          <div
            ref={scrollRef}
            className="flex flex-col gap-6 overflow-y-auto scrollbar-lux p-5 md:p-7 lg:p-8"
          >
            {/* Breadcrumb (mobile hidden above) */}
            <nav aria-label="Breadcrumb" className="hidden lg:block text-xs text-muted-foreground">
              <ol className="flex items-center gap-1.5 capitalize">
                <li>Home</li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li>{product.category}</li>
                <li><ChevronRight className="h-3 w-3" /></li>
                <li className="text-foreground font-medium">{product.name}</li>
              </ol>
            </nav>

            {/* Brand tag */}
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-gold/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-gold border border-gold/20">
                <Sparkles className="h-3 w-3" /> {BRAND.fullName}
              </span>
              {product.badges.slice(0, 2).map((b) => (
                <Badge key={b} variant="secondary" className="rounded-full bg-primary/5 text-primary border border-primary/10 text-[10px] uppercase tracking-wide">
                  {b}
                </Badge>
              ))}
            </div>

            {/* Name & subtitle */}
            <div>
              <h1 className="font-serif text-3xl md:text-4xl font-semibold leading-tight text-foreground">
                {product.name}
              </h1>
              <p className="mt-2 text-base text-muted-foreground">{product.subtitle}</p>
            </div>

            {/* Rating */}
            <button
              onClick={scrollToReviews}
              className="flex items-center gap-2 text-left"
              aria-label="Read reviews"
            >
              <Stars rating={product.rating} size={16} showValue />
              <span className="text-xs text-muted-foreground underline-offset-2 hover:underline">
                {product.reviewCount} verified reviews
              </span>
            </button>

            {/* Price block */}
            <div className="flex flex-wrap items-end gap-3">
              <span className="font-serif text-4xl font-bold text-primary">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-lg text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
              {discount > 0 && (
                <span className="rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">
                  Save {formatPrice((product.compareAtPrice || 0) - product.price)} ({discount}%)
                </span>
              )}
              <span className="text-[11px] text-muted-foreground">Inclusive of all taxes</span>
            </div>

            {/* Story excerpt */}
            <p className="font-serif text-base italic leading-relaxed text-foreground/80 border-l-2 border-gold/40 pl-4">
              {product.story}
            </p>

            {/* Color selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                  Colour: <span className="text-foreground">{color}</span>
                </span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setColor(c.name)}
                    aria-label={c.name}
                    aria-pressed={color === c.name}
                    title={c.name}
                    className={cn(
                      "relative h-10 w-10 rounded-full border transition-all",
                      color === c.name
                        ? "border-gold ring-2 ring-gold/40 scale-105"
                        : "border-black/10 hover:scale-105"
                    )}
                    style={{ backgroundColor: c.hex }}
                  >
                    {color === c.name && (
                      <span className="absolute inset-0 grid place-items-center">
                        <BadgeCheck className="h-4 w-4 text-white drop-shadow-md" />
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Size selector + guide */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wide text-foreground/70">
                  Size: <span className="text-foreground">{size}</span>
                </span>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="text-[11px] text-gold underline-offset-2 hover:underline">
                      Size Guide
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 rounded-xl border-gold/20 p-4" align="end">
                    <h4 className="mb-3 font-serif text-base font-semibold">Size Guide</h4>
                    <div className="overflow-hidden rounded-lg border">
                      <table className="w-full text-xs">
                        <thead className="bg-muted/40">
                          <tr>
                            <th className="p-2 text-left font-medium">Size</th>
                            <th className="p-2 text-left font-medium">Bust</th>
                            <th className="p-2 text-left font-medium">Waist</th>
                            <th className="p-2 text-left font-medium">Hip</th>
                            <th className="p-2 text-left font-medium">Shoulder</th>
                          </tr>
                        </thead>
                        <tbody>
                          {SIZE_GUIDE.filter((s) => product.sizes.includes(s.size)).map((s) => (
                            <tr key={s.size} className="border-t border-border/60">
                              <td className="p-2 font-semibold text-primary">{s.size}</td>
                              <td className="p-2">{s.bust}</td>
                              <td className="p-2">{s.waist}</td>
                              <td className="p-2">{s.hip}</td>
                              <td className="p-2">{s.shoulder}</td>
                            </tr>
                          ))}
                          {!product.sizes.find((s) => s !== "One Size") && (
                            <tr className="border-t border-border/60">
                              <td colSpan={5} className="p-3 text-center text-muted-foreground">
                                One Size — gently flowing silhouette
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                    <p className="mt-2 text-[10px] text-muted-foreground">
                      Measurements in inches. Made-to-measure available on WhatsApp.
                    </p>
                  </PopoverContent>
                </Popover>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    aria-pressed={size === s}
                    className={cn(
                      "min-w-12 rounded-full border px-4 py-2 text-xs font-medium transition-all",
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

            {/* Quantity + stock */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
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
              <span className={cn(
                "text-[11px] font-medium",
                product.stock <= 8 ? "text-destructive" : "text-emerald"
              )}>
                {product.stock <= 8
                  ? `Only ${product.stock} left`
                  : `${product.stock} in stock`}
              </span>
            </div>

            {/* Sticky action bar */}
            <div className="sticky bottom-0 -mx-5 md:-mx-7 lg:-mx-8 z-10 mt-2 border-t border-border bg-background/95 px-5 md:px-7 lg:px-8 py-4 backdrop-blur-md">
              <div className="grid grid-cols-1 sm:grid-cols-[1fr_1fr_auto] gap-2">
                <Button
                  onClick={() => handleAdd(true)}
                  size="lg"
                  className="h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Add to Bag
                </Button>
                <Button
                  onClick={handleBuyNow}
                  size="lg"
                  className="h-12 rounded-full bg-foreground text-background hover:bg-foreground/90 shadow-md"
                >
                  Buy Now
                </Button>
                <div className="flex gap-2">
                  <Button
                    onClick={handleWhatsApp}
                    size="lg"
                    aria-label="Order on WhatsApp"
                    className="h-12 px-4 rounded-full bg-emerald text-white hover:bg-emerald/90"
                  >
                    <WhatsAppIcon className="h-4 w-4" />
                  </Button>
                  <Button
                    onClick={handleWish}
                    aria-label={hasWish(product.id) ? "Remove from wishlist" : "Add to wishlist"}
                    variant="outline"
                    size="lg"
                    className="h-12 px-4 rounded-full border-primary/30"
                  >
                    <Heart className={cn("h-4 w-4", hasWish(product.id) && "fill-destructive text-destructive")} />
                  </Button>
                </div>
              </div>
            </div>

            {/* SKU + category + fabric tags */}
            <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
              <span className="rounded-md bg-muted/50 px-2 py-1">SKU: {product.sku}</span>
              <span className="rounded-md bg-muted/50 px-2 py-1 capitalize">{product.category}</span>
              <span className="rounded-md bg-muted/50 px-2 py-1">{product.fabric}</span>
              {product.tags.slice(0, 3).map((t) => (
                <span key={t} className="rounded-md bg-gold/10 px-2 py-1 text-gold capitalize">
                  #{t}
                </span>
              ))}
            </div>

            {/* Trust badges */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/30 p-3">
                <Truck className="h-4 w-4 text-gold" />
                <span className="text-[10px] font-medium text-foreground/70">White-glove delivery</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/30 p-3">
                <ShieldCheck className="h-4 w-4 text-gold" />
                <span className="text-[10px] font-medium text-foreground/70">Authenticity certified</span>
              </div>
              <div className="flex flex-col items-center gap-1 rounded-xl bg-muted/30 p-3">
                <Sparkles className="h-4 w-4 text-gold" />
                <span className="text-[10px] font-medium text-foreground/70">Handcrafted in Kashmir</span>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="bg-muted/40 rounded-full p-1 h-auto flex-wrap justify-center">
                <TabsTrigger value="description" className="rounded-full text-xs">Description</TabsTrigger>
                <TabsTrigger value="fabric" className="rounded-full text-xs">Fabric</TabsTrigger>
                <TabsTrigger value="care" className="rounded-full text-xs">Care</TabsTrigger>
                <TabsTrigger value="shipping" className="rounded-full text-xs">Shipping</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="mt-4 rounded-2xl border p-4">
                <p className="text-sm leading-relaxed text-foreground/80">{product.description}</p>
                <Separator className="my-3" />
                <p className="text-sm leading-relaxed text-muted-foreground italic">{product.story}</p>
              </TabsContent>
              <TabsContent value="fabric" className="mt-4 rounded-2xl border p-4">
                <table className="w-full text-sm">
                  <tbody>
                    {product.fabricDetails.map((f) => (
                      <tr key={f.label} className="border-b border-border/50 last:border-b-0">
                        <td className="py-2 pr-4 font-medium text-foreground/70">{f.label}</td>
                        <td className="py-2 text-right text-foreground">{f.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </TabsContent>
              <TabsContent value="care" className="mt-4 rounded-2xl border p-4">
                <p className="text-sm leading-relaxed text-foreground/80">{product.careInstructions}</p>
              </TabsContent>
              <TabsContent value="shipping" className="mt-4 rounded-2xl border p-4">
                <div className="flex items-start gap-2">
                  <Truck className="mt-0.5 h-4 w-4 text-gold" />
                  <p className="text-sm leading-relaxed text-foreground/80">{product.shippingInfo}</p>
                </div>
              </TabsContent>
            </Tabs>

            {/* Reviews */}
            <section ref={reviewsRef} className="scroll-mt-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif text-xl font-semibold">Reviews & Ratings</h3>
                <Button variant="outline" size="sm" className="rounded-full text-xs">
                  <MessageCircle className="mr-1.5 h-3.5 w-3.5" /> Write a Review
                </Button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-4 rounded-2xl border p-4">
                <div className="flex flex-col items-center justify-center text-center md:border-r md:pr-4">
                  <span className="font-serif text-5xl font-bold text-primary">
                    {product.rating.toFixed(1)}
                  </span>
                  <Stars rating={product.rating} size={16} className="mt-1" />
                  <span className="mt-1 text-xs text-muted-foreground">
                    {product.reviewCount} verified
                  </span>
                </div>
                <div className="space-y-1.5">
                  {breakdown.map((b) => (
                    <div key={b.star} className="flex items-center gap-2 text-xs">
                      <span className="w-6 text-foreground/70">{b.star}★</span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gold"
                          style={{ width: `${b.pct}%` }}
                        />
                      </div>
                      <span className="w-10 text-right text-muted-foreground">{b.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Review list */}
              <div className="space-y-3">
                {product.reviews.map((r) => (
                  <div key={r.id} className="rounded-2xl border p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{r.author}</span>
                          {r.verified && (
                            <span className="inline-flex items-center gap-0.5 rounded-full bg-emerald/10 px-1.5 py-0.5 text-[10px] font-medium text-emerald">
                              <BadgeCheck className="h-3 w-3" /> Verified
                            </span>
                          )}
                        </div>
                        {r.location && (
                          <span className="text-[11px] text-muted-foreground">{r.location}</span>
                        )}
                      </div>
                      <span className="text-[11px] text-muted-foreground">{r.date}</span>
                    </div>
                    <Stars rating={r.rating} size={13} className="mt-2" />
                    <h4 className="mt-2 font-medium text-foreground">{r.title}</h4>
                    <p className="mt-1 text-sm leading-relaxed text-foreground/80">{r.body}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* FAQs */}
            <section className="space-y-3">
              <h3 className="font-serif text-xl font-semibold">Frequently Asked</h3>
              <Accordion type="single" collapsible className="rounded-2xl border px-4">
                {faqs.map((f, i) => (
                  <AccordionItem key={i} value={`faq-${i}`}>
                    <AccordionTrigger className="text-left text-sm font-medium">
                      {f.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Related products */}
            {related.length > 0 && (
              <section className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-xl font-semibold">You May Also Love</h3>
                  <span className="text-xs text-muted-foreground">{related.length} pieces</span>
                </div>
                <div className="flex gap-4 overflow-x-auto scrollbar-lux pb-3 -mx-1 px-1">
                  {related.map((p, i) => (
                    <div key={p.id} className="w-60 shrink-0">
                      <ProductCard product={p} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Recently viewed */}
            {recent.length > 0 && (
              <section className="space-y-3 pb-6">
                <h3 className="font-serif text-xl font-semibold">Recently Viewed</h3>
                <div className="flex gap-4 overflow-x-auto scrollbar-lux pb-3 -mx-1 px-1">
                  {recent.map((p, i) => (
                    <div key={p.id} className="w-52 shrink-0">
                      <ProductCard product={p} index={i} />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
