import { useCallback, type Dispatch, type SetStateAction } from "react";

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
  createTaskEntity,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  setCategories: Dispatch<SetStateAction<Category[]>>;
  standaloneTasks: TaskItem[];
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

  return [];
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
  setCategories,
  standaloneTasks,
}: UseCalendarScheduleActionsParams) => {
  const markCategoryAsEmptyIfNoLoadedSchedules = useCallback(
    (categoryId: string) => {
      setCategories((previousCategories) =>
        previousCategories.map((category) => {
          const hasLoadedSchedules =
            category.items.length > 0 || (category.tasks?.length ?? 0) > 0;

          if (category.id !== categoryId || hasLoadedSchedules) {
            return category;
          }

          return {
            ...category,
            hasSchedules: false,
            milestoneCount: 0,
            taskCount: 0,
            sharedTaskCount: 0,
          };
        }),
      );
    },
    [setCategories],
  );

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

      await reloadCalendarData();

      return milestones;
    },
    [reloadCalendarData],
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

      await reloadCalendarData();

      return tasks[0];
    },
    [reloadCalendarData],
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

      await reloadCalendarData();

      return tasks[0];
    },
    [reloadCalendarData],
  );

  const updateCategoryTask = useCallback(
    async (categoryId: string, taskId: string, input: CreateScheduleItemInput) => {
      const nextCategoryId =
        "categoryId" in input ? input.categoryId ?? null : categoryId;
      const nextMilestoneId =
        "milestoneId" in input ? input.milestoneId ?? null : null;

      await updateTaskApi({
        taskId,
        input,
        categoryId: nextCategoryId,
        milestoneId: nextMilestoneId,
      });

      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      const category =
        categories.find((previousCategory) => previousCategory.id === categoryId) ??
        null;
      const task =
        category?.tasks?.find((categoryTask) => categoryTask.id === taskId) ??
        null;
      const willBeEmptyCategory =
        category !== null &&
        category.items.length === 0 &&
        (category.tasks?.filter((categoryTask) => categoryTask.id !== taskId)
          .length ?? 0) === 0;

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();
      if (willBeEmptyCategory) {
        markCategoryAsEmptyIfNoLoadedSchedules(categoryId);
      }
    },
    [categories, markCategoryAsEmptyIfNoLoadedSchedules, reloadCalendarData],
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

      await reloadCalendarData();

      return tasks[0];
    },
    [reloadCalendarData],
  );

  const updateStandaloneTask = useCallback(
    async (taskId: string, input: CreateScheduleItemInput) => {
      await updateTaskApi({
        taskId,
        input,
        categoryId: input.categoryId ?? null,
        milestoneId: input.milestoneId ?? null,
      });
      await reloadCalendarData();
    },
    [reloadCalendarData],
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

      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
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
      const nextCategoryId =
        "categoryId" in input ? input.categoryId ?? null : categoryId;
      const nextMilestoneId =
        "milestoneId" in input ? input.milestoneId ?? null : milestoneId;

      await updateTaskApi({
        taskId,
        input,
        categoryId: nextCategoryId,
        milestoneId: nextMilestoneId,
      });
      await reloadCalendarData();
    },
    [reloadCalendarData],
  );

  const toggleMilestoneCompleted = useCallback(
    async (categoryId: string, milestoneId: string) => {
      const milestone =
        categories
          .find((category) => category.id === categoryId)
          ?.items.find((item) => item.id === milestoneId) ?? null;
      const nextIsCompleted = !milestone?.isCompleted;

      await toggleMilestoneCompleteApi(milestoneId, nextIsCompleted);
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  const toggleCategoryTaskCompleted = useCallback(
    async (categoryId: string, taskId: string, taskDateId?: number) => {
      const task =
        categories
          .find((category) => category.id === categoryId)
          ?.tasks?.find((categoryTask) => categoryTask.id === taskId) ?? null;
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
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

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );
      await reloadCalendarData();
    },
    [categories, reloadCalendarData],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    async (taskId: string, taskDateId?: number) => {
      const task =
        standaloneTasks.find((standaloneTask) => standaloneTask.id === taskId) ??
        null;
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );
      await reloadCalendarData();
    },
    [reloadCalendarData, standaloneTasks],
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
