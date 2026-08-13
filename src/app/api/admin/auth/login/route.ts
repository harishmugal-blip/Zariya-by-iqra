import { NextResponse } from "next/server";
import { verifyAdmin, createSessionToken, setSessionCookie } from "@/lib/admin-auth";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required." },
        { status: 400 }
      );
    }

    const session = await verifyAdmin(email, password);
    if (!session) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 }
      );
    }

    const token = await createSessionToken(session);
    const res = NextResponse.json({ success: true, admin: session });
    res.headers.set("Set-Cookie", setSessionCookie(token));
    return res;
  } catch (e) {
    console.error("admin login error", e);
    return NextResponse.json({ error: "Login failed." }, { status: 500 });
  }
}
