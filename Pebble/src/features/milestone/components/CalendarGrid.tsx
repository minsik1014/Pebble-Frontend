import React from "react";
import { type CalendarWeek } from "./types";
import { DateCell } from "./DateCell";
import { ScheduleBar } from "./ScheduleBar";

type CalendarGridProps = {
  weeks: CalendarWeek[];
  currentYear: number;
  currentMonth: number;
  todayDate: Date;
};

const dayLabels = [
  { label: "일", textClass: "text-fill-danger" },
  { label: "월", textClass: "text-text-secondary" },
  { label: "화", textClass: "text-text-secondary" },
  { label: "수", textClass: "text-text-secondary" },
  { label: "목", textClass: "text-text-secondary" },
  { label: "금", textClass: "text-text-secondary" },
  { label: "토", textClass: "text-fill-info" },
];

export const CalendarGrid = ({ weeks, currentYear, currentMonth, todayDate }: CalendarGridProps) => {
  return (
    <div className="relative flex w-full flex-1 grow flex-col items-start gap-3 self-stretch">
      {/* 요일 헤더 */}
      <div
        aria-hidden="true"
        className="relative flex w-full flex-[0_0_auto] items-center self-stretch"
      >
        {dayLabels.map((day) => (
          <div key={day.label} className="relative h-[45px] flex-1 grow">
            <div className={`absolute left-2 top-2 text-body-01-m ${day.textClass}`}>
              {day.label}
            </div>
          </div>
        ))}
      </div>

      {/* 달력 그리드 */}
      <div className="relative flex w-full flex-1 grow flex-col items-start self-stretch">
        {weeks.map((week, weekIndex) => (
          <div
            key={`week-${weekIndex}`}
            className="relative flex w-full flex-1 grow items-center self-stretch"
            role="row"
          >
            {/* 각 일(Day) 셀 */}
            {week.days.map((day, dayIndex) => {
              const isSelected =
                currentYear === todayDate.getFullYear() &&
                currentMonth === todayDate.getMonth() + 1 &&
                day.day === todayDate.getDate() &&
                day.monthOffset === 0;

              return (
                <DateCell
                  key={`${weekIndex}-${dayIndex}-${day.day}`}
                  day={day}
                  columnIndex={dayIndex}
                  isSelected={isSelected}
                />
              );
            })}

            {/* 마일스톤(이벤트) 렌더링 */}
            {week.events?.map((event) => (
              <ScheduleBar key={event.id} event={event} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};
