import { useRef, useState, type ChangeEvent } from "react";
import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import EditIcon from "@/assets/icons/newedit.svg?react";
import { ProfileImageCropModal } from "@/features/mypage/components/ProfileImageCropModal";
import { useProfileStore } from "@/features/mypage/store/useProfileStore";

export const ProfileImageEditor = (): JSX.Element => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [cropSource, setCropSource] = useState<string | null>(null);
  const imageUrl = useProfileStore(
    (state) => state.pendingImageUrl ?? state.profile.imageUrl,
  );
  const setPendingProfileImage = useProfileStore(
    (state) => state.setPendingProfileImage,
  );

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        setCropSource(reader.result);
      }
    });
    reader.readAsDataURL(file);

    event.target.value = "";
  };

  return (
    <div className="relative size-32">
      <div className="relative flex size-full overflow-hidden rounded-full bg-theme-2-base text-text-strong">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="현재 프로필"
            className="absolute inset-0 h-full w-full max-w-none object-cover object-center"
          />
        ) : (
          <div className="flex size-full items-center justify-center">
            <MySolidIcon className="size-16" />
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleImageChange}
        className="sr-only"
        aria-label="프로필 이미지 파일 선택"
      />

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border border-border-default bg-fill-inverse text-text-secondary shadow-shadow-s transition-colors hover:bg-fill-surface hover:text-text-strong"
        aria-label="프로필 이미지 변경"
      >
        <EditIcon className="size-5" />
      </button>

      {cropSource && (
        <ProfileImageCropModal
          source={cropSource}
          onCancel={() => setCropSource(null)}
          onComplete={(croppedImageUrl) => {
            setPendingProfileImage(croppedImageUrl);
            setCropSource(null);
          }}
        />
      )}
    </div>
  );
};
