"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PRODUCTS } from "@/data/catalog";
import { ProductCard } from "@/components/zariya/product-card";

export default function NewArrivals() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const items = PRODUCTS.filter((p) => p.newArrival);

  const scroll = (dir: -1 | 1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const amount = Math.min(el.clientWidth * 0.85, 720);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <section
      aria-label="New arrivals"
      className="relative overflow-hidden bg-gradient-to-b from-background to-muted/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-6 bg-gold/60" />
              New Arrivals
            </span>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
              Just landed in the atelier
            </h2>
          </motion.div>

          <div className="hidden gap-3 sm:flex">
            <button
              onClick={() => scroll(-1)}
              aria-label="Previous"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition-all hover:scale-110 hover:bg-gold hover:text-charcoal"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => scroll(1)}
              aria-label="Next"
              className="grid h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold transition-all hover:scale-110 hover:bg-gold hover:text-charcoal"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div
          ref={scrollerRef}
          className="hide-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 scrollbar-lux"
        >
          {items.map((p, i) => (
            <div
              key={p.id}
              className="w-[78vw] shrink-0 snap-start sm:w-[340px] lg:w-[300px] xl:w-[280px]"
            >
              <ProductCard product={p} index={i} />
            </div>
          ))}
        </div>

        {/* Mobile scroll hint */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground sm:hidden">
          <span>Swipe to explore</span>
          <ChevronRight className="h-4 w-4" />
        </div>
      </div>
    </section>
  );
}
