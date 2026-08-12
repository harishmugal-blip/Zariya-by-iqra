import { NextResponse } from "next/server";

interface ReviewBody {
  productSlug?: string;
  author?: string;
  rating?: number;
  title?: string;
  body?: string;
}

// In-memory store for reviews pending moderation.
// (Resets on cold start — this endpoint acknowledges submissions
// without persisting to the static catalog data layer.)
const pendingReviews: Array<{
  id: string;
  productSlug: string;
  author: string;
  rating: number;
  title: string;
  body: string;
  createdAt: string;
}> = [];

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ReviewBody | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const productSlug = body.productSlug?.trim();
    const author = body.author?.trim();
    const rating = Number(body.rating);
    const title = body.title?.trim();
    const reviewBody = body.body?.trim();

    if (!productSlug || !author || !title || !reviewBody) {
      return NextResponse.json(
        {
          success: false,
          error: "productSlug, author, title and body are required",
        },
        { status: 400 }
      );
    }

    if (!Number.isFinite(rating) || rating < 1 || rating > 5) {
      return NextResponse.json(
        { success: false, error: "Rating must be between 1 and 5" },
        { status: 400 }
      );
    }

    const record = {
      id: `rev-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      productSlug,
      author,
      rating: Math.round(rating),
      title,
      body: reviewBody,
      createdAt: new Date().toISOString(),
    };

    pendingReviews.push(record);
    // Keep the in-memory buffer bounded
    if (pendingReviews.length > 500) pendingReviews.splice(0, pendingReviews.length - 500);

    return NextResponse.json(
      {
        success: true,
        message: "Review submitted for moderation",
        id: record.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API_REVIEWS_POST]", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit review" },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productSlug = searchParams.get("productSlug");

    const list = productSlug
      ? pendingReviews.filter((r) => r.productSlug === productSlug)
      : pendingReviews;

    return NextResponse.json({ reviews: list, count: list.length });
  } catch (err) {
    console.error("[API_REVIEWS_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    );
  }
}
