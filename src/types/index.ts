export type FileType = "folder" | "text";

export interface FileNode {
  id: string;
  name: string;
  type: FileType;
  parentId: string | null;
  children?: string[]; // IDs of child nodes (for folders)
  content?: string; // Text content (for text files)
}

export interface FileSystemState {
  nodes: Record<string, FileNode>;
  selectedId: string | null;
  expandedIds: Set<string>;
  editingFileId: string | null;
  rootIds: string[];
}

export type FileSystemAction =
  | { type: "CREATE_NODE"; payload: { parentId: string; name: string; nodeType: FileType } }
  | { type: "RENAME_NODE"; payload: { id: string; name: string } }
  | { type: "DELETE_NODE"; payload: { id: string } }
  | { type: "UPDATE_CONTENT"; payload: { id: string; content: string } }
  | { type: "SET_SELECTED"; payload: { id: string | null } }
  | { type: "TOGGLE_EXPAND"; payload: { id: string } }
  | { type: "SET_EDITING_FILE"; payload: { id: string | null } }
  | { type: "LOAD_STATE"; payload: FileSystemState };
