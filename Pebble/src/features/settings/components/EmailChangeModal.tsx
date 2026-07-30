// src/features/settings/components/EmailChangeModal.tsx

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { requestEmailChange } from '@/features/settings/api/settingsApi';

interface EmailChangeModalProps {
  open: boolean;
  currentEmail: string;
  onOpenChange: (open: boolean) => void;
}

function validateEmail(email: string, currentEmail: string) {
  const trimmedEmail = email.trim();

  if (!trimmedEmail) return '새 이메일을 입력해 주세요.';

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!emailRegex.test(trimmedEmail)) {
    return '올바른 이메일 형식으로 입력해 주세요.';
  }

  if (trimmedEmail === currentEmail) {
    return '현재 이메일과 다른 이메일을 입력해 주세요.';
  }

  return '';
}

export function EmailChangeModal({
  open,
  currentEmail,
  onOpenChange,
}: EmailChangeModalProps) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!open) {
      setEmail('');
      setErrorMessage('');
      setSuccessMessage('');
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const hasEmailValue = email.trim().length > 0;
  const canSubmit = hasEmailValue && !isSubmitting;

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const validationError = validateEmail(email, currentEmail);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const result = await requestEmailChange(email.trim());

      setSuccessMessage(result.message);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '이메일 변경 요청에 실패했어요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitButtonText = isSubmitting
    ? '요청 중...'
    : successMessage
      ? '인증 메일 재전송'
      : '인증 메일 보내기';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[rgba(23,23,23,0.45)]"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="이메일 변경"
        className="w-[480px] rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-title-02-sb text-text-strong">이메일 변경</h2>

        <p className="mt-token-xs text-body-02-m text-text-secondary">
          새 이메일로 인증을 완료해야 변경이 적용돼요.
        </p>

        <label className="mt-token-l block">
          <span className="text-body-02-sb text-text-strong">새 이메일</span>

          <input
            value={email}
            disabled={isSubmitting}
            placeholder="새 이메일을 입력해 주세요"
            className="mt-token-s h-12 w-full rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none placeholder:text-text-teritary focus:border-border-primary disabled:cursor-not-allowed disabled:bg-btn-quaternary"
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage('');
              setSuccessMessage('');
            }}
          />
        </label>

        {errorMessage && (
          <p className="mt-token-s text-caption-01-r text-fill-danger">
            {errorMessage}
          </p>
        )}

        {successMessage && (
          <p className="mt-token-s text-caption-01-r text-text-primary">
            {successMessage}
          </p>
        )}

        <div className="mt-token-xl grid grid-cols-2 gap-token-m">
          <Button
            type="button"
            variant="secondary"
            disabled={isSubmitting}
            className="h-11 w-full text-text-strong disabled:cursor-not-allowed disabled:!opacity-100"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            type="button"
            variant="primary"
            disabled={!canSubmit}
            className={[
              'h-11 w-full disabled:cursor-not-allowed disabled:!opacity-100',
              canSubmit
                ? ''
                : '!bg-[#737373] !text-[#A3A3A3]',
            ].join(' ')}
            onClick={handleSubmit}
          >
            {submitButtonText}
          </Button>
        </div>
      </section>
    </div>
  );
}