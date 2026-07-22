import type { TaskItem } from "@/types";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type MyCategoryTaskItemProps = {
  task: TaskItem;
  color: string;
};

export const MyCategoryTaskItem = ({
  task,
  color,
}: MyCategoryTaskItemProps): JSX.Element => {
  return (
    <div className="flex h-11 w-full items-center gap-3 pl-3 pr-4">
      <span
        className="h-8 w-2 shrink-0 rounded-token-xs"
        style={{ backgroundColor: color }}
        aria-hidden="true"
      />
      <span className="min-w-0 flex-1 truncate text-body-02-m text-text-primary">
        {task.title}
      </span>
      <time className="shrink-0 text-body-03-r text-text-teritary">
        {formatScheduleDisplayLabel(task)}
      </time>
      <span
        className="size-6 shrink-0 rounded-token-xs border border-border-default bg-fill-inverse"
        aria-hidden="true"
      />
    </div>
  );
};
