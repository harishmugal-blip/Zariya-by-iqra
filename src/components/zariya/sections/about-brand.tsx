"use client";

import { motion } from "framer-motion";
import { ArrowRight, Hand, Scroll, Leaf, ShieldCheck } from "lucide-react";
import { BRAND } from "@/data/catalog";

const VALUES = [
  {
    icon: Hand,
    title: "Handcrafted",
    text: "Every stitch, by hand. No machines, ever — only the patient craft of Kashmiri artisans.",
  },
  {
    icon: Scroll,
    title: "Heritage",
    text: "Five generations of one family of artisans, preserving the aari & sozni traditions since 1873.",
  },
  {
    icon: Leaf,
    title: "Sustainable",
    text: "Naturally sourced pashmina, plant-based dyes and slow, made-to-order production.",
  },
  {
    icon: ShieldCheck,
    title: "Authentic",
    text: "Every pashmina ships with a certificate of authenticity and artisan origin.",
  },
];

export default function AboutBrand() {
  return (
    <section
      id="about"
      aria-label="About ZARIYA"
      className="bg-noise relative overflow-hidden bg-background py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -right-20 top-20 h-72 w-72 rounded-full bg-gold/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="order-2 md:order-1"
          >
            <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-6 bg-gold/60" />
              Our Story
            </span>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
              Born in the Valley, {BRAND.estd}
            </h2>

            <div className="mt-6 space-y-4 text-sm text-foreground/80 md:text-base">
              <p>
                ZARIYA by IQRA was founded in {BRAND.estd} in the old city of Srinagar — born from a
                simple conviction: that the centuries-old craft of Kashmiri embroidery deserved a
                modern home, where it could be honoured, preserved and worn.
              </p>
              <p>
                What began as a single pheran, hand-embroidered for a bride, has become a house
                trusted by women across thirty countries — yet every piece is still stitched in the
                same family atelier, on the same wooden frames, by the same patient hands.
              </p>
              <p>
                <em className="font-serif text-primary">Zariya</em> means a means, a way. We believe
                craft is a way to carry heritage forward — one thread, one piece, one story at a time.
              </p>
            </div>

            <a
              href="#artisan"
              className="group mt-7 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-gold"
            >
              Discover our craft
              <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/30 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="order-1 md:order-2"
          >
            <div className="relative overflow-hidden rounded-2xl luxury-shadow">
              <div className="aspect-[4/5]">
                <img
                  src="/images/lifestyle/heritage.png"
                  alt="Heritage ZARIYA atelier in Kashmir"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
              <div className="absolute bottom-5 left-5 rounded-xl border border-gold/30 bg-primary/40 px-4 py-3 backdrop-blur-md">
                <p className="font-serif text-lg font-semibold text-gold">Srinagar · Kashmir</p>
                <p className="text-[10px] uppercase tracking-[0.18em] text-ivory/70">
                  The family atelier, since 1873
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Values */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } },
          }}
          className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 md:mt-20"
        >
          {VALUES.map((v) => (
            <motion.div
              key={v.title}
              variants={{
                hidden: { opacity: 0, y: 22 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              className="group rounded-2xl border border-border bg-card p-6 text-center luxury-shadow transition-all duration-500 hover:-translate-y-1.5 hover:border-gold/30 hover:luxury-shadow-lg"
            >
              <div className="mx-auto mb-4 grid h-12 w-12 place-items-center rounded-full bg-primary/5 text-primary transition-colors group-hover:bg-gold group-hover:text-charcoal">
                <v.icon className="h-5 w-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-foreground">{v.title}</h3>
              <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{v.text}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
