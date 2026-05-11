import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { noteCreateSchema } from "@/lib/validators";
import { createNote, listNotesForUser } from "@/server/repositories/note-repository";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const archived = searchParams.get("archived") === "true";
  const deleted = searchParams.get("deleted") === "true";
  const sort = searchParams.get("sort") ?? "updated";
  const tag = searchParams.get("tag") ?? undefined;

  const notes = await listNotesForUser(user.id, { archived, deleted, sort, tag });
  return NextResponse.json({ notes });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = noteCreateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid note payload." }, { status: 400 });
  }

  const note = await createNote(user.id, parsed.data);
  return NextResponse.json({ note }, { status: 201 });
}
