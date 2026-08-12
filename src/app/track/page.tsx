"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  Search,
  Package,
  Truck,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  PackageCheck,
  Copy,
  Check,
} from "lucide-react";
import { BRAND } from "@/data/catalog";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "@/components/zariya/product-card";

interface TrackOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STEPS = [
  { key: "PENDING", label: "Order Placed", icon: Clock, desc: "We've received your order" },
  { key: "CONFIRMED", label: "Crafting", icon: PackageCheck, desc: "Artisans preparing your piece" },
  { key: "SHIPPED", label: "Dispatched", icon: Truck, desc: "On its way, white-glove" },
  { key: "DELIVERED", label: "Delivered", icon: CheckCircle2, desc: "Enjoyed, we hope" },
];

const STATUS_ORDER = ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED"];

export default function TrackPage() {
  const [orderInput, setOrderInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState<TrackOrder[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const lookup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setOrders(null);
    try {
      const params = new URLSearchParams();
      if (orderInput.trim()) params.set("order", orderInput.trim());
      if (emailInput.trim()) params.set("email", emailInput.trim());
      const res = await fetch(`/api/orders/track?${params.toString()}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setOrders(data.orders);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const copyOrderNumber = (n: string) => {
    navigator.clipboard.writeText(n);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero band */}
      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              Order Tracking
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Where is my heirloom?
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              Each ZARIYA piece is hand-prepared by our artisans before dispatch.
              Enter your order number or email to see its journey.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Lookup form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          onSubmit={lookup}
          className="rounded-3xl border border-border bg-card p-6 luxury-shadow sm:p-8"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Order Number
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  value={orderInput}
                  onChange={(e) => setOrderInput(e.target.value)}
                  placeholder="ZRY-20260812-XXXXXX"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-10 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                or Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  placeholder="you@email.com"
                  className="w-full rounded-xl border border-border bg-background px-4 py-2.5 pl-10 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || (!orderInput.trim() && !emailInput.trim())}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? "Searching…" : "Track My Order"}
          </button>
          <p className="mt-3 text-center text-[11px] text-muted-foreground">
            Tip: your order number was emailed to you at checkout. It begins with{" "}
            <span className="font-mono font-semibold text-gold">ZRY-</span>
          </p>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-center text-sm text-destructive"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <AnimatePresence>
          {orders && orders.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-8 space-y-6"
            >
              {orders.map((order, idx) => {
                const stepIdx = STATUS_ORDER.indexOf(order.status);
                const isCancelled = order.status === "CANCELLED";
                return (
                  <div
                    key={order.id}
                    className="overflow-hidden rounded-3xl border border-border bg-card luxury-shadow"
                  >
                    {/* Order header */}
                    <div className="flex flex-col gap-3 border-b border-border bg-primary/5 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => copyOrderNumber(order.orderNumber)}
                            className="font-mono text-sm font-bold text-gold transition-colors hover:text-primary"
                          >
                            {order.orderNumber}
                          </button>
                          <button
                            onClick={() => copyOrderNumber(order.orderNumber)}
                            aria-label="Copy order number"
                            className="text-muted-foreground hover:text-gold"
                          >
                            {copied ? <Check className="h-3.5 w-3.5 text-emerald" /> : <Copy className="h-3.5 w-3.5" />}
                          </button>
                        </div>
                        <p className="mt-1 font-serif text-lg font-semibold text-foreground">
                          {order.customerName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Placed{" "}
                          {new Date(order.createdAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}{" "}
                          · {order.paymentMethod}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] uppercase tracking-wide text-muted-foreground">Total</p>
                        <p className="font-serif text-2xl font-bold text-primary">{formatPrice(order.total)}</p>
                      </div>
                    </div>

                    {/* Progress tracker */}
                    <div className="p-6">
                      {isCancelled ? (
                        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-center">
                          <p className="font-serif text-lg font-semibold text-destructive">Order Cancelled</p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            This order was cancelled. Contact our concierge for assistance.
                          </p>
                        </div>
                      ) : (
                        <div className="relative">
                          {/* connecting line */}
                          <div className="absolute left-5 top-5 h-[calc(100%-2.5rem)] w-0.5 bg-border" />
                          <motion.div
                            className="absolute left-5 top-5 w-0.5 bg-gold"
                            initial={{ height: 0 }}
                            animate={{
                              height: `calc((100% - 2.5rem) * ${Math.max(0, stepIdx) / Math.max(1, STATUS_ORDER.length - 1)})`,
                            }}
                            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                          />
                          <div className="space-y-5">
                            {STEPS.map((step, i) => {
                              const Icon = step.icon;
                              const done = i <= stepIdx;
                              const active = i === stepIdx;
                              return (
                                <div key={step.key} className="relative flex items-start gap-4">
                                  <div
                                    className={cn(
                                      "relative z-10 grid h-10 w-10 flex-none place-items-center rounded-full border-2 transition-all",
                                      done
                                        ? "border-gold bg-gold text-primary"
                                        : "border-border bg-card text-muted-foreground",
                                      active && "ring-4 ring-gold/20"
                                    )}
                                  >
                                    <Icon className="h-4 w-4" />
                                  </div>
                                  <div className="pt-1.5">
                                    <p
                                      className={cn(
                                        "font-serif text-sm font-semibold",
                                        done ? "text-foreground" : "text-muted-foreground"
                                      )}
                                    >
                                      {step.label}
                                    </p>
                                    <p className="text-xs text-muted-foreground">{step.desc}</p>
                                    {active && (
                                      <p className="mt-1 text-[11px] font-medium text-gold">
                                        ← Current status
                                      </p>
                                    )}
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Items + shipping */}
                    <div className="grid gap-5 border-t border-border p-6 lg:grid-cols-2">
                      <div>
                        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Items ({order.items.length})
                        </h3>
                        <div className="space-y-3">
                          {order.items.map((item, i) => (
                            <div key={i} className="flex items-center gap-3">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="h-14 w-12 flex-none rounded-lg object-cover"
                              />
                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-medium text-foreground">{item.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {item.color} · {item.size} · × {item.quantity}
                                </p>
                              </div>
                              <p className="text-xs font-semibold text-foreground">
                                {formatPrice(item.price * item.quantity)}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h3 className="mb-3 font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                          Shipping To
                        </h3>
                        <div className="space-y-1.5 text-xs text-foreground/80">
                          <p className="flex items-start gap-2">
                            <MapPin className="mt-0.5 h-3.5 w-3.5 flex-none text-gold" />
                            <span>
                              {order.address}
                              <br />
                              {order.city}, {order.state} {order.pincode}
                              <br />
                              {order.country}
                            </span>
                          </p>
                          <p className="flex items-center gap-2 pt-1">
                            <Phone className="h-3.5 w-3.5 flex-none text-gold" /> {order.phone}
                          </p>
                          <p className="flex items-center gap-2">
                            <Mail className="h-3.5 w-3.5 flex-none text-gold" /> {order.email}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Footer CTA */}
                    <div className="flex flex-col gap-3 border-t border-border bg-muted/30 p-5 sm:flex-row sm:items-center sm:justify-between">
                      <p className="text-xs text-muted-foreground">
                        Need help with this order?
                      </p>
                      <a
                        href={whatsappLink(
                          BRAND.whatsapp,
                          `Namaste! I'm enquiring about my order ${order.orderNumber}.`
                        )}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 rounded-full bg-emerald px-4 py-2 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
                      >
                        <WhatsAppIcon className="h-3.5 w-3.5" /> WhatsApp Concierge
                      </a>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty hint */}
        {!orders && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border bg-muted/20 py-16 text-center"
          >
            <Package className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-serif text-lg font-semibold text-muted-foreground">
              Your order journey awaits
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Enter your order number above to see its status — from artisan's
              needle to your doorstep.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}
