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
  title: "ZARIYA by IQRA — Timeless Kashmiri Elegance | Luxury Pherans, Pashmina & Suits",
  description:
    "Shop handcrafted luxury Kashmiri fashion — pherans, pashmina shawls, embroidered suits & kaftans. 150+ years of artisan heritage. Free worldwide delivery. COD available.",
  keywords: [
    "ZARIYA",
    "ZARIYA by IQRA",
    "Kashmiri fashion",
    "luxury pheran",
    "pashmina shawl",
    "Kashmiri suits",
    "aari embroidery",
    "sozni embroidery",
    "handcrafted luxury",
    "Kashmiri clothing online",
    "designer pheran",
    "pashmina online India",
    "IQRA",
    "luxury ethnic wear",
    "Kashmiri heritage fashion",
  ],
  authors: [{ name: "ZARIYA by IQRA" }],
  creator: "ZARIYA by IQRA",
  publisher: "ZARIYA by IQRA",
  icons: { icon: "/logo.svg" },
  metadataBase: new URL("https://zariya.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ZARIYA by IQRA — Timeless Kashmiri Elegance",
    description:
      "Handcrafted luxury Kashmiri fashion. Pherans, pashmina shawls, embroidered suits & kaftans. 150+ years of artisan heritage.",
    siteName: "ZARIYA by IQRA",
    type: "website",
    locale: "en_IN",
    images: [
      {
        url: "/images/hero/hero-1.png",
        width: 768,
        height: 1344,
        alt: "ZARIYA luxury Kashmiri pheran",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ZARIYA by IQRA — Timeless Kashmiri Elegance",
    description: "Handcrafted luxury Kashmiri fashion. Pherans, pashmina & suits.",
    images: ["/images/hero/hero-1.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
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
