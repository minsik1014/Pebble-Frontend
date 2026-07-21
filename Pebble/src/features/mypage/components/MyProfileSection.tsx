import { useState } from "react";

import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import { ImageCropModal } from "@/components/ui/image-crop/ImageCropModal";

type MyProfileSectionProps = {
  isCompact: boolean;
};

export const MyProfileSection = ({
  isCompact,
}: MyProfileSectionProps): JSX.Element => {
  const [isProfileCropModalOpen, setIsProfileCropModalOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);

  return (
    <header
      className={`sticky top-0 z-10 bg-fill-inverse transition-[height] duration-500 ease-in-out ${
        isCompact ? "h-[260px]" : "h-[316px]"
      }`}
    >
      <div
        className={`absolute top-[110px] flex items-center justify-center rounded-full text-text-strong transition-[left,width,height,background-color] duration-500 ease-in-out ${
          isCompact ? "left-5 size-24" : "left-[326px] size-32"
        } ${profileImageUrl ? "bg-fill-surface" : "bg-theme-2-base"}`}
      >
        {profileImageUrl ? (
          <img
            src={profileImageUrl}
            alt="프로필 이미지"
            className="h-full w-full rounded-full object-cover"
          />
        ) : (
          <MySolidIcon
            className={`transition-[width,height] duration-500 ease-in-out ${
              isCompact ? "size-12" : "size-16"
            }`}
          />
        )}
      </div>

      <div
        className={`absolute transition-[left,top,width] duration-500 ease-in-out ${
          isCompact
            ? "left-[132px] top-32 w-[360px] text-left"
            : "left-0 top-[258px] w-full text-center"
        }`}
      >
        <h1 className="text-title-03-sb text-text-strong">페블이</h1>
        <p className="mt-2 text-body-02-m text-text-teritary">
          일상이없는게제일상입니다.
        </p>
      </div>

      <button
        type="button"
        className={`absolute right-0 h-12 rounded-token-s border border-border-default px-5 text-body-02-m text-text-secondary transition-[top,background-color] duration-500 ease-in-out hover:bg-fill-surface ${
          isCompact ? "top-[134px]" : "top-[110px]"
        }`}
        onClick={() => setIsProfileCropModalOpen(true)}
      >
        프로필 편집
      </button>

      <ImageCropModal
        isOpen={isProfileCropModalOpen}
        imageUrl={profileImageUrl}
        title="프로필 사진 편집"
        description="이미지를 드래그하고 확대해서 원형 프로필 영역을 맞춰보세요."
        closeLabel="프로필 사진 편집 닫기"
        cropShape="round"
        onClose={() => setIsProfileCropModalOpen(false)}
        onChangeImage={setProfileImageUrl}
      />
    </header>
  );
};
