import { NextRequest, NextResponse } from "next/server";
import { validateClient } from "@/lib/clients";
import { signSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password required" }, { status: 400 });
    }

    const client = await validateClient(email.trim().toLowerCase(), password);

    if (!client) {
      return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
    }

    const sessionData = {
      email: client.email,
      name: client.name,
      company: client.company ?? "",
      createdAt: client.createdAt,
    };

    const token = signSession(sessionData);

    const res = NextResponse.json({ success: true, user: sessionData });
    res.cookies.set(SESSION_COOKIE, token, {
      httpOnly: true,
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_MAX_AGE,
      secure: process.env.NODE_ENV === "production",
    });

    return res;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
