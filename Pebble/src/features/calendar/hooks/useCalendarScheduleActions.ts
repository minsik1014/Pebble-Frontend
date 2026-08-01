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
  removeMilestoneFromCategory,
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
  standaloneTasks: TaskItem[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

const getMilestoneDeleteScope = (
  dateType?: string,
): MilestoneDeleteScope | undefined =>
  dateType === "MULTIPLE" ? "ALL" : undefined;

const isMultipleTask = (task?: TaskItem | null) => {
  const hasMultipleDates =
    (task?.dates?.length ?? 0) > 1 || (task?.taskDates?.length ?? 0) > 1;

  return task?.dateType === "MULTIPLE" || hasMultipleDates;
};

const deleteTaskWithScope = async (taskId: string, task?: TaskItem | null) => {
  if (!isMultipleTask(task)) {
    await deleteTaskApi({ taskId });
    return;
  }

  const taskDateIds =
    task?.taskDates
      ?.map((taskDate) => taskDate.taskDateId)
      .filter((taskDateId): taskDateId is number => Boolean(taskDateId)) ?? [];

  if (taskDateIds.length === 0) {
    await deleteTaskApi({ taskId, deleteScope: "ALL" });
    return;
  }

  for (const taskDateId of taskDateIds) {
    await deleteTaskApi({
      taskId,
      deleteScope: "THIS_ONLY",
      taskDateId,
    });
  }
};

const getTaskCompleteTargetIds = (
  task?: TaskItem | null,
  taskDateId?: number,
) => {
  if (taskDateId) {
    return [taskDateId];
  }

  if (task?.dateType !== "MULTIPLE" || !task.taskDates?.length) {
    return [undefined];
  }

  const isEveryTaskDateCompleted = task.taskDates.every(
    (taskDate) => taskDate.isCompleted,
  );
  const targetTaskDates = isEveryTaskDateCompleted
    ? task.taskDates
    : task.taskDates.filter((taskDate) => !taskDate.isCompleted);

  return targetTaskDates.map((taskDate) => taskDate.taskDateId);
};

const splitMultipleScheduleInput = (
  input: CreateScheduleItemInput,
): CreateScheduleItemInput[] => {
  if (!input.dates?.length) {
    return [input];
  }

  return input.dates.map((date) => ({
    ...input,
    start: date,
    end: undefined,
    dates: undefined,
  }));
};

export const useCalendarScheduleActions = ({
  categories,
  reloadCalendarData,
  standaloneTasks,
  setCategories,
  setStandaloneTasks,
}: UseCalendarScheduleActionsParams) => {
  const createMilestone = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const splitInputs = splitMultipleScheduleInput(input);
      const milestones = (
        await Promise.all(
          splitInputs.map((splitInput) =>
            createMilestoneApi(categoryId, splitInput),
          ),
        )
      ).flat();

      setCategories((previousCategories) =>
        milestones.length > 0
          ? appendMilestonesToCategory(previousCategories, categoryId, milestones)
          : appendMilestoneToCategory(
              previousCategories,
              categoryId,
              createMilestoneEntity(splitInputs[0] ?? input),
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
      const splitInputs = splitMultipleScheduleInput(input);
      const tasks = await Promise.all(
        splitInputs.map(async (splitInput) =>
          (await createTaskApi({ categoryId, milestoneId, input: splitInput })) ??
          createTaskEntity({ ...splitInput, categoryId, milestoneId }),
        ),
      );

      setCategories((previousCategories) =>
        tasks.reduce(
          (nextCategories, task) =>
            appendTaskToMilestone(
              nextCategories,
              categoryId,
              milestoneId,
              task,
            ),
          previousCategories,
        ),
      );

      return tasks[0];
    },
    [setCategories],
  );

  const createCategoryTask = useCallback(
    async (categoryId: string, input: CreateScheduleItemInput) => {
      const splitInputs = splitMultipleScheduleInput(input);
      const tasks = await Promise.all(
        splitInputs.map(async (splitInput) =>
          (await createTaskApi({ categoryId, input: splitInput })) ??
          createTaskEntity({ ...splitInput, categoryId }),
        ),
      );

      setCategories((previousCategories) =>
        tasks.reduce(
          (nextCategories, task) =>
            appendTaskToCategory(nextCategories, categoryId, task),
          previousCategories,
        ),
      );

      return tasks[0];
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
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.tasks?.find((categoryTask) => categoryTask.id === taskId) ?? null;

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  const createStandaloneTask = useCallback(
    async (input: CreateScheduleItemInput) => {
      const splitInputs = splitMultipleScheduleInput(input);
      const tasks = await Promise.all(
        splitInputs.map(async (splitInput) =>
          (await createTaskApi({ input: splitInput })) ??
          createTaskEntity(splitInput),
        ),
      );

      setStandaloneTasks((previousTasks) => [...previousTasks, ...tasks]);

      return tasks[0];
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
      const task =
        standaloneTasks.find((standaloneTask) => standaloneTask.id === taskId) ??
        null;

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();
    },
    [reloadCalendarData, standaloneTasks],
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
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId)
          ?.tasks?.find((milestoneTask) => milestoneTask.id === taskId) ?? null;

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
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
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.tasks?.find((categoryTask) => categoryTask.id === taskId) ?? null;
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);

      setCategories((previousCategories) =>
        toggleCategoryTaskCompletedInList(previousCategories, categoryId, taskId),
      );

      try {
        await Promise.all(
          targetTaskDateIds.map((targetTaskDateId) =>
            toggleTaskCompleteApi(taskId, targetTaskDateId),
          ),
        );
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
    [categories, reloadCalendarData, setCategories],
  );

  const toggleTaskCompleted = useCallback(
    async (
      categoryId: string,
      milestoneId: string,
      taskId: string,
      taskDateId?: number,
    ) => {
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId)
          ?.tasks?.find((milestoneTask) => milestoneTask.id === taskId) ?? null;
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);

      setCategories((previousCategories) =>
        toggleTaskCompletedInMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );

      try {
        await Promise.all(
          targetTaskDateIds.map((targetTaskDateId) =>
            toggleTaskCompleteApi(taskId, targetTaskDateId),
          ),
        );
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
    [categories, reloadCalendarData, setCategories],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    async (taskId: string, taskDateId?: number) => {
      const task =
        standaloneTasks.find((standaloneTask) => standaloneTask.id === taskId) ??
        null;
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);

      setStandaloneTasks((previousTasks) =>
        toggleStandaloneTaskCompletedInList(previousTasks, taskId),
      );

      try {
        await Promise.all(
          targetTaskDateIds.map((targetTaskDateId) =>
            toggleTaskCompleteApi(taskId, targetTaskDateId),
          ),
        );
        await reloadCalendarData();
      } catch (error) {
        setStandaloneTasks((previousTasks) =>
          toggleStandaloneTaskCompletedInList(previousTasks, taskId),
        );
        throw error;
      }
    },
    [reloadCalendarData, setStandaloneTasks, standaloneTasks],
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
