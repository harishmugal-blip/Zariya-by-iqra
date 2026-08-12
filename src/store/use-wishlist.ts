"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface WishlistState {
  ids: string[];
  isOpen: boolean;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  openWishlist: () => void;
  closeWishlist: () => void;
  count: () => number;
  importSlugs: (ids: string[]) => number;
}

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      isOpen: false,
      toggle: (id) =>
        set((s) => ({
          ids: s.ids.includes(id) ? s.ids.filter((x) => x !== id) : [...s.ids, id],
        })),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      openWishlist: () => set({ isOpen: true }),
      closeWishlist: () => set({ isOpen: false }),
      count: () => get().ids.length,
      importSlugs: (newIds) => {
        const existing = get().ids;
        const merged = [...new Set([...existing, ...newIds])];
        set({ ids: merged });
        return merged.length - existing.length;
      },
    }),
    { name: "zariya-wishlist", storage: createJSONStorage(() => localStorage) }
  )
);
