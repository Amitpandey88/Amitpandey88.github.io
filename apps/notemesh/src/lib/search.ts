import { prisma } from "@/lib/db";

export async function ensureFtsTable() {
  await prisma.$executeRawUnsafe(`
    CREATE VIRTUAL TABLE IF NOT EXISTS note_fts
    USING fts5(title, content, noteId UNINDEXED, userId UNINDEXED);
  `);
}

export async function upsertNoteFts(note: { id: string; title: string; content: string; userId: string }) {
  await ensureFtsTable();
  await prisma.$executeRaw`DELETE FROM note_fts WHERE noteId = ${note.id};`;
  await prisma.$executeRaw`
    INSERT INTO note_fts (title, content, noteId, userId)
    VALUES (${note.title}, ${note.content}, ${note.id}, ${note.userId});
  `;
}

export async function deleteNoteFts(noteId: string) {
  await ensureFtsTable();
  await prisma.$executeRaw`DELETE FROM note_fts WHERE noteId = ${noteId};`;
}

export async function searchNoteIdsByText(userId: string, query: string): Promise<string[]> {
  await ensureFtsTable();
  const q = query.trim().replace(/["']/g, "");
  if (!q) return [];

  const rows = await prisma.$queryRaw<Array<{ noteId: string }>>`
    SELECT noteId FROM note_fts
    WHERE note_fts MATCH ${q} AND userId = ${userId}
    LIMIT 200;
  `;

  return rows.map((row) => row.noteId);
}
