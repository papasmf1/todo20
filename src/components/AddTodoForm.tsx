"use client";

import { useActionState } from "react";
import { addTodo, type FormState } from "@/app/actions";

const initialState: FormState = {};

const field =
  "rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm outline-none focus:border-blue-500 dark:border-zinc-700 dark:bg-zinc-900";

export function AddTodoForm() {
  const [state, action, pending] = useActionState(addTodo, initialState);

  return (
    <form action={action} className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <input
          name="title"
          placeholder="할 일을 입력하세요"
          aria-label="할 일"
          maxLength={200}
          autoComplete="off"
          className={`${field} min-w-0 flex-1 basis-full sm:basis-0`}
        />
        <select
          name="priority"
          defaultValue="medium"
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
          aria-label="마감일"
          className={field}
        />
        <button
          type="submit"
          disabled={pending}
          className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
        >
          추가
        </button>
      </div>
      {state.error && (
        <p role="alert" className="text-sm text-red-600 dark:text-red-400">
          {state.error}
        </p>
      )}
    </form>
  );
}
