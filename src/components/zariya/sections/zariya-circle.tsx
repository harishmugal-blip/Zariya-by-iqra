"use client";

import { motion } from "framer-motion";
import { Crown, Gem, Sparkles, Award, Check } from "lucide-react";
import { cn } from "@/lib/utils";

const TIERS = [
  {
    name: "Sahiba",
    tagline: "The Muse",
    icon: Sparkles,
    spend: "Join free",
    color: "from-slate-400/20 to-slate-300/5",
    border: "border-slate-300/40",
    iconColor: "text-slate-500",
    benefits: [
      "Welcome ₹2,000 voucher",
      "Early access to new arrivals",
      "Birthday surprise gift",
      "Insider artisan stories",
    ],
  },
  {
    name: "Begum",
    tagline: "The Patron",
    icon: Gem,
    spend: "Spend ₹1,00,000+",
    color: "from-gold/20 to-champagne/5",
    border: "border-gold/50",
    iconColor: "text-gold",
    featured: true,
    benefits: [
      "Everything in Sahiba",
      "5% back on every order",
      "Complimentary made-to-measure consult",
      "Priority white-glove delivery",
      "Private sale invitations",
    ],
  },
  {
    name: "Maharani",
    tagline: "The Connoisseur",
    icon: Crown,
    spend: "Spend ₹5,00,000+",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/40",
    iconColor: "text-primary",
    benefits: [
      "Everything in Begum",
      "10% back on every order",
      "Dedicated personal concierge",
      "Annual heirloom gift (worth ₹25,000)",
      "Invitation to Kashmir atelier visit",
      "First access to Limited Edition pieces",
    ],
  },
];

export function ZariyaCircle() {
  return (
    <section id="loyalty" className="relative overflow-hidden bg-gradient-to-b from-background to-muted/30 py-20 sm:py-28">
      {/* decorative */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            <Award className="h-3.5 w-3.5" /> Membership
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            The Zariya Circle
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            A circle of women who collect beauty. Earn rewards, unlock privileges,
            and become part of a community that values craft over speed — and
            heritage over hype.
          </p>
        </motion.div>

        {/* Tiers */}
        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {TIERS.map((tier, i) => {
            const Icon = tier.icon;
            return (
              <motion.div
                key={tier.name}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -6 }}
                className={cn(
                  "relative overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-7",
                  tier.color,
                  tier.border,
                  tier.featured && "lg:-mt-4 lg:mb-4"
                )}
              >
                {tier.featured && (
                  <div className="absolute right-5 top-5 rounded-full bg-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-primary">
                    Most Loved
                  </div>
                )}

                <div className={cn("inline-grid h-14 w-14 place-items-center rounded-2xl bg-background/60", tier.iconColor)}>
                  <Icon className="h-7 w-7" />
                </div>

                <h3 className="mt-4 font-serif text-3xl font-bold text-foreground">{tier.name}</h3>
                <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground">
                  {tier.tagline}
                </p>
                <p className="mt-1 text-sm font-semibold text-gold">{tier.spend}</p>

                <div className="my-6 h-px bg-border" />

                <ul className="space-y-3">
                  {tier.benefits.map((b, bi) => (
                    <li key={bi} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <span className={cn("mt-0.5 grid h-4 w-4 flex-none place-items-center rounded-full", tier.iconColor)}>
                        <Check className="h-3 w-3" />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>

                <button
                  className={cn(
                    "mt-7 w-full rounded-full py-2.5 text-xs font-semibold uppercase tracking-wide transition-all",
                    tier.featured
                      ? "bg-primary text-primary-foreground hover:scale-[1.02]"
                      : "border border-border text-foreground hover:border-gold/50 hover:text-gold"
                  )}
                >
                  {tier.name === "Sahiba" ? "Join Free" : `Discover ${tier.name}`}
                </button>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center text-xs text-muted-foreground"
        >
          Membership is complimentary. Rewards never expire. Tiers are reviewed
          annually based on lifetime spend.
        </motion.p>
      </div>
    </section>
  );
}
