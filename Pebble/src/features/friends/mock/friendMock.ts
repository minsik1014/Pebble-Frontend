import profile1 from "@/assets/profiles/profile1.png";
import profile2 from "@/assets/profiles/profile2.png";
import profile3 from "@/assets/profiles/profile3.png";
import profile4 from "@/assets/profiles/profile4.png";
import profile5 from "@/assets/profiles/profile5.png";
import type { Friend, FriendRequest } from "@/features/friends/types/friend";

export const mockFriendRequests: FriendRequest[] = [
  {
    id: 100,
    userId: 101,
    status: "PENDING",
  },
];

// 친구 관계 여부를 포함한 전체 사용자 Mock
export const mockUsers: Friend[] = [
  {
    id: 1,
    nickname: "기본",
    email: "default@pebble.com",
    bio: "",
    imageUrl: profile2,
    relationshipStatus: "FRIEND",
  },
  {
    id: 2,
    nickname: "담검이",
    email: "damgum@pebble.com",
    bio: "배고프다",
    imageUrl: profile3,
    relationshipStatus: "FRIEND",
  },
  {
    id: 3,
    nickname: "돼병",
    email: "pigbyeong@pebble.com",
    bio: "여름이 싫어요",
    imageUrl: profile4,
    relationshipStatus: "FRIEND",
  },
  {
    id: 4,
    nickname: "산테",
    email: "sante@pebble.com",
    bio: "이게 내 전투 방식이다",
    imageUrl: profile5,
    relationshipStatus: "FRIEND",
  },
  {
    id: 5,
    nickname: "조료",
    email: "joro@pebble.com",
    bio: "아무 일도 없었다",
    imageUrl: profile1,
    relationshipStatus: "FRIEND",
  },
  {
    id: 6,
    nickname: "치이",
    email: "chii@pebble.com",
    bio: "바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다 바이오가 길어지면 이렇게 보입니다",
    imageUrl: profile2,
    relationshipStatus: "FRIEND",
  },
  {
    id: 101,
    nickname: "짱구",
    email: "jjanggu@pebble.com",
    bio: "하루가 빙글빙글 돌아감",
    imageUrl: profile1,
    relationshipStatus: "INCOMING",
  },
  {
    id: 201,
    nickname: "보노보노",
    email: "bono2@pebble.com",
    bio: "조개가 좋아",
    imageUrl: profile3,
    relationshipStatus: "NONE",
  },
  {
    id: 202,
    nickname: "민수",
    email: "minsu@pebble.com",
    bio: "산책을 좋아해요",
    imageUrl: profile4,
    relationshipStatus: "NONE",
  },
  {
    id: 203,
    nickname: "페블러",
    email: "pebbler@example.com",
    bio: "새로운 목표를 시작했어요",
    imageUrl: profile1,
    relationshipStatus: "NONE",
  },
];
