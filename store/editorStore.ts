import { create } from "zustand";

interface editorState {
  editorTitle: string;
  editorContent: string;
  updateTitle: (newEditorTitle: string) => void;
  updateContent: (newEditorContent: string) => void;
}

export const useEditorStore = create<editorState>()((set) => ({
  editorTitle: "",
  editorContent: "",
  updateTitle: (newEditorTitle: string) => set({ editorTitle: newEditorTitle }),
  updateContent: (newEditorContent: string) =>
    set({ editorContent: newEditorContent }),
}));
