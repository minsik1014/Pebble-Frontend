import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import type { Category, TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  createMilestone as createMilestoneApi,
  deleteMilestone as deleteMilestoneApi,
  updateMilestone as updateMilestoneApi,
} from "@/features/milestone/api/milestoneApi";
import {
  createTask as createTaskApi,
  deleteTask as deleteTaskApi,
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
  updateCategoryTaskInList,
  updateMilestoneInCategory,
  updateTaskInMilestone,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

const getScheduleDateType = (input: CreateScheduleItemInput) => {
  if (input.dates && input.dates.length > 0) {
    return "MULTIPLE";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

export const useCalendarScheduleActions = ({
  categories,
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
      const previousMilestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;
      const nextDateType = getScheduleDateType(input);

      if (
        previousMilestone?.dateType &&
        previousMilestone.dateType !== nextDateType
      ) {
        const milestones = await createMilestoneApi(categoryId, input);
        await deleteMilestoneApi(milestoneId);

        setCategories((previousCategories) =>
          appendMilestonesToCategory(
            removeMilestoneFromCategory(
              previousCategories,
              categoryId,
              milestoneId,
            ),
            categoryId,
            milestones.length > 0
              ? milestones
              : [createMilestoneEntity(input)],
          ),
        );

        return;
      }

      const milestone = await updateMilestoneApi(
        milestoneId,
        input,
        previousMilestone,
      );

      setCategories((previousCategories) =>
        updateMilestoneInCategory(
          previousCategories,
          categoryId,
          milestoneId,
          milestone ?? createMilestoneEntity({ ...input, id: milestoneId }),
        ),
      );
    },
    [categories, setCategories],
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
      await deleteMilestoneApi(milestoneId);

      setCategories((previousCategories) =>
        removeMilestoneFromCategory(previousCategories, categoryId, milestoneId),
      );
    },
    [setCategories],
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
  };
};
