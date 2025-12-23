"use client";

import { ReactNode, useEffect, useRef } from "react";

interface ModalProps {
  title?: string;
  children: ReactNode;
  onClose: () => void;
}

export default function Modal({ title, children, onClose }: ModalProps) {
  const modalRef = useRef<HTMLDivElement | null>(null);

  // Close on ESC key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handler);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4"
    >
      <div
        ref={modalRef}
        className="w-full max-w-lg rounded-2xl bg-white dark:bg-[#1D3B6C] shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all"
      >
        {/* Header */}
        {title && (
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {title}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-white transition"
            >
              ✕
            </button>
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-6 text-sm text-gray-700 dark:text-gray-200">
          {children}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 dark:bg-black/20 border-t border-gray-200 dark:border-gray-600 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg border border-gray-300 dark:border-gray-500 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}