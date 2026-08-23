"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  ArrowLeft,
  Heart,
  Sparkles,
  Scissors,
  Award,
  Crown,
  Leaf,
  Users,
  Globe,
  Star,
  Quote,
} from "lucide-react";
import { BRAND } from "@/data/catalog";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

const TIMELINE = [
  { year: "1873", title: "The First Stitch", desc: "Our great-great-grandmother began embroidering pherans in a small atelier in Srinagar's old city. Her needle told stories the valley could not speak." },
  { year: "1947", title: "Through the Storm", desc: "Three generations carried the craft through partition, war, and exile. The atelier never closed. The needles never stopped." },
  { year: "2009", title: "ZARIYA is Born", desc: "IQRA, the great-great-granddaughter, founded ZARIYA — a bridge between the atelier of her ancestors and the women of the world." },
  { year: "2015", title: "Going Global", desc: "Our pashminas reached 40 countries. A shawl from Srinagar was worn at Cannes. The valley's craft was seen." },
  { year: "2019", title: "Zero-Waste Atelier", desc: "We became landfill-free. Every scrap became something. Every thread was honoured." },
  { year: "2024", title: "15,000 Trees", desc: "For every order, we plant a chinar tree in Kashmir. Over 15,000 now stand — a forest grown from fashion." },
  { year: "Today", title: "The Story Continues", desc: "40+ artisans. 150+ hours per piece. 5 generations of craft. One promise: beauty that honours the hands that make it." },
];

const VALUES = [
  { icon: Heart, title: "Artisan-First", desc: "Our 40+ artisans earn 3× the regional average. No middlemen, no factories — every rupee reaches the hands that made your piece." },
  { icon: Leaf, title: "Natural & Regenerative", desc: "Pure pashmina, plant-based dyes, zero-waste atelier. We plant a chinar tree for every order. Beauty that gives back to the land." },
  { icon: Crown, title: "Heritage Luxury", desc: "150 years of unbroken craft. Aari, sozni, kani — techniques that take a lifetime to master. No machine can replicate what a hand has learned over decades." },
  { icon: Users, title: "Women-Led", desc: "31 of our 40 artisans are women. Mothers, grandmothers, students, breadwinners. They are the heart of ZARIYA — and their names are on every certificate." },
];

const ARTISANS = [
  { name: "Rafeeqa Begum", craft: "Master Sozni Embroiderer", years: "42 years", quote: "My mother told me that embroidery is a form of prayer. Every stitch is a wish for the person who will wear it." },
  { name: "Zareena Bano", craft: "Pashmina Weaver", years: "28 years", quote: "The loom speaks to me. Two inches a day, I tell it. And it tells me back: patience, patience, patience." },
  { name: "Shameem Akhtar", craft: "Aari Specialist", years: "35 years", quote: "I have made millions of wishes. Each chain stitch is one. I hope they all come true for the women who wear them." },
  { name: "Naseema Deva", craft: "Natural Dye Master", years: "20 years", quote: "Madder root for burgundy. Turmeric for gold. The garden decides the colour, not me. I only listen." },
];

const STATS = [
  { value: "150+", label: "Years of Craft" },
  { value: "40+", label: "Master Artisans" },
  { value: "3×", label: "Fair Wages" },
  { value: "15K+", label: "Trees Planted" },
  { value: "40+", label: "Countries Served" },
  { value: "100%", label: "Hand-Embroidered" },
];

export default function StoryPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden bg-primary py-20 text-center text-primary-foreground">
        <img src="/images/lifestyle/heritage.png" alt="Kashmir valley" className="absolute inset-0 h-full w-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/70 to-primary" />
        <div className="relative mx-auto max-w-3xl px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
            <Link href="/" className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold">
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
            </Link>
            <span className="font-kashmiri text-3xl text-gold/80">زرعیہ</span>
            <h1 className="mt-2 font-serif text-5xl font-bold sm:text-6xl md:text-7xl">
              Our Story
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-primary-foreground/70 sm:text-lg">
              Five generations. One atelier. A hundred and fifty years of
              needle, thread, and devotion. This is not a brand. This is a
              lineage — carried in the hands of women who refused to let a
              craft die.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Beginning */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="prose prose-lg max-w-none"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">The Beginning</span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-foreground">Born in the Valley, 1873</h2>
          <div className="mt-6 space-y-5 text-base leading-[1.9] text-foreground/80">
            <p className="first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:leading-[0.85]">
              In the winter of 1873, in a narrow lane of Srinagar's old city, a young woman named Fatima sat cross-legged before a wooden frame. She was embroidering a pheran for her daughter's wedding — a deep burgundy, stitched with gold thread in a pattern her mother had taught her, and her mother's mother before that.
            </p>
            <p>
              The pattern was called <em>Khashidar</em> — a paisley within a paisley, symbolising life within life. Fatima stitched for four months. When the pheran was finished, the entire mohalla came to see it. They said the gold thread seemed to glow in candlelight, as if the garment were alive.
            </p>
            <p>
              That pheran is gone now — lost to time, to partition, to the slow forgetting that history demands. But the stitch survived. It survived in Fatima's daughter, who taught it to her daughter, who taught it to hers. Five generations. One needle. An unbroken line of women, sitting before wooden frames, coaxing gold thread into burgundy.
            </p>
            <p>
              Today, that stitch lives in the ZARIYA atelier. Forty artisans sit where Fatima sat. They use the same <em>aari</em> hook, the same <em>adda</em> frame, the same patience. And when you wear a ZARIYA piece, you are wearing 150 years of someone's focused, devoted, irreplaceable life.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="border-y border-border bg-muted/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 md:grid-cols-3 lg:grid-cols-6">
            {STATS.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                className="text-center"
              >
                <p className="font-serif text-4xl font-bold gold-text">{s.value}</p>
                <p className="mt-1 text-[11px] uppercase tracking-wide text-muted-foreground">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="mb-12 text-center"
        >
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">The Journey</span>
          <h2 className="mt-3 font-serif text-4xl font-bold text-foreground">150 Years, One Thread</h2>
        </motion.div>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-4 top-0 h-full w-0.5 bg-gradient-to-b from-gold via-gold/40 to-transparent md:left-1/2" />

          <div className="space-y-12">
            {TIMELINE.map((item, i) => (
              <motion.div
                key={item.year}
                initial={{ opacity: 0, x: i % 2 === 0 ? -24 : 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.6, ease: EASE }}
                className={cn("relative flex gap-6 md:w-1/2", i % 2 === 0 ? "md:pr-12" : "md:ml-auto md:pl-12")}
              >
                {/* Dot */}
                <div className="absolute left-4 -translate-x-1/2 md:left-auto md:-right-2 md:translate-x-1/2" style={i % 2 !== 0 ? { left: "auto", right: "auto", marginLeft: "-8px" } : {}}>
                  <div className="grid h-8 w-8 place-items-center rounded-full border-2 border-gold bg-background">
                    <div className="h-2 w-2 rounded-full bg-gold" />
                  </div>
                </div>

                <div className="ml-12 md:ml-0">
                  <span className="font-serif text-2xl font-bold text-gold">{item.year}</span>
                  <h3 className="mt-1 font-serif text-lg font-semibold text-foreground">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="bg-muted/20 py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12 text-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">What We Stand For</span>
            <h2 className="mt-3 font-serif text-4xl font-bold text-foreground">Our Values</h2>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2">
            {VALUES.map((v, i) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                  whileHover={{ y: -4 }}
                  className="rounded-3xl border border-border bg-card p-7 transition-shadow hover:luxury-shadow"
                >
                  <div className="inline-grid h-14 w-14 place-items-center rounded-2xl bg-primary/5 text-primary">
                    <Icon className="h-7 w-7" />
                  </div>
                  <h3 className="mt-4 font-serif text-xl font-bold text-foreground">{v.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{v.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Artisans */}
      <section className="relative overflow-hidden bg-primary py-20 text-primary-foreground">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-12 text-center"
          >
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">The Hands Behind the Thread</span>
            <h2 className="mt-3 font-serif text-4xl font-bold">Our Artisans</h2>
            <p className="mx-auto mt-3 max-w-xl text-sm text-primary-foreground/70">
              The women whose names are stitched, in invisible ink, into every piece.
            </p>
          </motion.div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {ARTISANS.map((a, i) => (
              <motion.div
                key={a.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="rounded-2xl border border-gold/20 bg-primary-foreground/5 p-6 backdrop-blur-sm"
              >
                <Quote className="h-6 w-6 text-gold/40" />
                <p className="mt-3 text-sm italic leading-relaxed text-primary-foreground/80">
                  &ldquo;{a.quote}&rdquo;
                </p>
                <div className="mt-5 border-t border-gold/10 pt-4">
                  <p className="font-serif text-base font-bold text-gold">{a.name}</p>
                  <p className="text-xs text-primary-foreground/60">{a.craft}</p>
                  <p className="text-[10px] text-primary-foreground/40">{a.years} at the atelier</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="mx-auto max-w-3xl px-4 py-20 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          <Sparkles className="mx-auto h-8 w-8 text-gold" />
          <h2 className="mt-4 font-serif text-3xl font-bold text-foreground sm:text-4xl">Our Promise</h2>
          <p className="mt-6 text-lg leading-[1.9] text-foreground/70">
            When you buy a ZARIYA piece, you receive a certificate bearing the
            name of the artisan who made it. This is not a marketing gesture.
            It is a contract. It says: this piece was made by a specific person,
            with a specific life, and her name deserves to be known.
          </p>
          <p className="mt-4 text-lg leading-[1.9] text-foreground/70">
            We do not make fast fashion. We make slow heirlooms — garments that
            will outlive trends, outlive seasons, outlive us. Pieces to be worn,
            then passed on. A pheran for your daughter. A shawl for her daughter.
            A stitch that carries a wish from one generation to the next.
          </p>
          <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link href="/store" className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-8 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105">
              Explore the Collection
            </Link>
            <Link href="/journal" className="inline-flex h-12 items-center justify-center rounded-full border border-border px-8 text-sm font-semibold uppercase tracking-wide text-foreground transition-all hover:border-gold hover:text-gold">
              Read Our Journal
            </Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
