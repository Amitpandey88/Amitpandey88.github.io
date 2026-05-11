"use client";

import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import type { EditorMode, NoteSummary, SortMode } from "@/types";
import { Sidebar } from "@/components/layout/sidebar";
import { TopBar } from "@/components/layout/top-bar";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CommandPalette } from "@/components/command/command-palette";
import { EmptyState } from "@/components/ui/empty-state";
import { NoteHeader } from "@/components/editor/note-header";
import { MarkdownToolbar } from "@/components/editor/markdown-toolbar";
import { SplitView } from "@/components/editor/split-view";

interface Tag {
  id: string;
  name: string;
  color: string;
}

interface ApiNote {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string | Date;
  updatedAt: string | Date;
  noteTags?: { tag: Tag }[];
}

function toNoteSummary(note: ApiNote): NoteSummary {
  return {
    id: note.id,
    title: note.title,
    content: note.content,
    excerpt: note.excerpt,
    isPinned: note.isPinned,
    isArchived: note.isArchived,
    isDeleted: note.isDeleted,
    createdAt: new Date(note.createdAt).toISOString(),
    updatedAt: new Date(note.updatedAt).toISOString(),
    tags: (note.noteTags || []).map((noteTag) => noteTag.tag),
  };
}

export function AppShell({ initialNotes, tags }: { initialNotes: ApiNote[]; tags: Tag[] }) {
  const [notes, setNotes] = useState<NoteSummary[]>(initialNotes.map(toNoteSummary));
  const [query, setQuery] = useState("");
  const [activeId, setActiveId] = useState<string | null>(initialNotes[0]?.id ?? null);
  const [title, setTitle] = useState(initialNotes[0]?.title ?? "");
  const [content, setContent] = useState(initialNotes[0]?.content ?? "");
  const [isSaving, setIsSaving] = useState(false);
  const [mode, setMode] = useState<EditorMode>("split");
  const [sort, setSort] = useState<SortMode>("updated");
  const [selectedTag, setSelectedTag] = useState("");

  const activeNote = useMemo(() => notes.find((note) => note.id === activeId) ?? null, [notes, activeId]);

  useEffect(() => {
    if (!activeId) return;

    const timeout = window.setTimeout(async () => {
      setIsSaving(true);
      try {
        const response = await fetch(`/api/notes/${activeId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ title, content }),
        });

        if (!response.ok) throw new Error("Autosave failed");
        const payload: { note: ApiNote } = await response.json();
        const updated = payload.note;

        setNotes((current) =>
          current.map((note) =>
            note.id === activeId
              ? {
                  ...note,
                  title: updated.title,
                  content: updated.content,
                  excerpt: updated.excerpt,
                  updatedAt: new Date(updated.updatedAt).toISOString(),
                }
              : note,
          ),
        );
      } catch {
        toast.error("Autosave failed.");
      } finally {
        setIsSaving(false);
      }
    }, 1200);

    return () => window.clearTimeout(timeout);
  }, [activeId, title, content]);

  useEffect(() => {
    const onShortcut = (event: KeyboardEvent) => {
      if (event.key === "/" && !(event.target instanceof HTMLInputElement) && !(event.target instanceof HTMLTextAreaElement)) {
        event.preventDefault();
        const input = document.querySelector<HTMLInputElement>("input[placeholder^='Search notes']");
        input?.focus();
      }
    };

    window.addEventListener("keydown", onShortcut);
    return () => window.removeEventListener("keydown", onShortcut);
  }, []);

  const filteredNotes = notes
    .filter((note) => (selectedTag ? note.tags.some((tag) => tag.name === selectedTag) : true))
    .filter((note) => {
      const q = query.toLowerCase();
      return !q || note.title.toLowerCase().includes(q) || note.content.toLowerCase().includes(q);
    })
    .sort((a, b) => {
      if (sort === "title") return a.title.localeCompare(b.title);
      if (sort === "created") return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  function selectNote(id: string) {
    const target = notes.find((note) => note.id === id);
    setActiveId(id);
    if (target) {
      setTitle(target.title);
      setContent(target.content);
    }
  }

  async function createNote() {
    const response = await fetch("/api/notes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title: "Untitled", content: "" }),
    });

    if (!response.ok) {
      toast.error("Failed to create note.");
      return;
    }

    const payload: { note: ApiNote } = await response.json();
    const note = toNoteSummary(payload.note);

    setNotes((current) => [note, ...current]);
    setActiveId(note.id);
    setTitle(note.title);
    setContent(note.content);
    toast.success("Note created.");
  }

  async function mutateNote(path: string, successMessage: string) {
    if (!activeId) return;
    const response = await fetch(`/api/notes/${activeId}/${path}`, { method: "POST" });
    if (!response.ok) {
      toast.error("Action failed.");
      return;
    }

    if (path === "archive" || path === "restore") {
      setNotes((current) => current.filter((note) => note.id !== activeId));
      setActiveId((current) => (current === activeId ? null : current));
      setTitle("");
      setContent("");
    }

    if (path === "pin") {
      const payload: { note: ApiNote } = await response.json();
      setNotes((current) =>
        current.map((note) =>
          note.id === activeId
            ? {
                ...note,
                isPinned: payload.note.isPinned,
              }
            : note,
        ),
      );
    }

    toast.success(successMessage);
  }

  async function moveToTrash() {
    if (!activeId) return;
    const response = await fetch(`/api/notes/${activeId}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed.");
      return;
    }

    setNotes((current) => current.filter((note) => note.id !== activeId));
    setActiveId(null);
    setTitle("");
    setContent("");
    toast.success("Moved to Trash. You can restore it anytime.");
  }

  return (
    <div className="min-h-screen md:flex">
      <Sidebar
        notes={filteredNotes}
        tags={tags}
        activeId={activeId}
        onSelect={selectNote}
        onCreate={createNote}
        sort={sort}
        setSort={setSort}
        selectedTag={selectedTag}
        setSelectedTag={setSelectedTag}
      />
      <main className="flex-1 pb-16 md:pb-0">
        <TopBar query={query} onQuery={setQuery} />
        <CommandPalette />
        <div className="p-3">
          {!activeNote ? (
            <EmptyState title="No notes yet. Capture your first idea." description="Create a note from the sidebar to begin." />
          ) : (
            <div className="rounded-lg border border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950">
              <NoteHeader
                title={title}
                setTitle={setTitle}
                mode={mode}
                setMode={setMode}
                isSaving={isSaving}
                content={content}
                onPin={() => mutateNote("pin", "Pin updated.")}
                onArchive={() => mutateNote("archive", "Note archived.")}
                onDelete={moveToTrash}
              />
              <MarkdownToolbar onInsert={(snippet) => setContent((current) => `${current}\n${snippet}`)} />
              <div className="p-3">
                <SplitView mode={mode} content={content} onChange={setContent} />
              </div>
            </div>
          )}
        </div>
      </main>
      <MobileNav />
    </div>
  );
}
