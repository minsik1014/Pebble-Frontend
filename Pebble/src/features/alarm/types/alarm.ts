export type AlarmType =
  | "TASK"
  | "MILESTONE"
  | "REPORT"
  | "FOLLOW_REQUEST"
  | "FOLLOW_ACCEPT";

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
}