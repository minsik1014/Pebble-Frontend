import profile1 from "@/assets/profiles/profile1.png";
import profile2 from "@/assets/profiles/profile2.png";
import profile3 from "@/assets/profiles/profile3.png";
import profile4 from "@/assets/profiles/profile4.png";
import profile5 from "@/assets/profiles/profile5.png";
import type { Friend, FriendRequest } from "@/features/friends/types/friend";

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 100,
    status: "PENDING",
    user: {
      id: 101,
      nickname: "짱구",
      bio: "하루가 빙글빙글 돌아감",
      imageUrl: profile1,
    },
  },
];

export const mockFriends: Friend[] = [
  { id: 1, nickname: "기본", bio: "", imageUrl: profile2 },
  { id: 2, nickname: "담검이", bio: "배고프다", imageUrl: profile3 },
  { id: 3, nickname: "돼병", bio: "여름이 싫어요", imageUrl: profile4 },
  { id: 4, nickname: "산테", bio: "이게 내 전투 방식이다", imageUrl: profile5 },
  { id: 5, nickname: "조료", bio: "아무 일도 없었다", imageUrl: profile1 },
  {
    id: 6,
    nickname: "치이",
    bio: "바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다",
    imageUrl: profile2,
  },
];
