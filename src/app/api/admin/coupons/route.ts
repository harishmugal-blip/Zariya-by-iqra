import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const coupons = await db.coupon.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ coupons, count: coupons.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { code, type, value, minOrder, description, active } = body;
    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: "code, type, value are required" }, { status: 400 });
    }
    const coupon = await db.coupon.create({
      data: {
        code: code.toUpperCase().trim(),
        type,
        value: Number(value),
        minOrder: Number(minOrder) || 0,
        description: description || "",
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, coupon }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create coupon" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    if (updates.code !== undefined) data.code = updates.code.toUpperCase().trim();
    if (updates.type !== undefined) data.type = updates.type;
    if (updates.value !== undefined) data.value = Number(updates.value);
    if (updates.minOrder !== undefined) data.minOrder = Number(updates.minOrder);
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.active !== undefined) data.active = updates.active;
    const coupon = await db.coupon.update({ where: { id }, data });
    return NextResponse.json({ success: true, coupon });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Coupon code already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update coupon" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await db.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete coupon" }, { status: 500 });
  }
}
