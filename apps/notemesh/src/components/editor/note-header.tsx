"use client";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AutosaveIndicator } from "@/components/editor/autosave-indicator";
import { WordStats } from "@/components/editor/word-stats";
import type { EditorMode } from "@/types";

export function NoteHeader({
  title,
  setTitle,
  mode,
  setMode,
  isSaving,
  content,
  onPin,
  onArchive,
  onDelete,
}: {
  title: string;
  setTitle: (value: string) => void;
  mode: EditorMode;
  setMode: (value: EditorMode) => void;
  isSaving: boolean;
  content: string;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="space-y-3 border-b border-zinc-200 p-3 dark:border-zinc-800">
      <div className="flex flex-wrap items-center gap-2">
        <Input value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Untitled" className="max-w-md" />
        <Button type="button" variant={mode === "edit" ? "default" : "secondary"} size="sm" onClick={() => setMode("edit")}>Edit</Button>
        <Button type="button" variant={mode === "preview" ? "default" : "secondary"} size="sm" onClick={() => setMode("preview")}>Preview</Button>
        <Button type="button" variant={mode === "split" ? "default" : "secondary"} size="sm" onClick={() => setMode("split")}>Split</Button>
      </div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <AutosaveIndicator isSaving={isSaving} />
          <WordStats content={content} />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="secondary" size="sm" onClick={onPin}>Pin</Button>
          <Button variant="secondary" size="sm" onClick={onArchive}>Archive</Button>
          <Button variant="danger" size="sm" onClick={onDelete}>Trash</Button>
        </div>
      </div>
    </div>
  );
}
