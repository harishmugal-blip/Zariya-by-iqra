"use client";

import { create } from "zustand";

interface UIState {
  // Search
  searchOpen: boolean;
  openSearch: () => void;
  closeSearch: () => void;
  toggleSearch: () => void;

  // Mobile menu
  menuOpen: boolean;
  setMenuOpen: (v: boolean) => void;

  // Quick view / product detail
  activeProductSlug: string | null;
  activeVariant: "quick" | "full" | null;
  openQuickView: (slug: string) => void;
  openProduct: (slug: string) => void;
  closeProduct: () => void;

  // Checkout
  checkoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;

  // Filters (mobile)
  filtersOpen: boolean;
  setFiltersOpen: (v: boolean) => void;

  // Recently viewed
  recentlyViewed: string[];
  pushRecent: (slug: string) => void;

  // Size guide modal
  sizeGuideOpen: boolean;
  sizeGuideCategory: string | null;
  openSizeGuide: (category?: string) => void;
  closeSizeGuide: () => void;

  // Write review modal
  reviewModalOpen: boolean;
  reviewProductSlug: string | null;
  openReviewModal: (slug: string) => void;
  closeReviewModal: () => void;
}

export const useUI = create<UIState>((set, get) => ({
  searchOpen: false,
  openSearch: () => set({ searchOpen: true }),
  closeSearch: () => set({ searchOpen: false }),
  toggleSearch: () => set((s) => ({ searchOpen: !s.searchOpen })),

  menuOpen: false,
  setMenuOpen: (v) => set({ menuOpen: v }),

  activeProductSlug: null,
  activeVariant: null,
  openQuickView: (slug) => set({ activeProductSlug: slug, activeVariant: "quick" }),
  openProduct: (slug) => {
    get().pushRecent(slug);
    set({ activeProductSlug: slug, activeVariant: "full" });
  },
  closeProduct: () => set({ activeProductSlug: null, activeVariant: null }),

  checkoutOpen: false,
  openCheckout: () => set({ checkoutOpen: true }),
  closeCheckout: () => set({ checkoutOpen: false }),

  filtersOpen: false,
  setFiltersOpen: (v) => set({ filtersOpen: v }),

  recentlyViewed: [],
  pushRecent: (slug) =>
    set((s) => ({
      recentlyViewed: [slug, ...s.recentlyViewed.filter((x) => x !== slug)].slice(0, 8),
    })),

  sizeGuideOpen: false,
  sizeGuideCategory: null,
  openSizeGuide: (category) =>
    set({ sizeGuideOpen: true, sizeGuideCategory: category || null }),
  closeSizeGuide: () => set({ sizeGuideOpen: false, sizeGuideCategory: null }),

  reviewModalOpen: false,
  reviewProductSlug: null,
  openReviewModal: (slug) => set({ reviewModalOpen: true, reviewProductSlug: slug }),
  closeReviewModal: () => set({ reviewModalOpen: false, reviewProductSlug: null }),
}));
