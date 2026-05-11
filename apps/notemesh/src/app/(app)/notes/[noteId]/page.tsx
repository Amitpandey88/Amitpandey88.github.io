import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { requireAuth } from "@/components/shared/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";

export default async function SingleNotePage({ params }: { params: Promise<{ noteId: string }> }) {
  const user = await requireAuth();
  const { noteId } = await params;

  const note = await prisma.note.findFirst({
    where: { id: noteId, userId: user.id, isDeleted: false },
    include: { noteTags: { include: { tag: true } } },
  });

  if (!note) notFound();

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <PageHeader title={note.title} description={`Last edited ${new Date(note.updatedAt).toLocaleString()}`} />
      <div className="flex flex-wrap gap-2">
        {note.noteTags.map((noteTag) => (
          <Link key={noteTag.tag.id} href={`/tags/${noteTag.tag.name}`} className="rounded-full bg-zinc-200 px-3 py-1 text-xs dark:bg-zinc-800">
            #{noteTag.tag.name}
          </Link>
        ))}
      </div>
      <article className="prose-preview rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{note.content}</ReactMarkdown>
      </article>
      <Link href="/notes" className="text-sm text-indigo-600 hover:underline dark:text-indigo-300">Back to dashboard</Link>
    </main>
  );
}
