import { create } from "zustand";

type EditorState = {
  isSaving: boolean;
  setIsSaving: (value: boolean) => void;
};

export const useEditorStore = create<EditorState>((set) => ({
  isSaving: false,
  setIsSaving: (value) => set({ isSaving: value }),
}));
