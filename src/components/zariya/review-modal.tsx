"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Star, Camera, Check, Loader2, X } from "lucide-react";
import { useUI } from "@/store/use-ui";
import { PRODUCTS } from "@/data/catalog";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function ReviewModal() {
  const open = useUI((s) => s.reviewModalOpen);
  const slug = useUI((s) => s.reviewProductSlug);
  const close = useUI((s) => s.closeReviewModal);

  const product = PRODUCTS.find((p) => p.slug === slug);
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [author, setAuthor] = useState("");
  const [location, setLocation] = useState("");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [photos, setPhotos] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  const reset = () => {
    setRating(0);
    setHover(0);
    setAuthor("");
    setLocation("");
    setTitle("");
    setBody("");
    setPhotos([]);
    setSubmitting(false);
    setDone(false);
  };

  const handleClose = (v: boolean) => {
    if (!v) {
      close();
      setTimeout(reset, 300);
    }
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    files.slice(0, 3 - photos.length).forEach((file) => {
      const reader = new FileReader();
      reader.onload = () => {
        setPhotos((p) => [...p, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const submit = async () => {
    if (!product) return;
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }
    if (!author.trim() || !title.trim() || !body.trim()) {
      toast.error("Please fill in your name, review title, and body");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productSlug: product.slug,
          author: author.trim(),
          rating,
          title: title.trim(),
          body: body.trim(),
          location: location.trim(),
          photos,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setSubmitting(false);
      setDone(true);
      toast.success("Review submitted for moderation");
    } catch {
      setSubmitting(false);
      toast.error("Could not submit review. Please try again.");
    }
  };

  if (!product) return null;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl overflow-hidden rounded-3xl p-0">
        {done ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 px-6 py-16 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
              className="grid h-20 w-20 place-items-center rounded-full bg-emerald/10"
            >
              <motion.div
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Check className="h-10 w-10 text-emerald" />
              </motion.div>
            </motion.div>
            <h3 className="font-serif text-2xl font-bold text-foreground">
              Thank you for sharing
            </h3>
            <p className="max-w-md text-sm text-muted-foreground">
              Your review of{" "}
              <span className="font-semibold text-primary">{product.name}</span>{" "}
              has been submitted for moderation. Once approved, it will appear on
              the product page. We are grateful for your voice in the ZARIYA
              circle.
            </p>
            <button
              onClick={() => handleClose(false)}
              className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95"
            >
              Continue
            </button>
          </motion.div>
        ) : (
          <>
            <DialogHeader className="border-b border-border bg-primary px-6 py-5 text-primary-foreground">
              <DialogTitle className="font-serif text-2xl">
                Write a Review
              </DialogTitle>
              <DialogDescription className="text-primary-foreground/70">
                Share your experience with{" "}
                <span className="font-semibold text-gold">{product.name}</span>
              </DialogDescription>
            </DialogHeader>

            <div className="max-h-[70vh] space-y-5 overflow-y-auto scrollbar-lux px-6 py-5">
              {/* Star rating */}
              <div>
                <label className="mb-2 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your Rating
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onMouseEnter={() => setHover(i)}
                      onMouseLeave={() => setHover(0)}
                      onClick={() => setRating(i)}
                      aria-label={`${i} star${i > 1 ? "s" : ""}`}
                      className="rounded-md p-1 transition-transform hover:scale-110"
                    >
                      <Star
                        className={cn(
                          "h-7 w-7 transition-colors",
                          (hover || rating) >= i
                            ? "fill-gold text-gold"
                            : "text-muted-foreground/40"
                        )}
                      />
                    </button>
                  ))}
                  {rating > 0 && (
                    <span className="ml-2 text-sm font-medium text-foreground">
                      {["", "Poor", "Fair", "Good", "Very Good", "Excellent"][rating]}
                    </span>
                  )}
                </div>
              </div>

              {/* Name + location */}
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Your Name *
                  </label>
                  <input
                    value={author}
                    onChange={(e) => setAuthor(e.target.value)}
                    placeholder="e.g. Ayesha K."
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                    Location
                  </label>
                  <input
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Mumbai"
                    className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                  />
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Review Title *
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarise your experience"
                  maxLength={80}
                  className="w-full rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>

              {/* Body */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Your Review *
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value)}
                  placeholder="Tell us about the fit, the fabric, the craftsmanship, how it made you feel…"
                  rows={5}
                  maxLength={1000}
                  className="w-full resize-none rounded-xl border border-border bg-card px-4 py-2.5 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <p className="mt-1 text-right text-[11px] text-muted-foreground">
                  {body.length}/1000
                </p>
              </div>

              {/* Photos */}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  Add Photos (optional, up to 3)
                </label>
                <div className="flex flex-wrap gap-3">
                  {photos.map((src, i) => (
                    <div
                      key={i}
                      className="relative h-20 w-20 overflow-hidden rounded-xl border border-border"
                    >
                      <img
                        src={src}
                        alt={`Upload ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        onClick={() =>
                          setPhotos((p) => p.filter((_, idx) => idx !== i))
                        }
                        className="absolute right-1 top-1 grid h-5 w-5 place-items-center rounded-full bg-primary/80 text-primary-foreground"
                        aria-label="Remove photo"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                  {photos.length < 3 && (
                    <label className="grid h-20 w-20 cursor-pointer place-items-center rounded-xl border-2 border-dashed border-border bg-muted/30 text-muted-foreground transition-all hover:border-gold hover:text-gold">
                      <Camera className="h-5 w-5" />
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handlePhoto}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>
              </div>

              <p className="rounded-xl bg-muted/40 p-3 text-xs text-muted-foreground">
                Reviews are moderated to keep the ZARIYA circle authentic and
                respectful. Your email is never displayed publicly.
              </p>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 border-t border-border bg-muted/30 px-6 py-4">
              <button
                onClick={() => handleClose(false)}
                className="rounded-full px-5 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={submitting}
                className="flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-60"
              >
                {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                {submitting ? "Submitting…" : "Submit Review"}
              </button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
