import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    let settings = await db.storeSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await db.storeSettings.create({ data: { id: "singleton" } });
    }
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const allowed = ["storeName","email","phone","whatsapp","address","currency","gstRate","codEnabled","upiEnabled","cardEnabled","freeShipping"];
    const data: Record<string, unknown> = {};
    for (const k of allowed) {
      if (body[k] !== undefined) data[k] = body[k];
    }
    let settings = await db.storeSettings.findUnique({ where: { id: "singleton" } });
    if (!settings) {
      settings = await db.storeSettings.create({ data: { id: "singleton", ...data } as any });
    } else {
      settings = await db.storeSettings.update({ where: { id: "singleton" }, data });
    }
    return NextResponse.json({ success: true, settings });
  } catch (e) {
    console.error("settings PATCH error", e);
    return NextResponse.json({ error: "Failed to save" }, { status: 500 });
  }
}
