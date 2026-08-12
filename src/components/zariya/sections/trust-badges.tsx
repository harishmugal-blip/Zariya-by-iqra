"use client";

import { motion } from "framer-motion";
import {
  ShieldCheck,
  Truck,
  RefreshCw,
  BadgeCheck,
  Sparkles,
  Lock,
} from "lucide-react";

const EASE = [0.22, 1, 0.36, 1] as const;

const BADGES = [
  {
    icon: BadgeCheck,
    title: "Authenticity Guaranteed",
    desc: "Certificate with every piece",
  },
  {
    icon: Truck,
    title: "White-Glove Delivery",
    desc: "Complimentary, worldwide",
  },
  {
    icon: RefreshCw,
    title: "7-Day Easy Returns",
    desc: "No questions, only care",
  },
  {
    icon: Lock,
    title: "Secure Checkout",
    desc: "256-bit encrypted · COD & UPI",
  },
  {
    icon: Sparkles,
    title: "Handcrafted in Kashmir",
    desc: "By 40+ master artisans",
  },
  {
    icon: ShieldCheck,
    title: "Lifetime Repair",
    desc: "We mend what we make",
  },
];

export function TrustBadges() {
  return (
    <section className="border-y border-border bg-card/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 divide-x divide-y divide-border sm:grid-cols-3 sm:divide-y-0 lg:grid-cols-6">
          {BADGES.map((b, i) => {
            const Icon = b.icon;
            return (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                className="group flex flex-col items-center gap-2 px-3 py-6 text-center transition-colors hover:bg-gold/[0.03]"
              >
                <div className="grid h-11 w-11 place-items-center rounded-full bg-primary/5 text-primary transition-all duration-300 group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-serif text-xs font-semibold leading-tight text-foreground">
                    {b.title}
                  </p>
                  <p className="mt-0.5 text-[10px] leading-tight text-muted-foreground">
                    {b.desc}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
