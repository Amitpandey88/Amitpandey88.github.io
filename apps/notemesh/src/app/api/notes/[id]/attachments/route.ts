import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { attachmentSchema } from "@/lib/validators";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const note = await prisma.note.findFirst({ where: { id, userId: user.id } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const body = await request.json();
  const parsed = attachmentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid attachment payload." }, { status: 400 });

  const attachment = await prisma.attachment.create({
    data: {
      noteId: id,
      ...parsed.data,
    },
  });

  return NextResponse.json({ attachment }, { status: 201 });
}
