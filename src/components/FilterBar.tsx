import Link from "next/link";
import { clearCompleted } from "@/app/actions";
import type { Filter, Sort } from "@/lib/db";

const FILTER_LABEL: Record<Filter, string> = {
  all: "전체",
  active: "진행중",
  completed: "완료",
};

const SORT_LABEL: Record<Sort, string> = {
  created: "최신순",
  due: "마감일순",
  priority: "우선순위순",
};

function href(filter: Filter, sort: Sort) {
  const params = new URLSearchParams();
  if (filter !== "all") params.set("filter", filter);
  if (sort !== "created") params.set("sort", sort);
  const query = params.toString();
  return query ? `/?${query}` : "/";
}

function tab(active: boolean) {
  return `rounded-md px-2.5 py-1 text-sm ${
    active
      ? "bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-900"
      : "text-zinc-600 hover:bg-zinc-200 dark:text-zinc-400 dark:hover:bg-zinc-800"
  }`;
}

export function FilterBar({
  filter,
  sort,
  hasCompleted,
}: {
  filter: Filter;
  sort: Sort;
  hasCompleted: boolean;
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2">
      <nav aria-label="필터" className="flex gap-1">
        {(Object.keys(FILTER_LABEL) as Filter[]).map((f) => (
          <Link
            key={f}
            href={href(f, sort)}
            aria-current={f === filter ? "page" : undefined}
            className={tab(f === filter)}
          >
            {FILTER_LABEL[f]}
          </Link>
        ))}
      </nav>
      <nav aria-label="정렬" className="flex gap-1">
        {(Object.keys(SORT_LABEL) as Sort[]).map((s) => (
          <Link
            key={s}
            href={href(filter, s)}
            aria-current={s === sort ? "true" : undefined}
            className={tab(s === sort)}
          >
            {SORT_LABEL[s]}
          </Link>
        ))}
      </nav>
      {hasCompleted && (
        <form action={clearCompleted}>
          <button
            type="submit"
            className="text-sm text-zinc-500 underline-offset-2 hover:text-red-600 hover:underline dark:hover:text-red-400"
          >
            완료 항목 삭제
          </button>
        </form>
      )}
    </div>
  );
}
