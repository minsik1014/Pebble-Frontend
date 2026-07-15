import MySolidIcon from "@/assets/icons/user-solid.svg?react";

type MyProfileSectionProps = {
  isCompact: boolean;
  onEditProfile: () => void;
};

export const MyProfileSection = ({
  isCompact,
  onEditProfile,
}: MyProfileSectionProps): JSX.Element => {
  return (
    <header
      className={`sticky top-0 z-10 bg-fill-inverse transition-[height] duration-500 ease-in-out ${
        isCompact ? "h-[260px]" : "h-[316px]"
      }`}
    >
      <div
        className={`absolute top-[110px] flex items-center justify-center rounded-full bg-theme-2-base text-text-strong transition-[left,width,height] duration-500 ease-in-out ${
          isCompact ? "left-5 size-24" : "left-[326px] size-32"
        }`}
      >
        <MySolidIcon
          className={`transition-[width,height] duration-500 ease-in-out ${
            isCompact ? "size-12" : "size-16"
          }`}
        />
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
        onClick={onEditProfile}
        className={`absolute right-0 h-12 rounded-token-s border border-border-default px-5 text-body-02-m text-text-secondary transition-[top,background-color] duration-500 ease-in-out hover:bg-fill-surface ${
          isCompact ? "top-[134px]" : "top-[110px]"
        }`}
      >
        프로필 편집
      </button>
    </header>
  );
};
