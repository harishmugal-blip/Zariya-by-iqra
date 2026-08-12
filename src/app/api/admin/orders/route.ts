import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const orders = await db.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
    });
    const parsed = orders.map((o) => ({
      ...o,
      items: JSON.parse(o.itemsJson || "[]"),
    }));
    return NextResponse.json({ orders: parsed, count: parsed.length });
  } catch (e) {
    console.error("admin/orders error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// Update order status
export async function PATCH(req: Request) {
  try {
    const { id, status } = await req.json();
    if (!id || !status) {
      return NextResponse.json({ error: "id and status required" }, { status: 400 });
    }
    const updated = await db.order.update({
      where: { id },
      data: { status },
    });
    return NextResponse.json({ success: true, order: updated });
  } catch (e) {
    console.error("admin/orders PATCH error", e);
    return NextResponse.json({ error: "Failed to update" }, { status: 500 });
  }
}
