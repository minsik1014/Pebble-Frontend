import { useEffect, useRef, useState } from 'react';

import DeleteIcon from '@/assets/icons/Delete.svg?react';
import { Button } from '@/components/ui/Button';
import { Toast } from '@/components/ui/Toast';

type ModalActionBarProps = {
  submitLabel: string;
  disabled?: boolean;
  isBusy?: boolean;
  disabledReason?: string;
  onCancel: () => void;
  onSubmit: () => void | Promise<void>;
  onDelete?: () => void | Promise<void>;
  deleteLabel?: string;
};

export const ModalActionBar = ({
  submitLabel,
  disabled = false,
  isBusy = false,
  disabledReason,
  onCancel,
  onSubmit,
  onDelete,
  deleteLabel = '삭제',
}: ModalActionBarProps) => {
  const [isToastVisible, setIsToastVisible] =
    useState(false);

  const toastTimerRef = useRef<
    ReturnType<typeof setTimeout> | null
  >(null);

  const isSubmitBlockedWithReason =
    disabled &&
    Boolean(disabledReason) &&
    !isBusy;

  const isSubmitDisabled =
    isBusy ||
    (disabled && !disabledReason);

  useEffect(
    () => () => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
    },
    [],
  );

  const showDisabledReasonToast = () => {
    if (!disabledReason || isBusy) {
      return;
    }

    setIsToastVisible(true);

    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
    }

    toastTimerRef.current = setTimeout(() => {
      setIsToastVisible(false);
    }, 1800);
  };

  const handleSubmitClick = () => {
    if (isBusy) {
      return;
    }

    if (isSubmitBlockedWithReason) {
      showDisabledReasonToast();
      return;
    }

    void onSubmit();
  };

  return (
    <>
      <div className="flex w-full gap-3">
        {onDelete ? (
          <button
            type="button"
            disabled={isBusy}
            onClick={() => void onDelete()}
            aria-label={deleteLabel}
            className={[
              'relative flex h-11 w-11 shrink-0 items-center justify-center',
              'overflow-hidden rounded-token-s bg-fill-danger',
              'transition-colors',
              'before:pointer-events-none before:absolute before:inset-0',
              'before:transition-colors',
              'hover:before:bg-[rgba(250,250,250,0.25)]',
              'active:before:bg-[rgba(250,250,250,0.4)]',
              'disabled:cursor-not-allowed disabled:opacity-50',
              'disabled:hover:before:bg-transparent',
            ].join(' ')}
          >
            <DeleteIcon className="relative z-10 h-6 w-6 text-fill-inverse" />
          </button>
        ) : null}

        <Button
          type="button"
          variant="cancel"
          disabled={isBusy}
          onClick={onCancel}
          className="h-11 flex-1"
        >
          취소
        </Button>

        <Button
          type="button"
          variant="primary"
          disabled={isSubmitDisabled}
          aria-disabled={disabled || isBusy}
          onClick={handleSubmitClick}
          className={[
            'h-11 flex-1',
            isSubmitBlockedWithReason
              ? 'cursor-not-allowed opacity-50 hover:before:bg-transparent'
              : '',
          ].join(' ')}
        >
          {isBusy ? '처리 중...' : submitLabel}
        </Button>
      </div>

      {disabledReason ? (
        <Toast
          message={disabledReason}
          open={isToastVisible}
          className="fixed bottom-8 right-8 z-[70]"
          role="alert"
          aria-live="assertive"
        />
      ) : null}
    </>
  );
};