import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import { showGlobalErrorToast } from '@/components/feedback/globalErrorToastStore';
import {
  isCommonRetryableApiError,
  TEMPORARY_ERROR_MESSAGE,
} from '@/services/api';

interface RetryableActionOptions {
  onError?: (error: unknown) => void;
  enableRetry?: boolean;
}

type RetryableActionResult<T> =
  | {
      success: true;
      data: T;
    }
  | {
      success: false;
      error: unknown;
    };

export function useRetryableAction() {
  const isMountedRef = useRef(false);
  const isRunningRef = useRef(false);

  /*
   * 전역 토스트에는 이 ref를 읽는 함수만 전달합니다.
   * 컴포넌트가 제거되면 ref를 비워 입력값을 캡처한
   * 실제 요청 함수가 남지 않도록 처리합니다.
   */
  const retryActionRef = useRef<
    (() => Promise<void>) | null
  >(null);

  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    isMountedRef.current = true;

    return () => {
      isMountedRef.current = false;
      retryActionRef.current = null;
    };
  }, []);

  const updateRunningState = useCallback(
    (nextIsRunning: boolean) => {
      isRunningRef.current = nextIsRunning;

      if (isMountedRef.current) {
        setIsRunning(nextIsRunning);
      }
    },
    [],
  );

  const run = useCallback(
    async <T,>(
      action: () => Promise<T>,
      {
        onError,
        enableRetry = true,
      }: RetryableActionOptions = {},
    ): Promise<RetryableActionResult<T>> => {
      if (isRunningRef.current) {
        return {
          success: false,
          error: new Error(
            '이미 요청을 처리하고 있어요.',
          ),
        };
      }

      updateRunningState(true);

      try {
        const data = await action();

        retryActionRef.current = null;

        return {
          success: true,
          data,
        };
      } catch (error) {
        onError?.(error);

        if (
          enableRetry &&
          isCommonRetryableApiError(error)
        ) {
          retryActionRef.current = async () => {
            if (
              !isMountedRef.current ||
              isRunningRef.current
            ) {
              return;
            }

            updateRunningState(true);

            try {
              await action();
              retryActionRef.current = null;
            } catch (retryError) {
              onError?.(retryError);
              throw retryError;
            } finally {
              updateRunningState(false);
            }
          };

          showGlobalErrorToast({
            message:
              error instanceof Error
                ? error.message
                : TEMPORARY_ERROR_MESSAGE,
            retry: async () => {
              const retryAction =
                retryActionRef.current;

              if (!retryAction) return;

              await retryAction();
            },
          });
        }

        return {
          success: false,
          error,
        };
      } finally {
        updateRunningState(false);
      }
    },
    [updateRunningState],
  );

  return {
    isRunning,
    run,
  };
}