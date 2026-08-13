"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Sparkles } from "lucide-react";
import { cn, whatsappLink } from "@/lib/utils";
import { BRAND } from "@/data/catalog";
import { WhatsAppIcon } from "./product-card";

interface Msg {
  id: number;
  from: "bot" | "user";
  text: string;
}

const QUICK_REPLIES = [
  "Help me choose a size",
  "Tell me about pashmina care",
  "Track my order",
  "Gift wrapping options",
];

const BOT_REPLIES: Record<string, string> = {
  "Help me choose a size":
    "Wonderful! Our pherans are a relaxed fit — for a tailored look, size down. You can also open our Size Guide on any product page, or WhatsApp our concierge for a personal fitting consult. Which piece are you considering?",
  "Tell me about pashmina care":
    "Always dry clean your pashmina. Store it folded in the muslin cloth we provide, away from sunlight. With care, your shawl will last for generations. Would you like a care guide sent to your email?",
  "Track my order":
    "I'd be happy to help! Please share your order number (it begins with ZRY-) and I'll fetch the status. For real-time updates, our concierge can also reach you on WhatsApp.",
  "Gift wrapping options":
    "Every ZARIYA order arrives in our heirloom ivory box, hand-sealed in gold, with a wax-sealed note from the artisan. For gifts, we add a handwritten card at no charge. Would you like to add a personal message?",
};

export function LiveChat() {
  const [open, setOpen] = useState(false);
  const [unread, setUnread] = useState(true);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Msg[]>([
    {
      id: 1,
      from: "bot",
      text: "Namaste, and welcome to ZARIYA. I'm your personal concierge. How may I help you find your heirloom today?",
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
    const reply = BOT_REPLIES[text] || "Thank you for your message. For a personal response, our concierge is one tap away on WhatsApp — or share your email and we'll write back within the hour.";
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
        className="fixed bottom-24 left-4 z-40 grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground luxury-shadow-lg lg:bottom-6 lg:left-6"
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
            className="fixed bottom-36 left-4 z-40 flex h-[480px] w-[calc(100vw-2rem)] max-w-[360px] flex-col overflow-hidden rounded-3xl border border-border bg-card luxury-shadow-lg lg:bottom-24 lg:left-6"
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
                      "max-w-[78%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed",
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
                      className="block w-full rounded-xl border border-gold/30 bg-gold/5 px-3 py-1.5 text-left text-xs text-foreground transition-all hover:bg-gold/10"
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
              <WhatsAppIcon className="h-3.5 w-3.5" /> Escalate to WhatsApp Concierge
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
