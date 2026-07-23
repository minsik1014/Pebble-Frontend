export type FriendRelationshipStatus =
  | "NONE"
  | "FRIEND"
  | "INCOMING"
  | "OUTGOING";

export type Friend = {
  id: number;
  nickname: string;
  email: string;
  bio: string;
  imageUrl: string;
  relationshipStatus: FriendRelationshipStatus;
};

export type FriendRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type FriendRequest = {
  id: number;
  userId: number;
  status: FriendRequestStatus;
};

export type FriendRequestAction = "ACCEPT" | "REJECT";
