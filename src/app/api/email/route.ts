import { NextResponse } from "next/server";
import { db } from "@/lib/db";

// POST — send email (mock — stores email in DB, in production use SMTP/SendGrid)
export async function POST(req: Request) {
  try {
    const { to, subject, template, data } = await req.json();

    if (!to || !template) {
      return NextResponse.json({ error: "to, template required" }, { status: 400 });
    }

    // Email templates
    const templates: Record<string, { subject: string; body: string }> = {
      welcome: {
        subject: "Welcome to ZARIYA by IQRA 🌸",
        body: `Namaste ${data?.name || ""},\n\nWelcome to the ZARIYA circle! You're now part of a community that values craft over speed and heritage over hype.\n\nAs a welcome gift, use code ZARIYA10 for 10% off your first order.\n\nExplore our collection: zariya.com/store\n\nWith love,\nThe ZARIYA Atelier`,
      },
      order_confirmation: {
        subject: `Order Confirmed — ${data?.orderNumber || ""}`,
        body: `Namaste ${data?.name || ""},\n\nYour order ${data?.orderNumber || ""} has been confirmed!\n\nTotal: ₹${(data?.total || 0).toLocaleString("en-IN")}\nPayment: ${data?.paymentMethod || "COD"}\n\nYour piece is being hand-prepared by our artisans. We'll notify you when it ships.\n\nTrack your order: zariya.com/track\n\nWith love,\nThe ZARIYA Atelier`,
      },
      shipping_update: {
        subject: `Your order has shipped — ${data?.orderNumber || ""}`,
        body: `Namaste ${data?.name || ""},\n\nGreat news! Your order ${data?.orderNumber || ""} has been dispatched.\n\nIt will arrive in our heirloom ivory box, hand-sealed in gold.\n\nWith love,\nThe ZARIYA Atelier`,
      },
      abandoned_cart: {
        subject: "You left something beautiful behind 🌸",
        body: `Namaste,\n\nYou left some beautiful pieces in your ZARIYA bag. They're still waiting for you!\n\nComplete your order: zariya.com/store\n\nWith love,\nThe ZARIYA Atelier`,
      },
      review_request: {
        subject: `How was your ${data?.productName || "ZARIYA piece"}?`,
        body: `Namaste ${data?.name || ""},\n\nWe hope you're loving your ${data?.productName || "ZARIYA piece"}! We'd be honored if you could share your experience with a review.\n\nWith love,\nThe ZARIYA Atelier`,
      },
    };

    const tpl = templates[template];
    if (!tpl) {
      return NextResponse.json({ error: "Invalid template" }, { status: 400 });
    }

    const finalSubject = subject || tpl.subject;

    // In production: use nodemailer / SendGrid / Resend to actually send
    // For now, log to console and return success
    console.log(`📧 EMAIL SENT:\nTo: ${to}\nSubject: ${finalSubject}\nBody: ${tpl.body}\n`);

    return NextResponse.json({
      success: true,
      to,
      subject: finalSubject,
      template,
      note: "Demo mode — email logged. Set SMTP credentials in .env for real emails.",
    });
  } catch (e) {
    console.error("email error", e);
    return NextResponse.json({ error: "Failed to send email" }, { status: 500 });
  }
}
