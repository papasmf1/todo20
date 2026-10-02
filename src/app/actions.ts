"use server";

import { revalidatePath } from "next/cache";
import { getDb, PRIORITIES, type Priority } from "@/lib/db";

export type FormState = { error?: string };

function parseFields(formData: FormData) {
  const title = String(formData.get("title") ?? "").trim();
  const rawPriority = String(formData.get("priority") ?? "medium");
  const priority: Priority = (PRIORITIES as readonly string[]).includes(
    rawPriority,
  )
    ? (rawPriority as Priority)
    : "medium";
  const rawDue = String(formData.get("due_date") ?? "");
  const dueDate = /^\d{4}-\d{2}-\d{2}$/.test(rawDue) ? rawDue : null;
  return { title, priority, dueDate };
}

function validateTitle(title: string): string | undefined {
  if (!title) return "할 일을 입력해 주세요.";
  if (title.length > 200) return "할 일은 200자 이내로 입력해 주세요.";
}

export async function addTodo(
  _prev: FormState,
  formData: FormData,
): Promise<FormState> {
  const { title, priority, dueDate } = parseFields(formData);
  const error = validateTitle(title);
  if (error) return { error };
  const sql = await getDb();
  await sql`
    INSERT INTO todos (title, priority, due_date)
    VALUES (${title}, ${priority}, ${dueDate})
  `;
  revalidatePath("/");
  return {};
}

export async function updateTodo(id: number, formData: FormData) {
  const { title, priority, dueDate } = parseFields(formData);
  if (validateTitle(title)) return;
  const sql = await getDb();
  await sql`
    UPDATE todos
    SET title = ${title}, priority = ${priority}, due_date = ${dueDate}
    WHERE id = ${id}
  `;
  revalidatePath("/");
}

export async function toggleTodo(id: number) {
  const sql = await getDb();
  await sql`UPDATE todos SET completed = NOT completed WHERE id = ${id}`;
  revalidatePath("/");
}

export async function deleteTodo(id: number) {
  const sql = await getDb();
  await sql`DELETE FROM todos WHERE id = ${id}`;
  revalidatePath("/");
}

export async function clearCompleted() {
  const sql = await getDb();
  await sql`DELETE FROM todos WHERE completed`;
  revalidatePath("/");
}
