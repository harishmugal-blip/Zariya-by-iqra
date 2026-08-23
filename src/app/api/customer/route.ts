import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

// GET all customers
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const customers = await db.customerAccount.findMany({
      orderBy: { createdAt: "desc" },
    });
    const orders = await db.order.findMany();

    const enriched = customers.map((c) => {
      const customerOrders = orders.filter((o) => o.email === c.email);
      return {
        ...c,
        addresses: JSON.parse(c.addressesJson || "[]"),
        orderCount: customerOrders.length,
        totalSpent: customerOrders.reduce((s, o) => s + (o.total || 0), 0),
        orders: customerOrders.map((o) => ({
          id: o.id,
          orderNumber: o.orderNumber,
          total: o.total,
          status: o.status,
          createdAt: o.createdAt,
        })),
      };
    });

    return NextResponse.json({ customers: enriched, count: enriched.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// POST — create or update customer account
export async function POST(req: Request) {
  try {
    const { email, name, phone } = await req.json();
    if (!email || !name) {
      return NextResponse.json({ error: "email, name required" }, { status: 400 });
    }
    const existing = await db.customerAccount.findUnique({ where: { email } });
    if (existing) {
      const updated = await db.customerAccount.update({
        where: { email },
        data: { name, phone: phone || existing.phone },
      });
      return NextResponse.json({ success: true, customer: updated });
    }
    const customer = await db.customerAccount.create({
      data: { email, name, phone: phone || null },
    });
    return NextResponse.json({ success: true, customer }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") return NextResponse.json({ error: "Email exists" }, { status: 409 });
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// PATCH — add/update address
export async function PATCH(req: Request) {
  try {
    const { email, address } = await req.json();
    if (!email || !address) return NextResponse.json({ error: "email, address required" }, { status: 400 });

    const customer = await db.customerAccount.findUnique({ where: { email } });
    if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 });

    const addresses = JSON.parse(customer.addressesJson || "[]");
    const existingIdx = addresses.findIndex((a: any) => a.label === address.label);
    if (existingIdx >= 0) {
      addresses[existingIdx] = address;
    } else {
      addresses.push({ ...address, id: `addr-${Date.now()}` });
    }

    const updated = await db.customerAccount.update({
      where: { email },
      data: { addressesJson: JSON.stringify(addresses) },
    });

    return NextResponse.json({ success: true, addresses });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
