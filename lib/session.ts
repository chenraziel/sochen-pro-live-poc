import crypto from "node:crypto";

// חתימת עוגיית סשן ב-HMAC. הסוד מגיע מ-env (SESSION_SECRET) — לא נשמר בקוד.
const SECRET = process.env.SESSION_SECRET || "dev-only-insecure-secret-change-me";
export const COOKIE = "sp_session";

export function sign(agentId: number): string {
  const payload = `${agentId}.${Date.now()}`;
  const sig = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${Buffer.from(payload).toString("base64url")}.${sig}`;
}

export function verify(token: string | undefined): number | null {
  if (!token) return null;
  const [b64, sig] = token.split(".");
  if (!b64 || !sig) return null;
  const payload = Buffer.from(b64, "base64url").toString();
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
  const id = parseInt(payload.split(".")[0], 10);
  return Number.isFinite(id) ? id : null;
}
