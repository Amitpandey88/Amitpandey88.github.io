import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { searchNotes } from "@/server/services/note-service";

export async function GET(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") ?? "";
  const tag = searchParams.get("tag") ?? undefined;
  const sort = searchParams.get("sort") ?? "updated";

  const notes = await searchNotes(user.id, q, tag, sort);
  return NextResponse.json({ notes });
}
