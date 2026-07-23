export type Friend = {
  id: number;
  nickname: string;
  email: string;
  bio: string;
  imageUrl: string;
};

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type FriendRequest = {
  id: number;
  user: Friend;
  status: FriendRequestStatus;
};

export type FriendRequestAction = "ACCEPT" | "REJECT";
