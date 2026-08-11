import { NextRequest, NextResponse } from "next/server";
import { verifySession, SESSION_COOKIE, SessionUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const user = token ? verifySession<SessionUser>(token) : null;

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({ user });
}
