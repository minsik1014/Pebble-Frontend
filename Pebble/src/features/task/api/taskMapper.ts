import type { TaskItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type {
  CreateTaskRequest,
  TaskDateType,
  TaskResponse,
  UpdateTaskRequest,
} from "./taskApi.types";

const getDateTypeFromInput = (input: CreateScheduleItemInput): TaskDateType => {
  if (input.dates && input.dates.length > 0) {
    return "MULTI";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

export function mapTaskResponseToTask(task: TaskResponse): TaskItem {
  const dates =
    task.taskDates?.map((taskDate) => taskDate.date) ??
    task.dates ??
    undefined;

  return {
    id: String(task.id),
    title: task.name,
    start: task.startDate ?? dates?.[0] ?? "",
    end: task.endDate ?? undefined,
    dates,
    accent: task.color ?? undefined,
    itemType: "task",
    milestoneId: task.milestoneId ? String(task.milestoneId) : undefined,
    dateType: task.dateType,
    isCompleted: task.isCompleted,
    completedAt: task.completedAt ?? undefined,
    displayOrder: task.displayOrder,
    taskDates: task.taskDates,
  };
}

export function mapScheduleInputToCreateTaskRequest({
  milestoneId,
  input,
}: {
  milestoneId?: string | null;
  input: CreateScheduleItemInput;
}): CreateTaskRequest {
  const dateType = getDateTypeFromInput(input);
  const isChildTask = Boolean(milestoneId);

  return {
    milestoneId: milestoneId ? Number(milestoneId) : null,
    name: input.title,
    dateType,
    startDate: dateType === "MULTI" ? null : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTI" ? input.dates ?? [] : null,
    color: isChildTask ? undefined : input.accent ?? "#171717",
  };
}

export function mapScheduleInputToUpdateTaskRequest({
  input,
  isChildTask,
}: {
  input: CreateScheduleItemInput;
  isChildTask: boolean;
}): UpdateTaskRequest {
  const dateType = getDateTypeFromInput(input);

  return {
    name: input.title,
    startDate: dateType === "MULTI" ? null : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTI" ? input.dates ?? [] : null,
    color: isChildTask ? undefined : input.accent ?? "#171717",
    editScope: dateType === "MULTI" ? "ALL" : undefined,
  };
}
