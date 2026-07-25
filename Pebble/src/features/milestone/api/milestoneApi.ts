import { apiRequest } from "@/services/api";
import type { MilestoneItem } from "@/types";
import type { CreateScheduleItemInput } from "@/features/calendar/types";
import {
  mapMilestoneResponseToMilestone,
  mapScheduleInputToCreateMilestoneRequest,
  mapScheduleInputToUpdateMilestoneRequest,
} from "./milestoneMapper";
import type {
  CreateMilestoneResponse,
  GetMilestonesResponse,
  MilestoneDeleteScope,
  MilestoneResponse,
} from "./milestoneApi.types";

export async function getMilestones(categoryId: string): Promise<MilestoneItem[]> {
  const data = await apiRequest<GetMilestonesResponse>({
    method: "GET",
    url: `/categories/${categoryId}/milestones`,
  });

  return data?.milestones.map(mapMilestoneResponseToMilestone) ?? [];
}

export async function createMilestone(
  categoryId: string,
  input: CreateScheduleItemInput,
): Promise<MilestoneItem[]> {
  const data = await apiRequest<CreateMilestoneResponse>({
    method: "POST",
    url: `/categories/${categoryId}/milestones`,
    data: mapScheduleInputToCreateMilestoneRequest(input),
  });

  return data?.milestones.map(mapMilestoneResponseToMilestone) ?? [];
}

export async function updateMilestone(
  milestoneId: string,
  input: CreateScheduleItemInput,
): Promise<MilestoneItem | null> {
  const data = await apiRequest<MilestoneResponse>({
    method: "PATCH",
    url: `/milestones/${milestoneId}`,
    data: mapScheduleInputToUpdateMilestoneRequest(input),
  });

  return data ? mapMilestoneResponseToMilestone(data) : null;
}

export async function deleteMilestone(
  milestoneId: string,
  deleteScope?: MilestoneDeleteScope,
): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/milestones/${milestoneId}`,
    params: deleteScope ? { deleteScope } : undefined,
  });
}
