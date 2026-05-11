import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const link = await prisma.shareLink.findUnique({ where: { id }, include: { note: true } });
  if (!link || link.note.userId !== user.id) return NextResponse.json({ error: "Not found" }, { status: 404 });

  await prisma.shareLink.update({ where: { id }, data: { isActive: false } });
  return NextResponse.json({ ok: true });
}
