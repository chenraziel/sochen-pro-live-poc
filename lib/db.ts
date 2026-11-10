import { DatabaseSync } from "node:sqlite";

// ─────────────────────────────────────────────────────────────
//  סוכן.פרו — POC דמו | מסד נתונים אמיתי (SQLite) בזיכרון
//  כל הנתונים בדויים לחלוטין. אין PII אמיתי. ת.ז. דמו בלבד.
// ─────────────────────────────────────────────────────────────

let _db: DatabaseSync | null = null;

function seed(db: DatabaseSync) {
  db.exec(`
    CREATE TABLE agents (
      id INTEGER PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,       -- דמו בלבד (POC). בייצור: hash + secret store
      display_name TEXT NOT NULL,
      agency TEXT NOT NULL
    );
    CREATE TABLE clients (
      id INTEGER PRIMARY KEY,
      agent_id INTEGER NOT NULL,
      full_name TEXT NOT NULL,
      demo_id TEXT NOT NULL,        -- ת.ז. דמו (פיקטיבית)
      policy_type TEXT NOT NULL,
      premium_ils INTEGER NOT NULL,
      renewal_date TEXT NOT NULL,   -- YYYY-MM-DD
      upsell INTEGER NOT NULL,      -- 0/1
      upsell_note TEXT,
      FOREIGN KEY (agent_id) REFERENCES agents(id)
    );
  `);

  const insA = db.prepare(
    "INSERT INTO agents (id, username, password, display_name, agency) VALUES (?,?,?,?,?)"
  );
  insA.run(1, "demo", "demo1234", "רונית לוי", "סוכנות דמו א׳");
  insA.run(2, "dani", "dani1234", "דני הרשלר", "סוכנות דמו ב׳");

  const insC = db.prepare(
    "INSERT INTO clients (agent_id, full_name, demo_id, policy_type, premium_ils, renewal_date, upsell, upsell_note) VALUES (?,?,?,?,?,?,?,?)"
  );
  // agent 1 — רונית לוי
  const a1 = [
    ["אבי כהן (דמו)", "900000011", "ביטוח רכב מקיף", 3200, "2026-11-22", 1, "אין כיסוי תכולת בית — הצעה להרחבה"],
    ["מירב שגב (דמו)", "900000012", "ביטוח דירה", 1450, "2026-11-28", 1, "ללא כיסוי רעידת אדמה"],
    ["יוסי פרידמן (דמו)", "900000013", "ביטוח חיים", 2100, "2027-02-10", 0, null],
    ["נועה ברק (דמו)", "900000014", "ביטוח בריאות", 2680, "2026-11-30", 1, "שדרוג כתב שירות ניתוחים"],
    ["רון אלמוג (דמו)", "900000015", "ביטוח רכב צד ג׳", 1150, "2027-01-05", 0, null],
    ["דנה טל (דמו)", "900000016", "ביטוח נסיעות", 320, "2026-12-15", 0, null],
  ];
  // agent 2 — דני הרשלר
  const a2 = [
    ["שרה לוין (דמו)", "900000021", "ביטוח דירה", 1600, "2026-11-19", 1, "חוסר כיסוי לתכשיטים"],
    ["עידו רז (דמו)", "900000022", "ביטוח רכב מקיף", 3550, "2026-11-25", 1, "זכאי לכיסוי נהג צעיר מוזל"],
    ["תמר גולן (דמו)", "900000023", "ביטוח חיים", 1980, "2027-03-01", 0, null],
    ["אורי שמש (דמו)", "900000024", "ביטוח בריאות", 2450, "2026-11-27", 1, "ללא כיסוי תרופות מחוץ לסל"],
    ["ליאת מור (דמו)", "900000025", "ביטוח משכנתא", 890, "2027-01-18", 0, null],
    ["גיא נחום (דמו)", "900000026", "ביטוח עסק קטן", 4100, "2026-12-02", 0, null],
  ];
  for (const r of a1) insC.run(1, ...(r as [string, string, string, number, string, number, string | null]));
  for (const r of a2) insC.run(2, ...(r as [string, string, string, number, string, number, string | null]));
}

export function db(): DatabaseSync {
  if (!_db) {
    _db = new DatabaseSync(":memory:");
    seed(_db);
  }
  return _db;
}

export type Agent = { id: number; username: string; display_name: string; agency: string };
export type Client = {
  id: number; agent_id: number; full_name: string; demo_id: string;
  policy_type: string; premium_ils: number; renewal_date: string;
  upsell: number; upsell_note: string | null;
};

export function authenticate(username: string, password: string): Agent | null {
  const row = db()
    .prepare("SELECT id, username, display_name, agency FROM agents WHERE username = ? AND password = ?")
    .get(username, password) as Agent | undefined;
  return row ?? null;
}

export function getAgent(id: number): Agent | null {
  const row = db()
    .prepare("SELECT id, username, display_name, agency FROM agents WHERE id = ?")
    .get(id) as Agent | undefined;
  return row ?? null;
}

export function clientsForAgent(agentId: number): Client[] {
  return db()
    .prepare("SELECT * FROM clients WHERE agent_id = ? ORDER BY renewal_date ASC")
    .all(agentId) as Client[];
}
