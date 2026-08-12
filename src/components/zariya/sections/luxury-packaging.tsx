"use client";

import { motion } from "framer-motion";
import {
  Package,
  Gift,
  Award,
  BadgeCheck,
  Mail,
  Truck,
  Sparkles,
} from "lucide-react";
import { PACKAGING_FEATURES } from "@/data/catalog";

const ICONS: Record<string, React.ComponentType<{ className?: string }>> = {
  Package,
  Gift,
  Award,
  BadgeCheck,
  Mail,
  Truck,
};

export function LuxuryPackaging() {
  return (
    <section id="packaging" className="relative overflow-hidden bg-background py-20 sm:py-28">
      {/* subtle gold top divider */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
          {/* Left — image with floating badge */}
          <motion.div
            initial={{ opacity: 0, x: -32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative aspect-[4/5] overflow-hidden rounded-3xl luxury-shadow">
              <img
                src="/images/lifestyle/packaging.png"
                alt="Luxury ZARIYA gift packaging"
                loading="lazy"
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
            </div>

            {/* floating wax seal badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
              whileInView={{ opacity: 1, scale: 1, rotate: -8 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="absolute -right-3 top-8 grid h-24 w-24 place-items-center rounded-full bg-primary text-center text-primary-foreground luxury-shadow-lg sm:-right-6 sm:h-28 sm:w-28"
            >
              <div className="flex flex-col items-center">
                <Sparkles className="mb-0.5 h-4 w-4 text-gold" />
                <span className="font-serif text-[10px] font-bold uppercase leading-tight tracking-wider">
                  Hand
                  <br />
                  Sealed
                </span>
              </div>
            </motion.div>

            {/* floating ribbon note */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="absolute -bottom-4 left-6 rounded-2xl glass luxury-shadow px-5 py-3"
            >
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                The Unboxing
              </p>
              <p className="font-serif text-sm font-semibold text-primary">
                An experience, not a parcel.
              </p>
            </motion.div>
          </motion.div>

          {/* Right — copy + features grid */}
          <motion.div
            initial={{ opacity: 0, x: 32 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col justify-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              The Presentation
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Luxury Packaging,
              <br />
              <span className="gold-text">Worth the Wait.</span>
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Every ZARIYA piece arrives as a gift — to yourself, or to someone
              you treasure. We wrap each order by hand, the way a Kashmiri
              atelier has wrapped heirlooms for two centuries. Unboxing a ZARIYA
              piece is the beginning of its story.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {PACKAGING_FEATURES.map((f, i) => {
                const Icon = ICONS[f.icon] || Package;
                return (
                  <motion.div
                    key={f.id}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.5,
                      delay: 0.1 + i * 0.07,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    className="group rounded-2xl border border-border bg-card p-4 transition-all duration-300 hover:border-gold/40 hover:luxury-shadow"
                  >
                    <div className="mb-3 inline-grid h-10 w-10 place-items-center rounded-xl bg-primary/5 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-serif text-base font-semibold text-foreground">
                      {f.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      {f.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
