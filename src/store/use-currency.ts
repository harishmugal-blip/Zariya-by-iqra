"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type CurrencyCode = "INR" | "USD";

const RATES: Record<CurrencyCode, number> = {
  INR: 1,
  USD: 0.012, // 1 INR ≈ 0.012 USD
};

const SYMBOLS: Record<CurrencyCode, string> = {
  INR: "₹",
  USD: "$",
};

const LABELS: Record<CurrencyCode, string> = {
  INR: "INR",
  USD: "USD",
};

interface CurrencyState {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
  convert: (amountInr: number) => number;
  format: (amountInr: number) => string;
  symbol: () => string;
  label: () => string;
  rate: () => number;
}

export const useCurrency = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currency: "INR",
      setCurrency: (c) => set({ currency: c }),
      convert: (amountInr) => {
        const r = RATES[get().currency] || 1;
        return Math.round(amountInr * r);
      },
      format: (amountInr) => {
        const c = get().currency;
        const converted = get().convert(amountInr);
        if (c === "INR") {
          return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
          }).format(amountInr);
        }
        return new Intl.NumberFormat("en-US", {
          style: "currency",
          currency: "USD",
          maximumFractionDigits: 0,
        }).format(converted);
      },
      symbol: () => SYMBOLS[get().currency],
      label: () => LABELS[get().currency],
      rate: () => RATES[get().currency] || 1,
    }),
    { name: "zariya-currency", storage: createJSONStorage(() => localStorage) }
  )
);
