"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

interface TrashItem {
  id: string;
  title: string;
  excerpt: string;
}

export default function TrashList({ notes }: { notes: TrashItem[] }) {
  const [items, setItems] = useState(notes);

  async function restore(id: string) {
    const response = await fetch(`/api/notes/${id}/restore`, { method: "POST" });
    if (!response.ok) {
      toast.error("Failed to restore note.");
      return;
    }
    setItems((current) => current.filter((note) => note.id !== id));
    toast.success("Note restored.");
  }

  async function remove(id: string) {
    const response = await fetch(`/api/trash/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Failed to permanently delete note.");
      return;
    }
    setItems((current) => current.filter((note) => note.id !== id));
    toast.success("Note permanently deleted.");
  }

  return (
    <ul className="space-y-2">
      {items.map((note) => (
        <li key={note.id} className="rounded-lg border border-zinc-200 p-3 dark:border-zinc-800">
          <p className="font-medium">{note.title}</p>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">{note.excerpt || "No content."}</p>
          <div className="mt-2 flex gap-2">
            <Button size="sm" variant="secondary" onClick={() => restore(note.id)}>Restore</Button>
            <Button size="sm" variant="danger" onClick={() => remove(note.id)}>Delete forever</Button>
          </div>
        </li>
      ))}
    </ul>
  );
}
