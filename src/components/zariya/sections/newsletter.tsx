"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, Mail, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Status = "idle" | "loading" | "success";

export default function Newsletter() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState<Status>("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, name }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || "Subscription failed");
      }
      setStatus("success");
      toast.success("Welcome to the circle", {
        description: "You're now first to hear about new collections & private sales.",
      });
      setEmail("");
      setName("");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      toast.error("Could not subscribe", { description: message });
      setStatus("idle");
    }
  };

  const reset = () => setStatus("idle");

  return (
    <section
      aria-label="Newsletter signup"
      className="relative overflow-hidden bg-primary py-20 text-ivory md:py-28"
    >
      {/* Decorative gold border accents */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-gold/70 to-transparent" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/2 h-72 w-72 -translate-y-1/2 rounded-full bg-charcoal/40 blur-3xl" />

      <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-gold">
            <Sparkles className="h-3.5 w-3.5" />
            The Inner Circle
          </span>
          <h2 className="font-serif text-3xl font-semibold text-ivory sm:text-4xl md:text-5xl">
            Join the Zariya Circle
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-ivory/70 md:text-base">
            Be first to know about new collections, private sales, and artisan stories — delivered with care.
          </p>
        </motion.div>

        <div className="mx-auto mt-10 max-w-xl">
          <AnimatePresence mode="wait">
            {status === "success" ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="rounded-2xl border border-gold/40 bg-ivory/5 p-8 backdrop-blur-md"
              >
                <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-gold/15 ring-4 ring-gold/10">
                  <Check className="h-7 w-7 text-gold" />
                </div>
                <p className="font-serif text-2xl font-semibold text-ivory">
                  Welcome to the circle
                </p>
                <p className="mt-2 text-sm text-ivory/70">
                  Your invitation to private viewings & first access is on its way.
                </p>
                <button
                  onClick={reset}
                  className="mt-5 text-xs uppercase tracking-[0.18em] text-gold/70 underline-offset-4 hover:text-gold hover:underline"
                >
                  Subscribe another email
                </button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="flex flex-col gap-3 sm:flex-row"
              >
                <Input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name (optional)"
                  className="h-12 flex-1 rounded-full border-gold/30 bg-ivory/5 text-ivory placeholder:text-ivory/40 focus:border-gold focus-visible:ring-gold/40"
                />
                <div className="relative flex-1">
                  <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ivory/40" />
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email address"
                    required
                    className="h-12 rounded-full border-gold/30 bg-ivory/5 pl-11 text-ivory placeholder:text-ivory/40 focus:border-gold focus-visible:ring-gold/40"
                  />
                </div>
                <Button
                  type="submit"
                  disabled={status === "loading"}
                  className="h-12 rounded-full bg-gold px-7 text-sm font-semibold uppercase tracking-[0.15em] text-charcoal transition-all hover:bg-champagne disabled:opacity-60"
                >
                  {status === "loading" ? "Joining…" : "Subscribe"}
                </Button>
              </motion.form>
            )}
          </AnimatePresence>

          <p className="mt-5 text-[11px] text-ivory/50">
            No spam. Only beautiful things. Unsubscribe anytime.
          </p>
        </div>
      </div>
    </section>
  );
}
