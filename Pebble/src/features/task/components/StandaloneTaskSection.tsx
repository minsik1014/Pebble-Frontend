import { type TaskItem } from "@/types";
import { SidebarScheduleCheckbox } from "@/features/calendar/components/sidebar/SidebarScheduleCheckbox";
import { isTaskCompleted } from "@/features/task/utils/taskCompletion";
import { formatScheduleDisplayLabel } from "@/utils/scheduleDate";

type StandaloneTaskSectionProps = {
  tasks: TaskItem[];
  onToggleTaskCompleted?: (taskId: string) => void | Promise<void>;
  onEditTask: (taskId: string) => void;
};

export const StandaloneTaskSection = ({
  tasks,
  onToggleTaskCompleted,
  onEditTask,
}: StandaloneTaskSectionProps): JSX.Element => (
  <>
    {tasks.map((task) => {
      const dateLabel = formatScheduleDisplayLabel(task);
      const accentColor = task.accent ?? "#171717";

      return (
        <section
          key={task.id}
          className="flex w-[352px] shrink-0 flex-col overflow-hidden rounded-[20px] bg-fill-inverse shadow-shadow-s"
        >
          <button
            type="button"
            className="flex w-full items-center justify-between gap-3 rounded-[20px] bg-fill-inverse py-3 pl-5 pr-3 text-left transition-colors hover:bg-fill-surface"
            onClick={() => onEditTask(task.id)}
          >
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <div
                className="h-10 w-2 shrink-0 rounded"
                style={{ backgroundColor: accentColor }}
              />
              <span className="min-w-0 flex-1 truncate text-title-03-sb text-text-strong">
                {task.title}
              </span>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                {dateLabel}
              </span>
              <SidebarScheduleCheckbox
                checked={isTaskCompleted(task)}
                ariaLabel={`${task.title} 일정 완료`}
                onChange={() => onToggleTaskCompleted?.(task.id)}
                stopPropagation
              />
            </div>
          </button>
        </section>
      );
    })}
  </>
);
