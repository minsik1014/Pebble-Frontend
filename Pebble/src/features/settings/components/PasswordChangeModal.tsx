import { useEffect, useState } from 'react';

import EyeOffIcon from '@/assets/icons/eye-off.svg?react';
import EyeOnIcon from '@/assets/icons/eye-on.svg?react';

import { Button } from '@/components/ui/Button';
import { changePassword } from '@/features/auth/api/authApi';
import { setAuthTokens } from '@/services/api';

interface PasswordChangeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function getNewPasswordError(password: string) {
  if (!password) return '';

  if (password.length < 8) {
    return '8자 이상 입력해 주세요.';
  }

  if (!/[A-Za-z]/.test(password) || !/\d/.test(password)) {
    return '영문과 숫자를 모두 포함해 주세요.';
  }

  return '';
}

function getConfirmError(password: string, confirm: string) {
  if (!confirm) return '';

  return password === confirm ? '' : '새 비밀번호가 일치하지 않아요.';
}

export function PasswordChangeModal({
  open,
  onOpenChange,
}: PasswordChangeModalProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');

  const [currentPasswordError, setCurrentPasswordError] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    if (!open) {
      setCurrentPassword('');
      setNewPassword('');
      setNewPasswordConfirm('');
      setCurrentPasswordError('');
      setErrorMessage('');
      setIsSubmitting(false);
      setShowCurrentPassword(false);
      setShowNewPassword(false);
      setShowConfirm(false);
    }
  }, [open]);

  if (!open) return null;

  const newPasswordError = getNewPasswordError(newPassword);
  const confirmError = getConfirmError(newPassword, newPasswordConfirm);

  const canSubmit =
    currentPassword.length > 0 &&
    newPassword.length > 0 &&
    newPasswordConfirm.length > 0 &&
    !newPasswordError &&
    !confirmError &&
    currentPassword !== newPassword &&
    !isSubmitting;

  const inputBase =
    'h-12 w-full rounded-token-s border px-token-m pr-12 text-body-02-m text-text-strong outline-none placeholder:text-text-teritary disabled:bg-btn-quaternary';

  const normalInput = `${inputBase} border-border-teritory focus:border-border-primary`;
  const errorInput = `${inputBase} border-fill-danger focus:border-fill-danger`;

  const handleClose = () => {
    if (!isSubmitting) {
      onOpenChange(false);
    }
  };

  const handleSubmit = async () => {
    if (!currentPassword) {
      setCurrentPasswordError('현재 비밀번호를 입력해 주세요.');
      return;
    }

    if (!canSubmit) return;

    setIsSubmitting(true);
    setCurrentPasswordError('');
    setErrorMessage('');

    try {
      const tokens = await changePassword(currentPassword, newPassword);

      setAuthTokens(tokens.accessToken, tokens.refreshToken);
      onOpenChange(false);
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : '비밀번호 변경에 실패했어요.';

      if (message.includes('현재 비밀번호')) {
        setCurrentPasswordError(message);
      } else {
        setErrorMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const visibilityButton = ({
    visible,
    setVisible,
    label,
  }: {
    visible: boolean;
    setVisible: (visible: boolean) => void;
    label: string;
  }) => (
    <button
      type="button"
      disabled={isSubmitting}
      aria-label={label}
      className="absolute right-token-m top-1/2 flex size-6 -translate-y-1/2 items-center justify-center text-text-secondary"
      onMouseDown={() => setVisible(true)}
      onMouseUp={() => setVisible(false)}
      onMouseLeave={() => setVisible(false)}
      onBlur={() => setVisible(false)}
      onTouchStart={() => setVisible(true)}
      onTouchEnd={() => setVisible(false)}
      onTouchCancel={() => setVisible(false)}
    >
      {visible ? (
        <EyeOffIcon className="size-5" aria-hidden="true" />
      ) : (
        <EyeOnIcon className="size-5" aria-hidden="true" />
      )}
    </button>
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(23,23,23,0.45)]"
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
                className={
                  currentPasswordError ? errorInput : normalInput
                }
                onChange={(event) => {
                  setCurrentPassword(event.target.value);
                  setCurrentPasswordError('');
                  setErrorMessage('');
                }}
              />

              {visibilityButton({
                visible: showCurrentPassword,
                setVisible: setShowCurrentPassword,
                label: '현재 비밀번호 누르는 동안 보기',
              })}
            </div>

            {currentPasswordError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {currentPasswordError}
              </p>
            ) : null}
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
                className={newPasswordError ? errorInput : normalInput}
                onChange={(event) => {
                  setNewPassword(event.target.value);
                  setErrorMessage('');
                }}
              />

              {visibilityButton({
                visible: showNewPassword,
                setVisible: setShowNewPassword,
                label: '새 비밀번호 누르는 동안 보기',
              })}
            </div>

            {newPasswordError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {newPasswordError}
              </p>
            ) : null}
          </label>

          <label>
            <span className="text-body-02-sb text-text-strong">
              새 비밀번호 확인
            </span>

            <div className="relative mt-token-s">
              <input
                type={showConfirm ? 'text' : 'password'}
                value={newPasswordConfirm}
                disabled={isSubmitting}
                placeholder="새 비밀번호를 다시 입력해 주세요"
                className={confirmError ? errorInput : normalInput}
                onChange={(event) => {
                  setNewPasswordConfirm(event.target.value);
                  setErrorMessage('');
                }}
              />

              {visibilityButton({
                visible: showConfirm,
                setVisible: setShowConfirm,
                label: '새 비밀번호 확인 누르는 동안 보기',
              })}
            </div>

            {confirmError ? (
              <p className="mt-token-xs text-caption-01 text-fill-danger">
                {confirmError}
              </p>
            ) : null}
          </label>
        </div>

        {errorMessage ? (
          <p className="mt-token-s text-caption-01 text-fill-danger">
            {errorMessage}
          </p>
        ) : null}

        <div className="mt-token-xl grid grid-cols-2 gap-token-m">
          <Button
            variant="secondary"
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
              canSubmit ? '' : '!bg-[#737373] !text-[#A3A3A3]',
            ].join(' ')}
            onClick={() => void handleSubmit()}
          >
            {isSubmitting ? '변경 중...' : '변경하기'}
          </Button>
        </div>
      </section>
    </div>
  );
}