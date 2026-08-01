import { TEMPORARY_ERROR_MESSAGE } from '@/services/api/constants';

export type GlobalErrorToastOptions = {
  message?: string;
  retryLabel?: string;
  autoCloseMs?: number;
  retry?: () => Promise<void> | void;
};

export type GlobalErrorToastState = {
  open: boolean;
  message: string;
  retryLabel?: string;
  isRetrying: boolean;
  retry?: () => Promise<void> | void;
};

type GlobalErrorToastListener = (state: GlobalErrorToastState) => void;

const DEFAULT_AUTO_CLOSE_MS = 4000;

const listeners = new Set<GlobalErrorToastListener>();

let closeTimer: ReturnType<typeof setTimeout> | null = null;

let state: GlobalErrorToastState = {
  open: false,
  message: TEMPORARY_ERROR_MESSAGE,
  isRetrying: false,
};

function emit() {
  listeners.forEach((listener) => listener(state));
}

function clearCloseTimer() {
  if (closeTimer) {
    clearTimeout(closeTimer);
    closeTimer = null;
  }
}

export function subscribeGlobalErrorToast(
  listener: GlobalErrorToastListener,
) {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

export function showGlobalErrorToast(
  options: GlobalErrorToastOptions = {},
) {
  clearCloseTimer();

  const hasRetry = Boolean(options.retry);

  state = {
    open: true,
    message: options.message ?? TEMPORARY_ERROR_MESSAGE,
    retryLabel: hasRetry ? options.retryLabel ?? '다시 시도' : undefined,
    retry: options.retry,
    isRetrying: false,
  };

  emit();

  if (!hasRetry) {
    closeTimer = setTimeout(() => {
      closeGlobalErrorToast();
    }, options.autoCloseMs ?? DEFAULT_AUTO_CLOSE_MS);
  }
}

export function closeGlobalErrorToast() {
  clearCloseTimer();

  state = {
    ...state,
    open: false,
    isRetrying: false,
  };

  emit();
}

export async function retryGlobalErrorToastAction() {
  const retry = state.retry;

  if (!retry || state.isRetrying) return;

  clearCloseTimer();

  state = {
    ...state,
    isRetrying: true,
  };

  emit();

  try {
    await retry();

    state = {
      ...state,
      open: false,
      isRetrying: false,
    };

    emit();
  } catch {
    state = {
      ...state,
      open: true,
      isRetrying: false,
    };

    emit();
  }
}