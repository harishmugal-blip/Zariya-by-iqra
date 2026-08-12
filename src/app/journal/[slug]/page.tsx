"use client";

import { use, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, ArrowRight, Share2, Check } from "lucide-react";
import { JOURNAL_ARTICLES, PRODUCTS, BRAND } from "@/data/catalog";
import { useUI } from "@/store/use-ui";
import { useCart } from "@/store/use-cart";
import { cn, formatPrice, whatsappLink } from "@/lib/utils";
import { Stars } from "@/components/zariya/stars";
import { WhatsAppIcon } from "@/components/zariya/product-card";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const article = JOURNAL_ARTICLES.find((a) => a.slug === slug);
  const [copied, setCopied] = useState(false);
  const openProduct = useUI((s) => s.openProduct);

  if (!article) notFound();

  const related = JOURNAL_ARTICLES.filter(
    (a) => a.id !== article.id && a.category === article.category
  ).slice(0, 3);

  const relatedProducts = (article.productSlugs || [])
    .map((s) => PRODUCTS.find((p) => p.slug === s))
    .filter(Boolean)
    .slice(0, 3);

  const share = async () => {
    const url = typeof window !== "undefined" ? window.location.href : "";
    if (navigator.share) {
      try {
        await navigator.share({ title: article.title, url });
        return;
      } catch {}
    }
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success("Link copied to clipboard");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Hero with image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden">
        <img
          src={article.image}
          alt={article.title}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/60 to-primary/20" />
        <div className="relative mx-auto flex h-full max-w-4xl flex-col justify-end px-4 pb-12 sm:px-6 sm:pb-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <Link
              href="/journal"
              className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 backdrop-blur-sm transition-all hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> All Stories
            </Link>
            <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              {article.category}
            </span>
            <h1 className="mt-4 max-w-3xl font-serif text-3xl font-bold leading-tight text-primary-foreground sm:text-5xl">
              {article.title}
            </h1>
            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs text-primary-foreground/70">
              <div>
                <p className="font-serif text-sm font-semibold text-gold">
                  {article.author}
                </p>
                <p>{article.authorRole}</p>
              </div>
              <span className="hidden sm:inline">·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {article.readTime}
              </span>
              <span className="hidden sm:inline">·</span>
              <span>
                {new Date(article.date).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Body */}
      <article className="mx-auto max-w-3xl px-4 py-12 sm:px-6 sm:py-16">
        {/* Share bar */}
        <div className="mb-8 flex items-center justify-between border-b border-border pb-4">
          <p className="font-serif text-sm italic text-muted-foreground">
            {article.excerpt}
          </p>
          <button
            onClick={share}
            aria-label="Share article"
            className="ml-4 flex flex-none items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-foreground transition-all hover:border-gold hover:text-gold"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald" /> : <Share2 className="h-3.5 w-3.5" />}
            {copied ? "Copied" : "Share"}
          </button>
        </div>

        <div className="space-y-6">
          {article.body.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.6, delay: i * 0.05, ease: EASE }}
              className={cn(
                "text-base leading-[1.9] text-foreground/85",
                i === 0 && "first-letter:float-left first-letter:mr-3 first-letter:font-serif first-letter:text-6xl first-letter:font-bold first-letter:text-primary first-letter:leading-[0.85]"
              )}
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* WhatsApp discuss */}
        <div className="mt-10 rounded-2xl bg-primary/5 p-5 text-center">
          <p className="font-serif text-sm font-semibold text-foreground">
            Have a thought on this story?
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            We love hearing from our readers.
          </p>
          <a
            href={whatsappLink(
              BRAND.whatsapp,
              `Namaste! I read "${article.title}" on the ZARIYA Journal and wanted to share my thoughts.`
            )}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-emerald px-5 py-2 text-xs font-semibold text-white transition-all hover:scale-105 active:scale-95"
          >
            <WhatsAppIcon className="h-3.5 w-3.5" /> Discuss on WhatsApp
          </a>
        </div>

        {/* Related products */}
        {relatedProducts.length > 0 && (
          <div className="mt-12">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              Pieces from this story
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              The heirlooms mentioned in this article.
            </p>
            <div className="mt-5 grid gap-4 sm:grid-cols-3">
              {relatedProducts.map((p) => (
                <div
                  key={p!.id}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:luxury-shadow"
                  onClick={() => openProduct(p!.slug)}
                >
                  <div className="aspect-[3/4] overflow-hidden">
                    <img
                      src={p!.images[0]?.src}
                      alt={p!.name}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-3">
                    <p className="text-[9px] uppercase tracking-wide text-gold">
                      {p!.category}
                    </p>
                    <p className="mt-0.5 font-serif text-sm font-semibold text-foreground line-clamp-1">
                      {p!.name}
                    </p>
                    <p className="mt-1 text-sm font-bold text-primary">
                      {formatPrice(p!.price)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </article>

      {/* More stories */}
      {related.length > 0 && (
        <section className="border-t border-border bg-muted/20 py-12">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif text-2xl font-bold text-foreground">
              More from {article.category}
            </h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {related.map((a, i) => (
                <motion.article
                  key={a.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
                  className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card"
                  onClick={() => (window.location.href = `/journal/${a.slug}`)}
                >
                  <div className="relative aspect-[3/2] overflow-hidden">
                    <img
                      src={a.image}
                      alt={a.title}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <span className="absolute left-3 top-3 rounded-full glass-gold px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide text-charcoal">
                      {a.category}
                    </span>
                  </div>
                  <div className="p-4">
                    <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                      <Clock className="h-3 w-3" /> {a.readTime}
                    </div>
                    <h3 className="mt-1.5 font-serif text-base font-bold leading-snug text-foreground group-hover:text-primary">
                      {a.title}
                    </h3>
                    <span className="mt-2 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gold">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
