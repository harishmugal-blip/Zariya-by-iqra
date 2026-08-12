"use client";

import { motion } from "framer-motion";
import { Leaf, Recycle, HandHeart, Sprout, Globe, Droplets } from "lucide-react";

const PILLARS = [
  {
    icon: HandHeart,
    title: "Artisan-First",
    desc: "Our 40+ artisans earn 3× the regional average. No middlemen, no factories — every rupee reaches the hands that made your piece.",
    stat: "3×",
    statLabel: "fair wage",
  },
  {
    icon: Leaf,
    title: "Natural Fibres",
    desc: "Pure pashmina, mulberry silk, and organic cotton. Never synthetic. Never blended with acrylic. Biodegradable to the last thread.",
    stat: "100%",
    statLabel: "natural fibres",
  },
  {
    icon: Recycle,
    title: "Zero-Waste Atelier",
    desc: "Embroidery offcuts become pouches. Pashmina scraps become jewellery. Nothing is discarded. Our atelier is landfill-free since 2019.",
    stat: "0",
    statLabel: "landfill waste",
  },
  {
    icon: Droplets,
    title: "Plant-Based Dyes",
    desc: "Madder root for burgundy. Turmeric for gold. Indigo for royal blue. Our dyes are derived from plants, minerals, and flowers — never azo chemicals.",
    stat: "12",
    statLabel: "natural dye sources",
  },
  {
    icon: Sprout,
    title: "Regenerative Sourcing",
    desc: "Our pashmina comes from Changthangi goats herded by nomadic Changpa families in Ladakh — sheared once a year, by hand, in spring moult. No harm, ever.",
    stat: "200+",
    statLabel: "herder families supported",
  },
  {
    icon: Globe,
    title: "Carbon-Conscious",
    desc: "Every order ships carbon-neutral. Our atelier runs on solar. We plant a chinar tree in Kashmir for every order placed — over 15,000 and counting.",
    stat: "15,000+",
    statLabel: "trees planted",
  },
];

const CERTIFICATIONS = [
  "Fair Trade Certified",
  "PETA Vegan Approved",
  "GOTS Organic Cotton",
  "Carbon Neutral Shipping",
  "Handloom Mark (India)",
  "Pashmina Mark Certified",
];

export function Sustainability() {
  return (
    <section id="sustainability" className="relative overflow-hidden bg-gradient-to-b from-emerald/[0.03] to-background py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto max-w-2xl text-center"
        >
          <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4em] text-emerald">
            <Leaf className="h-3.5 w-3.5" /> Quietly Conscious
          </span>
          <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
            Luxury That Honours the Valley
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
            Heritage is not only what we make — it's how we make it, and who we
            make it with. ZARIYA was founded on a single belief: that the most
            beautiful things are also the most kind. To the hands. To the earth.
            To the generations to come.
          </p>
        </motion.div>

        {/* Pillars grid */}
        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PILLARS.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -4 }}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition-all hover:luxury-shadow"
              >
                {/* emerald accent */}
                <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-emerald/5 blur-2xl transition-opacity group-hover:bg-emerald/10" />
                <div className="relative">
                  <div className="flex items-start justify-between">
                    <div className="inline-grid h-12 w-12 place-items-center rounded-2xl bg-emerald/10 text-emerald transition-colors group-hover:bg-emerald group-hover:text-white">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div className="text-right">
                      <p className="font-serif text-3xl font-bold text-emerald">{p.stat}</p>
                      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                        {p.statLabel}
                      </p>
                    </div>
                  </div>
                  <h3 className="mt-4 font-serif text-lg font-semibold text-foreground">{p.title}</h3>
                  <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{p.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Impact band */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="mt-12 overflow-hidden rounded-3xl bg-primary p-8 text-primary-foreground sm:p-12"
        >
          <div className="grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <h3 className="font-serif text-2xl font-bold sm:text-3xl">
                A tree for every order.
              </h3>
              <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/70">
                For every ZARIYA piece you welcome into your life, we plant a
                chinar tree in the Kashmir valley — the same tree under which our
                artisans have stitched for centuries. Together, we've planted over
                15,000 trees. Your heirloom gives back to the land it came from.
              </p>
            </div>
            <div className="flex gap-6">
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-gold">15K+</p>
                <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">Trees planted</p>
              </div>
              <div className="text-center">
                <p className="font-serif text-4xl font-bold text-gold">200+</p>
                <p className="text-[10px] uppercase tracking-wide text-primary-foreground/60">Families supported</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Certifications */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-10"
        >
          <p className="text-center text-[11px] font-semibold uppercase tracking-[0.3em] text-muted-foreground">
            Certified &amp; Recognised
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2.5">
            {CERTIFICATIONS.map((c) => (
              <span
                key={c}
                className="rounded-full border border-border bg-card px-4 py-2 text-xs font-medium text-foreground/80"
              >
                {c}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
