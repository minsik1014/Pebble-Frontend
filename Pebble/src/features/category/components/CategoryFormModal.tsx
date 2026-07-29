import { useEffect, useState } from "react";
import { type Category } from "@/types";
import { ImageCropModal } from "@/components/ui/image-crop/ImageCropModal";
import { ModalActionBar } from "@/components/ui/ModalActionBar";
import { CategoryColorPicker } from "./CategoryColorPicker";
import { CategoryImageUploader } from "./CategoryImageUploader";
import { CategoryMemberSelector } from "./CategoryMemberSelector";
import { CategoryShareOption } from "./CategoryShareOption";
import { CategoryStatusOptions } from "./CategoryStatusOptions";
import { CategoryThemePreview } from "./CategoryThemePreview";
import type { Friend } from "@/features/category/types";
import { getFollowingFriends } from "@/features/category/api/categoryFriendsApi";
import { uploadImageDataUrl } from "@/features/category/api/uploadImageApi";
import {
  createCategoryColorTheme,
  DEFAULT_CATEGORY_COLOR,
} from "@/utils/categoryColorTheme";
import type { CreateCategoryInput } from "@/features/calendar/types";

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: "create" | "edit";
  category?: Category;
  onClose: () => void;
  onRequestDelete?: () => void;
  onSubmit?: (input: CreateCategoryInput) => void | Promise<void>;
};

const CATEGORY_IMAGE_ASPECT_RATIO = 175 / 234;

export const CategoryFormModal = ({ 
  isOpen, 
  mode = "create", 
  category,
  onClose,
  onRequestDelete,
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
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [hasLoadedFriends, setHasLoadedFriends] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const selectedTheme = createCategoryColorTheme(selectedColor);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.includes(searchQuery) &&
      !selectedMembers.some((member) => member.id === friend.id),
  );

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
      setSelectedMembers([]);
    } else {
      setCategoryName("");
      setImageUrl(undefined);
      setSelectedColor(DEFAULT_CATEGORY_COLOR);
      setIsPublic(false);
      setIsCompleted(false);
      setIsShared(false);
      setSelectedMembers([]);
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
        inviteUserIds: isShared
          ? selectedMembers.map((member) => member.id)
          : undefined,
      });
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
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
          onToggleShared={() => setIsShared(!isShared)}
        />

        {isShared && (
          <CategoryMemberSelector
            selectedMembers={selectedMembers}
            filteredFriends={filteredFriends}
            searchQuery={searchQuery}
            isDropdownOpen={isDropdownOpen}
            onSearchChange={setSearchQuery}
            onDropdownOpenChange={handleMemberDropdownOpenChange}
            onToggleMember={toggleMember}
          />
        )}

        <div className="flex w-full flex-col gap-5">
          <ModalActionBar
            submitLabel={mode === "create" ? "추가" : "수정"}
            disabled={!categoryName.trim() || isSubmitting}
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={mode === "edit" ? onRequestDelete : undefined}
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
