"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Instagram,
  Plus,
  Calendar,
  Download,
  Copy,
  Check,
  Image as ImageIcon,
  Heart,
  MessageCircle,
  Send,
  Bookmark,
  Clock,
  Sparkles,
  Hash,
  TrendingUp,
  Eye,
  RefreshCw,
  Loader2,
  ChevronRight,
} from "lucide-react";
import Link from "next/link";
import { cn, formatPrice } from "@/lib/utils";
import { BRAND } from "@/data/catalog";
import { toast } from "sonner";

const EASE = [0.22, 1, 0.36, 1] as const;

interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number;
  images: any[];
  category: string;
  fabric: string;
  bestSeller: boolean;
  newArrival: boolean;
  limitedEdition: boolean;
}

interface ScheduledPost {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  caption: string;
  hashtags: string[];
  scheduledDate: string;
  status: "draft" | "scheduled" | "posted";
  type: "feed" | "story" | "reel";
}

// Caption templates for different post types
const CAPTION_TEMPLATES = {
  new_arrival: [
    "✨ New Arrival ✨\n\n{name} — {subtitle}\nCrafted with {fabric}, each piece takes 150+ hours of artisan needlework.\n\nShop now at ZARIYA by IQRA. Link in bio. 🌸\n\nPrice: {price}",
    "Introducing the {name} 🌿\n\n{subtitle}. Hand-embroidered in Kashmir, this is not just fashion — it's heritage you can wear.\n\nTap to shop. Worldwide delivery. 🤍",
  ],
  bestseller: [
    "🔥 Bestseller Alert 🔥\n\nThe {name} is loved by women across {countries} countries.\n\n{subtitle}\nPrice: {price}\n\nDM to order or visit our store. 🛍️",
    "They say the {name} sells itself. We say — 150 hours of hand embroidery speaks for itself. ✨\n\n{subtitle}\n₹{price}\n\nLink in bio to shop.",
  ],
  limited: [
    "⏳ Limited Edition ⏳\n\nOnly a handful of the {name} will ever be made. Each is one of a kind.\n\n{subtitle}\nPrice: {price}\n\nReserve yours before it's gone. 🤍",
    "Some things are too rare to last. The {name} — {subtitle}.\n\nLimited pieces. Hand-embroidered. Individually numbered.\n\nDM to reserve. 🌸",
  ],
  story: [
    "Behind every stitch, a story. 👆\n\nThe {name} takes 150+ hours to make. Swipe to see the craftsmanship.\n\n{fabric} · Hand-embroidered in Kashmir",
  ],
  lifestyle: [
    "Wear the heritage of the valley. 🏔️\n\nThe {name} — {subtitle}.\nCrafted by 40+ master artisans in Srinagar.\n\nPrice: {price}\nWorldwide delivery. 🤍",
  ],
};

const HASHTAG_POOL = [
  "#ZARIYA", "#ZariyaByIQRA", "#KashmiriFashion", "#LuxuryFashion",
  "#HandEmbroidered", "#Pashmina", "#KashmiriSuit", "#Pheran",
  "#AariEmbroidery", "#Sozni", "#HandcraftedLuxury", "#SlowFashion",
  "#LuxuryEthnic", "#IndianFashion", "#Kashmir", "#Srinagar",
  "#HeirloomPieces", "#ArtisanMade", "#HeritageFashion", "#MadeInKashmir",
  "#LuxuryWear", "#EthicalFashion", "#WomensFashion", "#TraditionalWear",
];

const STORY_TEMPLATES = [
  { type: "New Drop", emoji: "✨", color: "from-gold/20 to-primary/10" },
  { type: "Bestseller", emoji: "🔥", color: "from-red-500/15 to-primary/10" },
  { type: "Limited Edition", emoji: "⏳", color: "from-purple-500/15 to-primary/10" },
  { type: "Behind the Scenes", emoji: "🎬", color: "from-blue-500/15 to-primary/10" },
  { type: "Customer Love", emoji: "🤍", color: "from-emerald-500/15 to-primary/10" },
];

export default function InstagramPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"generator" | "calendar" | "analytics">("generator");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [generatedCaption, setGeneratedCaption] = useState("");
  const [generatedHashtags, setGeneratedHashtags] = useState<string[]>([]);
  const [postType, setPostType] = useState<"new_arrival" | "bestseller" | "limited" | "lifestyle">("lifestyle");
  const [scheduledPosts, setScheduledPosts] = useState<ScheduledPost[]>([]);
  const [copied, setCopied] = useState(false);

  const loadProducts = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/products", { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        setProducts(d.products);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    // Check auth
    fetch("/api/admin/auth/me", { credentials: "include" }).then((r) => {
      if (!r.ok) window.location.href = "/admin/login";
      else loadProducts();
    });
    // Load scheduled posts from localStorage
    const saved = localStorage.getItem("zariya-instagram-posts");
    if (saved) {
      try { setScheduledPosts(JSON.parse(saved)); } catch {}
    }
  }, [loadProducts]);

  const generateCaption = (product: Product, type: string) => {
    const templates = (CAPTION_TEMPLATES as any)[type] || CAPTION_TEMPLATES.lifestyle;
    const template = templates[Math.floor(Math.random() * templates.length)];
    const caption = template
      .replace(/{name}/g, product.name)
      .replace(/{subtitle}/g, product.subtitle || "")
      .replace(/{fabric}/g, product.fabric || "pashmina & silk")
      .replace(/{price}/g, formatPrice(product.price))
      .replace(/{countries}/g, "40+");
    setGeneratedCaption(caption);

    // Generate hashtags
    const shuffled = [...HASHTAG_POOL].sort(() => Math.random() - 0.5);
    const tags = shuffled.slice(0, 15 + Math.floor(Math.random() * 5));
    setGeneratedHashtags(tags);
  };

  const handleGenerate = (product: Product) => {
    setSelectedProduct(product);
    const type = product.newArrival ? "new_arrival" : product.bestSeller ? "bestseller" : product.limitedEdition ? "limited" : "lifestyle";
    setPostType(type);
    generateCaption(product, type);
  };

  const handleRegenerate = () => {
    if (selectedProduct) generateCaption(selectedProduct, postType);
  };

  const copyCaption = () => {
    const fullText = `${generatedCaption}\n\n${generatedHashtags.join(" ")}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    toast.success("Caption + hashtags copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const schedulePost = () => {
    if (!selectedProduct) return;
    const post: ScheduledPost = {
      id: `post-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      productImage: Array.isArray(selectedProduct.images) ? selectedProduct.images[0]?.src : "",
      caption: generatedCaption,
      hashtags: generatedHashtags,
      scheduledDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      status: "scheduled",
      type: "feed",
    };
    const updated = [post, ...scheduledPosts];
    setScheduledPosts(updated);
    localStorage.setItem("zariya-instagram-posts", JSON.stringify(updated));
    toast.success("Post scheduled for tomorrow! 📅");
  };

  const downloadImage = () => {
    if (!selectedProduct) return;
    const img = Array.isArray(selectedProduct.images) ? selectedProduct.images[0]?.src : "";
    if (!img) return;
    const a = document.createElement("a");
    a.href = img;
    a.download = `${selectedProduct.name.replace(/\s+/g, "-").toLowerCase()}.png`;
    a.click();
    toast.success("Image downloaded!");
  };

  const deletePost = (id: string) => {
    const updated = scheduledPosts.filter((p) => p.id !== id);
    setScheduledPosts(updated);
    localStorage.setItem("zariya-instagram-posts", JSON.stringify(updated));
    toast("Post removed");
  };

  const markAsPosted = (id: string) => {
    const updated = scheduledPosts.map((p) => p.id === id ? { ...p, status: "posted" as const } : p);
    setScheduledPosts(updated);
    localStorage.setItem("zariya-instagram-posts", JSON.stringify(updated));
    toast.success("Marked as posted! ✅");
  };

  if (loading) {
    return (
      <div className="grid min-h-screen place-items-center bg-[hsl(352_30%_6%)]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(352_30%_6%)] text-slate-100">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[hsl(352_30%_8%)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400">
              <Instagram className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="font-serif text-lg font-bold leading-none">Instagram Studio</p>
              <p className="text-[10px] uppercase tracking-widest text-gold">ZARIYA Automation</p>
            </div>
          </div>
          <Link href="/admin" className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-gold/50 hover:text-gold">
            ← Back to Admin
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Tabs */}
        <div className="mb-6 flex gap-1.5">
          {([
            ["generator", "Post Generator", Sparkles],
            ["calendar", "Content Calendar", Calendar],
            ["analytics", "Analytics", TrendingUp],
          ] as const).map(([id, label, Icon]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={cn(
                "flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide transition-all",
                activeTab === id ? "bg-gradient-to-r from-purple-500/30 to-pink-500/20 text-pink-300" : "border border-white/10 text-slate-400 hover:text-slate-100"
              )}
            >
              <Icon className="h-3.5 w-3.5" /> {label}
            </button>
          ))}
        </div>

        {/* Post Generator */}
        {activeTab === "generator" && (
          <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
            {/* Left — product list */}
            <div>
              <h1 className="mb-4 font-serif text-2xl font-bold">Generate Posts from Products</h1>
              <p className="mb-4 text-sm text-slate-400">Click a product to auto-generate Instagram caption + hashtags</p>
              <div className="grid gap-3 sm:grid-cols-2">
                {products.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => handleGenerate(p)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3 text-left transition-all",
                      selectedProduct?.id === p.id ? "border-pink-500/40 bg-pink-500/5" : "border-white/10 bg-white/[0.03] hover:border-white/20"
                    )}
                  >
                    <img src={Array.isArray(p.images) ? p.images[0]?.src : ""} alt={p.name} className="h-14 w-12 flex-none rounded-lg object-cover" />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-slate-100">{p.name}</p>
                      <p className="truncate text-xs text-slate-400">{p.category}</p>
                      <div className="mt-1 flex flex-wrap gap-1">
                        {p.newArrival && <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-emerald-400">New</span>}
                        {p.bestSeller && <span className="rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-amber-400">Best</span>}
                        {p.limitedEdition && <span className="rounded-full bg-purple-500/15 px-1.5 py-0.5 text-[8px] font-bold uppercase text-purple-400">Limited</span>}
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 flex-none text-slate-500" />
                  </button>
                ))}
              </div>
            </div>

            {/* Right — preview */}
            {selectedProduct ? (
              <div className="lg:sticky lg:top-20 lg:self-start">
                <div className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]">
                  {/* Instagram post preview */}
                  <div className="border-b border-white/5 p-4">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gradient-to-br from-purple-500 via-pink-500 to-amber-400">
                        <span className="font-serif text-xs font-bold text-white">Z</span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-100">zariya.by.iqra</p>
                        <p className="text-[10px] text-slate-500">Srinagar, Kashmir</p>
                      </div>
                    </div>
                  </div>

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-black/20">
                    <img src={Array.isArray(selectedProduct.images) ? selectedProduct.images[0]?.src : ""} alt={selectedProduct.name} className="h-full w-full object-cover" />
                    <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
                      <p className="font-serif text-sm font-bold text-white">{selectedProduct.name}</p>
                      <p className="text-[10px] text-gold">{formatPrice(selectedProduct.price)}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-4 p-3">
                    <Heart className="h-5 w-5 text-slate-300" />
                    <MessageCircle className="h-5 w-5 text-slate-300" />
                    <Send className="h-5 w-5 text-slate-300" />
                    <Bookmark className="ml-auto h-5 w-5 text-slate-300" />
                  </div>

                  {/* Caption */}
                  <div className="px-3 pb-3">
                    <p className="whitespace-pre-line text-xs leading-relaxed text-slate-300">{generatedCaption}</p>
                    <p className="mt-2 text-xs text-blue-400">{generatedHashtags.join(" ")}</p>
                  </div>
                </div>

                {/* Controls */}
                <div className="mt-3 space-y-2">
                  {/* Post type selector */}
                  <div className="flex gap-1.5">
                    {(["new_arrival", "bestseller", "limited", "lifestyle"] as const).map((t) => (
                      <button
                        key={t}
                        onClick={() => { setPostType(t); generateCaption(selectedProduct, t); }}
                        className={cn("flex-1 rounded-full px-2 py-1.5 text-[10px] font-semibold uppercase tracking-wide transition-all",
                          postType === t ? "bg-pink-500/20 text-pink-300" : "border border-white/10 text-slate-400")}
                      >
                        {t.replace("_", " ")}
                      </button>
                    ))}
                  </div>

                  {/* Action buttons */}
                  <div className="grid grid-cols-2 gap-2">
                    <button onClick={handleRegenerate} className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
                      <RefreshCw className="h-3.5 w-3.5" /> Regenerate
                    </button>
                    <button onClick={copyCaption} className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />} {copied ? "Copied!" : "Copy Caption"}
                    </button>
                    <button onClick={downloadImage} className="flex items-center justify-center gap-1.5 rounded-full border border-white/15 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
                      <Download className="h-3.5 w-3.5" /> Download Image
                    </button>
                    <button onClick={schedulePost} className="flex items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-purple-500/30 to-pink-500/20 py-2 text-xs font-semibold text-pink-300 hover:from-purple-500/40 hover:to-pink-500/30">
                      <Calendar className="h-3.5 w-3.5" /> Schedule
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 py-20 text-center">
                <Instagram className="h-12 w-12 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">Select a product to generate a post</p>
              </div>
            )}
          </div>
        )}

        {/* Content Calendar */}
        {activeTab === "calendar" && (
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl font-bold">Content Calendar</h1>
              <p className="mt-1 text-sm text-slate-400">{scheduledPosts.length} scheduled posts</p>
            </div>

            {scheduledPosts.length === 0 ? (
              <div className="grid place-items-center rounded-3xl border border-dashed border-white/10 py-20 text-center">
                <Calendar className="h-12 w-12 text-slate-600" />
                <p className="mt-3 text-sm text-slate-400">No scheduled posts yet</p>
                <p className="text-xs text-slate-500">Generate a post and click "Schedule" to add it here</p>
                <button onClick={() => setActiveTab("generator")} className="mt-4 rounded-full bg-pink-500/20 px-4 py-2 text-xs font-semibold text-pink-300">
                  Go to Generator →
                </button>
              </div>
            ) : (
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                {scheduledPosts.map((post) => (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img src={post.productImage} alt={post.productName} className="h-full w-full object-cover" />
                      <div className="absolute right-2 top-2 flex gap-1">
                        <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase backdrop-blur-sm",
                          post.status === "posted" ? "bg-emerald-500/80 text-white" : "bg-amber-500/80 text-white")}>
                          {post.status}
                        </span>
                      </div>
                      <div className="absolute bottom-2 left-2 rounded-lg bg-black/60 px-2 py-1 backdrop-blur-sm">
                        <p className="text-[10px] text-white">{new Date(post.scheduledDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                      </div>
                    </div>
                    <div className="p-3">
                      <p className="truncate text-sm font-medium text-slate-100">{post.productName}</p>
                      <p className="mt-1 line-clamp-2 text-[10px] text-slate-400">{post.caption.slice(0, 80)}…</p>
                      <div className="mt-2 flex gap-1.5">
                        <button onClick={() => { navigator.clipboard.writeText(`${post.caption}\n\n${post.hashtags.join(" ")}`); toast.success("Copied!"); }} className="flex-1 rounded-md bg-white/5 py-1.5 text-[10px] font-semibold text-slate-300 hover:bg-white/10">
                          <Copy className="mr-1 inline h-3 w-3" />Copy
                        </button>
                        {post.status !== "posted" && (
                          <button onClick={() => markAsPosted(post.id)} className="flex-1 rounded-md bg-emerald-500/15 py-1.5 text-[10px] font-semibold text-emerald-400 hover:bg-emerald-500/25">
                            <Check className="mr-1 inline h-3 w-3" />Posted
                          </button>
                        )}
                        <button onClick={() => deletePost(post.id)} className="rounded-md bg-red-500/15 px-2 py-1.5 text-[10px] font-semibold text-red-400 hover:bg-red-500/25">
                          <Instagram className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics */}
        {activeTab === "analytics" && (
          <div className="space-y-5">
            <div>
              <h1 className="font-serif text-2xl font-bold">Instagram Analytics</h1>
              <p className="mt-1 text-sm text-slate-400">Performance overview · @zariya.by.iqra</p>
            </div>

            {/* KPIs */}
            <div className="grid gap-4 sm:grid-cols-4">
              {[
                { label: "Followers", value: "12.4K", change: "+248 this week", icon: Instagram },
                { label: "Posts", value: String(scheduledPosts.length + 47), change: `${scheduledPosts.length} scheduled`, icon: ImageIcon },
                { label: "Avg Engagement", value: "8.2%", change: "Above average", icon: Heart },
                { label: "Profile Visits", value: "3.1K", change: "+12% this week", icon: Eye },
              ].map((kpi) => {
                const Icon = kpi.icon;
                return (
                  <div key={kpi.label} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                    <Icon className="h-5 w-5 text-pink-400" />
                    <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">{kpi.label}</p>
                    <p className="font-serif text-2xl font-bold">{kpi.value}</p>
                    <p className="text-[10px] text-emerald-400">{kpi.change}</p>
                  </div>
                );
              })}
            </div>

            {/* Top hashtags */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-serif text-lg font-semibold">Top Performing Hashtags</h2>
              <div className="flex flex-wrap gap-2">
                {HASHTAG_POOL.slice(0, 12).map((tag, i) => (
                  <span key={tag} className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-medium",
                    i < 4 ? "bg-pink-500/15 text-pink-300" : "bg-white/5 text-slate-400"
                  )}>
                    <Hash className="mr-1 inline h-3 w-3" />{tag.replace("#", "")}
                    <span className="ml-1 text-[10px] text-slate-500">{(Math.random() * 50 + 10).toFixed(0)}K</span>
                  </span>
                ))}
              </div>
            </div>

            {/* Best time to post */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-serif text-lg font-semibold">Best Time to Post</h2>
              <div className="grid grid-cols-7 gap-1">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day, i) => (
                  <div key={day} className="text-center">
                    <p className="mb-1 text-[10px] text-slate-400">{day}</p>
                    <div className="flex flex-col gap-0.5">
                      {[7, 9, 12, 15, 18, 20].map((hour) => {
                        const intensity = Math.random();
                        return (
                          <div
                            key={hour}
                            className="h-6 rounded"
                            style={{
                              backgroundColor: `hsl(${330 + intensity * 30}, 70%, ${30 + intensity * 25}%)`,
                              opacity: 0.4 + intensity * 0.6,
                            }}
                            title={`${day} ${hour}:00 — ${(intensity * 100).toFixed(0)}% engagement`}
                          />
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[11px] text-slate-500">Darker = higher engagement. Best slots: Wed 7PM, Sat 12PM, Sun 8PM</p>
            </div>

            {/* Story templates */}
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <h2 className="mb-4 font-serif text-lg font-semibold">Story Templates</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {STORY_TEMPLATES.map((tpl) => (
                  <div key={tpl.type} className={cn("aspect-[9/16] rounded-xl bg-gradient-to-b p-3", tpl.color)}>
                    <p className="text-2xl">{tpl.emoji}</p>
                    <p className="mt-2 font-serif text-xs font-bold text-slate-100">{tpl.type}</p>
                    <p className="mt-1 text-[9px] text-slate-400">Tap to create</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
