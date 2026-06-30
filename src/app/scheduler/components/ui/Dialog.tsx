"use client";

import { ReactNode } from "react";

interface DialogProps {
  open: boolean;
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Dialog({
  open,
  title,
  children,
  onClose,
}: DialogProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="dialog-backdrop fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="dialog-container w-full max-w-2xl rounded-xl bg-white shadow-xl">
        <div className="dialog-header flex items-center justify-between border-b px-6 py-4">
          <h2 className="dialog-title text-xl font-semibold">
            {title}
          </h2>

          <button
            className="dialog-close-button rounded-md px-3 py-2 hover:bg-gray-100"
            onClick={onClose}
            type="button"
          >
            ✕
          </button>
        </div>

        <div className="dialog-body p-6">
          {children}
        </div>
      </div>
    </div>
  );
}