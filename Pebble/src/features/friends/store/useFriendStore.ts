import { create } from "zustand";

import {
  mockFriendRequests,
  mockUsers,
} from "@/features/friends/mock/friendMock";
import type {
  Friend,
  FriendRequest,
  FriendRequestAction,
} from "@/features/friends/types/friend";

type FriendStore = {
  users: Friend[];
  requests: FriendRequest[];
  respondRequest: (requestId: number, action: FriendRequestAction) => void;
  deleteFriend: (friendId: number) => void;
  sendFriendRequest: (userId: number) => void;
};

export const useFriendStore = create<FriendStore>((set) => ({
  users: mockUsers,
  requests: mockFriendRequests,

  respondRequest: (requestId, action) =>
    set((state) => {
      const request = state.requests.find(({ id }) => id === requestId);
      

      if (!request || request.status !== "PENDING") {
        return state;
      }

      const isAccepted = action === "ACCEPT";

      return {
        requests: state.requests.map((item) =>
          item.id === requestId
            ? {
                ...item,
                status: isAccepted ? "ACCEPTED" : "REJECTED",
              }
            : item,
        ),
        users: state.users.map((user) =>
          user.id === request.userId
            ? {
                ...user,
                relationshipStatus: isAccepted ? "FRIEND" : "NONE",
              }
            : user,
        ),
      };
    }),

  deleteFriend: (friendId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === friendId
          ? { ...user, relationshipStatus: "NONE" }
          : user,
      ),
    })),

  sendFriendRequest: (userId) =>
    set((state) => ({
      users: state.users.map((user) =>
        user.id === userId && user.relationshipStatus === "NONE"
          ? { ...user, relationshipStatus: "OUTGOING" }
          : user,
      ),
    })),
}));
