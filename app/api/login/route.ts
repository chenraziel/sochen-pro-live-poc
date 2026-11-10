import { NextResponse } from "next/server";
import { authenticate } from "../../../lib/db";
import { sign, COOKIE } from "../../../lib/session";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { username, password } = await req.json().catch(() => ({}));
  const agent = authenticate(String(username || ""), String(password || ""));
  if (!agent) {
    return NextResponse.json({ ok: false, error: "שם משתמש או סיסמה שגויים" }, { status: 401 });
  }
  const res = NextResponse.json({ ok: true });
  res.cookies.set(COOKIE, sign(agent.id), {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 8,
  });
  return res;
}
