"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { COLLECTIONS } from "@/data/catalog";
import { cn } from "@/lib/utils";

export default function LuxuryCollection() {
  return (
    <section
      aria-label="Luxury collections"
      className="relative bg-primary py-20 text-ivory md:py-28"
    >
      {/* Decorative gold border line top */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-16 max-w-2xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            The Capsule Lines
            <span className="h-px w-6 bg-gold/60" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl md:text-5xl">
            Three Worlds of ZARIYA
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/70 md:text-base">
            Each capsule tells its own chapter of the Kashmir story — from the burgundy of royal courts
            to the midnight shimmer of celebration evenings.
          </p>
        </motion.div>

        <div className="flex flex-col gap-16 md:gap-24">
          {COLLECTIONS.map((col, i) => {
            const reversed = i % 2 === 1;
            return (
              <motion.article
                key={col.id}
                initial={{ opacity: 0, y: 36 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className={cn(
                  "grid items-center gap-8 md:grid-cols-2 md:gap-12 lg:gap-16",
                  reversed && "md:[direction:rtl]"
                )}
              >
                {/* Image */}
                <div className="group relative overflow-hidden rounded-2xl luxury-shadow [direction:ltr]">
                  <div className="aspect-[4/5] overflow-hidden md:aspect-[3/4]">
                    <img
                      src={col.image}
                      alt={col.name}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1500ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 via-transparent to-transparent" />
                  <div className="absolute left-5 top-5 rounded-full border border-gold/40 bg-primary/40 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold backdrop-blur-md">
                    Capsule 0{i + 1}
                  </div>
                </div>

                {/* Text */}
                <div className={cn("[direction:ltr]", reversed ? "md:text-left" : "md:text-left")}>
                  <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                    {col.tagline}
                  </p>
                  <h3 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl md:text-5xl">
                    {col.name}
                  </h3>
                  <p className="mt-5 max-w-md text-sm text-ivory/75 md:text-base">
                    {col.description}
                  </p>
                  <a
                    href="#shop"
                    className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-gold transition-colors hover:text-champagne"
                  >
                    Discover Collection
                    <span className="grid h-9 w-9 place-items-center rounded-full border border-gold/40 transition-all group-hover:bg-gold group-hover:text-charcoal">
                      <ArrowRight className="h-4 w-4" />
                    </span>
                  </a>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>

      <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
    </section>
  );
}
