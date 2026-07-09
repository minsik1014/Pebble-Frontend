import type { Alarm } from "../types/alarm";

export const mockAlarms: Alarm[] = [
  {
    id: 1,
    type: "FOLLOW_REQUEST",
    content: "짱구님이 팔로우를 요청했어요",
    isRead: false,
    createdAt: "방금",
    user: {
      id: 101,
      nickname: "짱구",
      profileImageUrl: null,
    },
  },
  {
    id: 2,
    type: "FOLLOW_ACCEPT",
    content: "돼병님이 팔로우를 수락했어요",
    isRead: true,
    createdAt: "5시간 전",
    user: {
      id: 102,
      nickname: "돼병",
      profileImageUrl: null,
    },
  },
  {
    id: 3,
    type: "TASK",
    content: "오늘 1개의 일정이 있어요",
    isRead: true,
    createdAt: "5일 전",
  },
  {
    id: 4,
    type: "REPORT",
    content: "6월 월말 리포트가 도착했어요!",
    isRead: true,
    createdAt: "5일 전",
  },
  {
    id: 5,
    type: "TASK",
    content: "오늘 2개의 일정이 있어요",
    isRead: true,
    createdAt: "7일 전",
  },
  {
    id: 6,
    type: "FOLLOW_ACCEPT",
    content: "산테님의 팔로우 요청을 수락했어요",
    isRead: true,
    createdAt: "7일 전",
    user: {
      id: 103,
      nickname: "산테",
      profileImageUrl: null,
    },
  },
];