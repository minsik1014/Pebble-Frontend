import { useEffect, useId, useState } from 'react';

import CloseIcon from '@/assets/icons/Close.svg?react';
import DeleteIcon from '@/assets/icons/Delete.svg?react';
import XIcon from '@/assets/icons/X.svg?react';

import { Button } from '@/components/ui/Button';

interface WithdrawalConfirmModalProps {
  open: boolean;
  isSubmitting?: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function WithdrawalConfirmModal({
  open,
  isSubmitting = false,
  onOpenChange,
  onConfirm,
}: WithdrawalConfirmModalProps) {
  const [isAgreed, setIsAgreed] = useState(false);
  const titleId = useId();
  const descriptionId = useId();
  const agreementId = useId();

  useEffect(() => {
    if (!open) return;

    setIsAgreed(false);

    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onOpenChange(false);
      }
    };

    window.addEventListener('keydown', handleEscapeKey);

    return () => window.removeEventListener('keydown', handleEscapeKey);
  }, [open, isSubmitting, onOpenChange]);

  if (!open) return null;

  const canSubmit = isAgreed && !isSubmitting;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[rgba(23,23,23,0.45)]"
      onClick={() => {
        if (!isSubmitting) onOpenChange(false);
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        className="flex h-[359px] w-[640px] flex-col gap-token-l rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex h-[67px] w-full items-start justify-between">
          <div>
            <h2
              id={titleId}
              className="text-title-02-sb tracking-[-0.01em] text-text-strong"
            >
              정말 탈퇴하시겠어요?
            </h2>
            <p
              id={descriptionId}
              className="mt-token-xs text-body-02-m tracking-[-0.01em] text-text-secondary"
            >
              탈퇴 전 아래 내용을 반드시 확인해 주세요.
            </p>
          </div>

          <button
            type="button"
            aria-label="회원탈퇴 확인 모달 닫기"
            disabled={isSubmitting}
            className="flex size-8 shrink-0 items-center justify-center rounded-token-s text-text-secondary hover:bg-btn-quaternary disabled:cursor-not-allowed disabled:opacity-50"
            onClick={() => onOpenChange(false)}
          >
            <CloseIcon className="size-6" aria-hidden="true" />
          </button>
        </div>

        <div className="flex h-[100px] w-full flex-col justify-center gap-token-m rounded-token-s bg-fill-danger-bg p-token-l">
          <p className="flex h-6 w-full items-center gap-token-m">
            <DeleteIcon
              className="size-6 shrink-0 text-fill-danger"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap text-body-02-m tracking-[-0.01em] text-text-primary">
              투두·일정·조약돌 기록, 프로필 이미지 등 모든 데이터가 영구 삭제돼요.
            </span>
          </p>

          <p className="flex h-6 w-full items-center gap-token-m">
            <XIcon
              className="size-6 shrink-0 text-fill-danger"
              aria-hidden="true"
            />
            <span className="whitespace-nowrap text-body-02-m tracking-[-0.01em] text-text-primary">
              삭제된 데이터는 어떤 경우에도 다시 복구할 수 없어요.
            </span>
          </p>
        </div>

        <input
          id={agreementId}
          type="checkbox"
          checked={isAgreed}
          disabled={isSubmitting}
          className="peer sr-only"
          onChange={(event) => setIsAgreed(event.target.checked)}
        />

        <label
          htmlFor={agreementId}
          className="flex h-6 w-full cursor-pointer items-center gap-token-s text-body-02-m tracking-[-0.01em] text-text-strong peer-disabled:cursor-not-allowed peer-disabled:opacity-50"
        >
          <span
            aria-hidden="true"
            className={[
              'flex size-6 shrink-0 items-center justify-center rounded-token-xs border transition-colors',
              isAgreed
                ? 'border-btn-primary bg-btn-primary text-text-onFill'
                : 'border-border-teritory bg-fill-inverse text-transparent',
            ].join(' ')}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3.5 8.2L6.5 11L12.5 5"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>

          <span>위 내용을 확인하였으며, 탈퇴에 동의합니다.</span>
        </label>

        <div className="mt-auto grid h-11 w-full grid-cols-2 gap-token-m">
          <Button
            type="button"
            className="h-11 bg-btn-quaternary text-text-strong disabled:opacity-100"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>

          <Button
            type="button"
            variant="danger"
            className={[
              'h-11 disabled:opacity-100',
              canSubmit
                ? 'bg-fill-danger text-text-onFill'
                : 'bg-fill-danger/60 text-text-onFill',
            ].join(' ')}
            disabled={!canSubmit}
            onClick={onConfirm}
          >
            {isSubmitting ? '탈퇴 중...' : '탈퇴하기'}
          </Button>
        </div>
      </section>
    </div>
  );
}
