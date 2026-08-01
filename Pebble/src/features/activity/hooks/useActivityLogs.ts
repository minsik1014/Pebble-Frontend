import { useCallback, useEffect, useState } from 'react';

import { ApiRequestError } from '@/services/api';

import { getActivityLogs } from '../api/activityLogsApi';
import type {
  ActivityLogsErrorState,
  NormalizedActivityLogs,
} from '../types/activityLogs';
import { getSeoulBaseDate } from '../utils/activityDate';
import { normalizeActivityLogsResponse } from '../utils/normalizeActivityLogs';

interface UseActivityLogsParams {
  userId?: number | null;
  baseDate?: string;
  enabled?: boolean;
}

function getErrorType(status?: number): ActivityLogsErrorState['type'] {
  if (status === 401) return 'unauthorized';
  if (status === 403) return 'forbidden';
  if (status === 404) return 'notFound';
  if (typeof status === 'number' && status >= 500) return 'server';

  return 'unknown';
}

function normalizeError(error: unknown): ActivityLogsErrorState {
  if (error instanceof ApiRequestError) {
    return {
      message: error.message,
      status: error.status,
      code: error.code,
      type: getErrorType(error.status),
    };
  }

  if (error instanceof Error) {
    return {
      message: error.message,
      type: 'unknown',
    };
  }

  return {
    message: '징검다리 기록을 불러오지 못했어요.',
    type: 'unknown',
  };
}

export function useActivityLogs({
  userId,
  baseDate,
  enabled = true,
}: UseActivityLogsParams) {
  const [data, setData] = useState<NormalizedActivityLogs | null>(null);
  const [error, setError] = useState<ActivityLogsErrorState | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const loadActivityLogs = useCallback(async () => {
    if (!enabled || !userId) {
      setData(null);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getActivityLogs({
        userId,
        baseDate: baseDate ?? getSeoulBaseDate(),
      });

      setData(normalizeActivityLogsResponse(response));
    } catch (requestError) {
      setData(null);
      setError(normalizeError(requestError));
    } finally {
      setIsLoading(false);
    }
  }, [baseDate, enabled, userId]);

  useEffect(() => {
    void loadActivityLogs();
  }, [loadActivityLogs]);

  return {
    data,
    userId: data?.userId,
    nickname: data?.nickname,
    activityColor: data?.activityColor,
    baseDate: data?.baseDate,
    logs: data?.logs ?? [],
    palette: data?.palette,

    isLoading,
    isError: error !== null,
    error,
    errorType: error?.type,
    errorStatus: error?.status,
    errorCode: error?.code,

    refetch: loadActivityLogs,
  };
}