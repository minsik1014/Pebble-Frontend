import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category, TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  createMilestone as createMilestoneApi,
  deleteMilestone as deleteMilestoneApi,
  toggleMilestoneComplete as toggleMilestoneCompleteApi,
  updateMilestone as updateMilestoneApi,
} from "@/features/milestone/api/milestoneApi";
import type { MilestoneDeleteScope } from "@/features/milestone/api/milestoneApi.types";
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
  toggleTaskComplete as toggleTaskCompleteApi,
  updateTask as updateTaskApi,
} from "@/features/task/api/taskApi";
import {
  appendMilestoneToCategory,
  appendMilestonesToCategory,
  appendTaskToCategory,
  appendTaskToMilestone,
  createMilestoneEntity,
  createTaskEntity,
  removeCategoryTaskFromList,
  removeMilestoneFromCategory,
  removeTaskFromMilestone,
  replaceStandaloneTaskInList,
  toggleCategoryTaskCompletedInList,
  toggleMilestoneCompletedInCategory,
  toggleStandaloneTaskCompletedInList,
  toggleTaskCompletedInMilestone,
  updateCategoryTaskInList,
  updateTaskInMilestone,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

const getMilestoneDeleteScope = (
  dateType?: string,
): MilestoneDeleteScope | undefined =>
  dateType === "MULTIPLE" ? "ALL" : undefined;

export const useCalendarScheduleActions = ({
  categories,
  reloadCalendarData,
  setCategories,
  setStandaloneTasks,
}: UseCalendarScheduleActionsParams) => {
  const createMilestone = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const milestones = await createMilestoneApi(categoryId, input);

      setCategories((previousCategories) =>
        milestones.length > 0
          ? appendMilestonesToCategory(previousCategories, categoryId, milestones)
          : appendMilestoneToCategory(
              previousCategories,
              categoryId,
              createMilestoneEntity(input),
            ),
      );

      return milestones;
    },
    [setCategories],
  );

  const updateMilestone = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      await updateMilestoneApi(milestoneId, categoryId, input);
      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const createTask = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task =
        (await createTaskApi({ categoryId, milestoneId, input })) ??
        createTaskEntity({ ...input, categoryId, milestoneId });

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
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const task =
        (await createTaskApi({ categoryId, input })) ??
        createTaskEntity({ ...input, categoryId });

      setCategories((previousCategories) =>
        appendTaskToCategory(previousCategories, categoryId, task),
      );

      return task;
    },
    [setCategories],
  );

  const updateCategoryTask = useCallback(
    async (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      const task = await updateTaskApi({
        taskId,
        input,
        isChildTask: true,
      });

      setCategories((previousCategories) =>
        updateCategoryTaskInList(
          previousCategories,
          categoryId,
          taskId,
          task ?? input,
        ),
      );
    },
    [setCategories],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      await deleteTaskApi({ taskId });

      setCategories((previousCategories) =>
        removeCategoryTaskFromList(previousCategories, categoryId, taskId),
      );
    },
    [setCategories],
  );

  const createStandaloneTask = useCallback(
    async (input: CreateScheduleItemInput) => {
      const task =
        (await createTaskApi({ input })) ?? createTaskEntity(input);

      setStandaloneTasks((previousTasks) => [...previousTasks, task]);

      return task;
    },
    [setStandaloneTasks],
  );

  const updateStandaloneTask = useCallback(
    async (taskId: string, input: CreateScheduleItemInput) => {
      const task =
        (await updateTaskApi({
          taskId,
          input,
          isChildTask: false,
        })) ?? createTaskEntity({ ...input, id: taskId });

      setStandaloneTasks((previousTasks) =>
        replaceStandaloneTaskInList(previousTasks, taskId, task),
      );
    },
    [setStandaloneTasks],
  );

  const deleteStandaloneTask = useCallback(
    async (taskId: string) => {
      await deleteTaskApi({ taskId });

      setStandaloneTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId),
      );
    },
    [setStandaloneTasks],
  );

  const deleteMilestone = useCallback(
    async (categoryId: string, milestoneId: string) => {
      const milestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;

      await deleteMilestoneApi(
        milestoneId,
        getMilestoneDeleteScope(milestone?.dateType),
      );

      setCategories((previousCategories) =>
        removeMilestoneFromCategory(previousCategories, categoryId, milestoneId),
      );
    },
    [categories, setCategories],
  );

  const deleteTask = useCallback(
    async (categoryId: string, milestoneId: string, taskId: string) => {
      await deleteTaskApi({ taskId });

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

  const updateTask = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      input: CreateScheduleItemInput,
    ) => {
      const task =
        (await updateTaskApi({
          taskId,
          input,
          isChildTask: true,
        })) ?? createTaskEntity({ ...input, id: taskId });

      setCategories((previousCategories) =>
        updateTaskInMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
          task,
        ),
      );
    },
    [setCategories],
  );

  const toggleMilestoneCompleted = useCallback(
    async (categoryId: string, milestoneId: string) => {
      const milestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;
      const nextIsCompleted = !milestone?.isCompleted;

      setCategories((previousCategories) =>
        toggleMilestoneCompletedInCategory(
          previousCategories,
          categoryId,
          milestoneId,
        ),
      );

      try {
        await toggleMilestoneCompleteApi(milestoneId, nextIsCompleted);
      } catch (error) {
        setCategories((previousCategories) =>
          toggleMilestoneCompletedInCategory(
            previousCategories,
            categoryId,
            milestoneId,
          ),
        );
        throw error;
      }
    },
    [categories, setCategories],
  );

  const toggleCategoryTaskCompleted = useCallback(
    async (categoryId: string, taskId: string, taskDateId?: number) => {
      setCategories((previousCategories) =>
        toggleCategoryTaskCompletedInList(previousCategories, categoryId, taskId),
      );

      try {
        await toggleTaskCompleteApi(taskId, taskDateId);
        await reloadCalendarData();
      } catch (error) {
        setCategories((previousCategories) =>
          toggleCategoryTaskCompletedInList(
            previousCategories,
            categoryId,
            taskId,
          ),
        );
        throw error;
      }
    },
    [reloadCalendarData, setCategories],
  );

  const toggleTaskCompleted = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      taskDateId?: number,
    ) => {
      setCategories((previousCategories) =>
        toggleTaskCompletedInMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );

      try {
        await toggleTaskCompleteApi(taskId, taskDateId);
        await reloadCalendarData();
      } catch (error) {
        setCategories((previousCategories) =>
          toggleTaskCompletedInMilestone(
            previousCategories,
            categoryId,
            milestoneId,
            taskId,
          ),
        );
        throw error;
      }
    },
    [reloadCalendarData, setCategories],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    async (taskId: string, taskDateId?: number) => {
      setStandaloneTasks((previousTasks) =>
        toggleStandaloneTaskCompletedInList(previousTasks, taskId),
      );

      try {
        await toggleTaskCompleteApi(taskId, taskDateId);
        await reloadCalendarData();
      } catch (error) {
        setStandaloneTasks((previousTasks) =>
          toggleStandaloneTaskCompletedInList(previousTasks, taskId),
        );
        throw error;
      }
    },
    [reloadCalendarData, setStandaloneTasks],
  );

  return {
    createMilestone,
    updateMilestone,
    createTask,
    createCategoryTask,
    updateCategoryTask,
    deleteCategoryTask,
    createStandaloneTask,
    updateStandaloneTask,
    deleteStandaloneTask,
    deleteMilestone,
    updateTask,
    deleteTask,
    toggleMilestoneCompleted,
    toggleCategoryTaskCompleted,
    toggleTaskCompleted,
    toggleStandaloneTaskCompleted,
  };
};
