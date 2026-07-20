import { useCallback, useMemo, useState } from "react";

import type { Category, ScheduleItem } from "@/types";
import type {
  CalendarStateModel,
  CreateCategoryInput,
  CreateScheduleItemInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";
import {
  appendMilestoneToCategory,
  appendTaskToCategory,
  appendTaskToMilestone,
  createCategoryEntity,
  createMilestoneEntity,
  createTaskEntity,
  removeCategoryTaskFromList,
  removeMilestoneFromCategory,
  removeTaskFromMilestone,
  replaceCategoryList,
  updateCategoryInList,
  updateCategoryTaskInList,
} from "@/features/calendar/utils/calendarStateUtils";

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
  const [standaloneTasks, setStandaloneTasks] = useState<ScheduleItem[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );

  const selectedCategory = useMemo(
    () =>
      categories.find((category) => category.id === selectedCategoryId) ?? null,
    [categories, selectedCategoryId],
  );

  const replaceCategories = useCallback((nextCategories: Category[]) => {
    setCategories(replaceCategoryList(nextCategories));
    setSelectedCategoryId(null);
  }, []);

  const selectCategory = useCallback((categoryId: string) => {
    setSelectedCategoryId(categoryId);
  }, []);

  const clearSelectedCategory = useCallback(() => {
    setSelectedCategoryId(null);
  }, []);

  const createCategory = useCallback((input: CreateCategoryInput) => {
    const category = createCategoryEntity(input);

    setCategories((previousCategories) => [...previousCategories, category]);
    setSelectedCategoryId(category.id);

    return category;
  }, []);

  const updateCategory = useCallback(
    (categoryId: string, input: UpdateCategoryInput) => {
      setCategories((previousCategories) =>
        updateCategoryInList(previousCategories, categoryId, input),
      );
    },
    [],
  );

  const createMilestone = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const milestone = createMilestoneEntity(input);

      setCategories((previousCategories) =>
        appendMilestoneToCategory(previousCategories, categoryId, milestone),
      );

      return milestone;
    },
    [],
  );

  const createTask = useCallback(
    (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task = createTaskEntity(input);

      setCategories((previousCategories) =>
        appendTaskToMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          task,
        ),
      );

      return task;
    },
    [],
  );

  const createCategoryTask = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const task = createTaskEntity(input);

      setCategories((previousCategories) =>
        appendTaskToCategory(previousCategories, categoryId, task),
      );

      return task;
    },
    [],
  );

  const updateCategoryTask = useCallback(
    (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      setCategories((previousCategories) =>
        updateCategoryTaskInList(previousCategories, categoryId, taskId, input),
      );
    },
    [],
  );

  const deleteCategoryTask = useCallback(
    (categoryId: string, taskId: string) => {
      setCategories((previousCategories) =>
        removeCategoryTaskFromList(previousCategories, categoryId, taskId),
      );
    },
    [],
  );

  const createStandaloneTask = useCallback((input: CreateScheduleItemInput) => {
    const task = createTaskEntity(input);

    setStandaloneTasks((previousTasks) => [...previousTasks, task]);

    return task;
  }, []);

  const updateStandaloneTask = useCallback(
    (taskId: string, input: CreateScheduleItemInput) => {
      setStandaloneTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...input,
              }
            : task,
        ),
      );
    },
    [],
  );

  const deleteStandaloneTask = useCallback((taskId: string) => {
    setStandaloneTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== taskId),
    );
  }, []);

  const deleteCategory = useCallback((categoryId: string) => {
    setCategories((previousCategories) =>
      previousCategories.filter((category) => category.id !== categoryId),
    );
    setSelectedCategoryId((previousSelectedCategoryId) =>
      previousSelectedCategoryId === categoryId ? null : previousSelectedCategoryId,
    );
  }, []);

  const deleteMilestone = useCallback(
    (categoryId: string, milestoneId: string) => {
      setCategories((previousCategories) =>
        removeMilestoneFromCategory(previousCategories, categoryId, milestoneId),
      );
    },
    [],
  );

  const deleteTask = useCallback(
    (categoryId: string, milestoneId: string, taskId: string) => {
      setCategories((previousCategories) =>
        removeTaskFromMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );
    },
    [],
  );

  return {
    categories,
    standaloneTasks,
    selectedCategory,
    selectedCategoryId,
    replaceCategories,
    selectCategory,
    clearSelectedCategory,
    createCategory,
    updateCategory,
    createMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    deleteCategory,
    deleteMilestone,
    deleteTask,
  };
};
