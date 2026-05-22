"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { FileNode, FileSystemState, FileSystemAction } from "@/types";
import { mockNodes, mockRootIds } from "@/data/mockData";

// ── Helpers ──────────────────────────────────────────────────────────────

function generateId(): string {
  return `node-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
}

/** Recursively collect all descendant IDs of a node */
function getDescendantIds(
  nodeId: string,
  nodes: Record<string, FileNode>
): string[] {
  const node = nodes[nodeId];
  if (!node || node.type !== "folder" || !node.children) return [];
  const ids: string[] = [];
  for (const childId of node.children) {
    ids.push(childId);
    ids.push(...getDescendantIds(childId, nodes));
  }
  return ids;
}

// ── Serialisation helpers (Set ↔ Array) ──────────────────────────────────

interface SerializedState {
  nodes: Record<string, FileNode>;
  selectedId: string | null;
  expandedIds: string[];
  editingFileId: string | null;
  rootIds: string[];
}

function serialize(state: FileSystemState): string {
  const serializable: SerializedState = {
    ...state,
    expandedIds: Array.from(state.expandedIds),
  };
  return JSON.stringify(serializable);
}

function deserialize(json: string): FileSystemState {
  const parsed: SerializedState = JSON.parse(json);
  return {
    ...parsed,
    expandedIds: new Set(parsed.expandedIds),
  };
}

// ── Reducer ──────────────────────────────────────────────────────────────

function fileSystemReducer(
  state: FileSystemState,
  action: FileSystemAction
): FileSystemState {
  switch (action.type) {
    case "CREATE_NODE": {
      const { parentId, name, nodeType } = action.payload;
      const newId = generateId();
      const newNode: FileNode = {
        id: newId,
        name,
        type: nodeType,
        parentId,
        ...(nodeType === "folder" ? { children: [] } : { content: "" }),
      };
      const parent = state.nodes[parentId];
      if (!parent || parent.type !== "folder") return state;

      return {
        ...state,
        nodes: {
          ...state.nodes,
          [newId]: newNode,
          [parentId]: {
            ...parent,
            children: [...(parent.children || []), newId],
          },
        },
        expandedIds: new Set([...state.expandedIds, parentId]),
      };
    }

    case "RENAME_NODE": {
      const { id, name } = action.payload;
      const node = state.nodes[id];
      if (!node) return state;
      return {
        ...state,
        nodes: { ...state.nodes, [id]: { ...node, name } },
      };
    }

    case "DELETE_NODE": {
      const { id } = action.payload;
      const node = state.nodes[id];
      if (!node) return state;

      // Collect all IDs to remove
      const idsToRemove = [id, ...getDescendantIds(id, state.nodes)];
      const newNodes = { ...state.nodes };
      for (const removeId of idsToRemove) {
        delete newNodes[removeId];
      }

      // Remove from parent's children
      if (node.parentId && newNodes[node.parentId]) {
        const parent = newNodes[node.parentId];
        newNodes[node.parentId] = {
          ...parent,
          children: (parent.children || []).filter((cId) => cId !== id),
        };
      }

      // Remove from rootIds if it's a root node
      const newRootIds = node.parentId
        ? state.rootIds
        : state.rootIds.filter((rId) => rId !== id);

      // Clear selected/editing if deleted
      const newSelectedId = idsToRemove.includes(state.selectedId || "")
        ? node.parentId
        : state.selectedId;
      const newEditingFileId = idsToRemove.includes(
        state.editingFileId || ""
      )
        ? null
        : state.editingFileId;

      // Clean expandedIds
      const newExpanded = new Set(state.expandedIds);
      for (const removeId of idsToRemove) {
        newExpanded.delete(removeId);
      }

      return {
        ...state,
        nodes: newNodes,
        rootIds: newRootIds,
        selectedId: newSelectedId,
        editingFileId: newEditingFileId,
        expandedIds: newExpanded,
      };
    }

    case "UPDATE_CONTENT": {
      const { id, content } = action.payload;
      const node = state.nodes[id];
      if (!node || node.type !== "text") return state;
      return {
        ...state,
        nodes: { ...state.nodes, [id]: { ...node, content } },
      };
    }

    case "SET_SELECTED": {
      return { ...state, selectedId: action.payload.id };
    }

    case "TOGGLE_EXPAND": {
      const newExpanded = new Set(state.expandedIds);
      if (newExpanded.has(action.payload.id)) {
        newExpanded.delete(action.payload.id);
      } else {
        newExpanded.add(action.payload.id);
      }
      return { ...state, expandedIds: newExpanded };
    }

    case "SET_EDITING_FILE": {
      return { ...state, editingFileId: action.payload.id };
    }

    case "LOAD_STATE": {
      return action.payload;
    }

    default:
      return state;
  }
}

// ── Initial state ────────────────────────────────────────────────────────

const initialState: FileSystemState = {
  nodes: mockNodes,
  selectedId: null,
  expandedIds: new Set<string>(),
  editingFileId: null,
  rootIds: mockRootIds,
};

// ── Context ──────────────────────────────────────────────────────────────

interface FileSystemContextValue {
  state: FileSystemState;
  dispatch: React.Dispatch<FileSystemAction>;
  getNode: (id: string) => FileNode | undefined;
  getChildren: (id: string) => FileNode[];
  getPath: (id: string) => FileNode[];
}

const FileSystemContext = createContext<FileSystemContextValue | null>(null);

export function FileSystemProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(fileSystemReducer, initialState);
  const [isHydrated, setIsHydrated] = React.useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem("mini-file-explorer-state");
      if (saved) {
        const loaded = deserialize(saved);
        dispatch({ type: "LOAD_STATE", payload: loaded });
      }
    } catch {
      // Ignore parse errors, use default
    }
    setIsHydrated(true);
  }, []);

  // Save to localStorage on every state change
  useEffect(() => {
    if (isHydrated) {
      try {
        localStorage.setItem("mini-file-explorer-state", serialize(state));
      } catch {
        // Ignore storage errors
      }
    }
  }, [state, isHydrated]);

  const getNode = useCallback(
    (id: string) => state.nodes[id],
    [state.nodes]
  );

  const getChildren = useCallback(
    (id: string) => {
      const node = state.nodes[id];
      if (!node || node.type !== "folder" || !node.children) return [];
      return node.children
        .map((cId) => state.nodes[cId])
        .filter(Boolean)
        .sort((a, b) => {
          // Folders first, then alphabetical
          if (a.type !== b.type) return a.type === "folder" ? -1 : 1;
          return a.name.localeCompare(b.name);
        });
    },
    [state.nodes]
  );

  const getPath = useCallback(
    (id: string) => {
      const path: FileNode[] = [];
      let current = state.nodes[id];
      while (current) {
        path.unshift(current);
        current = current.parentId ? state.nodes[current.parentId] : undefined!;
      }
      return path;
    },
    [state.nodes]
  );

  if (!isHydrated) {
    return null; // Prevent hydration mismatch
  }

  return (
    <FileSystemContext.Provider
      value={{ state, dispatch, getNode, getChildren, getPath }}
    >
      {children}
    </FileSystemContext.Provider>
  );
}

export function useFileSystem() {
  const context = useContext(FileSystemContext);
  if (!context) {
    throw new Error("useFileSystem must be used within a FileSystemProvider");
  }
  return context;
}
