"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function TopBar({ query, onQuery }: { query: string; onQuery: (value: string) => void }) {
  return (
    <div className="sticky top-0 z-10 flex items-center gap-3 border-b border-zinc-200 bg-zinc-50/90 p-3 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/90">
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-2.5 top-2.5 h-4 w-4 text-zinc-500" />
        <Input
          value={query}
          onChange={(event) => onQuery(event.target.value)}
          placeholder="Search notes... (Ctrl/Cmd + K)"
          className="pl-8"
        />
      </div>
      <ThemeToggle />
    </div>
  );
}
