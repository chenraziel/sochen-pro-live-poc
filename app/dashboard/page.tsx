import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { verify, COOKIE } from "../../lib/session";
import { getAgent, clientsForAgent, type Client } from "../../lib/db";
import LogoutButton from "./LogoutButton";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function fmtDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}
function isThisMonth(iso: string) {
  const now = new Date();
  const [y, m] = iso.split("-").map(Number);
  return y === now.getFullYear() && m === now.getMonth() + 1;
}

export default async function Dashboard() {
  const token = (await cookies()).get(COOKIE)?.value;
  const agentId = verify(token);
  if (!agentId) redirect("/");
  const agent = getAgent(agentId);
  if (!agent) redirect("/");

  const clients: Client[] = clientsForAgent(agentId);
  const active = clients.length;
  const renewalsThisMonth = clients.filter((c) => isThisMonth(c.renewal_date)).length;
  const upsells = clients.filter((c) => c.upsell === 1).length;

  return (
    <>
      <div className="demo-ribbon">דמו / POC — נתונים בדויים בלבד, אין מידע אמיתי</div>
      <div className="shell">
        <div className="topbar">
          <div>
            <div className="brand" style={{ fontSize: 26 }}>סוכן<span>.פרו</span></div>
            <div className="who">
              שלום <b>{agent.display_name}</b> · {agent.agency}
            </div>
          </div>
          <LogoutButton />
        </div>

        <div className="kpis">
          <div className="kpi">
            <div className="n">{active}</div>
            <div className="l">לקוחות פעילים</div>
          </div>
          <div className="kpi">
            <div className="n">{renewalsThisMonth}</div>
            <div className="l">חידושים החודש</div>
          </div>
          <div className="kpi accent">
            <div className="n">{upsells}</div>
            <div className="l">הזדמנויות אפסייל פתוחות</div>
          </div>
        </div>

        <div className="section-title">תיק הלקוחות שלי</div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>לקוח</th>
                <th>סוג פוליסה</th>
                <th className="hide-sm">פרמיה שנתית</th>
                <th>חידוש</th>
                <th>הזדמנות אפסייל</th>
              </tr>
            </thead>
            <tbody>
              {clients.map((c) => (
                <tr key={c.id}>
                  <td>
                    <div className="name">{c.full_name}</div>
                    <div className="demoid">ת.ז. דמו {c.demo_id}</div>
                  </td>
                  <td>{c.policy_type}</td>
                  <td className="hide-sm">₪{c.premium_ils.toLocaleString("he-IL")}</td>
                  <td className={isThisMonth(c.renewal_date) ? "soon" : ""}>{fmtDate(c.renewal_date)}</td>
                  <td>
                    {c.upsell === 1 ? (
                      <span className="pill up" title={c.upsell_note || ""}>הזדמנות</span>
                    ) : (
                      <span className="pill none">—</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="foot">
          מסד נתונים חי (SQLite) · הזדהות עם סשן חתום · כל סוכן רואה רק את תיקו · 0% עמלות · כל הנתונים בדויים.
        </div>
      </div>
    </>
  );
}
