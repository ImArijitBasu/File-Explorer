"use client";

import React, { useState } from "react";
import { useFileSystem } from "@/context/FileSystemContext";
import { FileNode } from "@/types";
import RenameModal from "@/components/Modals/RenameModal";
import DeleteConfirmModal from "@/components/Modals/DeleteConfirmModal";

interface TreeNodeProps {
  node: FileNode;
  depth: number;
}

export default function TreeNode({ node, depth }: TreeNodeProps) {
  const { state, dispatch, getChildren } = useFileSystem();
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const isFolder = node.type === "folder";
  const isExpanded = state.expandedIds.has(node.id);
  const isSelected = state.selectedId === node.id;
  const children = isFolder ? getChildren(node.id) : [];

  const handleClick = () => {
    if (isFolder) {
      dispatch({ type: "SET_SELECTED", payload: { id: node.id } });
      dispatch({ type: "TOGGLE_EXPAND", payload: { id: node.id } });
    } else {
      dispatch({ type: "SET_EDITING_FILE", payload: { id: node.id } });
    }
  };

  const handleRename = (name: string) => {
    dispatch({ type: "RENAME_NODE", payload: { id: node.id, name } });
  };

  const handleDelete = () => {
    dispatch({ type: "DELETE_NODE", payload: { id: node.id } });
  };

  return (
    <>
      <div
        className={`tree-node ${isSelected ? "selected" : ""}`}
        style={{ paddingLeft: `${depth * 16 + 8}px` }}
        onClick={handleClick}
        onMouseEnter={() => setShowActions(true)}
        onMouseLeave={() => setShowActions(false)}
        role="treeitem"
        aria-expanded={isFolder ? isExpanded : undefined}
        aria-selected={isSelected}
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            handleClick();
          }
        }}
      >
        {/* Expand/Collapse arrow */}
        <span className={`tree-arrow ${isFolder ? "visible" : ""} ${isExpanded ? "expanded" : ""}`}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </span>

        {/* Icon */}
        <span className="tree-icon">
          {isFolder ? (
            isExpanded ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon-folder-open">
                <path d="M20 19H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h4.586a1 1 0 0 1 .707.293L11 7h9a2 2 0 0 1 2 2v1H7.5a2 2 0 0 0-1.94 1.515l-1.311 5.243A2 2 0 0 0 6.184 19H20a2 2 0 0 0 1.94-1.515l1.311-5.243A2 2 0 0 0 21.316 10H22v7a2 2 0 0 1-2 2z" />
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="icon-folder">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            )
          ) : (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="icon-file">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          )}
        </span>

        {/* Name */}
        <span className="tree-name" title={node.name}>{node.name}</span>

        {/* Action buttons */}
        {showActions && (
          <span className="tree-actions" onClick={(e) => e.stopPropagation()}>
            <button
              className="tree-action-btn"
              onClick={() => setShowRename(true)}
              title="Rename"
              aria-label={`Rename ${node.name}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </button>
            <button
              className="tree-action-btn delete"
              onClick={() => setShowDelete(true)}
              title="Delete"
              aria-label={`Delete ${node.name}`}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3 6 5 6 21 6" />
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
              </svg>
            </button>
          </span>
        )}
      </div>

      {/* Children */}
      {isFolder && isExpanded && (
        <div className="tree-children">
          {children.length === 0 ? (
            <div className="tree-empty" style={{ paddingLeft: `${(depth + 1) * 16 + 8}px` }}>
              Empty folder
            </div>
          ) : (
            children.map((child) => (
              <TreeNode key={child.id} node={child} depth={depth + 1} />
            ))
          )}
        </div>
      )}

      {/* Modals */}
      <RenameModal
        isOpen={showRename}
        onClose={() => setShowRename(false)}
        onSubmit={handleRename}
        currentName={node.name}
      />
      <DeleteConfirmModal
        isOpen={showDelete}
        onClose={() => setShowDelete(false)}
        onConfirm={handleDelete}
        nodeName={node.name}
        isFolder={isFolder}
      />
    </>
  );
}
