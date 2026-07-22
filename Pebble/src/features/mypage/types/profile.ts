export type Profile = {
  email: string;
  nickname: string;
  bio: string;
  imageUrl?: string;
};

export type EditableProfile = Partial<
  Pick<Profile, "nickname" | "bio" | "imageUrl">
>;
