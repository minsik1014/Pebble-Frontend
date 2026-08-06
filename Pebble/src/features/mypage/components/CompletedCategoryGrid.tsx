import { CompletedCategoryCard } from "./CompletedCategoryCard";
import type { Category } from "@/types";

type CompletedCategoryGridProps = {
  isCompact: boolean;
  categories: Category[];
  onSelectCategory: (categoryId: string) => void;
};

export const CompletedCategoryGrid = ({
  isCompact,
  categories,
  onSelectCategory,
}: CompletedCategoryGridProps): JSX.Element => {
  return (
    <section
      className={`relative z-20 mx-auto w-[640px] bg-fill-inverse transition-[margin] duration-500 ease-in-out ${
        isCompact ? "mt-16" : "mt-12"
      } ${categories.length <= 6 ? "min-h-[800px]" : ""}`}
      aria-labelledby="my-category-heading"
    >
      <div
        className={`sticky z-30 bg-fill-inverse pb-3 ${
          isCompact ? "top-[220px] pt-8" : "top-0 pt-0"
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
        {categories.map((category) => (
          <CompletedCategoryCard
            key={category.id}
            title={category.title}
            imageUrl={category.imageUrl ?? null}
            color={category.accent}
            onClick={() => onSelectCategory(category.id)}
          />
        ))}
      </div>
    </section>
  );
};
