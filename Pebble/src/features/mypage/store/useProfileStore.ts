import { create } from "zustand";
import {
  getMyProfile,
  updateMyProfile,
  type UpdateMyProfileRequest,
} from "@/features/mypage/api/profileApi";
import { uploadImageDataUrl } from "@/features/category/api/uploadImageApi";
import type {
  EditableProfile,
  Profile,
} from "@/features/mypage/types/profile";

type ProfileStore = {
  profile: Profile;
  isLoaded: boolean;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  pendingImageUrl: string | null;
  loadProfile: () => Promise<void>;
  updateProfile: (profile: EditableProfile) => Promise<void>;
  setPendingProfileImage: (imageUrl: string) => void;
};

export const useProfileStore = create<ProfileStore>((set) => ({
  profile: {
    email: "",
    nickname: "",
    bio: "",
    imageUrl: null,
    lastNicknameChangedAt: null,
    nicknameChangeableAfter: null,
  },
  isLoaded: false,
  isLoading: false,
  isSaving: false,
  error: null,
  pendingImageUrl: null,
  loadProfile: async () => {
    if (useProfileStore.getState().isLoading) {
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const profile = await getMyProfile();
      set({ profile, isLoaded: true, isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필 정보를 불러오지 못했어요.",
      });
    }
  },
  setPendingProfileImage: (imageUrl) => set({ pendingImageUrl: imageUrl }),
  updateProfile: async (updatedProfile) => {
    set({ isSaving: true, error: null });

    try {
      const currentProfile = useProfileStore.getState().profile;
      const pendingImageUrl = useProfileStore.getState().pendingImageUrl;
      const changes: UpdateMyProfileRequest = {};

      if (updatedProfile.nickname !== currentProfile.nickname) {
        changes.nickname = updatedProfile.nickname;
      }

      if (updatedProfile.bio !== currentProfile.bio) {
        changes.bio = updatedProfile.bio;
      }

      if (pendingImageUrl) {
        const uploadedImageUrl = await uploadImageDataUrl(
          pendingImageUrl,
          "profile-image.jpg",
        );

        if (!uploadedImageUrl) {
          throw new Error("프로필 이미지를 업로드하지 못했어요.");
        }

        changes.profileImageUrl = uploadedImageUrl;
      }

      await updateMyProfile(changes);

      // 수정 응답을 추측하지 않고 서버가 계산한 닉네임 변경 가능 시점을 다시 받습니다.
      const profile = await getMyProfile();

      set({
        profile,
        isSaving: false,
        pendingImageUrl: null,
      });
    } catch (error) {
      set({
        isSaving: false,
        error:
          error instanceof Error
            ? error.message
            : "프로필을 저장하지 못했어요.",
      });
      throw error;
    }
  },
}));
