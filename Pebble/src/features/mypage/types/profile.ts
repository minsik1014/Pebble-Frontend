export type Profile = {
  email: string;
  nickname: string;
  bio: string;
};

export type EditableProfile = Pick<Profile, "nickname" | "bio">;
