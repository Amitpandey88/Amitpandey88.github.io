import { getSessionUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  return user;
}
