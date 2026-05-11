import { requireAuth } from "@/components/shared/auth-guard";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import TrashList from "./trash-list";

export default async function TrashPage() {
  const user = await requireAuth();
  const notes = await prisma.note.findMany({ where: { userId: user.id, isDeleted: true }, orderBy: { updatedAt: "desc" } });

  return (
    <main className="mx-auto max-w-4xl space-y-4 p-6">
      <PageHeader title="Trash" description="Moved to Trash. You can restore it anytime." />
      {!notes.length ? <EmptyState title="Trash is empty" description="Deleted notes will appear here first." /> : <TrashList notes={notes} />}
    </main>
  );
}
