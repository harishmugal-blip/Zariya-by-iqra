"use client";

import dynamic from "next/dynamic";
import { AnnouncementBar } from "./announcement-bar";
import { Header } from "./header";
import { Footer } from "./footer";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { WhatsAppFab } from "./whatsapp-fab";
import { MicroInteractions } from "./micro-interactions";
import { LiveChat } from "./live-chat";
import { CompareBar } from "./compare-bar";
import { CompareDrawer } from "./compare-drawer";
import { WishlistImport } from "./wishlist-import";
import { CustomerAuthModal } from "./customer-auth-modal";

// Overlays — load lazily for fast initial paint
const QuickView = dynamic(() => import("./quick-view"), { ssr: false });
const ProductDetail = dynamic(() => import("./product-detail"), { ssr: false });
const CartDrawer = dynamic(() => import("./cart-drawer"), { ssr: false });
const SearchOverlay = dynamic(() => import("./search-overlay"), { ssr: false });
const WishlistDrawer = dynamic(() => import("./wishlist-drawer"), { ssr: false });
const CheckoutModal = dynamic(() => import("./checkout-modal"), { ssr: false });
const SizeGuideModal = dynamic(() => import("./size-guide-modal").then((m) => m.SizeGuideModal), { ssr: false });
const ReviewModal = dynamic(() => import("./review-modal").then((m) => m.ReviewModal), { ssr: false });

export function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative flex min-h-screen flex-col bg-background">
      <WishlistImport />
      <MicroInteractions />
      <AnnouncementBar />
      <Header />
      <div className="flex-1">{children}</div>
      <Footer />
      <MobileBottomNav />
      <WhatsAppFab />
      <LiveChat />
      <CompareBar />
      {/* Global overlays */}
      <QuickView />
      <ProductDetail />
      <CartDrawer />
      <SearchOverlay />
      <WishlistDrawer />
      <CheckoutModal />
      <SizeGuideModal />
      <ReviewModal />
      <CompareDrawer />
      <CustomerAuthModal />
    </div>
  );
}
