"use client";

import { useRef } from "react";

export function EditorPane({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  const ref = useRef<HTMLTextAreaElement | null>(null);

  return (
    <textarea
      ref={ref}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className="h-[60vh] w-full resize-none rounded-b-lg border border-zinc-200 p-3 font-mono text-sm outline-none focus:ring-2 focus:ring-indigo-500 dark:border-zinc-800 dark:bg-zinc-900"
      placeholder="Start writing your markdown note..."
    />
  );
}
