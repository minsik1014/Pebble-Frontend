export type AlarmType =
  | "TASK"
  | "MILESTONE"
  | "REPORT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPT";
export type FollowRequestStatus = "PENDING" | "ACCEPTED" | "REJECTED";

export type FollowRequestAction = "ACCEPT" | "REJECT";

export interface AlarmUser {
  id: number;
  nickname: string;
  profileImageUrl: string | null;
}

export interface Alarm {
  id: number;
  type: AlarmType;
  content: string;
  isRead: boolean;
  createdAt: string;
  user?: AlarmUser;
  followStatus?: FollowRequestStatus;
}