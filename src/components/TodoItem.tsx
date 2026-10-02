"use client";

import { useState, useTransition } from "react";
import { deleteTodo, toggleTodo, updateTodo } from "@/app/actions";
import type { Priority, Todo } from "@/lib/db";

const PRIORITY_LABEL: Record<Priority, string> = {
  high: "높음",
  medium: "보통",
  low: "낮음",
};

const PRIORITY_STYLE: Record<Priority, string> = {
  high: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  medium: "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
  low: "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400",
};

const field =
  "rounded-lg border border-zinc-300 bg-white px-2 py-1 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900";

const ghostButton =
  "rounded-md px-2 py-1 text-sm text-zinc-500 hover:bg-zinc-200 hover:text-zinc-900 dark:hover:bg-zinc-800 dark:hover:text-zinc-100";

export function TodoItem({ todo, today }: { todo: Todo; today: string }) {
  const [editing, setEditing] = useState(false);
  const [pending, startTransition] = useTransition();
  const done = todo.completed;
  const overdue = !done && todo.due_date !== null && todo.due_date < today;

  if (editing) {
    return (
      <li className="p-3">
        <form
          action={async (formData) => {
            await updateTodo(todo.id, formData);
            setEditing(false);
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") setEditing(false);
          }}
          className="flex flex-wrap gap-2"
        >
          <input
            name="title"
            defaultValue={todo.title}
            aria-label="할 일"
            maxLength={200}
            required
            autoFocus
            className={`${field} min-w-0 flex-1 basis-full sm:basis-0`}
          />
          <select
            name="priority"
            defaultValue={todo.priority}
            aria-label="우선순위"
            className={field}
          >
            <option value="high">높음</option>
            <option value="medium">보통</option>
            <option value="low">낮음</option>
          </select>
          <input
            type="date"
            name="due_date"
            defaultValue={todo.due_date ?? ""}
            aria-label="마감일"
            className={field}
          />
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-1 text-sm text-white hover:bg-blue-700"
          >
            저장
          </button>
          <button
            type="button"
            onClick={() => setEditing(false)}
            className={ghostButton}
          >
            취소
          </button>
        </form>
      </li>
    );
  }

  return (
    <li className={`flex items-center gap-3 p-3 ${pending ? "opacity-50" : ""}`}>
      <input
        type="checkbox"
        checked={done}
        disabled={pending}
        onChange={() => startTransition(() => toggleTodo(todo.id))}
        aria-label={`${todo.title} 완료`}
        className="size-5 shrink-0 accent-blue-600"
      />
      <div className="min-w-0 flex-1">
        <p
          className={`break-words ${done ? "text-zinc-400 line-through dark:text-zinc-600" : ""}`}
        >
          {todo.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
          <span
            className={`rounded-full px-2 py-0.5 font-medium ${PRIORITY_STYLE[todo.priority]}`}
          >
            {PRIORITY_LABEL[todo.priority]}
          </span>
          {todo.due_date && (
            <time
              dateTime={todo.due_date}
              className={
                overdue
                  ? "font-semibold text-red-600 dark:text-red-400"
                  : "text-zinc-500"
              }
            >
              마감 {todo.due_date}
              {overdue && " (지남)"}
            </time>
          )}
        </div>
      </div>
      <button
        type="button"
        onClick={() => setEditing(true)}
        className={ghostButton}
      >
        수정
      </button>
      <button
        type="button"
        disabled={pending}
        onClick={() => startTransition(() => deleteTodo(todo.id))}
        className={`${ghostButton} hover:text-red-600 dark:hover:text-red-400`}
      >
        삭제
      </button>
    </li>
  );
}
