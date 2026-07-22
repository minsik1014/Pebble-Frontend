import { CompletedCategoryCard } from "./CompletedCategoryCard";

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
  { title: "운동 기록", backgroundClassName: "bg-theme-2-base" },
];

type CompletedCategoryGridProps = {
  isCompact: boolean;
};

export const CompletedCategoryGrid = ({
  isCompact,
}: CompletedCategoryGridProps): JSX.Element => {
  return (
    <section
      className={`relative z-20 mx-auto w-[640px] bg-fill-inverse transition-[margin] duration-500 ease-in-out ${
        isCompact ? "mt-9" : "mt-12"
      }`}
      aria-labelledby="my-category-heading"
    >
      <div className="sticky top-0 z-30 bg-fill-inverse pb-3 pt-8">
        <h2
          id="my-category-heading"
          className="text-title-02-sb text-text-strong"
        >
          완료한 카테고리
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {categoryCardStyles.map(({ title, backgroundClassName }) => (
          <CompletedCategoryCard
            key={title}
            title={title}
            backgroundClassName={backgroundClassName}
          />
        ))}
      </div>
    </section>
  );
};
