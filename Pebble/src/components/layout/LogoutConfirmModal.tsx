import { useEffect } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';

type LogoutConfirmModalProps = {
  isOpen: boolean;
  isSubmitting?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
};

export const LogoutConfirmModal = ({
  isOpen,
  isSubmitting = false,
  onClose,
  onConfirm,
}: LogoutConfirmModalProps) => {
  useEffect(() => {
    if (!isOpen) {
      return;
    }

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [isOpen, onClose]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[rgba(44,44,44,0.3)] backdrop-blur-[4px]"
      onClick={onClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-confirm-title"
        className="flex w-[400px] flex-col items-start justify-center gap-5 overflow-hidden rounded-token-l bg-fill-inverse p-token-xl shadow-[0_0_28px_0_rgba(23,23,23,0.05)]"
        onClick={(event) => event.stopPropagation()}
      >
        <header className="flex w-full items-start justify-between">
          <div className="flex flex-col gap-token-xs pt-token-s">
            <h2
              id="logout-confirm-title"
              className="whitespace-nowrap text-title-02-sb text-text-strong"
            >
              로그아웃 하시겠어요?
            </h2>
          </div>

          <button
            type="button"
            className="flex size-11 shrink-0 items-center justify-center rounded-token-s text-text-secondary transition-colors hover:bg-fill-surface"
            aria-label="로그아웃 모달 닫기"
            onClick={onClose}
            disabled={isSubmitting}
          >
            <CloseIcon className="size-6" />
          </button>
        </header>

        <div className="flex w-full items-start gap-token-m">
          <button
            type="button"
            className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-token-s bg-btn-quaternary px-token-l text-body-02-m text-text-strong transition-colors hover:bg-btn-pressed disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onClose}
            disabled={isSubmitting}
          >
            취소
          </button>
          <button
            type="button"
            className="flex h-11 min-w-0 flex-1 items-center justify-center rounded-token-s bg-btn-primary px-token-l text-body-02-m text-text-onFill transition-colors hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            onClick={onConfirm}
            disabled={isSubmitting}
          >
            로그아웃
          </button>
        </div>
      </section>
    </div>
  );
};
