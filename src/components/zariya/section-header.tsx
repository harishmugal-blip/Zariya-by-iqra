"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Luxury section header with an ornamental index number,
 * gold eyebrow, Playfair title, and optional subtitle.
 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  const isCenter = align === "center";
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: EASE }}
      className={cn(
        "flex flex-col gap-3",
        isCenter ? "items-center text-center" : "items-start text-left",
        className
      )}
    >
      <div className="flex items-center gap-3">
        {index && (
          <span className="font-serif text-xs font-bold italic tracking-wider text-gold/60">
            {index}
          </span>
        )}
        {eyebrow && (
          <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
            {eyebrow}
          </span>
        )}
      </div>
      <h2 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p
          className={cn(
            "text-sm leading-relaxed text-muted-foreground sm:text-base",
            isCenter ? "max-w-2xl" : "max-w-xl"
          )}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
