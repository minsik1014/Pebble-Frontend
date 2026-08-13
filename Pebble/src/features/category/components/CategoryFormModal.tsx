import { useEffect, useState } from 'react';

import { ImageCropModal } from '@/components/ui/image-crop/ImageCropModal';
import { ModalActionBar } from '@/components/ui/ModalActionBar';
import { ModalBackdrop } from '@/components/ui/ModalBackdrop';
import { uploadImageDataUrl } from '@/features/category/api/uploadImageApi';
import { useCategoryFormMembers } from '@/features/category/hooks/useCategoryFormMembers';
import {
  buildChangedCategoryInput,
  CATEGORY_IMAGE_ASPECT_RATIO,
  getEditableCategoryMembers,
} from '@/features/category/utils/categoryFormUtils';
import type {
  CreateCategoryInput,
  UpdateCategoryInput,
} from '@/features/calendar/types';
import { useRetryableAction } from '@/hooks/useRetryableAction';
import type { Category } from '@/types';
import {
  createCategoryColorTheme,
  DEFAULT_CATEGORY_COLOR,
} from '@/utils/categoryColorTheme';
import { getErrorMessage } from '@/utils/getErrorMessage';

import { CategoryColorPicker } from './CategoryColorPicker';
import { CategoryImageUploader } from './CategoryImageUploader';
import { CategoryMemberList } from './CategoryMemberList';
import { CategoryMemberSelector } from './CategoryMemberSelector';
import { CategoryShareOption } from './CategoryShareOption';
import { CategoryStatusOptions } from './CategoryStatusOptions';
import { CategoryThemePreview } from './CategoryThemePreview';

type CategoryFormModalProps = {
  isOpen: boolean;
  mode?: 'create' | 'edit';
  category?: Category;
  currentUserId?: number | null;
  onClose: () => void;
  onRequestDelete?: () => void | Promise<void>;
  onLeaveCategory?: () => void | Promise<void>;
  onSubmit?: (
    input: CreateCategoryInput | UpdateCategoryInput,
  ) => void | Promise<void>;
};

export const CategoryFormModal = ({
  isOpen,
  mode = 'create',
  category,
  currentUserId,
  onClose,
  onRequestDelete,
  onLeaveCategory,
  onSubmit,
}: CategoryFormModalProps) => {
  const [
    selectedColor,
    setSelectedColor,
  ] = useState<string>(
    DEFAULT_CATEGORY_COLOR,
  );

  const [isPublic, setIsPublic] =
    useState(false);

  const [
    isCompleted,
    setIsCompleted,
  ] = useState(false);

  const [isShared, setIsShared] =
    useState(false);

  const [
    categoryName,
    setCategoryName,
  ] = useState(
    category?.title ?? '',
  );

  const [imageUrl, setImageUrl] =
    useState<string | undefined>(
      category?.imageUrl,
    );

  const [
    cropSourceImageFile,
    setCropSourceImageFile,
  ] = useState<File | null>(null);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState('');

  const { isRunning, run } =
    useRetryableAction();

  const {
    filteredFriends,
    handleDropdownOpenChange,
    initialMembers,
    isDropdownOpen,
    searchQuery,
    selectedMembers,
    setSearchQuery,
    toggleMember,
  } = useCategoryFormMembers({
    category,
    isOpen,
    isShared,
    mode,
    onError: setErrorMessage,
  });

  const selectedTheme =
    createCategoryColorTheme(
      selectedColor,
    );

  const shouldShowMemberList =
    mode === 'edit' &&
    selectedMembers.length > 0;

  const canToggleShared = !(
    mode === 'edit' &&
    category?.isShared &&
    isShared
  );

  const canDeleteCategory = Boolean(
    onRequestDelete,
  );

  const changedCategoryInput =
    mode === 'edit' && category
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

  const submitDisabledReason =
    !categoryName.trim()
      ? '제목을 입력해 주세요'
      : mode === 'edit' &&
          changedCategoryInput &&
          Object.keys(
            changedCategoryInput,
          ).length === 0
        ? '변경사항을 입력해 주세요'
        : undefined;

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setErrorMessage('');
    setCropSourceImageFile(null);

    if (
      mode === 'edit' &&
      category
    ) {
      setCategoryName(category.title);
      setSelectedColor(
        category.accent,
      );
      setImageUrl(category.imageUrl);
      setIsPublic(
        category.isPublic ?? true,
      );
      setIsCompleted(
        category.isCompleted ??
          false,
      );
      setIsShared(
        category.isShared ?? false,
      );

      return;
    }

    setCategoryName('');
    setImageUrl(undefined);
    setSelectedColor(
      DEFAULT_CATEGORY_COLOR,
    );
    setIsPublic(false);
    setIsCompleted(false);
    setIsShared(false);
  }, [category, isOpen, mode]);

  const handleSubmit = async () => {
    const trimmedName =
      categoryName.trim();

    if (
      !trimmedName ||
      isRunning
    ) {
      return;
    }

    setErrorMessage('');

    /*
     * 다시 시도할 때도 처음 제출한 값과 동일한 요청을
     * 사용하도록 현재 입력값을 복사합니다.
     */
    const inputSnapshot = {
      title: trimmedName,
      selectedColor,
      imageUrl,
      isPublic,
      isCompleted,
      isShared,
      selectedMembers: [
        ...selectedMembers,
      ],
      initialMembers: [
        ...initialMembers,
      ],
    };

    await run(
      async () => {
        const theme =
          createCategoryColorTheme(
            inputSnapshot.selectedColor,
          );

        const uploadedImageUrl =
          inputSnapshot.imageUrl?.startsWith(
            'data:',
          )
            ? await uploadImageDataUrl(
                inputSnapshot.imageUrl,
              )
            : inputSnapshot.imageUrl;

        if (
          mode === 'edit' &&
          category
        ) {
          const changedInput =
            buildChangedCategoryInput({
              category,
              categoryName:
                inputSnapshot.title,
              selectedTheme: theme,
              imageUrl:
                uploadedImageUrl,
              isPublic:
                inputSnapshot.isPublic,
              isCompleted:
                inputSnapshot.isCompleted,
              isShared:
                inputSnapshot.isShared,
              selectedMembers:
                inputSnapshot.selectedMembers,
              initialMembers:
                inputSnapshot.initialMembers,
            });

          if (
            Object.keys(
              changedInput,
            ).length > 0
          ) {
            await onSubmit?.(
              changedInput,
            );
          }
        } else {
          await onSubmit?.({
            title:
              inputSnapshot.title,
            accent: theme.accent,
            themeBase:
              theme.themeBase,
            themeMid: theme.themeMid,
            themeLight:
              theme.themeLight,
            themeTextOnMid:
              theme.themeTextOnMid,
            themeTextOnLight:
              theme.themeTextOnLight,
            imageUrl:
              uploadedImageUrl ??
              undefined,
            isPublic:
              inputSnapshot.isPublic,
            isCompleted:
              inputSnapshot.isCompleted,
            isShared:
              inputSnapshot.isShared,
            members:
              inputSnapshot.isShared
                ? getEditableCategoryMembers(
                    inputSnapshot.selectedMembers,
                  )
                : undefined,
          });
        }

        // 요청 성공 후에만 모달을 닫습니다.
        onClose();
      },
      {
        onError: (error) => {
          setErrorMessage(getErrorMessage(error, '카테고리를 저장하지 못했어요.'));
        },
      },
    );
  };

  const handleDelete = async () => {
    if (
      !onRequestDelete ||
      isRunning
    ) {
      return;
    }

    setErrorMessage('');

    await run(
      async () => {
        await onRequestDelete();
      },
      {
        onError: (error) => {
          setErrorMessage(getErrorMessage(error, '카테고리를 삭제하지 못했어요.'));
        },
      },
    );
  };

  if (!isOpen) {
    return null;
  }

  return (
    <ModalBackdrop>
      <div className="flex w-[607px] flex-col items-center gap-5 rounded-token-l bg-fill-inverse p-token-xl shadow-shadow-m dark:border-[0.5px] dark:border-border-secondary dark:shadow-[0px_0px_28px_0px_rgba(23,23,23,0.05)]">
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
              onImageChange={
                setImageUrl
              }
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
                  onChange={(
                    event,
                  ) => {
                    setCategoryName(
                      event.target
                        .value,
                    );
                    setErrorMessage('');
                  }}
                  placeholder="텍스트, 특수문자, 이모티콘 가능"
                  className={[
                    'w-full rounded-token-s border border-border-default',
                    'bg-fill-inverse p-token-m',
                    'text-body-02-m text-text-primary',
                    'placeholder:text-text-quaternary',
                    'focus:border-text-strong focus:outline-none',
                    'dark:border-border-secondary dark:focus:border-border-primary',
                    'disabled:cursor-not-allowed',
                  ].join(' ')}
                />
              </div>

              <CategoryColorPicker
                selectedColor={
                  selectedColor
                }
                onSelectColor={
                  setSelectedColor
                }
              />

              <CategoryThemePreview
                theme={selectedTheme}
              />
            </div>
          </div>

          <CategoryStatusOptions
            isPublic={isPublic}
            isCompleted={
              isCompleted
            }
            onTogglePublic={() =>
              setIsPublic(
                (value) => !value,
              )
            }
            onToggleCompleted={() =>
              setIsCompleted(
                (value) => !value,
              )
            }
          />
        </div>

        <CategoryShareOption
          isShared={isShared}
          disabled={!canToggleShared}
          onToggleShared={() => {
            if (
              !canToggleShared
            ) {
              return;
            }

            setIsShared(
              (value) => !value,
            );
          }}
        />

        {isShared ? (
          <div className="flex w-full flex-col gap-token-m">
            <div className="flex w-full flex-col gap-token-s">
              <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                친구 초대
              </h3>

              <CategoryMemberSelector
                selectedMembers={
                  selectedMembers
                }
                filteredFriends={
                  filteredFriends
                }
                searchQuery={
                  searchQuery
                }
                isDropdownOpen={
                  isDropdownOpen
                }
                showSelectedMembersInInput={
                  mode === 'create'
                }
                onSearchChange={
                  setSearchQuery
                }
                onDropdownOpenChange={
                  handleDropdownOpenChange
                }
                onToggleMember={
                  toggleMember
                }
              />
            </div>

            {shouldShowMemberList ? (
              <div className="flex w-full flex-col gap-token-s">
                <h3 className="text-body-01-sb tracking-[-0.18px] text-text-primary">
                  구성원
                </h3>

                <CategoryMemberList
                  members={
                    selectedMembers
                  }
                  currentUserId={
                    currentUserId
                  }
                  onRemoveMember={
                    toggleMember
                  }
                  onLeaveCategory={
                    onLeaveCategory
                  }
                />
              </div>
            ) : null}
          </div>
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
              mode === 'create'
                ? '추가'
                : '수정'
            }
            disabled={Boolean(
              submitDisabledReason,
            )}
            isBusy={isRunning}
            disabledReason={
              submitDisabledReason
            }
            onCancel={onClose}
            onSubmit={handleSubmit}
            onDelete={
              mode === 'edit' &&
              canDeleteCategory
                ? handleDelete
                : undefined
            }
            deleteLabel="카테고리 삭제"
          />
        </div>

        <ImageCropModal
          isOpen={Boolean(
            cropSourceImageFile,
          )}
          imageUrl={null}
          imageFile={
            cropSourceImageFile
          }
          title="대표 이미지 편집"
          description="선택한 이미지를 드래그하고 확대해서 카테고리 대표 이미지 영역에 맞춰보세요."
          closeLabel="대표 이미지 편집 닫기"
          applyLabel="적용"
          changeImageLabel="이미지 다시 선택"
          aspect={
            CATEGORY_IMAGE_ASPECT_RATIO
          }
          cropShape="rect"
          onClose={() =>
            setCropSourceImageFile(
              null,
            )
          }
          onChangeImage={(
            croppedImageUrl,
          ) => {
            setImageUrl(
              croppedImageUrl,
            );
            setCropSourceImageFile(
              null,
            );
          }}
        />
      </div>
    </ModalBackdrop>
  );
};
