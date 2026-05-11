import { create } from "zustand";

type NotesState = {
  activeNoteId: string | null;
  setActiveNoteId: (id: string | null) => void;
};

export const useNotesStore = create<NotesState>((set) => ({
  activeNoteId: null,
  setActiveNoteId: (id) => set({ activeNoteId: id }),
}));
