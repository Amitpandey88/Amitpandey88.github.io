import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tagSchema } from "@/lib/validators";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const body = await request.json();
  const parsed = tagSchema.partial().safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid tag payload." }, { status: 400 });

  const tag = await prisma.tag.updateMany({ where: { id, userId: user.id }, data: parsed.data });
  return NextResponse.json({ updated: tag.count });
}

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const result = await prisma.tag.deleteMany({ where: { id, userId: user.id } });
  return NextResponse.json({ deleted: result.count });
}
