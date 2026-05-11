import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
import { prisma } from "@/lib/db";

export async function generateMetadata({ params }: { params: Promise<{ token: string }> }): Promise<Metadata> {
  const { token } = await params;
  const share = await prisma.shareLink.findUnique({ where: { token }, include: { note: true } });
  if (!share || !share.isActive) {
    return { title: "Shared note not found" };
  }
  return {
    title: `${share.note.title} · NoteMesh shared note`,
    description: share.note.excerpt,
  };
}

export default async function SharedNotePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const share = await prisma.shareLink.findUnique({ where: { token }, include: { note: true } });

  if (!share || !share.isActive || (share.expiresAt && share.expiresAt < new Date())) {
    notFound();
  }

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <h1 className="text-2xl font-semibold">{share.note.title}</h1>
      <p className="text-sm text-zinc-500 dark:text-zinc-400">Shared read-only note</p>
      <article className="prose-preview rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>{share.note.content}</ReactMarkdown>
      </article>
    </main>
  );
}
