import { apiRequest } from "@/services/api";
import type { Friend } from "@/features/category/types";

type FollowUserResponse = {
  id?: number;
  nickname?: string;
  name?: string;
  profileImageUrl?: string | null;
};

type FollowResponse = {
  id: number;
  followerId?: number;
  followingId?: number;
  status?: "PENDING" | "ACCEPTED";
  follower?: FollowUserResponse;
  following?: FollowUserResponse;
  user?: FollowUserResponse;
  nickname?: string;
  name?: string;
  profileImageUrl?: string | null;
};

type GetFollowsResponse = {
  follows: FollowResponse[];
};

function mapFollowToFriend(follow: FollowResponse): Friend | null {
  const user = follow.following ?? follow.user ?? follow.follower;
  const id = user?.id ?? follow.followingId ?? follow.id;
  const name = user?.nickname ?? user?.name ?? follow.nickname ?? follow.name;

  if (!id || !name) {
    return null;
  }

  return {
    id,
    name,
    profileImageUrl: user?.profileImageUrl ?? follow.profileImageUrl ?? null,
  };
}

export async function getFollowingFriends(): Promise<Friend[]> {
  const data = await apiRequest<GetFollowsResponse>({
    method: "GET",
    url: "/follows",
    params: {
      type: "following",
    },
  });

  return (
    data?.follows
      .filter((follow) => !follow.status || follow.status === "ACCEPTED")
      .map(mapFollowToFriend)
      .filter((friend): friend is Friend => Boolean(friend)) ?? []
  );
}
