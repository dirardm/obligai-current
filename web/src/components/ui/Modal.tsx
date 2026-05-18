/**
 * Modal — centred dialog with scrim. Closes on scrim click or Escape.
 *
 * @example
 * <Modal open={open} onClose={() => setOpen(false)} title="Assign obligation" actions={<Button onClick={save}>Save</Button>}>
 *   <p>...</p>
 * </Modal>
 */

"use client";

import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children?: React.ReactNode;
  actions?: React.ReactNode;
}

export default function Modal({ open, onClose, title, children, actions }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="modal-scrim" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        {title && <h2 className="modal__title" id="modal-title">{title}</h2>}
        {children && <div className="modal__body">{children}</div>}
        {actions && <div className="modal__actions">{actions}</div>}
      </div>
    </div>
  );
}
