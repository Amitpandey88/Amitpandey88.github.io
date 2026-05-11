"use client";

import { Button } from "@/components/ui/button";

const snippets = [
  { label: "H1", value: "# " },
  { label: "Bold", value: "**bold**" },
  { label: "Italic", value: "*italic*" },
  { label: "List", value: "- item" },
  { label: "Checklist", value: "- [ ] task" },
  { label: "Quote", value: "> quote" },
  { label: "Code", value: "```\ncode\n```" },
  { label: "Link", value: "[text](https://)" },
  { label: "Table", value: "| A | B |\n|---|---|\n| 1 | 2 |" },
];

export function MarkdownToolbar({ onInsert }: { onInsert: (snippet: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2 border-b border-zinc-200 p-2 dark:border-zinc-800">
      {snippets.map((snippet) => (
        <Button key={snippet.label} type="button" variant="secondary" size="sm" onClick={() => onInsert(snippet.value)}>
          {snippet.label}
        </Button>
      ))}
    </div>
  );
}
