import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";

// UPDATE a product
export async function PATCH(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    // Build update object — handle JSON fields
    const data: Record<string, unknown> = {};
    const fields = [
      "slug", "name", "subtitle", "description", "story", "price",
      "compareAtPrice", "category", "collection", "fabric", "sku",
      "care", "shipping", "videoUrl", "rating", "reviewCount",
      "featured", "bestSeller", "newArrival", "limitedEdition", "active",
    ];
    for (const f of fields) {
      if (updates[f] !== undefined) data[f] = updates[f];
    }
    if (updates.price !== undefined) data.price = Number(updates.price);
    if (updates.compareAtPrice !== undefined) data.compareAtPrice = updates.compareAtPrice ? Number(updates.compareAtPrice) : null;
    if (updates.rating !== undefined) data.rating = Number(updates.rating);
    if (updates.reviewCount !== undefined) data.reviewCount = Number(updates.reviewCount);
    if (updates.fabricDetails !== undefined) data.fabricDetails = JSON.stringify(updates.fabricDetails);
    if (updates.colors !== undefined) data.colors = JSON.stringify(updates.colors);
    if (updates.sizes !== undefined) data.sizes = JSON.stringify(updates.sizes);
    if (updates.images !== undefined) data.images = JSON.stringify(updates.images);
    if (updates.badges !== undefined) data.badges = JSON.stringify(updates.badges);
    if (updates.tags !== undefined) data.tags = JSON.stringify(updates.tags);
    if (updates.careInstructions !== undefined) data.care = updates.careInstructions;
    if (updates.shippingInfo !== undefined) data.shipping = updates.shippingInfo;

    const product = await db.product.update({
      where: { id },
      data,
    });

    return NextResponse.json({ success: true, product });
  } catch (e: any) {
    console.error("admin products PATCH error", e);
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this slug or SKU already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
  }
}

// DELETE a product
export async function DELETE(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "id is required" }, { status: 400 });
    }

    await db.product.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("admin products DELETE error", e);
    return NextResponse.json({ error: "Failed to delete product" }, { status: 500 });
  }
}
