"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Camera } from "lucide-react";
import { useUI } from "@/store/use-ui";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Look {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  productSlug: string;
  size: "tall" | "wide" | "square";
  category: string;
}

const LOOKS: Look[] = [
  {
    id: "l1",
    title: "The Burgundy Muse",
    subtitle: "Editorial · Shahzadi Pheran",
    image: "/images/lifestyle/model-1.png",
    productSlug: "shahzadi-pheran-burgundy",
    size: "tall",
    category: "Heritage",
  },
  {
    id: "l2",
    title: "Champagne Evenings",
    subtitle: "Resort · Zeba Kaftan",
    image: "/images/lifestyle/model-2.png",
    productSlug: "zeba-champagne-kaftan",
    size: "tall",
    category: "Ivory Dreams",
  },
  {
    id: "l3",
    title: "Gold Thread Diary",
    subtitle: "Detail · Aari Embroidery",
    image: "/images/lifestyle/insta-3.png",
    productSlug: "shahzadi-pheran-burgundy",
    size: "square",
    category: "Craft",
  },
  {
    id: "l4",
    title: "The Valley at Dawn",
    subtitle: "Heritage · Kashmir",
    image: "/images/lifestyle/heritage.png",
    productSlug: "noor-pashmina-shawl-gold",
    size: "wide",
    category: "Origin",
  },
  {
    id: "l5",
    title: "Burgundy & Gold",
    subtitle: "Flat Lay · Accessories",
    image: "/images/lifestyle/insta-1.png",
    productSlug: "noor-pashmina-shawl-gold",
    size: "square",
    category: "Styling",
  },
  {
    id: "l6",
    title: "Whisper of Pashmina",
    subtitle: "Styled · Noor Shawl",
    image: "/images/lifestyle/insta-2.png",
    productSlug: "noor-pashmina-shawl-gold",
    size: "wide",
    category: "Styling",
  },
];

const sizeClass: Record<Look["size"], string> = {
  tall: "md:row-span-2 aspect-[3/4]",
  wide: "md:col-span-2 aspect-[16/10]",
  square: "aspect-square",
};

export function Lookbook() {
  const openProduct = useUI((s) => s.openProduct);

  return (
    <section id="lookbook" className="relative overflow-hidden bg-primary py-20 text-primary-foreground sm:py-28">
      {/* decorative */}
      <div className="pointer-events-none absolute -left-32 top-1/4 h-80 w-80 rounded-full bg-gold/8 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-champagne/8 blur-3xl" aria-hidden />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              <Camera className="h-3.5 w-3.5" /> The Lookbook
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              A Visual Diary
            </h2>
            <p className="mt-3 max-w-xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              Editorials, details, and moments from the atelier. Tap any image
              to discover the piece behind the story.
            </p>
          </div>
        </motion.div>

        {/* Magazine grid */}
        <div className="mt-12 grid auto-rows-auto grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
          {LOOKS.map((look, i) => (
            <motion.button
              key={look.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
              whileHover={{ y: -4 }}
              onClick={() => openProduct(look.productSlug)}
              className={`group relative overflow-hidden rounded-2xl ${sizeClass[look.size]}`}
            >
              <img
                src={look.image}
                alt={look.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              {/* overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />

              {/* category badge */}
              <span className="absolute left-3 top-3 rounded-full glass-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-charcoal backdrop-blur-md">
                {look.category}
              </span>

              {/* arrow on hover */}
              <span className="absolute right-3 top-3 grid h-8 w-8 translate-y-1 place-items-center rounded-full bg-gold text-primary opacity-0 transition-all group-hover:translate-y-0 group-hover:opacity-100">
                <ArrowUpRight className="h-4 w-4" />
              </span>

              {/* content */}
              <div className="absolute inset-x-0 bottom-0 p-4">
                <p className="text-[10px] uppercase tracking-wide text-gold">
                  {look.subtitle}
                </p>
                <h3 className="mt-0.5 font-serif text-lg font-bold leading-tight text-primary-foreground">
                  {look.title}
                </h3>
              </div>
            </motion.button>
          ))}
        </div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-10 text-center text-xs text-primary-foreground/50"
        >
          Photographed in Srinagar, Kashmir · Styling &amp; creative direction
          by the ZARIYA atelier
        </motion.p>
      </div>
    </section>
  );
}
