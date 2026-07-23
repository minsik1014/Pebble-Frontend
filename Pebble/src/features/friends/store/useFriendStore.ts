import { create } from "zustand";

import {
  mockFriendRequests,
  mockFriends,
} from "@/features/friends/mock/friendMock";
import type {
  Friend,
  FriendRequest,
  FriendRequestAction,
} from "@/features/friends/types/friend";

type FriendStore = {
  friends: Friend[];
  requests: FriendRequest[];
  respondRequest: (requestId: number, action: FriendRequestAction) => void;
  deleteFriend: (friendId: number) => void;
};

export const useFriendStore = create<FriendStore>((set) => ({
  friends: mockFriends,
  requests: mockFriendRequests,

  respondRequest: (requestId, action) =>
    set((state) => {
      const request = state.requests.find(({ id }) => id === requestId);
      

      if (!request || request.status !== "PENDING") {
        return state;
      }

      const isAccepted = action === "ACCEPT";
      const alreadyFriends = state.friends.some(
        ({ id }) => id === request.user.id,
      );

      return {
        requests: state.requests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: isAccepted ? "ACCEPTED" : "REJECTED",
              }
            : item,
        ),
        friends:
          isAccepted && !alreadyFriends
            ? [request.user, ...state.friends]
            : state.friends,
      };
    }),

  deleteFriend: (friendId) =>
    set((state) => ({
      friends: state.friends.filter(({ id }) => id !== friendId),
    })),
}));
