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
