import { useCallback, useEffect, useMemo, useState } from 'react';

import { normalizeMonthlyReport } from '../utils/normalizeMonthlyReport';
import type { MonthlyReportResponse } from '../types/report';
import { monthlyReportMock } from '../mocks/monthlyReportMock';

interface UseMonthlyReportResult {
  report: MonthlyReportResponse;
  usedFallback: boolean;
  isLoading: boolean;
  refetch: () => void;
}

/**
 * 월말 리포트 조회.
 *
 * ────────────────────────────────────────────────────────────────
 *  ★ 프로젝트의 데이터 레이어에 맞춰 이 훅만 갈아끼우면 됩니다.
 *
 *  React Query 를 쓰신다면 아래처럼 바꾸시고, 나머지 파일은 손댈 필요 없습니다.
 *
 *    const { data, isLoading, refetch } = useQuery({
 *      queryKey: ['monthly-report', year, month],
 *      queryFn: () => api.get(`/reports/monthly?year=${year}&month=${month}`),
 *      retry: 1,
 *    });
 *    const { data: report, usedFallback } = useMemo(
 *      () => normalizeMonthlyReport(data), [data]
 *    );
 *    return { report, usedFallback, isLoading, refetch };
 *
 *  중요한 건 두 가지뿐입니다.
 *   1) 응답을 반드시 normalizeMonthlyReport 에 통과시킬 것
 *   2) 실패해도 throw 하지 말고 undefined 를 그대로 넘길 것
 *      (정규화가 현재 연월 + 0 으로 채워 화면이 깨지지 않게 합니다)
 * ────────────────────────────────────────────────────────────────
 */
export function useMonthlyReport(
  year: number,
  month: number,
): UseMonthlyReportResult {
  const [raw, setRaw] = useState<unknown>(undefined);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    // API 연동 전 로컬 화면 검수를 위해 개발 환경에서는 Figma 기준 mock을 사용합니다.
    if (import.meta.env.DEV) {
      setRaw(monthlyReportMock);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();
    setIsLoading(true);

    fetch(`/api/v1/reports/monthly?year=${year}&month=${month}`, {
      signal: controller.signal,
    })
      .then((res) => (res.ok ? res.json() : undefined))
      .then((json) => setRaw(json))
      .catch(() => {
        // 실패해도 던지지 않습니다. 정규화가 기본값으로 채우고
        // 화면에 "불러오지 못했어요" 안내가 뜹니다.
        setRaw(undefined);
      })
      .finally(() => setIsLoading(false));

    return () => controller.abort();
  }, [year, month, reloadKey]);

  const refetch = useCallback(() => setReloadKey((k) => k + 1), []);

  const { data: report, usedFallback, fallbackFields } = useMemo(
    () => normalizeMonthlyReport(raw),
    [raw],
  );

  useEffect(() => {
    if (import.meta.env.DEV && !isLoading && usedFallback) {
      console.warn('[MonthlyReport] 기본값으로 채운 필드:', fallbackFields);
    }
  }, [isLoading, usedFallback, fallbackFields]);

  return { report, usedFallback, isLoading, refetch };
}
