"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { KbdHint } from "@/components/ui/kbd-hint";

export default function SettingsPage() {
  const [loading, setLoading] = useState(false);

  async function logout() {
    setLoading(true);
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      window.location.href = "/login";
    } catch {
      toast.error("Unable to logout.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="mx-auto max-w-3xl space-y-6 p-6">
      <PageHeader title="Settings" description="Theme, account basics, and keyboard workflow." />

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-medium">Appearance</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">Choose your preferred theme. It persists across sessions.</p>
        <div className="mt-3">
          <ThemeToggle />
        </div>
      </section>

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-medium">Keyboard shortcuts</h2>
        <ul className="mt-2 space-y-2 text-sm">
          <li className="flex items-center justify-between"><span>Open command palette</span> <KbdHint text="Ctrl/Cmd + K" /></li>
          <li className="flex items-center justify-between"><span>Focus search</span> <KbdHint text="/" /></li>
        </ul>
      </section>

      <section className="rounded-lg border border-zinc-200 p-4 dark:border-zinc-800">
        <h2 className="font-medium">Session</h2>
        <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">End your current session on this device.</p>
        <Button className="mt-3" variant="danger" onClick={logout} disabled={loading}>
          {loading ? "Signing out..." : "Logout"}
        </Button>
      </section>
    </main>
  );
}
