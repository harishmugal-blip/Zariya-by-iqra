import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS, COUPONS, CATEGORIES } from "@/data/catalog";

export async function GET() {
  try {
    const [orders, subscribers, contacts, enquiries] = await Promise.all([
      db.order.findMany({
        orderBy: { createdAt: "desc" },
        select: { total: true, status: true, createdAt: true, paymentMethod: true },
      }),
      db.newsletterSubscriber.count(),
      db.contactMessage.count(),
      db.productEnquiry.count(),
    ]);

    const revenue = orders.reduce((s, o) => s + (o.total || 0), 0);
    const pending = orders.filter((o) => o.status === "PENDING").length;
    const completed = orders.filter((o) => o.status === "CONFIRMED" || o.status === "DELIVERED").length;

    // Revenue last 7 days
    const now = new Date();
    const days: { label: string; value: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(now.getDate() - i);
      d.setHours(0, 0, 0, 0);
      const next = new Date(d);
      next.setDate(d.getDate() + 1);
      const dayRev = orders
        .filter((o) => o.createdAt >= d && o.createdAt < next)
        .reduce((s, o) => s + (o.total || 0), 0);
      days.push({
        label: d.toLocaleDateString("en-IN", { weekday: "short" }),
        value: dayRev,
      });
    }

    // Top categories by product count
    const categoryStats = CATEGORIES.map((c) => ({
      name: c.name,
      count: PRODUCTS.filter((p) => p.category === c.slug).length,
    }));

    return NextResponse.json({
      counts: {
        orders: orders.length,
        subscribers,
        contacts,
        enquiries,
        products: PRODUCTS.length,
        categories: CATEGORIES.length,
        coupons: COUPONS.length,
      },
      revenue,
      pending,
      completed,
      avgOrderValue: orders.length ? Math.round(revenue / orders.length) : 0,
      revenueByDay: days,
      categoryStats,
      paymentBreakdown: {
        COD: orders.filter((o) => o.paymentMethod === "COD").length,
        Online: orders.filter((o) => o.paymentMethod === "Online").length,
      },
    });
  } catch (e) {
    console.error("admin/stats error", e);
    return NextResponse.json({ error: "Failed to load stats" }, { status: 500 });
  }
}
