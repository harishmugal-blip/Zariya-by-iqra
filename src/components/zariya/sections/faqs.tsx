"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { Plus, MessageCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { FAQS, BRAND } from "@/data/catalog";
import { whatsappLink } from "@/lib/utils";

export default function FAQs() {
  const groups = useMemo(() => {
    const map = new Map<string, typeof FAQS>();
    for (const f of FAQS) {
      const arr = map.get(f.category) ?? [];
      arr.push(f);
      map.set(f.category, arr);
    }
    return Array.from(map.entries());
  }, []);

  const conciergeHref = whatsappLink(
    BRAND.whatsapp,
    "Namaste ZARIYA! I have a question I'd like to ask your concierge."
  );

  return (
    <section
      aria-label="Frequently asked questions"
      className="bg-background py-20 md:py-28"
    >
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="mb-12 text-center"
        >
          <span className="mb-3 inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.3em] text-gold">
            <span className="h-px w-6 bg-gold/60" />
            Concierge
            <span className="h-px w-6 bg-gold/60" />
          </span>
          <h2 className="font-serif text-3xl font-semibold text-foreground sm:text-4xl md:text-5xl">
            Questions, Answered
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            Everything you need to know about ordering, craftsmanship, care and returns.
          </p>
        </motion.div>

        {/* Grouped accordions */}
        <motion.div
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col gap-8"
        >
          {groups.map(([category, items]) => (
            <div key={category}>
              <h3 className="mb-3 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-gold">
                <span className="h-px w-5 bg-gold/60" />
                {category}
              </h3>
              <Accordion type="single" collapsible className="flex flex-col gap-2">
                {items.map((f, i) => (
                  <AccordionItem
                    key={`${category}-${i}`}
                    value={`${category}-${i}`}
                    className="overflow-hidden rounded-xl border border-border bg-card luxury-shadow data-[state=open]:border-gold/40"
                  >
                    <AccordionTrigger className="group px-5 py-4 text-left font-serif text-base font-semibold text-foreground hover:no-underline hover:text-primary data-[state=open]:text-primary">
                      <span className="flex-1 pr-2">{f.q}</span>
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full border border-gold/30 text-gold transition-all duration-300 group-data-[state=open]:rotate-45 group-data-[state=open]:bg-gold group-data-[state=open]:text-charcoal">
                        <Plus className="h-4 w-4" />
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted-foreground">
                      {f.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mt-12 flex flex-col items-center gap-4 rounded-2xl border border-gold/20 bg-card p-6 text-center luxury-shadow sm:p-8"
        >
          <p className="font-serif text-xl font-semibold text-foreground">
            Still have questions?
          </p>
          <p className="max-w-md text-sm text-muted-foreground">
            Our concierge is available every day from 10am to 8pm IST — happy to help with sizing, care,
            orders and more.
          </p>
          <a
            href={conciergeHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-emerald px-6 py-3 text-sm font-semibold uppercase tracking-[0.15em] text-white transition-all hover:scale-[1.02] hover:bg-emerald/90"
          >
            <MessageCircle className="h-4 w-4" />
            WhatsApp our concierge
          </a>
        </motion.div>
      </div>
    </section>
  );
}
