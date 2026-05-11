import type { NoteSummary } from "@/types";
import { NoteListItem } from "@/components/notes/note-list-item";

export function NoteList({ notes, activeId, onSelect }: { notes: NoteSummary[]; activeId: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="space-y-2">
      {notes.map((note) => (
        <NoteListItem key={note.id} note={note} active={activeId === note.id} onClick={() => onSelect(note.id)} />
      ))}
    </div>
  );
}
