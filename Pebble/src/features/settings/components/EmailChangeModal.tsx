import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import { SettingsModal } from './SettingsModal';

interface EmailChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function EmailChangeModal({
  open,
  onOpenChange,
}: EmailChangeModalProps) {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) {
      setErrorMessage('새 이메일을 입력해 주세요.');
      return;
    }

    if (!EMAIL_REGEX.test(email)) {
      setErrorMessage('올바른 이메일 형식으로 입력해 주세요.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // TODO: 이메일 변경 요청 API 연동
      await Promise.reject(new Error('Mock failure'));
    } catch {
      // 실패 시 모달과 입력값 유지
      setErrorMessage('이메일 변경 요청에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsModal
      open={open}
      title="이메일 변경"
      description="새 이메일을 입력하면 인증 메일을 보내드려요."
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-token-m">
        <label className="flex flex-col gap-token-xs">
          <span className="text-body-02-sb text-text-strong">새 이메일</span>
          <input
            value={email}
            type="email"
            placeholder="example@pebble.com"
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={errorMessage ? 'email-change-error' : undefined}
            className="h-12 rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none focus:border-border-primary"
            onChange={(event) => setEmail(event.target.value)}
          />
        </label>

        {errorMessage ? (
          <p id="email-change-error" className="text-caption-01 text-fill-danger">
            {errorMessage}
          </p>
        ) : null}

        <div className="flex justify-end gap-token-m">
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
            disabled={isSubmitting}
            onClick={handleSubmit}
          >
            변경하기
          </Button>
        </div>
      </div>
    </SettingsModal>
  );
}