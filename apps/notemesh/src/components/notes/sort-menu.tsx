import type { SortMode } from "@/types";

export function SortMenu({ value, onChange }: { value: SortMode; onChange: (value: SortMode) => void }) {
  return (
    <select
      value={value}
      onChange={(event) => onChange(event.target.value as SortMode)}
      className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm dark:border-zinc-700 dark:bg-zinc-900"
    >
      <option value="updated">Updated</option>
      <option value="created">Created</option>
      <option value="title">Title</option>
    </select>
  );
}
