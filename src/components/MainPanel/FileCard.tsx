"use client";

import React, { useState } from "react";
import { FileNode } from "@/types";
import { useFileSystem } from "@/context/FileSystemContext";
import RenameModal from "@/components/Modals/RenameModal";
import DeleteConfirmModal from "@/components/Modals/DeleteConfirmModal";

interface FileCardProps {
  node: FileNode;
}

export default function FileCard({ node }: FileCardProps) {
  const { dispatch } = useFileSystem();
  const [showRename, setShowRename] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const isFolder = node.type === "folder";

  const handleDoubleClick = () => {
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
      <div className="file-card" onDoubleClick={handleDoubleClick} tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter") handleDoubleClick();
        }}
      >
        {/* Icon */}
        <div className={`file-card-icon ${isFolder ? "folder" : "file"}`}>
          {isFolder ? (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
          ) : (
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.2">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
            </svg>
          )}
        </div>

        {/* Name */}
        <span className="file-card-name" title={node.name}>{node.name}</span>

        {/* Type badge */}
        <span className={`file-card-badge ${isFolder ? "folder" : "file"}`}>
          {isFolder ? "Folder" : "Text"}
        </span>

        {/* Action menu */}
        <div className="file-card-menu">
          <button
            className="file-card-menu-btn"
            onClick={(e) => {
              e.stopPropagation();
              setShowDropdown(!showDropdown);
            }}
            aria-label={`Actions for ${node.name}`}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <circle cx="12" cy="5" r="1.5" />
              <circle cx="12" cy="12" r="1.5" />
              <circle cx="12" cy="19" r="1.5" />
            </svg>
          </button>

          {showDropdown && (
            <>
              <div className="dropdown-backdrop" onClick={() => setShowDropdown(false)} />
              <div className="dropdown-menu">
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    handleDoubleClick();
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                  <span>{isFolder ? "Open" : "Edit"}</span>
                </button>
                <button
                  className="dropdown-item"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    setShowRename(true);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                  </svg>
                  <span>Rename</span>
                </button>
                <div className="dropdown-divider" />
                <button
                  className="dropdown-item danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(false);
                    setShowDelete(true);
                  }}
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="3 6 5 6 21 6" />
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                  <span>Delete</span>
                </button>
              </div>
            </>
          )}
        </div>
      </div>

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
