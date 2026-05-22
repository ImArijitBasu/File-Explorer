"use client";

import React from "react";
import { useFileSystem } from "@/context/FileSystemContext";
import { FileNode } from "@/types";

interface BreadcrumbProps {
  nodeId: string;
}

export default function Breadcrumb({ nodeId }: BreadcrumbProps) {
  const { getPath, dispatch } = useFileSystem();
  const path = getPath(nodeId);

  return (
    <nav className="breadcrumb" aria-label="Breadcrumb">
      <button
        className="breadcrumb-item root"
        onClick={() => dispatch({ type: "SET_SELECTED", payload: { id: null } })}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
        <span>Home</span>
      </button>
      {path.map((node: FileNode, index: number) => (
        <React.Fragment key={node.id}>
          <span className="breadcrumb-separator">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </span>
          <button
            className={`breadcrumb-item ${index === path.length - 1 ? "active" : ""}`}
            onClick={() => dispatch({ type: "SET_SELECTED", payload: { id: node.id } })}
          >
            {node.name}
          </button>
        </React.Fragment>
      ))}
    </nav>
  );
}
