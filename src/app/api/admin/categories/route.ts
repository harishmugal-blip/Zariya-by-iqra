import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const categories = await db.category.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ categories, count: categories.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const body = await req.json();
    const { slug, name, description, image, icon, active } = body;
    if (!slug || !name) {
      return NextResponse.json({ error: "slug, name are required" }, { status: 400 });
    }
    const category = await db.category.create({
      data: {
        slug: slug.toLowerCase().trim(),
        name,
        description: description || "",
        image: image || "",
        icon: icon || "Package",
        active: active !== false,
      },
    });
    return NextResponse.json({ success: true, category }, { status: 201 });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to create category" }, { status: 500 });
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
    if (updates.slug !== undefined) data.slug = updates.slug.toLowerCase().trim();
    if (updates.name !== undefined) data.name = updates.name;
    if (updates.description !== undefined) data.description = updates.description;
    if (updates.image !== undefined) data.image = updates.image;
    if (updates.icon !== undefined) data.icon = updates.icon;
    if (updates.active !== undefined) data.active = updates.active;
    const category = await db.category.update({ where: { id }, data });
    return NextResponse.json({ success: true, category });
  } catch (e: any) {
    if (e?.code === "P2002") {
      return NextResponse.json({ error: "Category slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: "Failed to update category" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });
    await db.category.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to delete category" }, { status: 500 });
  }
}
