import { prisma } from "@/lib/db";
import { deleteNoteFts, upsertNoteFts } from "@/lib/search";
import { excerptFromMarkdown, slugify } from "@/lib/utils";

export async function listNotesForUser(userId: string, options?: { archived?: boolean; deleted?: boolean; tag?: string; sort?: string }) {
  const sortMode = options?.sort ?? "updated";
  const orderBy =
    sortMode === "created"
      ? { createdAt: "desc" as const }
      : sortMode === "title"
        ? { title: "asc" as const }
        : { updatedAt: "desc" as const };

  return prisma.note.findMany({
    where: {
      userId,
      isArchived: options?.archived ?? false,
      isDeleted: options?.deleted ?? false,
      noteTags: options?.tag
        ? {
            some: {
              tag: { name: options.tag },
            },
          }
        : undefined,
    },
    orderBy,
    include: {
      noteTags: { include: { tag: true } },
    },
  });
}

export async function createNote(userId: string, data: { title?: string; content?: string }) {
  const title = data.title?.trim() || "Untitled";
  const content = data.content ?? "";
  const note = await prisma.note.create({
    data: {
      userId,
      title,
      content,
      slug: slugify(title) || "untitled",
      excerpt: excerptFromMarkdown(content),
    },
    include: { noteTags: { include: { tag: true } } },
  });
  await upsertNoteFts({ id: note.id, title: note.title, content: note.content, userId });
  return note;
}

export async function getNoteById(userId: string, noteId: string) {
  return prisma.note.findFirst({
    where: { id: noteId, userId },
    include: {
      noteTags: { include: { tag: true } },
      attachments: true,
      shareLinks: true,
    },
  });
}

export async function updateNote(userId: string, noteId: string, patch: { title?: string; content?: string; isPinned?: boolean; isArchived?: boolean; isDeleted?: boolean }) {
  const existing = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!existing) return null;

  const title = patch.title?.trim() ?? existing.title;
  const content = patch.content ?? existing.content;

  const updated = await prisma.note.update({
    where: { id: noteId },
    data: {
      ...patch,
      title,
      content,
      slug: slugify(title) || existing.slug,
      excerpt: excerptFromMarkdown(content),
      deletedAt: patch.isDeleted ? new Date() : patch.isDeleted === false ? null : existing.deletedAt,
    },
    include: { noteTags: { include: { tag: true } } },
  });

  if (updated.isDeleted) {
    await deleteNoteFts(updated.id);
  } else {
    await upsertNoteFts({ id: updated.id, title: updated.title, content: updated.content, userId });
  }

  return updated;
}

export async function deleteNoteHard(userId: string, noteId: string) {
  const note = await prisma.note.findFirst({ where: { id: noteId, userId } });
  if (!note) return null;
  await prisma.note.delete({ where: { id: noteId } });
  await deleteNoteFts(noteId);
  return note;
}

export async function duplicateNote(userId: string, noteId: string) {
  const source = await prisma.note.findFirst({
    where: { id: noteId, userId },
    include: { noteTags: true },
  });
  if (!source) return null;

  const duplicated = await prisma.note.create({
    data: {
      userId,
      title: `${source.title} (Copy)`,
      slug: slugify(`${source.title}-copy`) || "untitled-copy",
      content: source.content,
      excerpt: source.excerpt,
      isPinned: false,
      isArchived: false,
      isDeleted: false,
      noteTags: {
        create: source.noteTags.map((nt) => ({ tagId: nt.tagId })),
      },
    },
    include: { noteTags: { include: { tag: true } } },
  });

  await upsertNoteFts({ id: duplicated.id, title: duplicated.title, content: duplicated.content, userId });
  return duplicated;
}
