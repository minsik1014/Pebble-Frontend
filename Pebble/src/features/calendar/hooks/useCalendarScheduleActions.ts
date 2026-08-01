import { useCallback } from "react";

import { notifyActivityLogsChanged } from "@/features/activity";
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
import { createTaskEntity } from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  reloadCalendarData: () => Promise<void>;
  standaloneTasks: TaskItem[];
};

type ScheduleDateSource =
  | Pick<TaskItem, "start" | "end" | "dates">
  | CreateScheduleItemInput;

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

const getScheduleAffectedDates = (schedule?: ScheduleDateSource | null) => {
  if (!schedule) return undefined;

  if (schedule.dates && schedule.dates.length > 0) {
    return schedule.dates;
  }

  /*
   * 기간 일정은 중간 날짜까지 모두 포함될 수 있으므로
   * 특정 날짜 배열로 제한하지 않고 최근 7일을 재조회합니다.
   */
  if (schedule.end) {
    return undefined;
  }

  return [schedule.start];
};

const mergeAffectedDates = (
  previousSchedule?: ScheduleDateSource | null,
  nextSchedule?: ScheduleDateSource | null,
) => {
  const previousDates = getScheduleAffectedDates(previousSchedule);
  const nextDates = getScheduleAffectedDates(nextSchedule);

  if (!previousDates || !nextDates) {
    return undefined;
  }

  return Array.from(new Set([...previousDates, ...nextDates]));
};

const findCategoryTask = (
  categories: Category[],
  categoryId: string,
  taskId: string,
) =>
  categories
    .find((category) => category.id === categoryId)
    ?.tasks?.find((task) => task.id === taskId) ?? null;

const findMilestoneTask = (
  categories: Category[],
  categoryId: string,
  milestoneId: string,
  taskId: string,
) =>
  categories
    .find((category) => category.id === categoryId)
    ?.items.find((item) => item.id === milestoneId)
    ?.tasks?.find((task) => task.id === taskId) ?? null;

const findStandaloneTask = (standaloneTasks: TaskItem[], taskId: string) =>
  standaloneTasks.find((task) => task.id === taskId) ?? null;

const getTaskCompletionChange = (
  task?: TaskItem | null,
  taskDateId?: number,
) => {
  const targetTaskDate = taskDateId
    ? task?.taskDates?.find((taskDate) => taskDate.taskDateId === taskDateId)
    : null;

  const previousIsCompleted =
    targetTaskDate?.isCompleted ?? task?.isCompleted ?? false;

  const affectedDates = targetTaskDate?.date
    ? [targetTaskDate.date]
    : getScheduleAffectedDates(task);

  return {
    reason: previousIsCompleted ? "taskUncompleted" : "taskCompleted",
    affectedDates,
  } as const;
};

export const useCalendarScheduleActions = ({
  categories,
  reloadCalendarData,
  standaloneTasks,
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
      const previousTask = findCategoryTask(categories, categoryId, taskId);

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

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [categories, reloadCalendarData],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      const task = findCategoryTask(categories, categoryId, taskId);

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(task),
      });
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

      await reloadCalendarData();

      return tasks[0];
    },
    [reloadCalendarData],
  );

  const updateStandaloneTask = useCallback(
    async (taskId: string, input: CreateScheduleItemInput) => {
      const previousTask = findStandaloneTask(standaloneTasks, taskId);

      await updateTaskApi({
        taskId,
        input,
        categoryId: input.categoryId ?? null,
        milestoneId: input.milestoneId ?? null,
      });

      await reloadCalendarData();

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [reloadCalendarData, standaloneTasks],
  );

  const deleteStandaloneTask = useCallback(
    async (taskId: string) => {
      const task = findStandaloneTask(standaloneTasks, taskId);

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(task),
      });
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
      const task = findMilestoneTask(
        categories,
        categoryId,
        milestoneId,
        taskId,
      );

      await deleteTaskWithScope(taskId, task);

      await reloadCalendarData();

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(task),
      });
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
      const previousTask = findMilestoneTask(
        categories,
        categoryId,
        milestoneId,
        taskId,
      );

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

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [categories, reloadCalendarData],
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
      const task = findCategoryTask(categories, categoryId, taskId);
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);
      const changeEvent = getTaskCompletionChange(task, taskDateId);

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );

      await reloadCalendarData();

      notifyActivityLogsChanged(changeEvent);
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
      const task = findMilestoneTask(
        categories,
        categoryId,
        milestoneId,
        taskId,
      );
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);
      const changeEvent = getTaskCompletionChange(task, taskDateId);

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );

      await reloadCalendarData();

      notifyActivityLogsChanged(changeEvent);
    },
    [categories, reloadCalendarData],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    async (taskId: string, taskDateId?: number) => {
      const task = findStandaloneTask(standaloneTasks, taskId);
      const targetTaskDateIds = getTaskCompleteTargetIds(task, taskDateId);
      const changeEvent = getTaskCompletionChange(task, taskDateId);

      await Promise.all(
        targetTaskDateIds.map((targetTaskDateId) =>
          toggleTaskCompleteApi(taskId, targetTaskDateId),
        ),
      );

      await reloadCalendarData();

      notifyActivityLogsChanged(changeEvent);
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