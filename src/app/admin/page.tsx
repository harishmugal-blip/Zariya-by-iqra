"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Star,
  Mail,
  TrendingUp,
  Users,
  IndianRupee,
  Clock,
  CheckCircle2,
  Search,
  ChevronRight,
  ArrowLeft,
  ExternalLink,
  CircleDot,
  LogOut,
  Plus,
  Pencil,
  Trash2,
  X,
  Loader2,
  Save,
  Warehouse,
  CreditCard,
  Truck,
  BarChart3,
  FileText,
  Settings,
  Shield,
  Download,
  AlertTriangle,
  ArrowUpDown,
  Eye,
  Filter,
  Tag,
  DollarSign,
  PackageCheck,
  RotateCcw,
  UserCheck,
  Crown,
} from "lucide-react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, COUPONS, BRAND } from "@/data/catalog";
import { cn, formatPrice, formatNumber } from "@/lib/utils";
import { Stars } from "@/components/zariya/stars";
import { toast } from "sonner";

type TabId =
  | "overview"
  | "orders"
  | "products"
  | "inventory"
  | "customers"
  | "coupons"
  | "payments"
  | "shipping"
  | "reviews"
  | "reports"
  | "cms"
  | "subscribers"
  | "settings";

interface Stats {
  counts: { orders: number; subscribers: number; contacts: number; enquiries: number; products: number; categories: number; coupons: number };
  revenue: number;
  pending: number;
  completed: number;
  avgOrderValue: number;
  revenueByDay: { label: string; value: number }[];
  categoryStats: { name: string; count: number }[];
  paymentBreakdown: { COD: number; Online: number };
}

interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  country: string;
  items: any[];
  subtotal: number;
  discount: number;
  shipping: number;
  total: number;
  couponCode: string | null;
  paymentMethod: string;
  status: string;
  createdAt: string;
}

const STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-700 border-amber-200",
  CONFIRMED: "bg-blue-100 text-blue-700 border-blue-200",
  SHIPPED: "bg-purple-100 text-purple-700 border-purple-200",
  DELIVERED: "bg-emerald-100 text-emerald-700 border-emerald-200",
  CANCELLED: "bg-red-100 text-red-700 border-red-200",
};

const EASE = [0.22, 1, 0.36, 1] as const;

export default function AdminPage() {
  const router = useRouter();
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [tab, setTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [dbProducts, setDbProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  // Product editor state
  const [editingProduct, setEditingProduct] = useState<any | null>(null);
  const [showProductForm, setShowProductForm] = useState(false);

  // Auth check on mount
  useEffect(() => {
    fetch("/api/admin/auth/me", { credentials: "include" })
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data?.authenticated) {
          setAuthenticated(true);
          setAdminName(data.admin.name);
        } else {
          router.replace("/admin/login");
        }
        setAuthChecked(true);
      })
      .catch(() => {
        router.replace("/admin/login");
        setAuthChecked(true);
      });
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/auth/logout", { method: "POST", credentials: "include" });
    router.replace("/admin/login");
  };

  const loadDbProducts = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/products", { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        setDbProducts(d.products);
      }
    } catch {}
  }, []);

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/stats", { credentials: "include" });
      if (r.ok) setStats(await r.json());
    } catch {}
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/orders", { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        setOrders(d.orders);
      }
    } catch {}
  }, []);

  const loadSubscribers = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/newsletter", { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        setSubscribers(d.subscribers);
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!authenticated) return;
    let cancelled = false;
    (async () => {
      await Promise.all([loadStats(), loadOrders(), loadSubscribers(), loadDbProducts()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [authenticated, loadStats, loadOrders, loadSubscribers, loadDbProducts]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH", credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    } catch {}
  };

  const filteredOrders = orders.filter((o) => {
    const q = orderSearch.toLowerCase();
    const matchSearch =
      !q ||
      o.orderNumber.toLowerCase().includes(q) ||
      o.customerName.toLowerCase().includes(q) ||
      o.email.toLowerCase().includes(q);
    const matchStatus = statusFilter === "ALL" || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const tabs: { id: TabId; label: string; icon: typeof LayoutDashboard; count?: number }[] = [
    { id: "overview", label: "Dashboard", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
    { id: "products", label: "Products", icon: Package, count: dbProducts.length },
    { id: "inventory", label: "Inventory", icon: Warehouse },
    { id: "customers", label: "Customers", icon: Users, count: subscribers.length },
    { id: "coupons", label: "Coupons", icon: Tag, count: COUPONS.length },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "shipping", label: "Shipping", icon: Truck },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "reports", label: "Reports", icon: BarChart3 },
    { id: "cms", label: "CMS", icon: FileText },
    { id: "subscribers", label: "Subscribers", icon: Mail, count: subscribers.length },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!authChecked || !authenticated) {
    return (
      <div className="grid min-h-screen place-items-center bg-[hsl(352_30%_6%)]">
        <Loader2 className="h-8 w-8 animate-spin text-gold" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(352_30%_6%)] text-slate-100">
      {/* Top bar */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[hsl(352_30%_8%)]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="grid h-9 w-9 place-items-center rounded-lg bg-gradient-to-br from-gold to-champagne">
              <span className="font-serif text-lg font-bold text-primary">Z</span>
            </div>
            <div>
              <p className="font-serif text-lg font-bold leading-none">ZARIYA Admin</p>
              <p className="text-[10px] uppercase tracking-widest text-gold">
                {adminName} · Atelier Console
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="hidden text-xs text-slate-400 sm:inline">
              Hi, {adminName.split(" ")[0]}
            </span>
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-gold/50 hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Storefront
            </Link>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-destructive/50 hover:text-red-400"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-6 sm:px-6 lg:flex-row lg:py-8">
        {/* Sidebar */}
        <aside className="lg:w-60 lg:flex-none">
          <nav className="flex gap-1 overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.03] p-2 lg:flex-col lg:overflow-visible">
            {tabs.map((t) => {
              const Icon = t.icon;
              return (
                <button
                  key={t.id}
                  onClick={() => setTab(t.id)}
                  className={cn(
                    "group flex flex-none items-center gap-2.5 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all",
                    tab === t.id
                      ? "bg-gradient-to-r from-gold/20 to-transparent text-gold"
                      : "text-slate-400 hover:bg-white/5 hover:text-slate-100"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span className="whitespace-nowrap">{t.label}</span>
                  {typeof t.count === "number" && (
                    <span
                      className={cn(
                        "ml-auto hidden rounded-full px-1.5 py-0.5 text-[10px] font-semibold lg:inline",
                        tab === t.id ? "bg-gold/30 text-gold" : "bg-white/10 text-slate-400"
                      )}
                    >
                      {t.count}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </aside>

        {/* Main */}
        <main className="min-w-0 flex-1">
          {tab === "overview" && (
            <OverviewTab stats={stats} loading={loading} />
          )}

          {tab === "orders" && (
            <OrdersTab
              orders={filteredOrders}
              allCount={orders.length}
              search={orderSearch}
              setSearch={setOrderSearch}
              statusFilter={statusFilter}
              setStatusFilter={setStatusFilter}
              onUpdateStatus={updateOrderStatus}
            />
          )}

          {tab === "products" && (
            <ProductsTab
              products={dbProducts}
              onEdit={(p) => {
                setEditingProduct(p);
                setShowProductForm(true);
              }}
              onDelete={async (id) => {
                try {
                  const r = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE", credentials: "include" });
                  if (r.ok) {
                    toast.success("Product deleted");
                    loadDbProducts();
                  } else {
                    toast.error("Failed to delete");
                  }
                } catch {
                  toast.error("Network error");
                }
              }}
              onAdd={() => {
                setEditingProduct(null);
                setShowProductForm(true);
              }}
              onStockUpdate={async (id, stock) => {
                try {
                  const r = await fetch("/api/admin/products", {
                    method: "PATCH", credentials: "include",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id, stock }),
                  });
                  if (r.ok) {
                    toast.success("Stock updated");
                    loadDbProducts();
                  }
                } catch {}
              }}
            />
          )}

          {tab === "reviews" && <ReviewsTab />}

          {tab === "inventory" && <InventoryTab products={dbProducts} />}

          {tab === "customers" && <CustomersTab subscribers={subscribers} orders={orders} />}

          {tab === "payments" && <PaymentsTab orders={orders} />}

          {tab === "shipping" && <ShippingTab />}

          {tab === "reports" && <ReportsTab orders={orders} products={dbProducts} />}

          {tab === "cms" && <CMSTab />}

          {tab === "settings" && <SettingsTab />}

          {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}

          {tab === "coupons" && <CouponsTab />}
        </main>
      </div>

      {/* Product Form Modal */}
      {showProductForm && (
        <ProductFormModal
          product={editingProduct}
          onClose={() => {
            setShowProductForm(false);
            setEditingProduct(null);
          }}
          onSaved={() => {
            setShowProductForm(false);
            setEditingProduct(null);
            loadDbProducts();
          }}
        />
      )}
    </div>
  );
}

/* ---------------- Product Form Modal ---------------- */
function ProductFormModal({
  product,
  onClose,
  onSaved,
}: {
  product: any | null;
  onClose: () => void;
  onSaved: () => void;
}) {
  const isEdit = !!product;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    slug: product?.slug || "",
    name: product?.name || "",
    subtitle: product?.subtitle || "",
    description: product?.description || "",
    story: product?.story || "",
    price: product?.price || "",
    compareAtPrice: product?.compareAtPrice || "",
    category: product?.category || "pherans",
    collection: product?.collection || "royal-heritage",
    fabric: product?.fabric || "",
    stock: product?.stock ?? 0,
    sku: product?.sku || "",
    careInstructions: product?.care || product?.careInstructions || "",
    shippingInfo: product?.shipping || product?.shippingInfo || "",
    images: product
      ? (Array.isArray(product.images) ? product.images.map((i: any) => i.src).join("\n") : "")
      : "",
    sizes: product
      ? (Array.isArray(product.sizes) ? product.sizes.join(", ") : "")
      : "S, M, L, XL",
    colors: product
      ? (Array.isArray(product.colors) ? product.colors.map((c: any) => `${c.name}:${c.hex}`).join(", ") : "")
      : "Deep Burgundy:#4A0E17, Royal Gold:#C5A059",
    featured: product?.featured || false,
    bestSeller: product?.bestSeller || false,
    newArrival: product?.newArrival || false,
    limitedEdition: product?.limitedEdition || false,
  });

  const set = (key: string, value: any) => setForm((f) => ({ ...f, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.slug || !form.name || !form.price || !form.sku) {
      toast.error("Slug, Name, Price, SKU are required");
      return;
    }
    setSaving(true);

    const imageLines = form.images.split("\n").map((s) => s.trim()).filter(Boolean);
    const images = imageLines.map((src, i) => ({ src, alt: `${form.name} view ${i + 1}` }));
    const sizes = form.sizes.split(",").map((s) => s.trim()).filter(Boolean);
    const colors = form.colors.split(",").map((s) => s.trim()).filter(Boolean).map((s) => {
      const [name, hex] = s.split(":").map((p) => p.trim());
      return { name: name || "Color", hex: hex || "#000000" };
    });

    const payload: any = {
      slug: form.slug,
      name: form.name,
      subtitle: form.subtitle,
      description: form.description,
      story: form.story,
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      category: form.category,
      collection: form.collection,
      fabric: form.fabric,
      stock: Number(form.stock),
      sku: form.sku,
      careInstructions: form.careInstructions,
      shippingInfo: form.shippingInfo,
      images,
      sizes,
      colors,
      featured: form.featured,
      bestSeller: form.bestSeller,
      newArrival: form.newArrival,
      limitedEdition: form.limitedEdition,
    };

    try {
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { id: product.id, ...payload } : payload;
      const r = await fetch("/api/admin/products", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok) {
        toast.error(data.error || "Failed to save");
        return;
      }
      toast.success(isEdit ? "Product updated" : "Product created");
      onSaved();
    } catch {
      toast.error("Network error");
    } finally {
      setSaving(false);
    }
  };

  const inputCls = "w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none transition-all focus:border-gold/50";

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-h-[90vh] w-full max-w-2xl overflow-y-auto scrollbar-lux rounded-3xl border border-white/10 bg-[hsl(352_30%_8%)] p-6"
      >
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-slate-100">
            {isEdit ? "Edit Product" : "Add New Product"}
          </h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-white/10 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Name *</label>
              <input value={form.name} onChange={(e) => set("name", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Slug *</label>
              <input value={form.slug} onChange={(e) => set("slug", e.target.value)} placeholder="shahzadi-pheran" className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Subtitle</label>
            <input value={form.subtitle} onChange={(e) => set("subtitle", e.target.value)} className={inputCls} />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Description</label>
            <textarea value={form.description} onChange={(e) => set("description", e.target.value)} rows={3} className={inputCls} />
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Price (₹) *</label>
              <input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Compare At (₹)</label>
              <input type="number" value={form.compareAtPrice} onChange={(e) => set("compareAtPrice", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Stock</label>
              <input type="number" value={form.stock} onChange={(e) => set("stock", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Category</label>
              <select value={form.category} onChange={(e) => set("category", e.target.value)} className={inputCls}>
                <option value="pherans">Pherans</option>
                <option value="shawls">Pashmina Shawls</option>
                <option value="suits">Embroidered Suits</option>
                <option value="kaftans">Kaftans</option>
                <option value="accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Collection</label>
              <select value={form.collection} onChange={(e) => set("collection", e.target.value)} className={inputCls}>
                <option value="royal-heritage">Royal Heritage</option>
                <option value="ivory-dreams">Ivory Dreams</option>
                <option value="midnight-noor">Midnight Noor</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">SKU *</label>
              <input value={form.sku} onChange={(e) => set("sku", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Fabric</label>
            <input value={form.fabric} onChange={(e) => set("fabric", e.target.value)} placeholder="Pashmina & Silk Blend" className={inputCls} />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Image URLs (one per line)</label>
            <textarea value={form.images} onChange={(e) => set("images", e.target.value)} rows={3} placeholder="/images/products/p1.png" className={inputCls} />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Sizes (comma separated)</label>
              <input value={form.sizes} onChange={(e) => set("sizes", e.target.value)} className={inputCls} />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Colors (name:hex, comma)</label>
              <input value={form.colors} onChange={(e) => set("colors", e.target.value)} className={inputCls} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Care Instructions</label>
            <textarea value={form.careInstructions} onChange={(e) => set("careInstructions", e.target.value)} rows={2} className={inputCls} />
          </div>

          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Shipping Info</label>
            <input value={form.shippingInfo} onChange={(e) => set("shippingInfo", e.target.value)} className={inputCls} />
          </div>

          <div className="flex flex-wrap gap-3">
            {[
              ["featured", "Featured"],
              ["bestSeller", "Bestseller"],
              ["newArrival", "New Arrival"],
              ["limitedEdition", "Limited Edition"],
            ].map(([key, label]) => (
              <label key={key} className="flex cursor-pointer items-center gap-2">
                <input type="checkbox" checked={(form as any)[key]} onChange={(e) => set(key, e.target.checked)} className="h-4 w-4 accent-gold" />
                <span className="text-xs text-slate-300">{label}</span>
              </label>
            ))}
          </div>

          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button type="button" onClick={onClose} className="rounded-full border border-white/15 px-5 py-2.5 text-xs font-semibold text-slate-300 hover:border-white/30">
              Cancel
            </button>
            <button type="submit" disabled={saving} className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary transition-all hover:scale-105 active:scale-95 disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ---------------- Overview ---------------- */
function OverviewTab({ stats, loading }: { stats: Stats | null; loading: boolean }) {
  if (loading || !stats) {
    return <SkeletonGrid />;
  }
  const maxRev = Math.max(...stats.revenueByDay.map((d) => d.value), 1);
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-bold">Overview</h1>
        <p className="mt-1 text-sm text-slate-400">A glimpse of the ZARIYA atelier today.</p>
      </div>

      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          icon={IndianRupee}
          label="Total Revenue"
          value={formatPrice(stats.revenue)}
          accent="from-gold/20 to-transparent"
          iconColor="text-gold"
        />
        <KpiCard
          icon={ShoppingBag}
          label="Orders"
          value={formatNumber(stats.counts.orders)}
          sub={`${stats.pending} pending`}
          accent="from-blue-500/20 to-transparent"
          iconColor="text-blue-400"
        />
        <KpiCard
          icon={Users}
          label="Subscribers"
          value={formatNumber(stats.counts.subscribers)}
          accent="from-emerald-500/20 to-transparent"
          iconColor="text-emerald-400"
        />
        <KpiCard
          icon={TrendingUp}
          label="Avg Order Value"
          value={formatPrice(stats.avgOrderValue)}
          accent="from-purple-500/20 to-transparent"
          iconColor="text-purple-400"
        />
      </div>

      {/* Revenue chart + status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 lg:col-span-2"
        >
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-serif text-lg font-semibold">Revenue · Last 7 Days</h2>
            <span className="text-xs text-slate-400">Daily totals</span>
          </div>
          <div className="flex h-48 items-end justify-between gap-2">
            {stats.revenueByDay.map((d, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${(d.value / maxRev) * 100}%` }}
                  transition={{ duration: 0.6, delay: i * 0.06, ease: EASE }}
                  className="w-full max-w-[40px] rounded-t-md bg-gradient-to-t from-gold/40 to-gold"
                  style={{ minHeight: d.value > 0 ? 8 : 2 }}
                />
                <span className="text-[10px] text-slate-400">{d.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1, ease: EASE }}
          className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
        >
          <h2 className="mb-4 font-serif text-lg font-semibold">Order Status</h2>
          <div className="space-y-3">
            <StatusRow icon={Clock} label="Pending" value={stats.pending} color="text-amber-400" />
            <StatusRow icon={CheckCircle2} label="Completed" value={stats.completed} color="text-emerald-400" />
            <div className="my-3 h-px bg-white/10" />
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Payment</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">COD</span>
              <span className="font-semibold text-gold">{stats.paymentBreakdown.COD}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-300">Online</span>
              <span className="font-semibold text-gold">{stats.paymentBreakdown.Online}</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Category distribution */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2, ease: EASE }}
        className="rounded-2xl border border-white/10 bg-white/[0.03] p-5"
      >
        <h2 className="mb-4 font-serif text-lg font-semibold">Catalog by Category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {stats.categoryStats.map((c) => (
            <div key={c.name} className="rounded-xl border border-white/5 bg-white/[0.02] p-3">
              <p className="text-xs text-slate-400">{c.name}</p>
              <p className="mt-1 font-serif text-2xl font-bold text-gold">{c.count}</p>
              <p className="text-[10px] text-slate-500">pieces</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

function KpiCard({
  icon: Icon,
  label,
  value,
  sub,
  accent,
  iconColor,
}: {
  icon: typeof IndianRupee;
  label: string;
  value: string;
  sub?: string;
  accent: string;
  iconColor: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: EASE }}
      className={cn("relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-5")}
    >
      <div className={cn("pointer-events-none absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br blur-2xl", accent)} />
      <div className="relative">
        <Icon className={cn("h-5 w-5", iconColor)} />
        <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">{label}</p>
        <p className="mt-1 font-serif text-2xl font-bold">{value}</p>
        {sub && <p className="mt-0.5 text-[11px] text-slate-500">{sub}</p>}
      </div>
    </motion.div>
  );
}

function StatusRow({
  icon: Icon,
  label,
  value,
  color,
}: {
  icon: typeof Clock;
  label: string;
  value: number;
  color: string;
}) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className={cn("h-4 w-4", color)} />
        <span className="text-sm text-slate-300">{label}</span>
      </div>
      <span className="font-semibold">{value}</span>
    </div>
  );
}

function SkeletonGrid() {
  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-28 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
        ))}
      </div>
      <div className="h-64 animate-pulse rounded-2xl border border-white/10 bg-white/[0.03]" />
    </div>
  );
}

/* ---------------- Orders ---------------- */
function OrdersTab({
  orders,
  allCount,
  search,
  setSearch,
  statusFilter,
  setStatusFilter,
  onUpdateStatus,
}: {
  orders: AdminOrder[];
  allCount: number;
  search: string;
  setSearch: (v: string) => void;
  statusFilter: string;
  setStatusFilter: (v: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
}) {
  const statuses = ["ALL", "PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"];
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Orders</h1>
        <p className="mt-1 text-sm text-slate-400">{allCount} total · manage and fulfil</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order #, name, email…"
            className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-gold/50"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn(
                "flex-none rounded-full px-3 py-1.5 text-xs font-medium transition-all",
                statusFilter === s
                  ? "bg-gold text-primary"
                  : "border border-white/10 text-slate-400 hover:text-slate-100"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      {orders.length === 0 ? (
        <EmptyState
          icon={ShoppingBag}
          title="No orders yet"
          subtitle="Orders placed on the storefront will appear here."
        />
      ) : (
        <div className="space-y-3">
          {orders.map((o, i) => (
            <motion.div
              key={o.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-semibold text-gold">{o.orderNumber}</span>
                    <span
                      className={cn(
                        "rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        STATUS_COLORS[o.status] || "bg-slate-100 text-slate-700 border-slate-200"
                      )}
                    >
                      {o.status}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm font-medium text-slate-200">{o.customerName}</p>
                  <p className="truncate text-xs text-slate-500">
                    {o.email} · {o.phone}
                  </p>
                  <p className="mt-0.5 text-[11px] text-slate-500">
                    {new Date(o.createdAt).toLocaleString("en-IN", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}{" "}
                    · {o.items.length} item{o.items.length !== 1 ? "s" : ""} · {o.paymentMethod}
                  </p>
                </div>
                <div className="flex items-center gap-3 sm:flex-col sm:items-end">
                  <span className="font-serif text-xl font-bold text-gold">{formatPrice(o.total)}</span>
                  <select
                    value={o.status}
                    onChange={(e) => onUpdateStatus(o.id, e.target.value)}
                    className="rounded-lg border border-white/10 bg-[hsl(352_30%_10%)] px-2.5 py-1.5 text-xs text-slate-200 outline-none focus:border-gold/50"
                  >
                    {["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"].map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ---------------- Products ---------------- */
function ProductsTab({
  products,
  onEdit,
  onDelete,
  onAdd,
  onStockUpdate,
}: {
  products: any[];
  onEdit: (p: any) => void;
  onDelete: (id: string) => void;
  onAdd: () => void;
  onStockUpdate: (id: string, stock: number) => void;
}) {
  const [search, setSearch] = useState("");
  const filtered = products.filter(
    (p) =>
      !search ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Products</h1>
          <p className="mt-1 text-sm text-slate-400">
            {products.length} pieces · manage inventory, prices & details
          </p>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-champagne px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary transition-all hover:scale-105 active:scale-95"
        >
          <Plus className="h-4 w-4" /> Add Product
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, SKU, or category…"
          className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none transition-all placeholder:text-slate-500 focus:border-gold/50"
        />
      </div>

      {/* Product grid */}
      {filtered.length === 0 ? (
        <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 py-16 text-center">
          <Package className="h-10 w-10 text-slate-600" />
          <h3 className="mt-3 font-serif text-lg font-semibold text-slate-300">No products</h3>
          <p className="mt-1 text-xs text-slate-500">Add your first product to begin.</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p, i) => {
            const img = Array.isArray(p.images) ? p.images[0]?.src : null;
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
                className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
              >
                <div className="flex gap-3 p-3">
                  <img
                    src={img || "/images/placeholder.png"}
                    alt={p.name}
                    loading="lazy"
                    className="h-20 w-16 flex-none rounded-lg object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="text-[10px] uppercase tracking-wide text-gold">{p.category}</p>
                    <h3 className="truncate font-serif text-sm font-semibold text-slate-100">{p.name}</h3>
                    <p className="truncate text-xs text-slate-400">{p.subtitle}</p>
                    <div className="mt-1.5 flex items-center justify-between">
                      <span className="font-semibold text-gold">{formatPrice(p.price)}</span>
                      <span className={cn("text-[11px] font-medium", p.stock <= 5 ? "text-red-400" : "text-emerald-400")}>
                        Stock: {p.stock}
                      </span>
                    </div>
                  </div>
                </div>
                {/* Quick stock editor */}
                <div className="flex items-center gap-2 border-t border-white/5 bg-white/[0.02] px-3 py-2">
                  <span className="text-[10px] uppercase text-slate-500">Stock:</span>
                  <input
                    type="number"
                    defaultValue={p.stock}
                    min={0}
                    onBlur={(e) => {
                      const v = Number(e.target.value);
                      if (v !== p.stock) onStockUpdate(p.id, v);
                    }}
                    className="w-16 rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs text-slate-200 outline-none focus:border-gold/50"
                  />
                  <div className="ml-auto flex gap-1">
                    <button
                      onClick={() => onEdit(p)}
                      aria-label="Edit product"
                      className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-gold/20 hover:text-gold"
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Delete "${p.name}"? This cannot be undone.`)) onDelete(p.id);
                      }}
                      aria-label="Delete product"
                      className="grid h-7 w-7 place-items-center rounded-md text-slate-400 transition-colors hover:bg-red-500/20 hover:text-red-400"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ---------------- Reviews ---------------- */
function ReviewsTab() {
  const allReviews = PRODUCTS.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, productName: p.name, productSlug: p.slug, status: "approved" }))
  );
  const [reviews, setReviews] = useState(allReviews);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("all");

  const filtered = reviews.filter((r) => {
    const matchSearch = !search || r.author.toLowerCase().includes(search.toLowerCase()) || r.title.toLowerCase().includes(search.toLowerCase()) || r.productName.toLowerCase().includes(search.toLowerCase());
    const matchRating = ratingFilter === "all" || r.rating === Number(ratingFilter);
    return matchSearch && matchRating;
  });

  const handleApprove = async (id: string) => {
    toast.success("Review approved");
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" } : r));
  };
  const handleReject = async (id: string) => {
    toast.success("Review rejected");
    setReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "rejected" } : r));
  };
  const handleDelete = async (id: string) => {
    if (!confirm("Delete this review?")) return;
    toast.success("Review deleted");
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-slate-400">{filtered.length} customer reviews · moderate & manage</p>
      </div>

      {/* Search + filter */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search reviews…" className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold/50" />
        </div>
        <div className="flex gap-1.5">
          {["all", "5", "4", "3"].map((f) => (
            <button key={f} onClick={() => setRatingFilter(f)} className={cn("rounded-full px-3 py-1.5 text-xs font-semibold uppercase tracking-wide", ratingFilter === f ? "bg-gold text-primary" : "border border-white/10 text-slate-400")}>
              {f === "all" ? "All" : `${f}★`}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        {filtered.length === 0 ? (
          <EmptyState icon={Star} title="No reviews found" subtitle="Try adjusting your search or filters." />
        ) : (
          filtered.slice(0, 30).map((r, i) => (
            <motion.div
              key={r.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.02, ease: EASE }}
              className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <Stars rating={r.rating} size={13} />
                    <span className="text-xs text-slate-400">{r.author}</span>
                    {r.verified && (
                      <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">VERIFIED</span>
                    )}
                    <span className={cn("rounded-full px-1.5 py-0.5 text-[9px] font-semibold uppercase", r.status === "approved" ? "bg-emerald-500/15 text-emerald-400" : "bg-red-500/15 text-red-400")}>
                      {r.status}
                    </span>
                  </div>
                  <h3 className="mt-1 font-serif text-sm font-semibold text-slate-100">{r.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-slate-400">{r.body}</p>
                  <p className="mt-1.5 text-[10px] text-slate-500">
                    on <span className="text-gold">{r.productName}</span>
                    {r.location ? ` · ${r.location}` : ""}
                  </p>
                </div>
                <div className="flex flex-none flex-col gap-1">
                  <button onClick={() => handleApprove(r.id)} className="rounded-lg border border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10">
                    <CheckCircle2 className="mr-1 inline h-3 w-3" />Approve
                  </button>
                  <button onClick={() => handleReject(r.id)} className="rounded-lg border border-amber-500/30 px-2.5 py-1 text-[10px] font-semibold text-amber-400 transition-colors hover:bg-amber-500/10">
                    Reject
                  </button>
                  <button onClick={() => handleDelete(r.id)} className="rounded-lg border border-red-500/30 px-2.5 py-1 text-[10px] font-semibold text-red-400 transition-colors hover:bg-red-500/10">
                    <Trash2 className="mr-1 inline h-3 w-3" />Delete
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

/* ---------------- Subscribers ---------------- */
function SubscribersTab({ subscribers }: { subscribers: any[] }) {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Subscribers</h1>
        <p className="mt-1 text-sm text-slate-400">{subscribers.length} in the Zariya Circle</p>
      </div>
      {subscribers.length === 0 ? (
        <EmptyState icon={Mail} title="No subscribers yet" subtitle="Newsletter signups will appear here." />
      ) : (
        <div className="overflow-hidden rounded-2xl border border-white/10">
          <table className="w-full text-sm">
            <thead className="bg-white/[0.05] text-xs uppercase tracking-wide text-slate-400">
              <tr>
                <th className="px-4 py-3 text-left font-medium">Email</th>
                <th className="px-4 py-3 text-left font-medium">Name</th>
                <th className="px-4 py-3 text-left font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {subscribers.map((s, i) => (
                <tr key={s.id} className={cn("border-t border-white/5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                  <td className="px-4 py-3 text-slate-200">{s.email}</td>
                  <td className="px-4 py-3 text-slate-400">{s.name || "—"}</td>
                  <td className="px-4 py-3 text-slate-500">
                    {new Date(s.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/* ---------------- Coupons ---------------- */
function CouponsTab() {
  const [coupons, setCoupons] = useState<any[]>(COUPONS);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<any | null>(null);

  const loadCoupons = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/coupons", { credentials: "include" });
      if (r.ok) {
        const d = await r.json();
        if (d.coupons?.length) setCoupons(d.coupons);
      }
    } catch {}
    setLoading(false);
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await loadCoupons();
      if (cancelled) return;
    })();
    return () => { cancelled = true; };
  }, [loadCoupons]);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this coupon?")) return;
    try {
      await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE", credentials: "include" });
      toast.success("Coupon deleted");
      loadCoupons();
    } catch { toast.error("Failed to delete"); }
  };

  const toggleActive = async (id: string, active: boolean) => {
    try {
      await fetch("/api/admin/coupons", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, active: !active }),
        credentials: "include",
      });
      toast.success(active ? "Coupon deactivated" : "Coupon activated");
      loadCoupons();
    } catch {}
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Coupons</h1>
          <p className="mt-1 text-sm text-slate-400">{coupons.length} discount codes</p>
        </div>
        <button
          onClick={() => { setEditing(null); setShowForm(true); }}
          className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-champagne px-4 py-2 text-xs font-semibold uppercase tracking-wide text-primary"
        >
          <Plus className="h-4 w-4" /> Add Coupon
        </button>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {coupons.map((c, i) => (
          <motion.div
            key={c.id || c.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
            <div className="flex items-start justify-between">
              <p className="font-mono text-lg font-bold text-gold">{c.code}</p>
              {c.id && (
                <span className={cn("rounded-full px-2 py-0.5 text-[9px] font-bold uppercase", c.active !== false ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400")}>
                  {c.active !== false ? "Active" : "Inactive"}
                </span>
              )}
            </div>
            <p className="mt-2 font-serif text-3xl font-bold">
              {c.type === "percent" ? `${c.value}%` : formatPrice(c.value)}
              <span className="text-sm font-normal text-slate-400"> off</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">{c.description}</p>
            <p className="mt-3 text-[10px] uppercase tracking-wide text-slate-500">
              Min order: {formatPrice(c.minOrder)}
            </p>
            {c.id && (
              <div className="mt-3 flex gap-2 border-t border-white/5 pt-3">
                <button
                  onClick={() => { setEditing(c); setShowForm(true); }}
                  className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-300 hover:bg-gold/20 hover:text-gold"
                >
                  <Pencil className="h-3 w-3" /> Edit
                </button>
                <button
                  onClick={() => toggleActive(c.id, c.active !== false)}
                  className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-300 hover:bg-amber-500/20 hover:text-amber-400"
                >
                  {c.active !== false ? "Deactivate" : "Activate"}
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="flex items-center gap-1 rounded-md bg-white/5 px-2 py-1 text-[10px] text-slate-300 hover:bg-red-500/20 hover:text-red-400"
                >
                  <Trash2 className="h-3 w-3" /> Delete
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {showForm && (
        <CouponFormModal
          coupon={editing}
          onClose={() => { setShowForm(false); setEditing(null); }}
          onSaved={() => { setShowForm(false); setEditing(null); loadCoupons(); }}
        />
      )}
    </div>
  );
}

function CouponFormModal({ coupon, onClose, onSaved }: { coupon: any | null; onClose: () => void; onSaved: () => void }) {
  const isEdit = !!coupon;
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    code: coupon?.code || "",
    type: coupon?.type || "percent",
    value: coupon?.value || 10,
    minOrder: coupon?.minOrder || 0,
    description: coupon?.description || "",
    active: coupon?.active !== false,
  });
  const set = (k: string, v: any) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.code || !form.value) { toast.error("Code and value are required"); return; }
    setSaving(true);
    try {
      const method = isEdit ? "PATCH" : "POST";
      const body = isEdit ? { id: coupon.id, ...form } : form;
      const r = await fetch("/api/admin/coupons", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
        credentials: "include",
      });
      const data = await r.json();
      if (!r.ok) { toast.error(data.error || "Failed"); return; }
      toast.success(isEdit ? "Coupon updated" : "Coupon created");
      onSaved();
    } catch { toast.error("Network error"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-4 backdrop-blur-sm">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md rounded-3xl border border-white/10 bg-[hsl(352_30%_8%)] p-6">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="font-serif text-xl font-bold">{isEdit ? "Edit Coupon" : "Add Coupon"}</h2>
          <button onClick={onClose} className="grid h-8 w-8 place-items-center rounded-full text-slate-400 hover:bg-white/10"><X className="h-4 w-4" /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">Code *</label>
            <input value={form.code} onChange={(e) => set("code", e.target.value.toUpperCase())} placeholder="ZARIYA10" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 font-mono text-sm text-slate-100 outline-none focus:border-gold/50" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">Type</label>
              <select value={form.type} onChange={(e) => set("type", e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50">
                <option value="percent">Percentage (%)</option>
                <option value="fixed">Fixed Amount (₹)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">Value *</label>
              <input type="number" value={form.value} onChange={(e) => set("value", Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">Min Order (₹)</label>
            <input type="number" value={form.minOrder} onChange={(e) => set("minOrder", Number(e.target.value))} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-semibold uppercase text-slate-400">Description</label>
            <input value={form.description} onChange={(e) => set("description", e.target.value)} placeholder="10% off first order" className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={form.active} onChange={(e) => set("active", e.target.checked)} className="h-4 w-4 accent-gold" />
            <span className="text-xs text-slate-300">Active</span>
          </label>
          <div className="flex justify-end gap-3 border-t border-white/10 pt-4">
            <button type="button" onClick={onClose} className="rounded-full border border-white/15 px-5 py-2 text-xs font-semibold text-slate-300">Cancel</button>
            <button type="submit" disabled={saving} className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-gold to-champagne px-6 py-2 text-xs font-semibold text-primary disabled:opacity-60">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
              {saving ? "Saving…" : isEdit ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  subtitle,
}: {
  icon: typeof Mail;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="grid place-items-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] py-16 text-center">
      <Icon className="h-10 w-10 text-slate-600" />
      <h3 className="mt-3 font-serif text-lg font-semibold text-slate-300">{title}</h3>
      <p className="mt-1 max-w-xs text-sm text-slate-500">{subtitle}</p>
    </div>
  );
}

/* ---------------- Inventory ---------------- */
function InventoryTab({ products }: { products: any[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");

  const lowStockThreshold = 5;
  const filtered = products.filter((p) => {
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchFilter =
      filter === "all" ||
      (filter === "low" && p.stock > 0 && p.stock <= lowStockThreshold) ||
      (filter === "out" && p.stock === 0);
    return matchSearch && matchFilter;
  });

  const totalStock = products.reduce((s, p) => s + (p.stock || 0), 0);
  const lowCount = products.filter((p) => p.stock > 0 && p.stock <= lowStockThreshold).length;
  const outCount = products.filter((p) => p.stock === 0).length;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Inventory</h1>
        <p className="mt-1 text-sm text-slate-400">Stock overview · low stock · out of stock</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <PackageCheck className="h-5 w-5 text-emerald-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Total Stock Units</p>
          <p className="font-serif text-2xl font-bold">{totalStock}</p>
        </div>
        <div className="rounded-2xl border border-amber-500/20 bg-amber-500/5 p-5">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Low Stock</p>
          <p className="font-serif text-2xl font-bold text-amber-400">{lowCount}</p>
        </div>
        <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-5">
          <AlertTriangle className="h-5 w-5 text-red-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Out of Stock</p>
          <p className="font-serif text-2xl font-bold text-red-400">{outCount}</p>
        </div>
      </div>

      {/* Search + filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search by name or SKU…" className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold/50" />
        </div>
        <div className="flex gap-1.5">
          {(["all", "low", "out"] as const).map((f) => (
            <button key={f} onClick={() => setFilter(f)} className={cn("rounded-full px-3.5 py-1.5 text-xs font-semibold uppercase tracking-wide transition-all", filter === f ? "bg-gold text-primary" : "border border-white/10 text-slate-400 hover:text-slate-100")}>
              {f === "all" ? "All" : f === "low" ? "Low Stock" : "Out of Stock"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.05] text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Product</th>
              <th className="px-4 py-3 text-left font-medium">SKU</th>
              <th className="px-4 py-3 text-center font-medium">Stock</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Price</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p, i) => (
              <tr key={p.id} className={cn("border-t border-white/5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <img src={Array.isArray(p.images) ? p.images[0]?.src : ""} alt={p.name} className="h-8 w-8 rounded object-cover" />
                    <span className="font-medium text-slate-100">{p.name}</span>
                  </div>
                </td>
                <td className="px-4 py-3 font-mono text-xs text-slate-400">{p.sku}</td>
                <td className="px-4 py-3 text-center font-semibold">{p.stock}</td>
                <td className="px-4 py-3 text-center">
                  {p.stock === 0 ? (
                    <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-red-400">Out</span>
                  ) : p.stock <= lowStockThreshold ? (
                    <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-amber-400">Low</span>
                  ) : (
                    <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">OK</span>
                  )}
                </td>
                <td className="px-4 py-3 text-right font-semibold text-gold">{formatPrice(p.price)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Customers ---------------- */
function CustomersTab({ subscribers, orders }: { subscribers: any[]; orders: any[] }) {
  const [search, setSearch] = useState("");

  // Build customer list from subscribers + orders
  const customerMap = new Map<string, { email: string; name: string; orders: number; totalSpent: number; createdAt: string }>();

  subscribers.forEach((s) => {
    customerMap.set(s.email, { email: s.email, name: s.name || s.email.split("@")[0], orders: 0, totalSpent: 0, createdAt: s.createdAt });
  });

  orders.forEach((o) => {
    const existing = customerMap.get(o.email);
    if (existing) {
      existing.orders++;
      existing.totalSpent += o.total || 0;
    } else {
      customerMap.set(o.email, { email: o.email, name: o.customerName, orders: 1, totalSpent: o.total || 0, createdAt: o.createdAt });
    }
  });

  const customers = Array.from(customerMap.values()).filter(
    (c) => !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Customers</h1>
        <p className="mt-1 text-sm text-slate-400">{customers.length} registered customers</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers…" className="w-full rounded-xl border border-white/10 bg-white/[0.03] py-2.5 pl-10 pr-4 text-sm outline-none focus:border-gold/50" />
      </div>

      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.05] text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Orders</th>
              <th className="px-4 py-3 text-right font-medium">Total Spent</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No customers yet</td></tr>
            ) : (
              customers.map((c, i) => (
                <tr key={c.email} className={cn("border-t border-white/5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="grid h-8 w-8 place-items-center rounded-full bg-gold/20 text-xs font-bold text-gold">
                        {c.name.slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-100">{c.name}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{c.email}</td>
                  <td className="px-4 py-3 text-center">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-semibold text-gold">{formatPrice(c.totalSpent)}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", c.orders > 0 ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400")}>
                      {c.orders > 0 ? "Active" : "Subscribed"}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Payments ---------------- */
function PaymentsTab({ orders }: { orders: any[] }) {
  const successful = orders.filter((o) => o.paymentMethod === "Online" || o.status === "DELIVERED");
  const cod = orders.filter((o) => o.paymentMethod === "COD");
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const codAmount = cod.reduce((s, o) => s + (o.total || 0), 0);
  const onlineAmount = totalRevenue - codAmount;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Payments</h1>
        <p className="mt-1 text-sm text-slate-400">Transactions · COD · Online · Refunds</p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <DollarSign className="h-5 w-5 text-emerald-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Total Revenue</p>
          <p className="font-serif text-xl font-bold">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <CreditCard className="h-5 w-5 text-blue-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Online</p>
          <p className="font-serif text-xl font-bold">{formatPrice(onlineAmount)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <IndianRupee className="h-5 w-5 text-amber-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">COD</p>
          <p className="font-serif text-xl font-bold">{formatPrice(codAmount)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <RotateCcw className="h-5 w-5 text-red-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Refunds</p>
          <p className="font-serif text-xl font-bold">₹0</p>
        </div>
      </div>

      {/* Transactions table */}
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="w-full text-sm">
          <thead className="bg-white/[0.05] text-xs uppercase tracking-wide text-slate-400">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Order #</th>
              <th className="px-4 py-3 text-left font-medium">Customer</th>
              <th className="px-4 py-3 text-center font-medium">Method</th>
              <th className="px-4 py-3 text-center font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {orders.length === 0 ? (
              <tr><td colSpan={5} className="px-4 py-12 text-center text-slate-500">No transactions yet</td></tr>
            ) : (
              orders.map((o, i) => (
                <tr key={o.id} className={cn("border-t border-white/5", i % 2 === 0 ? "bg-white/[0.01]" : "")}>
                  <td className="px-4 py-3 font-mono text-xs text-gold">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-slate-200">{o.customerName}</td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", o.paymentMethod === "COD" ? "bg-amber-500/15 text-amber-400" : "bg-blue-500/15 text-blue-400")}>
                      {o.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-center">
                    <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", o.status === "DELIVERED" ? "bg-emerald-500/15 text-emerald-400" : o.status === "CANCELLED" ? "bg-red-500/15 text-red-400" : "bg-slate-500/15 text-slate-400")}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-semibold text-gold">{formatPrice(o.total)}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------------- Shipping ---------------- */
function ShippingTab() {
  const methods = [
    { name: "White-Glove Delivery", desc: "Complimentary worldwide", zones: "All zones", charge: "Free", partner: "DHL / Bluedart", active: true },
    { name: "Express Shipping", desc: "2-3 business days", zones: "India", charge: "₹250", partner: "Delhivery", active: true },
    { name: "International Express", desc: "7-14 business days", zones: "Worldwide", charge: "₹2,500", partner: "DHL Express", active: true },
    { name: "Standard International", desc: "14-21 business days", zones: "Worldwide", charge: "₹1,200", partner: "India Post", active: false },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Shipping</h1>
        <p className="mt-1 text-sm text-slate-400">Methods · zones · charges · delivery partners</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {methods.map((m) => (
          <div key={m.name} className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-2">
                <Truck className="h-5 w-5 text-gold" />
                <h3 className="font-serif text-base font-semibold text-slate-100">{m.name}</h3>
              </div>
              <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", m.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400")}>
                {m.active ? "Active" : "Inactive"}
              </span>
            </div>
            <p className="mt-2 text-xs text-slate-400">{m.desc}</p>
            <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div><span className="text-slate-500">Zone:</span> <span className="text-slate-200">{m.zones}</span></div>
              <div><span className="text-slate-500">Charge:</span> <span className="text-gold">{m.charge}</span></div>
              <div><span className="text-slate-500">Partner:</span> <span className="text-slate-200">{m.partner}</span></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Reports ---------------- */
function ReportsTab({ orders, products }: { orders: any[]; products: any[] }) {
  const totalRevenue = orders.reduce((s, o) => s + (o.total || 0), 0);
  const avgOrderValue = orders.length ? Math.round(totalRevenue / orders.length) : 0;
  const totalUnits = products.reduce((s, p) => s + (p.stock || 0), 0);

  // Top selling (by reviewCount as proxy)
  const topProducts = [...products].sort((a, b) => (b.reviewCount || 0) - (a.reviewCount || 0)).slice(0, 5);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-3xl font-bold">Reports & Analytics</h1>
          <p className="mt-1 text-sm text-slate-400">Sales · revenue · product performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => window.open("/api/admin/export?type=orders", "_blank")} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Orders CSV
          </button>
          <button onClick={() => window.open("/api/admin/export?type=products", "_blank")} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Products CSV
          </button>
          <button onClick={() => window.open("/api/admin/export?type=customers", "_blank")} className="flex items-center gap-1.5 rounded-full border border-white/15 px-4 py-2 text-xs font-semibold text-slate-300 hover:border-gold/50 hover:text-gold">
            <Download className="h-3.5 w-3.5" /> Customers CSV
          </button>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <TrendingUp className="h-5 w-5 text-emerald-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Total Revenue</p>
          <p className="font-serif text-xl font-bold">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <ShoppingBag className="h-5 w-5 text-blue-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Total Orders</p>
          <p className="font-serif text-xl font-bold">{orders.length}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <IndianRupee className="h-5 w-5 text-amber-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Avg Order Value</p>
          <p className="font-serif text-xl font-bold">{formatPrice(avgOrderValue)}</p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <Package className="h-5 w-5 text-purple-400" />
          <p className="mt-3 text-xs uppercase tracking-wide text-slate-400">Stock Units</p>
          <p className="font-serif text-xl font-bold">{totalUnits}</p>
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-4 font-serif text-lg font-semibold">Top Performing Products</h2>
        <div className="space-y-3">
          {topProducts.map((p, i) => (
            <div key={p.id} className="flex items-center gap-3">
              <span className="font-serif text-lg font-bold text-gold/60">#{i + 1}</span>
              <img src={Array.isArray(p.images) ? p.images[0]?.src : ""} alt={p.name} className="h-10 w-8 rounded object-cover" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-slate-100">{p.name}</p>
                <p className="text-xs text-slate-400">{p.reviewCount || 0} reviews · {p.rating || 5}★</p>
              </div>
              <span className="font-semibold text-gold">{formatPrice(p.price)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- CMS ---------------- */
function CMSTab() {
  const pages = [
    { name: "Homepage", desc: "Hero, categories, best sellers, collections", status: "Published" },
    { name: "Store Page", desc: "Full product listing with filters", status: "Published" },
    { name: "Journal", desc: "Editorial blog with 6 articles", status: "Published" },
    { name: "Order Tracking", desc: "Customer order lookup page", status: "Published" },
    { name: "Gift Card Balance", desc: "Gift card balance checker", status: "Published" },
    { name: "Admin Login", desc: "Admin authentication page", status: "Published" },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">CMS</h1>
        <p className="mt-1 text-sm text-slate-400">Pages · banners · content management</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {pages.map((p) => (
          <div key={p.name} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <h3 className="font-serif text-sm font-semibold text-slate-100">{p.name}</h3>
              <p className="text-xs text-slate-400">{p.desc}</p>
            </div>
            <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold uppercase text-emerald-400">{p.status}</span>
          </div>
        ))}
      </div>

      {/* Announcement bar content */}
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h2 className="mb-3 font-serif text-lg font-semibold">Announcement Bar Messages</h2>
        <div className="space-y-2">
          {["Complimentary white-glove delivery, worldwide", "Handcrafted in Kashmir · Estd. 2009", "Use code ZARIYA10 for 10% off your first order", "Each piece takes 150+ hours of artisan needlework"].map((msg, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
              <span className="font-mono text-xs text-gold">#{i + 1}</span>
              <span className="text-sm text-slate-300">{msg}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ---------------- Settings ---------------- */
function SettingsTab() {
  const [storeName, setStoreName] = useState(BRAND.fullName);
  const [email, setEmail] = useState(BRAND.email);
  const [phone, setPhone] = useState(BRAND.phone);
  const [currency, setCurrency] = useState("INR (₹)");
  const [gst, setGst] = useState("5%");

  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Settings</h1>
        <p className="mt-1 text-sm text-slate-400">Store · payment · shipping · security</p>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Store info */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold">Store Information</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Store Name</label>
              <input value={storeName} onChange={(e) => setStoreName(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Phone / WhatsApp</label>
              <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
          </div>
        </div>

        {/* Tax & currency */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold">Tax & Currency</h2>
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">Currency</label>
              <input value={currency} onChange={(e) => setCurrency(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
            <div>
              <label className="mb-1 block text-[11px] font-semibold uppercase tracking-wide text-slate-400">GST Rate</label>
              <input value={gst} onChange={(e) => setGst(e.target.value)} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-100 outline-none focus:border-gold/50" />
            </div>
            <div className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
              <span className="text-sm text-slate-300">GST included in prices</span>
              <span className="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[10px] font-bold text-emerald-400">YES</span>
            </div>
          </div>
        </div>

        {/* Payment gateways */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold">Payment Gateways</h2>
          <div className="space-y-2">
            {[
              { name: "Cash on Delivery (COD)", active: true },
              { name: "UPI / Razorpay", active: false },
              { name: "Credit / Debit Card", active: false },
              { name: "Google Pay", active: false },
            ].map((pg) => (
              <div key={pg.name} className="flex items-center justify-between rounded-lg bg-white/[0.02] px-3 py-2">
                <span className="text-sm text-slate-300">{pg.name}</span>
                <span className={cn("rounded-full px-2 py-0.5 text-[10px] font-bold uppercase", pg.active ? "bg-emerald-500/15 text-emerald-400" : "bg-slate-500/15 text-slate-400")}>
                  {pg.active ? "Active" : "Coming Soon"}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Admin users */}
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
          <h2 className="mb-4 font-serif text-lg font-semibold">Admin Users & Roles</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2 rounded-lg bg-white/[0.02] px-3 py-2">
              <Crown className="h-4 w-4 text-gold" />
              <div className="flex-1">
                <p className="text-sm font-medium text-slate-100">ZARIYA Admin</p>
                <p className="text-xs text-slate-400">admin@zariya.com</p>
              </div>
              <span className="rounded-full bg-gold/20 px-2 py-0.5 text-[10px] font-bold uppercase text-gold">Super Admin</span>
            </div>
          </div>
        </div>
      </div>

      {/* Save button */}
      <button
        onClick={() => toast.success("Settings saved")}
        className="flex items-center gap-2 rounded-full bg-gradient-to-r from-gold to-champagne px-6 py-2.5 text-xs font-semibold uppercase tracking-wide text-primary"
      >
        <Save className="h-4 w-4" /> Save Settings
      </button>
    </div>
  );
}
