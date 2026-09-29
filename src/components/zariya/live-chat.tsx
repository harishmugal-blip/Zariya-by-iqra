"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn, whatsappLink, formatPrice } from "@/lib/utils";
import { BRAND } from "@/data/catalog";
import { WhatsAppIcon } from "./product-card";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "🛍️ Show me bestsellers",
  "📏 Size guide",
  "💰 Pricing & discounts",
  "🚚 Delivery & shipping",
  "💳 Payment options",
  "↩️ Return policy",
];

const BOT_REPLIES: Record<string, string> = {
  "🛍️ Show me bestsellers":
    "Our top bestsellers:\n\n• Shahzadi Pheran — ₹48,500 (burgundy, gold aari)\n• Noor Pashmina Shawl — ₹32,500 (gold, hand-embroidered)\n• Gulbadan Suit Set — ₹28,900 (charcoal, sozni)\n• Sahiba Suit Set — ₹26,500 (ivory, aari)\n\nVisit our Store page to see all 12 pieces. Which one interests you?",
  "📏 Size guide":
    "Sizing guide:\n\n• Pherans: Relaxed fit, size down for tailored look. XS-XXL available.\n• Suits: Kurta measurements, free-size churidar. XS-XXL.\n• Kaftans: One-size-fits-most, adjustable belt.\n• Shawls: One size (100×200cm).\n\nYou can open the full Size Guide on any product page. Still unsure? WhatsApp us for a personal fitting consult!",
  "💰 Pricing & discounts":
    "Our pieces range from ₹24,500 to ₹52,000. All prices include GST.\n\nActive coupons:\n• ZARIYA10 — 10% off first order\n• HERITAGE15 — 15% off orders above ₹50,000\n• WELCOME2000 — ₹2,000 off orders above ₹25,000\n\nUse code at checkout. Complimentary white-glove delivery included with every order!",
  "🚚 Delivery & shipping":
    "Delivery details:\n\n• India: 5-7 business days (complimentary)\n• International: 7-14 business days (complimentary, worldwide)\n• Each piece is hand-checked and beautifully packaged before dispatch\n• Tracking number sent via email & WhatsApp\n\nEvery order arrives in our heirloom ivory box, hand-sealed in gold.",
  "💳 Payment options":
    "Payment methods:\n\n• Cash on Delivery (COD) ✅ — Pay when you receive\n• UPI / Razorpay — Coming soon\n• Credit / Debit Card — Coming soon\n• Google Pay — Coming soon\n\nYou can also order directly via WhatsApp — our concierge will confirm details and dispatch personally.",
  "↩️ Return policy":
    "Returns & exchanges:\n\n• 7-day easy returns on unworn pieces with original packaging\n• Complimentary size exchange within 7 days (subject to stock)\n• Limited-edition & made-to-measure pieces are non-returnable\n• Refunds processed within 5-7 business days\n\nContact our concierge via WhatsApp for any return assistance.",
};

// Keyword-based smart replies for free-text messages
function getSmartReply(text: string): string {
  const t = text.toLowerCase();
  if (t.includes("price") || t.includes("cost") || t.includes("kitna") || t.includes("rate"))
    return "Our pieces range from ₹24,500 to ₹52,000 (GST included). Use code ZARIYA10 for 10% off your first order! Visit our Store page for full pricing.";
  if (t.includes("size") || t.includes("fit"))
    return "Pherans are relaxed fit (size down for tailored), suits XS-XXL, kaftans one-size, shawls one size. Open the Size Guide on any product page for detailed measurements.";
  if (t.includes("deliver") || t.includes("shipping") || t.includes("kab"))
    return "India: 5-7 days, International: 7-14 days — both complimentary! Every order ships in our heirloom ivory box with gold seal.";
  if (t.includes("cod") || t.includes("cash") || t.includes("payment") || t.includes("pay"))
    return "We accept Cash on Delivery (COD) ✅. Online payments (UPI, Card) coming soon. You can also order directly via WhatsApp!";
  if (t.includes("return") || t.includes("exchange") || t.includes("refund"))
    return "7-day easy returns on unworn pieces. Free size exchange within 7 days. Refunds in 5-7 business days. Limited-edition pieces are non-returnable.";
  if (t.includes("pashmina") || t.includes("shawl"))
    return "Our pashmina shawls are 100% Grade-A Kashmiri pashmina, hand-embroidered. Prices: ₹24,500-₹41,000. Each comes with a certificate of authenticity. Would you like to see our collection?";
  if (t.includes("pheran"))
    return "Our pherans are hand-embroidered in deep burgundy, black, and royal blue — with gold aari & zari work. Prices: ₹48,500-₹52,000. Each takes 150+ hours of artisan needlework!";
  if (t.includes("suit"))
    return "Our embroidered suits feature sozni & aari handwork. Charcoal, ivory, cream variants. Prices: ₹26,500-₹29,800. Three-piece sets (kurta, pant, dupatta).";
  if (t.includes("kaftan"))
    return "Our kaftans are flowing silk chiffon with gold zari — champagne & olive variants. Price: ₹33,800-₹36,500. Perfect for resort evenings!";
  if (t.includes("whatsapp") || t.includes("order"))
    return "You can order directly via WhatsApp! Click the green WhatsApp button on any product, or the 'Escalate to WhatsApp' button below. Our concierge will confirm details and dispatch personally.";
  if (t.includes("coupon") || t.includes("discount") || t.includes("offer"))
    return "Active coupons:\n• ZARIYA10 — 10% off first order\n• HERITAGE15 — 15% off above ₹50,000\n• WELCOME2000 — ₹2,000 off above ₹25,000";
  if (t.includes("gift"))
    return "Every ZARIYA order arrives in our heirloom ivory box, hand-sealed in gold, with a handwritten note. We also offer gift cards from ₹10,000 — perfect for gifting a loved one!";
  if (t.includes("hi") || t.includes("hello") || t.includes("namaste") || t.includes("hey"))
    return "Namaste! 🙏 Welcome to ZARIYA by IQRA. I'm your personal concierge. How can I help you find your perfect Kashmiri heirloom today?";
  if (t.includes("thank"))
    return "You're most welcome! It's our pleasure. If you have any more questions, I'm right here. Or WhatsApp our concierge for personal assistance. 🌸";
  return "Thank you for your message! For specific queries, try the quick questions above, or tap 'Escalate to WhatsApp' below — our concierge will respond personally within minutes. 🌸";
}

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text: "Namaste 🙏 Welcome to ZARIYA by IQRA! I'm your personal concierge. Ask me about our Kashmiri pherans, pashmina shawls, suits, kaftans — pricing, sizing, delivery, or anything else!",
    },
  ]);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) setUnread(false);
  }, [open]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const send = (text: string) => {
    if (!text.trim()) return;
    const userMsg: Msg = { id: Date.now(), from: "user", text: text.trim() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    const reply = BOT_REPLIES[text] || getSmartReply(text);
    setTimeout(() => {
      setMessages((m) => [...m, { id: Date.now() + 1, from: "bot", text: reply }]);
    }, 700);
  };

  return (
    <>
      {/* Launcher */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 1.2, type: "spring", stiffness: 200 }}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        onClick={() => setOpen((v) => !v)}
        aria-label="Open concierge chat"
        className="fixed bottom-28 left-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground luxury-shadow-lg lg:bottom-6 lg:left-6"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.span key="x" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="h-5 w-5" />
            </motion.span>
          ) : (
            <motion.span key="chat" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="h-5 w-5" />
            </motion.span>
          )}
        </AnimatePresence>
        {unread && !open && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 w-4 place-items-center rounded-full bg-gold text-[8px] font-bold text-primary">
            1
          </span>
        )}
        {/* pulse ring */}
        {!open && (
          <span className="pointer-events-none absolute inset-0 rounded-full bg-primary animate-pulse-ring" />
        )}
      </motion.button>

      {/* Panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-40 left-4 z-40 flex h-[500px] w-[calc(100vw-2rem)] max-w-[370px] flex-col overflow-hidden rounded-3xl border border-border bg-card luxury-shadow-lg lg:bottom-24 lg:left-6"
          >
            {/* Header */}
            <div className="relative overflow-hidden bg-primary px-4 py-4 text-primary-foreground">
              <div className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-gold/20 blur-xl" />
              <div className="relative flex items-center gap-3">
                <div className="relative grid h-10 w-10 place-items-center rounded-full bg-gold/20">
                  <Sparkles className="h-5 w-5 text-gold" />
                  <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-primary bg-emerald" />
                </div>
                <div>
                  <p className="font-serif text-base font-bold leading-none">ZARIYA Concierge</p>
                  <p className="mt-0.5 text-[10px] uppercase tracking-wider text-primary-foreground/70">
                    Online · Replies in minutes
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-lux bg-muted/20 p-4">
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn("flex", m.from === "user" ? "justify-end" : "justify-start")}
                >
                  <div
                    className={cn(
                      "max-w-[85%] whitespace-pre-line rounded-2xl px-3.5 py-2 text-xs leading-relaxed",
                      m.from === "user"
                        ? "rounded-br-sm bg-primary text-primary-foreground"
                        : "rounded-bl-sm bg-card border border-border text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                </motion.div>
              ))}

              {/* Quick replies */}
              {messages.length <= 2 && (
                <div className="space-y-1.5 pt-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
                    Quick questions
                  </p>
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="block w-full rounded-xl border border-gold/30 bg-gold/5 px-3 py-2 text-left text-xs text-foreground transition-all hover:bg-gold/10"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              )}
              <div ref={endRef} />
            </div>

            {/* WhatsApp escalation */}
            <a
              href={whatsappLink(BRAND.whatsapp, "Namaste! I was chatting with the ZARIYA concierge and would like personal assistance.")}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 border-t border-border bg-emerald/5 px-4 py-2 text-xs font-semibold text-emerald transition-colors hover:bg-emerald/10"
            >
              <WhatsAppIcon className="h-3.5 w-3.5" /> Order on WhatsApp
            </a>

            {/* Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                send(input);
              }}
              className="flex items-center gap-2 border-t border-border bg-card p-3"
            >
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message…"
                className="flex-1 rounded-full border border-border bg-background px-4 py-2 text-xs outline-none transition-all focus:border-gold focus:ring-2 focus:ring-gold/20"
              />
              <button
                type="submit"
                disabled={!input.trim()}
                aria-label="Send"
                className="grid h-9 w-9 flex-none place-items-center rounded-full bg-primary text-primary-foreground transition-all hover:scale-105 active:scale-95 disabled:opacity-40"
              >
                <Send className="h-4 w-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
