import type { Metadata } from "next";
import { Inter, Playfair_Display, Noto_Naskh_Arabic } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import { SiteChrome } from "@/components/zariya/site-chrome";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
});

// Kashmiri / Arabic script font for authentic glyphs
const naskh = Noto_Naskh_Arabic({
  variable: "--font-naskh",
  subsets: ["arabic"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ZARIYA by IQRA — Timeless Kashmiri Elegance",
  description:
    "Discover handcrafted luxury Kashmiri fashion — pherans, pashmina shawls, embroidered suits & kaftans. Heritage craftsmanship meets timeless elegance.",
  keywords: [
    "ZARIYA",
    "Kashmiri fashion",
    "luxury pheran",
    "pashmina shawl",
    "Kashmiri suits",
    "aari embroidery",
    "handcrafted luxury",
    "IQRA",
  ],
  authors: [{ name: "ZARIYA by IQRA" }],
  icons: { icon: "/logo.svg" },
  openGraph: {
    title: "ZARIYA by IQRA — Timeless Kashmiri Elegance",
    description:
      "Handcrafted luxury Kashmiri fashion. Pherans, pashmina shawls, embroidered suits & kaftans.",
    siteName: "ZARIYA by IQRA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ZARIYA by IQRA — Timeless Kashmiri Elegance",
    description: "Handcrafted luxury Kashmiri fashion.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${playfair.variable} ${naskh.variable} antialiased bg-background text-foreground font-sans`}
      >
        <SiteChrome>{children}</SiteChrome>
        <Toaster />
        <SonnerToaster position="top-center" richColors />
      </body>
    </html>
  );
}
