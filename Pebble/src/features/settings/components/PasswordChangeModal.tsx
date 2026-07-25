// src/features/settings/components/PasswordChangeModal.tsx

import { useEffect, useState } from 'react';

import EyeOffIcon from '@/assets/icons/eye-off.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';

import { Button } from '@/components/ui/Button';
import { changePassword } from '@/features/settings/api/mockSettingsApi';

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getNewPasswordError(password: string) {
  if (!password.trim()) return '';

  if (password.length < 8) {
    return '8자 이상 입력해 주세요.';
  }

  const hasEnglish = /[A-Za-z]/.test(password);
  const hasNumber = /\d/.test(password);

  if (!hasEnglish || !hasNumber) {
    return '영문과 숫자를 모두 포함해 주세요.';
  }

  return '';
}

function getPasswordConfirmError({
  newPassword,
  newPasswordConfirm,
}: {
  newPassword: string;
  newPasswordConfirm: string;
}) {
  if (!newPasswordConfirm.trim()) return '';

  if (newPassword !== newPasswordConfirm) {
    return '새 비밀번호가 일치하지 않아요.';
  }

  return '';
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
  if (!newPasswordConfirm.trim()) return '새 비밀번호 확인을 입력해 주세요.';

  const newPasswordError = getNewPasswordError(newPassword);

  if (newPasswordError) return newPasswordError;

  const confirmError = getPasswordConfirmError({
    newPassword,
    newPasswordConfirm,
  });

  if (confirmError) return confirmError;

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

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showNewPasswordConfirm, setShowNewPasswordConfirm] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setErrorMessage('');
      setIsSubmitting(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowNewPasswordConfirm(false);
    }
  }, [open]);

  if (!open) return null;

  const newPasswordError = getNewPasswordError(newPassword);
  const passwordConfirmError = getPasswordConfirmError({
    newPassword,
    newPasswordConfirm,
  });

  const hasPasswordValues =
    currentPassword.trim().length > 0 &&
    newPassword.trim().length > 0 &&
    newPasswordConfirm.trim().length > 0;

  const canSubmit =
    hasPasswordValues &&
    !newPasswordError &&
    !passwordConfirmError &&
    !isSubmitting;

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

  const inputBaseClassName =
    'h-12 w-full rounded-token-s border px-token-m pr-12 text-body-02-m text-text-strong outline-none placeholder:text-text-teritary focus:border-border-primary disabled:cursor-not-allowed disabled:bg-btn-quaternary';

  const normalInputClassName = `${inputBaseClassName} border-border-teritory`;

  const errorInputClassName = `${inputBaseClassName} border-fill-danger focus:border-fill-danger`;

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

            <div className="relative mt-token-s">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                value={currentPassword}
                disabled={isSubmitting}
                placeholder="현재 비밀번호를 입력해 주세요"
                className={normalInputClassName}
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setErrorMessage('');
                }}
              />

              <button
                type="button"
                disabled={isSubmitting}
                aria-label="현재 비밀번호 누르는 동안 보기"
                className="absolute right-token-m top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-secondary disabled:cursor-not-allowed"
                onMouseDown={() => setShowCurrentPassword(true)}
                onMouseUp={() => setShowCurrentPassword(false)}
                onMouseLeave={() => setShowCurrentPassword(false)}
                onBlur={() => setShowCurrentPassword(false)}
                onTouchStart={() => setShowCurrentPassword(true)}
                onTouchEnd={() => setShowCurrentPassword(false)}
                onTouchCancel={() => setShowCurrentPassword(false)}
              >
                {showCurrentPassword ? (
                  <EyeOffIcon className="size-5" aria-hidden="true" />
                ) : (
                  <EyeOnIcon className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호
            </span>

            <div className="relative mt-token-s">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                disabled={isSubmitting}
                placeholder="새 비밀번호를 입력해 주세요"
                className={
                  newPasswordError ? errorInputClassName : normalInputClassName
                }
                aria-invalid={!!newPasswordError}
                aria-describedby={
                  newPasswordError ? 'new-password-error' : undefined
                }
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrorMessage('');
                }}
              />

              <button
                type="button"
                disabled={isSubmitting}
                aria-label="새 비밀번호 누르는 동안 보기"
                className="absolute right-token-m top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-secondary disabled:cursor-not-allowed"
                onMouseDown={() => setShowNewPassword(true)}
                onMouseUp={() => setShowNewPassword(false)}
                onMouseLeave={() => setShowNewPassword(false)}
                onBlur={() => setShowNewPassword(false)}
                onTouchStart={() => setShowNewPassword(true)}
                onTouchEnd={() => setShowNewPassword(false)}
                onTouchCancel={() => setShowNewPassword(false)}
              >
                {showNewPassword ? (
                  <EyeOffIcon className="size-5" aria-hidden="true" />
                ) : (
                  <EyeOnIcon className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {newPasswordError && (
              <p
                id="new-password-error"
                className="mt-token-xs text-caption-01-r text-fill-danger"
              >
                {newPasswordError}
              </p>
            )}
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호 확인
            </span>

            <div className="relative mt-token-s">
              <input
                type={showNewPasswordConfirm ? 'text' : 'password'}
                value={newPasswordConfirm}
                disabled={isSubmitting}
                placeholder="새 비밀번호를 다시 입력해 주세요"
                className={
                  passwordConfirmError
                    ? errorInputClassName
                    : normalInputClassName
                }
                aria-invalid={!!passwordConfirmError}
                aria-describedby={
                  passwordConfirmError
                    ? 'new-password-confirm-error'
                    : undefined
                }
                onChange={(event) => {
                  setNewPasswordConfirm(event.target.value);
                  setErrorMessage('');
                }}
              />

              <button
                type="button"
                disabled={isSubmitting}
                aria-label="새 비밀번호 확인 누르는 동안 보기"
                className="absolute right-token-m top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-secondary disabled:cursor-not-allowed"
                onMouseDown={() => setShowNewPasswordConfirm(true)}
                onMouseUp={() => setShowNewPasswordConfirm(false)}
                onMouseLeave={() => setShowNewPasswordConfirm(false)}
                onBlur={() => setShowNewPasswordConfirm(false)}
                onTouchStart={() => setShowNewPasswordConfirm(true)}
                onTouchEnd={() => setShowNewPasswordConfirm(false)}
                onTouchCancel={() => setShowNewPasswordConfirm(false)}
              >
                {showNewPasswordConfirm ? (
                  <EyeOffIcon className="size-5" aria-hidden="true" />
                ) : (
                  <EyeOnIcon className="size-5" aria-hidden="true" />
                )}
              </button>
            </div>

            {passwordConfirmError && (
              <p
                id="new-password-confirm-error"
                className="mt-token-xs text-caption-01-r text-fill-danger"
              >
                {passwordConfirmError}
              </p>
            )}
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
              canSubmit ? '' : '!bg-[#737373] !text-[#A3A3A3]',
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