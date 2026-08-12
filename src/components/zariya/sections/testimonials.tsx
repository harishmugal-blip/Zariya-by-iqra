"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { TESTIMONIALS, BRAND } from "@/data/catalog";
import { Stars } from "@/components/zariya/stars";
import { cn, initials } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";

export default function Testimonials() {
  const [api, setApi] = useState<CarouselApi>();
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setActive(api.selectedScrollSnap());
    api.on("select", onSelect);
    onSelect();
    const t = setInterval(() => api.scrollNext(), 6000);
    return () => {
      api.off("select", onSelect);
      clearInterval(t);
    };
  }, [api]);

  const others = TESTIMONIALS.slice(1);

  return (
    <section
      aria-label="Testimonials"
      className="relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            Kind Words
            <span className="h-px w-6 bg-gold/60" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            Loved by Women Worldwide
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            From Mumbai to London, Singapore to Dubai — here is what our community of women say
            about their ZARIYA pieces.
          </p>
        </motion.div>

        {/* Featured carousel */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mb-16"
        >
          <Carousel setApi={setApi} opts={{ loop: true, align: "center" }} className="w-full">
            <CarouselContent>
              {TESTIMONIALS.map((t) => (
                <CarouselItem key={t.id}>
                  <div className="mx-auto max-w-3xl">
                    <div className="relative overflow-hidden rounded-3xl border border-gold/15 bg-card p-8 text-center luxury-shadow sm:p-12 md:p-16">
                      <Quote className="mx-auto mb-6 h-10 w-10 text-gold/40" />
                      <Stars rating={t.rating} size={18} className="justify-center" />
                      <p className="mx-auto mt-6 max-w-2xl font-serif text-xl leading-relaxed text-foreground sm:text-2xl md:text-3xl">
                        “{t.text}”
                      </p>
                      <div className="mt-8 flex flex-col items-center">
                        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">
                          {initials(t.name)}
                        </div>
                        <p className="mt-3 font-semibold text-foreground">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.location}</p>
                        <span className="mt-2 inline-flex rounded-full border border-gold/30 bg-gold/5 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.15em] text-gold">
                          {t.product}
                        </span>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Dots */}
          <div className="mt-6 flex items-center justify-center gap-2">
            {TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                onClick={() => api?.scrollTo(i)}
                aria-label={`Show testimonial ${i + 1}`}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-500",
                  i === active ? "w-8 bg-gold" : "w-2.5 bg-border hover:bg-gold/40"
                )}
              />
            ))}
          </div>
        </motion.div>

        {/* Grid of others */}
        <div className="grid gap-5 md:grid-cols-3">
          {others.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col rounded-2xl border border-border bg-card p-6 luxury-shadow transition-all duration-500 hover:-translate-y-1.5 hover:luxury-shadow-lg"
            >
              <Quote className="h-7 w-7 text-gold/40" />
              <div className="mt-3 flex gap-0.5">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star key={n} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-foreground/80">
                “{t.text.length > 180 ? t.text.slice(0, 180) + "…" : t.text}”
              </p>
              <div className="mt-5 flex items-center gap-3 border-t border-border pt-4">
                <div className="grid h-9 w-9 place-items-center rounded-full bg-primary text-[11px] font-semibold text-primary-foreground">
                  {initials(t.name)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{t.location}</p>
                </div>
                <span className="rounded-full border border-gold/25 bg-gold/5 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.12em] text-gold">
                  {t.product.split(" ")[0]}
                </span>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Trust line */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10 text-center text-xs text-muted-foreground"
        >
          Trusted by {new Intl.NumberFormat("en-IN").format(12000)}+ women across 30+ countries ·
          Since {BRAND.estd}
        </motion.p>
      </div>
    </section>
  );
}
