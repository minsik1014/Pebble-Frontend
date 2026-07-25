import type { MilestoneItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import type {
  CreateMilestoneRequest,
  MilestoneDateType,
  MilestoneResponse,
  UpdateMilestoneRequest,
} from "./milestoneApi.types";

const WEEK_DAY_CODES = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

const getDateTypeFromInput = (
  input: CreateScheduleItemInput,
): MilestoneDateType => {
  if (input.dates && input.dates.length > 1) {
    return "REPEAT";
  }

  if (input.end) {
    return "RANGE";
  }

  return "SINGLE";
};

const getRepeatDaysFromDates = (dates: string[] | undefined) => {
  if (!dates || dates.length === 0) {
    return null;
  }

  const repeatDays = dates.map((date) => {
    const day = new Date(`${date}T00:00:00`).getDay();
    return WEEK_DAY_CODES[day];
  });

  return [...new Set(repeatDays)].join(",");
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
    repeatDays: milestone.repeatDays ?? undefined,
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
    startDate: dateType === "REPEAT" ? input.dates?.[0] ?? input.start : input.start,
    endDate: dateType === "RANGE" ? input.end ?? null : null,
    repeatDays: dateType === "REPEAT" ? getRepeatDaysFromDates(input.dates) : null,
  };
}

export function mapScheduleInputToUpdateMilestoneRequest(
  input: CreateScheduleItemInput,
): UpdateMilestoneRequest {
  return {
    ...mapScheduleInputToCreateMilestoneRequest(input),
    editScope: "THIS_ONLY",
  };
}
