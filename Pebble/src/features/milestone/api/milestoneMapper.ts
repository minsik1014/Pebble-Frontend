import type { MilestoneItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type {
  CreateMilestoneRequest,
  MilestoneDateType,
  MilestoneResponse,
  UpdateMilestoneRequest,
} from "./milestoneApi.types";

const getDateTypeFromInput = (
  input: CreateScheduleItemInput,
): MilestoneDateType => {
  if (input.dates && input.dates.length > 1) {
    return "MULTIPLE";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

export function mapMilestoneResponseToMilestone(
  milestone: MilestoneResponse,
): MilestoneItem {
  return {
    id: String(milestone.id),
    title: milestone.name,
    start: milestone.startDate ?? "",
    end: milestone.endDate ?? undefined,
    itemType: "milestone",
    seriesId: milestone.seriesId ?? undefined,
    dateType: milestone.dateType,
    isCompleted: milestone.isCompleted,
    displayOrder: milestone.displayOrder,
    tasks: [],
  };
}

export function mapScheduleInputToCreateMilestoneRequest(
  input: CreateScheduleItemInput,
): CreateMilestoneRequest {
  const dateType = getDateTypeFromInput(input);

  return {
    name: input.title,
    dateType,
    startDate: dateType === "MULTIPLE" ? undefined : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    dates: dateType === "MULTIPLE" ? input.dates ?? [] : null,
  };
}

export function mapScheduleInputToUpdateMilestoneRequest(
  input: CreateScheduleItemInput,
): UpdateMilestoneRequest {
  return {
    name: input.title,
    startDate: input.dates?.[0] ?? input.start,
    endDate: input.end ?? null,
    editScope: input.dates && input.dates.length > 0 ? "THIS_ONLY" : undefined,
  };
}
