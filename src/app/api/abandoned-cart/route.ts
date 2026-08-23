import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { BRAND } from "@/data/catalog";
import { whatsappLink } from "@/lib/utils";

// POST — save abandoned cart (when user leaves checkout without completing)
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, items, total } = body;

    if (!items || !items.length) {
      return NextResponse.json({ error: "No items" }, { status: 400 });
    }

    // Check if there's an existing unrecovered cart for this email/phone
    const existing = await db.abandonedCart.findFirst({
      where: {
        OR: [
          ...(email ? [{ customerEmail: email }] : []),
          ...(phone ? [{ customerPhone: phone }] : []),
        ],
        recovered: false,
      },
      orderBy: { createdAt: "desc" },
    });

    if (existing) {
      // Update existing
      const updated = await db.abandonedCart.update({
        where: { id: existing.id },
        data: {
          itemsJson: JSON.stringify(items),
          total: total || 0,
          customerEmail: email || existing.customerEmail,
          customerPhone: phone || existing.customerPhone,
        },
      });

      // Send WhatsApp reminder if not sent yet and phone exists
      if (!existing.reminderSent && phone) {
        const itemsList = items.slice(0, 3).map((it: any, i: number) =>
          `${i + 1}. ${it.name} — ₹${(it.price * it.quantity).toLocaleString("en-IN")}`
        ).join("\n");
        const msg = `Namaste! 🌸 You left some beautiful pieces in your ZARIYA bag:\n\n${itemsList}\n\nTotal: ₹${(total || 0).toLocaleString("en-IN")}\n\nComplete your order now and wear the heritage of Kashmir. Reply to order or visit zariya.com/store`;

        // In production, this would send via WhatsApp Business API
        // For now, we mark it as reminder sent
        await db.abandonedCart.update({
          where: { id: existing.id },
          data: { reminderSent: true },
        });
      }

      return NextResponse.json({ success: true, id: updated.id, action: "updated" });
    }

    // Create new abandoned cart
    const cart = await db.abandonedCart.create({
      data: {
        customerEmail: email || null,
        customerPhone: phone || null,
        itemsJson: JSON.stringify(items),
        total: total || 0,
      },
    });

    return NextResponse.json({ success: true, id: cart.id, action: "created" }, { status: 201 });
  } catch (e) {
    console.error("abandoned cart error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE — mark cart as recovered (when order is placed)
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");
    const phone = searchParams.get("phone");

    if (email || phone) {
      await db.abandonedCart.updateMany({
        where: {
          OR: [
            ...(email ? [{ customerEmail: email }] : []),
            ...(phone ? [{ customerPhone: phone }] : []),
          ],
          recovered: false,
        },
        data: { recovered: true },
      });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
