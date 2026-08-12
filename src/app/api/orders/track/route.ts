import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// GET /api/orders/track?order=ZRY-XXXX or ?email=foo@bar.com
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const orderNumber = searchParams.get("order")?.trim();
    const email = searchParams.get("email")?.trim().toLowerCase();

    if (!orderNumber && !email) {
      return NextResponse.json(
        { error: "Please provide an order number or email." },
        { status: 400 }
      );
    }

    const where: Record<string, unknown> = {};
    if (orderNumber) where.orderNumber = { contains: orderNumber };
    if (email) where.email = { contains: email };

    const orders = await db.order.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    if (orders.length === 0) {
      return NextResponse.json(
        { error: "No order found. Please check your order number or email." },
        { status: 404 }
      );
    }

    const parsed = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.itemsJson || "[]"),
    }));

    return NextResponse.json({ orders: parsed, count: parsed.length });
  } catch (e) {
    console.error("orders/track error", e);
    return NextResponse.json({ error: "Failed to look up order." }, { status: 500 });
  }
}
