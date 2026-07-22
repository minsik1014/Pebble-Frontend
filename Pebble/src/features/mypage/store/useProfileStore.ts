import { create } from "zustand";
import { mockProfile } from "@/features/mypage/mock/profileMock";
import type {
  EditableProfile,
  Profile,
} from "@/features/mypage/types/profile";

type ProfileStore = {
  profile: Profile;
  lastNicknameChangedAt: number | null;
  updateProfile: (profile: EditableProfile) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: mockProfile,
  lastNicknameChangedAt: null,
  updateProfile: (updatedProfile) =>
    set((state) => {
      const nicknameChanged =
        updatedProfile.nickname !== undefined &&
        updatedProfile.nickname !== state.profile.nickname;

      return {
        profile: {
          ...state.profile,
          ...updatedProfile,
        },
        lastNicknameChangedAt: nicknameChanged
          ? Date.now()
          : state.lastNicknameChangedAt,
      };
    }),
}));
