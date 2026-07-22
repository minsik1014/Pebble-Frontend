import { useState } from "react";
import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import { MyCategoryTaskItem } from "@/features/mypage/components/MyCategoryTaskItem";
import type { MilestoneItem } from "@/types";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type MyCategoryMilestoneItemProps = {
  milestone: MilestoneItem;
  milestoneColor: string;
  taskColor: string;
  defaultExpanded?: boolean;
};

export const MyCategoryMilestoneItem = ({
  milestone,
  milestoneColor,
  taskColor,
  defaultExpanded = false,
}: MyCategoryMilestoneItemProps): JSX.Element => {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded);
  const hasTasks = Boolean(milestone.tasks?.length);

  return (
    <article className="overflow-hidden rounded-token-m bg-fill-inverse shadow-shadow-s">
      <button
        type="button"
        onClick={() => setIsExpanded((previous) => !previous)}
        className="flex h-14 w-full items-center gap-3 px-4 text-left transition-colors hover:bg-fill-surface"
        aria-expanded={isExpanded}
      >
        <span
          className="h-8 w-2 shrink-0 rounded-token-xs"
          style={{ backgroundColor: milestoneColor }}
          aria-hidden="true"
        />
        <strong className="min-w-0 flex-1 truncate text-title-03-sb text-text-strong">
          {milestone.title}
        </strong>
        <time className="shrink-0 text-body-03-r text-text-teritary">
          {formatScheduleDisplayLabel(milestone)}
        </time>
        <span
          className="size-6 shrink-0 rounded-token-xs border border-border-default bg-fill-inverse"
          aria-hidden="true"
        />
        <ChevronDownIcon
          className={`size-6 shrink-0 text-text-secondary transition-transform duration-200 ${
            isExpanded ? "rotate-180" : ""
          }`}
        />
      </button>

      {isExpanded && hasTasks && (
        <div className="px-4 pb-3 pl-7">
          {milestone.tasks?.map((task) => (
            <MyCategoryTaskItem key={task.id} task={task} color={taskColor} />
          ))}
          <button
            type="button"
            disabled
            className="mt-2 h-10 w-full rounded-token-s bg-btn-quaternary text-body-02-m text-text-secondary"
          >
            태스크 추가하기
          </button>
        </div>
      )}
    </article>
  );
};
