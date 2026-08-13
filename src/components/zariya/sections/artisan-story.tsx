"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Hourglass, Heart, Scissors, Award, Play, X } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { BRAND } from "@/data/catalog";

const STATS = [
  { icon: Hourglass, value: "150+", label: "hrs per piece" },
  { icon: Heart, value: "5", label: "generations of artisans" },
  { icon: Scissors, value: "100%", label: "hand-embroidered" },
  { icon: Award, value: String(BRAND.estd), label: "Established" },
];

export default function ArtisanStory() {
  const [videoOpen, setVideoOpen] = useState(false);

  return (
    <section
      aria-label="Artisan story"
      className="bg-noise relative overflow-hidden bg-[#FBF5EC] py-20 md:py-28"
    >
      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-24 bottom-0 h-72 w-72 rounded-full bg-primary/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-center gap-10 md:grid-cols-2 md:gap-16">
          {/* Image with video play */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <button
              onClick={() => setVideoOpen(true)}
              className="group relative block w-full overflow-hidden rounded-2xl luxury-shadow"
              aria-label="Play artisan documentary"
            >
              <div className="aspect-[4/5]">
                <img
                  src="/images/lifestyle/artisan.png"
                  alt="Kashmiri artisan hand-embroidering a pheran"
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-primary/50 via-transparent to-transparent" />
              {/* Play button */}
              <div className="absolute inset-0 grid place-items-center">
                <span className="relative grid h-16 w-16 place-items-center rounded-full bg-gold/90 text-primary transition-all duration-300 group-hover:scale-110 group-hover:bg-gold sm:h-20 sm:w-20">
                  <span className="pointer-events-none absolute inset-0 animate-pulse-ring rounded-full bg-gold" />
                  <Play className="h-7 w-7 fill-primary sm:h-9 sm:w-9" />
                </span>
              </div>
              {/* Caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between">
                <span className="rounded-full glass px-3 py-1 text-[10px] font-semibold uppercase tracking-wide text-primary-foreground">
                  Watch · 2 min
                </span>
                <span className="text-[10px] font-medium text-primary-foreground/80">
                  The Art of Aari
                </span>
              </div>
            </button>
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
            <p className="font-kashmiri mt-2 text-xl text-gold/70 sm:text-2xl">
              کشمیر میں ہاتھ سے بنی
            </p>

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

      {/* Video modal */}
      <Dialog open={videoOpen} onOpenChange={setVideoOpen}>
        <DialogContent className="max-w-4xl overflow-hidden rounded-3xl border-gold/20 p-0">
          <DialogTitle className="sr-only">Artisan documentary — The Art of Aari</DialogTitle>
          <div className="relative aspect-video bg-primary">
            <img
              src="/images/lifestyle/artisan.png"
              alt="Artisan at work"
              className="h-full w-full object-cover opacity-80"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/20 to-transparent" />
            {/* Faux video controls */}
            <div className="absolute inset-0 grid place-items-center">
              <div className="text-center text-primary-foreground">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 200 }}
                  className="mx-auto mb-4 grid h-20 w-20 place-items-center rounded-full bg-gold text-primary"
                >
                  <Play className="h-8 w-8 fill-primary" />
                </motion.div>
                <p className="font-serif text-2xl font-bold">The Art of Aari</p>
                <p className="mt-1 text-xs text-primary-foreground/70">
                  A 2-minute documentary from the ZARIYA atelier
                </p>
              </div>
            </div>
            {/* Bottom bar */}
            <div className="absolute inset-x-0 bottom-0 flex items-center gap-3 bg-gradient-to-t from-primary to-transparent p-4">
              <div className="flex items-center gap-2 text-primary-foreground">
                <span className="grid h-8 w-8 place-items-center rounded-full bg-gold text-primary">
                  <Play className="h-4 w-4 fill-primary" />
                </span>
                <span className="text-xs">0:00 / 2:14</span>
              </div>
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-primary-foreground/20">
                <div className="h-full w-0 rounded-full bg-gold" />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  );
}
