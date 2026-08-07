import { useEffect, useState } from 'react';

import { ImageCropModal } from '@/components/ui/image-crop/ImageCropModal';
import { ModalActionBar } from '@/components/ui/ModalActionBar';
import { getFollowingFriends } from '@/features/category/api/categoryFriendsApi';
import { uploadImageDataUrl } from '@/features/category/api/uploadImageApi';
import type { Friend } from '@/features/category/types';
import type { CreateCategoryInput } from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import type { Category } from '@/types';
import {
  createCategoryColorTheme,
  DEFAULT_CATEGORY_COLOR,
} from '@/utils/categoryColorTheme';

import { CategoryColorPicker } from './CategoryColorPicker';
import { CategoryImageUploader } from './CategoryImageUploader';
import { CategoryMemberSelector } from './CategoryMemberSelector';
import { CategoryShareOption } from './CategoryShareOption';
import { CategoryStatusOptions } from './CategoryStatusOptions';
import { CategoryThemePreview } from './CategoryThemePreview';

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  category?: Category;
  onClose: () => void;
  onRequestDelete?: () => void | Promise<void>;
  onSubmit?: (
    input: CreateCategoryInput,
  ) => void | Promise<void>;
};

const CATEGORY_IMAGE_ASPECT_RATIO = 175 / 234;

export const CategoryFormModal = ({
  isOpen,
  mode = 'create',
  category,
  onClose,
  onRequestDelete,
  onSubmit,
}: CategoryFormModalProps) => {
  const [selectedColor, setSelectedColor] =
    useState<string>(DEFAULT_CATEGORY_COLOR);
  const [isPublic, setIsPublic] = useState(false);
  const [isCompleted, setIsCompleted] =
    useState(false);
  const [isShared, setIsShared] = useState(false);
  const [categoryName, setCategoryName] = useState(
    category?.title ?? '',
  );
  const [imageUrl, setImageUrl] = useState<
    string | undefined
  >(category?.imageUrl);
  const [
    cropSourceImageFile,
    setCropSourceImageFile,
  ] = useState<File | null>(null);

  const [selectedMembers, setSelectedMembers] =
    useState<Friend[]>([]);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] =
    useState(false);
  const [hasLoadedFriends, setHasLoadedFriends] =
    useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const { isRunning, run } = useRetryableAction();

  const selectedTheme =
    createCategoryColorTheme(selectedColor);

  const filteredFriends = friends.filter(
    (friend) =>
      friend.name.includes(searchQuery) &&
      !selectedMembers.some(
        (member) => member.id === friend.id,
      ),
  );

  useEffect(() => {
    if (!isOpen) return;

    setErrorMessage('');

    if (mode === 'edit' && category) {
      setCategoryName(category.title);
      setSelectedColor(category.accent);
      setImageUrl(category.imageUrl);
      setIsPublic(category.isPublic ?? true);
      setIsCompleted(category.isCompleted ?? false);
      setIsShared(category.isShared ?? false);
      setSelectedMembers([]);
      return;
    }

    setCategoryName('');
    setImageUrl(undefined);
    setSelectedColor(DEFAULT_CATEGORY_COLOR);
    setIsPublic(false);
    setIsCompleted(false);
    setIsShared(false);
    setSelectedMembers([]);
    setSearchQuery('');
    setIsDropdownOpen(false);
    setHasLoadedFriends(false);
  }, [mode, category, isOpen]);

  useEffect(() => {
    if (!isOpen || !isShared) {
      setFriends([]);
      setHasLoadedFriends(false);
    }
  }, [isOpen, isShared]);

  const toggleMember = (member: Friend) => {
    setSelectedMembers((previousMembers) => {
      if (
        previousMembers.some(
          (selectedMember) =>
            selectedMember.id === member.id,
        )
      ) {
        return previousMembers.filter(
          (selectedMember) =>
            selectedMember.id !== member.id,
        );
      }

      setSearchQuery('');
      return [...previousMembers, member];
    });
  };

  const loadFriends = async () => {
    if (hasLoadedFriends) return;

    try {
      const loadedFriends =
        await getFollowingFriends();

      setFriends(loadedFriends);
      setHasLoadedFriends(true);
    } catch (error) {
      setFriends([]);
      setHasLoadedFriends(true);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : '친구 목록을 불러오지 못했어요.',
      );
    }
  };

  const handleMemberDropdownOpenChange = (
    nextIsOpen: boolean,
  ) => {
    setIsDropdownOpen(nextIsOpen);

    if (nextIsOpen) {
      void loadFriends();
    }
  };

  const handleSubmit = async () => {
    const trimmedName = categoryName.trim();

    if (!trimmedName || isRunning) return;

    setErrorMessage('');

    /*
     * 재시도할 때 현재 폼 입력값과 동일한 요청을 사용하도록
     * 요청 시점 값을 복사합니다.
     */
    const inputSnapshot = {
      title: trimmedName,
      selectedColor,
      imageUrl,
      isPublic,
      isCompleted,
      isShared,
      selectedMembers: [...selectedMembers],
    };

    await run(
      async () => {
        const theme = createCategoryColorTheme(
          inputSnapshot.selectedColor,
        );

        const uploadedImageUrl =
          inputSnapshot.imageUrl?.startsWith('data:')
            ? await uploadImageDataUrl(
                inputSnapshot.imageUrl,
              )
            : inputSnapshot.imageUrl;

        await onSubmit?.({
          title: inputSnapshot.title,
          accent: theme.accent,
          themeBase: theme.themeBase,
          themeMid: theme.themeMid,
          themeLight: theme.themeLight,
          themeTextOnMid: theme.themeTextOnMid,
          themeTextOnLight:
            theme.themeTextOnLight,
          imageUrl:
            uploadedImageUrl ?? undefined,
          isPublic: inputSnapshot.isPublic,
          isCompleted:
            inputSnapshot.isCompleted,
          isShared: inputSnapshot.isShared,
          inviteUserIds: inputSnapshot.isShared
            ? inputSnapshot.selectedMembers.map(
                (member) => member.id,
              )
            : undefined,
        });

        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '카테고리를 저장하지 못했어요.',
          );
        },
      },
    );
  };

  const handleDelete = async () => {
    if (!onRequestDelete || isRunning) return;

    setErrorMessage('');

    await run(
      async () => {
        await onRequestDelete();
      },
      {
        onError: (error) => {
          setErrorMessage(
            error instanceof Error
              ? error.message
              : '카테고리를 삭제하지 못했어요.',
          );
        },
      },
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-fill-shadow">
      <div className="flex w-[607px] flex-col items-center gap-5 rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m">
        <header className="flex w-full items-center justify-between">
          <h2 className="w-full text-title-02-sb text-text-strong">
            {mode === 'create'
              ? '카테고리 추가하기'
              : '카테고리 편집하기'}
          </h2>
        </header>

        <div className="flex w-full flex-col items-start gap-5">
          <div className="flex w-full items-start gap-token-xxl">
            <CategoryImageUploader
              imageUrl={imageUrl}
              onImageChange={setImageUrl}
              onSelectImageFile={
                setCropSourceImageFile
              }
            />

            <div className="flex w-[328px] flex-col justify-center gap-5">
              <div className="flex w-full flex-col gap-2">
                <label className="flex items-center gap-1 text-body-01-sb text-text-primary">
                  카테고리 이름
                  <span className="text-body-01-sb text-fill-danger">
                    *
                  </span>
                </label>

                <input
                  type="text"
                  value={categoryName}
                  disabled={isRunning}
                  onChange={(event) => {
                    setCategoryName(
                      event.target.value,
                    );
                    setErrorMessage('');
                  }}
                  placeholder="텍스트, 특수문자, 이모티콘 가능"
                  className="w-full rounded-token-s border border-border-default bg-fill-inverse p-token-m text-body-02-m text-text-primary placeholder:text-text-quaternary focus:border-text-strong focus:outline-none disabled:cursor-not-allowed"
                />
              </div>

              <CategoryColorPicker
                selectedColor={selectedColor}
                onSelectColor={setSelectedColor}
              />

              <CategoryThemePreview
                theme={selectedTheme}
              />
            </div>
          </div>

          <CategoryStatusOptions
            isPublic={isPublic}
            isCompleted={isCompleted}
            onTogglePublic={() =>
              setIsPublic((value) => !value)
            }
            onToggleCompleted={() =>
              setIsCompleted((value) => !value)
            }
          />
        </div>

        <CategoryShareOption
          isShared={isShared}
          onToggleShared={() =>
            setIsShared((value) => !value)
          }
        />

        {isShared ? (
          <CategoryMemberSelector
            selectedMembers={selectedMembers}
            filteredFriends={filteredFriends}
            searchQuery={searchQuery}
            isDropdownOpen={isDropdownOpen}
            onSearchChange={setSearchQuery}
            onDropdownOpenChange={
              handleMemberDropdownOpenChange
            }
            onToggleMember={toggleMember}
          />
        ) : null}

        {errorMessage ? (
          <p
            role="alert"
            className="w-full text-caption-01 text-fill-danger"
          >
            {errorMessage}
          </p>
        ) : null}

        <div className="flex w-full flex-col gap-5">
          <ModalActionBar
            submitLabel={
              mode === 'create' ? '추가' : '수정'
            }
            disabled={!categoryName.trim()}
            isBusy={isRunning}
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={
              mode === 'edit' && onRequestDelete
                ? handleDelete
                : undefined
            }
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
          onClose={() =>
            setCropSourceImageFile(null)
          }
          onChangeImage={(croppedImageUrl) => {
            setImageUrl(croppedImageUrl);
            setCropSourceImageFile(null);
          }}
        />
      </div>
    </div>
  );
};