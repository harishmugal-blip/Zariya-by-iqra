import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/admin-auth";
import type { Product } from "@/lib/types";

// GET all products (admin)
export async function GET(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const products = await db.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    const parsed = products.map((p) => ({
      ...p,
      fabricDetails: JSON.parse(p.fabricDetails || "[]"),
      colors: JSON.parse(p.colors || "[]"),
      sizes: JSON.parse(p.sizes || "[]"),
      images: JSON.parse(p.images || "[]"),
      badges: JSON.parse(p.badges || "[]"),
      tags: JSON.parse(p.tags || "[]"),
      careInstructions: p.care,
      shippingInfo: p.shipping,
    }));
    return NextResponse.json({ products: parsed, count: parsed.length });
  } catch (e) {
    console.error("admin products GET error", e);
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}

// CREATE a new product
export async function POST(req: Request) {
  const session = await getSession(req);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  try {
    const body = await req.json();
    const {
      slug,
      name,
      subtitle,
      description,
      story,
      price,
      compareAtPrice,
      category,
      collection,
      fabric,
      fabricDetails,
      colors,
      sizes,
      images,
      rating,
      reviewCount,
      badges,
      featured,
      bestSeller,
      newArrival,
      limitedEdition,
      stock,
      sku,
      careInstructions,
      shippingInfo,
      tags,
      videoUrl,
    } = body;

    if (!slug || !name || !price || !category || !sku) {
      return NextResponse.json(
        { error: "slug, name, price, category, sku are required" },
        { status: 400 }
      );
    }

    const product = await db.product.create({
      data: {
        slug,
        name,
        subtitle: subtitle || "",
        description: description || "",
        story: story || "",
        price: Number(price),
        compareAtPrice: compareAtPrice ? Number(compareAtPrice) : null,
        category,
        collection: collection || "",
        fabric: fabric || "",
        fabricDetails: JSON.stringify(fabricDetails || []),
        colors: JSON.stringify(colors || []),
        sizes: JSON.stringify(sizes || []),
        images: JSON.stringify(images || []),
        rating: rating ? Number(rating) : 5,
        reviewCount: reviewCount ? Number(reviewCount) : 0,
        badges: JSON.stringify(badges || []),
        featured: Boolean(featured),
        bestSeller: Boolean(bestSeller),
        newArrival: Boolean(newArrival),
        limitedEdition: Boolean(limitedEdition),
        stock: stock ? Number(stock) : 0,
        sku,
        care: careInstructions || "",
        shipping: shippingInfo || "",
        tags: JSON.stringify(tags || []),
        videoUrl: videoUrl || null,
        active: true,
      },
    });

    return NextResponse.json({ success: true, product }, { status: 201 });
  } catch (e: any) {
    console.error("admin products POST error", e);
    if (e?.code === "P2002") {
      return NextResponse.json(
        { error: "A product with this slug or SKU already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create product" }, { status: 500 });
  }
}

// UPDATE a product (id in body, not URL)
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

// DELETE a product (id in query)
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
