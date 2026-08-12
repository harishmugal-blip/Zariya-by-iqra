import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

interface NewsletterBody {
  email?: string;
  name?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as NewsletterBody | null;

    if (!body || !body.email || typeof body.email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email is required" },
        { status: 400 }
      );
    }

    const email = body.email.trim().toLowerCase();
    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const name = body.name?.trim() || null;

    try {
      await db.newsletterSubscriber.create({
        data: { email, name },
      });
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError) {
        // P2002 = unique constraint violation — already subscribed
        if (err.code === "P2002") {
          return NextResponse.json({
            success: true,
            message: "Already subscribed",
            alreadySubscribed: true,
          });
        }
      }
      throw err;
    }

    return NextResponse.json(
      {
        success: true,
        message: "Welcome to the ZARIYA inner circle.",
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API_NEWSLETTER_POST]", err);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const count = await db.newsletterSubscriber.count();
    return NextResponse.json({ count });
  } catch (err) {
    console.error("[API_NEWSLETTER_GET]", err);
    return NextResponse.json(
      { error: "Failed to fetch subscriber count" },
      { status: 500 }
    );
  }
}
