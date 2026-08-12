"use client";

import { motion } from "framer-motion";
import { Instagram, Eye } from "lucide-react";
import { BRAND } from "@/data/catalog";

const IMAGES = [
  { src: "/images/lifestyle/insta-1.png", caption: "The Sahiba suit, ivory & burgundy aari" },
  { src: "/images/lifestyle/insta-2.png", caption: "Mehak pashmina, blush & gold border" },
  { src: "/images/lifestyle/model-1.png", caption: "Roohani pheran, royal blue zari" },
  { src: "/images/lifestyle/insta-3.png", caption: "Embroidery close-up — sozni in motion" },
  { src: "/images/lifestyle/insta-4.png", caption: "Dilruba emerald, kani paisley border" },
  { src: "/images/lifestyle/model-2.png", caption: "Zeba kaftan, champagne flow" },
];

export default function InstagramGallery() {
  return (
    <section
      aria-label="Instagram gallery"
      className="bg-muted/40 py-20 md:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mb-12 max-w-2xl text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <Instagram className="h-3.5 w-3.5" />
            @zariya.by.iqra
          </span>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            Follow @zariya.by.iqra
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Behind-the-scenes from the atelier, styling ideas and stories from our community.
          </p>
        </motion.div>

        {/* Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-6"
        >
          {IMAGES.map((img, i) => (
            <motion.a
              key={img.src + i}
              href={BRAND.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`View Instagram post: ${img.caption}`}
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
                },
              }}
              className="group relative aspect-square overflow-hidden rounded-xl bg-card luxury-shadow md:rounded-2xl"
            >
              <img
                src={img.src}
                alt={img.caption}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[900ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
              />
              {/* Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-primary/70 opacity-0 backdrop-blur-sm transition-opacity duration-500 group-hover:opacity-100">
                <Instagram className="h-6 w-6 text-gold" />
                <span className="flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-ivory">
                  <Eye className="h-3 w-3" /> View Post
                </span>
              </div>
            </motion.a>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="mt-10 flex justify-center"
        >
          <a
            href={BRAND.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/5 px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-gold transition-all hover:bg-gold hover:text-charcoal"
          >
            <Instagram className="h-4 w-4" />
            Follow on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
