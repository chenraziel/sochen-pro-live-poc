"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setErr("");
    const res = await fetch("/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (res.ok) {
      router.push("/dashboard");
    } else {
      const d = await res.json().catch(() => ({}));
      setErr(d.error || "התחברות נכשלה");
      setBusy(false);
    }
  }

  return (
    <>
      <div className="demo-ribbon">דמו / POC — נתונים בדויים בלבד, אין מידע אמיתי</div>
      <div className="login-wrap">
        <div className="login-card">
          <div className="brand">סוכן<span>.פרו</span></div>
          <div className="brand-sub">דשבורד סוכני ביטוח · 0% עמלות</div>
          <h1>כניסת סוכן</h1>
          <form onSubmit={onSubmit}>
            <div className="field">
              <label>שם משתמש</label>
              <input value={username} onChange={(e) => setUsername(e.target.value)} autoComplete="off" />
            </div>
            <div className="field">
              <label>סיסמה</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="off" />
            </div>
            <button className="btn" disabled={busy}>{busy ? "מתחבר…" : "התחברות"}</button>
            <div className="err">{err}</div>
          </form>
          <div className="hint">
            <b>פרטי התחברות לדמו:</b>
            <div className="row">סוכנת א׳ — משתמש <code>demo</code> · סיסמה <code>demo1234</code></div>
            <div className="row">סוכן ב׳ — משתמש <code>dani</code> · סיסמה <code>dani1234</code></div>
            <div className="row" style={{ marginTop: 10, color: "var(--ink-sub)" }}>
              כל סוכן רואה רק את הלקוחות שלו — כך ההזדהות מגינה על ההפרדה בין התיקים.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
