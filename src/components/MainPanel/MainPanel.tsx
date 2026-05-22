"use client";

import React, { useState } from "react";
import { useFileSystem } from "@/context/FileSystemContext";
import Breadcrumb from "@/components/MainPanel/Breadcrumb";
import FileCard from "@/components/MainPanel/FileCard";
import CreateModal from "@/components/Modals/CreateModal";
import { FileType } from "@/types";

interface MainPanelProps {
  onToggleSidebar: () => void;
}

export default function MainPanel({ onToggleSidebar }: MainPanelProps) {
  const { state, dispatch, getChildren, getNode } = useFileSystem();
  const [showCreate, setShowCreate] = useState(false);

  const selectedNode = state.selectedId ? getNode(state.selectedId) : null;
  const children = state.selectedId ? getChildren(state.selectedId) : [];

  const handleCreate = (name: string, type: FileType) => {
    if (!state.selectedId) return;
    dispatch({
      type: "CREATE_NODE",
      payload: { parentId: state.selectedId, name, nodeType: type },
    });
  };

  return (
    <main className="main-panel">
      {/* Toolbar */}
      <div className="main-toolbar">
        <div className="main-toolbar-left">
          <button className="hamburger-btn" onClick={onToggleSidebar} aria-label="Toggle sidebar">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
          {selectedNode && <Breadcrumb nodeId={state.selectedId!} />}
          {!selectedNode && (
            <span className="main-toolbar-title">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span>Home</span>
            </span>
          )}
        </div>

        {selectedNode && selectedNode.type === "folder" && (
          <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            <span>New</span>
          </button>
        )}
      </div>

      {/* Content */}
      <div className="main-content">
        {!selectedNode ? (
          /* Home / Welcome screen */
          <div className="welcome-screen">
            <div className="welcome-icon">
              <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <h2 className="welcome-title">Mini File Explorer</h2>
            <p className="welcome-text">
              Select a folder from the sidebar to browse its contents.
              <br />
              Double-click folders to open, text files to edit.
            </p>
          </div>
        ) : children.length === 0 ? (
          /* Empty folder */
          <div className="empty-folder">
            <div className="empty-folder-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                <line x1="9" y1="14" x2="15" y2="14" />
              </svg>
            </div>
            <p className="empty-folder-text">This folder is empty</p>
            <button className="btn btn-primary btn-sm" onClick={() => setShowCreate(true)}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              <span>Create Something</span>
            </button>
          </div>
        ) : (
          /* File grid */
          <div className="file-grid">
            {children.map((child) => (
              <FileCard key={child.id} node={child} />
            ))}
          </div>
        )}
      </div>

      {/* Create modal */}
      {selectedNode && (
        <CreateModal
          isOpen={showCreate}
          onClose={() => setShowCreate(false)}
          onSubmit={handleCreate}
          parentName={selectedNode.name}
        />
      )}
    </main>
  );
}
