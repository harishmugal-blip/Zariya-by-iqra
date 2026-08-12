"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CompareState {
  ids: string[];
  isOpen: boolean;
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  remove: (id: string) => void;
  clear: () => void;
  openCompare: () => void;
  closeCompare: () => void;
  count: () => number;
  canAdd: () => boolean;
}

const MAX_COMPARE = 3;

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      isOpen: false,
      toggle: (id) =>
        set((s) => {
          if (s.ids.includes(id)) {
            return { ids: s.ids.filter((x) => x !== id) };
          }
          if (s.ids.length >= MAX_COMPARE) return s;
          return { ids: [...s.ids, id] };
        }),
      has: (id) => get().ids.includes(id),
      remove: (id) => set((s) => ({ ids: s.ids.filter((x) => x !== id) })),
      clear: () => set({ ids: [] }),
      openCompare: () => set({ isOpen: true }),
      closeCompare: () => set({ isOpen: false }),
      count: () => get().ids.length,
      canAdd: () => get().ids.length < MAX_COMPARE,
    }),
    { name: "zariya-compare", storage: createJSONStorage(() => localStorage) }
  )
);
