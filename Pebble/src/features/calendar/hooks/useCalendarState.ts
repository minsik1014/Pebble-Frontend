import { useCallback, useMemo, useState } from "react";

import type { Category, TaskItem } from "@/types";
import type { CalendarStateModel } from "@/features/calendar/types";
import { useCalendarCategoryActions } from "@/features/calendar/hooks/useCalendarCategoryActions";
import { useCalendarScheduleActions } from "@/features/calendar/hooks/useCalendarScheduleActions";
import {
  calendarMockCategories,
  calendarMockStandaloneTasks,
} from "@/features/calendar/mocks/calendarMockData";

export type {
  CalendarState,
  CalendarActions,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

export const useCalendarState = (): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>(
    calendarMockCategories,
  );
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>(
    calendarMockStandaloneTasks,
  );
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

  const categoryActions = useCalendarCategoryActions({
    setCategories,
    setSelectedCategoryId,
  });
  const scheduleActions = useCalendarScheduleActions({
    setCategories,
    setStandaloneTasks,
  });

  const loadCalendarData = useCallback(
    async (canUpdate: () => boolean = () => true) => {
      if (canUpdate()) {
        setCalendarErrorMessage(null);
        setIsCalendarLoading(false);
      }
    },
    [],
  );

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
