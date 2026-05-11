import { randomBytes } from "node:crypto";
import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function POST(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const note = await prisma.note.findFirst({ where: { id, userId: user.id } });
  if (!note) return NextResponse.json({ error: "Not found" }, { status: 404 });

  const token = randomBytes(16).toString("hex");
  const shareLink = await prisma.shareLink.create({
    data: {
      noteId: id,
      token,
      isActive: true,
    },
  });

  return NextResponse.json({ shareLink, publicUrl: `/shared/${shareLink.token}` }, { status: 201 });
}
