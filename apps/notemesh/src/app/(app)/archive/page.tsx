import Link from "next/link";
import { requireAuth } from "@/components/shared/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function ArchivePage() {
  const user = await requireAuth();
  const notes = await prisma.note.findMany({ where: { userId: user.id, isArchived: true, isDeleted: false }, orderBy: { updatedAt: "desc" } });

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <PageHeader title="Archive" description="Quiet storage for notes you still want to keep." />
      {!notes.length ? (
        <EmptyState title="Archive is empty" description="Archived notes appear here." />
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
