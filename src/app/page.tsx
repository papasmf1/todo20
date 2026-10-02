import { AddTodoForm } from "@/components/AddTodoForm";
import { FilterBar } from "@/components/FilterBar";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TodoItem } from "@/components/TodoItem";
import {
  countTodos,
  FILTERS,
  listTodos,
  SORTS,
  type Filter,
  type Sort,
} from "@/lib/db";

const EMPTY_MESSAGE: Record<Filter, string> = {
  all: "할 일이 없습니다. 첫 번째 할 일을 추가해 보세요.",
  active: "진행중인 할 일이 없습니다.",
  completed: "완료한 할 일이 없습니다.",
};

// The server may run in UTC, so pin "today" to Korean time (YYYY-MM-DD).
function localToday() {
  return new Intl.DateTimeFormat("sv-SE", { timeZone: "Asia/Seoul" }).format(
    new Date(),
  );
}

export default async function Home({ searchParams }: PageProps<"/">) {
  const params = await searchParams;
  const filter = (FILTERS as readonly unknown[]).includes(params.filter)
    ? (params.filter as Filter)
    : "all";
  const sort = (SORTS as readonly unknown[]).includes(params.sort)
    ? (params.sort as Sort)
    : "created";

  const [todos, { total, active }] = await Promise.all([
    listTodos(filter, sort),
    countTodos(),
  ]);
  const today = localToday();

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-5 px-4 py-10">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">할 일 목록</h1>
          <p className="text-sm text-zinc-500">
            남은 할 일 {active}개 / 전체 {total}개
          </p>
        </div>
        <ThemeToggle />
      </header>

      <AddTodoForm />

      <FilterBar filter={filter} sort={sort} hasCompleted={total > active} />

      {todos.length === 0 ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-zinc-500 dark:border-zinc-700">
          {EMPTY_MESSAGE[filter]}
        </p>
      ) : (
        <ul className="divide-y divide-zinc-200 rounded-xl border border-zinc-200 bg-white dark:divide-zinc-800 dark:border-zinc-800 dark:bg-zinc-900">
          {todos.map((todo) => (
            <TodoItem key={todo.id} todo={todo} today={today} />
          ))}
        </ul>
      )}
    </main>
  );
}
