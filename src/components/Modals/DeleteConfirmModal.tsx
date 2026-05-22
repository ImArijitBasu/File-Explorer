"use client";

import React from "react";
import Modal from "@/components/ui/Modal";

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  nodeName: string;
  isFolder: boolean;
}

export default function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  nodeName,
  isFolder,
}: DeleteConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Confirm Delete">
      <div className="modal-form">
        <div className="delete-warning">
          <div className="delete-warning-icon">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" y1="9" x2="12" y2="13" />
              <line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
          </div>
          <p className="delete-warning-text">
            Are you sure you want to delete <strong>&ldquo;{nodeName}&rdquo;</strong>?
          </p>
          {isFolder && (
            <p className="delete-warning-sub">
              This folder and all of its contents will be permanently deleted.
            </p>
          )}
        </div>

        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
          <button type="button" className="btn btn-danger" onClick={handleConfirm}>
            Delete
          </button>
        </div>
      </div>
    </Modal>
  );
}
