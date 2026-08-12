"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, MessageCircle } from "lucide-react";
import { PRODUCTS, BRAND } from "@/data/catalog";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";

const TARGET = (() => {
  const d = new Date();
  d.setDate(d.getDate() + 14);
  d.setHours(20, 0, 0, 0);
  return d.getTime();
})();

function useCountdown(target: number) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  const diff = Math.max(0, target - now);
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="grid h-16 w-16 place-items-center rounded-xl border border-gold/30 bg-primary/60 font-serif text-2xl font-semibold text-gold backdrop-blur-sm sm:h-20 sm:w-20 sm:text-3xl">
        {String(value).padStart(2, "0")}
      </div>
      <span className="mt-2 text-[10px] uppercase tracking-[0.2em] text-ivory/60">{label}</span>
    </div>
  );
}

export default function LimitedEdition() {
  const limited = useMemo(() => PRODUCTS.filter((p) => p.limitedEdition).slice(0, 3), []);
  const { days, hours } = useCountdown(TARGET);
  const featured = limited[0];

  const waHref = (name: string, price: number) =>
    whatsappLink(
      BRAND.whatsapp,
      `Namaste ZARIYA! I would like to reserve the *${name}* (${formatPrice(price)}). Please share availability and next steps. Thank you.`
    );

  return (
    <section
      aria-label="Limited edition"
      className="relative overflow-hidden bg-primary py-20 text-ivory md:py-28"
    >
      {/* Decorative layers */}
      <div className="bg-noise pointer-events-none absolute inset-0 opacity-50" />
      <div className="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-charcoal/40 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            One of a kind
            <Sparkles className="h-3.5 w-3.5" />
          </span>
          <h2 className="font-serif text-4xl font-semibold text-ivory sm:text-5xl md:text-6xl">
            Limited Edition
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/70 md:text-base">
            Only a handful. Each, one of a kind. Once reserved, gone forever.
          </p>
        </motion.div>

        {/* Featured countdown */}
        {featured && (
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12 flex flex-col items-center gap-6 rounded-2xl border border-gold/20 bg-charcoal/30 p-6 backdrop-blur-sm md:p-8"
          >
            <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <Clock className="h-4 w-4" /> Reservation window closes in
            </div>
            <div className="flex items-center gap-3 sm:gap-5">
              <CountdownUnit value={days} label="Days" />
              <span className="font-serif text-2xl text-gold/60">:</span>
              <CountdownUnit value={hours} label="Hours" />
            </div>
          </motion.div>
        )}

        {/* Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {limited.map((p, i) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-gold/15 bg-charcoal/40 backdrop-blur-md transition-all duration-500 hover:border-gold/40 hover:luxury-shadow-lg"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={p.images[0]?.src}
                  alt={p.images[0]?.alt || p.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/20 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-charcoal">
                  Limited Edition
                </span>
                <div className="absolute inset-x-4 bottom-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                    {p.subtitle}
                  </p>
                  <h3 className="mt-1 font-serif text-2xl font-semibold text-ivory">{p.name}</h3>
                </div>
              </div>

              <div className="flex flex-1 flex-col p-5">
                <p className="line-clamp-2 text-xs text-ivory/70">{p.description}</p>

                <div className="mt-4 flex items-center justify-between">
                  <div>
                    <span className="font-serif text-2xl font-semibold text-gold">
                      {formatPrice(p.price)}
                    </span>
                    {p.compareAtPrice && (
                      <span className="ml-2 text-sm text-ivory/40 line-through">
                        {formatPrice(p.compareAtPrice)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-3 flex items-center gap-2 text-xs">
                  <span
                    className={cn(
                      "inline-flex h-2 w-2 rounded-full",
                      p.stock <= 4 ? "animate-pulse bg-destructive" : "bg-gold"
                    )}
                  />
                  <span className="text-ivory/80">
                    Only <span className="font-semibold text-gold">{p.stock} pieces</span> remaining
                  </span>
                </div>

                <a
                  href={waHref(p.name, p.price)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold text-sm font-semibold uppercase tracking-[0.15em] text-charcoal transition-all hover:scale-[1.02] hover:bg-champagne"
                >
                  <MessageCircle className="h-4 w-4" />
                  Reserve Yours
                </a>
              </div>
            </motion.article>
          ))}
        </div>

        {/* Concierge note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-12 text-center text-xs text-ivory/50"
        >
          Each limited piece is hand-checked and personally dispatched by our concierge.
        </motion.p>
      </div>
    </section>
  );
}
