export type Profile = {
  email: string;
  nickname: string;
  bio: string;
  imageUrl: string | null;
  lastNicknameChangedAt: string | null;
  nicknameChangeableAfter: string | null;
};

export type EditableProfile = Pick<Profile, "nickname" | "bio">;
