export type ApiResponse<TData = unknown> = {
  success: true;
  message: string;
  data?: TData | null;
};

export type ApiErrorResponse = {
  success: false;
  message: string;
  error: {
    code: string;
  };
};

export type ApiResponseBody<TData = unknown> =
  | ApiResponse<TData>
  | ApiErrorResponse;

export type ApiRequestConfig = {
  skipAuth?: boolean;
};

export class ApiRequestError extends Error {
  status?: number;
  code?: string;
  response?: ApiErrorResponse;

  constructor({
    message,
    status,
    code,
    response,
  }: {
    message: string;
    status?: number;
    code?: string;
    response?: ApiErrorResponse;
  }) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
    this.response = response;
  }
}

export function isApiErrorResponse(
  value: unknown,
): value is ApiErrorResponse {
  if (!value || typeof value !== "object") {
    return false;
  }

  const response = value as Partial<ApiErrorResponse>;
  return (
    response.success === false &&
    typeof response.message === "string" &&
    typeof response.error?.code === "string"
  );
}
