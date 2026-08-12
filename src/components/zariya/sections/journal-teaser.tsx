"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Clock, ArrowRight, ArrowUpRight } from "lucide-react";
import { JOURNAL_ARTICLES } from "@/data/catalog";

const EASE = [0.22, 1, 0.36, 1] as const;

export function JournalTeaser() {
  const featured = JOURNAL_ARTICLES.find((a) => a.featured) || JOURNAL_ARTICLES[0];
  const others = JOURNAL_ARTICLES.filter((a) => a.id !== featured.id).slice(0, 3);

  return (
    <section id="journal" className="relative overflow-hidden bg-muted/20 py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: EASE }}
          className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end"
        >
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.4em] text-gold">
              The Journal
            </span>
            <h2 className="mt-3 font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl">
              Stories from the Atelier
            </h2>
            <p className="mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
              Heritage, craft, and the women behind the thread. Slow stories
              for a slower kind of luxury.
            </p>
          </div>
          <Link
            href="/journal"
            className="group flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold uppercase tracking-wide text-foreground transition-all hover:border-gold hover:text-gold"
          >
            All Stories
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </motion.div>

        {/* Featured + others */}
        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          {/* Featured */}
          <motion.article
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.7, ease: EASE }}
            className="group relative cursor-pointer overflow-hidden rounded-3xl luxury-shadow"
            onClick={() => (window.location.href = `/journal/${featured.slug}`)}
          >
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[16/10]">
              <img
                src={featured.image}
                alt={featured.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-[1200ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/40 to-transparent" />
              <span className="absolute left-4 top-4 rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-primary">
                Featured · {featured.category}
              </span>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
              <div className="flex items-center gap-2 text-[11px] text-primary-foreground/70">
                <Clock className="h-3 w-3" /> {featured.readTime}
                <span>·</span>
                <span>
                  {new Date(featured.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>
              <h3 className="mt-2 font-serif text-2xl font-bold leading-tight text-primary-foreground sm:text-3xl">
                {featured.title}
              </h3>
              <p className="mt-2 line-clamp-2 text-sm text-primary-foreground/70">
                {featured.excerpt}
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-gold">
                Read Story <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </motion.article>

          {/* Others */}
          <div className="flex flex-col gap-4">
            {others.map((article, i) => (
              <motion.article
                key={article.id}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.6, delay: i * 0.1, ease: EASE }}
                className="group flex cursor-pointer gap-4 overflow-hidden rounded-2xl border border-border bg-card p-3 transition-all hover:luxury-shadow"
                onClick={() => (window.location.href = `/journal/${article.slug}`)}
              >
                <div className="relative h-24 w-24 flex-none overflow-hidden rounded-xl sm:h-28 sm:w-32">
                  <img
                    src={article.image}
                    alt={article.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col justify-center">
                  <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
                    <span className="font-semibold uppercase tracking-wide text-gold">
                      {article.category}
                    </span>
                    <span>·</span>
                    <span className="flex items-center gap-0.5">
                      <Clock className="h-2.5 w-2.5" /> {article.readTime}
                    </span>
                  </div>
                  <h3 className="mt-1 font-serif text-base font-bold leading-snug text-foreground line-clamp-2 transition-colors group-hover:text-primary">
                    {article.title}
                  </h3>
                  <span className="mt-1 text-[11px] text-muted-foreground">
                    {article.author}
                  </span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
