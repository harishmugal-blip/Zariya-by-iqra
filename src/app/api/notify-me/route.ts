import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// In-memory store for notify-me subscriptions (demo).
// In production, this would be a Prisma model: NotifySubscription.
interface NotifySub {
  id: string;
  email: string;
  phone?: string;
  productSlug: string;
  productName: string;
  type: "BACK_IN_STOCK" | "PRICE_DROP";
  threshold?: number;
  createdAt: string;
}

const SUBS: NotifySub[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, phone, productSlug, productName, type, threshold } = body || {};

    if (!email || !productSlug || !type) {
      return NextResponse.json(
        { error: "Email, product slug, and type are required." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    if (!["BACK_IN_STOCK", "PRICE_DROP"].includes(type)) {
      return NextResponse.json(
        { error: "Invalid notification type." },
        { status: 400 }
      );
    }

    // Check for duplicate
    const existing = SUBS.find(
      (s) =>
        s.email.toLowerCase() === email.toLowerCase() &&
        s.productSlug === productSlug &&
        s.type === type
    );
    if (existing) {
      return NextResponse.json({
        success: true,
        message: "You're already on the list — we'll notify you the moment it happens.",
        alreadySubscribed: true,
      });
    }

    const sub: NotifySub = {
      id: `sub-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      email: email.toLowerCase(),
      phone: phone || undefined,
      productSlug,
      productName,
      type,
      threshold: type === "PRICE_DROP" ? threshold : undefined,
      createdAt: new Date().toISOString(),
    };
    SUBS.push(sub);

    return NextResponse.json({
      success: true,
      message:
        type === "BACK_IN_STOCK"
          ? "We'll write to you the moment this piece is back in the atelier."
          : "We'll notify you the instant this piece goes on sale.",
      id: sub.id,
    });
  } catch (e) {
    console.error("notify-me error", e);
    return NextResponse.json({ error: "Failed to subscribe." }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const productSlug = searchParams.get("productSlug");
    let list = SUBS;
    if (productSlug) list = SUBS.filter((s) => s.productSlug === productSlug);
    return NextResponse.json({ subscriptions: list, count: list.length });
  } catch {
    return NextResponse.json({ error: "Failed" }, { status: 500 });
  }
}
