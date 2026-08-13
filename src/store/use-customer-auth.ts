"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CustomerUser {
  email: string;
  name: string;
  image?: string;
}

interface CustomerAuthState {
  user: CustomerUser | null;
  isOpen: boolean;
  mode: "login" | "signup";
  setUser: (user: CustomerUser | null) => void;
  logout: () => void;
  openAuth: (mode?: "login" | "signup") => void;
  closeAuth: () => void;
  setMode: (mode: "login" | "signup") => void;
}

export const useCustomerAuth = create<CustomerAuthState>()(
  persist(
    (set) => ({
      user: null,
      isOpen: false,
      mode: "login",
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
      openAuth: (mode = "login") => set({ isOpen: true, mode }),
      closeAuth: () => set({ isOpen: false }),
      setMode: (mode) => set({ mode }),
    }),
    { name: "zariya-customer-auth", storage: createJSONStorage(() => localStorage) }
  )
);
