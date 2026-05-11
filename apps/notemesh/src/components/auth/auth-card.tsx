"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function AuthCard({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const copy = {
    login: { title: "Welcome back", button: "Sign in", endpoint: "/api/auth/login" },
    register: { title: "Create your NoteMesh account", button: "Create account", endpoint: "/api/auth/register" },
    forgot: { title: "Forgot password", button: "Send reset link", endpoint: "/api/auth/forgot-password" },
  }[mode];

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(copy.endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.error || "Something went wrong.");
        return;
      }

      if (mode === "forgot") {
        toast.success("If the account exists, a reset link has been sent.");
        return;
      }

      toast.success(mode === "register" ? "Account created. Welcome to NoteMesh." : "Signed in.");
      router.push("/notes");
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto mt-20 w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
      <h1 className="text-xl font-semibold">{copy.title}</h1>
      <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Markdown-first notes with calm focus.</p>
      <form className="mt-6 space-y-3" onSubmit={onSubmit}>
        {mode === "register" ? <Input required placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} /> : null}
        <Input required type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
        {mode !== "forgot" ? (
          <Input required minLength={8} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        ) : null}
        <Button className="w-full" type="submit" disabled={loading}>
          {loading ? "Please wait..." : copy.button}
        </Button>
      </form>
      <div className="mt-4 flex items-center justify-between text-sm text-zinc-500">
        {mode !== "login" ? <Link href="/login" className="hover:underline">Back to login</Link> : <Link href="/forgot-password" className="hover:underline">Forgot password?</Link>}
        {mode === "login" ? <Link href="/register" className="hover:underline">Create account</Link> : null}
      </div>
    </div>
  );
}
