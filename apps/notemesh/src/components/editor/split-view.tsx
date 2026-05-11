"use client";

import type { EditorMode } from "@/types";
import { EditorPane } from "@/components/editor/editor-pane";
import { PreviewPane } from "@/components/editor/preview-pane";

export function SplitView({ mode, content, onChange }: { mode: EditorMode; content: string; onChange: (value: string) => void }) {
  if (mode === "edit") return <EditorPane value={content} onChange={onChange} />;
  if (mode === "preview") return <PreviewPane content={content} />;

  return (
    <div className="grid gap-3 md:grid-cols-2">
      <EditorPane value={content} onChange={onChange} />
      <PreviewPane content={content} />
    </div>
  );
}
