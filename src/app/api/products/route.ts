import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { PRODUCTS } from "@/data/catalog";
import type { Product } from "@/lib/types";

// Convert a DB product record to the Product type used by the storefront
function dbToProduct(p: any): Product {
  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    subtitle: p.subtitle || "",
    description: p.description || "",
    story: p.story || "",
    price: p.price,
    compareAtPrice: p.compareAtPrice || undefined,
    currency: (p.currency as "INR") || "INR",
    category: p.category,
    collection: p.collection,
    fabric: p.fabric || "",
    fabricDetails: JSON.parse(p.fabricDetails || "[]"),
    colors: JSON.parse(p.colors || "[]"),
    sizes: JSON.parse(p.sizes || "[]"),
    images: JSON.parse(p.images || "[]"),
    rating: p.rating || 5,
    reviewCount: p.reviewCount || 0,
    reviews: [], // reviews not stored in DB yet — use static if needed
    badges: JSON.parse(p.badges || "[]"),
    featured: p.featured || false,
    bestSeller: p.bestSeller || false,
    newArrival: p.newArrival || false,
    limitedEdition: p.limitedEdition || false,
    stock: p.stock || 0,
    sku: p.sku,
    careInstructions: p.care || "",
    shippingInfo: p.shipping || "",
    tags: JSON.parse(p.tags || "[]"),
    videoUrl: p.videoUrl || undefined,
  };
}

async function getProductsFromDB(): Promise<Product[]> {
  try {
    const rows = await db.product.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map(dbToProduct);
  } catch (e) {
    console.error("[DB_PRODUCTS_FALLBACK]", e);
    return [...PRODUCTS]; // fallback to static
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category");
    const collection = searchParams.get("collection");
    const featured = searchParams.get("featured");
    const bestseller = searchParams.get("bestseller");
    const isNew = searchParams.get("new");
    const limited = searchParams.get("limited");
    const q = searchParams.get("q");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");
    const sort = searchParams.get("sort");

    let products: Product[] = await getProductsFromDB();

    if (category) {
      products = products.filter((p) => p.category === category);
    }
    if (collection) {
      products = products.filter((p) => p.collection === collection);
    }
    if (featured === "true") products = products.filter((p) => p.featured);
    if (bestseller === "true") products = products.filter((p) => p.bestSeller);
    if (isNew === "true") products = products.filter((p) => p.newArrival);
    if (limited === "true") products = products.filter((p) => p.limitedEdition);

    if (q) {
      const term = q.toLowerCase().trim();
      products = products.filter(
        (p) =>
          p.name.toLowerCase().includes(term) ||
          p.subtitle.toLowerCase().includes(term) ||
          p.description.toLowerCase().includes(term) ||
          p.fabric.toLowerCase().includes(term) ||
          p.tags.some((t) => t.toLowerCase().includes(term)) ||
          p.category.toLowerCase().includes(term) ||
          p.collection.toLowerCase().includes(term)
      );
    }

    if (minPrice) {
      const min = Number(minPrice);
      if (!Number.isNaN(min)) products = products.filter((p) => p.price >= min);
    }
    if (maxPrice) {
      const max = Number(maxPrice);
      if (!Number.isNaN(max)) products = products.filter((p) => p.price <= max);
    }

    switch (sort) {
      case "price-asc":
        products.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        products.sort((a, b) => b.price - a.price);
        break;
      case "newest":
        products.sort((a, b) => Number(b.newArrival) - Number(a.newArrival));
        break;
      case "rating":
        products.sort((a, b) => b.rating - a.rating);
        break;
      default:
        break;
    }

    return NextResponse.json({ products, count: products.length });
  } catch (err) {
    console.error("[API_PRODUCTS_GET]", err);
    return NextResponse.json(
      { products: PRODUCTS, count: PRODUCTS.length },
      { status: 200 }
    );
  }
}
