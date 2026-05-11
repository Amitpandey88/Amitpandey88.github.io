"use client";

import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { useRouter } from "next/navigation";

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isCmdK = (event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k";
      if (isCmdK) {
        event.preventDefault();
        setOpen((current) => !current);
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-40 grid place-items-start bg-black/40 p-4 pt-20" onClick={() => setOpen(false)}>
      <Command className="w-full max-w-xl overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-xl dark:border-zinc-700 dark:bg-zinc-900" onClick={(e) => e.stopPropagation()}>
        <Command.Input className="w-full border-b border-zinc-200 bg-transparent p-3 outline-none dark:border-zinc-700" placeholder="Jump to..." />
        <Command.List className="max-h-80 overflow-auto p-2">
          <Command.Item className="cursor-pointer rounded p-2 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800" onSelect={() => router.push("/notes")}>Notes</Command.Item>
          <Command.Item className="cursor-pointer rounded p-2 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800" onSelect={() => router.push("/archive")}>Archive</Command.Item>
          <Command.Item className="cursor-pointer rounded p-2 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800" onSelect={() => router.push("/trash")}>Trash</Command.Item>
          <Command.Item className="cursor-pointer rounded p-2 data-[selected=true]:bg-zinc-100 dark:data-[selected=true]:bg-zinc-800" onSelect={() => router.push("/settings")}>Settings</Command.Item>
        </Command.List>
      </Command>
    </div>
  );
}
