import ChevronLeftIcon from "@/assets/icons/chevron-left.svg?react";
import type { MainLayoutContext } from "@/components/layout/MainLayout";
import { ProfileEditForm } from "@/features/mypage/components/ProfileEditForm";
import { ProfileImageEditor } from "@/features/mypage/components/ProfileImageEditor";
import { useNavigate, useOutletContext } from "react-router-dom";

export default function ProfileEditPage() {
  const navigate = useNavigate();
  const { isSidebarOpen } = useOutletContext<MainLayoutContext>();

  return (
    <section
      className={`relative h-[1000px] shrink-0 overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <button
        type="button"
        onClick={() => navigate("/my")}
        className="absolute left-6 top-8 z-20 flex h-11 items-center gap-2 rounded-token-s px-2 text-title-03-m text-text-strong transition-colors hover:bg-fill-surface"
        aria-label="마이페이지로 돌아가기"
      >
        <ChevronLeftIcon className="size-6" />
        <span>마이페이지</span>
      </button>

      <div className="h-full overflow-y-auto px-[72px] pb-12 custom-scrollbar">
        <div className="mx-auto flex w-full max-w-[780px] flex-col items-center">
          <header className="relative h-[316px] w-full shrink-0 bg-fill-inverse">
            <div className="absolute left-[326px] top-[110px]">
              <ProfileImageEditor />
            </div>

            <div className="absolute left-0 top-[258px] w-full text-center">
              <h1 className="text-title-03-sb text-text-strong">페블이</h1>
              <p className="mt-2 text-body-02-m text-text-teritary">
                일상이없는게제일상입니다.
              </p>
            </div>
          </header>

          <ProfileEditForm />
        </div>
      </div>
    </section>
  );
}
