import { prisma } from "@/lib/db";
import { searchNoteIdsByText } from "@/lib/search";
import { listNotesForUser } from "@/server/repositories/note-repository";

export async function searchNotes(userId: string, query: string, tag?: string, sort?: string) {
  const q = query.trim();
  if (!q) {
    return listNotesForUser(userId, { tag, sort });
  }

  const noteIds = await searchNoteIdsByText(userId, q);
  if (!noteIds.length) return [];

  return prisma.note.findMany({
    where: {
      id: { in: noteIds },
      userId,
      isDeleted: false,
      isArchived: false,
      noteTags: tag ? { some: { tag: { name: tag } } } : undefined,
    },
    include: { noteTags: { include: { tag: true } } },
    orderBy: sort === "created" ? { createdAt: "desc" } : sort === "title" ? { title: "asc" } : { updatedAt: "desc" },
  });
}
