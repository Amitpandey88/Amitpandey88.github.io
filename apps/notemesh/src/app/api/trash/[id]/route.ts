import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { deleteNoteHard } from "@/server/repositories/note-repository";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const note = await deleteNoteHard(user.id, id);
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  return NextResponse.json({ ok: true });
}
