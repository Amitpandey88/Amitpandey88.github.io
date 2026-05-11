import type { NoteSummary } from "@/types";

export function NoteListItem({ note, active, onClick }: { note: NoteSummary; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full rounded-lg border p-3 text-left transition ${active ? "border-indigo-500 bg-indigo-50 dark:bg-indigo-950/30" : "border-zinc-200 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900"}`}
    >
      <div className="flex items-center justify-between gap-2">
        <h3 className="truncate text-sm font-medium">{note.title || "Untitled"}</h3>
        {note.isPinned ? <span className="text-xs text-indigo-600">Pinned</span> : null}
      </div>
      <p className="mt-1 line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400">{note.excerpt || "No content yet."}</p>
      <div className="mt-2 flex flex-wrap gap-1">
        {note.tags.map((tag) => (
          <span key={tag.id} className="rounded bg-zinc-200 px-1.5 py-0.5 text-[10px] dark:bg-zinc-800">
            {tag.name}
          </span>
        ))}
      </div>
    </button>
  );
}
