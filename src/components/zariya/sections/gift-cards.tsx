"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Sparkles, Mail, Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { toast } from "sonner";

const DENOMINATIONS = [
  { value: 10000, label: "₹10,000", popular: false },
  { value: 25000, label: "₹25,000", popular: true },
  { value: 50000, label: "₹50,000", popular: false },
  { value: 100000, label: "₹1,00,000", popular: false },
];

const STEPS = [
  { icon: Gift, title: "Choose a denomination", desc: "Select from curated values or a custom amount." },
  { icon: Mail, title: "Add a personal note", desc: "Write a message in your own hand — we'll inscribe it." },
  { icon: Sparkles, title: "Delivered in luxury", desc: "Arrives in our heirloom ivory box, hand-sealed in gold." },
];

export function GiftCards() {
  const [selected, setSelected] = useState(25000);
  const [custom, setCustom] = useState("");

  const amount = custom ? Math.max(0, parseInt(custom, 10) || 0) : selected;

  const handlePurchase = () => {
    if (amount <= 0) {
      toast.error("Please choose or enter a gift card amount");
      return;
    }
    toast.success("Gift card added to bag", {
      description: `${formatPrice(amount)} · arrives in our heirloom box`,
    });
  };

  return (
    <section id="gift-cards" className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            The Art of Gifting
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            ZARIYA Gift Cards
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            For the woman who has everything — give her the choice of an heirloom.
            Each gift card arrives in our signature ivory box, hand-sealed in gold.
          </p>
        </motion.div>

        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — gift card visual */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex items-center"
          >
            {/* The gift card */}
            <div className="relative w-full">
              <motion.div
                whileHover={{ rotateY: -4, rotateX: 2 }}
                transition={{ type: "spring", stiffness: 200, damping: 20 }}
                className="relative aspect-[8/5] overflow-hidden rounded-3xl bg-gradient-to-br from-primary via-[hsl(352_60%_22%)] to-[hsl(280_30%_20%)] p-8 luxury-shadow-lg"
                style={{ transformStyle: "preserve-3d" }}
              >
                {/* decorative pattern */}
                <div className="pointer-events-none absolute inset-0 opacity-10">
                  <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full border-2 border-gold" />
                  <div className="absolute -right-4 -top-4 h-32 w-32 rounded-full border border-gold" />
                  <div className="absolute bottom-6 left-6 h-2 w-2 rounded-full bg-gold" />
                </div>

                <div className="relative flex h-full flex-col justify-between text-primary-foreground">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-serif text-2xl font-bold tracking-wide">ZARIYA</p>
                      <p className="text-[9px] uppercase tracking-[0.3em] text-gold">by IQRA</p>
                    </div>
                    <Gift className="h-6 w-6 text-gold" />
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-primary-foreground/60">
                      Gift Card Value
                    </p>
                    <motion.p
                      key={amount}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="font-serif text-4xl font-bold text-gold sm:text-5xl"
                    >
                      {formatPrice(amount)}
                    </motion.p>
                  </div>

                  <div className="flex items-end justify-between">
                    <p className="text-[10px] uppercase tracking-wider text-primary-foreground/50">
                      Timeless Kashmiri Elegance
                    </p>
                    <div className="flex gap-1">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-6 w-0.5 bg-gold/40" />
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* floating badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="absolute -right-3 -top-3 grid h-16 w-16 place-items-center rounded-full bg-gold text-primary luxury-shadow-lg sm:-right-5 sm:-top-5"
              >
                <Sparkles className="h-6 w-6" />
              </motion.div>
            </div>
          </motion.div>

          {/* Right — selector + steps */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Denominations */}
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Choose an amount
            </p>
            <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {DENOMINATIONS.map((d) => (
                <button
                  key={d.value}
                  onClick={() => {
                    setSelected(d.value);
                    setCustom("");
                  }}
                  className={cn(
                    "relative rounded-2xl border-2 px-3 py-4 text-center transition-all",
                    selected === d.value && !custom
                      ? "border-gold bg-gold/5 luxury-shadow"
                      : "border-border bg-card hover:border-gold/40"
                  )}
                >
                  {d.popular && (
                    <span className="absolute -top-2 left-1/2 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-primary-foreground">
                      Popular
                    </span>
                  )}
                  <span className="font-serif text-lg font-bold text-foreground">{d.label}</span>
                  {selected === d.value && !custom && (
                    <motion.span
                      layoutId="gift-check"
                      className="absolute right-1.5 top-1.5 grid h-4 w-4 place-items-center rounded-full bg-gold"
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </motion.span>
                  )}
                </button>
              ))}
            </div>

            {/* Custom amount */}
            <div className="mt-4">
              <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Or enter a custom amount (₹)
              </label>
              <input
                type="number"
                value={custom}
                onChange={(e) => setCustom(e.target.value)}
                placeholder="e.g. 15000"
                min={1000}
                step={500}
                className="mt-1.5 w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            {/* Purchase button */}
            <button
              onClick={handlePurchase}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.02] active:scale-95"
            >
              <Gift className="h-4 w-4" />
              Gift {formatPrice(amount)}
            </button>
            <p className="mt-2 text-center text-[11px] text-muted-foreground">
              No expiry · Redeemable on any piece · White-glove delivery included
            </p>

            {/* How it works */}
            <div className="mt-8 space-y-4 border-t border-border pt-6">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-foreground">
                How it works
              </h3>
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <div key={i} className="flex gap-3">
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary/5 text-primary">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        <span className="text-gold">{i + 1}.</span> {s.title}
                      </p>
                      <p className="text-xs text-muted-foreground">{s.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
