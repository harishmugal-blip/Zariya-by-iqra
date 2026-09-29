"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Mail, Loader2, ArrowLeft, Eye, EyeOff, Crown } from "lucide-react";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    // Check if already logged in
    fetch("/api/admin/auth/me")
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated) router.replace("/admin");
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Login failed");
        return;
      }
      toast.success(`Welcome back, ${data.admin.name}`);
      router.replace("/admin");
    } catch {
      toast.error("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="grid min-h-screen place-items-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <main className="relative min-h-screen overflow-hidden bg-primary">
      {/* Decorative */}
      <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />

      <div className="relative mx-auto flex min-h-screen max-w-md flex-col justify-center px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="text-center"
        >
          {/* Logo */}
          <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gold/20">
            <Crown className="h-8 w-8 text-gold" />
          </div>
          <span className="font-kashmiri text-2xl text-gold/80">ذریعہ</span>
          <h1 className="mt-1 font-serif text-3xl font-bold text-primary-foreground">
            ZARIYA Admin
          </h1>
          <p className="mt-1 text-xs uppercase tracking-[0.3em] text-gold">
            Atelier Console
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: EASE }}
          className="mt-8 rounded-3xl border border-gold/20 bg-card/80 p-8 backdrop-blur-xl"
        >
          <h2 className="mb-1 font-serif text-xl font-semibold text-primary-foreground">
            Sign in
          </h2>
          <p className="mb-6 text-xs text-muted-foreground">
            Enter your credentials to manage the atelier.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@zariya.com"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full rounded-xl border border-border bg-background py-3 pl-10 pr-10 text-sm text-foreground outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-gold py-3 text-sm font-semibold uppercase tracking-wide text-primary transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Signing in…
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4" /> Sign In
                </>
              )}
            </button>
          </form>

          {/* Demo credentials hint */}
          <div className="mt-5 rounded-xl border border-gold/20 bg-gold/5 p-3 text-center">
            <p className="text-[11px] text-muted-foreground">
              <span className="font-semibold text-gold">Demo:</span>{" "}
              admin@zariya.com · zariya123
            </p>
          </div>
        </motion.div>

        <a
          href="/"
          className="mt-6 inline-flex items-center justify-center gap-1.5 text-xs text-primary-foreground/60 transition-colors hover:text-gold"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
        </a>
      </div>
    </main>
  );
}
