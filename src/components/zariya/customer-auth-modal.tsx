"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { motion, AnimatePresence } from "framer-motion";
import { X, Mail, Lock, User, Loader2, Check, Crown } from "lucide-react";
import { useCustomerAuth } from "@/store/use-customer-auth";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const EASE = [0.22, 1, 0.36, 1] as const;

export function CustomerAuthModal() {
  const { isOpen, mode, closeAuth, setMode, setUser, user } = useCustomerAuth();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      // Try NextAuth Google sign-in
      // In production with real GOOGLE_CLIENT_ID, this will redirect to Google
      // For demo, we simulate a Google login
      const res = await fetch("/api/auth/providers");
      const providers = await res.json();
      
      if (providers?.google) {
        // Real Google OAuth redirect
        window.location.href = "/api/auth/signin/google";
      } else {
        throw new Error("No google provider");
      }
    } catch {
      // Demo mode — simulate Google login
      setGoogleLoading(false);
      const demoUser = {
        email: "guest@zariya.com",
        name: "Guest User",
        image: "",
      };
      setUser(demoUser);
      toast.success(`Welcome, ${demoUser.name}!`, {
        description: "Signed in with Google (demo)",
      });
      closeAuth();
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      toast.error("Please enter your email");
      return;
    }
    setLoading(true);
    // Demo: simulate login
    await new Promise((r) => setTimeout(r, 800));
    setUser({
      email: email.trim(),
      name: name.trim() || email.split("@")[0],
    });
    toast.success(`Welcome${name.trim() ? ", " + name.trim().split(" ")[0] : ""}!`, {
      description: mode === "signup" ? "Account created" : "Signed in",
    });
    setLoading(false);
    closeAuth();
    // Reset form
    setEmail("");
    setName("");
    setPassword("");
  };

  const handleLogout = () => {
    useCustomerAuth.getState().logout();
    toast("Signed out");
    closeAuth();
  };

  return (
    <Dialog open={isOpen} onOpenChange={(v) => !v && closeAuth()}>
      <DialogContent className="max-w-md overflow-hidden rounded-3xl border-border p-0">
        <DialogTitle className="sr-only">
          {mode === "login" ? "Login" : "Sign Up"}
        </DialogTitle>
        <DialogDescription className="sr-only">
          Sign in to your ZARIYA account or create a new one.
        </DialogDescription>

        <div className="p-8">
          {/* Close button */}
          <button
            onClick={closeAuth}
            className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>

          {/* Header */}
          <div className="mb-6 text-center">
            <div className="mx-auto mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/10">
              <Crown className="h-6 w-6 text-primary" />
            </div>
            <span className="font-kashmiri text-xl text-gold/80">زرعیہ</span>
            <h2 className="mt-1 font-serif text-2xl font-bold text-foreground">
              {mode === "login" ? "Welcome Back" : "Join ZARIYA"}
            </h2>
            <p className="mt-1 text-xs text-muted-foreground">
              {mode === "login"
                ? "Sign in to track orders, save wishlist & more"
                : "Create an account for a seamless luxury experience"}
            </p>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={googleLoading}
            className="btn-shimmer flex w-full items-center justify-center gap-3 rounded-full border-2 border-border bg-card py-3 text-sm font-semibold text-foreground transition-all hover:border-gold/40 hover:bg-muted active:scale-95 disabled:opacity-60"
          >
            {googleLoading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gold" />
            ) : (
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
            )}
            {googleLoading ? "Connecting…" : "Continue with Google"}
          </button>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-border" />
            <span className="text-[10px] uppercase tracking-wider text-muted-foreground">or</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          {/* Email form */}
          <form onSubmit={handleEmailLogin} className="space-y-3">
            {mode === "signup" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Full Name"
                  className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
                />
              </div>
            )}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                className="w-full rounded-xl border border-border bg-card py-3 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-shimmer flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold uppercase tracking-wide text-primary-foreground transition-all hover:scale-[1.01] active:scale-95 disabled:opacity-60"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : mode === "login" ? (
                <Check className="h-4 w-4" />
              ) : (
                <Crown className="h-4 w-4" />
              )}
              {loading ? "Please wait…" : mode === "login" ? "Sign In" : "Create Account"}
            </button>
          </form>

          {/* Toggle login/signup */}
          <p className="mt-5 text-center text-xs text-muted-foreground">
            {mode === "login" ? "New to ZARIYA? " : "Already have an account? "}
            <button
              onClick={() => setMode(mode === "login" ? "signup" : "login")}
              className="font-semibold text-gold underline-offset-2 hover:underline"
            >
              {mode === "login" ? "Create account" : "Sign in"}
            </button>
          </p>

          {/* Benefits */}
          {mode === "signup" && (
            <div className="mt-4 rounded-xl bg-primary/5 p-3">
              <p className="text-center text-[11px] text-muted-foreground">
                ✨ Get <span className="font-semibold text-gold">₹2,000 off</span> your first order
                <br />
                Track orders · Save wishlist · Exclusive offers
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
