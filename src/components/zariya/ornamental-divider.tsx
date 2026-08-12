"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * Luxury gold ornamental divider — a centered motif with two tapering
 * gold lines and a diamond/lotus accent. Used between editorial sections
 * to add breathing room and a couture feel.
 */
export function OrnamentalDivider({
  className,
  variant = "diamond",
}: {
  className?: string;
  variant?: "diamond" | "lotus" | "simple";
}) {
  return (
    <div className={cn("flex items-center justify-center py-6", className)} aria-hidden>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-16 origin-right bg-gradient-to-l from-gold to-transparent sm:w-24"
      />
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        className="mx-3"
      >
        {variant === "diamond" && (
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none" className="text-gold">
            <path d="M14 2 L18 14 L14 26 L10 14 Z" fill="currentColor" opacity="0.9" />
            <path d="M2 14 L14 10 L26 14 L14 18 Z" fill="currentColor" opacity="0.5" />
            <circle cx="14" cy="14" r="2" fill="hsl(var(--primary))" />
          </svg>
        )}
        {variant === "lotus" && (
          <svg width="32" height="28" viewBox="0 0 32 28" fill="none" className="text-gold">
            <path
              d="M16 2 C14 8, 12 12, 8 14 C12 16, 14 20, 16 26 C18 20, 20 16, 24 14 C20 12, 18 8, 16 2 Z"
              fill="currentColor"
              opacity="0.85"
            />
            <path d="M2 14 Q8 12 16 14 Q24 12 30 14" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.5" />
          </svg>
        )}
        {variant === "simple" && (
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-gold">
            <circle cx="10" cy="10" r="3" fill="currentColor" />
            <circle cx="10" cy="10" r="7" stroke="currentColor" strokeWidth="0.5" opacity="0.5" fill="none" />
          </svg>
        )}
      </motion.div>
      <motion.div
        initial={{ scaleX: 0, opacity: 0 }}
        whileInView={{ scaleX: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        className="h-px w-16 origin-left bg-gradient-to-r from-gold to-transparent sm:w-24"
      />
    </div>
  );
}
