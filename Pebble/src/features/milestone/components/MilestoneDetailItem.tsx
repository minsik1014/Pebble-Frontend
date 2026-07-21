import ChevronDownIcon from "@/assets/icons/chevron-down.svg?react";
import EditIcon from "@/assets/icons/newedit.svg?react";
import { AddButton } from "@/components/ui/AddButton";
import { TaskDetailRow } from "@/features/task/components/TaskDetailRow";
import { type ScheduleItem } from "@/types";

type MilestoneDetailItemProps = {
  item: ScheduleItem & { tasks?: ScheduleItem[] };
  themeMidColor: string;
  themeLightColor: string;
  themeTextOnMidColor: string;
  themeTextOnLightColor: string;
  isExpanded: boolean;
  onToggle: () => void;
  onEdit?: () => void;
  onAddTask?: () => void;
  onEditTask?: (taskId: string) => void;
};

const formatDisplayDate = (value: string) => {
  const isoMatch = value.match(/^\d{4}-(\d{1,2})-(\d{1,2})$/);

  if (!isoMatch) {
    return value;
  }

  const [, month, day] = isoMatch;
  return `${Number(month)}/${Number(day)}`;
};

export const MilestoneDetailItem = ({
  item,
  themeMidColor,
  themeLightColor,
  themeTextOnMidColor,
  themeTextOnLightColor,
  isExpanded,
  onToggle,
  onEdit,
  onAddTask,
  onEditTask,
}: MilestoneDetailItemProps) => {
  return (
    <div className="w-full bg-fill-inverse rounded-[20px] shadow-[0px_0px_14px_0px_rgba(23,23,23,0.05)] flex flex-col overflow-hidden">
      <div 
        className="w-full pl-5 pr-3 py-3 flex justify-between items-center bg-fill-inverse hover:bg-fill-surface transition-colors cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-center gap-3 w-56">
          <div
            className="w-2 h-10 rounded-sm"
            style={{ backgroundColor: themeMidColor }}
          />
          <span
            className="text-title-03-sb truncate"
            style={{ color: themeTextOnMidColor }}
          >
            {item.title}
          </span>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center">
            <span
              className="text-body-02-m"
              style={{ color: themeTextOnMidColor }}
            >
              {formatDisplayDate(item.start)}
            </span>
            {item.end && (
              <>
                <span
                  className="mx-1 text-body-02-m"
                  style={{ color: themeTextOnMidColor }}
                >
                  ~
                </span>
                <span
                  className="text-body-02-m"
                  style={{ color: themeTextOnMidColor }}
                >
                  {formatDisplayDate(item.end)}
                </span>
              </>
            )}
          </div>
          <div className="w-6 h-6 rounded-token-xs border border-border-default flex-shrink-0" />
          <button 
            className="w-11 h-11 flex items-center justify-center rounded-token-s hover:bg-fill-surface transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onEdit?.();
            }}
          >
            <EditIcon className="w-6 h-6 text-border-default" />
          </button>
          <button 
            className="w-11 h-11 flex items-center justify-center rounded-token-s hover:bg-fill-surface transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggle();
            }}
          >
            <ChevronDownIcon className={`w-6 h-6 text-text-secondary transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="w-full flex flex-col items-center">
          {item.tasks && item.tasks.length > 0 && (
            <div className="w-full pl-8 pr-3 flex flex-col justify-center items-end gap-2">
              {item.tasks.map((task) => (
                <TaskDetailRow 
                  key={task.id} 
                  task={task} 
                  themeLightColor={themeLightColor} 
                  themeTextColor={themeTextOnLightColor}
                  onEdit={() => onEditTask?.(task.id)}
                />
              ))}
            </div>
          )}
          <div className="w-full px-5 py-3 flex flex-col justify-start items-start gap-2.5">
            <AddButton 
              label="태스크 추가하기" 
              variant="secondary" 
              className="w-[740px]" 
              onClick={onAddTask}
            />
          </div>
        </div>
      )}
    </div>
  );
};
