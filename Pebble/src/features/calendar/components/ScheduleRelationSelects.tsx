import type { Category, ScheduleItem } from "@/types";

type SelectButtonVariant = "surface" | "inverse";

type CategorySelectProps = {
  categories: Category[];
  selectedCategoryId: string | null;
  isOpen: boolean;
  placeholder?: string;
  variant?: SelectButtonVariant;
  allowEmpty?: boolean;
  onToggleOpen: () => void;
  onSelectCategory: (categoryId: string | null) => void;
};

type MilestoneSelectProps = {
  milestones: ScheduleItem[];
  selectedMilestoneId: string | null;
  themeColor?: string;
  disabled?: boolean;
  isOpen: boolean;
  onToggleOpen: () => void;
  onSelectMilestone: (milestoneId: string | null) => void;
};

const ChevronDownIcon = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M7 10L12 15L17 10H7Z" fill="#171717" />
  </svg>
);

const getButtonClassName = (variant: SelectButtonVariant) =>
  [
    "flex h-12 w-full items-center justify-between rounded-[12px] border px-4",
    variant === "surface"
      ? "border-border-secondary bg-fill-surface px-5"
      : "border-border-primary bg-fill-inverse",
  ].join(" ");

export const CategorySelect = ({
  categories,
  selectedCategoryId,
  isOpen,
  placeholder = "카테고리",
  variant = "surface",
  allowEmpty = false,
  onToggleOpen,
  onSelectCategory,
}: CategorySelectProps) => {
  const selectedCategory =
    categories.find((category) => category.id === selectedCategoryId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        className={getButtonClassName(variant)}
        onClick={onToggleOpen}
      >
        {selectedCategory ? (
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-[6px] rounded-[4px]"
              style={{ backgroundColor: selectedCategory.themeBase || "#171717" }}
            />
            <span className="text-[16px] font-medium text-text-strong">
              {selectedCategory.title}
            </span>
          </div>
        ) : (
          <span className="text-[16px] font-medium text-text-strong">
            {placeholder}
          </span>
        )}
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[52px] z-20 flex max-h-[200px] w-full flex-col gap-1 overflow-y-auto rounded-[12px] border border-border-default bg-fill-inverse p-2 shadow-shadow-m">
          {allowEmpty && (
            <button
              type="button"
              className="flex items-center gap-2 rounded-[8px] p-2 text-left transition-colors hover:bg-fill-surface"
              onClick={() => onSelectCategory(null)}
            >
              <div className="h-6 w-[6px] rounded-[4px] bg-text-strong" />
              <span className="text-[16px] font-medium text-text-strong">
                선택 안 함
              </span>
            </button>
          )}
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
              className="flex items-center gap-2 rounded-[8px] p-2 text-left transition-colors hover:bg-fill-surface"
              onClick={() => onSelectCategory(category.id)}
            >
              <div
                className="h-6 w-[6px] rounded-[4px]"
                style={{ backgroundColor: category.themeBase || "#171717" }}
              />
              <span className="text-[16px] font-medium text-text-strong">
                {category.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export const MilestoneSelect = ({
  milestones,
  selectedMilestoneId,
  themeColor = "rgba(23,23,23,0.5)",
  disabled = false,
  isOpen,
  onToggleOpen,
  onSelectMilestone,
}: MilestoneSelectProps) => {
  const selectedMilestone =
    milestones.find((milestone) => milestone.id === selectedMilestoneId) ?? null;

  return (
    <div className="relative">
      <button
        type="button"
        className={getButtonClassName("surface")}
        onClick={onToggleOpen}
        disabled={disabled}
      >
        {selectedMilestone ? (
          <div className="flex items-center gap-2">
            <div
              className="h-6 w-[6px] rounded-[4px]"
              style={{ backgroundColor: themeColor }}
            />
            <span className="text-[16px] font-medium text-text-strong">
              {selectedMilestone.title}
            </span>
          </div>
        ) : (
          <span className="text-[16px] font-medium text-text-strong">
            마일스톤
          </span>
        )}
        <ChevronDownIcon />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-[52px] z-20 flex max-h-[200px] w-full flex-col gap-1 overflow-y-auto rounded-[12px] border border-border-default bg-fill-inverse p-2 shadow-shadow-m">
          <button
            type="button"
            className="flex items-center gap-2 rounded-[8px] p-2 text-left transition-colors hover:bg-fill-surface"
            onClick={() => onSelectMilestone(null)}
          >
            <div className="h-6 w-[6px] rounded-[4px] bg-text-strong" />
            <span className="text-[16px] font-medium text-text-strong">
              선택 안 함
            </span>
          </button>
          {milestones.length > 0 ? (
            milestones.map((milestone) => (
              <button
                key={milestone.id}
                type="button"
                className="flex items-center gap-2 rounded-[8px] p-2 text-left transition-colors hover:bg-fill-surface"
                onClick={() => onSelectMilestone(milestone.id)}
              >
                <div
                  className="h-6 w-[6px] rounded-[4px]"
                  style={{ backgroundColor: themeColor }}
                />
                <span className="text-[16px] font-medium text-text-strong">
                  {milestone.title}
                </span>
              </button>
            ))
          ) : (
            <div className="p-2 text-center text-sm text-text-teritary">
              마일스톤이 없습니다.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
