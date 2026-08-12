import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency: string = "INR") {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatNumber(n: number) {
  return new Intl.NumberFormat("en-IN").format(n);
}

export function discountPercent(price: number, compareAt?: number) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function slugify(s: string) {
  return s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

export function buildWhatsAppOrderMessage(opts: {
  items: { name: string; color?: string; size?: string; qty: number; price: number }[];
  total: number;
  customerName?: string;
  couponCode?: string;
}) {
  const lines = opts.items.map(
    (it, i) =>
      `${i + 1}. ${it.name}${it.color ? ` (${it.color}` : ""}${it.size ? `${it.color ? ", " : "("}${it.size}` : ""}${it.color || it.size ? ")" : ""} × ${it.qty} — ₹${it.price.toLocaleString("en-IN")}`
  );
  const msg = [
    "*ZARIYA by IQRA — New Order*",
    "",
    "Namaste! I would like to place an order:",
    "",
    lines.join("\n"),
    "",
    `*Subtotal:* ₹${opts.total.toLocaleString("en-IN")}`,
    opts.couponCode ? `*Coupon applied:* ${opts.couponCode}` : "",
    opts.customerName ? `*Name:* ${opts.customerName}` : "",
    "",
    "Please confirm availability, total & dispatch. Thank you.",
  ]
    .filter(Boolean)
    .join("\n");
  return msg;
}

export function buildProductWhatsAppMessage(opts: {
  name: string;
  price: number;
  color?: string;
  size?: string;
  slug: string;
}) {
  const parts = [
    "*ZARIYA by IQRA — Product Enquiry*",
    "",
    `*Product:* ${opts.name}`,
    `*Price:* ₹${opts.price.toLocaleString("en-IN")}`,
    opts.color ? `*Colour:* ${opts.color}` : "",
    opts.size ? `*Size:* ${opts.size}` : "",
    "",
    "Namaste! I am interested in this piece. Could you please share availability and dispatch details? Thank you.",
  ].filter(Boolean);
  return parts.join("\n");
}

export function whatsappLink(phone: string, message: string) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function initials(name: string) {
  return name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function clamp(n: number, min: number, max: number) {
  return Math.min(Math.max(n, min), max);
}
