import Link from "next/link";
import { requireAuth } from "@/components/shared/auth-guard";
import { searchNotes } from "@/server/services/note-service";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/shared/page-header";

export default async function SearchPage({ searchParams }: { searchParams: Promise<{ q?: string; tag?: string; sort?: string }> }) {
  const user = await requireAuth();
  const params = await searchParams;
  const q = (params.q ?? "").trim();
  const tag = params.tag;
  const sort = params.sort ?? "updated";
  const notes = await searchNotes(user.id, q, tag, sort);

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <PageHeader title="Search" description={q ? `Results for “${q}”` : "Use the query bar to find notes instantly."} />
      {!notes.length ? (
        <EmptyState title="No matches found. Try a different keyword or tag." description="Search scans note titles and markdown content." />
      ) : (
        <ul className="space-y-2">
          {notes.map((note) => (
            <li key={note.id}>
              <Link href={`/notes/${note.id}`} className="block rounded-lg border border-zinc-200 p-3 hover:bg-zinc-100 dark:border-zinc-800 dark:hover:bg-zinc-900">
                <p className="font-medium">{note.title}</p>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">{note.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
