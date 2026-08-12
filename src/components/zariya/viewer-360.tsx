"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { RotateCw, X, MousePointer2, RefreshCw } from "lucide-react";
import type { Product } from "@/lib/types";
import { cn } from "@/lib/utils";

/**
 * Full-screen 360° product viewer with drag-to-rotate.
 * Cycles through the product's images as the user drags horizontally.
 */
export function Viewer360({
  product,
  open,
  onOpenChange,
}: {
  product: Product | null;
  open: boolean;
  onOpenChange: (v: boolean) => void;
}) {
  const [frame, setFrame] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const startX = useRef(0);
  const startFrame = useRef(0);
  const autoSpinRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const images = product?.images || [];
  const frameCount = images.length;

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!frameCount) return;
      setIsDragging(true);
      startX.current = e.clientX;
      startFrame.current = frame;
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    },
    [frame, frameCount]
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging || !frameCount) return;
      const dx = e.clientX - startX.current;
      const sensitivity = 8; // px per frame
      const delta = Math.round(dx / sensitivity);
      const newFrame = ((startFrame.current + delta) % frameCount + frameCount) % frameCount;
      setFrame(newFrame);
    },
    [isDragging, frameCount]
  );

  const onPointerUp = useCallback((e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
  }, []);

  // Auto-spin
  const toggleAutoSpin = useCallback(() => {
    setAutoSpin((prev) => {
      const next = !prev;
      if (next) {
        autoSpinRef.current = setInterval(() => {
          setFrame((f) => (f + 1) % Math.max(1, frameCount));
        }, 150);
      } else if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current);
        autoSpinRef.current = null;
      }
      return next;
    });
  }, [frameCount]);

  // Cleanup on close
  const handleOpenChange = (v: boolean) => {
    if (!v) {
      if (autoSpinRef.current) {
        clearInterval(autoSpinRef.current);
        autoSpinRef.current = null;
      }
      setAutoSpin(false);
      setFrame(0);
      setIsDragging(false);
    }
    onOpenChange(v);
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-3xl overflow-hidden rounded-3xl border-gold/20 p-0">
        <DialogTitle className="sr-only">
          360° viewer — {product.name}
        </DialogTitle>
        <div className="relative bg-gradient-to-b from-primary/5 to-background">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-6 py-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gold">
                360° Viewer
              </p>
              <p className="font-serif text-lg font-bold text-foreground">{product.name}</p>
            </div>
            <button
              onClick={() => handleOpenChange(false)}
              aria-label="Close viewer"
              className="grid h-9 w-9 place-items-center rounded-full bg-muted text-muted-foreground transition-colors hover:bg-destructive hover:text-white"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Viewer area */}
          <div className="relative aspect-square select-none overflow-hidden sm:aspect-[4/3]">
            <div
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              className={cn(
                "relative h-full w-full touch-none",
                isDragging ? "cursor-grabbing" : "cursor-grab"
              )}
            >
              <AnimatePresence mode="wait">
                <motion.img
                  key={frame}
                  src={images[frame]?.src}
                  alt={images[frame]?.alt || `${product.name} view ${frame + 1}`}
                  className="h-full w-full object-cover"
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.1 }}
                  draggable={false}
                />
              </AnimatePresence>

              {/* Drag hint overlay (when not dragging) */}
              {!isDragging && !autoSpin && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="pointer-events-none absolute inset-0 grid place-items-center"
                >
                  <div className="rounded-full glass px-4 py-2 text-center">
                    <MousePointer2 className="mx-auto h-4 w-4 text-primary" />
                    <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Drag to rotate
                    </p>
                  </div>
                </motion.div>
              )}

              {/* Frame indicator */}
              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-black/40 px-3 py-1.5 backdrop-blur-md">
                <span className="font-mono text-[10px] text-white">
                  {frame + 1} / {frameCount}
                </span>
                <div className="h-1 w-20 overflow-hidden rounded-full bg-white/20">
                  <div
                    className="h-full rounded-full bg-gold transition-all"
                    style={{ width: `${((frame + 1) / frameCount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between border-t border-border px-6 py-3">
            <p className="text-[11px] text-muted-foreground">
              {isDragging ? "Rotating…" : autoSpin ? "Auto-rotating" : "Drag horizontally to spin"}
            </p>
            <button
              onClick={toggleAutoSpin}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-all",
                autoSpin
                  ? "bg-gold text-primary"
                  : "border border-border text-foreground hover:border-gold/50"
              )}
            >
              <RotateCw className={cn("h-3.5 w-3.5", autoSpin && "animate-spin")} />
              {autoSpin ? "Stop" : "Auto-spin"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
