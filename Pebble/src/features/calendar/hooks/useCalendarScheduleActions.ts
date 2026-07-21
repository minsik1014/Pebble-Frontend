import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category, TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  appendMilestoneToCategory,
  appendTaskToCategory,
  appendTaskToMilestone,
  createMilestoneEntity,
  createTaskEntity,
  removeCategoryTaskFromList,
  removeMilestoneFromCategory,
  removeTaskFromMilestone,
  updateCategoryTaskInList,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

export const useCalendarScheduleActions = ({
  setCategories,
  setStandaloneTasks,
}: UseCalendarScheduleActionsParams) => {
  const createMilestone = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const milestone = createMilestoneEntity(input);

      setCategories((previousCategories) =>
        appendMilestoneToCategory(previousCategories, categoryId, milestone),
      );

      return milestone;
    },
    [setCategories],
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
    [setCategories],
  );

  const createCategoryTask = useCallback(
    (categoryId: string, input: CreateScheduleItemInput) => {
      const task = createTaskEntity(input);

      setCategories((previousCategories) =>
        appendTaskToCategory(previousCategories, categoryId, task),
      );

      return task;
    },
    [setCategories],
  );

  const updateCategoryTask = useCallback(
    (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      setCategories((previousCategories) =>
        updateCategoryTaskInList(previousCategories, categoryId, taskId, input),
      );
    },
    [setCategories],
  );

  const deleteCategoryTask = useCallback(
    (categoryId: string, taskId: string) => {
      setCategories((previousCategories) =>
        removeCategoryTaskFromList(previousCategories, categoryId, taskId),
      );
    },
    [setCategories],
  );

  const createStandaloneTask = useCallback(
    (input: CreateScheduleItemInput) => {
      const task = createTaskEntity(input);

      setStandaloneTasks((previousTasks) => [...previousTasks, task]);

      return task;
    },
    [setStandaloneTasks],
  );

  const updateStandaloneTask = useCallback(
    (taskId: string, input: CreateScheduleItemInput) => {
      const { tasks: _tasks, ...taskInput } = input;

      setStandaloneTasks((previousTasks) =>
        previousTasks.map((task) =>
          task.id === taskId
            ? {
                ...task,
                ...taskInput,
              }
            : task,
        ),
      );
    },
    [setStandaloneTasks],
  );

  const deleteStandaloneTask = useCallback(
    (taskId: string) => {
      setStandaloneTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId),
      );
    },
    [setStandaloneTasks],
  );

  const deleteMilestone = useCallback(
    (categoryId: string, milestoneId: string) => {
      setCategories((previousCategories) =>
        removeMilestoneFromCategory(previousCategories, categoryId, milestoneId),
      );
    },
    [setCategories],
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
    [setCategories],
  );

  return {
    createMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    deleteMilestone,
    deleteTask,
  };
};
