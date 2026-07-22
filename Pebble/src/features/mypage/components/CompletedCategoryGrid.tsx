import { CompletedCategoryCard } from "./CompletedCategoryCard";
import { completedCategoryMocks } from "@/features/mypage/mock/completedCategoryMock";

type CompletedCategoryGridProps = {
  isCompact: boolean;
  onSelectCategory: (categoryId: string) => void;
};

export const CompletedCategoryGrid = ({
  isCompact,
  onSelectCategory,
}: CompletedCategoryGridProps): JSX.Element => {
  return (
    <section
      className={`relative z-20 mx-auto w-[640px] bg-fill-inverse transition-[margin] duration-500 ease-in-out ${
        isCompact ? "mt-16" : "mt-12"
      }`}
      aria-labelledby="my-category-heading"
    >
      <div
        className={`sticky top-0 z-30 bg-fill-inverse pb-3 transition-[padding] duration-500 ease-in-out ${
          isCompact ? "pt-8" : "pt-0"
        }`}
      >
        <h2
          id="my-category-heading"
          className="text-title-02-sb text-text-strong"
        >
          완료한 카테고리
        </h2>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {completedCategoryMocks.map(({ category, cardBackgroundClassName }) => (
          <CompletedCategoryCard
            key={category.id}
            title={category.title}
            backgroundClassName={cardBackgroundClassName}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </section>
  );
};
