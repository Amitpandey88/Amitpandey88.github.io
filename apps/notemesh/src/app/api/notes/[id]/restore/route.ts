import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { updateNote } from "@/server/repositories/note-repository";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { id } = await params;
  const note = await updateNote(user.id, id, { isDeleted: false, isArchived: false });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ note });
}
