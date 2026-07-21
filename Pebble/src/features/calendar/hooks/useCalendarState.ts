import { useMemo, useState } from "react";

import type { Category, TaskItem } from "@/types";
import type { CalendarStateModel } from "@/features/calendar/types";
import { useCalendarCategoryActions } from "@/features/calendar/hooks/useCalendarCategoryActions";
import { useCalendarScheduleActions } from "@/features/calendar/hooks/useCalendarScheduleActions";

export type {
  CalendarState,
  CalendarActions,
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

export const useCalendarState = (): CalendarStateModel => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [standaloneTasks, setStandaloneTasks] = useState<TaskItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

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

  return {
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    ...categoryActions,
    ...scheduleActions,
  };
};
