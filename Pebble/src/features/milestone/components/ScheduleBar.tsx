import { type CalendarEvent } from "./types";

type ScheduleBarProps = {
  event: CalendarEvent;
};

export const ScheduleBar = ({ event }: ScheduleBarProps) => {
  return (
    <div
      className={`absolute ${event.leftClass} ${event.topClass} ${event.widthClass} flex items-center gap-2 overflow-hidden rounded-[4px] ${event.bgClass} px-3 py-1 shadow-shadow-s pointer-events-auto`}
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
