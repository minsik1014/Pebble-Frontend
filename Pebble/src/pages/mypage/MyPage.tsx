import type { MainLayoutContext } from "@/components/layout/MainLayout";
import MySolidIcon from "@/assets/icons/user-solid.svg?react";
import { SidebarToggleButton } from "@/features/milestone/components/SidebarToggleButton";
import { useOutletContext } from "react-router-dom";

const categoryCardStyles = [
  {
    title: "일본 여행",
    backgroundClassName:
      "bg-[linear-gradient(145deg,#d5e0e5_0%,#78929a_48%,#3f6067_100%)]",
  },
  { title: "중간고사", backgroundClassName: "bg-theme-5-base" },
  { title: "GUI 팀플", backgroundClassName: "bg-theme-1-base" },
  {
    title: "여름 여행",
    backgroundClassName:
      "bg-[linear-gradient(145deg,#dbe7e1_0%,#7d9b79_48%,#466347_100%)]",
  },
  { title: "프로젝트", backgroundClassName: "bg-[#78a0dc]" },
  { title: "창업 공모전", backgroundClassName: "bg-theme-3-base" },
];

export default function MyPage() {
  const { isSidebarOpen, onToggleSidebar } =
    useOutletContext<MainLayoutContext>();

  return (
    <section
      className={`relative h-[1000px] shrink-0 rounded-[20px] bg-fill-inverse shadow-shadow-m transition-all duration-300 ${
        isSidebarOpen ? "w-[924px]" : "w-[1316px]"
      }`}
    >
      <div className="absolute left-6 top-8">
        <SidebarToggleButton
          isSidebarOpen={isSidebarOpen}
          onToggle={onToggleSidebar}
        />
      </div>

      <div className="h-full overflow-y-auto px-[72px] pb-12 custom-scrollbar">
        <div className="relative mx-auto flex w-full max-w-[780px] flex-col pt-[110px]">
          <button
            type="button"
            className="absolute right-0 top-[110px] h-12 rounded-token-s border border-border-default px-5 text-body-02-m text-text-secondary transition-colors hover:bg-fill-surface"
          >
            프로필 편집
          </button>

          <header className="flex flex-col items-center">
            <div className="flex size-32 items-center justify-center rounded-full bg-theme-2-base text-text-strong">
              <MySolidIcon className="size-16" />
            </div>

            <h1 className="mt-5 text-title-03-sb text-text-strong">페블이</h1>
            <p className="mt-2 text-body-02-m text-text-teritary">
              일상이없는게제일상입니다.
            </p>

            <div className="mt-11 flex h-[120px] w-[640px] items-center justify-center rounded-token-s bg-fill-inverse shadow-shadow-m">
              <div className="flex w-1/2 flex-col items-center gap-1">
                <span className="text-body-01-m text-text-secondary">
                  수 놓은 조약돌
                </span>
                <strong className="text-title-01-sb text-text-strong">82</strong>
              </div>
              <div className="h-[72px] w-px bg-border-default" aria-hidden="true" />
              <div className="flex w-1/2 flex-col items-center gap-1">
                <span className="text-body-01-m text-text-secondary">
                  완료한 카테고리
                </span>
                <strong className="text-title-01-sb text-text-strong">7</strong>
              </div>
            </div>
          </header>

          <section
            className="mx-auto mt-12 w-[640px]"
            aria-labelledby="my-category-heading"
          >
            <h2
              id="my-category-heading"
              className="text-title-02-sb text-text-strong"
            >
              완료한 카테고리
            </h2>

            <div className="mt-5 grid grid-cols-3 gap-5">
              {categoryCardStyles.map(({ title, backgroundClassName }) => (
                <article
                  key={title}
                  className={`relative h-[298px] overflow-hidden rounded-token-s ${backgroundClassName}`}
                >
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/45 to-transparent px-4 pb-4 pt-16">
                    <h3 className="text-body-01-sb text-text-onFill">
                      {title}
                    </h3>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </div>
    </section>
  );
}
