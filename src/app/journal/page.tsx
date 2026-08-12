"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, Clock, ArrowRight, Search } from "lucide-react";
import { JOURNAL_ARTICLES, BRAND } from "@/data/catalog";
import { useUI } from "@/store/use-ui";
import { cn } from "@/lib/utils";

const CATEGORIES = ["All", "Heritage", "Craft", "Style", "People", "Journal"] as const;
const EASE = [0.22, 1, 0.36, 1] as const;

export default function JournalPage() {
  const [category, setCategory] = useState<(typeof CATEGORIES)[number]>("All");
  const [query, setQuery] = useState("");
  const openProduct = useUI((s) => s.openProduct);

  const featured = JOURNAL_ARTICLES.find((a) => a.featured) || JOURNAL_ARTICLES[0];

  const filtered = useMemo(() => {
    return JOURNAL_ARTICLES.filter((a) => {
      const matchCat = category === "All" || a.category === category;
      const q = query.toLowerCase();
      const matchQuery =
        !q ||
        a.title.toLowerCase().includes(q) ||
        a.excerpt.toLowerCase().includes(q) ||
        a.author.toLowerCase().includes(q);
      return matchCat && matchQuery;
    });
  }, [category, query]);

  return (
    <main className="min-h-screen bg-background">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-16 text-primary-foreground sm:py-20">
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-gold/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-champagne/10 blur-3xl" />
        <div className="mx-auto max-w-5xl px-4 text-center sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
          >
            <Link
              href="/"
              className="mb-6 inline-flex items-center gap-1.5 rounded-full border border-white/20 px-3 py-1.5 text-xs font-medium text-primary-foreground/80 transition-all hover:border-gold hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Back to Storefront
            </Link>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              The ZARIYA Journal
            </span>
            <h1 className="mt-3 font-serif text-4xl font-bold sm:text-6xl">
              Stories from the Atelier
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-primary-foreground/70 sm:text-base">
              Heritage, craft, style, and the women behind the thread. Slow
              stories for a slower kind of luxury — told the way Kashmiri
              stories have always been told: by hand, and from the heart.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Featured article */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
        <motion.article
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: EASE }}
          className="group grid cursor-pointer overflow-hidden rounded-3xl border border-border bg-card luxury-shadow lg:grid-cols-2"
          onClick={() => (window.location.href = `/journal/${featured.slug}`)}
        >
          <div className="relative aspect-[4/3] overflow-hidden lg:aspect-auto">
            <img
              src={featured.image}
              alt={featured.title}
              className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/40 to-transparent" />
            <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
              Featured
            </span>
          </div>
          <div className="flex flex-col justify-center p-8 sm:p-12">
            <div className="flex items-center gap-3 text-xs text-muted-foreground">
              <span className="font-semibold uppercase tracking-wide text-gold">
                {featured.category}
              </span>
              <span>·</span>
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" /> {featured.readTime}
              </span>
            </div>
            <h2 className="mt-3 font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
              {featured.title}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {featured.excerpt}
            </p>
            <div className="mt-6 flex items-center justify-between">
              <div>
                <p className="font-serif text-sm font-semibold text-foreground">
                  {featured.author}
                </p>
                <p className="text-xs text-muted-foreground">{featured.authorRole}</p>
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-primary transition-transform group-hover:translate-x-1">
                Read Story <ArrowRight className="h-3.5 w-3.5" />
              </span>
            </div>
          </div>
        </motion.article>
      </section>

      {/* Filters + grid */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((c) => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all",
                  category === c
                    ? "bg-primary text-primary-foreground"
                    : "border border-border text-muted-foreground hover:border-gold/50 hover:text-foreground"
                )}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="relative sm:w-64">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search stories…"
              className="w-full rounded-full border border-border bg-card py-2 pl-10 pr-4 text-sm outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
            />
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="grid place-items-center rounded-3xl border border-dashed border-border py-20 text-center">
            <p className="font-serif text-lg font-semibold text-muted-foreground">
              No stories found
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              Try a different category or search term.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                whileHover={{ y: -6 }}
                className="group cursor-pointer overflow-hidden rounded-2xl border border-border bg-card transition-shadow hover:luxury-shadow"
                onClick={() => (window.location.href = `/journal/${article.slug}`)}
              >
                <div className="relative aspect-[3/2] overflow-hidden">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                  <span className="absolute left-3 top-3 rounded-full glass-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-charcoal">
                    {article.category}
                  </span>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {article.readTime}
                    </span>
                    <span>·</span>
                    <span>
                      {new Date(article.date).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                  </div>
                  <h3 className="mt-2 font-serif text-xl font-bold leading-snug text-foreground transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">
                    {article.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-border pt-3">
                    <span className="text-xs font-medium text-foreground">
                      {article.author}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gold transition-transform group-hover:translate-x-1">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
