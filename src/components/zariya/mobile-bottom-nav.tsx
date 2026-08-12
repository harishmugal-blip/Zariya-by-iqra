"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Home, LayoutGrid, Search, Heart, ShoppingBag } from "lucide-react";
import { useCart } from "@/store/use-cart";
import { useWishlist } from "@/store/use-wishlist";
import { useUI } from "@/store/use-ui";
import { cn } from "@/lib/utils";

const LUX_EASE = [0.22, 1, 0.36, 1] as const;

interface NavItem {
  key: string;
  label: string;
  Icon: typeof Home;
  href?: string;
  onClick?: () => void;
  badge?: number;
}

export function MobileBottomNav() {
  const pathname = usePathname();
  const openSearch = useUI((s) => s.openSearch);
  const setFiltersOpen = useUI((s) => s.setFiltersOpen);
  const openCart = useCart((s) => s.openCart);
  const openWishlist = useWishlist((s) => s.openWishlist);
  const cartCount = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);

  const items: NavItem[] = [
    { key: "home", label: "Home", Icon: Home, href: "/" },
    { key: "shop", label: "Shop", Icon: LayoutGrid, onClick: () => setFiltersOpen(true) },
    { key: "search", label: "Search", Icon: Search, onClick: openSearch },
    { key: "wishlist", label: "Wishlist", Icon: Heart, onClick: openWishlist, badge: wishCount },
    { key: "cart", label: "Bag", Icon: ShoppingBag, onClick: openCart, badge: cartCount },
  ];

  const isActive = (item: NavItem) => {
    if (item.key === "home") return pathname === "/";
    if (item.key === "shop") return pathname.startsWith("/shop");
    return false;
  };

  return (
    <nav
      aria-label="Mobile navigation"
      className="fixed inset-x-0 bottom-0 z-40 lg:hidden"
      style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
    >
      <div className="glass border-t border-gold/20 luxury-shadow">
        <ul className="mx-auto flex max-w-md items-stretch justify-around px-1">
          {items.map((item) => {
            const active = isActive(item);
            const isAction = !!item.onClick;
            const Tag: React.ElementType = item.href ? Link : "button";
            return (
              <li key={item.key} className="flex-1">
                <Tag
                  {...(item.href
                    ? { href: item.href, "aria-label": item.label }
                    : {
                        type: "button" as const,
                        onClick: item.onClick,
                        "aria-label": item.label,
                      })}
                  className={cn(
                    "relative flex w-full flex-col items-center justify-center gap-1 py-2.5",
                    active ? "text-primary" : "text-foreground/70"
                  )}
                >
                  <span className="relative">
                    <item.Icon
                      className={cn(
                        "h-[18px] w-[18px] transition-transform",
                        active && "scale-110"
                      )}
                    />
                    {item.badge !== undefined && item.badge > 0 && (
                      <motion.span
                        key={item.badge}
                        initial={{ scale: 0.5, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.3, ease: LUX_EASE }}
                        className="absolute -right-2 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full bg-gold px-0.5 text-[8px] font-bold leading-none text-charcoal"
                      >
                        {item.badge > 9 ? "9+" : item.badge}
                      </motion.span>
                    )}
                  </span>
                  <span
                    className={cn(
                      "text-[9px] font-medium uppercase tracking-wide",
                      active && "font-semibold"
                    )}
                  >
                    {item.label}
                  </span>
                  {active && (
                    <motion.span
                      layoutId="bottom-nav-underline"
                      className="absolute bottom-0 h-0.5 w-8 rounded-full bg-gold"
                      transition={{ duration: 0.35, ease: LUX_EASE }}
                    />
                  )}
                  {/* Subtle hover affordance for action buttons (link tags handle themselves) */}
                  {isAction && (
                    <span className="pointer-events-none absolute inset-0 rounded-xl transition-colors hover:bg-gold/5" />
                  )}
                </Tag>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

export default MobileBottomNav;
