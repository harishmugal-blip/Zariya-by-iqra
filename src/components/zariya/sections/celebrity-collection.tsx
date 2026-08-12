"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { CELEBRITIES } from "@/data/catalog";
import { useUI } from "@/store/use-ui";
import { cn } from "@/lib/utils";
import { Stars } from "@/components/zariya/stars";

export function CelebrityCollection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const openProduct = useUI((s) => s.openProduct);

  const scrollTo = (dir: "prev" | "next") => {
    const el = scrollRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-card]");
    const step = card ? card.offsetWidth + 24 : 400;
    el.scrollBy({ left: dir === "next" ? step : -step, behavior: "smooth" });
  };

  const onSelect = (i: number) => {
    setActive(i);
    const el = scrollRef.current;
    if (!el) return;
    const child = el.children[i] as HTMLElement | undefined;
    if (child) el.scrollTo({ left: child.offsetLeft - 24, behavior: "smooth" });
  };

  return (
    <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
      {/* decorative gold orbs */}
      <div className="pointer-events-none absolute -left-24 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" aria-hidden />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col items-center text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            As Worn By
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold sm:text-5xl lg:text-6xl">
            The Celebrity Collection
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
            Worn on the red carpet, at Cannes, and in the private wardrobes of
            women who shape culture. The pieces they chose — and why.
          </p>
        </motion.div>

        {/* Carousel */}
        <div className="relative mt-12">
          {/* nav buttons */}
          <button
            onClick={() => scrollTo("prev")}
            aria-label="Previous celebrity"
            className="absolute -left-2 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full glass-dark border border-gold/40 p-2.5 text-gold transition-all hover:scale-110 hover:bg-gold hover:text-primary lg:grid"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => scrollTo("next")}
            aria-label="Next celebrity"
            className="absolute -right-2 top-1/2 z-10 hidden -translate-y-1/2 place-items-center rounded-full glass-dark border border-gold/40 p-2.5 text-gold transition-all hover:scale-110 hover:bg-gold hover:text-primary lg:grid"
          >
            <ChevronRight className="h-5 w-5" />
          </button>

          <div
            ref={scrollRef}
            onScroll={(e) => {
              const el = e.currentTarget;
              const cards = Array.from(el.children) as HTMLElement[];
              const center = el.scrollLeft + el.offsetWidth / 2;
              let best = 0;
              let bestDist = Infinity;
              cards.forEach((c, i) => {
                const cCenter = c.offsetLeft + c.offsetWidth / 2;
                const d = Math.abs(cCenter - center);
                if (d < bestDist) {
                  bestDist = d;
                  best = i;
                }
              });
              setActive(best);
            }}
            className="hide-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto pb-4"
          >
            {CELEBRITIES.map((cel, i) => (
              <article
                data-card
                key={cel.id}
                className={cn(
                  "group relative w-[300px] flex-none snap-center overflow-hidden rounded-3xl border transition-all duration-500 sm:w-[360px]",
                  active === i
                    ? "border-gold/60 luxury-shadow-lg"
                    : "border-white/10 opacity-70 hover:opacity-100"
                )}
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  <img
                    src={cel.image}
                    alt={cel.name}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
                  <Quote className="absolute right-5 top-5 h-10 w-10 text-gold/40" />

                  {/* content overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
                      {cel.role}
                    </p>
                    <h3 className="mt-1 font-serif text-2xl font-bold text-primary-foreground">
                      {cel.name}
                    </h3>
                    <Stars rating={5} size={14} className="mt-2" />
                  </div>
                </div>

                {/* quote + product */}
                <div className="bg-card p-6 text-card-foreground">
                  <p className="font-serif text-base italic leading-relaxed text-foreground/90">
                    &ldquo;{cel.quote}&rdquo;
                  </p>
                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-border pt-4">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Wearing
                      </p>
                      <p className="font-serif text-sm font-semibold text-primary">
                        {cel.productName}
                      </p>
                    </div>
                    <button
                      onClick={() => openProduct(cel.productSlug)}
                      className="rounded-full bg-primary px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:bg-primary/90 hover:scale-105 active:scale-95"
                    >
                      View Piece
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* dots */}
          <div className="mt-6 flex justify-center gap-2">
            {CELEBRITIES.map((_, i) => (
              <button
                key={i}
                onClick={() => onSelect(i)}
                aria-label={`Go to celebrity ${i + 1}`}
                className={cn(
                  "h-2 rounded-full transition-all duration-300",
                  active === i ? "w-8 bg-gold" : "w-2 bg-white/30 hover:bg-white/50"
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
