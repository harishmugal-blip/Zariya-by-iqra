import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

// GET all hero slides (admin)
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const slides = await db.heroSlide.findMany({ orderBy: { order: "asc" } });
    return NextResponse.json({ slides, count: slides.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// CREATE hero slide
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { image, eyebrow, title, subtitle, buttonText, buttonLink, badge, order, active } = body;
    if (!image || !title) return NextResponse.json({ error: "image, title required" }, { status: 400 });
    const slide = await db.heroSlide.create({
      data: {
        image, eyebrow: eyebrow || "Handcrafted in Kashmir · Estd. 2009",
        title, subtitle: subtitle || "", buttonText: buttonText || "Shop Collection",
        buttonLink: buttonLink || "/store", badge: badge || null,
        order: order ?? 0, active: active !== false,
      },
    });
    return NextResponse.json({ success: true, slide }, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// UPDATE hero slide
export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    const data: Record<string, unknown> = {};
    ["image","eyebrow","title","subtitle","buttonText","buttonLink","badge","order","active"].forEach((k) => {
      if (updates[k] !== undefined) data[k] = updates[k];
    });
    const slide = await db.heroSlide.update({ where: { id }, data });
    return NextResponse.json({ success: true, slide });
  } catch (e) {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// DELETE hero slide
export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id required" }, { status: 400 });
    await db.heroSlide.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
