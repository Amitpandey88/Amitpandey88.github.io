export type SortMode = "updated" | "created" | "title";
export type EditorMode = "edit" | "preview" | "split";

export interface SessionUser {
  id: string;
  email: string;
  name: string;
}

export interface NoteSummary {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  isPinned: boolean;
  isArchived: boolean;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  tags: { id: string; name: string; color: string }[];
}
