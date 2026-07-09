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
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,23,23,0.45)]"
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
        <div className="flex items-start justify-between gap-token-l">
          <div>
            <h2
              id={titleId}
              className="text-title-02-sb tracking-[-0.01em] text-text-strong"
            >
              정말 탈퇴하시겠어요?
            </h2>
            <p
              id={descriptionId}
              className="mt-token-xs text-body-03-r text-text-secondary"
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

        <div className="flex flex-col gap-token-m rounded-token-s bg-[#FFE5D8] px-token-l py-token-m text-body-03-m text-text-primary">
          <p className="flex items-center gap-token-s">
            <DeleteIcon
              className="size-5 shrink-0 text-fill-danger"
              aria-hidden="true"
            />
            <span>
              투두·일정·조약돌 기록, 프로필 이미지 등 모든 데이터가 영구
              삭제돼요.
            </span>
          </p>

          <p className="flex items-center gap-token-s">
            <XIcon
              className="size-5 shrink-0 text-fill-danger"
              aria-hidden="true"
            />
            <span>삭제된 데이터는 어떤 경우에도 다시 복구할 수 없어요.</span>
          </p>
        </div>

        <label className="flex items-center gap-token-s text-body-03-m text-text-strong">
          <input
            type="checkbox"
            checked={isAgreed}
            disabled={isSubmitting}
            className="size-6 rounded-token-xs border border-border-teritory accent-fill-primary"
            onChange={(event) => setIsAgreed(event.target.checked)}
          />
          위 내용을 확인하였으며, 탈퇴에 동의합니다.
        </label>

        <div className="mt-auto grid grid-cols-2 gap-token-m">
          <Button
            type="button"
            disabled={isSubmitting}
            onClick={() => onOpenChange(false)}
          >
            취소
          </Button>
          <Button
            type="button"
            variant="danger"
            disabled={!canSubmit}
            onClick={onConfirm}
          >
            탈퇴하기
          </Button>
        </div>
      </section>
    </div>
  );
}