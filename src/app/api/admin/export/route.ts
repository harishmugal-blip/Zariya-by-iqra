import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";
import { PRODUCTS } from "@/data/catalog";

function toCSV(rows: Record<string, any>[], headers: string[]): string {
  const headerLine = headers.join(",");
  const dataLines = rows.map((row) =>
    headers
      .map((h) => {
        const val = row[h];
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        // Escape quotes and commas
        if (str.includes(",") || str.includes('"') || str.includes("\n")) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      })
      .join(",")
  );
  return [headerLine, ...dataLines].join("\n");
}

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  try {
    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type") || "orders";

    let csv = "";
    let filename = "";

    if (type === "orders") {
      const orders = await db.order.findMany({ orderBy: { createdAt: "desc" } });
      const rows = orders.map((o) => ({
        orderNumber: o.orderNumber,
        customerName: o.customerName,
        email: o.email,
        phone: o.phone,
        city: o.city,
        state: o.state,
        total: o.total,
        paymentMethod: o.paymentMethod,
        status: o.status,
        couponCode: o.couponCode || "",
        createdAt: o.createdAt.toISOString(),
      }));
      csv = toCSV(rows, ["orderNumber", "customerName", "email", "phone", "city", "state", "total", "paymentMethod", "status", "couponCode", "createdAt"]);
      filename = "zariya-orders.csv";
    } else if (type === "products") {
      const products = await db.product.findMany({ orderBy: { createdAt: "desc" } });
      const rows = products.map((p) => ({
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        category: p.category,
        price: p.price,
        compareAtPrice: p.compareAtPrice || "",
        stock: p.stock,
        fabric: p.fabric,
        featured: p.featured,
        bestSeller: p.bestSeller,
        newArrival: p.newArrival,
        limitedEdition: p.limitedEdition,
        active: p.active,
      }));
      csv = toCSV(rows, ["name", "slug", "sku", "category", "price", "compareAtPrice", "stock", "fabric", "featured", "bestSeller", "newArrival", "limitedEdition", "active"]);
      filename = "zariya-products.csv";
    } else if (type === "customers") {
      const subs = await db.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
      const orders = await db.order.findMany();
      const customerMap = new Map<string, { email: string; name: string; orders: number; totalSpent: number }>();
      subs.forEach((s) => customerMap.set(s.email, { email: s.email, name: s.name || "", orders: 0, totalSpent: 0 }));
      orders.forEach((o) => {
        const existing = customerMap.get(o.email);
        if (existing) {
          existing.orders++;
          existing.totalSpent += o.total || 0;
        } else {
          customerMap.set(o.email, { email: o.email, name: o.customerName, orders: 1, totalSpent: o.total || 0 });
        }
      });
      const rows = Array.from(customerMap.values());
      csv = toCSV(rows, ["name", "email", "orders", "totalSpent"]);
      filename = "zariya-customers.csv";
    }

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (e) {
    console.error("export error", e);
    return NextResponse.json({ error: "Failed to export" }, { status: 500 });
  }
}
