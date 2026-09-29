"use client";

import { useEffect, useState } from "react";
import {
  AnimatePresence,
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { ChevronDown, MessageCircle } from "lucide-react";
import { BRAND } from "@/data/catalog";
import { cn, whatsappLink } from "@/lib/utils";

const STATIC_SLIDES = [
  {
    image: "/images/hero/hero-1.png",
    eyebrow: "Handcrafted in Kashmir · Estd. 2009",
    title: "Timeless Kashmiri Elegance",
    subtitle:
      "Heirloom pherans, pashmina shawls and embroidered suits — each piece, a quiet act of devotion.",
    badge: null as string | null,
    buttonText: "Shop Collection",
    buttonLink: "/store",
  },
  {
    image: "/images/hero/hero-2.png",
    eyebrow: "Handcrafted in Kashmir · Estd. 2009",
    title: "Wear the Heritage of the Valley",
    subtitle:
      "From the looms of Srinagar to your wardrobe — fashion that carries 150 years of artisan lineage.",
    badge: "New Arrival" as string | null,
    buttonText: "Shop Collection",
    buttonLink: "/store",
  },
  {
    image: "/images/hero/hero-3.png",
    eyebrow: "Handcrafted in Kashmir · Estd. 2009",
    title: "Every Thread, A Story",
    subtitle:
      "Hand-embroidered aari & sozni, woven one stitch at a time by master Kashmiri artisans.",
    badge: "Coming Soon" as string | null,
    buttonText: "Shop Collection",
    buttonLink: "/store",
  },
];

function PaisleyMotif({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 180"
      fill="none"
      className={className}
      aria-hidden
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M60 8C32 8 12 30 12 64c0 30 18 50 38 64 6 4 12 8 12 16 0-8 6-12 12-16 20-14 38-34 38-64 0-34-24-56-52-56Z"
        stroke="currentColor"
        strokeWidth="1.2"
        opacity="0.55"
      />
      <path
        d="M60 28C40 28 30 44 30 64c0 22 14 36 30 50 16-14 30-28 30-50 0-20-10-36-30-36Z"
        stroke="currentColor"
        strokeWidth="0.8"
        opacity="0.4"
      />
      <circle cx="60" cy="64" r="5" stroke="currentColor" strokeWidth="0.8" opacity="0.6" />
      <path d="M60 12V170" stroke="currentColor" strokeWidth="0.5" opacity="0.25" strokeDasharray="2 6" />
    </svg>
  );
}

export default function Hero() {
  const [index, setIndex] = useState(0);
  const [slides, setSlides] = useState(STATIC_SLIDES);

  // Fetch hero slides from DB (admin-managed)
  useEffect(() => {
    fetch("/api/hero-slides")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.slides?.length) setSlides(data.slides);
      })
      .catch(() => {});
  }, []);
  const { scrollY } = useScroll();
  const yContent = useTransform(scrollY, [0, 600], [0, 90]);
  const opacityContent = useTransform(scrollY, [0, 480], [1, 0]);
  const yBg = useTransform(scrollY, [0, 600], [0, 120]);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % slides.length), 6000);
    return () => clearInterval(t);
  }, []);

  const slide = slides[index];
  const waHref = whatsappLink(
    BRAND.whatsapp,
    "Namaste ZARIYA! I'd like to explore your handcrafted collection and place an order. Could you please guide me?"
  );

  return (
    <section
      aria-label="Hero"
      className="relative min-h-[88vh] w-full overflow-hidden bg-primary"
    >
      {/* Background slides */}
      <motion.div style={{ y: yBg }} className="absolute inset-0 -z-10">
        <AnimatePresence mode="sync">
          <motion.div
            key={index}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <img
              src={slide.image}
              alt={slide.title}
              className="h-full w-full object-cover animate-ken-burns"
              fetchPriority="high"
            />
            {/* Badge — New Arrival / Coming Soon etc */}
            {slide.badge && (
              <div className="absolute right-6 top-24 z-20 hidden md:block">
                <span className="rounded-full bg-gold px-4 py-1.5 text-[11px] font-bold uppercase tracking-wider text-primary shadow-lg">
                  {slide.badge}
                </span>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {/* Overlay gradients — enhanced for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary/80 via-primary/50 to-primary/90" />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/70 via-primary/30 to-primary/70" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-primary/30" />
        {/* Radial gradient behind text for extra contrast */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(74,14,23,0.5) 0%, transparent 70%)" }} />
      </motion.div>

      {/* Floating paisley motifs */}
      <PaisleyMotif className="animate-float-slow pointer-events-none absolute left-[4%] top-[14%] h-28 w-20 text-gold/10 md:h-40 md:w-28" />
      <PaisleyMotif className="animate-float-slower pointer-events-none absolute right-[6%] top-[22%] h-24 w-20 text-gold/15 md:h-36 md:w-28" />
      <PaisleyMotif className="animate-float-slow pointer-events-none absolute bottom-[12%] left-[12%] h-20 w-16 text-gold/10 hidden md:block" />
      <PaisleyMotif className="animate-float-slower pointer-events-none absolute bottom-[18%] right-[14%] h-24 w-20 text-gold/10 hidden md:block" />

      {/* Animated Kashmiri Model — floating showcase */}
      <motion.div
        initial={{ opacity: 0, x: 60, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute right-0 top-1/2 z-[5] hidden -translate-y-1/2 lg:block"
      >
        <div className="relative">
          {/* Rotating gold ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
            className="absolute -inset-6 rounded-full border border-dashed border-gold/30"
          />
          {/* Gold glow */}
          <div className="pointer-events-none absolute -inset-8 rounded-full bg-gold/15 blur-3xl" />

          {/* Model image with breathing animation */}
          <motion.div
            animate={{ y: [0, -14, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-[70vh] max-h-[640px] w-[340px] overflow-hidden rounded-[200px] border-2 border-gold/40 shadow-2xl"
          >
            <img
              src="/images/hero/hero-model-suit.png"
              alt="ZARIYA model in hand-embroidered Kashmiri suit"
              className="h-full w-full object-cover"
            />
            {/* Subtle gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/30 via-transparent to-transparent" />
          </motion.div>

          {/* Floating badge — "Hand-Embroidered" */}
          <motion.div
            animate={{ y: [0, 10, 0], rotate: [0, 3, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -left-8 top-16 rounded-2xl glass border border-gold/30 px-4 py-3 luxury-shadow"
          >
            <p className="font-serif text-xs font-bold text-foreground">Hand-Embroidered</p>
            <p className="text-[10px] text-muted-foreground">150+ hrs · Aari & Sozni</p>
          </motion.div>

          {/* Floating badge — "Pure Pashmina" */}
          <motion.div
            animate={{ y: [0, -10, 0], rotate: [0, -3, 0] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
            className="absolute -right-4 bottom-24 rounded-2xl glass border border-gold/30 px-4 py-3 luxury-shadow"
          >
            <p className="font-serif text-xs font-bold text-foreground">Pure Pashmina</p>
            <p className="text-[10px] text-muted-foreground">Grade-A · Kashmir</p>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <motion.div
        style={{ y: yContent, opacity: opacityContent }}
        className="relative z-10 mx-auto flex min-h-[88vh] max-w-4xl flex-col items-center justify-center px-6 pb-32 pt-24 text-center"
      >
        {/* Kashmiri script brand name */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4"
        >
          <span className="font-kashmiri text-3xl font-medium sm:text-4xl md:text-5xl" style={{ color: "#B89A5A" }}>
            ذریعہ
          </span>
        </motion.div>

        <AnimatePresence mode="wait">
          <motion.div
            key={`eyebrow-${index}`}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="h-px w-8" style={{ backgroundColor: "#B89A5A" }} />
            <span className="text-[11px] font-semibold uppercase tracking-[0.3em]" style={{ color: "#B89A5A" }}>
              {slide.eyebrow}
            </span>
            <span className="h-px w-8" style={{ backgroundColor: "#B89A5A" }} />
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.h1
            key={`title-${index}`}
            initial={{ opacity: 0, y: 24, filter: "blur(8px)" }}
            animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, y: -16, filter: "blur(6px)" }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-shadow-lux font-serif text-4xl font-bold leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl"
            style={{ color: "#F3EBDD" }}
          >
            {slide.title}
          </motion.h1>
        </AnimatePresence>

        <AnimatePresence mode="wait">
          <motion.p
            key={`sub-${index}`}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.7, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="mt-6 max-w-xl text-balance text-base sm:text-lg md:text-xl"
            style={{ color: "#F5EFE6" }}
          >
            {slide.subtitle}
          </motion.p>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col gap-4 sm:flex-row"
        >
          {/* Primary CTA — solid gold with dark text for max contrast */}
          <a
            href="/store"
            className="btn-shimmer group relative inline-flex h-12 items-center justify-center gap-2 overflow-hidden rounded-full px-8 text-sm font-semibold uppercase tracking-[0.15em] transition-all duration-500 hover:scale-105"
            style={{ backgroundColor: "#B89A5A", color: "#1E1E1E" }}
          >
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />
            Shop Collection
          </a>
          {/* Secondary CTA — ivory outline with ivory text */}
          <a
            href={waHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-full border-2 px-8 text-sm font-semibold uppercase tracking-[0.15em] backdrop-blur-md transition-all duration-500 hover:bg-white/10"
            style={{ borderColor: "#F3EBDD", color: "#F3EBDD" }}
          >
            <MessageCircle className="h-4 w-4" />
            Order on WhatsApp
          </a>
        </motion.div>

        {/* Kashmiri script tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="font-kashmiri mt-8 text-sm sm:text-base"
          style={{ color: "#C9BDB5" }}
        >
          کشمیری دستکاری · ازل تا ابد
        </motion.p>
      </motion.div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            aria-label={`Show slide ${i + 1}`}
            className={cn(
              "h-1.5 rounded-full transition-all duration-500",
              i === index ? "w-10 bg-gold" : "w-3 bg-ivory/40 hover:bg-ivory/70"
            )}
          />
        ))}
      </div>

      {/* Scroll chevron */}
      <motion.a
        href="#shop"
        aria-label="Scroll to shop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-6 right-6 z-20 hidden h-11 w-11 place-items-center rounded-full border border-gold/40 text-gold/80 backdrop-blur-sm transition-colors hover:text-gold md:grid"
      >
        <motion.span
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="h-5 w-5" />
        </motion.span>
      </motion.a>
    </section>
  );
}
