import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export const PRIORITIES = ["high", "medium", "low"] as const;
export type Priority = (typeof PRIORITIES)[number];

export const FILTERS = ["all", "active", "completed"] as const;
export type Filter = (typeof FILTERS)[number];

export const SORTS = ["created", "due", "priority"] as const;
export type Sort = (typeof SORTS)[number];

export type Todo = {
  id: number;
  title: string;
  completed: boolean;
  priority: Priority;
  due_date: string | null;
  created_at: string;
};

type Sql = NeonQueryFunction<false, false>;

const globalForDb = globalThis as unknown as { db?: Promise<Sql> };

async function open(): Promise<Sql> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL 환경변수가 설정되지 않았습니다.");
  const sql = neon(url);
  await sql`
    CREATE TABLE IF NOT EXISTS todos (
      id         SERIAL PRIMARY KEY,
      title      TEXT        NOT NULL,
      completed  BOOLEAN     NOT NULL DEFAULT FALSE,
      priority   TEXT        NOT NULL DEFAULT 'medium' CHECK (priority IN ('high','medium','low')),
      due_date   TEXT,
      created_at TIMESTAMPTZ NOT NULL DEFAULT now()
    )
  `;
  return sql;
}

// Connect lazily (not at build time) and reuse across requests and hot reloads.
export function getDb(): Promise<Sql> {
  if (!globalForDb.db) {
    globalForDb.db = open().catch((error) => {
      globalForDb.db = undefined;
      throw error;
    });
  }
  return globalForDb.db;
}

const WHERE: Record<Filter, string> = {
  all: "",
  active: "WHERE NOT completed",
  completed: "WHERE completed",
};

const ORDER: Record<Sort, string> = {
  created: "id DESC",
  due: "due_date ASC NULLS LAST, id DESC",
  priority:
    "CASE priority WHEN 'high' THEN 0 WHEN 'medium' THEN 1 ELSE 2 END, id DESC",
};

export async function listTodos(filter: Filter, sort: Sort): Promise<Todo[]> {
  const sql = await getDb();
  return (await sql.query(
    `SELECT * FROM todos ${WHERE[filter]} ORDER BY ${ORDER[sort]}`,
  )) as Todo[];
}

export async function countTodos() {
  const sql = await getDb();
  const rows = await sql`
    SELECT COUNT(*)::int AS total,
           (COUNT(*) FILTER (WHERE NOT completed))::int AS active
    FROM todos
  `;
  return rows[0] as { total: number; active: number };
}
