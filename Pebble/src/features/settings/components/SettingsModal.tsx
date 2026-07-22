import { useEffect, type ReactNode } from 'react';

import { ModalViewportPanel } from '@/components/ui/ModalViewportPanel';

interface SettingsModalProps {
  open: boolean;
  title: string;
  description?: string;
  children: ReactNode;
  onOpenChange: (open: boolean) => void;
}

export function SettingsModal({
  open,
  title,
  description,
  children,
  onOpenChange,
}: SettingsModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[rgba(23,23,23,0.45)]"
      onClick={() => onOpenChange(false)}
    >
      <ModalViewportPanel
        as="section"
        role="dialog"
        aria-modal="true"
        aria-labelledby="settings-modal-title"
        aria-describedby={description ? 'settings-modal-description' : undefined}
        className="w-[520px] rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-token-l">
          <div>
            <h2
              id="settings-modal-title"
              className="text-title-02-sb tracking-[-0.01em] text-text-strong"
            >
              {title}
            </h2>

            {description ? (
              <p
                id="settings-modal-description"
                className="mt-token-xs text-body-03-r text-text-secondary"
              >
                {description}
              </p>
            ) : null}
          </div>

          <button
            type="button"
            aria-label="모달 닫기"
            className="flex size-8 shrink-0 items-center justify-center rounded-token-s text-text-secondary hover:bg-btn-quaternary"
            onClick={() => onOpenChange(false)}
          >
            ×
          </button>
        </div>

        <div className="mt-token-l">{children}</div>
      </ModalViewportPanel>
    </div>
  );
}
