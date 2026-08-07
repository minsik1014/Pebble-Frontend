import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { reportInitialNetworkFailure } from '@/components/feedback/networkRecoveryStore';
import { getCategories } from '@/features/category/api/categoryApi';
import { getCategoryMembers } from '@/features/category/api/sharedCategoryApi';
import { useCalendarCategoryActions } from '@/features/calendar/hooks/useCalendarCategoryActions';
import { useCalendarScheduleActions } from '@/features/calendar/hooks/useCalendarScheduleActions';
import type { CalendarStateModel } from '@/features/calendar/types';
import { getMonthlyMilestones } from '@/features/milestone/api/milestoneApi';
import { getMyProfile } from '@/features/mypage/api/profileApi';
import {
  getStandaloneTasks,
  getUserTasks,
} from '@/features/task/api/taskApi';
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
) => `${year}-${String(month).padStart(2, '0')}-01`;

const getSharedOwnerId = async (category: Category) => {
  if (category.userId) {
    return category.userId;
  }

  if (!category.isShared) {
    return undefined;
  }

  const members = await getCategoryMembers(category.id);

  return members.find(
    (member) => member.role === 'OWNER',
  )?.userId;
};

const withSharedOwnerIds = async (
  categories: Category[],
) =>
  Promise.all(
    categories.map(async (category) => {
      if (!category.isShared || category.userId) {
        return category;
      }

      return {
        ...category,
        userId: await getSharedOwnerId(category),
      };
    }),
  );

const getSharedCategoryIdsByOwner = (
  categories: Category[],
  currentUserId: number | null,
) => {
  const categoryIdsByOwner = new Map<
    number,
    Set<string>
  >();

  categories.forEach((category) => {
    if (
      !category.isShared ||
      !category.userId ||
      category.userId === currentUserId
    ) {
      return;
    }

    const categoryIds =
      categoryIdsByOwner.get(category.userId) ??
      new Set<string>();

    categoryIds.add(category.id);
    categoryIdsByOwner.set(
      category.userId,
      categoryIds,
    );
  });

  return categoryIdsByOwner;
};

const getAccessibleUserTasks = async (
  userId: number,
  baseDate: string,
  allowedCategoryIds: Set<string>,
) => {
  try {
    const tasks = await getUserTasks(
      userId,
      baseDate,
    );

    return tasks.filter(
      (task) =>
        task.categoryId &&
        allowedCategoryIds.has(task.categoryId),
    );
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 403 ||
        error.status === 404)
    ) {
      return [];
    }

    throw error;
  }
};

const getTaskKey = (task: TaskItem) =>
  [
    task.id,
    task.categoryId ?? 'standalone',
    task.milestoneId ?? 'none',
    task.taskDates
      ?.map(
        (taskDate) => taskDate.taskDateId,
      )
      .join(',') ??
      task.dates?.join(',') ??
      task.start,
  ].join('-');

const mergeUniqueTasks = (
  taskGroups: TaskItem[][],
) => {
  const taskMap = new Map<string, TaskItem>();

  taskGroups.flat().forEach((task) => {
    taskMap.set(getTaskKey(task), task);
  });

  return [...taskMap.values()];
};

const attachMilestonesToCategories = (
  categories: Category[],
  milestones: MilestoneItem[],
) => {
  const categoryMap = new Map<
    string,
    Category
  >(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: [],
        tasks: category.tasks ?? [],
      },
    ]),
  );

  milestones.forEach((milestone) => {
    if (!milestone.categoryId) {
      return;
    }

    const category = categoryMap.get(
      milestone.categoryId,
    );

    if (!category) {
      return;
    }

    category.items = [
      ...category.items,
      {
        ...milestone,
        tasks: [],
      },
    ];
  });

  return [...categoryMap.values()];
};

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
  const [categories, setCategories] = useState<
    Category[]
  >([]);

  const [currentUserId, setCurrentUserId] =
    useState<number | null>(null);

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
   * 최초 필수 조회가 한 번이라도 성공하면 이후 오류는
   * 전체 화면이 아닌 기존 화면의 오류 상태로 처리합니다.
   */
  const hasCompletedInitialLoadRef =
    useRef(false);

  /*
   * 네트워크 복구 화면에서 최신 캘린더 조회 함수를
   * 다시 호출하기 위해 ref로 보관합니다.
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
      canUpdate: () => boolean = () => true,
    ): Promise<boolean> => {
      if (!getAccessToken()) {
        if (canUpdate()) {
          setCurrentUserId(null);
          setCategories([]);
          setStandaloneTasks([]);
          setSelectedCategoryId(null);
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
        const baseDate = formatBaseDate(
          currentYear,
          currentMonth,
        );

        const [
          loadedCategories,
          loadedTasks,
          loadedMilestones,
          loadedProfile,
        ] = await Promise.all([
          getCategories(),
          getStandaloneTasks(baseDate),
          getMonthlyMilestones(baseDate),
          getMyProfile().catch(() => null),
        ]);

        const nextCurrentUserId =
          loadedProfile?.id ?? null;

        const categoriesWithOwners =
          await withSharedOwnerIds(
            loadedCategories,
          );

        const sharedCategoryIdsByOwner =
          getSharedCategoryIdsByOwner(
            categoriesWithOwners,
            nextCurrentUserId,
          );

        const sharedTasks = await Promise.all(
          [
            ...sharedCategoryIdsByOwner.entries(),
          ].map(([userId, categoryIds]) =>
            getAccessibleUserTasks(
              userId,
              baseDate,
              categoryIds,
            ),
          ),
        );

        const uniqueTasks = mergeUniqueTasks([
          loadedTasks,
          ...sharedTasks,
        ]);

        const categoriesWithMilestones =
          attachMilestonesToCategories(
            categoriesWithOwners,
            loadedMilestones,
          );

        const nextCalendarState =
          attachTasksToCategories(
            categoriesWithMilestones,
            uniqueTasks,
          );

        if (canUpdate()) {
          setCurrentUserId(nextCurrentUserId);
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

  useEffect(() => {
    retryCalendarLoadRef.current = () =>
      loadCalendarData();

    return () => {
      retryCalendarLoadRef.current = null;
    };
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
      categories,
      reloadCalendarData: () =>
        loadCalendarData(),
      setCategories,
      setSelectedCategoryId,
    });

  const scheduleActions =
    useCalendarScheduleActions({
      categories,
      reloadCalendarData: () =>
        loadCalendarData(),
      setCategories,
      standaloneTasks,
    });

  return {
    currentUserId,
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