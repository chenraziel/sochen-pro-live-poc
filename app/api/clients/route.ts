import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verify, COOKIE } from "../../../lib/session";
import { getAgent, clientsForAgent } from "../../../lib/db";

export const runtime = "nodejs";

export async function GET() {
  const token = (await cookies()).get(COOKIE)?.value;
  const agentId = verify(token);
  if (!agentId) return NextResponse.json({ ok: false }, { status: 401 });
  const agent = getAgent(agentId);
  if (!agent) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, agent, clients: clientsForAgent(agentId) });
}
