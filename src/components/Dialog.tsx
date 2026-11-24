import type { JSX, ReactNode } from 'react';
import { useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { useI18n } from '../i18n';

interface Props {
  labelledBy: string;
  onClose: () => void;
  children: ReactNode;
}

export function Dialog({ labelledBy, onClose, children }: Props): JSX.Element {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const pointerOnBackdrop = useRef(false);
  const { t } = useI18n();

  useEffect(() => {
    const dialog = dialogRef.current;
    const trigger = document.activeElement;
    if (!dialog) return;
    // Native modal dialogs trap focus and make the rest of the document inert.
    dialog.showModal();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      dialog.close();
      document.body.style.overflow = previousOverflow;
      if (trigger instanceof HTMLElement && trigger.isConnected) trigger.focus();
    };
  }, []);

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={labelledBy}
      className="ranking-dialog"
      onPointerDown={(event) => {
        pointerOnBackdrop.current = event.target === event.currentTarget;
      }}
      onPointerUp={(event) => {
        if (pointerOnBackdrop.current && event.target === event.currentTarget) onClose();
        pointerOnBackdrop.current = false;
      }}
      onCancel={(event) => {
        event.preventDefault();
        onClose();
      }}
    >
      <div className="ranking-dialog__content">
        <button
          aria-label={t('rankClose')}
          className="ranking-dialog__close"
          type="button"
          onClick={onClose}
        >
          <X size={20} aria-hidden="true" />
        </button>
        {children}
      </div>
    </dialog>
  );
}
