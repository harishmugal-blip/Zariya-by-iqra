"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { CartItem, Product } from "@/lib/types";

interface CartState {
  items: CartItem[];
  couponCode: string | null;
  isOpen: boolean;
  addItem: (product: Product, opts: { color: string; size: string; quantity?: number }) => void;
  removeItem: (productId: string, color: string, size: string) => void;
  updateQuantity: (productId: string, color: string, size: string, quantity: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
  applyCoupon: (code: string) => void;
  removeCoupon: () => void;
  subtotal: () => number;
  count: () => number;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      couponCode: null,
      isOpen: false,
      addItem: (product, opts) => {
        const color = opts.color || product.colors[0]?.name || "Default";
        const size = opts.size || product.sizes[0] || "One Size";
        const quantity = opts.quantity ?? 1;
        const items = [...get().items];
        const idx = items.findIndex(
          (i) => i.productId === product.id && i.color === color && i.size === size
        );
        if (idx >= 0) {
          items[idx] = {
            ...items[idx],
            quantity: Math.min(items[idx].quantity + quantity, product.stock),
          };
        } else {
          items.push({
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: product.price,
            image: product.images[0]?.src || "/images/placeholder.png",
            color,
            size,
            quantity,
            stock: product.stock,
          });
        }
        set({ items, isOpen: true });
      },
      removeItem: (productId, color, size) =>
        set({
          items: get().items.filter(
            (i) => !(i.productId === productId && i.color === color && i.size === size)
          ),
        }),
      updateQuantity: (productId, color, size, quantity) =>
        set({
          items: get()
            .items.map((i) =>
              i.productId === productId && i.color === color && i.size === size
                ? { ...i, quantity: Math.max(1, Math.min(quantity, i.stock)) }
                : i
            )
            .filter((i) => i.quantity > 0),
        }),
      clear: () => set({ items: [], couponCode: null }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((s) => ({ isOpen: !s.isOpen })),
      applyCoupon: (code) => set({ couponCode: code.toUpperCase() }),
      removeCoupon: () => set({ couponCode: null }),
      subtotal: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "zariya-cart", storage: createJSONStorage(() => localStorage) }
  )
);
