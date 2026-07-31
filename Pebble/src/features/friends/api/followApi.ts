import { apiClient, apiRequest, type ApiResponse } from "@/services/api";

export type FollowStatus = "NONE" | "PENDING" | "ACCEPTED";
export type FollowListType = "friends" | "pending" | "sent";

export type FollowUser = {
  userId: number;
  nickname: string;
  uniqueTag: string;
  profileImageUrl: string | null;
};

export type SearchedUser = FollowUser & {
  followStatus: FollowStatus;
};

export type FollowListItem = FollowUser & {
  followId: number;
  hasTodaySchedule: boolean;
};

export type PageInfo = {
  offset: number;
  limit: number;
  total: number;
};

type PagedApiResponse<T> = ApiResponse<T[]> & {
  page: PageInfo;
};

type FollowMutationResponse = {
  followId: number;
  status: "PENDING" | "ACCEPTED";
};

export async function searchUsers(
  keyword: string,
  signal?: AbortSignal,
): Promise<{ users: SearchedUser[]; page: PageInfo }> {
  const response = await apiClient.get<PagedApiResponse<SearchedUser>>(
    "/users/search",
    {
      params: { keyword, offset: 0, limit: 50 },
      signal,
    },
  );

  return {
    users: response.data.data ?? [],
    page: response.data.page,
  };
}

export async function getFollows(
  type: FollowListType,
): Promise<{ follows: FollowListItem[]; page: PageInfo }> {
  const response = await apiClient.get<PagedApiResponse<FollowListItem>>(
    "/follows",
    {
      params: { type, offset: 0, limit: 50 },
    },
  );

  return {
    follows: response.data.data ?? [],
    page: response.data.page,
  };
}

export async function sendFollowRequest(
  targetUserId: number,
): Promise<FollowMutationResponse | null> {
  return apiRequest<FollowMutationResponse>({
    method: "POST",
    url: "/follows",
    data: { targetUserId },
  });
}

export async function acceptFollowRequest(
  followId: number,
): Promise<FollowMutationResponse | null> {
  return apiRequest<FollowMutationResponse>({
    method: "POST",
    url: `/follows/${followId}/accept`,
  });
}

export async function deleteFollow(followId: number): Promise<void> {
  await apiRequest({
    method: "DELETE",
    url: `/follows/${followId}`,
  });
}
