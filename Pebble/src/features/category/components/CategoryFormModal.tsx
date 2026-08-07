import { useEffect, useState } from "react";
import { type Category } from "@/types";
import { ImageCropModal } from "@/components/ui/image-crop/ImageCropModal";
import { ModalActionBar } from "@/components/ui/ModalActionBar";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryImageUploader } from "./CategoryImageUploader";
import { CategoryMemberList } from "./CategoryMemberList";
import { CategoryMemberSelector } from "./CategoryMemberSelector";
import { CategoryShareOption } from "./CategoryShareOption";
import { CategoryStatusOptions } from "./CategoryStatusOptions";
import { CategoryThemePreview } from "./CategoryThemePreview";
import type { Friend } from "@/features/category/types";
import { getFollowingFriends } from "@/features/category/api/categoryFriendsApi";
import {
  getCategoryMembers,
  getSharedCategoryUserProfile,
  type SharedCategoryMemberResponse,
} from "@/features/category/api/sharedCategoryApi";
import { uploadImageDataUrl } from "@/features/category/api/uploadImageApi";
import { getMyProfile } from "@/features/mypage/api/profileApi";
import {
  createCategoryColorTheme,
  DEFAULT_CATEGORY_COLOR,
} from "@/utils/categoryColorTheme";
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from "@/features/calendar/types";

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  category?: Category;
  currentUserId?: number | null;
  onClose: () => void;
  onRequestDelete?: () => void;
  onLeaveCategory?: () => void | Promise<void>;
  onSubmit?: (
    input: CreateCategoryInput | UpdateCategoryInput,
  ) => void | Promise<void>;
};

const CATEGORY_IMAGE_ASPECT_RATIO = 175 / 234;

const getEditableMembers = (members: Friend[]) =>
  members.filter((member) => member.role !== "OWNER");

const normalizeImageUrl = (imageUrl: string | undefined) =>
  imageUrl ?? undefined;

const getMemberIdsKey = (members: Friend[] = []) =>
  getEditableMembers(members)
    .map((member) => member.id)
    .sort((a, b) => a - b)
    .join(",");

const buildChangedCategoryInput = ({
  category,
  categoryName,
  selectedTheme,
  imageUrl,
  isPublic,
  isCompleted,
  isShared,
  selectedMembers,
  initialMembers,
}: {
  category: Category;
  categoryName: string;
  selectedTheme: ReturnType<typeof createCategoryColorTheme>;
  imageUrl?: string;
  isPublic: boolean;
  isCompleted: boolean;
  isShared: boolean;
  selectedMembers: Friend[];
  initialMembers: Friend[];
}): UpdateCategoryInput => {
  const input: UpdateCategoryInput = {};
  const nextTitle = categoryName.trim();
  const nextImageUrl = normalizeImageUrl(imageUrl);
  const previousImageUrl = normalizeImageUrl(category.imageUrl);
  const nextMembers = isShared ? getEditableMembers(selectedMembers) : [];
  const hasMemberChanges =
    getMemberIdsKey(initialMembers) !== getMemberIdsKey(nextMembers);

  if (nextTitle !== category.title) {
    input.title = nextTitle;
  }

  if (selectedTheme.accent !== category.accent) {
    input.accent = selectedTheme.accent;
    input.themeBase = selectedTheme.themeBase;
    input.themeMid = selectedTheme.themeMid;
    input.themeLight = selectedTheme.themeLight;
    input.themeTextOnMid = selectedTheme.themeTextOnMid;
    input.themeTextOnLight = selectedTheme.themeTextOnLight;
  }

  if (nextImageUrl !== previousImageUrl) {
    input.imageUrl = nextImageUrl;
  }

  if (isPublic !== Boolean(category.isPublic ?? true)) {
    input.isPublic = isPublic;
  }

  if (isCompleted !== Boolean(category.isCompleted ?? false)) {
    input.isCompleted = isCompleted;
  }

  if (isShared !== Boolean(category.isShared ?? false)) {
    input.isShared = isShared;
  }

  if (isShared && hasMemberChanges) {
    input.isShared = true;
    input.members = nextMembers;
    input.previousMembers = initialMembers;
  }

  return input;
};

const mapProfileToFriend = (
  profile: {
    id: number;
    nickname: string;
    uniqueTag?: string;
    imageUrl?: string | null;
    profileImageUrl?: string | null;
  },
  role?: Friend["role"],
): Friend => ({
  id: profile.id,
  name: profile.nickname,
  role,
  uniqueTag: profile.uniqueTag,
  profileImageUrl: profile.profileImageUrl ?? profile.imageUrl ?? null,
});

export const CategoryFormModal = ({ 
  isOpen, 
  mode = "create", 
  category,
  currentUserId,
  onClose,
  onRequestDelete,
  onLeaveCategory,
  onSubmit,
}: CategoryFormModalProps) => {
  const [selectedColor, setSelectedColor] = useState<string>(DEFAULT_CATEGORY_COLOR);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(category?.title || "");
  const [imageUrl, setImageUrl] = useState<string | undefined>(category?.imageUrl);
  const [cropSourceImageFile, setCropSourceImageFile] = useState<File | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [selectedMembers, setSelectedMembers] = useState<Friend[]>([]);
  const [initialMembers, setInitialMembers] = useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLoadedFriends, setHasLoadedFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTheme = createCategoryColorTheme(selectedColor);

  const filteredFriends = friends.filter(
    (friend) =>
      [friend.name, friend.uniqueTag, friend.email]
        .filter(Boolean)
        .some((value) => value?.includes(searchQuery)) &&
      !selectedMembers.some((member) => member.id === friend.id),
  );
  const shouldShowMemberList = mode === "edit" && selectedMembers.length > 0;
  const canToggleShared = !(mode === "edit" && category?.isShared && isShared);
  const canDeleteCategory = Boolean(onRequestDelete);
  const changedCategoryInput =
    mode === "edit" && category
      ? buildChangedCategoryInput({
          category,
          categoryName,
          selectedTheme,
          imageUrl,
          isPublic,
          isCompleted,
          isShared,
          selectedMembers,
          initialMembers,
        })
      : null;
  const submitDisabledReason = !categoryName.trim()
    ? "제목을 입력해 주세요"
    : mode === "edit" &&
        category &&
        changedCategoryInput &&
        Object.keys(changedCategoryInput).length === 0
      ? "변경사항을 입력해 주세요"
      : undefined;

  const toggleMember = (member: Friend) => {
    setSelectedMembers((prev) => {
      if (prev.some((m) => m.id === member.id)) {
        return prev.filter((m) => m.id !== member.id);
      } else {
        setSearchQuery("");
        return [...prev, member];
      }
    });
  };

  useEffect(() => {
    if (mode === "edit" && category) {
      setCategoryName(category.title);
      setSelectedColor(category.accent);
      setImageUrl(category.imageUrl);
      setIsPublic(category.isPublic ?? true);
      setIsCompleted(category.isCompleted ?? false);
      setIsShared(category.isShared ?? false);
      const displayMembers = category.members ?? [];

      setSelectedMembers(displayMembers);
      setInitialMembers(displayMembers);
      setSearchQuery("");
      setIsDropdownOpen(false);
      setHasLoadedFriends(false);
    } else {
      setCategoryName("");
      setImageUrl(undefined);
      setSelectedColor(DEFAULT_CATEGORY_COLOR);
      setIsPublic(false);
      setIsCompleted(false);
      setIsShared(false);
      setSelectedMembers([]);
      setInitialMembers([]);
      setSearchQuery("");
      setIsDropdownOpen(false);
      setHasLoadedFriends(false);
    }
  }, [mode, category, isOpen]);

  useEffect(() => {
    if (!isOpen || !isShared) {
      setFriends([]);
      setHasLoadedFriends(false);
      return;
    }
  }, [isOpen, isShared]);

  useEffect(() => {
    if (!isOpen || mode !== "edit" || !isShared || !category?.id) {
      return;
    }

    let isActive = true;

    const loadCategoryMembers = async () => {
      try {
        const [loadedFriends, sharedMembers, myProfile] = await Promise.all([
          getFollowingFriends(),
          getCategoryMembers(category.id),
          getMyProfile().catch(() => null),
        ]);
        const friendMap = new Map(
          loadedFriends.map((friend) => [friend.id, friend]),
        );
        const categoryMemberMap = new Map(
          (category.members ?? []).map((member) => [member.id, member]),
        );
        const resolveMember = async (
          member: SharedCategoryMemberResponse,
        ): Promise<Friend> => {
          const friend = friendMap.get(member.userId);
          const categoryMember = categoryMemberMap.get(member.userId);

          if (friend) {
            return { ...friend, role: member.role };
          }

          if (categoryMember?.name) {
            return { ...categoryMember, role: member.role };
          }

          if (myProfile?.id === member.userId) {
            return mapProfileToFriend(myProfile, member.role);
          }

          const userProfile = await getSharedCategoryUserProfile(
            member.userId,
          ).catch(() => null);

          if (userProfile) {
            return { ...userProfile, role: member.role };
          }

          return {
            id: member.userId,
            name: `사용자 ${member.userId}`,
            role: member.role,
          };
        };
        const loadedMembers = await Promise.all(
          sharedMembers
          .filter((member) => member.status === "ACCEPTED")
          .map(resolveMember),
        );

        if (!isActive) {
          return;
        }

        setFriends(loadedFriends);
        setHasLoadedFriends(true);

        setSelectedMembers(loadedMembers);
        setInitialMembers(loadedMembers);
      } catch (error) {
        console.error("Failed to load category members:", error);
      }
    };

    void loadCategoryMembers();

    return () => {
      isActive = false;
    };
  }, [category?.id, category?.members, isOpen, isShared, mode]);

  const loadFriends = async () => {
    if (hasLoadedFriends) {
      return;
    }

    try {
      const loadedFriends = await getFollowingFriends();
      setFriends(loadedFriends);
      setHasLoadedFriends(true);
    } catch (error) {
      console.error("Failed to load category friends:", error);
      setFriends([]);
      setHasLoadedFriends(true);
    }
  };

  const handleMemberDropdownOpenChange = (isOpen: boolean) => {
    setIsDropdownOpen(isOpen);

    if (isOpen) {
      void loadFriends();
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!categoryName.trim()) {
      return;
    }

    try {
      setIsSubmitting(true);
      const uploadedImageUrl =
        imageUrl?.startsWith("data:")
          ? await uploadImageDataUrl(imageUrl)
          : imageUrl;

      if (mode === "edit" && category) {
        const changedInput =
          uploadedImageUrl === imageUrl && changedCategoryInput
            ? changedCategoryInput
            : buildChangedCategoryInput({
                category,
                categoryName,
                selectedTheme,
                imageUrl: uploadedImageUrl,
                isPublic,
                isCompleted,
                isShared,
                selectedMembers,
                initialMembers,
              });

        if (Object.keys(changedInput).length > 0) {
          await onSubmit?.(changedInput);
        }
      } else {
        await onSubmit?.({
          title: categoryName.trim(),
          accent: selectedTheme.accent,
          themeBase: selectedTheme.themeBase,
          themeMid: selectedTheme.themeMid,
          themeLight: selectedTheme.themeLight,
          themeTextOnMid: selectedTheme.themeTextOnMid,
          themeTextOnLight: selectedTheme.themeTextOnLight,
          imageUrl: uploadedImageUrl ?? undefined,
          isPublic,
          isCompleted,
          isShared,
          members: isShared ? getEditableMembers(selectedMembers) : undefined,
        });
      }
      onClose();
    } catch (error) {
      console.error("Failed to submit category:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCloseCropModal = () => {
    setCropSourceImageFile(null);
  };

  const handleChangeCroppedImage = (croppedImageUrl: string) => {
    setImageUrl(croppedImageUrl);
    setCropSourceImageFile(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[rgba(44,44,44,0.3)] backdrop-blur-[4px]">
      <div className="flex w-[607px] flex-col items-center gap-5 rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m">
        <header className="flex w-full items-center justify-between">
          <h2 className="w-full text-title-02-sb text-text-strong">
            {mode === "create" ? "카테고리 추가하기" : "카테고리 편집하기"}
          </h2>
        </header>

        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full items-start gap-token-xxl">
            <CategoryImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
              onSelectImageFile={setCropSourceImageFile}
            />

            <div className="flex w-[328px] flex-col justify-center gap-5">
              <div className="flex w-full flex-col gap-2">
                <label className="text-body-01-sb text-text-primary flex items-center gap-1">
                  카테고리 이름 <span className="text-fill-danger text-body-01-sb">*</span>
                </label>
                <input
                  type="text"
                  value={categoryName}
                  onChange={(e) => setCategoryName(e.target.value)}
                  placeholder="텍스트, 특수문자, 이모티콘 가능"
                  className="w-full rounded-token-s border border-border-default bg-fill-inverse p-token-m text-body-02-m text-text-primary placeholder:text-text-quaternary focus:border-text-strong focus:outline-none"
                />
              </div>

              <CategoryColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              <CategoryThemePreview theme={selectedTheme} />
            </div>
          </div>

          <CategoryStatusOptions
            isPublic={isPublic}
            isCompleted={isCompleted}
            onTogglePublic={() => setIsPublic(!isPublic)}
            onToggleCompleted={() => setIsCompleted(!isCompleted)}
          />
        </div>

        <CategoryShareOption
          isShared={isShared}
          disabled={!canToggleShared}
          onToggleShared={() => {
            if (!canToggleShared) {
              return;
            }

            setIsShared(!isShared);
          }}
        />

        {isShared && (
          <div className="flex w-full flex-col gap-token-m">
            <div className="flex w-full flex-col gap-token-s">
              <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                친구 초대
              </h3>
              <CategoryMemberSelector
                selectedMembers={selectedMembers}
                filteredFriends={filteredFriends}
                searchQuery={searchQuery}
                isDropdownOpen={isDropdownOpen}
                showSelectedMembersInInput={mode === "create"}
                onSearchChange={setSearchQuery}
                onDropdownOpenChange={handleMemberDropdownOpenChange}
                onToggleMember={toggleMember}
              />
            </div>

            {shouldShowMemberList && (
              <div className="flex w-full flex-col gap-token-s">
                <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                  구성원
                </h3>
                <CategoryMemberList
                  members={selectedMembers}
                  currentUserId={currentUserId}
                  onRemoveMember={toggleMember}
                  onLeaveCategory={onLeaveCategory}
                />
              </div>
            )}
          </div>
        )}

        <div className="flex w-full flex-col gap-5">
          <ModalActionBar
            submitLabel={mode === "create" ? "추가" : "수정"}
            disabled={Boolean(submitDisabledReason) || isSubmitting}
            disabledReason={isSubmitting ? undefined : submitDisabledReason}
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={mode === "edit" && canDeleteCategory ? onRequestDelete : undefined}
            deleteLabel="카테고리 삭제"
          />
        </div>

        <ImageCropModal
          isOpen={Boolean(cropSourceImageFile)}
          imageUrl={null}
          imageFile={cropSourceImageFile}
          title="대표 이미지 편집"
          description="선택한 이미지를 드래그하고 확대해서 카테고리 대표 이미지 영역을 맞춰보세요."
          closeLabel="대표 이미지 편집 닫기"
          applyLabel="저장"
          changeImageLabel="이미지 다시 선택"
          aspect={CATEGORY_IMAGE_ASPECT_RATIO}
          cropShape="rect"
          onClose={handleCloseCropModal}
          onChangeImage={handleChangeCroppedImage}
        />
      </div>
    </div>
  );
};
