"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Package, MapPin, Heart, ShoppingBag, Star, Clock, CheckCircle2, Crown } from "lucide-react";
import { useCustomerAuth } from "@/store/use-customer-auth";
import { BRAND } from "@/data/catalog";
import { cn, formatPrice } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CustomerDashboardPage() {
  const { user, openAuth } = useCustomerAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [addresses, setAddresses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<"orders" | "addresses" | "wishlist">("orders");

  useEffect(() => {
    let cancelled = false;
    
    (async () => {
      try {
        const r = await fetch(`/api/orders/track?email=${encodeURIComponent(user.email)}`);
        if (r.ok) {
          const data = await r.json();
          if (data?.orders) setOrders(data.orders);
        }
        const ar = await fetch(`/api/customer?email=${encodeURIComponent(user.email)}`);
        if (ar.ok) {
          const adata = await ar.json();
          if (adata?.addresses) setAddresses(adata.addresses);
        }
      } catch {}
      
    })();
    return () => { cancelled = true; };
  }, [user]);

  if (!user) {
    return (
      <main className="grid min-h-screen place-items-center bg-background px-4">
        <div className="text-center">
          <Crown className="mx-auto h-12 w-12 text-gold" />
          <h1 className="mt-4 font-serif text-3xl font-bold">Sign in to view your dashboard</h1>
          <p className="mt-2 text-sm text-muted-foreground">Track orders, manage addresses & wishlist</p>
          <button onClick={() => openAuth("login")} className="mt-6 rounded-full bg-primary px-8 py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground">
            Sign In
          </button>
          <Link href="/" className="mt-4 block text-xs text-muted-foreground hover:text-gold">← Back to Storefront</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background py-8">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <Link href="/" className="mb-2 inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-gold">
              <ArrowLeft className="h-3 w-3" /> Storefront
            </Link>
            <h1 className="font-serif text-3xl font-bold">My Account</h1>
            <p className="text-sm text-muted-foreground">Welcome back, {user.name}!</p>
          </div>
          <div className="grid h-14 w-14 place-items-center rounded-full bg-gold/15">
            <span className="font-serif text-lg font-bold text-gold">{user.name.slice(0, 2).toUpperCase()}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-6 grid grid-cols-3 gap-3">
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <ShoppingBag className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 font-serif text-2xl font-bold">{orders.length}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Orders</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <MapPin className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 font-serif text-2xl font-bold">{addresses.length}</p>
            <p className="text-[10px] uppercase text-muted-foreground">Addresses</p>
          </div>
          <div className="rounded-2xl border border-border bg-card p-4 text-center">
            <Package className="mx-auto h-5 w-5 text-gold" />
            <p className="mt-2 font-serif text-2xl font-bold">₹{(orders.reduce((s, o) => s + (o.total || 0), 0) / 1000).toFixed(1)}K</p>
            <p className="text-[10px] uppercase text-muted-foreground">Total Spent</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-6 flex gap-2">
          {([
            ["orders", "My Orders", ShoppingBag],
            ["addresses", "Addresses", MapPin],
            ["wishlist", "Wishlist", Heart],
          ] as const).map(([id, label, Icon]) => (
            <button key={id} onClick={() => setTab(id)} className={cn("flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
              tab === id ? "bg-primary text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground")}>
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Orders */}
        {tab === "orders" && (
          <div className="space-y-3">
            {loading ? (
              <p className="text-center text-sm text-muted-foreground">Loading orders...</p>
            ) : orders.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
                <ShoppingBag className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No orders yet</p>
                <Link href="/store" className="mt-4 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase text-primary-foreground">Shop Now</Link>
              </div>
            ) : (
              orders.map((o, i) => (
                <motion.div key={o.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-mono text-sm font-semibold text-gold">{o.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{new Date(o.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" })}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-lg font-bold text-primary">{formatPrice(o.total)}</p>
                      <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase",
                        o.status === "DELIVERED" ? "bg-emerald/15 text-emerald" : o.status === "CANCELLED" ? "bg-destructive/15 text-destructive" : "bg-amber-500/15 text-amber-600")}>
                        {o.status}
                      </span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-border pt-3">
                    <p className="text-xs text-muted-foreground">{o.items?.length || 0} item(s) · {o.paymentMethod}</p>
                    <Link href="/track" className="text-xs font-semibold text-gold hover:underline">Track Order →</Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        {/* Addresses */}
        {tab === "addresses" && (
          <div className="space-y-3">
            {addresses.length === 0 ? (
              <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
                <MapPin className="h-10 w-10 text-muted-foreground/40" />
                <p className="mt-3 text-sm text-muted-foreground">No saved addresses</p>
                <p className="text-xs text-muted-foreground">Addresses are saved when you place an order</p>
              </div>
            ) : (
              addresses.map((addr, i) => (
                <div key={i} className="rounded-2xl border border-border bg-card p-4">
                  <p className="font-serif text-sm font-semibold">{addr.label || `Address ${i + 1}`}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{addr.line1}, {addr.city}, {addr.state} {addr.pincode}</p>
                </div>
              ))
            )}
          </div>
        )}

        {/* Wishlist */}
        {tab === "wishlist" && (
          <div className="grid place-items-center rounded-2xl border border-dashed border-border py-16 text-center">
            <Heart className="h-10 w-10 text-muted-foreground/40" />
            <p className="mt-3 text-sm text-muted-foreground">Your wishlist items</p>
            <Link href="/store" className="mt-4 rounded-full bg-primary px-6 py-2 text-xs font-semibold uppercase text-primary-foreground">Browse Collection</Link>
          </div>
        )}
      </div>
    </main>
  );
}
