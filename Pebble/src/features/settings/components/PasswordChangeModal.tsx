// src/features/settings/components/PasswordChangeModal.tsx

import { useEffect, useState } from 'react';

import { Button } from '@/components/ui/Button';
import { changePassword } from '@/features/settings/api/mockSettingsApi';

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function validatePasswordForm({
  currentPassword,
  newPassword,
  newPasswordConfirm,
}: {
  currentPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}) {
  if (!currentPassword.trim()) return '현재 비밀번호를 입력해 주세요.';
  if (!newPassword.trim()) return '새 비밀번호를 입력해 주세요.';

  if (newPassword.length < 8) {
    return '새 비밀번호는 8자 이상이어야 해요.';
  }

  if (newPassword !== newPasswordConfirm) {
    return '새 비밀번호가 일치하지 않아요.';
  }

  if (currentPassword === newPassword) {
    return '현재 비밀번호와 다른 비밀번호를 입력해 주세요.';
  }

  return '';
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

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setErrorMessage('');
      setIsSubmitting(false);
    }
  }, [open]);

  if (!open) return null;

  const hasPasswordValues =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    newPasswordConfirm.trim().length > 0;

  const canSubmit = hasPasswordValues && !isSubmitting;

  const handleClose = () => {
    if (isSubmitting) return;
    onOpenChange(false);
  };

  const handleSubmit = async () => {
    const validationError = validatePasswordForm({
      currentPassword,
      newPassword,
      newPasswordConfirm,
    });

    if (validationError) {
      setErrorMessage(validationError);
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      await changePassword({
        currentPassword,
        newPassword,
      });

      onOpenChange(false);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '비밀번호 변경에 실패했어요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-[rgba(23,23,23,0.45)]"
      onClick={handleClose}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-label="비밀번호 변경"
        className="w-[480px] rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m"
        onClick={(event) => event.stopPropagation()}
      >
        <h2 className="text-title-02-sb text-text-strong">비밀번호 변경</h2>

        <p className="mt-token-xs text-body-02-m text-text-secondary">
          현재 비밀번호를 확인한 뒤 새 비밀번호를 설정해요.
        </p>

        <div className="mt-token-l flex flex-col gap-token-m">
          <label>
            <span className="text-body-02-sb text-text-strong">
              현재 비밀번호
            </span>

            <input
              type="password"
              value={currentPassword}
              disabled={isSubmitting}
              placeholder="현재 비밀번호를 입력해 주세요"
              className="mt-token-s h-12 w-full rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none placeholder:text-text-teritary focus:border-border-primary disabled:cursor-not-allowed disabled:bg-btn-quaternary"
              onChange={(event) => {
                setCurrentPassword(event.target.value);
                setErrorMessage('');
              }}
            />
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호
            </span>

            <input
              type="password"
              value={newPassword}
              disabled={isSubmitting}
              placeholder="새 비밀번호를 입력해 주세요"
              className="mt-token-s h-12 w-full rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none placeholder:text-text-teritary focus:border-border-primary disabled:cursor-not-allowed disabled:bg-btn-quaternary"
              onChange={(event) => {
                setNewPassword(event.target.value);
                setErrorMessage('');
              }}
            />
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호 확인
            </span>

            <input
              type="password"
              value={newPasswordConfirm}
              disabled={isSubmitting}
              placeholder="새 비밀번호를 다시 입력해 주세요"
              className="mt-token-s h-12 w-full rounded-token-s border border-border-teritory px-token-m text-body-02-m text-text-strong outline-none placeholder:text-text-teritary focus:border-border-primary disabled:cursor-not-allowed disabled:bg-btn-quaternary"
              onChange={(event) => {
                setNewPasswordConfirm(event.target.value);
                setErrorMessage('');
              }}
            />
          </label>
        </div>

        {errorMessage && (
          <p className="mt-token-s text-caption-01-r text-fill-danger">
            {errorMessage}
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
            {isSubmitting ? '변경 중...' : '변경하기'}
          </Button>
        </div>
      </section>
    </div>
  );
}