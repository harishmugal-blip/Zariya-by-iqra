"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { CATEGORIES } from "@/data/catalog";
import { cn } from "@/lib/utils";

const container = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
const item = {
  hidden: { opacity: 0, y: 28 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

export default function Categories() {
  const scrollToShop = () => {
    const el = document.getElementById("shop");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section
      id="collections"
      aria-label="Featured collections"
      className="relative bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center md:mb-16"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            Explore
            <span className="h-px w-6 bg-gold/60" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            The Collections
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Five curated worlds of Kashmiri craft — from heirloom pherans to whisper-light pashmina.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-5"
        >
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.id}
              variants={item}
              onClick={scrollToShop}
              className={cn(
                "group relative block overflow-hidden rounded-2xl bg-card text-left luxury-shadow transition-all duration-500 hover:-translate-y-1.5 hover:luxury-shadow-lg",
                i === 0 && "col-span-2 md:col-span-1"
              )}
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={cat.image}
                  alt={cat.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.08]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-90 transition-opacity duration-500 group-hover:from-primary group-hover:via-primary/40" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                  {cat.productCount} pieces
                </p>
                <h3 className="font-serif text-lg font-semibold leading-snug text-ivory md:text-xl">
                  {cat.name}
                </h3>
                <p className="mt-1 line-clamp-2 text-[11px] text-ivory/75 md:text-xs">
                  {cat.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.15em] text-gold opacity-0 transition-all duration-500 group-hover:opacity-100">
                  Explore <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.button>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
