import { getFollows } from "@/features/friends/api/followApi";
import type { Friend } from "@/features/category/types";

export async function getFollowingFriends(): Promise<Friend[]> {
  const { follows } = await getFollows("friends");

  return follows.map((follow) => ({
    id: follow.userId,
    name: follow.nickname,
    profileImageUrl: follow.profileImageUrl,
  }));
}
