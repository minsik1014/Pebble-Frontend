import type { ReactNode } from 'react';

interface ToastProps {
  open: boolean;
  message: string;
  actionLabel?: string;
  isActionLoading?: boolean;
  children?: ReactNode;
  className?: string;
  onAction?: () => void;
  onClose?: () => void;
}

export function Toast({
  open,
  message,
  actionLabel,
  isActionLoading = false,
  children,
  className = '',
  onAction,
  onClose,
}: ToastProps) {
  return (
    <div
      role="status"
      aria-live="polite"
      aria-hidden={!open}
      className={[
        'fixed bottom-8 left-1/2 z-[9999] w-[calc(100%-32px)] max-w-[520px] -translate-x-1/2',
        'transition-[opacity,transform] duration-300 ease-out',
        open
          ? 'pointer-events-auto translate-y-0 opacity-100'
          : 'pointer-events-none translate-y-4 opacity-0',
        className,
      ].join(' ')}
    >
      <div className="flex min-h-[52px] items-center gap-token-m rounded-token-m bg-text-strong px-token-l py-token-m text-text-onFill shadow-shadow-m">
        <p className="min-w-0 flex-1 text-body-02-m leading-[150%]">
          {message}
        </p>

        {children}

        {actionLabel && onAction ? (
          <button
            type="button"
            disabled={isActionLoading}
            className="shrink-0 rounded-token-xs px-token-s py-token-xs text-body-02-sb text-text-onFill underline-offset-2 hover:underline disabled:cursor-not-allowed disabled:opacity-60"
            onClick={onAction}
          >
            {isActionLoading
              ? '재시도 중...'
              : actionLabel}
          </button>
        ) : null}

        {onClose ? (
          <button
            type="button"
            aria-label="토스트 닫기"
            disabled={isActionLoading}
            className="shrink-0 text-body-02-sb text-text-onFill opacity-80 transition-opacity hover:opacity-100 disabled:cursor-not-allowed disabled:opacity-40"
            onClick={onClose}
          >
            닫기
          </button>
        ) : null}
      </div>
    </div>
  );
}