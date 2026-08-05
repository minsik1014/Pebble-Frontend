import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';

import { requestEmailChange } from '../api/settingsApi';

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

  const canSubmit = email.trim().length > 0 && !isSubmitting;

  const handleClose = () => {
    if (isSubmitting) return;

    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const trimmedEmail = email.trim();
    const validationError = validateEmail(trimmedEmail, currentEmail);

    if (validationError) {
      setErrorMessage(validationError);
      setSuccessMessage('');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');
    setSuccessMessage('');

    try {
      await requestEmailChange(trimmedEmail);

      setSuccessMessage(
        '인증 링크를 발송했어요. 새 이메일에서 인증을 완료해 주세요.',
      );
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
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-fill-shadow/30 backdrop-blur-[3px]"
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
            className={[
              'mt-token-s h-12 w-full rounded-token-s border px-token-m',
              'text-body-02-m text-text-strong outline-none',
              'placeholder:text-text-teritary',
              errorMessage
                ? 'border-fill-danger focus:border-fill-danger'
                : 'border-border-teritory focus:border-border-primary',
            ].join(' ')}
            onChange={(event) => {
              setEmail(event.target.value);
              setErrorMessage('');
              setSuccessMessage('');
            }}
          />
        </label>

        {errorMessage ? (
          <p className="mt-token-s text-caption-01 text-fill-danger">
            {errorMessage}
          </p>
        ) : null}

        {successMessage ? (
          <p className="mt-token-s text-caption-01 text-text-primary">
            {successMessage}
          </p>
        ) : null}

        <div className="mt-token-xl grid grid-cols-2 gap-token-m">
          <Button
            variant="cancel"
            disabled={isSubmitting}
            className="h-11 w-full text-text-strong"
            onClick={handleClose}
          >
            취소
          </Button>

          <Button
            variant="primary"
            disabled={!canSubmit}
            className={[
              'h-11 w-full disabled:opacity-100',
              canSubmit
                ? ''
                : '!bg-btn-teritary !text-text-teritary',
            ].join(' ')}
            onClick={() => void handleSubmit()}
          >
            {submitButtonText}
          </Button>
        </div>
      </section>
    </div>
  );
}
