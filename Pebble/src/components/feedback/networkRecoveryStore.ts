import { closeGlobalErrorToast } from './globalErrorToastStore';

export type NetworkRecoveryState = {
  open: boolean;
  isOnline: boolean;
  isRetrying: boolean;
};

type NetworkRecoveryListener = (
  state: NetworkRecoveryState,
) => void;

type NetworkRetryAction = () => Promise<void>;

const listeners =
  new Set<NetworkRecoveryListener>();

let retryAction: NetworkRetryAction | null = null;

let state: NetworkRecoveryState = {
  open: false,
  isOnline: true,
  isRetrying: false,
};

function emit() {
  listeners.forEach((listener) =>
    listener(state),
  );
}

function getBrowserOnlineState() {
  if (typeof navigator === 'undefined') {
    return true;
  }

  return navigator.onLine;
}

export function subscribeNetworkRecovery(
  listener: NetworkRecoveryListener,
) {
  listeners.add(listener);
  listener(state);

  return () => {
    listeners.delete(listener);
  };
}

export function initializeNetworkRecovery() {
  const isOnline = getBrowserOnlineState();

  state = {
    ...state,
    isOnline,
    open: !isOnline,
    isRetrying: false,
  };

  if (!isOnline) {
    closeGlobalErrorToast();
  }

  emit();
}

export function setBrowserNetworkState(
  isOnline: boolean,
) {
  state = {
    ...state,
    isOnline,
  };

  emit();
}

export function reportInitialNetworkFailure(
  nextRetryAction: NetworkRetryAction,
) {
  retryAction = nextRetryAction;

  closeGlobalErrorToast();

  state = {
    open: true,
    isOnline: getBrowserOnlineState(),
    isRetrying: false,
  };

  emit();
}

export function isNetworkErrorScreenOpen() {
  return state.open;
}

export async function retryInitialNetworkRequest() {
  if (state.isRetrying) return;

  const isOnline = getBrowserOnlineState();

  if (!isOnline) {
    state = {
      ...state,
      isOnline: false,
      open: true,
      isRetrying: false,
    };

    emit();
    return;
  }

  /*
   * 앱이 처음부터 오프라인이어서 초기 요청이 아직
   * 등록되지 않았다면 페이지를 다시 시작합니다.
   */
  if (!retryAction) {
    window.location.reload();
    return;
  }

  state = {
    ...state,
    isOnline: true,
    isRetrying: true,
  };

  emit();

  try {
    await retryAction();

    retryAction = null;

    state = {
      open: false,
      isOnline: true,
      isRetrying: false,
    };

    emit();
  } catch {
    state = {
      open: true,
      isOnline: getBrowserOnlineState(),
      isRetrying: false,
    };

    emit();
  }
}