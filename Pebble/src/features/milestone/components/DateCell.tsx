import React from "react";
import { type CalendarDay } from "./types";

type DateCellProps = {
  day: CalendarDay;
  columnIndex: number;
  isSelected: boolean;
};

const getDayTextClass = (
  columnIndex: number,
  monthOffset: CalendarDay["monthOffset"],
  isSelected: boolean,
) => {
  if (isSelected) {
    return "text-text-onFill";
  }

  if (monthOffset === -1 || monthOffset === 1) {
    if (columnIndex === 0) return "text-fill-danger opacity-50";
    if (columnIndex === 6) return "text-text-saturday opacity-50";
    return "text-text-quaternary";
  }

  if (columnIndex === 0) return "text-fill-danger";
  if (columnIndex === 6) return "text-fill-info";
  return "text-text-strong";
};

export const DateCell = ({ day, columnIndex, isSelected }: DateCellProps) => {
  return (
    <div
      className="relative flex-1 grow self-stretch"
      role="gridcell"
      aria-selected={isSelected}
    >
      {isSelected ? (
        <div className="relative left-[3px] top-1.5 flex h-8 w-8 flex-col items-center justify-center rounded-[16px] bg-fill-primary">
          <span className="text-body-01-sb text-text-onFill">
            {day.day}
          </span>
        </div>
      ) : (
        <div
          className={`absolute left-2 top-2 text-body-01-sb ${getDayTextClass(
            columnIndex,
            day.monthOffset,
            false
          )}`}
        >
          {day.day}
        </div>
      )}
    </div>
  );
};
