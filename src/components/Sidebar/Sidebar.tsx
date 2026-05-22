"use client";

import React from "react";
import { useFileSystem } from "@/context/FileSystemContext";
import TreeNode from "@/components/Sidebar/TreeNode";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const { state } = useFileSystem();

  const rootNodes = state.rootIds
    .map((id) => state.nodes[id])
    .filter(Boolean);

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}

      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Explorer</span>
          </div>
          <button className="sidebar-close-btn" onClick={onClose} aria-label="Close sidebar">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Tree */}
        <div className="sidebar-tree" role="tree">
          {rootNodes.map((node) => (
            <TreeNode key={node.id} node={node} depth={0} />
          ))}
        </div>

        {/* Footer */}
        <div className="sidebar-footer">
          <span className="sidebar-footer-text">
            {Object.keys(state.nodes).length} items
          </span>
        </div>
      </aside>
    </>
  );
}
