"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BRAND } from "@/data/catalog";
import { whatsappLink } from "@/lib/utils";
import { WhatsAppIcon } from "./product-card";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

export function WhatsAppFab() {
  const [hovered, setHovered] = useState(false);

  const href = whatsappLink(
    BRAND.whatsapp,
    "Namaste! I would like to know more about ZARIYA collections."
  );

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Order on WhatsApp"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.5, delay: 0.4, ease: LUX_EASE }}
      whileTap={{ scale: 0.94 }}
      className="group fixed bottom-24 right-4 z-40 flex items-center lg:bottom-6 lg:right-6"
    >
      {/* Pulsing ring */}
      <span className="pointer-events-none absolute right-0 h-14 w-14 rounded-full bg-emerald/40 animate-pulse-ring" />

      {/* Expanding label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, width: 0, x: 10 }}
            animate={{ opacity: 1, width: "auto", x: 0 }}
            exit={{ opacity: 0, width: 0, x: 10 }}
            transition={{ duration: 0.35, ease: LUX_EASE }}
            className="pointer-events-none mr-3 hidden whitespace-nowrap rounded-full bg-foreground px-4 py-2 text-xs font-semibold uppercase tracking-wide text-background shadow-lg sm:block"
          >
            Order on WhatsApp
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <span className="relative grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-emerald text-white shadow-lg transition-transform duration-300 group-hover:scale-105">
        {/* Soft gradient sheen */}
        <span className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
        <WhatsAppIcon className="relative h-7 w-7" />
      </span>
    </motion.a>
  );
}

export default WhatsAppFab;
