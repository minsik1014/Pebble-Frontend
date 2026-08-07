import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { reportInitialNetworkFailure } from '@/components/feedback/networkRecoveryStore';
import { getCategories } from '@/features/category/api/categoryApi';
import { useCalendarCategoryActions } from '@/features/calendar/hooks/useCalendarCategoryActions';
import { useCalendarScheduleActions } from '@/features/calendar/hooks/useCalendarScheduleActions';
import type { CalendarStateModel } from '@/features/calendar/types';
import { getMilestones } from '@/features/milestone/api/milestoneApi';
import { getStandaloneTasks } from '@/features/task/api/taskApi';
import {
  ApiRequestError,
  getAccessToken,
} from '@/services/api';
import type {
  Category,
  MilestoneItem,
  TaskItem,
} from '@/types';

export type {
  CalendarActions,
  CalendarState,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';

type UseCalendarStateParams = {
  currentYear: number;
  currentMonth: number;
};

const formatBaseDate = (
  year: number,
  month: number,
) =>
  `${year}-${String(month).padStart(2, '0')}-01`;

const attachTasksToCategories = (
  categories: Category[],
  tasks: TaskItem[],
) => {
  const categoryMap = new Map<
    string,
    Category
  >(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: category.items.map(
          (item): MilestoneItem => ({
            ...item,
            tasks: item.tasks ?? [],
          }),
        ),
        tasks: category.tasks ?? [],
      },
    ]),
  );

  const standaloneTasks: TaskItem[] = [];

  tasks.forEach((task) => {
    if (!task.categoryId) {
      standaloneTasks.push(task);
      return;
    }

    const category = categoryMap.get(
      task.categoryId,
    );

    if (!category) {
      standaloneTasks.push(task);
      return;
    }

    if (!task.milestoneId) {
      category.tasks = [
        ...(category.tasks ?? []),
        task,
      ];
      return;
    }

    category.items = category.items.map(
      (milestone): MilestoneItem =>
        milestone.id === task.milestoneId
          ? {
              ...milestone,
              tasks: [
                ...(milestone.tasks ?? []),
                task,
              ],
            }
          : milestone,
    );
  });

  return {
    categories: [...categoryMap.values()],
    standaloneTasks,
  };
};

function isInitialNetworkError(
  error: unknown,
) {
  return (
    error instanceof ApiRequestError &&
    (error.type === 'network' ||
      error.type === 'timeout')
  );
}

export const useCalendarState = ({
  currentYear,
  currentMonth,
}: UseCalendarStateParams): CalendarStateModel => {
  const [categories, setCategories] =
    useState<Category[]>([]);
  const [
    standaloneTasks,
    setStandaloneTasks,
  ] = useState<TaskItem[]>([]);
  const [
    selectedCategoryId,
    setSelectedCategoryId,
  ] = useState<string | null>(null);
  const [
    isCalendarLoading,
    setIsCalendarLoading,
  ] = useState(false);
  const [
    calendarErrorMessage,
    setCalendarErrorMessage,
  ] = useState<string | null>(null);

  /*
   * 한 번이라도 필수 초기 조회가 성공했다면 이후 오류는
   * 전체 화면이 아니라 기존 화면 오류/토스트로 처리합니다.
   */
  const hasCompletedInitialLoadRef =
    useRef(false);

  /*
   * 네트워크 복구 화면에서 가장 최근의 월 정보를
   * 기준으로 다시 조회할 수 있도록 사용합니다.
   */
  const retryCalendarLoadRef = useRef<
    (() => Promise<boolean>) | null
  >(null);

  const selectedCategory = useMemo(
    () =>
      categories.find(
        (category) =>
          category.id === selectedCategoryId,
      ) ?? null,
    [categories, selectedCategoryId],
  );

  const loadCalendarData = useCallback(
    async (
      canUpdate: () => boolean = () =>
        true,
    ): Promise<boolean> => {
      if (!getAccessToken()) {
        if (canUpdate()) {
          setCategories([]);
          setStandaloneTasks([]);
          setCalendarErrorMessage(null);
          setIsCalendarLoading(false);
        }

        return true;
      }

      if (canUpdate()) {
        setCalendarErrorMessage(null);
        setIsCalendarLoading(true);
      }

      try {
        const [
          loadedCategories,
          loadedTasks,
        ] = await Promise.all([
          getCategories(),
          getStandaloneTasks(
            formatBaseDate(
              currentYear,
              currentMonth,
            ),
          ),
        ]);

        const categoriesWithMilestones =
          await Promise.all(
            loadedCategories.map(
              async (category) => ({
                ...category,
                items: await getMilestones(
                  category.id,
                ),
                tasks: [],
              }),
            ),
          );

        const nextCalendarState =
          attachTasksToCategories(
            categoriesWithMilestones,
            loadedTasks,
          );

        if (canUpdate()) {
          setCategories(
            nextCalendarState.categories,
          );
          setStandaloneTasks(
            nextCalendarState.standaloneTasks,
          );
          setCalendarErrorMessage(null);
        }

        hasCompletedInitialLoadRef.current =
          true;

        return true;
      } catch (error) {
        if (canUpdate()) {
          setCalendarErrorMessage(
            error instanceof Error
              ? error.message
              : '캘린더 정보를 불러오지 못했어요.',
          );
        }

        if (
          !hasCompletedInitialLoadRef.current &&
          isInitialNetworkError(error)
        ) {
          reportInitialNetworkFailure(
            async () => {
              const retryLoad =
                retryCalendarLoadRef.current;

              if (!retryLoad) {
                throw new Error(
                  '초기 데이터를 다시 요청할 수 없어요.',
                );
              }

              const succeeded =
                await retryLoad();

              if (!succeeded) {
                throw new Error(
                  '초기 데이터를 불러오지 못했어요.',
                );
              }
            },
          );
        }

        return false;
      } finally {
        if (canUpdate()) {
          setIsCalendarLoading(false);
        }
      }
    },
    [currentMonth, currentYear],
  );

  /*
   * 네트워크 복구 요청이 오래된 월 정보를 캡처하지 않도록
   * 렌더링마다 최신 loadCalendarData를 저장합니다.
   */
  useEffect(() => {
    retryCalendarLoadRef.current = () =>
      loadCalendarData();
  }, [loadCalendarData]);

  useEffect(() => {
    let isActive = true;

    void loadCalendarData(() => isActive);

    return () => {
      isActive = false;
    };
  }, [loadCalendarData]);

  const categoryActions =
    useCalendarCategoryActions({
      setCategories,
      setSelectedCategoryId,
    });

  const scheduleActions =
    useCalendarScheduleActions({
      categories,
      setCategories,
      setStandaloneTasks,
    });

  return {
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    isCalendarLoading,
    calendarErrorMessage,

    reloadCalendarData: async () => {
      await loadCalendarData();
    },

    ...categoryActions,
    ...scheduleActions,
  };
};