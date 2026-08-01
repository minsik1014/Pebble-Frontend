import axios from 'axios';
import type { AxiosError, AxiosRequestConfig } from 'axios';

import { showGlobalErrorToast } from '@/components/feedback/globalErrorToastStore';

import {
  clearAuthTokens,
  getAccessToken,
  getRefreshToken,
  setAuthTokens,
} from './authToken';
import { API_TIMEOUT, TEMPORARY_ERROR_MESSAGE } from './constants';
import {
  ApiRequestError,
  isApiErrorResponse,
  type ApiRequestConfig,
  type ApiResponse,
} from './types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

type AuthTokens = {
  accessToken: string;
  refreshToken: string;
};

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken() {
  const refreshToken = getRefreshToken();

  if (!refreshToken) {
    throw new Error('저장된 리프레시 토큰이 없습니다.');
  }

  if (!refreshPromise) {
    refreshPromise = axios
      .post<ApiResponse<AuthTokens>>(
        `${API_BASE_URL}/auth/refresh`,
        {
          refreshToken,
        },
        {
          timeout: API_TIMEOUT,
        },
      )
      .then((response) => {
        const tokens = response.data.data;

        if (!tokens?.accessToken || !tokens.refreshToken) {
          throw new Error('토큰 재발급 응답이 올바르지 않습니다.');
        }

        setAuthTokens(tokens.accessToken, tokens.refreshToken);

        return tokens.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
}

function redirectToLoginAfterAuthExpired() {
  clearAuthTokens();

  if (
    typeof window !== 'undefined' &&
    window.location.pathname !== '/login'
  ) {
    window.location.assign('/login');
  }
}

function showRetryableErrorToast(
  error: ApiRequestError,
  requestConfig?: AxiosRequestConfig & ApiRequestConfig,
) {
  if (requestConfig?.skipGlobalErrorToast) {
    return;
  }

  showGlobalErrorToast({
    message: error.message,
    retry: requestConfig?.onRetry,
  });
}

apiClient.interceptors.request.use((config) => {
  const requestConfig = config as AxiosRequestConfig & ApiRequestConfig;

  if (requestConfig.skipAuth) {
    return config;
  }

  const accessToken = getAccessToken();

  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data;
    const requestConfig = error.config as
      | (AxiosRequestConfig & ApiRequestConfig)
      | undefined;

    if (
      status === 401 &&
      requestConfig &&
      !requestConfig.skipAuth &&
      !requestConfig.skipAuthRefresh &&
      !requestConfig._retry &&
      getRefreshToken()
    ) {
      requestConfig._retry = true;

      try {
        const accessToken = await refreshAccessToken();

        requestConfig.headers = {
          ...requestConfig.headers,
          Authorization: `Bearer ${accessToken}`,
        };

        return await apiClient.request(requestConfig);
      } catch {
        redirectToLoginAfterAuthExpired();
      }
    }

    const isTimeoutError =
      error.code === 'ECONNABORTED' ||
      error.code === 'ETIMEDOUT';

    const isNetworkError = !error.response;
    const isServerError =
      typeof status === 'number' && status >= 500;

    if (isTimeoutError) {
      const apiError = new ApiRequestError({
        message: TEMPORARY_ERROR_MESSAGE,
        status,
        type: 'timeout',
        retryable: true,
      });

      showRetryableErrorToast(apiError, requestConfig);

      throw apiError;
    }

    if (isNetworkError) {
      const apiError = new ApiRequestError({
        message: TEMPORARY_ERROR_MESSAGE,
        status,
        type: 'network',
        retryable: true,
      });

      showRetryableErrorToast(apiError, requestConfig);

      throw apiError;
    }

    if (isServerError) {
      const apiError = new ApiRequestError({
        message: TEMPORARY_ERROR_MESSAGE,
        status,
        type: 'server',
        retryable: true,
      });

      showRetryableErrorToast(apiError, requestConfig);

      throw apiError;
    }

    if (isApiErrorResponse(responseData)) {
      throw new ApiRequestError({
        message: responseData.message,
        status,
        code: responseData.error.code,
        response: responseData,
        type: status === 401 ? 'auth' : 'business',
        retryable: false,
      });
    }

    throw new ApiRequestError({
      message: error.message || TEMPORARY_ERROR_MESSAGE,
      status,
      type: 'unknown',
      retryable: false,
    });
  },
);

export async function apiRequest<TData>(
  config: AxiosRequestConfig & ApiRequestConfig,
): Promise<TData | null> {
  const response = await apiClient.request<ApiResponse<TData>>(config);

  return response.data.data ?? null;
}