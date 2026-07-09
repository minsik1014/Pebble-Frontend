import { useState } from 'react';

import { Button } from '@/components/ui/Button';

import { SettingsModal } from './SettingsModal';

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function PasswordChangeModal({
  open,
  onOpenChange,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!currentPassword || !newPassword || !newPasswordConfirm) {
      setErrorMessage('모든 비밀번호 항목을 입력해 주세요.');
      return;
    }

    if (newPassword.length < 8) {
      setErrorMessage('새 비밀번호는 8자 이상이어야 해요.');
      return;
    }

    if (newPassword !== newPasswordConfirm) {
      setErrorMessage('새 비밀번호가 서로 일치하지 않아요.');
      return;
    }

    setErrorMessage('');
    setIsSubmitting(true);

    try {
      // TODO: 비밀번호 변경 요청 API 연동
      await Promise.reject(new Error('Mock failure'));
    } catch {
      // 실패 시 모달과 입력값 유지
      setErrorMessage('비밀번호 변경에 실패했어요. 다시 시도해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SettingsModal
      open={open}
      title="비밀번호 변경"
      description="현재 비밀번호 확인 후 새 비밀번호를 설정해 주세요."
      onOpenChange={onOpenChange}
    >
      <div className="flex flex-col gap-token-m">
        <label className="flex flex-col gap-token-xs">
          <span className="text-body-02-sb text-text-strong">
            현재 비밀번호
          </span>
          <input
            value={currentPassword}
            type="password"
            placeholder="현재 비밀번호"
            className="h-12 rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none focus:border-border-primary"
            onChange={(event) => setCurrentPassword(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-token-xs">
          <span className="text-body-02-sb text-text-strong">새 비밀번호</span>
          <input
            value={newPassword}
            type="password"
            placeholder="새 비밀번호"
            className="h-12 rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none focus:border-border-primary"
            onChange={(event) => setNewPassword(event.target.value)}
          />
        </label>

        <label className="flex flex-col gap-token-xs">
          <span className="text-body-02-sb text-text-strong">
            새 비밀번호 확인
          </span>
          <input
            value={newPasswordConfirm}
            type="password"
            placeholder="새 비밀번호 확인"
            aria-invalid={errorMessage ? true : undefined}
            aria-describedby={
              errorMessage ? 'password-change-error' : undefined
            }
            className="h-12 rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none focus:border-border-primary"
            onChange={(event) => setNewPasswordConfirm(event.target.value)}
          />
        </label>

        {errorMessage ? (
          <p
            id="password-change-error"
            className="text-caption-01 text-fill-danger"
          >
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