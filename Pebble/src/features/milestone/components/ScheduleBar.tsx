import { type CalendarEvent } from "./types";

type ScheduleBarProps = {
  event: CalendarEvent;
};

export const ScheduleBar = ({ event }: ScheduleBarProps) => {
  return (
    <div
      className={`absolute flex items-center gap-2 overflow-hidden rounded-[4px] ${event.bgClass} px-3 py-1 shadow-shadow-s pointer-events-auto`}
      style={{
        left: `calc(${event.leftPercent}% + 4px)`,
        top: event.topOffset,
        width: `calc(${event.widthPercent}% - 8px)`,
      }}
    >
      <div className="flex-1 truncate text-body-03-r text-text-strong">
        {event.title}
      </div>
      <div
        className={`absolute bottom-[3px] left-0 top-[3px] w-1 rounded-[4px] ${event.accentClass}`}
      />
    </div>
  );
};
