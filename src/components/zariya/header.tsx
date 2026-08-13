"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Search,
  Heart,
  User,
  ShoppingBag,
  Menu,
  Sparkles,
  ArrowRight,
  Lock,
} from "lucide-react";
import { useCurrency } from "@/store/use-currency";
import { useCustomerAuth } from "@/store/use-customer-auth";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { Sheet, SheetContent, SheetTitle, SheetClose } from "@/components/ui/sheet";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/store/use-wishlist";
import { useUI } from "@/store/use-ui";
import { BRAND, CATEGORIES, COLLECTIONS } from "@/data/catalog";
import { cn } from "@/lib/utils";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

function CountBadge({ count }: { count: number }) {
  if (count <= 0) return null;
  return (
    <motion.span
      key={count}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.35, ease: LUX_EASE }}
      className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-gold px-1 text-[9px] font-bold leading-none text-charcoal shadow-sm"
    >
      {count > 99 ? "99+" : count}
    </motion.span>
  );
}

function IconActionButton({
  label,
  onClick,
  badge,
  children,
  atTop,
}: {
  label: string;
  onClick?: () => void;
  badge?: number;
  children: React.ReactNode;
  atTop: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-full transition-all duration-300 hover:scale-110 active:scale-95",
        atTop ? "text-white/90 hover:bg-white/15" : "text-foreground hover:bg-black/5"
      )}
    >
      {children}
      {badge !== undefined && <CountBadge count={badge} />}
    </button>
  );
}

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const openCart = useCart((s) => s.openCart);
  const wishCount = useWishlist((s) => s.ids.length);
  const openWishlist = useWishlist((s) => s.openWishlist);
  const openSearch = useUI((s) => s.openSearch);
  const menuOpen = useUI((s) => s.menuOpen);
  const setMenuOpen = useUI((s) => s.setMenuOpen);
  const currency = useCurrency((s) => s.currency);
  const setCurrency = useCurrency((s) => s.setCurrency);
  const customerUser = useCustomerAuth((s) => s.user);
  const openAuth = useCustomerAuth((s) => s.openAuth);
  const customerLogout = useCustomerAuth((s) => s.logout);

  const handleAccountClick = () => {
    if (customerUser) {
      if (confirm(`Signed in as ${customerUser.name}\n\nSign out?`)) {
        customerLogout();
      }
    } else {
      openAuth("login");
    }
  };

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const atTop = !scrolled;
  const wordmarkColor = atTop ? "text-white" : "text-primary";
  const linkColor = atTop
    ? "text-white/90 hover:text-white"
    : "text-foreground/80 hover:text-primary";

  return (
    <motion.header
      initial={{ y: -32, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: LUX_EASE }}
      className={cn(
        "sticky top-0 z-40 transition-all duration-500",
        scrolled
          ? "glass luxury-shadow border-b border-gold/15"
          : "bg-primary border-b border-gold/10"
      )}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        {/* Left — mobile menu + wordmark */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            className={cn(
              "grid h-10 w-10 place-items-center rounded-full transition-colors lg:hidden",
              atTop ? "text-white hover:bg-white/15" : "text-foreground hover:bg-black/5"
            )}
          >
            <Menu className="h-5 w-5" />
          </button>

          <Link
            href="/"
            className="group flex items-baseline gap-1.5"
            aria-label={`${BRAND.fullName} — home`}
          >
            <span
              className={cn(
                "font-serif text-2xl font-bold leading-none tracking-tight transition-colors sm:text-[26px]",
                wordmarkColor
              )}
            >
              {BRAND.name}
            </span>
            <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-gold sm:inline">
              by IQRA
            </span>
          </Link>
        </div>

        {/* Center — desktop nav */}
        <div className="hidden flex-1 items-center justify-center lg:flex">
          <NavigationMenu delayDuration={150}>
            <NavigationMenuList className="gap-0.5">
              {CATEGORIES.slice(0, 5).map((cat) => (
                <NavigationMenuItem key={cat.id}>
                  <NavigationMenuTrigger
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "h-9 bg-transparent px-2.5 text-[13px] font-medium tracking-wide",
                      linkColor,
                      "data-[state=open]:bg-transparent"
                    )}
                  >
                    {cat.name}
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="glass w-[440px] overflow-hidden rounded-2xl border border-gold/15 p-2 luxury-shadow">
                      <Link
                        href={`/shop?category=${cat.slug}`}
                        className="group flex gap-4 rounded-xl p-2 transition-colors hover:bg-gold/5"
                      >
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl bg-muted">
                          <img
                            src={cat.image}
                            alt={cat.name}
                            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                        <div className="flex flex-col justify-center">
                          <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold">
                            {cat.productCount} pieces
                          </span>
                          <h4 className="mt-0.5 font-serif text-lg font-semibold text-foreground">
                            {cat.name}
                          </h4>
                          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
                            {cat.description}
                          </p>
                          <span className="mt-2 inline-flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-primary">
                            Explore <ArrowRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Link>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              ))}

              {/* Collections mega */}
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-9 bg-transparent px-2.5 text-[13px] font-medium tracking-wide",
                    linkColor,
                    "data-[state=open]:bg-transparent"
                  )}
                >
                  Collections
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="glass w-[560px] overflow-hidden rounded-2xl border border-gold/15 p-3 luxury-shadow">
                    <div className="mb-2 flex items-center gap-2 px-1">
                      <Sparkles className="h-3.5 w-3.5 text-gold" />
                      <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold">
                        Curated Edits
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      {COLLECTIONS.map((col) => (
                        <Link
                          key={col.id}
                          href={`/shop?collection=${col.slug}`}
                          className="group relative flex h-44 flex-col justify-end overflow-hidden rounded-xl p-3"
                        >
                          <img
                            src={col.image}
                            alt={col.name}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-primary/85 via-primary/30 to-transparent" />
                          <div className="relative">
                            <h5 className="font-serif text-base font-semibold text-white">
                              {col.name}
                            </h5>
                            <p className="mt-0.5 line-clamp-1 text-[10px] text-white/80">
                              {col.tagline}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>

              {/* Our Story */}
              <NavigationMenuItem>
                <NavigationMenuLink
                  asChild
                  className={cn(
                    navigationMenuTriggerStyle(),
                    "h-9 bg-transparent px-2.5 text-[13px] font-medium tracking-wide",
                    linkColor
                  )}
                >
                  <Link href="/story">Our Story</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right — actions */}
        <div className="flex items-center gap-0.5">
          {/* Currency switcher */}
          <button
            onClick={() => setCurrency(currency === "INR" ? "USD" : "INR")}
            aria-label={`Switch currency, currently ${currency}`}
            className={cn(
              "hidden rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-all sm:inline-flex",
              atTop
                ? "border-white/30 text-white hover:border-gold hover:text-gold"
                : "border-border text-foreground hover:border-gold hover:text-gold"
            )}
          >
            {currency}
          </button>
          <IconActionButton label="Search" onClick={openSearch} atTop={atTop}>
            <Search className="h-[18px] w-[18px]" />
          </IconActionButton>
          <IconActionButton
            label="Wishlist"
            onClick={openWishlist}
            badge={wishCount}
            atTop={atTop}
          >
            <Heart className="h-[18px] w-[18px]" />
          </IconActionButton>
          <IconActionButton
            label={customerUser ? customerUser.name : "Account"}
            onClick={() => (customerUser ? handleAccountClick() : openAuth("login"))}
            atTop={atTop}
          >
            {customerUser ? (
              <span className="text-[10px] font-bold uppercase">
                {customerUser.name.slice(0, 2)}
              </span>
            ) : (
              <User className="h-[18px] w-[18px]" />
            )}
          </IconActionButton>
          <IconActionButton
            label="Cart"
            onClick={openCart}
            badge={cartCount}
            atTop={atTop}
          >
            <ShoppingBag className="h-[18px] w-[18px]" />
          </IconActionButton>

          {/* Admin Login button — separate, always visible */}
          <Link
            href="/admin/login"
            className={cn(
              "ml-1 hidden items-center gap-1.5 rounded-full border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wide transition-all sm:flex",
              atTop
                ? "border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-primary"
                : "border-gold/40 bg-gold/10 text-gold hover:bg-gold hover:text-primary"
            )}
          >
            <Lock className="h-3 w-3" />
            Admin
          </Link>
        </div>
      </div>

      {/* Mobile menu */}
      <MobileMenu open={menuOpen} onOpenChange={setMenuOpen} atTop={atTop} />
    </motion.header>
  );
}

function MobileMenu({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  atTop: boolean;
}) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[88%] max-w-sm gap-0 border-r border-gold/15 bg-background p-0"
      >
        <SheetTitle className="sr-only">Main navigation</SheetTitle>
        <div className="flex h-full flex-col">
          {/* Header band */}
          <div className="flex flex-col gap-1 border-b border-gold/15 bg-primary px-6 py-7 text-primary-foreground">
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-3xl font-bold leading-none">
                {BRAND.name}
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gold">
                by IQRA
              </span>
            </div>
            <p className="text-xs tracking-wide text-primary-foreground/70">
              {BRAND.tagline}
            </p>
          </div>

          {/* Scrollable body */}
          <div className="scrollbar-lux flex-1 overflow-y-auto px-3 py-5">
            <SectionLabel>Shop</SectionLabel>
            <nav className="mt-2 flex flex-col">
              {CATEGORIES.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/shop?category=${cat.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors hover:bg-gold/5"
                >
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-serif text-base font-semibold text-foreground">
                      {cat.name}
                    </div>
                    <div className="line-clamp-1 text-[11px] text-muted-foreground">
                      {cat.description}
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-gold opacity-0 transition-opacity group-hover:opacity-100" />
                </Link>
              ))}
            </nav>

            <SectionLabel className="mt-7">Collections</SectionLabel>
            <div className="mt-2 flex flex-col gap-2">
              {COLLECTIONS.map((col) => (
                <Link
                  key={col.id}
                  href={`/shop?collection=${col.slug}`}
                  onClick={() => onOpenChange(false)}
                  className="group relative h-20 overflow-hidden rounded-xl"
                >
                  <img
                    src={col.image}
                    alt={col.name}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/85 to-primary/20" />
                  <div className="relative flex h-full flex-col justify-center px-4">
                    <span className="font-serif text-base font-semibold text-white">
                      {col.name}
                    </span>
                    <span className="text-[10px] uppercase tracking-wide text-gold">
                      {col.tagline}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            <SectionLabel className="mt-7">Maison</SectionLabel>
            <nav className="mt-2 flex flex-col">
              {[
                { href: "/story", label: "Our Heritage" },
                { href: "/artisans", label: "Artisan Stories" },
                { href: "/sustainability", label: "Sustainability" },
                { href: "/contact", label: "Contact" },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  onClick={() => onOpenChange(false)}
                  className="flex items-center justify-between rounded-xl px-3 py-3 text-sm text-foreground transition-colors hover:bg-gold/5 hover:text-primary"
                >
                  {l.label}
                  <ArrowRight className="h-3.5 w-3.5 text-gold" />
                </Link>
              ))}
            </nav>
          </div>

          {/* Footer band */}
          <div className="mt-auto border-t border-gold/15 bg-muted/40 px-6 py-5 text-xs text-muted-foreground">
            <div className="font-serif text-sm font-semibold text-primary">
              {BRAND.email}
            </div>
            <div className="mt-1">{BRAND.phone}</div>
            <div className="mt-1">{BRAND.address}</div>
          </div>
        </div>
        <SheetClose className="sr-only">Close</SheetClose>
      </SheetContent>
    </Sheet>
  );
}

function SectionLabel({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-gold",
        className
      )}
    >
      <span className="h-px w-5 bg-gold/50" />
      {children}
    </div>
  );
}

export default Header;
