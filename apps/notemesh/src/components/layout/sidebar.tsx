"use client";

import Link from "next/link";
import type { NoteSummary } from "@/types";
import { Button } from "@/components/ui/button";
import { NoteList } from "@/components/notes/note-list";
import { SortMenu } from "@/components/notes/sort-menu";
import { TagFilter } from "@/components/notes/tag-filter";
import { RecentNotes } from "@/components/notes/recent-notes";

interface Tag {
  id: string;
  name: string;
  color: string;
}

export function Sidebar({
  notes,
  tags,
  activeId,
  onSelect,
  onCreate,
  sort,
  setSort,
  selectedTag,
  setSelectedTag,
}: {
  notes: NoteSummary[];
  tags: Tag[];
  activeId: string | null;
  onSelect: (id: string) => void;
  onCreate: () => void;
  sort: "updated" | "created" | "title";
  setSort: (value: "updated" | "created" | "title") => void;
  selectedTag: string;
  setSelectedTag: (value: string) => void;
}) {
  return (
    <aside className="w-full border-r border-zinc-200 p-3 md:w-[340px] dark:border-zinc-800">
      <div className="mb-3 flex items-center justify-between">
        <Link href="/notes" className="text-lg font-semibold">NoteMesh</Link>
        <Button size="sm" onClick={onCreate}>New note</Button>
      </div>
      <div className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <SortMenu value={sort} onChange={setSort} />
          <div className="flex items-center gap-2 text-xs">
            <Link href="/archive" className="hover:underline">Archive</Link>
            <Link href="/trash" className="hover:underline">Trash</Link>
            <Link href="/settings" className="hover:underline">Settings</Link>
          </div>
        </div>
        <TagFilter tags={tags} selected={selectedTag} onSelect={setSelectedTag} />
        <NoteList notes={notes} activeId={activeId} onSelect={onSelect} />
        <RecentNotes notes={notes} />
      </div>
    </aside>
  );
}
