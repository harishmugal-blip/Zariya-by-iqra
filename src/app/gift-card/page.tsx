"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Gift,
  Search,
  Wallet,
  Calendar,
  TrendingDown,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

interface BalanceResult {
  code: string;
  balance: number;
  initial: number;
  expiresAt: string;
  status: "ACTIVE" | "REDEEMED" | "EXPIRED";
  redeemed: number;
}

const STATUS_STYLES: Record<string, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  ACTIVE: { label: "Active", className: "bg-emerald/15 text-emerald border-emerald/30", icon: CheckCircle2 },
  REDEEMED: { label: "Fully Redeemed", className: "bg-amber-100 text-amber-700 border-amber-200", icon: XCircle },
  EXPIRED: { label: "Expired", className: "bg-destructive/10 text-destructive border-destructive/30", icon: XCircle },
};

const DEMO_CODES = ["ZRY-GC-10001", "ZRY-GC-25001", "ZRY-GC-50001"];

export default function GiftCardPage() {
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const check = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(`/api/gift-card/balance?code=${encodeURIComponent(code.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Something went wrong.");
      } else {
        setResult(data);
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const status = result ? STATUS_STYLES[result.status] : null;
  const StatusIcon = status?.icon;

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              Gift Card
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-5xl">
              Check Your Balance
            </h1>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              Enter your ZARIYA gift card code to see the remaining balance,
              redemption history, and expiry. Heirloom credit, at your fingertips.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-2xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Lookup form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: EASE }}
          onSubmit={check}
          className="rounded-3xl border border-border bg-card p-6 luxury-shadow sm:p-8"
        >
          <div>
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Gift Card Code
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="ZRY-GC-XXXXX"
                className="w-full rounded-xl border border-border bg-background px-4 py-3 pl-10 text-sm uppercase tracking-wider outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || !code.trim()}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Checking…
              </>
            ) : (
              <>
                <Gift className="h-4 w-4" /> Check Balance
              </>
            )}
          </button>

          {/* Demo codes */}
          <div className="mt-4">
            <p className="text-center text-[11px] text-muted-foreground">
              Try a demo code:{" "}
              {DEMO_CODES.map((c, i) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCode(c)}
                  className="font-mono font-semibold text-gold underline-offset-2 hover:underline"
                >
                  {c}
                  {i < DEMO_CODES.length - 1 ? ", " : ""}
                </button>
              ))}
            </p>
          </div>
        </motion.form>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="mt-6 flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-4 text-sm text-destructive"
            >
              <XCircle className="h-5 w-5 flex-none" />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Result */}
        <AnimatePresence>
          {result && status && StatusIcon && (
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="mt-8 overflow-hidden rounded-3xl border border-border bg-card luxury-shadow"
            >
              {/* Header */}
              <div className="relative overflow-hidden bg-gradient-to-br from-primary via-[hsl(352_60%_22%)] to-[hsl(280_30%_20%)] p-6 text-primary-foreground">
                <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full border-2 border-gold/20" />
                <div className="pointer-events-none absolute -right-2 -top-2 h-20 w-20 rounded-full border border-gold/30" />
                <div className="relative flex items-start justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-gold">
                      ZARIYA Gift Card
                    </p>
                    <p className="mt-1 font-mono text-lg font-bold tracking-wider">
                      {result.code}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide",
                      status.className
                    )}
                  >
                    <StatusIcon className="h-3 w-3" />
                    {status.label}
                  </span>
                </div>
                <div className="relative mt-6">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60">
                    Available Balance
                  </p>
                  <p className="font-serif text-4xl font-bold text-gold sm:text-5xl">
                    {formatPrice(result.balance)}
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="divide-y divide-border">
                <DetailRow
                  icon={Wallet}
                  label="Initial Value"
                  value={formatPrice(result.initial)}
                />
                <DetailRow
                  icon={TrendingDown}
                  label="Redeemed So Far"
                  value={formatPrice(result.redeemed)}
                  valueClass="text-amber-600"
                />
                <DetailRow
                  icon={Calendar}
                  label="Valid Until"
                  value={new Date(result.expiresAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                />
              </div>

              {/* CTA */}
              <div className="border-t border-border bg-muted/30 p-5 text-center">
                <p className="text-xs text-muted-foreground">
                  {result.status === "ACTIVE"
                    ? "Use this code at checkout to redeem your balance."
                    : result.status === "REDEEMED"
                    ? "This gift card has been fully redeemed. Thank you for choosing ZARIYA."
                    : "This gift card has expired. Contact our concierge for assistance."}
                </p>
                {result.status === "ACTIVE" && result.balance > 0 && (
                  <Link
                    href="/"
                    className="mt-3 inline-block rounded-full bg-primary px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95"
                  >
                    Shop with This Card
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Empty state */}
        {!result && !error && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-10 grid place-items-center rounded-3xl border border-dashed border-border bg-muted/20 py-16 text-center"
          >
            <Gift className="h-12 w-12 text-muted-foreground/40" />
            <p className="mt-3 font-serif text-lg font-semibold text-muted-foreground">
              Your balance awaits
            </p>
            <p className="mt-1 max-w-xs text-xs text-muted-foreground">
              Enter your 14-character gift card code above to check your
              remaining balance and redemption history.
            </p>
          </motion.div>
        )}
      </section>
    </main>
  );
}

function DetailRow({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="flex items-center justify-between px-5 py-3.5">
      <div className="flex items-center gap-2.5">
        <Icon className="h-4 w-4 text-gold" />
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
      </div>
      <span className={cn("font-serif text-sm font-semibold text-foreground", valueClass)}>
        {value}
      </span>
    </div>
  );
}
