"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Gift, Copy, Check, Share2, Users, IndianRupee, Sparkles } from "lucide-react";
import { cn, whatsappLink } from "@/lib/utils";
import { BRAND } from "@/data/catalog";
import { WhatsAppIcon } from "@/components/zariya/product-card";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

const HOW_IT_WORKS = [
  {
    icon: Share2,
    step: "01",
    title: "Share Your Code",
    desc: "Send your unique ZARIYA referral code to friends who appreciate true craft.",
  },
  {
    icon: Users,
    step: "02",
    title: "They Shop",
    desc: "Your friend receives ₹2,000 off their first order of any heirloom piece.",
  },
  {
    icon: IndianRupee,
    step: "03",
    title: "You Earn",
    desc: "When their order ships, you receive ₹2,000 in store credit — no limits.",
  },
];

const PERKS = [
  { value: "₹2,000", label: "Per friend referred" },
  { value: "Unlimited", label: "Referrals per year" },
  { value: "12 months", label: "Credit validity" },
  { value: "₹2,000", label: "Friend's first discount" },
];

export function ReferAndEarn() {
  const [code] = useState(() => {
    // Generate a stable pseudo-random code
    const adj = ["NOOR", "ROOH", "DIL", "ZEBA", "SAHIB", "GUL"];
    const n = Math.floor(100 + Math.random() * 900);
    return `${adj[Math.floor(Math.random() * adj.length)]}${n}`;
  });
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    toast.success("Referral code copied", {
      description: "Share it with someone you love.",
    });
    setTimeout(() => setCopied(false), 2500);
  };

  const shareWhatsApp = () => {
    const msg = `Namaste! I'm sharing my ZARIYA by IQRA referral code: *${code}*\n\nUse it at checkout for ₹2,000 off your first handcrafted Kashmiri heirloom. ✨\n\nShop at ${typeof window !== "undefined" ? window.location.origin : "zariya.com"}`;
    window.open(whatsappLink(BRAND.whatsapp, msg), "_blank");
  };

  return (
    <section id="refer" className="relative overflow-hidden bg-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Left — copy + steps */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              <Gift className="h-3.5 w-3.5" /> Refer &amp; Earn
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Share the Heritage.
              <br />
              <span className="gold-text">Earn the Rewards.</span>
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              The most meaningful luxuries are shared. Introduce a friend to
              ZARIYA, and you both receive ₹2,000 — towards heirlooms that will
              outlast you both.
            </p>

            {/* Referral code card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: EASE }}
              className="mt-8 overflow-hidden rounded-3xl border border-gold/30 bg-gradient-to-br from-gold/10 via-card to-card p-6 luxury-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                    Your Referral Code
                  </p>
                  <p className="mt-1 font-mono text-3xl font-bold tracking-wider text-foreground">
                    {code}
                  </p>
                </div>
                <Sparkles className="h-8 w-8 text-gold/40" />
              </div>

              <div className="mt-5 flex gap-2">
                <button
                  onClick={copyCode}
                  className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary py-3 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.02] active:scale-95"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4 text-emerald" /> Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Code
                    </>
                  )}
                </button>
                <button
                  onClick={shareWhatsApp}
                  aria-label="Share on WhatsApp"
                  className="grid h-12 w-12 flex-none place-items-center rounded-full bg-emerald text-white transition-all hover:scale-105 active:scale-95"
                >
                  <WhatsAppIcon className="h-5 w-5" />
                </button>
              </div>
            </motion.div>

            {/* How it works */}
            <div className="mt-8 space-y-4">
              <h3 className="font-serif text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                How it works
              </h3>
              {HOW_IT_WORKS.map((s, i) => {
                const Icon = s.icon;
                return (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + i * 0.1, ease: EASE }}
                    className="flex items-start gap-4"
                  >
                    <div className="relative grid h-12 w-12 flex-none place-items-center rounded-2xl bg-primary/5">
                      <Icon className="h-5 w-5 text-primary" />
                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-gold text-[9px] font-bold text-primary">
                        {s.step}
                      </span>
                    </div>
                    <div className="pt-1">
                      <p className="font-serif text-sm font-semibold text-foreground">
                        {s.title}
                      </p>
                      <p className="text-xs leading-relaxed text-muted-foreground">
                        {s.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>

          {/* Right — perks + visual */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: EASE }}
            className="flex flex-col justify-center"
          >
            {/* Perks grid */}
            <div className="grid grid-cols-2 gap-4">
              {PERKS.map((p, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: EASE }}
                  className="rounded-2xl border border-border bg-card p-5 text-center transition-shadow hover:luxury-shadow"
                >
                  <p className="font-serif text-3xl font-bold gold-text">{p.value}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">
                    {p.label}
                  </p>
                </motion.div>
              ))}
            </div>

            {/* Testimonial-style highlight */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: EASE }}
              className="mt-6 rounded-3xl bg-primary p-7 text-primary-foreground"
            >
              <p className="font-serif text-lg italic leading-relaxed text-primary-foreground/90">
                &ldquo;I've referred 12 friends to ZARIYA. Not for the credit —
                but because I genuinely cannot keep this beauty to myself. The
                credit is just the cherry on a very beautiful cake.&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-gold font-serif text-sm font-bold text-primary">
                  AK
                </div>
                <div>
                  <p className="font-serif text-sm font-semibold text-gold">Ayesha K.</p>
                  <p className="text-[11px] text-primary-foreground/60">
                    ZARIYA Circle · Begum Tier
                  </p>
                </div>
              </div>
            </motion.div>

            <p className="mt-6 text-center text-[11px] text-muted-foreground">
              Credits apply automatically at checkout · No expiry on earned
              credits for Begum &amp; Maharani members
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
