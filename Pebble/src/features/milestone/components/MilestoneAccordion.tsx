import React, { useState } from "react";
import { type Category } from "@/features/milestone/constants";
import ChevronUpIcon from "@/assets/icons/chevron-up.svg?react";
import EyeOnIcon from "@/assets/icons/eye-on.svg?react";
import EyeOffIcon from "@/assets/icons/eye-off.svg?react";
import { TaskListItem } from "@/features/task/components/TaskListItem";
import { AddButton } from "@/components/ui/AddButton";

type MilestoneAccordionProps = {
  category: Category;
  expanded: boolean;
  onToggleExpanded: () => void;
  checkedItems: Record<string, boolean>;
  onToggleChecked: (itemId: string) => void;
  onSelectCategory?: (categoryId: string) => void;
};

export const MilestoneAccordion = ({
  category,
  expanded,
  onToggleExpanded,
  checkedItems,
  onToggleChecked,
  onSelectCategory,
}: MilestoneAccordionProps) => {
  const [visible, setVisible] = useState(true);

  return (
    <section className="w-[352px] shrink-0 flex flex-col items-center justify-center relative bg-fill-inverse rounded-[20px] shadow-shadow-s overflow-hidden">
      <div 
        className="flex w-full items-center justify-between pl-5 pr-3 py-3 relative bg-fill-inverse rounded-[20px] overflow-hidden cursor-pointer hover:bg-fill-surface transition-colors"
        onClick={() => onSelectCategory?.(category.id)}
      >
        <div className="flex items-center gap-3 relative">
          <div
            className="relative w-2 h-10 rounded"
            style={{ backgroundColor: category.accent }}
          />
          <h2 className="text-title-02-sb text-text-strong">
            {category.title}
          </h2>
        </div>
        <div className="inline-flex items-center justify-end">
          <button
            type="button"
            aria-label={`${category.title} 접기`}
            aria-expanded={expanded}
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpanded();
            }}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface-hover transition-colors"
          >
            <ChevronUpIcon
              className={`w-6 h-6 text-text-secondary transition-transform ${
                expanded ? "" : "rotate-180"
              }`}
            />
          </button>
          <button
            type="button"
            aria-label={`${category.title} 보기`}
            onClick={(e) => {
              e.stopPropagation();
              setVisible(!visible);
            }}
            className="relative flex items-center justify-center w-11 h-11 rounded-token-s hover:bg-fill-surface-hover transition-colors"
          >
            {visible ? (
              <EyeOnIcon className="w-6 h-6 text-text-strong" />
            ) : (
              <EyeOffIcon className="w-6 h-6 text-text-strong" />
            )}
          </button>
        </div>
      </div>
      {expanded && (
        <div className="flex flex-col items-center gap-3 pt-0 pb-3 w-full relative">
          <div className="flex flex-col items-center justify-start gap-2 px-3 py-1 w-full max-h-[220px] overflow-y-auto custom-scrollbar">
            {category.items.map((item) => (
              <TaskListItem
                key={item.id}
                item={item}
                checked={Boolean(checkedItems[item.id])}
                onToggle={() => onToggleChecked(item.id)}
              />
            ))}
          </div>
          <AddButton 
            label="일정 추가하기" 
            variant="secondary" 
            className="w-[312px]" 
          />
        </div>
      )}
    </section>
  );
};
