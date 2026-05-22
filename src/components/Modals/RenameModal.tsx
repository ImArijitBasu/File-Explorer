"use client";

import React, { useState, useRef, useEffect } from "react";
import Modal from "@/components/ui/Modal";

interface RenameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
  currentName: string;
}

export default function RenameModal({ isOpen, onClose, onSubmit, currentName }: RenameModalProps) {
  const [name, setName] = useState(currentName);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setName(currentName);
      setTimeout(() => {
        inputRef.current?.focus();
        inputRef.current?.select();
      }, 100);
    }
  }, [isOpen, currentName]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed || trimmed === currentName) {
      onClose();
      return;
    }
    onSubmit(trimmed);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Rename">
      <form onSubmit={handleSubmit} className="modal-form">
        <div className="input-group">
          <label htmlFor="rename-input" className="input-label">New Name</label>
          <input
            ref={inputRef}
            id="rename-input"
            type="text"
            className="input-field"
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
            Rename
          </button>
        </div>
      </form>
    </Modal>
  );
}
