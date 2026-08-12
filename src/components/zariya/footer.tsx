"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Instagram,
  Facebook,
  Mail,
  Phone,
  MapPin,
  ArrowRight,
} from "lucide-react";
import { BRAND } from "@/data/catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { WhatsAppIcon } from "./product-card";

function PinterestIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden>
      <path d="M12 0C5.373 0 0 5.372 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.771-2.249 3.771-5.495 0-2.873-2.065-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345c-.091.378-.293 1.194-.333 1.36-.052.219-.174.266-.4.16-1.492-.694-2.424-2.879-2.424-4.633 0-3.771 2.738-7.232 7.892-7.232 4.143 0 7.365 2.953 7.365 6.898 0 4.117-2.595 7.428-6.194 7.428-1.21 0-2.348-.629-2.738-1.378l-.744 2.836c-.269 1.04-.996 2.343-1.484 3.136.012 0 .024.005.036.005C18.162 23.996 24 18.622 24 12c0-6.628-5.373-12-12-12z" />
    </svg>
  );
}

const SHOP_LINKS = [
  { label: "Pherans", href: "/shop?category=pherans" },
  { label: "Pashmina Shawls", href: "/shop?category=shawls" },
  { label: "Embroidered Suits", href: "/shop?category=suits" },
  { label: "Kaftans", href: "/shop?category=kaftans" },
  { label: "Accessories", href: "/shop?category=accessories" },
];

const ABOUT_LINKS = [
  { label: "Our Heritage", href: "/story" },
  { label: "Artisan Stories", href: "/artisans" },
  { label: "Celebrity Collection", href: "/shop?collection=royal-heritage" },
  { label: "Luxury Packaging", href: "/packaging" },
  { label: "Sustainability", href: "/sustainability" },
];

const CARE_LINKS = [
  { label: "Contact", href: "/contact" },
  { label: "WhatsApp Concierge", href: `https://wa.me/${BRAND.whatsapp}` },
  { label: "Shipping", href: "/shipping" },
  { label: "Returns", href: "/returns" },
  { label: "Size Guide", href: "/size-guide" },
  { label: "FAQs", href: "/faq" },
];

const PAYMENTS = ["COD", "UPI", "Visa", "Mastercard"];

function ColumnLink({ href, label }: { href: string; label: string }) {
  const external = href.startsWith("http");
  return (
    <li>
      <Link
        href={href}
        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="group inline-flex items-center gap-1.5 text-sm text-primary-foreground/70 transition-colors hover:text-gold"
      >
        <span className="h-px w-0 bg-gold transition-all duration-300 group-hover:w-3" />
        {label}
      </Link>
    </li>
  );
}

export function Footer() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "ok" | "err">("idle");

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setStatus("ok");
      setEmail("");
    } catch {
      setStatus("err");
    }
  };

  return (
    <footer className="mt-auto bg-primary text-primary-foreground">
      {/* Top band */}
      <div className="border-b border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center gap-3 px-4 py-10 text-center sm:px-6 lg:px-8">
          <div className="flex items-baseline gap-2">
            <span className="font-serif text-3xl font-bold tracking-tight">
              {BRAND.name}
            </span>
            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
              by IQRA
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="h-px w-10 bg-gold/50" />
            <span className="font-serif text-sm italic tracking-wide text-gold">
              {BRAND.tagline}
            </span>
            <span className="h-px w-10 bg-gold/50" />
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-4 py-12 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Shop */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            Shop
          </h3>
          <ul className="space-y-2.5">
            {SHOP_LINKS.map((l) => (
              <ColumnLink key={l.href} {...l} />
            ))}
          </ul>
        </div>

        {/* About */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            About
          </h3>
          <ul className="space-y-2.5">
            {ABOUT_LINKS.map((l) => (
              <ColumnLink key={l.href} {...l} />
            ))}
          </ul>
        </div>

        {/* Customer Care */}
        <div>
          <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            Customer Care
          </h3>
          <ul className="space-y-2.5">
            {CARE_LINKS.map((l) => (
              <ColumnLink key={l.label} {...l} />
            ))}
          </ul>

          <div className="mt-6 space-y-1.5 text-xs text-primary-foreground/60">
            <a
              href={`mailto:${BRAND.email}`}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Mail className="h-3.5 w-3.5 text-gold/70" /> {BRAND.email}
            </a>
            <a
              href={`tel:${BRAND.phone}`}
              className="flex items-center gap-2 transition-colors hover:text-gold"
            >
              <Phone className="h-3.5 w-3.5 text-gold/70" /> {BRAND.phone}
            </a>
            <p className="flex items-start gap-2">
              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold/70" />
              {BRAND.address}
            </p>
          </div>
        </div>

        {/* Newsletter */}
        <div className="col-span-2 lg:col-span-1">
          <h3 className="mb-4 flex items-center gap-2 font-serif text-sm font-semibold uppercase tracking-[0.15em] text-gold">
            The Inner Circle
          </h3>
          <p className="mb-3 text-xs leading-relaxed text-primary-foreground/70">
            Private previews, atelier stories and first access to limited editions —
            delivered with restraint.
          </p>
          <form onSubmit={subscribe} className="space-y-2">
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (status !== "idle") setStatus("idle");
              }}
              placeholder="Your email"
              className="h-11 border-gold/25 bg-primary-foreground/5 text-primary-foreground placeholder:text-primary-foreground/40 focus-visible:border-gold focus-visible:ring-gold/30"
            />
            <Button
              type="submit"
              disabled={status === "loading"}
              className="group h-11 w-full bg-gold text-charcoal hover:bg-gold/90"
            >
              {status === "loading" ? (
                "Subscribing…"
              ) : status === "ok" ? (
                "Welcome to ZARIYA"
              ) : (
                <>
                  Subscribe
                  <ArrowRight className="ml-1.5 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </>
              )}
            </Button>
            {status === "err" && (
              <p className="text-[11px] text-destructive">
                Something went wrong. Please try again.
              </p>
            )}
            {status === "ok" && (
              <p className="text-[11px] text-gold">
                You&apos;re on the list. Check your inbox.
              </p>
            )}
          </form>
        </div>
      </div>

      {/* Social row */}
      <div className="border-t border-gold/15">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-6 sm:flex-row sm:px-6 lg:px-8">
          <p className="text-[11px] uppercase tracking-[0.2em] text-primary-foreground/60">
            Follow the Atelier
          </p>
          <div className="flex items-center gap-2.5">
            {[
              { Icon: Instagram, href: BRAND.instagram, label: "Instagram" },
              { Icon: Facebook, href: "https://facebook.com", label: "Facebook" },
              { Icon: PinterestIcon, href: "https://pinterest.com", label: "Pinterest" },
              {
                Icon: WhatsAppIcon,
                href: `https://wa.me/${BRAND.whatsapp}`,
                label: "WhatsApp",
              },
            ].map(({ Icon, href, label }) => (
              <motion.a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                whileHover={{ y: -2, scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="grid h-10 w-10 place-items-center rounded-full border border-gold/30 text-gold transition-colors hover:border-gold hover:bg-gold hover:text-charcoal"
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-gold/15 bg-primary">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-center sm:px-6 md:flex-row md:text-left lg:px-8">
          <p className="text-[11px] tracking-wide text-primary-foreground/70">
            © {new Date().getFullYear()} {BRAND.fullName}. Handcrafted in Kashmir · Estd.{" "}
            {BRAND.estd}.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-1.5">
            {PAYMENTS.map((p) => (
              <span
                key={p}
                className="rounded-md border border-gold/25 bg-primary-foreground/5 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-gold/90"
              >
                {p}
              </span>
            ))}
          </div>
          <a
            href="/admin"
            className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/40 transition-colors hover:text-gold"
          >
            Atelier Console
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
