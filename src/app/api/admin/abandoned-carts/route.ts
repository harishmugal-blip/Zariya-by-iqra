import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";
import { whatsappLink, formatPrice } from "@/lib/utils";
import { BRAND } from "@/data/catalog";

// GET — list all abandoned carts (admin)
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const carts = await db.abandonedCart.findMany({
      where: { recovered: false },
      orderBy: { createdAt: "desc" },
      take: 50,
    });
    const parsed = carts.map((c) => ({
      ...c,
      items: JSON.parse(c.itemsJson || "[]"),
    }));
    return NextResponse.json({ carts: parsed, count: parsed.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — send WhatsApp reminder to customer
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { id } = await req.json();
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });

    const cart = await db.abandonedCart.findUnique({ where: { id } });
    if (!cart) return NextResponse.json({ error: "Not found" }, { status: 404 });
    if (!cart.customerPhone) return NextResponse.json({ error: "No phone number" }, { status: 400 });

    const items = JSON.parse(cart.itemsJson || "[]");
    const itemsList = items.slice(0, 3).map((it: any, i: number) =>
      `${i + 1}. ${it.name} — ₹${(it.price * it.quantity).toLocaleString("en-IN")}`
    ).join("\n");

    const msg = `Namaste! 🌸 You left some beautiful pieces in your ZARIYA bag:\n\n${itemsList}\n\nTotal: ${formatPrice(cart.total)}\n\nComplete your order now and wear the heritage of Kashmir. Visit zariya.com/store`;

    await db.abandonedCart.update({
      where: { id },
      data: { reminderSent: true },
    });

    // Return WhatsApp link for admin to send
    const waLink = whatsappLink(cart.customerPhone, msg);

    return NextResponse.json({ success: true, waLink, message: "WhatsApp reminder link generated" });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
