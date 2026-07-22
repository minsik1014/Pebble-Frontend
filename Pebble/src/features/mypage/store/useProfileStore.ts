import { create } from "zustand";
import { mockProfile } from "@/features/mypage/mock/profileMock";
import type {
  EditableProfile,
  Profile,
} from "@/features/mypage/types/profile";

type ProfileStore = {
  profile: Profile;
  pendingImageUrl: string | null;
  lastNicknameChangedAt: number | null;
  updateProfile: (profile: EditableProfile) => void;
  setPendingProfileImage: (imageUrl: string) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: mockProfile,
  pendingImageUrl: null,
  lastNicknameChangedAt: null,
  setPendingProfileImage: (imageUrl) => set({ pendingImageUrl: imageUrl }),
  updateProfile: (updatedProfile) =>
    set((state) => {
      const nicknameChanged =
        updatedProfile.nickname !== state.profile.nickname;

      return {
        profile: {
          ...state.profile,
          ...updatedProfile,
          imageUrl: state.pendingImageUrl ?? state.profile.imageUrl,
        },
        pendingImageUrl: null,
        lastNicknameChangedAt: nicknameChanged
          ? Date.now()
          : state.lastNicknameChangedAt,
      };
    }),
}));
