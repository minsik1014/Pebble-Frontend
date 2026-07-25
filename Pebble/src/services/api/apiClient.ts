import axios from "axios";
import type { AxiosError, AxiosRequestConfig } from "axios";
import { getAccessToken } from "./authToken";
import {
  ApiRequestError,
  isApiErrorResponse,
  type ApiRequestConfig,
  type ApiResponse,
} from "./types";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

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
  (error: AxiosError) => {
    const status = error.response?.status;
    const responseData = error.response?.data;

    if (isApiErrorResponse(responseData)) {
      throw new ApiRequestError({
        message: responseData.message,
        status,
        code: responseData.error.code,
        response: responseData,
      });
    }

    throw new ApiRequestError({
      message: error.message || "API 요청에 실패했어요.",
      status,
    });
  },
);

export async function apiRequest<TData>(
  config: AxiosRequestConfig & ApiRequestConfig,
): Promise<TData | null> {
  const response = await apiClient.request<ApiResponse<TData>>(config);
  return response.data.data ?? null;
}
