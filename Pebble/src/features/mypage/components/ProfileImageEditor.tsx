import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import EditIcon from "@/assets/icons/newedit.svg?react";

export const ProfileImageEditor = (): JSX.Element => {
  return (
    <div className="relative size-32">
      <div className="flex size-full items-center justify-center rounded-full bg-theme-2-base text-text-strong">
        <MySolidIcon className="size-16" />
      </div>

      <button
        type="button"
        className="absolute bottom-0 right-0 flex size-10 items-center justify-center rounded-full border border-border-default bg-fill-inverse text-text-secondary shadow-shadow-s transition-colors hover:bg-fill-surface hover:text-text-strong"
        aria-label="프로필 이미지 변경"
      >
        <EditIcon className="size-5" />
      </button>
    </div>
  );
};
