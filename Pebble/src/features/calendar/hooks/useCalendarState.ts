import { useCallback, useEffect, useMemo, useState } from "react";

import type { Category, MilestoneItem, TaskItem } from "@/types";
import type { CalendarStateModel } from "@/features/calendar/types";
import { useCalendarCategoryActions } from "@/features/calendar/hooks/useCalendarCategoryActions";
import { useCalendarScheduleActions } from "@/features/calendar/hooks/useCalendarScheduleActions";
import { getCategories } from "@/features/category/api/categoryApi";
import { getMilestones } from "@/features/milestone/api/milestoneApi";
import { getStandaloneTasks } from "@/features/task/api/taskApi";
import { getAccessToken } from "@/services/api";

export type {
  CalendarState,
  CalendarActions,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

type UseCalendarStateParams = {
  currentYear: number;
  currentMonth: number;
};

const formatBaseDate = (year: number, month: number) =>
  `${year}-${String(month).padStart(2, "0")}-01`;

const attachTasksToCategories = (
  categories: Category[],
  tasks: TaskItem[],
) => {
  const categoryMap = new Map<string, Category>(
    categories.map((category) => [
      category.id,
      {
        ...category,
        items: category.items.map(
          (item): MilestoneItem => ({ ...item, tasks: item.tasks ?? [] }),
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

    const category = categoryMap.get(task.categoryId);

    if (!category) {
      standaloneTasks.push(task);
      return;
    }

    if (!task.milestoneId) {
      category.tasks = [...(category.tasks ?? []), task];
      return;
    }

    category.items = category.items.map((milestone): MilestoneItem =>
      milestone.id === task.milestoneId
        ? { ...milestone, tasks: [...(milestone.tasks ?? []), task] }
        : milestone,
    );
  });

  return {
    categories: [...categoryMap.values()],
    standaloneTasks,
  };
};

export const useCalendarState = ({
  currentYear,
  currentMonth,
}: UseCalendarStateParams): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [calendarErrorMessage, setCalendarErrorMessage] = useState<
    string | null
  >(null);

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const loadCalendarData = useCallback(
    async (canUpdate: () => boolean = () => true) => {
      if (!getAccessToken()) {
        if (canUpdate()) {
          setCategories([]);
          setStandaloneTasks([]);
          setCalendarErrorMessage(null);
          setIsCalendarLoading(false);
        }
        return;
      }

      if (canUpdate()) {
        setCalendarErrorMessage(null);
        setIsCalendarLoading(true);
      }

      try {
        const [loadedCategories, loadedTasks] = await Promise.all([
          getCategories(),
          getStandaloneTasks(formatBaseDate(currentYear, currentMonth)),
        ]);
        const categoriesWithMilestones = await Promise.all(
          loadedCategories.map(async (category) => ({
            ...category,
            items: await getMilestones(category.id),
            tasks: [],
          })),
        );
        const nextCalendarState = attachTasksToCategories(
          categoriesWithMilestones,
          loadedTasks,
        );

        if (canUpdate()) {
          setCategories(nextCalendarState.categories);
          setStandaloneTasks(nextCalendarState.standaloneTasks);
        }
      } catch (error) {
        if (canUpdate()) {
          setCalendarErrorMessage(
            error instanceof Error
              ? error.message
              : "캘린더 정보를 불러오지 못했어요.",
          );
        }
      } finally {
        if (canUpdate()) {
          setIsCalendarLoading(false);
        }
      }
    },
    [currentMonth, currentYear],
  );

  useEffect(() => {
    let isActive = true;

    void loadCalendarData(() => isActive);

    return () => {
      isActive = false;
    };
  }, [loadCalendarData]);

  const categoryActions = useCalendarCategoryActions({
    setCategories,
    setSelectedCategoryId,
  });
  const scheduleActions = useCalendarScheduleActions({
    categories,
    reloadCalendarData: () => loadCalendarData(),
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
    reloadCalendarData: () => loadCalendarData(),
    ...categoryActions,
    ...scheduleActions,
  };
};
