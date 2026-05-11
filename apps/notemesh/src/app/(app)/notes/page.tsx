import { AppShell } from "@/components/layout/app-shell";
import { requireAuth } from "@/components/shared/auth-guard";
import { prisma } from "@/lib/db";

export default async function NotesPage() {
  const user = await requireAuth();
  const [notes, tags] = await Promise.all([
    prisma.note.findMany({
      where: { userId: user.id, isDeleted: false, isArchived: false },
      include: { noteTags: { include: { tag: true } } },
      orderBy: { updatedAt: "desc" },
    }),
    prisma.tag.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } }),
  ]);

  return <AppShell initialNotes={notes} tags={tags} />;
}
