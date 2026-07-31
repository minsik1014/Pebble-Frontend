import { Button } from '@/components/ui/Button';

interface SettingsErrorToastProps {
  open: boolean;
  message: string;
  isRetrying?: boolean;
  onRetry: () => void;
  onClose: () => void;
}

export function SettingsErrorToast({
  open,
  message,
  isRetrying = false,
  onRetry,
  onClose,
}: SettingsErrorToastProps) {
  if (!open) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className="fixed bottom-8 left-1/2 z-[70] flex min-h-14 -translate-x-1/2 items-center gap-token-l rounded-token-s bg-btn-primary px-token-l py-token-m text-text-onFill shadow-shadow-m"
    >
      <p className="text-body-02-m">{message}</p>

      <Button
        type="button"
        variant="secondary"
        disabled={isRetrying}
        className="h-9 shrink-0 px-token-m"
        onClick={onRetry}
      >
        {isRetrying ? '재시도 중...' : '다시 시도'}
      </Button>

      <button
        type="button"
        disabled={isRetrying}
        aria-label="오류 메시지 닫기"
        className="shrink-0 text-body-02-m text-text-onFill disabled:cursor-not-allowed disabled:opacity-50"
        onClick={onClose}
      >
        닫기
      </button>
    </div>
  );
}