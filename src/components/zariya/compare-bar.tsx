"use client";

import { motion, AnimatePresence } from "framer-motion";
import { GitCompare, X } from "lucide-react";
import { useCompare } from "@/store/use-compare";
import { PRODUCTS } from "@/data/catalog";
import { cn } from "@/lib/utils";

const MAX_COMPARE = 3;

export function CompareBar() {
  const ids = useCompare((s) => s.ids);
  const openCompare = useCompare((s) => s.openCompare);
  const remove = useCompare((s) => s.remove);

  const products = ids
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter(Boolean);

  return (
    <AnimatePresence>
      {ids.length > 0 && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed bottom-20 left-1/2 z-40 -translate-x-1/2 lg:bottom-6"
        >
          <div className="flex items-center gap-3 rounded-full border border-gold/30 bg-card/95 px-3 py-2 luxury-shadow-lg backdrop-blur-xl">
            <div className="flex items-center gap-1.5 pl-1">
              <GitCompare className="h-4 w-4 text-gold" />
              <span className="text-xs font-semibold text-foreground">
                Compare ({ids.length}/{MAX_COMPARE})
              </span>
            </div>

            {/* thumbnails */}
            <div className="flex items-center gap-1.5">
              {products.map((p) => (
                <div key={p!.id} className="relative">
                  <img
                    src={p!.images[0]?.src}
                    alt={p!.name}
                    className="h-9 w-8 rounded-md object-cover ring-1 ring-gold/30"
                  />
                  <button
                    onClick={() => remove(p!.id)}
                    aria-label={`Remove ${p!.name} from compare`}
                    className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-destructive text-white"
                  >
                    <X className="h-2.5 w-2.5" />
                  </button>
                </div>
              ))}
              {Array.from({ length: MAX_COMPARE - ids.length }).map((_, i) => (
                <div
                  key={i}
                  className="grid h-9 w-8 place-items-center rounded-md border border-dashed border-border"
                >
                  <GitCompare className="h-3 w-3 text-muted-foreground/40" />
                </div>
              ))}
            </div>

            <button
              onClick={openCompare}
              className="rounded-full bg-primary px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              Compare
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
