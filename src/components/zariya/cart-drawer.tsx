"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  X,
  Tag,
  Truck,
  CheckCircle2,
  ArrowRight,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn, formatPrice, whatsappLink, buildWhatsAppOrderMessage } from "@/lib/utils";
import { useCart } from "@/store/use-cart";
import { useUI } from "@/store/use-ui";
import { PRODUCTS, COUPONS, BRAND } from "@/data/catalog";
import { WhatsAppIcon } from "./product-card";
import { toast } from "sonner";

const FREE_SHIPPING_THRESHOLD = 25000;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function CartDrawer() {
  const isOpen = useCart((s) => s.isOpen);
  const closeCart = useCart((s) => s.closeCart);
  const items = useCart((s) => s.items);
  const updateQuantity = useCart((s) => s.updateQuantity);
  const removeItem = useCart((s) => s.removeItem);
  const subtotal = useCart((s) => s.subtotal);
  const count = useCart((s) => s.count);
  const couponCode = useCart((s) => s.couponCode);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const removeCoupon = useCart((s) => s.removeCoupon);
  const openCheckout = useUI((s) => s.openCheckout);
  const closeProduct = useUI((s) => s.closeProduct);

  const [couponInput, setCouponInput] = React.useState("");

  const appliedCoupon = React.useMemo(
    () => COUPONS.find((c) => c.code.toUpperCase() === couponCode?.toUpperCase()) || null,
    [couponCode]
  );

  const discount = React.useMemo(() => {
    if (!appliedCoupon) return 0;
    if (appliedCoupon.type === "percent") return Math.round((subtotal() * appliedCoupon.value) / 100);
    return appliedCoupon.value;
  }, [appliedCoupon, subtotal, items]);

  const total = Math.max(0, subtotal() - discount);
  const remaining = Math.max(0, FREE_SHIPPING_THRESHOLD - subtotal());
  const progress = Math.min(100, (subtotal() / FREE_SHIPPING_THRESHOLD) * 100);

  const handleApplyCoupon = () => {
    const code = couponInput.trim().toUpperCase();
    if (!code) return;
    const found = COUPONS.find((c) => c.code.toUpperCase() === code);
    if (!found) {
      toast.error("Invalid coupon", { description: "This code is not recognised." });
      return;
    }
    if (subtotal() < found.minOrder) {
      toast.error("Minimum not met", {
        description: `Add ${formatPrice(found.minOrder - subtotal())} more to use ${found.code}.`,
      });
      return;
    }
    applyCoupon(found.code);
    toast.success("Coupon applied", { description: found.description });
    setCouponInput("");
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toast("Coupon removed");
  };

  const handleWhatsAppOrder = () => {
    const msg = buildWhatsAppOrderMessage({
      items: items.map((i) => ({
        name: i.name,
        color: i.color,
        size: i.size,
        qty: i.quantity,
        price: i.price,
      })),
      total,
      couponCode: couponCode || undefined,
    });
    window.open(whatsappLink(BRAND.whatsapp, msg), "_blank");
  };

  const handleCheckout = () => {
    closeCart();
    setTimeout(() => openCheckout(), 150);
  };

  const handleExplore = () => {
    closeCart();
    if (typeof window !== "undefined") {
      setTimeout(() => {
        document
          .getElementById("products")
          ?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 200);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={(o) => !o && closeCart()}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-lg p-0 flex flex-col gap-0 border-l border-gold/15"
      >
        <SheetTitle className="sr-only">Your Shopping Bag</SheetTitle>
        <SheetDescription className="sr-only">
          Review the items in your bag, apply a coupon, and proceed to checkout.
        </SheetDescription>

        {/* Header */}
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-5 w-5 text-primary" />
            <h2 className="font-serif text-2xl font-semibold">Your Bag</h2>
            {count() > 0 && (
              <span className="rounded-full bg-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                {count()} {count() === 1 ? "item" : "items"}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            aria-label="Close cart"
            className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Free shipping progress */}
        {items.length > 0 && (
          <div className="border-b border-border bg-muted/20 px-5 py-3">
            {remaining > 0 ? (
              <p className="text-xs text-foreground/80">
                Add <span className="font-semibold text-primary">{formatPrice(remaining)}</span> more for{" "}
                <span className="font-medium text-gold">complimentary white-glove delivery</span>
              </p>
            ) : (
              <p className="flex items-center gap-1.5 text-xs font-medium text-emerald">
                <CheckCircle2 className="h-3.5 w-3.5" />
                You&apos;ve unlocked complimentary delivery
              </p>
            )}
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="h-full rounded-full bg-gradient-to-r from-gold/70 to-gold"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.6, ease: EASE }}
              />
            </div>
          </div>
        )}

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
                <ShoppingBag className="h-9 w-9 text-muted-foreground/60" />
              </div>
              <div>
                <h3 className="font-serif text-xl font-semibold">Your bag is empty</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Discover heirlooms crafted by Kashmiri artisans.
                </p>
              </div>
              <Button
                onClick={handleExplore}
                className="rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Explore the Collection
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </motion.div>
          ) : (
            <ul className="flex flex-col gap-3">
              <AnimatePresence initial={false}>
                {items.map((item) => {
                  const product = PRODUCTS.find((p) => p.id === item.productId);
                  return (
                    <motion.li
                      key={`${item.productId}-${item.color}-${item.size}`}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 30 }}
                      transition={{ duration: 0.3, ease: EASE }}
                      className="flex gap-3 rounded-2xl border border-border/60 bg-background p-3 luxury-shadow"
                    >
                      {/* Image */}
                      <button
                        onClick={() => {
                          if (product) {
                            closeCart();
                            setTimeout(() => useUI.getState().openProduct(product.slug), 200);
                          }
                        }}
                        className="relative h-24 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
                        aria-label={`View ${item.name}`}
                      >
                        <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                      </button>

                      {/* Details */}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-serif text-sm font-semibold leading-tight text-foreground">
                              {item.name}
                            </h4>
                            <p className="mt-0.5 text-[11px] text-muted-foreground">
                              {item.color}
                              {item.color && item.size ? " · " : ""}
                              {item.size}
                            </p>
                          </div>
                          <button
                            onClick={() => removeItem(item.productId, item.color, item.size)}
                            aria-label={`Remove ${item.name}`}
                            className="grid h-7 w-7 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>

                        <div className="mt-auto flex items-end justify-between pt-2">
                          <div className="flex items-center gap-1 rounded-full border border-border bg-background p-0.5">
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.color, item.size, item.quantity - 1)
                              }
                              aria-label="Decrease quantity"
                              className="grid h-7 w-7 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.productId, item.color, item.size, item.quantity + 1)
                              }
                              aria-label="Increase quantity"
                              className="grid h-7 w-7 place-items-center rounded-full text-foreground transition-colors hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <div className="text-right">
                            <p className="font-serif text-sm font-semibold text-primary">
                              {formatPrice(item.price * item.quantity)}
                            </p>
                            <p className="text-[10px] text-muted-foreground">
                              {formatPrice(item.price)} each
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.li>
                  );
                })}
              </AnimatePresence>
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-border bg-background px-5 py-4 space-y-3">
            {/* Coupon */}
            {appliedCoupon ? (
              <div className="flex items-center justify-between gap-2 rounded-full border border-emerald/30 bg-emerald/5 px-3 py-2">
                <div className="flex items-center gap-2 text-xs">
                  <Tag className="h-3.5 w-3.5 text-emerald" />
                  <span className="font-semibold text-emerald">{appliedCoupon.code}</span>
                  <span className="text-muted-foreground">applied · saved {formatPrice(discount)}</span>
                </div>
                <button
                  onClick={handleRemoveCoupon}
                  aria-label="Remove coupon"
                  className="grid h-6 w-6 place-items-center rounded-full text-emerald/70 transition-colors hover:bg-emerald/10 hover:text-emerald"
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ) : (
              <div className="flex gap-2">
                <Input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value)}
                  placeholder="Coupon code"
                  className="h-10 rounded-full border-border bg-background text-sm"
                  onKeyDown={(e) => e.key === "Enter" && handleApplyCoupon()}
                  aria-label="Enter coupon code"
                />
                <Button
                  onClick={handleApplyCoupon}
                  variant="outline"
                  className="h-10 rounded-full px-4 border-primary/30 text-primary hover:bg-primary/5"
                >
                  Apply
                </Button>
              </div>
            )}

            <div className="space-y-1 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal())}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                <span className="flex items-center gap-1 font-medium text-emerald">
                  <Truck className="h-3.5 w-3.5" /> Free
                </span>
              </div>
              <Separator className="my-2" />
              <div className="flex items-end justify-between">
                <span className="font-serif text-base font-semibold">Total</span>
                <span className="font-serif text-2xl font-bold text-primary">
                  {formatPrice(total)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2 pt-1">
              <Button
                onClick={handleCheckout}
                size="lg"
                className="h-12 rounded-full bg-primary text-primary-foreground hover:bg-primary/90 shadow-md"
              >
                Proceed to Checkout
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
              <Button
                onClick={handleWhatsAppOrder}
                size="lg"
                variant="outline"
                className="h-11 rounded-full border-emerald/40 text-emerald hover:bg-emerald/5"
              >
                <WhatsAppIcon className="mr-2 h-4 w-4" />
                Order on WhatsApp
              </Button>
            </div>
            <p className="text-center text-[10px] text-muted-foreground">
              Secure checkout · 7-day easy returns · Authenticity guaranteed
            </p>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
