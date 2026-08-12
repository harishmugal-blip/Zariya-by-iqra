"use client";

import { useEffect, useState, useCallback } from "react";
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
} from "lucide-react";
import Link from "next/link";
import { PRODUCTS, CATEGORIES, COUPONS, BRAND } from "@/data/catalog";
import { cn, formatPrice, formatNumber } from "@/lib/utils";
import { Stars } from "@/components/zariya/stars";

type TabId = "overview" | "orders" | "products" | "reviews" | "subscribers" | "coupons";

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
  const [tab, setTab] = useState<TabId>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [orderSearch, setOrderSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadStats = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/stats");
      if (r.ok) setStats(await r.json());
    } catch {}
  }, []);

  const loadOrders = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/orders");
      if (r.ok) {
        const d = await r.json();
        setOrders(d.orders);
      }
    } catch {}
  }, []);

  const loadSubscribers = useCallback(async () => {
    try {
      const r = await fetch("/api/admin/newsletter");
      if (r.ok) {
        const d = await r.json();
        setSubscribers(d.subscribers);
      }
    } catch {}
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await Promise.all([loadStats(), loadOrders(), loadSubscribers()]);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [loadStats, loadOrders, loadSubscribers]);

  const updateOrderStatus = async (id: string, status: string) => {
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
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
    { id: "overview", label: "Overview", icon: LayoutDashboard },
    { id: "orders", label: "Orders", icon: ShoppingBag, count: orders.length },
    { id: "products", label: "Products", icon: Package, count: PRODUCTS.length },
    { id: "reviews", label: "Reviews", icon: Star },
    { id: "subscribers", label: "Subscribers", icon: Mail, count: subscribers.length },
    { id: "coupons", label: "Coupons", icon: CircleDot, count: COUPONS.length },
  ];

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
              <p className="text-[10px] uppercase tracking-widest text-gold">Atelier Console</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-xs font-medium text-slate-300 transition-all hover:border-gold/50 hover:text-gold"
            >
              <ArrowLeft className="h-3.5 w-3.5" /> Storefront
            </Link>
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

          {tab === "products" && <ProductsTab />}

          {tab === "reviews" && <ReviewsTab />}

          {tab === "subscribers" && <SubscribersTab subscribers={subscribers} />}

          {tab === "coupons" && <CouponsTab />}
        </main>
      </div>
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
function ProductsTab() {
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Products</h1>
        <p className="mt-1 text-sm text-slate-400">{PRODUCTS.length} pieces in the catalog</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {PRODUCTS.map((p, i) => (
          <motion.div
            key={p.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.03, ease: EASE }}
            className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]"
          >
            <div className="flex gap-3 p-3">
              <img
                src={p.images[0]?.src}
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
                  <span className="text-[11px] text-slate-500">Stock: {p.stock}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-white/5 bg-white/[0.02] px-3 py-2">
              <div className="flex items-center gap-1">
                <Stars rating={p.rating} size={11} />
                <span className="text-[10px] text-slate-400">({p.reviewCount})</span>
              </div>
              <div className="flex flex-wrap gap-1">
                {p.badges.slice(0, 2).map((b) => (
                  <span key={b} className="rounded-full bg-white/5 px-1.5 py-0.5 text-[9px] uppercase text-slate-400">
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- Reviews ---------------- */
function ReviewsTab() {
  const allReviews = PRODUCTS.flatMap((p) =>
    p.reviews.map((r) => ({ ...r, productName: p.name, productSlug: p.slug }))
  );
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Reviews</h1>
        <p className="mt-1 text-sm text-slate-400">{allReviews.length} customer reviews across the catalog</p>
      </div>
      <div className="space-y-3">
        {allReviews.slice(0, 30).map((r, i) => (
          <motion.div
            key={r.id}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.02, ease: EASE }}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <Stars rating={r.rating} size={13} />
                  <span className="text-xs text-slate-400">{r.author}</span>
                  {r.verified && (
                    <span className="rounded-full bg-emerald-500/15 px-1.5 py-0.5 text-[9px] font-semibold text-emerald-400">
                      VERIFIED
                    </span>
                  )}
                </div>
                <h3 className="mt-1 font-serif text-sm font-semibold text-slate-100">{r.title}</h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-400">{r.body}</p>
                <p className="mt-1.5 text-[10px] text-slate-500">
                  on <span className="text-gold">{r.productName}</span>
                  {r.location ? ` · ${r.location}` : ""}
                </p>
              </div>
              <button className="flex-none rounded-lg border border-emerald-500/30 px-2.5 py-1 text-[10px] font-semibold text-emerald-400 transition-colors hover:bg-emerald-500/10">
                APPROVE
              </button>
            </div>
          </motion.div>
        ))}
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
  return (
    <div className="space-y-5">
      <div>
        <h1 className="font-serif text-3xl font-bold">Coupons</h1>
        <p className="mt-1 text-sm text-slate-400">{COUPONS.length} active discount codes</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {COUPONS.map((c, i) => (
          <motion.div
            key={c.code}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
            className="relative overflow-hidden rounded-2xl border border-gold/20 bg-gradient-to-br from-gold/10 to-transparent p-5"
          >
            <div className="pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full bg-gold/10 blur-2xl" />
            <p className="font-mono text-lg font-bold text-gold">{c.code}</p>
            <p className="mt-2 font-serif text-3xl font-bold">
              {c.type === "percent" ? `${c.value}%` : formatPrice(c.value)}
              <span className="text-sm font-normal text-slate-400"> off</span>
            </p>
            <p className="mt-2 text-xs text-slate-400">{c.description}</p>
            <p className="mt-3 text-[10px] uppercase tracking-wide text-slate-500">
              Min order: {formatPrice(c.minOrder)}
            </p>
          </motion.div>
        ))}
      </div>
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
