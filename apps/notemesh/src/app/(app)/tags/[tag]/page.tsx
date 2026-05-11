import Link from "next/link";
import { requireAuth } from "@/components/shared/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const user = await requireAuth();
  const { tag } = await params;

  const notes = await prisma.note.findMany({
    where: {
      userId: user.id,
      isDeleted: false,
      noteTags: { some: { tag: { name: tag } } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <PageHeader title={`Tag: #${tag}`} description="Notes filtered by selected tag" />
      {!notes.length ? (
        <EmptyState title="No matches found. Try a different keyword or tag." description="Create a new tagged note from the dashboard." />
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
