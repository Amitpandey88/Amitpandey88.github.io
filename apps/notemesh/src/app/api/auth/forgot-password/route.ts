import { NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = loginSchema.pick({ email: true }).safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid email." }, { status: 400 });
  }

  return NextResponse.json({ ok: true, message: "If the account exists, a reset link has been sent." });
}
