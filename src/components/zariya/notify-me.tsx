"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Mail, Check, Loader2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type NotifyType = "BACK_IN_STOCK" | "PRICE_DROP";

export function NotifyMe({
  productSlug,
  productName,
  type,
  currentPrice,
  stock,
  className,
}: {
  productSlug: string;
  productName: string;
  type: NotifyType;
  currentPrice?: number;
  stock?: number;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/notify-me", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email.trim(),
          phone: phone.trim() || undefined,
          productSlug,
          productName,
          type,
          threshold: type === "PRICE_DROP" ? currentPrice : undefined,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Something went wrong");
        return;
      }
      setDone(true);
      toast.success(data.message || "Subscribed!", {
        description: data.alreadySubscribed
          ? "You were already on the list."
          : undefined,
      });
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setOpen(false);
    setDone(false);
    setEmail("");
    setPhone("");
  };

  const isBackInStock = type === "BACK_IN_STOCK";
  const label = isBackInStock ? "Notify Me When Available" : "Notify Me on Sale";
  const icon = isBackInStock ? Bell : Bell;

  if (!open && !done) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "flex items-center justify-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-4 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary transition-all hover:bg-gold hover:text-primary-foreground",
          className
        )}
      >
        <Bell className="h-3.5 w-3.5" />
        {label}
      </button>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {done ? (
        <motion.div
          key="done"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className={cn(
            "flex items-center gap-3 rounded-2xl border border-emerald/30 bg-emerald/5 p-4",
            className
          )}
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
            className="grid h-9 w-9 flex-none place-items-center rounded-full bg-emerald/15"
          >
            <Check className="h-5 w-5 text-emerald" />
          </motion.div>
          <div className="min-w-0 flex-1">
            <p className="font-serif text-sm font-semibold text-foreground">
              You're on the list
            </p>
            <p className="text-xs text-muted-foreground">
              {isBackInStock
                ? "We'll email you the moment this piece returns."
                : "We'll email you if this piece goes on sale."}
            </p>
          </div>
          <button
            onClick={reset}
            aria-label="Dismiss"
            className="grid h-7 w-7 flex-none place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </motion.div>
      ) : (
        <motion.div
          key="form"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className={cn("overflow-hidden rounded-2xl border border-gold/30 bg-gold/5 p-4", className)}
        >
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-gold" />
              <p className="font-serif text-sm font-semibold text-foreground">
                {isBackInStock ? "Back-in-stock alert" : "Price-drop alert"}
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              aria-label="Close"
              className="grid h-6 w-6 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="WhatsApp number (optional)"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-primary py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-3.5 w-3.5 animate-spin" /> Subscribing…
                </>
              ) : (
                <>
                  <Bell className="h-3.5 w-3.5" /> Subscribe to Alert
                </>
              )}
            </button>
          </form>
          <p className="mt-2 text-center text-[10px] text-muted-foreground">
            We respect your privacy. One email when it happens. No spam.
          </p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
