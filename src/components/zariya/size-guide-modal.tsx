"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Ruler, X } from "lucide-react";
import { SIZE_CHARTS, MEASURING_GUIDE } from "@/data/catalog";
import { useUI } from "@/store/use-ui";
import { cn } from "@/lib/utils";

export function SizeGuideModal() {
  const open = useUI((s) => s.sizeGuideOpen);
  const initialCat = useUI((s) => s.sizeGuideCategory);
  const close = useUI((s) => s.closeSizeGuide);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && close()}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
        <SizeGuideContent key={`${open}-${initialCat}`} initialCat={initialCat} />
      </DialogContent>
    </Dialog>
  );
}

function SizeGuideContent({ initialCat }: { initialCat: string | null }) {
  const [tab, setTab] = useState<"chart" | "measure">("chart");

  const activeCategory = useMemo(() => {
    const cat =
      initialCat && SIZE_CHARTS.some((c) => c.category === initialCat)
        ? initialCat
        : SIZE_CHARTS[0].category;
    return cat;
  }, [initialCat]);

  const [selected, setSelected] = useState(activeCategory);
  const chart = SIZE_CHARTS.find((c) => c.category === selected) || SIZE_CHARTS[0];

  return (
    <>
      <DialogHeader className="border-b border-border bg-primary px-6 py-5 text-primary-foreground">
        <DialogTitle className="flex items-center gap-2 font-serif text-2xl">
          <Ruler className="h-5 w-5 text-gold" />
          Size & Fit Guide
        </DialogTitle>
        <DialogDescription className="text-primary-foreground/70">
          Find your perfect fit — the ZARIYA way.
        </DialogDescription>
      </DialogHeader>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-border bg-muted/40 px-4 pt-3">
        {([
          ["chart", "Size Chart"],
          ["measure", "How to Measure"],
        ] as const).map(([key, label]) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={cn(
              "relative -mb-px px-4 py-2.5 text-sm font-medium transition-colors",
              tab === key
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            {label}
            {tab === key && (
              <motion.div
                layoutId="size-tab-underline"
                className="absolute inset-x-2 bottom-0 h-0.5 rounded-full bg-gold"
              />
            )}
          </button>
        ))}
      </div>

      <div className="max-h-[60vh] overflow-y-auto scrollbar-lux px-6 py-5">
        <AnimatePresence mode="wait">
          {tab === "chart" ? (
            <motion.div
              key="chart"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {/* Category selector */}
              <div className="mb-4 flex flex-wrap gap-2">
                {SIZE_CHARTS.map((c) => (
                  <button
                    key={c.category}
                    onClick={() => setSelected(c.category)}
                    className={cn(
                      "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                      selected === c.category
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground hover:bg-muted/70"
                    )}
                  >
                    {c.category}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="overflow-hidden rounded-2xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 py-3 text-left font-semibold">Size</th>
                      <th className="px-4 py-3 text-center font-semibold">Bust</th>
                      <th className="px-4 py-3 text-center font-semibold">Waist</th>
                      <th className="px-4 py-3 text-center font-semibold">Hip</th>
                      <th className="px-4 py-3 text-center font-semibold">Length</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chart.rows.map((r, i) => (
                      <tr
                        key={r.size}
                        className={cn(
                          "text-center transition-colors hover:bg-gold/5",
                          i % 2 === 0 ? "bg-card" : "bg-muted/30"
                        )}
                      >
                        <td className="px-4 py-2.5 text-left font-semibold text-primary">
                          {r.size}
                        </td>
                        <td className="px-4 py-2.5">{r.bust}</td>
                        <td className="px-4 py-2.5">{r.waist}</td>
                        <td className="px-4 py-2.5">{r.hip}</td>
                        <td className="px-4 py-2.5">{r.length}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                <span className="font-semibold text-gold">Note: </span>
                All measurements in {chart.unit}. {chart.note}
              </p>

              {/* fit tips */}
              <div className="mt-5 rounded-2xl bg-primary/5 p-4">
                <h4 className="font-serif text-sm font-semibold text-primary">
                  Fit Tips
                </h4>
                <ul className="mt-2 space-y-1.5 text-xs text-muted-foreground">
                  <li>• Pherans are intentionally relaxed — for a tailored look, size down.</li>
                  <li>• If between sizes, choose the larger for comfort, smaller for fitted.</li>
                  <li>• Shawls &amp; kaftans are forgiving — designed to flatter every form.</li>
                  <li>• Still unsure? WhatsApp our concierge for a personal fitting consult.</li>
                </ul>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="measure"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              <p className="mb-4 text-sm text-muted-foreground">
                Use a soft measuring tape. Wear light clothing, stand relaxed,
                and keep the tape snug — not tight.
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {MEASURING_GUIDE.map((m, i) => (
                  <div
                    key={m.step}
                    className="flex gap-3 rounded-2xl border border-border bg-card p-4"
                  >
                    <div className="grid h-9 w-9 flex-none place-items-center rounded-full bg-gold/15 font-serif text-sm font-bold text-gold">
                      {i + 1}
                    </div>
                    <div>
                      <h4 className="font-serif text-sm font-semibold text-foreground">
                        {m.step}
                      </h4>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                        {m.instruction}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 rounded-2xl bg-primary p-4 text-primary-foreground">
                <h4 className="font-serif text-sm font-semibold">
                  Made-to-Measure Service
                </h4>
                <p className="mt-1 text-xs text-primary-foreground/80">
                  For our Limited Edition and celebrity pieces, we offer a
                  complimentary made-to-measure service. Our concierge will
                  guide you through measurements over a WhatsApp video call.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
