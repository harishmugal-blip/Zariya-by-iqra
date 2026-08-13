"use client";

import { useEffect, useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";

const MESSAGES = [
  "Complimentary white-glove delivery, worldwide",
  "Handcrafted in Kashmir · Estd. 2009",
  "Use code ZARIYA10 for 10% off your first order",
  "Each piece takes 150+ hours of artisan needlework",
];

// Kashmiri script accents shown alongside messages
const KASHMIRI_ACCENTS = [
  "خوش آمدید", // Welcome
  "کشمیر · ۲۰۰۹", // Kashmir · 2009
  "زرعیہ", // ZARIYA
  "دستکاری", // Craftsmanship
];

const ROTATE_MS = 4000;

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setIndex((i) => (i + 1) % MESSAGES.length);
  }, []);

  useEffect(() => {
    if (paused) return;
    const t = setInterval(next, ROTATE_MS);
    return () => clearInterval(t);
  }, [paused, next]);

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      role="region"
      aria-label="Announcements"
      className="relative z-50 flex h-9 w-full items-center justify-center overflow-hidden bg-primary px-4 text-center text-[11px] font-medium tracking-wide text-gold sm:text-xs"
    >
      <Sparkles className="pointer-events-none absolute left-3 hidden h-3.5 w-3.5 text-gold/80 sm:block" />
      <div className="relative h-5 w-full max-w-3xl overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={index}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0 flex items-center justify-center gap-2.5 uppercase"
          >
            <Sparkles className="h-3 w-3 shrink-0 text-gold sm:hidden" />
            <span className="truncate">{MESSAGES[index]}</span>
            <span className="font-kashmiri hidden text-gold/60 sm:inline">
              {KASHMIRI_ACCENTS[index]}
            </span>
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Dots */}
      <div className="pointer-events-none absolute right-3 hidden items-center gap-1 sm:flex">
        {MESSAGES.map((_, i) => (
          <span
            key={i}
            className={`h-1 rounded-full transition-all duration-500 ${
              i === index ? "w-4 bg-gold" : "w-1 bg-gold/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default AnnouncementBar;
