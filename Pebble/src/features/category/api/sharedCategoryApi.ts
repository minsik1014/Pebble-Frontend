import { apiRequest } from "@/services/api";
import type { CategoryMember } from "@/types";

export type SharedCategoryMemberResponse = {
  id: number;
  categoryId: number;
  userId: number;
  role: "OWNER" | "MEMBER";
  status: "PENDING" | "ACCEPTED";
};

type CategoryInviteTarget = {
  nickname: string;
};

const mapMemberToInviteTarget = (
  member: CategoryMember,
): CategoryInviteTarget => ({
  nickname: member.name,
});

export async function shareCategory(
  categoryId: string,
  members: CategoryMember[],
): Promise<SharedCategoryMemberResponse[] | null> {
  if (!members.length) {
    return null;
  }

  return apiRequest<SharedCategoryMemberResponse[]>({
    method: "POST",
    url: `/categories/${categoryId}/share`,
    data: {
      invites: members.map(mapMemberToInviteTarget),
    },
  });
}

export async function inviteCategoryMember(
  categoryId: string,
  member: CategoryMember,
): Promise<SharedCategoryMemberResponse | null> {
  return apiRequest<SharedCategoryMemberResponse>({
    method: "POST",
    url: `/categories/${categoryId}/members`,
    data: mapMemberToInviteTarget(member),
  });
}

export async function getCategoryMembers(
  categoryId: string,
): Promise<SharedCategoryMemberResponse[]> {
  const members = await apiRequest<SharedCategoryMemberResponse[]>({
    method: "GET",
    url: `/categories/${categoryId}/members`,
  });

  return members ?? [];
}

export async function removeCategoryMember(
  categoryId: string,
  userId: number,
): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/categories/${categoryId}/members/${userId}`,
  });
}

export async function respondCategoryInvite(
  categoryId: string,
  action: "ACCEPT" | "REJECT",
): Promise<void> {
  await apiRequest({
    method: "PATCH",
    url: `/categories/${categoryId}/members/me`,
    data: { action },
  });
}
