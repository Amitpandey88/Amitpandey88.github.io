import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { tagSchema } from "@/lib/validators";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tags = await prisma.tag.findMany({ where: { userId: user.id }, orderBy: { name: "asc" } });
  return NextResponse.json({ tags });
}

export async function POST(request: Request) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await request.json();
  const parsed = tagSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Invalid tag payload." }, { status: 400 });

  const tag = await prisma.tag.create({
    data: {
      userId: user.id,
      name: parsed.data.name,
      color: parsed.data.color ?? "#6366F1",
    },
  });

  return NextResponse.json({ tag }, { status: 201 });
}
