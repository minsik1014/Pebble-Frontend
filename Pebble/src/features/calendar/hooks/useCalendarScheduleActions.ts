import { useCallback } from "react";
import type { Dispatch, SetStateAction } from "react";

import { notifyActivityLogsChanged } from "@/features/activity";
import type { Category, TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  createMilestone as createMilestoneApi,
  deleteMilestone as deleteMilestoneApi,
  toggleMilestoneComplete as toggleMilestoneCompleteApi,
  updateMilestone as updateMilestoneApi,
} from "@/features/milestone/api/milestoneApi";
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
  updateMilestoneInCategory,
  updateTaskInMilestone,
} from "@/features/calendar/utils/calendarStateUtils";

type UseCalendarScheduleActionsParams = {
  categories: Category[];
  standaloneTasks: TaskItem[];
  setCategories: Dispatch<SetStateAction<Category[]>>;
  setStandaloneTasks: Dispatch<SetStateAction<TaskItem[]>>;
};

type ScheduleDateSource =
  | Pick<TaskItem, "start" | "end" | "dates">
  | CreateScheduleItemInput;

const getScheduleDateType = (input: CreateScheduleItemInput) => {
  if (input.dates && input.dates.length > 0) {
    return "MULTIPLE";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

const getScheduleAffectedDates = (schedule?: ScheduleDateSource | null) => {
  if (!schedule) return undefined;

  if (schedule.dates && schedule.dates.length > 0) {
    return schedule.dates;
  }

  /*
   * 기간 일정은 중간 날짜까지 모두 포함될 수 있으므로
   * 특정 날짜 배열로 제한하지 않고 전체 최근 7일을 재조회합니다.
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

export const useCalendarScheduleActions = ({
  categories,
  standaloneTasks,
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
      const previousTask = findCategoryTask(categories, categoryId, taskId);

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

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [categories, setCategories],
  );

  const deleteCategoryTask = useCallback(
    async (categoryId: string, taskId: string) => {
      const previousTask = findCategoryTask(categories, categoryId, taskId);

      await deleteTaskApi({ taskId });

      setCategories((previousCategories) =>
        removeCategoryTaskFromList(previousCategories, categoryId, taskId),
      );

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(previousTask),
      });
    },
    [categories, setCategories],
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
      const previousTask =
        standaloneTasks.find((task) => task.id === taskId) ?? null;

      const task =
        (await updateTaskApi({
          taskId,
          input,
          isChildTask: false,
        })) ?? createTaskEntity({ ...input, id: taskId });

      setStandaloneTasks((previousTasks) =>
        replaceStandaloneTaskInList(previousTasks, taskId, task),
      );

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [standaloneTasks, setStandaloneTasks],
  );

  const deleteStandaloneTask = useCallback(
    async (taskId: string) => {
      const previousTask =
        standaloneTasks.find((task) => task.id === taskId) ?? null;

      await deleteTaskApi({ taskId });

      setStandaloneTasks((previousTasks) =>
        previousTasks.filter((task) => task.id !== taskId),
      );

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(previousTask),
      });
    },
    [standaloneTasks, setStandaloneTasks],
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
      const previousTask = findMilestoneTask(
        categories,
        categoryId,
        milestoneId,
        taskId,
      );

      await deleteTaskApi({ taskId });

      setCategories((previousCategories) =>
        removeTaskFromMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );

      notifyActivityLogsChanged({
        reason: "taskDeleted",
        affectedDates: getScheduleAffectedDates(previousTask),
      });
    },
    [categories, setCategories],
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

      notifyActivityLogsChanged({
        reason: "taskUpdated",
        affectedDates: mergeAffectedDates(previousTask, input),
      });
    },
    [categories, setCategories],
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
    async (categoryId: string, taskId: string) => {
      const previousTask = findCategoryTask(categories, categoryId, taskId);
      const nextIsCompleted = !previousTask?.isCompleted;

      setCategories((previousCategories) =>
        toggleCategoryTaskCompletedInList(previousCategories, categoryId, taskId),
      );

      try {
        await toggleTaskCompleteApi(taskId);

        notifyActivityLogsChanged({
          reason: nextIsCompleted ? "taskCompleted" : "taskUncompleted",
          affectedDates: getScheduleAffectedDates(previousTask),
        });
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
    [categories, setCategories],
  );

  const toggleTaskCompleted = useCallback(
    async (categoryId: string, milestoneId: string, taskId: string) => {
      const previousTask = findMilestoneTask(
        categories,
        categoryId,
        milestoneId,
        taskId,
      );
      const nextIsCompleted = !previousTask?.isCompleted;

      setCategories((previousCategories) =>
        toggleTaskCompletedInMilestone(
          previousCategories,
          categoryId,
          milestoneId,
          taskId,
        ),
      );

      try {
        await toggleTaskCompleteApi(taskId);

        notifyActivityLogsChanged({
          reason: nextIsCompleted ? "taskCompleted" : "taskUncompleted",
          affectedDates: getScheduleAffectedDates(previousTask),
        });
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
    [categories, setCategories],
  );

  const toggleStandaloneTaskCompleted = useCallback(
    async (taskId: string) => {
      const previousTask =
        standaloneTasks.find((task) => task.id === taskId) ?? null;
      const nextIsCompleted = !previousTask?.isCompleted;

      setStandaloneTasks((previousTasks) =>
        toggleStandaloneTaskCompletedInList(previousTasks, taskId),
      );

      try {
        await toggleTaskCompleteApi(taskId);

        notifyActivityLogsChanged({
          reason: nextIsCompleted ? "taskCompleted" : "taskUncompleted",
          affectedDates: getScheduleAffectedDates(previousTask),
        });
      } catch (error) {
        setStandaloneTasks((previousTasks) =>
          toggleStandaloneTaskCompletedInList(previousTasks, taskId),
        );
        throw error;
      }
    },
    [standaloneTasks, setStandaloneTasks],
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