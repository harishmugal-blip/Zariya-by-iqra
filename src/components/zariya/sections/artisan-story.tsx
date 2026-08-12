"use client";

import { motion } from "framer-motion";
import { ArrowRight, Hourglass, Heart, Scissors, Award } from "lucide-react";
import { BRAND } from "@/data/catalog";

const STATS = [
  { icon: Hourglass, value: "150+", label: "hrs per piece" },
  { icon: Heart, value: "5", label: "generations of artisans" },
  { icon: Scissors, value: "100%", label: "hand-embroidered" },
  { icon: Award, value: String(BRAND.estd), label: "Established" },
];

export default function ArtisanStory() {
  return (
    <section
      aria-label="Artisan story"
      className="bg-noise relative overflow-hidden bg-[#FBF5EC] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="relative overflow-hidden rounded-2xl luxury-shadow">
              <div className="aspect-[4/5]">
                <img
                  src="/images/lifestyle/artisan.png"
                  alt="Kashmiri artisan hand-embroidering a pheran"
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/40 via-transparent to-transparent" />
            </div>
            {/* Floating badge */}
            <div className="absolute -bottom-5 -right-2 rounded-2xl border border-gold/30 bg-background/95 px-5 py-4 text-center backdrop-blur-md luxury-shadow sm:-right-6">
              <p className="font-serif text-3xl font-semibold text-primary">150+</p>
              <p className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                artisan hours
                <br /> per piece
              </p>
            </div>
          </motion.div>

          {/* Text */}
          <motion.div
            initial={{ opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
              <span className="h-px w-6 bg-gold/60" />
              Our Heritage
            </span>
            <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
              Handcrafted in Kashmir
            </h2>

            <div className="mt-6 space-y-4 text-sm text-foreground/80 md:text-base">
              <p>
                For over 150 years, the hands that have shaped ZARIYA pieces have belonged to a single
                family of master artisans — five generations of embroiderers, weavers and finishers, all
                rooted in the old city of Srinagar.
              </p>
              <p>
                Our craft is built on two needle traditions unique to the valley: <em>aari</em>, the
                bold hook-stitch of ceremonial pherans, and <em>sozni</em>, the impossibly fine
                flat-stitch that graces our shawls. A single piece can take 120 to 180 hours of unbroken
                needlework — and no machine on earth can replicate it.
              </p>
              <p>
                When you wear ZARIYA, you wear more than a garment. You wear the patience, devotion and
                lineage of an artisan whose name is quietly stitched into every thread.
              </p>
            </div>

            {/* Stats row */}
            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {STATS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ duration: 0.5, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                  className="rounded-xl border border-border bg-card/70 p-3 text-center backdrop-blur-sm"
                >
                  <s.icon className="mx-auto mb-1 h-4 w-4 text-gold" />
                  <p className="font-serif text-xl font-semibold text-primary">{s.value}</p>
                  <p className="text-[10px] uppercase tracking-[0.12em] text-muted-foreground">
                    {s.label}
                  </p>
                </motion.div>
              ))}
            </div>

            <a
              href="#about"
              className="group mt-8 inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.18em] text-primary transition-colors hover:text-gold"
            >
              Read Our Story
              <span className="grid h-9 w-9 place-items-center rounded-full border border-primary/30 transition-all group-hover:bg-primary group-hover:text-primary-foreground">
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
