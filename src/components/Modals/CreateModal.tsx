"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";
import { FileType } from "@/types";

interface CreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string, type: FileType) => void;
  parentName: string;
}

export default function CreateModal({ isOpen, onClose, onSubmit, parentName }: CreateModalProps) {
  const [name, setName] = useState("");
  const [type, setType] = useState<FileType>("folder");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName("");
      setType("folder");
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;
    const finalName = type === "text" && !trimmed.endsWith(".txt") ? `${trimmed}.txt` : trimmed;
    onSubmit(finalName, type);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create New">
      <form onSubmit={handleSubmit} className="modal-form">
        <p className="modal-subtitle">
          Creating inside <span className="text-accent">{parentName}</span>
        </p>

        <div className="type-selector">
          <button
            type="button"
            className={`type-option ${type === "folder" ? "active" : ""}`}
            onClick={() => setType("folder")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
            </svg>
            <span>Folder</span>
          </button>
          <button
            type="button"
            className={`type-option ${type === "text" ? "active" : ""}`}
            onClick={() => setType("text")}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span>Text File</span>
          </button>
        </div>

        <div className="input-group">
          <label htmlFor="create-name" className="input-label">Name</label>
          <input
            ref={inputRef}
            id="create-name"
            type="text"
            className="input-field"
            placeholder={type === "folder" ? "New Folder" : "document.txt"}
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoComplete="off"
          />
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={!name.trim()}>
            Create
          </button>
        </div>
      </form>
    </Modal>
  );
}
