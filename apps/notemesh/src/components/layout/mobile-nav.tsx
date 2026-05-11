"use client";

import Link from "next/link";
import { Archive, NotebookPen, Settings, Trash2 } from "lucide-react";

export function MobileNav() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 border-t border-zinc-200 bg-zinc-50 p-2 md:hidden dark:border-zinc-800 dark:bg-zinc-950">
      <div className="mx-auto flex max-w-md items-center justify-around text-xs">
        <Link href="/notes" className="flex flex-col items-center gap-1"><NotebookPen className="h-4 w-4" />Notes</Link>
        <Link href="/archive" className="flex flex-col items-center gap-1"><Archive className="h-4 w-4" />Archive</Link>
        <Link href="/trash" className="flex flex-col items-center gap-1"><Trash2 className="h-4 w-4" />Trash</Link>
        <Link href="/settings" className="flex flex-col items-center gap-1"><Settings className="h-4 w-4" />Settings</Link>
      </div>
    </nav>
  );
}
