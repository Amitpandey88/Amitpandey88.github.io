import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { listNotesForUser } from "@/server/repositories/note-repository";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const notes = await listNotesForUser(user.id, { deleted: true, archived: false, sort: "updated" });
  return NextResponse.json({ notes });
}
