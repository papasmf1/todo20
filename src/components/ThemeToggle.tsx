"use client";

export function ThemeToggle() {
  function toggle() {
    const root = document.documentElement;
    const next = root.dataset.theme === "dark" ? "light" : "dark";
    root.dataset.theme = next;
    try {
      localStorage.setItem("theme", next);
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="테마 전환"
      title="테마 전환"
      className="rounded-lg border border-zinc-300 px-3 py-1.5 text-sm hover:bg-zinc-200 dark:border-zinc-700 dark:hover:bg-zinc-800"
    >
      <span className="dark:hidden">🌙 다크</span>
      <span className="hidden dark:inline">☀️ 라이트</span>
    </button>
  );
}
