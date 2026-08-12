import { NextResponse } from "next/server";
import { db } from "@/lib/db";

interface ContactBody {
  name?: string;
  email?: string;
  phone?: string;
  subject?: string;
  message?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => null)) as ContactBody | null;

    if (!body) {
      return NextResponse.json(
        { success: false, error: "Invalid request body" },
        { status: 400 }
      );
    }

    const name = body.name?.trim();
    const email = body.email?.trim().toLowerCase();
    const subject = body.subject?.trim();
    const message = body.message?.trim();
    const phone = body.phone?.trim() || null;

    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, subject and message are required",
        },
        { status: 400 }
      );
    }

    if (!EMAIL_RE.test(email)) {
      return NextResponse.json(
        { success: false, error: "Please enter a valid email address" },
        { status: 400 }
      );
    }

    const record = await db.contactMessage.create({
      data: {
        name,
        email,
        phone,
        subject,
        message,
      },
      select: {
        id: true,
        createdAt: true,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message:
          "Thank you for reaching out. Our concierge will respond within 24 hours.",
        id: record.id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("[API_CONTACT_POST]", err);
    return NextResponse.json(
      { success: false, error: "Failed to submit message" },
      { status: 500 }
    );
  }
}
