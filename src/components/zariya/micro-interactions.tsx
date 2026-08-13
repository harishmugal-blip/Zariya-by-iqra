"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring, AnimatePresence } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Luxury scroll progress bar — a thin gold gradient that fills as the
 * user scrolls down the page. Fixed to the very top, above the header.
 */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });
  return (
    <motion.div
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-gold via-champagne to-gold shadow-[0_0_12px_hsl(38_51%_56%/0.6)]"
      aria-hidden
    />
  );
}

/**
 * Premium page loader — shows once on first paint with an elegant
 * gold ZARIYA monogram + shimmering underline. Fades out after mount.
 */
export function PageLoader() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setDone(true), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <AnimatePresence>
      {!done && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[100] grid place-items-center bg-background"
        >
          <div className="flex flex-col items-center gap-5">
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-center"
            >
              <p className="font-serif text-4xl font-bold tracking-[0.2em] text-primary sm:text-5xl">
                ZARIYA
              </p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.5em] text-gold">
                by IQRA
              </p>
            </motion.div>
            <div className="relative h-[2px] w-40 overflow-hidden rounded-full bg-muted">
              <motion.div
                className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-transparent via-gold to-transparent"
                initial={{ x: "-100%" }}
                animate={{ x: "200%" }}
                transition={{ duration: 1, ease: "easeInOut", repeat: Infinity }}
              />
            </div>
            <p className="text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
              Timeless Kashmiri Elegance
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/**
 * Back-to-top button — appears after scrolling 600px. Circular gold
 * glass button with a chevron that lifts on hover.
 */
export function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 600);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <AnimatePresence>
      {show && (
        <motion.button
          initial={{ opacity: 0, scale: 0.6, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.6, y: 12 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          whileHover={{ y: -3 }}
          whileTap={{ scale: 0.92 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          aria-label="Back to top"
          className={cn(
            "fixed bottom-44 right-4 z-40 grid h-11 w-11 place-items-center rounded-full",
            "glass luxury-shadow border border-gold/30 text-primary",
            "lg:bottom-24 lg:right-6"
          )}
        >
          <ArrowUp className="h-5 w-5" />
        </motion.button>
      )}
    </AnimatePresence>
  );
}

/** Bundle of all global micro-interactions — mount once in SiteChrome. */
export function MicroInteractions() {
  return (
    <>
      <ScrollProgress />
      <PageLoader />
      <BackToTop />
    </>
  );
}
