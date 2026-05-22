"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { useFileSystem } from "@/context/FileSystemContext";

export default function TextEditor() {
  const { state, dispatch, getNode, getPath } = useFileSystem();
  const [content, setContent] = useState("");
  const [isSaved, setIsSaved] = useState(true);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fileId = state.editingFileId;
  const file = fileId ? getNode(fileId) : null;
  const path = fileId ? getPath(fileId) : [];

  // Load content when file changes
  useEffect(() => {
    if (file && file.type === "text") {
      setContent(file.content || "");
      setIsSaved(true);
      setTimeout(() => textareaRef.current?.focus(), 100);
    }
  }, [fileId]); // eslint-disable-line react-hooks/exhaustive-deps

  // Auto-save with debounce
  const saveContent = useCallback(() => {
    if (fileId && !isSaved) {
      dispatch({
        type: "UPDATE_CONTENT",
        payload: { id: fileId, content },
      });
      setIsSaved(true);
    }
  }, [fileId, content, isSaved, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    setIsSaved(false);

    // Debounced auto-save
    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current);
    saveTimeoutRef.current = setTimeout(() => {
      if (fileId) {
        dispatch({
          type: "UPDATE_CONTENT",
          payload: { id: fileId, content: e.target.value },
        });
        setIsSaved(true);
      }
    }, 800);
  };

  const handleClose = () => {
    // Save before closing
    if (!isSaved && fileId) {
      dispatch({
        type: "UPDATE_CONTENT",
        payload: { id: fileId, content },
      });
    }
    dispatch({ type: "SET_EDITING_FILE", payload: { id: null } });
  };

  const handleManualSave = () => {
    saveContent();
  };

  // Keyboard shortcut: Ctrl+S to save
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "s" && fileId) {
        e.preventDefault();
        saveContent();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [fileId, saveContent]);

  if (!file || file.type !== "text") return null;

  const lineCount = content.split("\n").length;
  const charCount = content.length;

  return (
    <div className="editor-overlay">
      <div className="editor-container">
        {/* Editor header */}
        <div className="editor-header">
          <div className="editor-header-left">
            <div className="editor-file-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
              </svg>
            </div>
            <div className="editor-file-info">
              <span className="editor-file-name">{file.name}</span>
              <span className="editor-file-path">
                {path.slice(0, -1).map((n) => n.name).join(" / ")}
              </span>
            </div>
            <span className={`editor-save-badge ${isSaved ? "saved" : "unsaved"}`}>
              {isSaved ? "Saved" : "Unsaved"}
            </span>
          </div>
          <div className="editor-header-right">
            <button className="btn btn-secondary btn-sm" onClick={handleManualSave} disabled={isSaved}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                <polyline points="17 21 17 13 7 13 7 21" />
                <polyline points="7 3 7 8 15 8" />
              </svg>
              <span>Save</span>
            </button>
            <button className="btn btn-secondary btn-sm" onClick={handleClose}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
              <span>Close</span>
            </button>
          </div>
        </div>

        {/* Editor body */}
        <div className="editor-body">
          <textarea
            ref={textareaRef}
            className="editor-textarea"
            value={content}
            onChange={handleChange}
            spellCheck={false}
            placeholder="Start typing..."
          />
        </div>

        {/* Editor footer / status bar */}
        <div className="editor-footer">
          <span>{lineCount} lines</span>
          <span>{charCount} characters</span>
          <span>Ctrl+S to save</span>
        </div>
      </div>
    </div>
  );
}
