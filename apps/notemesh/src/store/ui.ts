import { create } from "zustand";

type UiState = {
  editorMode: "edit" | "preview" | "split";
  setEditorMode: (mode: "edit" | "preview" | "split") => void;
};

export const useUiStore = create<UiState>((set) => ({
  editorMode: "split",
  setEditorMode: (mode) => set({ editorMode: mode }),
}));
