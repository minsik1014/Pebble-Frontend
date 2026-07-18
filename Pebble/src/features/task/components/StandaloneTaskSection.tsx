import { type ScheduleItem } from "@/types";

type StandaloneTaskSectionProps = {
  tasks: ScheduleItem[];
  checkedItems: Record<string, boolean>;
  onToggleChecked: (itemId: string) => void;
  onEditTask: (taskId: string) => void;
};

const formatDisplayDate = (value: string) => {
  const isoMatch = value.match(/^\d{4}-(\d{1,2})-(\d{1,2})$/);

  if (!isoMatch) {
    return value;
  }

  const [, month, day] = isoMatch;
  return `${Number(month)}/${Number(day)}`;
};

export const StandaloneTaskSection = ({
  tasks,
  checkedItems,
  onToggleChecked,
  onEditTask,
}: StandaloneTaskSectionProps): JSX.Element => (
  <>
    {tasks.map((task) => {
      const dateLabel = task.end
        ? `${formatDisplayDate(task.start)} ~ ${formatDisplayDate(task.end)}`
        : formatDisplayDate(task.start);

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
                style={{ backgroundColor: task.accent }}
              />
              <span className="min-w-0 flex-1 truncate text-title-02-sb text-text-strong">
                {task.title}
              </span>
            </div>

            <div className="flex shrink-0 items-center justify-end gap-2">
              <span className="whitespace-nowrap text-body-02-m text-text-teritary">
                {dateLabel}
              </span>
              <span className="relative inline-flex h-6 w-6 items-center justify-center">
                <input
                  type="checkbox"
                  aria-label={`${task.title} 일정 완료`}
                  checked={Boolean(checkedItems[task.id])}
                  onClick={(event) => event.stopPropagation()}
                  onChange={(event) => {
                    event.stopPropagation();
                    onToggleChecked(task.id);
                  }}
                  className="peer absolute inset-0 h-full w-full cursor-pointer opacity-0"
                />
                <span className="relative h-6 w-6 rounded border border-border-default bg-fill-inverse peer-checked:border-fill-primary peer-checked:bg-fill-primary" />
              </span>
            </div>
          </button>
        </section>
      );
    })}
  </>
);
