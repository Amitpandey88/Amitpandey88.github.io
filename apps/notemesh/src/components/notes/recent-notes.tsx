import Link from "next/link";
import type { NoteSummary } from "@/types";

export function RecentNotes({ notes }: { notes: NoteSummary[] }) {
  return (
    <div className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
      <h3 className="text-sm font-semibold">Recently edited</h3>
      <ul className="mt-2 space-y-1 text-sm">
        {notes.slice(0, 5).map((note) => (
          <li key={note.id}>
            <Link href={`/notes/${note.id}`} className="text-indigo-600 hover:underline dark:text-indigo-300">
              {note.title || "Untitled"}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
