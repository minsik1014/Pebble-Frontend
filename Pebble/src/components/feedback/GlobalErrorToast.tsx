import { useEffect, useState } from 'react';

import { Toast } from '@/components/ui/Toast';

import {
  closeGlobalErrorToast,
  retryGlobalErrorToastAction,
  subscribeGlobalErrorToast,
  type GlobalErrorToastState,
} from './globalErrorToastStore';

const INITIAL_TOAST_STATE: GlobalErrorToastState = {
  open: false,
  message: '',
  isRetrying: false,
};

export function GlobalErrorToast() {
  const [toastState, setToastState] =
    useState<GlobalErrorToastState>(INITIAL_TOAST_STATE);

  useEffect(() => subscribeGlobalErrorToast(setToastState), []);

  return (
    <Toast
      open={toastState.open}
      message={toastState.message}
      actionLabel={toastState.retryLabel}
      isActionLoading={toastState.isRetrying}
      onAction={
        toastState.retryLabel
          ? () => void retryGlobalErrorToastAction()
          : undefined
      }
      onClose={closeGlobalErrorToast}
    />
  );
}